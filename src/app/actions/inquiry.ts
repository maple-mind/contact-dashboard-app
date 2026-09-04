"use server";

import { revalidatePath } from "next/cache";
import { InquiryStatus } from "@/generated/prisma/enums";
import * as inquiryData from "@/data/inquiry";
import type { ActionResult } from "@/lib/types";

export async function updateInquiryStatus(
	inquiryId: string,
	nextStatus: string,
): Promise<ActionResult> {
	if (!Object.values(InquiryStatus).includes(nextStatus as InquiryStatus)) {
		return { ok: false, message: "不正なステータスです" };
	}

	const result = await inquiryData.updateStatus(
		inquiryId,
		nextStatus as InquiryStatus,
	);

	if (result.ok) {
		revalidatePath(`/inquiries/${inquiryId}`);
		revalidatePath("/");
	}

	return result;
}

export async function updateInquiryAssignee(
	inquiryId: string,
	assigneeId: string | null,
): Promise<ActionResult> {
	const result = await inquiryData.updateAssignee(inquiryId, assigneeId);

	if (result.ok) {
		revalidatePath(`/inquiries/${inquiryId}`);
		revalidatePath("/");
	}

	return result;
}

export async function createComment(
	inquiryId: string,
	body: string,
): Promise<ActionResult> {
	const trimmed = body.trim();

	if (!trimmed) {
		return { ok: false, message: "コメントを入力してください" };
	}

	if (trimmed.length > 2000) {
		return { ok: false, message: "コメントは2000文字以内で入力してください" };
	}

	const result = await inquiryData.addComment(inquiryId, trimmed);

	if (result.ok) {
		revalidatePath(`/inquiries/${inquiryId}`);
	}

	return result;
}
