import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: [".env.local", ".env"] });

const API_KEY = process.env.SUPABASE_API_KEY;
const URL = process.env.SUPABASE_URL;

if (!API_KEY || !URL) {
  console.error("Please set the SUPABASE environment variables");
  process.exit(1);
}

export const supabase = createClient(URL, API_KEY);
export const sDatabase = supabase.schema("onlinesh");
