import type { VercelRequest } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "jieun93.h@gmail.com";

export async function verifyAdmin(req: VercelRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return false;

  return user.email === ADMIN_EMAIL;
}
