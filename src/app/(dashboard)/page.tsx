import { Suspense } from "react";
import { StatusFilter } from "@/components/status-filter";
import { SearchInput } from "@/components/search-input";
import { InquiryTable } from "@/components/inquiry-table";
import { TableSkeleton, SummarySkeleton } from "@/components/table-skeleton";
import { requireSession } from "@/lib/session";
import { StatusSummary } from "@/components/status-summary";
import { parseListParams } from "@/lib/inquiry-params";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const session = await requireSession();

	const { status, q, page, sort, order } = parseListParams(await searchParams);

	return (
		<>
			<div className="mb-6">
				<h1 className="text-2xl font-bold">問い合わせ一覧</h1>
				{session.user.role !== "ADMIN" && (
					<p className="text-muted-foreground mt-1 text-sm">
						自分が担当している問い合わせのみ表示しています
					</p>
				)}
			</div>

			<Suspense fallback={<SummarySkeleton />}>
				<StatusSummary activeStatus={status} q={q} sort={sort} order={order} />
			</Suspense>

			<div className="mb-4 flex flex-wrap gap-4">
				<SearchInput />
				<StatusFilter />
			</div>

			<Suspense
				key={`${status}-${q}-${page}-${sort}-${order}-${session.user.role}`}
				fallback={<TableSkeleton />}
			>
				<InquiryTable
					status={status}
					q={q}
					page={page}
					sort={sort}
					order={order}
					isAdmin={session.user.role === "ADMIN"}
				/>
			</Suspense>
		</>
	);
}
