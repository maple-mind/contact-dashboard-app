"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Pagination({
	page,
	totalPages,
}: {
	page: number;
	totalPages: number;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	function goTo(target: number) {
		const params = new URLSearchParams(searchParams);
		params.set("page", String(target));
		router.push(`/?${params.toString()}`);
	}

	if (totalPages <= 1) return null;

	return (
		<div className="mt-4 flex items-center justify-center gap-4">
			<button
				type="button"
				onClick={() => goTo(page - 1)}
				disabled={page <= 1}
				className="rounded border px-3 py-1 text-sm disabled:opacity-40"
			>
				前へ
			</button>
			<span className="text-sm">
				{page} / {totalPages}
			</span>
			<button
				type="button"
				onClick={() => goTo(page + 1)}
				disabled={page >= totalPages}
				className="rounded border px-3 py-1 text-sm disabled:opacity-40"
			>
				次へ
			</button>
		</div>
	);
}
