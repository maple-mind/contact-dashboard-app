"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { InquiryStatus } from "@/generated/prisma/enums";
import { INQUIRY_STATUS_LABELS } from "@/lib/labels";

export function StatusFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const current = searchParams.get("status") ?? "";

	function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const params = new URLSearchParams(searchParams);

		if (event.target.value) {
			params.set("status", event.target.value);
		} else {
			params.delete("status");
		}

		router.push(`/?${params.toString()}`);
	}

	return (
		<div>
			<label htmlFor="status-filter" className="mr-2 text-sm">
				ステータス
			</label>
			<select
				id="status-filter"
				value={current}
				onChange={handleChange}
				className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
			>
				<option value="">すべて</option>
				{Object.values(InquiryStatus).map((status) => (
					<option key={status} value={status}>
						{INQUIRY_STATUS_LABELS[status]}
					</option>
				))}
			</select>
		</div>
	);
}
