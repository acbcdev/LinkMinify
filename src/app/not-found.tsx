import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
			<div className="max-w-2xl w-full text-center space-y-8">
				{/* Large 404 */}
				<h1 className="text-[180px] md:text-[240px] font-bold text-white leading-none">
					404
				</h1>

				{/* Page not found */}
				<div className="space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold text-white">
						Page not found
					</h2>
					<p className="text-gray-400 text-lg">
						Sorry, we couldn't find the page you're looking for. It might have
						been moved or the link is incorrect.
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
							<ArrowLeft className="mr-2 h-5 w-5" />
							Go back home
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
