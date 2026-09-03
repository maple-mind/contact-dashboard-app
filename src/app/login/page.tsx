"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit() {
		setError(null);

		startTransition(async () => {
			const { error } = await signIn.email({ email, password });

			if (error) {
				setError("メールアドレスまたはパスワードが正しくありません");
				return;
			}

			router.push("/");
			router.refresh();
		});
	}

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center p-8">
			<h1 className="mb-6 text-2xl font-bold">ログイン</h1>

			<div className="space-y-4">
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
						autoComplete="current-password"
					/>
				</div>

				{error && (
					<p className="text-destructive text-sm" role="alert">
						{error}
					</p>
				)}

				<Button onClick={handleSubmit} disabled={isPending} className="w-full">
					{isPending ? "ログイン中..." : "ログイン"}
				</Button>
			</div>
		</main>
	);
}
