"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Input } from "@/components/ui/input";

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
				id="search"
				type="search"
				defaultValue={searchParams.get("q") ?? ""}
				onChange={handleChange}
				placeholder="件名・顧客名"
				className="w-56"
			/>
		</div>
	);
}
