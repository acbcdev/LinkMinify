import FormUrl from "@/components/FormUrl";
export default function Home() {
	return (
		<main className="grid place-content-center h-screen gap-10">
			<header>
				<h1 className="text-white text-8xl animate-fade-in animate-delay-300">
					Link Minify
				</h1>
			</header>
			<FormUrl />
		</main>
	);
}
