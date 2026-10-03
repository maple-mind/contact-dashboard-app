import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import type { InquiryStatus, Prisma } from "@/generated/prisma/client";
import { canTransition } from "@/lib/inquiry-status";
import type { ActionResult } from "@/lib/types";

const PER_PAGE = 20;

function visibilityFilter(user: {
	id: string;
	role: string;
}): Prisma.InquiryWhereInput {
	return user.role === "ADMIN" ? {} : { assigneeId: user.id };
}

export async function getInquiries(params: {
	status: InquiryStatus | undefined;
	q: string;
	page: number;
	sort: string;
	order: "asc" | "desc";
}) {
	const session = await requireSession();
	const { status, q, page, sort, order } = params;

	const where: Prisma.InquiryWhereInput = {
		...visibilityFilter(session.user),
		...(status ? { status } : {}),
		...(q
			? {
					OR: [
						{ title: { contains: q, mode: "insensitive" } },
						{ customer: { name: { contains: q, mode: "insensitive" } } },
					],
				}
			: {}),
	};

	const [inquiries, total] = await Promise.all([
		prisma.inquiry.findMany({
			where,
			include: { customer: true, assignee: true },
			orderBy: { [sort]: order },
			skip: (page - 1) * PER_PAGE,
			take: PER_PAGE,
		}),
		prisma.inquiry.count({ where }),
	]);

	return {
		inquiries,
		total,
		totalPages: Math.ceil(total / PER_PAGE),
		perPage: PER_PAGE,
	};
}

export const getInquiryById = cache(async (id: string) => {
	const session = await requireSession();

	const inquiry = await prisma.inquiry.findUnique({
		where: { id },
		include: {
			customer: true,
			assignee: true,
			comments: {
				include: { author: true },
				orderBy: { createdAt: "asc" },
			},
		},
	});

	if (!inquiry) {
		return null;
	}

	if (session.user.role !== "ADMIN" && inquiry.assigneeId !== session.user.id) {
		return null;
	}

	return inquiry;
});

export async function getAssignableUsers() {
	await requireSession();

	return prisma.user.findMany({
		select: { id: true, name: true },
		orderBy: { name: "asc" },
	});
}

export async function getStatusSummary() {
	const session = await requireSession();

	const groups = await prisma.inquiry.groupBy({
		by: ["status"],
		where: visibilityFilter(session.user),
		_count: { _all: true },
	});

	const summary: Record<InquiryStatus, number> = {
		OPEN: 0,
		IN_PROGRESS: 0,
		PENDING: 0,
		CLOSED: 0,
	};

	for (const group of groups) {
		summary[group.status] = group._count._all;
	}

	return summary;
}

async function checkInquiryWriteAccess(inquiryId: string) {
	const session = await requireSession();

	const inquiry = await prisma.inquiry.findUnique({
		where: { id: inquiryId },
		select: { status: true, assigneeId: true },
	});

	if (!inquiry) {
		return {
			ok: false as const,
			message: "問い合わせが見つかりません",
		};
	}

	if (session.user.role !== "ADMIN" && inquiry.assigneeId !== session.user.id) {
		return {
			ok: false as const,
			message: "この問い合わせを操作する権限がありません",
		};
	}

	return { ok: true as const, session, inquiry };
}

export async function updateStatus(
	inquiryId: string,
	nextStatus: InquiryStatus,
): Promise<ActionResult> {
	const access = await checkInquiryWriteAccess(inquiryId);

	if (!access.ok) {
		return access;
	}

	const isAdmin = access.session.user.role === "ADMIN";

	if (!isAdmin && !canTransition(access.inquiry.status, nextStatus)) {
		return { ok: false, message: "このステータスには変更できません" };
	}

	await prisma.inquiry.update({
		where: { id: inquiryId },
		data: { status: nextStatus },
	});

	return { ok: true };
}

export async function updateAssignee(
	inquiryId: string,
	assigneeId: string | null,
): Promise<ActionResult> {
	const access = await checkInquiryWriteAccess(inquiryId);

	if (!access.ok) {
		return access;
	}

	if (assigneeId !== null) {
		const user = await prisma.user.findUnique({
			where: { id: assigneeId },
			select: { id: true },
		});

		if (!user) {
			return { ok: false, message: "担当者が見つかりません" };
		}
	}

	await prisma.inquiry.update({
		where: { id: inquiryId },
		data: { assigneeId },
	});

	return { ok: true };
}

export async function addComment(
	inquiryId: string,
	body: string,
): Promise<ActionResult> {
	const access = await checkInquiryWriteAccess(inquiryId);

	if (!access.ok) {
		return access;
	}

	await prisma.comment.create({
		data: {
			body,
			inquiryId,
			authorId: access.session.user.id,
		},
	});

	return { ok: true };
}
