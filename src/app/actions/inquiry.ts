"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { InquiryStatus } from "@/generated/prisma/enums";
import { canTransition } from "@/lib/inquiry-status";

type ActionResult = { ok: true } | { ok: false; message: string };

export async function updateInquiryStatus(
	inquiryId: string,
	nextStatus: string,
): Promise<ActionResult> {
	if (!Object.values(InquiryStatus).includes(nextStatus as InquiryStatus)) {
		return { ok: false, message: "不正なステータスです" };
	}

	const inquiry = await prisma.inquiry.findUnique({
		where: { id: inquiryId },
		select: { status: true },
	});

	if (!inquiry) {
		return { ok: false, message: "問い合わせが見つかりません" };
	}

	if (!canTransition(inquiry.status, nextStatus as InquiryStatus)) {
		return { ok: false, message: "このステータスには変更できません" };
	}

	await prisma.inquiry.update({
		where: { id: inquiryId },
		data: { status: nextStatus as InquiryStatus },
	});

	revalidatePath(`/inquiries/${inquiryId}`);
	revalidatePath("/");

	return { ok: true };
}

export async function updateInquiryAssignee(
	inquiryId: string,
	assigneeId: string | null,
): Promise<ActionResult> {
	if (assigneeId !== null) {
		const user = await prisma.user.findUnique({
			where: { id: assigneeId },
			select: { id: true },
		});

		if (!user) {
			return { ok: false, message: "担当者が見つかりません" };
		}
	}

	const inquiry = await prisma.inquiry.findUnique({
		where: { id: inquiryId },
		select: { id: true },
	});

	if (!inquiry) {
		return { ok: false, message: "問い合わせが見つかりません" };
	}

	await prisma.inquiry.update({
		where: { id: inquiryId },
		data: { assigneeId },
	});

	revalidatePath(`/inquiries/${inquiryId}`);
	revalidatePath("/");

	return { ok: true };
}
