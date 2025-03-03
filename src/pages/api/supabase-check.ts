
import type { NextApiRequest, NextApiResponse } from "next";
import { checkSupabaseConnection } from "@/services/supabaseService";

type ResponseData = {
  connected: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests for security
  if (req.method !== "GET") {
    return res.status(405).json({ 
      connected: false, 
      error: "Method not allowed. Use GET." 
    });
  }
  
  try {
    const isConnected = await checkSupabaseConnection();
    
    return res.status(200).json({
      connected: isConnected,
      error: isConnected ? undefined : "Failed to connect to Supabase database."
    });
  } catch (error) {
    console.error("Error checking Supabase connection:", error);
    return res.status(500).json({
      connected: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
