"use client";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useShortenUrl } from "@/hooks/useShortenUrl";

export default function ShortenForm() {
	const { url, setUrl, loading, createShortUrl } = useShortenUrl();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				createShortUrl();
			}}
			className="w-full max-w-2xl animate-bounce-fade-in animate-delay-300 animate-duration-250"
		>
			<InputGroup className="h-14 rounded-full bg-zinc-900/50 border-zinc-800">
				<InputGroupInput
					type="text"
					placeholder="Paste a long URL"
					value={url}
					disabled={loading}
					autoFocus
					onChange={(e) => {
						e.preventDefault;
						setUrl(e.target.value);
					}}
					className="text-base focus-visible:ring-offset-0 placeholder:text-gray-500 px-6"
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						type="submit"
						variant="secondary"
						disabled={loading}
						size="sm"
						className="rounded-full px-6 h-10 bg-white text-black hover:bg-gray-200"
					>
						{loading && <Spinner className="mr-2" />} Shorten
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
}
