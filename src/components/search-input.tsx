"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;

		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			const params = new URLSearchParams(searchParams);

			if (value) {
				params.set("q", value);
			} else {
				params.delete("q");
			}

			router.push(`/?${params.toString()}`);
		}, 300);
	}

	return (
		<div>
			<label htmlFor="search" className="mr-2 text-sm">
				検索
			</label>
			<input
				id="search"
				type="search"
				defaultValue={searchParams.get("q") ?? ""}
				onChange={handleChange}
				placeholder="件名・顧客名"
				className="rounded border px-2 py-1 text-sm"
			/>
		</div>
	);
}
