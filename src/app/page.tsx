import { prisma } from "@/lib/prisma";
import { INQUIRY_STATUS_LABELS, PRIORITY_LABELS } from "@/lib/labels";
import type { Prisma } from "@/generated/prisma/client";
import { InquiryStatus } from "@/generated/prisma/enums";
import { StatusFilter } from "@/components/status-filter";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";

const STATUS_VALUES = Object.values(InquiryStatus);

const PER_PAGE = 20;

function parseStatus(value: string | string[] | undefined) {
	if (typeof value !== "string") return undefined;
	return STATUS_VALUES.find((s) => s === value);
}

function parsePage(value: string | string[] | undefined) {
	if (typeof value !== "string") return 1;
	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < 1) return 1;
	return parsed;
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const status = parseStatus(params.status);
	const q = typeof params.q === "string" ? params.q.trim() : "";

	const page = parsePage(params.page);

	const where: Prisma.InquiryWhereInput = {
		...(status ? { status } : {}),
		...(q
			? {
					OR: [
						{ title: { contains: q, mode: "insensitive" } },
						{ customer: { name: { contains: q, mode: "insensitive" } } },
					],
				}
			: {}),
	};

	const [inquiries, total] = await Promise.all([
		prisma.inquiry.findMany({
			where,
			include: { customer: true, assignee: true },
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * PER_PAGE,
			take: PER_PAGE,
		}),
		prisma.inquiry.count({ where }),
	]);

	const totalPages = Math.ceil(total / PER_PAGE);

	return (
		<main className="p-8">
			<h1 className="mb-6 text-2xl font-bold">問い合わせ一覧</h1>

			<div className="mb-4 flex gap-4">
				<SearchInput />
				<StatusFilter />
			</div>

			<p className="mb-4 text-sm">
				{total}件中 {total === 0 ? 0 : (page - 1) * PER_PAGE + 1}〜
				{Math.min(page * PER_PAGE, total)}件
			</p>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b">
						<th className="p-2 text-left">件名</th>
						<th className="p-2 text-left">顧客</th>
						<th className="p-2 text-left">ステータス</th>
						<th className="p-2 text-left">優先度</th>
						<th className="p-2 text-left">担当者</th>
						<th className="p-2 text-left">受信日時</th>
					</tr>
				</thead>
				<tbody>
					{inquiries.map((inquiry) => (
						<tr key={inquiry.id} className="border-b">
							<td className="p-2">{inquiry.title}</td>
							<td className="p-2">{inquiry.customer.name}</td>
							<td className="p-2">{INQUIRY_STATUS_LABELS[inquiry.status]}</td>
							<td className="p-2">{PRIORITY_LABELS[inquiry.priority]}</td>
							<td className="p-2">{inquiry.assignee?.name ?? "未割当"}</td>
							<td className="p-2">
								{inquiry.createdAt.toLocaleDateString("ja-JP")}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination page={page} totalPages={totalPages} />
		</main>
	);
}
