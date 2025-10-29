"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CreateUrl } from "@/actions/Actions";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useLinkStore } from "@/lib/store";
import { IsValidUrl } from "@/lib/utils";

export default function ShortenForm() {
	const [url, setUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const { addLink } = useLinkStore();
	async function createNewShort() {
		setLoading(true);
		if (url.trim() === "") {
			toast.error("Please enter a URL");
			setLoading(false);
			return;
		}
		if (!IsValidUrl(url)) {
			toast.error("Invalid URL");
			setLoading(false);
			return;
		}
		try {
			const rta = await CreateUrl(url);
			const data = JSON.parse(rta);
			setUrl("");
			addLink(data);
			toast.success("Link created successfully");
		} catch {
			toast.error("An error occurred, try again later ");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				createNewShort();
			}}
			className="w-full max-w-2xl animate-bounce-fade-in animate-delay-300 animate-duration-250"
		>
			<InputGroup className="h-14 rounded-full bg-zinc-900/50 border-zinc-800">
				<InputGroupInput
					type="text"
					placeholder="Paste a long URL"
					value={url}
					disabled={loading}
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
