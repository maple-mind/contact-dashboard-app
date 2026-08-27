import { prisma } from "@/lib/prisma";
import { INQUIRY_STATUS_LABELS, PRIORITY_LABELS } from "@/lib/labels";
import { SortHeader } from "@/components/sort-header";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import type { InquiryStatus } from "@/generated/prisma/enums";

const PER_PAGE = 20;

export async function InquiryTable({
	status,
	q,
	page,
	sort,
	order,
}: {
	status: InquiryStatus | undefined;
	q: string;
	page: number;
	sort: string;
	order: "asc" | "desc";
}) {
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
			orderBy: { [sort]: order },
			skip: (page - 1) * PER_PAGE,
			take: PER_PAGE,
		}),
		prisma.inquiry.count({ where }),
	]);

	const totalPages = Math.ceil(total / PER_PAGE);
	const hasFilter = Boolean(status || q);
	const isOutOfRange = total > 0 && page > totalPages;

	if (total === 0) {
		return <EmptyState hasFilter={hasFilter} />;
	}

	if (isOutOfRange) {
		return (
			<div className="rounded border border-dashed p-12 text-center">
				<p className="mb-4 font-medium">このページは存在しません</p>
				<Link href="/" className="text-sm underline">
					1ページ目に戻る
				</Link>
			</div>
		);
	}

	return (
		<>
			<p className="mb-4 text-sm">
				{total}件中 {(page - 1) * PER_PAGE + 1}〜
				{Math.min(page * PER_PAGE, total)}件
			</p>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b">
						<SortHeader field="title">件名</SortHeader>
						<th className="p-2 text-left">顧客</th>
						<SortHeader field="status">ステータス</SortHeader>
						<SortHeader field="priority">優先度</SortHeader>
						<th className="p-2 text-left">担当者</th>
						<SortHeader field="createdAt">受信日時</SortHeader>
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
		</>
	);
}
