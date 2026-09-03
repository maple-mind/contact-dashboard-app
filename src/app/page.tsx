import { Suspense } from "react";
import { InquiryStatus } from "@/generated/prisma/enums";
import { StatusFilter } from "@/components/status-filter";
import { SearchInput } from "@/components/search-input";
import { InquiryTable } from "@/components/inquiry-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { requireSession } from "@/lib/session";
import { SignOutButton } from "@/components/sign-out-button";

const STATUS_VALUES = Object.values(InquiryStatus);

const SORTABLE_FIELDS = ["createdAt", "title", "status", "priority"] as const;
type SortField = (typeof SORTABLE_FIELDS)[number];

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

function parseSort(value: string | string[] | undefined): SortField {
	if (typeof value !== "string") return "createdAt";
	return SORTABLE_FIELDS.find((f) => f === value) ?? "createdAt";
}

function parseOrder(value: string | string[] | undefined): "asc" | "desc" {
	return value === "asc" ? "asc" : "desc";
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const session = await requireSession();

	const params = await searchParams;
	const status = parseStatus(params.status);
	const q = typeof params.q === "string" ? params.q.trim() : "";
	const page = parsePage(params.page);
	const sort = parseSort(params.sort);
	const order = parseOrder(params.order);

	return (
		<main className="mx-auto w-full max-w-[1200px] p-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">問い合わせ一覧</h1>
				<div className="flex items-center gap-3">
					<span className="text-muted-foreground text-sm">
						{session.user.name}
					</span>
					<SignOutButton />
				</div>
			</div>

			<div className="mb-4 flex gap-4">
				<SearchInput />
				<StatusFilter />
			</div>

			<Suspense
				key={`${status}-${q}-${page}-${sort}-${order}`}
				fallback={<TableSkeleton />}
			>
				<InquiryTable
					status={status}
					q={q}
					page={page}
					sort={sort}
					order={order}
				/>
			</Suspense>
		</main>
	);
}
