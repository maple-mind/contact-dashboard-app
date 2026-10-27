import Link from "next/link";
import type { Role } from "@/generated/prisma/enums";
import { SignOutButton } from "@/components/sign-out-button";
import { requireSession } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/labels";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await requireSession();

	return (
		<>
			<a
				href="#main-content"
				className="bg-background fixed top-2 left-2 z-50 -translate-y-[200%] rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:translate-y-0"
			>
				本文へスキップ
			</a>

			<header className="border-b">
				<div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
					<Link href="/" className="font-bold">
						問い合わせ管理
					</Link>

					<div className="flex items-center gap-3">
						<span className="text-muted-foreground text-sm">
							{session.user.name}（{ROLE_LABELS[session.user.role as Role]}）
						</span>
						<SignOutButton />
					</div>
				</div>
			</header>

			<main
				id="main-content"
				tabIndex={-1}
				className="mx-auto w-full max-w-[1200px] p-4 outline-none sm:p-6 lg:p-8"
			>
				{children}
			</main>
		</>
	);
}
