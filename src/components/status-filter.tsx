"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { InquiryStatus } from "@/generated/prisma/enums";
import { INQUIRY_STATUS_LABELS } from "@/lib/labels";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ALL = "__all__";

export function StatusFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const current = searchParams.get("status") || ALL;
	const label = INQUIRY_STATUS_LABELS[current as InquiryStatus] ?? "すべて";

	function handleChange(value: string | null) {
		const params = new URLSearchParams(searchParams);

		if (!value || value === ALL) {
			params.delete("status");
		} else {
			params.set("status", value);
		}

		params.delete("page");
		router.push(`/?${params.toString()}`);
	}

	return (
		<div className="flex items-center gap-2">
			<label htmlFor="status-filter" className="text-sm">
				ステータス
			</label>
			<Select value={current} onValueChange={handleChange}>
				<SelectTrigger id="status-filter" className="w-36">
					{label}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>すべて</SelectItem>
					{Object.values(InquiryStatus).map((status) => (
						<SelectItem key={status} value={status}>
							{INQUIRY_STATUS_LABELS[status]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
