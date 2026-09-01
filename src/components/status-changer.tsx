"use client";

import { useState, useTransition } from "react";
import { InquiryStatus } from "@/generated/prisma/enums";
import { INQUIRY_STATUS_LABELS } from "@/lib/labels";
import { getAllowedTransitions } from "@/lib/inquiry-status";
import { updateInquiryStatus } from "@/app/actions/inquiry";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

export function StatusChanger({
	inquiryId,
	currentStatus,
}: {
	inquiryId: string;
	currentStatus: InquiryStatus;
}) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const allowed = getAllowedTransitions(currentStatus);

	function handleChange(value: string | null) {
		if (!value) return;

		setError(null);

		startTransition(async () => {
			const result = await updateInquiryStatus(inquiryId, value);

			if (!result.ok) {
				setError(result.message);
			}
		});
	}

	if (allowed.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				このステータスからは変更できません
			</p>
		);
	}

	return (
		<div>
			<Select
				value={currentStatus}
				onValueChange={handleChange}
				disabled={isPending}
			>
				<SelectTrigger className="w-full">
					{INQUIRY_STATUS_LABELS[currentStatus]}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={currentStatus} disabled>
						{INQUIRY_STATUS_LABELS[currentStatus]}（現在）
					</SelectItem>
					{allowed.map((status) => (
						<SelectItem key={status} value={status}>
							{INQUIRY_STATUS_LABELS[status]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{error && (
				<p className="text-destructive mt-2 text-sm" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
