"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		startTransition(async () => {
			const { error } = await signUp.email({ name, email, password });

			if (error) {
				setError(error.message ?? "登録に失敗しました");
				return;
			}

			router.push("/");
		});
	}

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-sm flex-col p-8 pt-[25vh]">
			<h1 className="mb-6 text-2xl font-bold">アカウント登録</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="name" className="mb-1 block text-sm">
						名前
					</label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						autoComplete="name"
					/>
				</div>

				<div>
					<label htmlFor="email" className="mb-1 block text-sm">
						メールアドレス
					</label>
					<Input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
					/>
				</div>

				<div>
					<label htmlFor="password" className="mb-1 block text-sm">
						パスワード
					</label>
					<Input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="new-password"
					/>
				</div>

				{error && (
					<p className="text-destructive text-sm" role="alert">
						{error}
					</p>
				)}

				<Button
					type="submit"
					disabled={isPending}
					size="lg"
					className="mt-2 h-10 w-full"
				>
					{isPending ? "登録中..." : "登録"}
				</Button>
			</form>

			<p className="text-muted-foreground mt-4 text-center text-sm">
				アカウントをお持ちの方は
				<Link href="/login" className="text-foreground underline">
					ログイン
				</Link>
			</p>
		</main>
	);
}
