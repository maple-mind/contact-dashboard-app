"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// prisma/seed.ts で作成されるデモアカウント（README にも記載している公開情報）
const DEMO_ACCOUNTS = [
	{
		label: "管理者でログイン",
		email: "admin@example.com",
		password: "demo1234",
	},
	{
		label: "担当者でログイン",
		email: "member@example.com",
		password: "demo1234",
	},
];

export default function LoginPage() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function login(credentials: { email: string; password: string }) {
		setError(null);

		startTransition(async () => {
			const { error } = await signIn.email(credentials);

			if (error) {
				setError("メールアドレスまたはパスワードが正しくありません");
				return;
			}

			router.push("/");
		});
	}

	function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		login({ email, password });
	}

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-sm flex-col p-8 pt-[25vh]">
			<h1 className="mb-6 text-2xl font-bold">ログイン</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
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

				<Button
					type="submit"
					disabled={isPending}
					size="lg"
					className="mt-2 h-10 w-full"
				>
					{isPending ? "ログイン中..." : "ログイン"}
				</Button>
			</form>

			<p className="text-muted-foreground mt-4 text-center text-sm">
				アカウントをお持ちでない方は
				<Link href="/signup" className="text-foreground underline">
					アカウント登録
				</Link>
			</p>

			<div className="mt-8 rounded-lg border p-4">
				<h2 className="text-sm font-medium">デモアカウント</h2>
				<p className="text-muted-foreground mt-1 text-sm">
					管理者は全件、担当者は自分が担当する問い合わせのみ表示されます。
				</p>
				<div className="mt-3 grid grid-cols-2 gap-2">
					{DEMO_ACCOUNTS.map((account) => (
						<Button
							key={account.email}
							variant="outline"
							disabled={isPending}
							onClick={() =>
								login({ email: account.email, password: account.password })
							}
						>
							{account.label}
						</Button>
					))}
				</div>
			</div>
		</main>
	);
}
