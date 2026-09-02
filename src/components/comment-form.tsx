"use client";

import { useRef, useState, useTransition } from "react";
import { createComment } from "@/app/actions/inquiry";
import { Button } from "@/components/ui/button";

export function CommentForm({ inquiryId }: { inquiryId: string }) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	function handleSubmit() {
		const body = textareaRef.current?.value ?? "";

		setError(null);

		startTransition(async () => {
			const result = await createComment(inquiryId, body);

			if (result.ok) {
				if (textareaRef.current) {
					textareaRef.current.value = "";
				}
			} else {
				setError(result.message);
			}
		});
	}

	return (
		<div className="mt-4">
			<textarea
				ref={textareaRef}
				rows={4}
				placeholder="対応内容を記録..."
				disabled={isPending}
				className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent p-3 text-sm outline-none focus-visible:ring-3 disabled:opacity-50"
			/>

			{error && (
				<p className="text-destructive mt-2 text-sm" role="alert">
					{error}
				</p>
			)}

			<div className="mt-2 flex justify-end">
				<Button onClick={handleSubmit} disabled={isPending}>
					{isPending ? "投稿中..." : "コメントを追加"}
				</Button>
			</div>
		</div>
	);
}
