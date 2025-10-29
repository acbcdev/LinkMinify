import { Link2 } from "lucide-react";
import Link from "next/link";
import LinksList from "@/components/LinksList";
import ShortenForm from "@/components/ShortenForm";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
	return (
		<section className="min-h-screen flex flex-col">
			<header className="p-6">
				<div className="flex items-center gap-2 text-white">
					<Link2 className="w-6 h-6" />
					<span className="text-xl font-medium">linkminify</span>
				</div>
			</header>

			<main
				id={"shorten-url"}
				className="flex-1 flex flex-col items-center justify-center gap-10 px-4 min-h-[60vh]"
			>
				<ShortenForm />
			</main>

			<section
				id={"links-created"}
				className="w-full grid place-content-center h-auto mb-16 px-4"
			>
				<LinksList />
			</section>

			<footer className="pb-8">
				<p className="text-gray-500 text-center text-sm">
					Made by{" "}
					<Button variant="link" asChild className="p-0 inline-block">
						<Link href="https://acbc.dev">acbc</Link>
					</Button>
				</p>
			</footer>
			<Toaster />
		</section>
	);
}
