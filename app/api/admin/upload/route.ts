import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const maxSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large (max 500MB)" }, { status: 400 });
  }

  const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];
  if (!allowed.includes(file.type) && !file.name.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
    return NextResponse.json({ error: "Only video files are allowed" }, { status: 400 });
  }

  const blob = await put(`videos/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
