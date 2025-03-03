
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/services/supabaseService";

type ResponseData = {
  success: boolean;
  message: string;
  tables?: string[];
  error?: string;
};

interface TableRecord {
  table_name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests for security
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed. Use POST." 
    });
  }
  
  // Check for secret key to prevent unauthorized access
  const { secret } = req.body;
  
  if (!secret || secret !== process.env.SETUP_SECRET_KEY) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized. Invalid or missing secret key." 
    });
  }
  
  try {
    // Create prompt_logs table
    const promptLogsResult = await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS prompt_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          original_prompt TEXT NOT NULL,
          enhanced_prompt TEXT NOT NULL,
          provider TEXT NOT NULL CHECK (provider IN ('perplexity', 'openai', 'anthropic')),
          article_count INTEGER NOT NULL DEFAULT 0,
          status TEXT NOT NULL CHECK (status IN ('success', 'error')),
          error_message TEXT
        );
        
        -- Create index for faster queries
        CREATE INDEX IF NOT EXISTS idx_prompt_logs_timestamp ON prompt_logs(timestamp);
        CREATE INDEX IF NOT EXISTS idx_prompt_logs_provider ON prompt_logs(provider);
      `
    });
    
    if (promptLogsResult.error) {
      throw new Error(`Failed to create prompt_logs table: ${promptLogsResult.error.message}`);
    }
    
    // Create helper functions for table management
    const helperFunctionsResult = await supabase.rpc("execute_sql", {
      sql: `
        -- Function to check if a table exists
        CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT)
        RETURNS BOOLEAN AS $$
        DECLARE
          table_exists BOOLEAN;
        BEGIN
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = check_table_exists.table_name
          ) INTO table_exists;
          
          RETURN table_exists;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Function to check if columns exist in a table
        CREATE OR REPLACE FUNCTION check_table_columns(
          table_name TEXT,
          required_columns TEXT[]
        )
        RETURNS JSON AS $$
        DECLARE
          existing_columns TEXT[];
          missing_columns TEXT[];
        BEGIN
          -- Get existing columns
          SELECT array_agg(column_name::TEXT)
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = check_table_columns.table_name
          INTO existing_columns;
          
          -- Find missing columns
          SELECT array_agg(col)
          FROM unnest(required_columns) AS col
          WHERE col <> ALL(existing_columns)
          INTO missing_columns;
          
          -- Return result as JSON
          RETURN json_build_object(
            'existing_columns', existing_columns,
            'missing_columns', missing_columns
          );
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Function to add a column to a table
        CREATE OR REPLACE FUNCTION add_column_to_table(
          table_name TEXT,
          column_name TEXT,
          column_definition TEXT
        )
        RETURNS VOID AS $$
        BEGIN
          EXECUTE format(
            'ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I %s',
            table_name,
            column_name,
            column_definition
          );
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Function to execute arbitrary SQL (use with caution)
        CREATE OR REPLACE FUNCTION execute_sql(sql TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (helperFunctionsResult.error) {
      throw new Error(`Failed to create helper functions: ${helperFunctionsResult.error.message}`);
    }
    
    // Get list of tables to confirm setup
    const { data: tables, error: tablesError } = await supabase.from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");
    
    if (tablesError) {
      throw new Error(`Failed to get table list: ${tablesError.message}`);
    }
    
    const tableNames = tables?.map((t: TableRecord) => t.table_name) || [];
    
    return res.status(200).json({
      success: true,
      message: "Database setup completed successfully.",
      tables: tableNames
    });
    
  } catch (error) {
    console.error("Error in supabase-setup:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to set up database.",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
