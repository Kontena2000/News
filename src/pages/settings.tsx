
import Head from "next/head"
import { Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings - ZORK News Scraper</title>
        <meta name="description" content="Configure your news scraper settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure how the ZORK News Scraper collects and processes news
            </p>
          </div>
        </div>

        <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center text-center">
            <SettingsIcon className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Settings Page</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This page is under construction. Settings configuration will be available soon.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
