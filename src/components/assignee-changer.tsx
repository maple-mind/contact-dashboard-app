"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
	listHref,
}: {
	inquiryId: string;
	currentAssigneeId: string | null;
	users: { id: string; name: string }[];
	listHref: string;
}) {
	const router = useRouter();
	const [, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [optimisticAssigneeId, setOptimisticAssigneeId] =
		useOptimistic(currentAssigneeId);

	const current = optimisticAssigneeId ?? UNASSIGNED;
	const currentName =
		users.find((u) => u.id === optimisticAssigneeId)?.name ?? "未割当";

	function handleChange(value: string | null) {
		if (!value) return;

		setError(null);

		startTransition(async () => {
			const next = value === UNASSIGNED ? null : value;
			setOptimisticAssigneeId(next);

			const result = await updateInquiryAssignee(inquiryId, next);

			if (!result.ok) {
				setError(result.message);
				return;
			}

			if (!result.canStillView) {
				toast.success(
					"担当を変更しました。この問い合わせは一覧に表示されなくなります",
				);
				router.push(listHref);
			}
		});
	}

	return (
		<div>
			<Select value={current} onValueChange={handleChange}>
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
