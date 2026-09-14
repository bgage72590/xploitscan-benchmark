Deno.serve(async (req) => {
  const auth = req.headers.get("Authorization");
  const { data } = await supabase.from("orders").select("*");
  return new Response(JSON.stringify(data));
});
