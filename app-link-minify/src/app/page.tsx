import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main className="bg-zinc-700 grid place-content-center h-screen w-full">
			<Input type="url" placeholder="Link" required />
			<Input type="text" placeholder="hash" />
			<Button type="submit">Create</Button>
		</main>
	);
}
