"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const q = searchParams.get("q") ?? "";

	// リンクやブラウザバックなど、検索欄以外の操作で q が変わったときに表示を合わせる。
	useEffect(() => {
		const input = inputRef.current;

		// デバウンス待ちの入力がある間は、ユーザーの入力を優先する
		if (!input || timerRef.current) return;

		if (input.value !== q) {
			input.value = q;
		}
	}, [q]);

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;

		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			timerRef.current = null;

			const params = new URLSearchParams(searchParams);

			if (value) {
				params.set("q", value);
			} else {
				params.delete("q");
			}

			params.delete("page");

			router.push(`/?${params.toString()}`);
		}, 300);
	}

	return (
		<div className="flex items-center gap-2">
			<label htmlFor="search" className="text-sm">
				検索
			</label>
			<Input
				ref={inputRef}
				id="search"
				type="search"
				defaultValue={q}
				onChange={handleChange}
				placeholder="件名・顧客名"
				className="w-56"
			/>
		</div>
	);
}
