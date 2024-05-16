import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
	title: "Link Minify",
	description: "Short Links for everyone",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${GeistSans.className} from-zinc-950 to-zinc-700 bg-gradient-to-tr`}
			>
				{children}
			</body>
		</html>
	);
}
