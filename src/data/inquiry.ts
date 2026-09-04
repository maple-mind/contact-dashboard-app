import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import type { InquiryStatus, Prisma } from "@/generated/prisma/client";

const PER_PAGE = 20;

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
		...(session.user.role === "ADMIN" ? {} : { assigneeId: session.user.id }),
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

export async function getInquiryById(id: string) {
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
}
