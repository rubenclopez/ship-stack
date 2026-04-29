import dotenv from "dotenv";

dotenv.config()

export const env = {
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
  port: process.env.PORT || 3001
}