import type { getInquiryById } from "@/data/inquiry";
import { INQUIRY_STATUS_LABELS } from "@/lib/labels";

type Inquiry = NonNullable<Awaited<ReturnType<typeof getInquiryById>>>;
type InquiryComment = Inquiry["comments"][number];
type InquiryEvent = Inquiry["events"][number];

type TimelineItem =
	| { kind: "comment"; createdAt: Date; comment: InquiryComment }
	| { kind: "event"; createdAt: Date; event: InquiryEvent };

function formatDateTime(date: Date) {
	return date.toLocaleString("ja-JP", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

function describeEvent(event: InquiryEvent): string {
	switch (event.type) {
		case "STATUS_CHANGED": {
			if (!event.fromStatus || !event.toStatus) {
				return "ステータスを変更";
			}

			return `ステータスを「${INQUIRY_STATUS_LABELS[event.fromStatus]}」から「${INQUIRY_STATUS_LABELS[event.toStatus]}」に変更`;
		}

		case "ASSIGNEE_CHANGED": {
			const from = event.fromAssignee?.name ?? "未割当";
			const to = event.toAssignee?.name ?? "未割当";
			return `担当者を「${from}」から「${to}」に変更`;
		}
	}
}

export function InquiryTimeline({
	comments,
	events,
}: {
	comments: InquiryComment[];
	events: InquiryEvent[];
}) {
	const items: TimelineItem[] = [
		...comments.map((comment) => ({
			kind: "comment" as const,
			createdAt: comment.createdAt,
			comment,
		})),
		...events.map((event) => ({
			kind: "event" as const,
			createdAt: event.createdAt,
			event,
		})),
	].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

	if (items.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">まだ対応履歴がありません</p>
		);
	}

	return (
		<ul className="space-y-3">
			{items.map((item) =>
				item.kind === "comment" ? (
					<li key={item.comment.id} className="rounded border p-3 text-sm">
						<div className="mb-1 flex items-baseline gap-2">
							<span className="font-medium">{item.comment.author.name}</span>
							<span className="text-muted-foreground text-xs">
								{formatDateTime(item.createdAt)}
							</span>
						</div>
						<p className="whitespace-pre-wrap">{item.comment.body}</p>
					</li>
				) : (
					<li
						key={item.event.id}
						className="text-muted-foreground flex flex-wrap items-baseline gap-x-2 px-3 text-sm"
					>
						<span>
							<span className="text-foreground font-medium">
								{item.event.actor.name}
							</span>
							が{describeEvent(item.event)}
						</span>
						<span className="text-xs">{formatDateTime(item.createdAt)}</span>
					</li>
				),
			)}
		</ul>
	);
}
