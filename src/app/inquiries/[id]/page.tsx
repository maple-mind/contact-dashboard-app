import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
	INQUIRY_STATUS_LABELS,
	INQUIRY_STATUS_VARIANTS,
	PRIORITY_LABELS,
} from "@/lib/labels";
import { StatusChanger } from "@/components/status-changer";
import { AssigneeChanger } from "@/components/assignee-changer";

export default async function InquiryDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const [inquiry, users] = await Promise.all([
		prisma.inquiry.findUnique({
			where: { id },
			include: { customer: true, assignee: true },
		}),
		prisma.user.findMany({
			select: { id: true, name: true },
			orderBy: { name: "asc" },
		}),
	]);

	if (!inquiry) {
		notFound();
	}

	return (
		<main className="mx-auto w-full max-w-[1200px] p-8">
			<Link href="/" className="text-muted-foreground text-sm hover:underline">
				← 一覧に戻る
			</Link>

			<h1 className="mt-4 mb-6 text-2xl font-bold">{inquiry.title}</h1>

			<div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
				<section>
					<h2 className="mb-2 font-medium">本文</h2>
					<div className="rounded border p-4 text-sm whitespace-pre-wrap">
						{inquiry.body}
					</div>
				</section>

				<aside>
					<dl className="grid grid-cols-[6rem_1fr] gap-y-3 text-sm">
						<dt className="text-muted-foreground">顧客</dt>
						<dd>{inquiry.customer.name}</dd>

						<dt className="text-muted-foreground">ステータス</dt>
						<dd>
							<StatusChanger
								inquiryId={inquiry.id}
								currentStatus={inquiry.status}
							/>
						</dd>

						<dt className="text-muted-foreground">優先度</dt>
						<dd>{PRIORITY_LABELS[inquiry.priority]}</dd>

						<dt className="text-muted-foreground">担当者</dt>
						<dd>
							<AssigneeChanger
								inquiryId={inquiry.id}
								currentAssigneeId={inquiry.assigneeId}
								users={users}
							/>
						</dd>

						<dt className="text-muted-foreground">受信日時</dt>
						<dd>
							{inquiry.createdAt.toLocaleString("ja-JP", {
								dateStyle: "medium",
								timeStyle: "short",
							})}
						</dd>

						<dt className="text-muted-foreground">最終更新</dt>
						<dd>
							{inquiry.updatedAt.toLocaleString("ja-JP", {
								dateStyle: "medium",
								timeStyle: "short",
							})}
						</dd>
					</dl>
				</aside>
			</div>
		</main>
	);
}
