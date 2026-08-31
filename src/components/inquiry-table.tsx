import { prisma } from "@/lib/prisma";
import { SortHeader } from "@/components/sort-header";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import type { InquiryStatus } from "@/generated/prisma/enums";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	INQUIRY_STATUS_LABELS,
	INQUIRY_STATUS_VARIANTS,
	PRIORITY_LABELS,
} from "@/lib/labels";

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

			<Table>
				<TableHeader>
					<TableRow>
						<SortHeader field="title">件名</SortHeader>
						<TableHead>顧客</TableHead>
						<SortHeader field="status">ステータス</SortHeader>
						<SortHeader field="priority">優先度</SortHeader>
						<TableHead>担当者</TableHead>
						<SortHeader field="createdAt">受信日時</SortHeader>
					</TableRow>
				</TableHeader>
				<TableBody>
					{inquiries.map((inquiry) => (
						<TableRow key={inquiry.id}>
							<TableCell>
								<Link
									href={`/inquiries/${inquiry.id}`}
									className="hover:underline"
								>
									{inquiry.title}
								</Link>
							</TableCell>
							<TableCell>{inquiry.customer.name}</TableCell>
							<TableCell>
								<Badge variant={INQUIRY_STATUS_VARIANTS[inquiry.status]}>
									{INQUIRY_STATUS_LABELS[inquiry.status]}
								</Badge>
							</TableCell>
							<TableCell
								className={
									inquiry.priority === "HIGH"
										? "text-destructive font-medium"
										: ""
								}
							>
								{PRIORITY_LABELS[inquiry.priority]}
							</TableCell>
							<TableCell>
								{inquiry.assignee?.name ?? (
									<span className="text-muted-foreground">未割当</span>
								)}
							</TableCell>
							<TableCell>
								{inquiry.createdAt.toLocaleDateString("ja-JP")}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Pagination page={page} totalPages={totalPages} />
		</>
	);
}
