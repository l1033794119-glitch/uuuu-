// 轮盘抽奖逻辑
// 奖品：
//   50off   — 5折购机券    5%
//   90off   — 9折购机券    10%
//   subsidy — 以旧换新补贴 $100  3%
//   iphone  — 免费 iPhone 18 Pro（8 次必中）
//   none    — 谢谢参与    50%
//
// "8 次必中"：维护 iphoneStreak（连续未中 iphone 的次数），
// 当 streak >= 7 时下一次强制中 iphone，随后归零。

export type PrizeKey =
  | "50off"
  | "90off"
  | "subsidy"
  | "iphone"
  | "none";

// 普通权重（不包含 iphone 的必中保底，iphone 给一个基础权重 32%，
// 让整体分布合理，再叠加 8 次必中的硬保证）
export const PRIZE_WEIGHTS: { key: PrizeKey; weight: number }[] = [
  { key: "50off", weight: 5 },
  { key: "90off", weight: 10 },
  { key: "subsidy", weight: 3 },
  { key: "none", weight: 50 },
  { key: "iphone", weight: 32 },
];

const TOTAL = PRIZE_WEIGHTS.reduce((s, p) => s + p.weight, 0); // 100

// 连续多少次未中 iphone 后，下一次必中
export const IPHONE_GUARANTEE = 8;

/**
 * 执行一次抽奖
 * @param iphoneStreak 该用户当前连续未中 iphone 的次数
 * @param drawsUsed 该用户已使用的抽奖次数（前 5 次强制谢谢参与）
 * @returns { prize, nextStreak }
 */
export function drawPrize(
  iphoneStreak: number,
  drawsUsed: number
): {
  prize: PrizeKey;
  nextStreak: number;
} {
  // 前 5 次抽奖强制返回"谢谢参与"
  if (drawsUsed < 5) {
    return { prize: "none", nextStreak: iphoneStreak + 1 };
  }

  // 8 次必中硬保证：streak 已达 IPHONE_GUARANTEE - 1 则强制中 iphone
  if (iphoneStreak >= IPHONE_GUARANTEE - 1) {
    return { prize: "iphone", nextStreak: 0 };
  }

  const r = Math.random() * TOTAL;
  let acc = 0;
  let prize: PrizeKey = "none";
  for (const p of PRIZE_WEIGHTS) {
    acc += p.weight;
    if (r < acc) {
      prize = p.key;
      break;
    }
  }

  const nextStreak = prize === "iphone" ? 0 : iphoneStreak + 1;
  return { prize, nextStreak };
}

export function prizeLabelKey(prize: PrizeKey): string {
  switch (prize) {
    case "50off":
      return "prize50off";
    case "90off":
      return "prize90off";
    case "subsidy":
      return "prizeSubsidy";
    case "iphone":
      return "prizeIphone";
    default:
      return "";
  }
}

export function isWin(prize: PrizeKey): boolean {
  return prize !== "none";
}

// 轮盘渲染用：扇区顺序（按视觉排布）
export const WHEEL_SECTORS: PrizeKey[] = [
  "iphone",
  "50off",
  "none",
  "90off",
  "subsidy",
  "none",
  "iphone",
  "none",
];
