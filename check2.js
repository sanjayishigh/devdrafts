import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wxzvmmstrnpzbwnodtiz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4enZtbXN0cm5wemJ3bm9kdGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTQwNjYsImV4cCI6MjA5MDI3MDA2Nn0.zswTq_86dqSHz6TxBexxGpc43dPI-f1AXSrkSBd2YQI"
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
