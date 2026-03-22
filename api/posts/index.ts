import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/supabase";
import { verifyAdmin } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const { category, search } = req.query;

    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && typeof category === "string") {
      query = query.eq("category", category);
    }

    if (search && typeof search === "string") {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    if (!(await verifyAdmin(req))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ error: "title, content, category are required" });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("posts")
      .insert({ title, content, category, created_at: now, updated_at: now })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
