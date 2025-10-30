import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
	return (
		<footer className="pb-8">
			<p className="text-gray-500 text-center text-sm">
				Made by{" "}
				<Button variant="link" asChild className="p-0 inline-block">
					<Link href="https://acbc.dev">acbc</Link>
				</Button>
			</p>
		</footer>
	);
}
