import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { floors } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

export async function POST(
  req: NextRequest,
  { params }: { params: { floorId: string } },
) {
  try {
    const { floorId } = await params;
    const formData = await req.formData();
    const file = formData.get("bundle") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public/uploads/bundles");

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `bundle-${uniqueSuffix}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/bundles/${filename}`;

    const [updatedFloor] = await db
      .update(floors)
      .set({
        assetBundleUrl: fileUrl,
        assetVersion: sql`${floors.assetVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(floors.id, floorId))
      .returning();

    return NextResponse.json(updatedFloor);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload asset bundle" },
      { status: 500 },
    );
  }
}
