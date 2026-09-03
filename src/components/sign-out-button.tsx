"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function handleClick() {
		startTransition(async () => {
			await signOut();
			router.push("/login");
			router.refresh();
		});
	}

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleClick}
			disabled={isPending}
		>
			ログアウト
		</Button>
	);
}
