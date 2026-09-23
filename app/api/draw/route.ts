import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { drawPrize, isWin, type PrizeKey } from "@/lib/prize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OkBody = { ok: true; prize: PrizeKey; won: boolean; drawsLeft: number };
type ErrBody = { ok: false; code: string };

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid" } satisfies ErrBody, {
      status: 400,
    });
  }

  const { phone } = json as { phone?: string };
  if (!phone || typeof phone !== "string") {
    return NextResponse.json({ ok: false, code: "invalid" } satisfies ErrBody, {
      status: 400,
    });
  }

  try {
    const user = await prisma.registration.findFirst({
      where: { phone },
      select: { id: true, drawsUsed: true, drawsMax: true, iphoneStreak: true },
    });
    if (!user) {
      return NextResponse.json({ ok: false, code: "not_found" } satisfies ErrBody, {
        status: 404,
      });
    }
    if (user.drawsUsed >= user.drawsMax) {
      return NextResponse.json({ ok: false, code: "no_draws" } satisfies ErrBody, {
        status: 429,
      });
    }

    const { prize, nextStreak } = drawPrize(user.iphoneStreak, user.drawsUsed);
    const won = isWin(prize);

    await prisma.$transaction([
      prisma.drawRecord.create({
        data: {
          registrationId: user.id,
          prize,
          won,
        },
      }),
      prisma.registration.update({
        where: { id: user.id },
        data: {
          drawsUsed: { increment: 1 },
          iphoneStreak: nextStreak,
        },
      }),
    ]);

    const drawsLeft = user.drawsMax - (user.drawsUsed + 1);

    return NextResponse.json(
      { ok: true, prize, won, drawsLeft } satisfies OkBody,
      { status: 200 }
    );
  } catch (err) {
    console.error("[draw] error", err);
    return NextResponse.json({ ok: false, code: "server" } satisfies ErrBody, {
      status: 500,
    });
  }
}
