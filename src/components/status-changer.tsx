"use client";

import { useOptimistic, useState, useTransition } from "react";
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
	const [, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus);

	const allowed = getAllowedTransitions(optimisticStatus);

	function handleChange(value: string | null) {
		if (!value) return;

		setError(null);

		startTransition(async () => {
			setOptimisticStatus(value as InquiryStatus);

			const result = await updateInquiryStatus(inquiryId, value);

			if (!result.ok) {
				setError(result.message);
			}
		});
	}

	return (
		<div>
			<Select value={optimisticStatus} onValueChange={handleChange}>
				<SelectTrigger className="w-full">
					{INQUIRY_STATUS_LABELS[optimisticStatus]}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={optimisticStatus} disabled>
						{INQUIRY_STATUS_LABELS[optimisticStatus]}（現在）
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
