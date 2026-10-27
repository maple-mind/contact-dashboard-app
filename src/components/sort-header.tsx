"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { TableHead } from "./ui/table";
import {
	DEFAULT_SORT_ORDERS,
	parseOrder,
	parseSort,
	type SortField,
} from "@/lib/inquiry-params";
import { SORT_ORDER_LABELS } from "@/lib/labels";

export function SortHeader({
	field,
	children,
}: {
	field: SortField;
	children: React.ReactNode;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentSort = parseSort(searchParams.get("sort") ?? undefined);
	const currentOrder = parseOrder(searchParams.get("order") ?? undefined);
	const isActive = currentSort === field;

	const nextOrder = isActive
		? currentOrder === "desc"
			? "asc"
			: "desc"
		: DEFAULT_SORT_ORDERS[field];

	function handleClick() {
		const params = new URLSearchParams(searchParams);
		params.set("sort", field);
		params.set("order", nextOrder);
		params.delete("page");
		router.push(`/?${params.toString()}`);
	}

	return (
		<TableHead
			aria-sort={
				isActive
					? currentOrder === "desc"
						? "descending"
						: "ascending"
					: "none"
			}
			className="p-2 text-left"
		>
			<button
				type="button"
				onClick={handleClick}
				title={`${SORT_ORDER_LABELS[field][nextOrder]}に並べ替え`}
				className="group hover:bg-muted -mx-1 flex items-center gap-1 rounded px-1 py-0.5"
			>
				{children}
				{isActive ? (
					currentOrder === "desc" ? (
						<ArrowDown className="size-3.5" />
					) : (
						<ArrowUp className="size-3.5" />
					)
				) : (
					<ChevronsUpDown className="text-muted-foreground/50 group-hover:text-muted-foreground size-3.5" />
				)}
			</button>
		</TableHead>
	);
}
