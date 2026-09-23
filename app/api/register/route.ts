import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OkBody = { ok: true; registrationId: number; drawsLeft: number };
type ErrBody = { ok: false; code: string; field?: string };

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid" } satisfies ErrBody, {
      status: 400,
    });
  }

  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const map: Record<string, string> = {
      name_required: "name",
      name_too_long: "name",
      email_invalid: "email",
      phone_invalid: "phone",
      address_required: "address",
      address_too_long: "address",
      zipcode_invalid: "zipcode",
      agree_required: "agree",
    };
    const code = map[first?.message ?? ""] ?? "invalid";
    return NextResponse.json(
      { ok: false, code, field: code } satisfies ErrBody,
      { status: 400 }
    );
  }

  const { name, email, phone, address, zipcode, language } = parsed.data;
  const lang: Lang = language;

  try {
    const existing = await prisma.registration.findFirst({
      where: { phone },
      select: { id: true, drawsUsed: true, drawsMax: true },
    });
    if (existing) {
      return NextResponse.json(
        {
          ok: true,
          registrationId: existing.id,
          drawsLeft: existing.drawsMax - existing.drawsUsed,
        } satisfies OkBody,
        { status: 200 }
      );
    }

    const record = await prisma.registration.create({
      data: {
        name,
        email,
        phone,
        address,
        zipcode,
        language: lang,
        drawsMax: 10,
        drawsUsed: 0,
        iphoneStreak: 0,
      },
      select: { id: true, drawsMax: true, drawsUsed: true },
    });

    return NextResponse.json(
      {
        ok: true,
        registrationId: record.id,
        drawsLeft: record.drawsMax - record.drawsUsed,
      } satisfies OkBody,
      { status: 200 }
    );
  } catch (err) {
    console.error("[register] error", err);
    return NextResponse.json({ ok: false, code: "server" } satisfies ErrBody, {
      status: 500,
    });
  }
}
