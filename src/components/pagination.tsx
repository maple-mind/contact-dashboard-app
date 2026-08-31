"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

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
			<Button
				variant="outline"
				size="sm"
				onClick={() => goTo(page - 1)}
				disabled={page <= 1}
			>
				前へ
			</Button>
			<span className="text-sm">
				{page} / {totalPages}
			</span>
			<Button
				variant="outline"
				size="sm"
				onClick={() => goTo(page + 1)}
				disabled={page >= totalPages}
			>
				次へ
			</Button>
		</div>
	);
}
