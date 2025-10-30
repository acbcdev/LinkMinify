import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

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
			<body className={`${GeistSans.className} bg-zinc-900 min-h-screen flex flex-col`}>
				<Header />
				<main className="flex-1">
					{children}
				</main>
				<Footer />
				<Toaster />
			</body>
		</html>
	);
}
