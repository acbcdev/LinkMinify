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
		<html lang="en" data-mode='dark' className="dark">
			<body className={`${GeistSans.className} bg-zinc-900  `}>
				{children}
			</body>
		</html>
	);
}
