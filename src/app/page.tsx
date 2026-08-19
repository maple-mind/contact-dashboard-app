import { prisma } from "@/lib/prisma";
import { INQUIRY_STATUS_LABELS, PRIORITY_LABELS } from "@/lib/labels";
import type { Prisma } from "@/generated/prisma/client";
import { InquiryStatus } from "@/generated/prisma/enums";

const STATUS_VALUES = Object.values(InquiryStatus);

function parseStatus(value: string | string[] | undefined) {
	if (typeof value !== "string") return undefined;
	return STATUS_VALUES.find((s) => s === value);
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const status = parseStatus(params.status);

	const where: Prisma.InquiryWhereInput = {
		...(status ? { status } : {}),
	};

	const inquiries = await prisma.inquiry.findMany({
		where,
		include: { customer: true, assignee: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<main className="p-8">
			<h1 className="mb-6 text-2xl font-bold">問い合わせ一覧</h1>
			<p className="mb-4 text-sm text-gray-600">{inquiries.length}件</p>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b">
						<th className="p-2 text-left">件名</th>
						<th className="p-2 text-left">顧客</th>
						<th className="p-2 text-left">ステータス</th>
						<th className="p-2 text-left">優先度</th>
						<th className="p-2 text-left">担当者</th>
						<th className="p-2 text-left">受信日時</th>
					</tr>
				</thead>
				<tbody>
					{inquiries.map((inquiry) => (
						<tr key={inquiry.id} className="border-b">
							<td className="p-2">{inquiry.title}</td>
							<td className="p-2">{inquiry.customer.name}</td>
							<td className="p-2">{INQUIRY_STATUS_LABELS[inquiry.status]}</td>
							<td className="p-2">{PRIORITY_LABELS[inquiry.priority]}</td>
							<td className="p-2">{inquiry.assignee?.name ?? "未割当"}</td>
							<td className="p-2">
								{inquiry.createdAt.toLocaleDateString("ja-JP")}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}