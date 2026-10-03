import { Suspense } from "react";
import { InquiryStatus, type Role } from "@/generated/prisma/enums";
import { StatusFilter } from "@/components/status-filter";
import { SearchInput } from "@/components/search-input";
import { InquiryTable } from "@/components/inquiry-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { requireSession } from "@/lib/session";
import { SignOutButton } from "@/components/sign-out-button";
import { ROLE_LABELS } from "@/lib/labels";

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
		<>
			<a
				href="#main-content"
				className="bg-background fixed top-2 left-2 z-50 -translate-y-[200%] rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:translate-y-0"
			>
				本文へスキップ
			</a>

			<header className="border-b">
				<div className="mx-auto flex w-full max-w-[1200px] items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-8">
					<span className="text-muted-foreground text-sm">
						{session.user.name}（{ROLE_LABELS[session.user.role as Role]}）
					</span>
					<SignOutButton />
				</div>
			</header>

			<main
				id="main-content"
				tabIndex={-1}
				className="mx-auto w-full max-w-[1200px] p-4 outline-none sm:p-6 lg:p-8"
			>
				<div className="mb-6">
					<h1 className="text-2xl font-bold">問い合わせ一覧</h1>
					{session.user.role !== "ADMIN" && (
						<p className="text-muted-foreground mt-1 text-sm">
							自分が担当している問い合わせのみ表示しています
						</p>
					)}
				</div>

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
			</main>
		</>
	);
}
