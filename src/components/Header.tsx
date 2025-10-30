import { Link2 } from "lucide-react";
import Link from "next/link";

export default function Header() {
	return (
		<header className="p-6">
			<Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity w-fit">
				<Link2 className="w-6 h-6" />
				<span className="text-xl font-medium">linkminify</span>
			</Link>
		</header>
	);
}
