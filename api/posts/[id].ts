import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/supabase";
import { verifyAdmin } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Post not found" });
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    if (!(await verifyAdmin(req))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title, content, category } = req.body;

    const { data, error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    if (!(await verifyAdmin(req))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
