import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./lib/supabase";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk as Buffer));
    }
    const body = Buffer.concat(chunks);

    const boundary = req.headers["content-type"]?.split("boundary=")[1];
    if (!boundary) {
      return res.status(400).json({ error: "No boundary found" });
    }

    const parts = body.toString("binary").split(`--${boundary}`);
    const filePart = parts.find((p) => p.includes("filename="));

    if (!filePart) {
      return res.status(400).json({ error: "No file found" });
    }

    const filenameMatch = filePart.match(/filename="(.+?)"/);
    const filename = filenameMatch ? filenameMatch[1] : "upload.png";
    const ext = filename.split(".").pop() || "png";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const headerEnd = filePart.indexOf("\r\n\r\n") + 4;
    const fileEnd = filePart.lastIndexOf("\r\n");
    const fileData = Buffer.from(filePart.slice(headerEnd, fileEnd), "binary");

    const { error } = await supabase.storage
      .from("images")
      .upload(uniqueName, fileData, {
        contentType: `image/${ext}`,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(uniqueName);

    return res.status(200).json({ url: urlData.publicUrl });
  } catch (err) {
    return res.status(500).json({ error: "Upload failed" });
  }
}
