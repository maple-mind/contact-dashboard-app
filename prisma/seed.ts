import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
	connectionString: process.env.DIRECT_URL,
});
const prisma = new PrismaClient({ adapter });

const STATUSES = ["OPEN", "IN_PROGRESS", "PENDING", "CLOSED"] as const;
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

const TITLES = [
	"ログインできない",
	"請求書の再発行依頼",
	"CSVエクスポートが途中で止まる",
	"プラン変更の相談",
	"管理者権限の追加方法",
	"データの一括インポートについて",
	"通知メールが届かない",
	"APIのレート制限について",
	"契約更新の手続き",
	"画面表示が崩れる",
];

function pick<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

async function main() {
	await prisma.comment.deleteMany();
	await prisma.inquiry.deleteMany();
	await prisma.customer.deleteMany();
	await prisma.user.deleteMany();

	const USERS = [
		{ name: "佐藤 健一", email: "sato@example.com", role: "MEMBER" },
		{ name: "田中 美咲", email: "tanaka@example.com", role: "ADMIN" },
		{ name: "鈴木 陽介", email: "suzuki@example.com", role: "MEMBER" },
	] as const;

	const users = await Promise.all(
		USERS.map((data) => prisma.user.create({ data })),
	);

	const customers = await Promise.all(
		[
			"株式会社アオイ",
			"みどり商事",
			"ハルカ工業",
			"株式会社ソラ",
			"北山システム",
		].map((name) => prisma.customer.create({ data: { name } })),
	);

	const now = Date.now();

	for (let i = 0; i < 50; i++) {
		const assignee = Math.random() < 0.2 ? null : pick(users);

		const inquiry = await prisma.inquiry.create({
			data: {
				title: pick(TITLES),
				body: `発生日時: 昨日の午後\n影響範囲: 一部のユーザー\n\nご確認をお願いいたします。`,
				status: pick(STATUSES),
				priority: pick(PRIORITIES),
				createdAt: new Date(now - Math.floor(Math.random() * 30) * 86400000),
				customerId: pick(customers).id,
				assigneeId: assignee?.id ?? null,
			},
		});

		if (Math.random() < 0.5) {
			await prisma.comment.create({
				data: {
					body: "確認しました。担当部署に確認を依頼しています。",
					inquiryId: inquiry.id,
					authorId: pick(users).id,
				},
			});
		}
	}

	console.log("シードデータを投入しました");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
