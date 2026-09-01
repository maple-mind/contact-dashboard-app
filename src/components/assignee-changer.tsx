"use client";

import { useState, useTransition } from "react";
import { updateInquiryAssignee } from "@/app/actions/inquiry";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

const UNASSIGNED = "__unassigned__";

export function AssigneeChanger({
	inquiryId,
	currentAssigneeId,
	users,
}: {
	inquiryId: string;
	currentAssigneeId: string | null;
	users: { id: string; name: string }[];
}) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const current = currentAssigneeId ?? UNASSIGNED;
	const currentName =
		users.find((u) => u.id === currentAssigneeId)?.name ?? "未割当";

	function handleChange(value: string | null) {
		if (!value) return;

		setError(null);

		startTransition(async () => {
			const result = await updateInquiryAssignee(
				inquiryId,
				value === UNASSIGNED ? null : value,
			);

			if (!result.ok) {
				setError(result.message);
			}
		});
	}

	return (
		<div>
			<Select value={current} onValueChange={handleChange} disabled={isPending}>
				<SelectTrigger className="w-full">{currentName}</SelectTrigger>
				<SelectContent>
					<SelectItem value={UNASSIGNED}>未割当</SelectItem>
					{users.map((user) => (
						<SelectItem key={user.id} value={user.id}>
							{user.name}
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
