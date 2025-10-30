"use client"; // Error components must be Client Components

import { Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
			<div className="max-w-2xl w-full text-center space-y-8">
				{/* Large Oops! */}
				<h1 className="text-[120px] md:text-[180px] font-bold text-white leading-none">
					Oops!
				</h1>

				{/* Error message */}
				<div className="space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold text-white">
						Something went wrong
					</h2>
					<p className="text-gray-400 text-lg">
						Sorry, we encountered an unexpected error. Please try again, or go
						back to the homepage.
					</p>
				</div>

				{/* Buttons */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
					<Link href="/">
						<Button
							variant="secondary"
							size="lg"
							className="bg-white text-black hover:bg-gray-200 font-medium px-6"
						>
							<Home className="mr-2 h-5 w-5" />
							Go back home
						</Button>
					</Link>
					<Button
						variant="outline"
						size="lg"
						onClick={() => reset()}
						className="border-zinc-700 text-white hover:bg-zinc-900 font-medium px-6"
					>
						<RotateCcw className="mr-2 h-5 w-5" />
						Try again
					</Button>
				</div>
			</div>
		</div>
	);
}
