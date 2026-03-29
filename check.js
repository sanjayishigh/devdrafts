import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function check() {
  console.log("Fetching post: jupyter-lab-setup");
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", "jupyter-lab-setup")
    .single();

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Data:", data);
}

check();
