"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
		<th
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
				className="flex items-center gap-1 font-medium hover:underline"
			>
				{children}
				{isActive && (
					<span aria-hidden="true" className="text-xs leading-none">
						{currentOrder === "desc" ? "↓" : "↑"}
					</span>
				)}
			</button>
		</th>
	);
}
