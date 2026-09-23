import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 6 + Turbopack 下，runtime 解析 SQLite 相对路径不稳定，
// 这里显式给绝对路径，确保 dev/prod 都能找到 dev.db。
// 上线时改 .env 的 DATABASE_URL 为 mysql: 连接串即可。
function resolveDbUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith("file:")) return envUrl; // mysql 等非 sqlite
  if (envUrl && envUrl.startsWith("file:/")) return envUrl; // 绝对路径
  return `file:${process.cwd()}/prisma/dev.db`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasourceUrl: resolveDbUrl(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
