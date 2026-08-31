"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TableHead } from "./ui/table";

export function SortHeader({
	field,
	children,
}: {
	field: string;
	children: React.ReactNode;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentSort = searchParams.get("sort") ?? "createdAt";
	const currentOrder = searchParams.get("order") ?? "desc";
	const isActive = currentSort === field;

	function handleClick() {
		const params = new URLSearchParams(searchParams);
		params.set("sort", field);
		params.set("order", isActive && currentOrder === "desc" ? "asc" : "desc");
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
				className="flex items-center gap-1 hover:underline"
			>
				{children}
				{isActive &&
					(currentOrder === "desc" ? (
						<ChevronDown className="size-3.5" />
					) : (
						<ChevronUp className="size-3.5" />
					))}
			</button>
		</TableHead>
	);
}
