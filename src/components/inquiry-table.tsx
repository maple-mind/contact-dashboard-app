import { SortHeader } from "@/components/sort-header";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import type { InquiryStatus } from "@/generated/prisma/enums";
import { getInquiries } from "@/data/inquiry";
import {
	Table,
	TableBody,
	TableCaption,
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
	SORT_FIELD_LABELS,
	SORT_ORDER_LABELS,
} from "@/lib/labels";
import {
	buildListQuery,
	type SortField,
	type SortOrder,
} from "@/lib/inquiry-params";

export async function InquiryTable({
	status,
	q,
	page,
	sort,
	order,
	isAdmin,
}: {
	status: InquiryStatus | undefined;
	q: string;
	page: number;
	sort: SortField;
	order: SortOrder;
	isAdmin: boolean;
}) {
	const { inquiries, total, totalPages, perPage } = await getInquiries({
		status,
		q,
		page,
		sort,
		order,
	});

	const hasFilter = Boolean(status || q);
	const isOutOfRange = total > 0 && page > totalPages;

	if (total === 0) {
		return <EmptyState hasFilter={hasFilter} isAdmin={isAdmin} />;
	}

	if (isOutOfRange) {
		return (
			<div className="rounded border border-dashed p-12 text-center">
				<p className="mb-4 font-medium">このページは存在しません</p>
				<Link
					href={`/${buildListQuery({ status, q, sort, order })}`}
					className="text-sm underline"
				>
					1ページ目に戻る
				</Link>
			</div>
		);
	}

	// 詳細ページから同じ絞り込み・ページの一覧に戻れるよう、一覧の状態を引き継ぐ
	const listQuery = buildListQuery({ status, q, page, sort, order });

	const rangeStart = (page - 1) * perPage + 1;
	const rangeEnd = Math.min(page * perPage, total);

	const conditions = [
		isAdmin ? null : "自分が担当している問い合わせのみ",
		status ? `ステータスは「${INQUIRY_STATUS_LABELS[status]}」` : null,
		q ? `検索キーワードは「${q}」` : null,
	].filter((condition) => condition !== null);

	const description =
		[
			conditions.length > 0
				? `絞り込み条件は${conditions.join("、")}`
				: "絞り込みなし",
			`並び順は${SORT_FIELD_LABELS[sort]}の${SORT_ORDER_LABELS[sort][order]}`,
			`全${total}件中${rangeStart}件目から${rangeEnd}件目を表示`,
			`全${totalPages}ページ中${page}ページ目`,
		].join("。") + "。";

	return (
		<>
			<p className="mb-4 flex flex-wrap gap-x-4 text-sm">
				<span aria-hidden="true">
					{total}件中 {rangeStart}〜{rangeEnd}件
				</span>
				<span aria-hidden="true" className="text-muted-foreground">
					並び順：{SORT_FIELD_LABELS[sort]}（{SORT_ORDER_LABELS[sort][order]}）
				</span>
				<span className="sr-only">{description}</span>
			</p>

			<Table>
				<TableCaption className="sr-only">問い合わせ一覧</TableCaption>
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
									href={`/inquiries/${inquiry.id}${listQuery}`}
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
