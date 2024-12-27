"use client";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLinkStore } from "@/lib/store";
import { IsValidUrl } from "@/lib/utils";
import { CreateUrl } from "@/actions/Actions";

export default function FormUrl() {
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
		} catch (error) {
			toast.error("An error occurred, try again later ");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createNewShort();
				}}
				className=" flex flex-col md:flex-row items-center justify-center w-full gap-2"
			>
				<section className="flex flex-col md:flex-row gap-2 animate-bounce-fade-in animate-delay-300 animate-duration-250 ">
					<Input
						type="text"
						placeholder="Enter your link here"
						value={url}
						disabled={loading}
						onChange={(e) => {
							e.preventDefault;
							setUrl(e.target.value);
						}}
						className="w-64 text-white  border-white focus-visible:ring-0 focus:ring-offset-transparent focus:bg-white hover:bg-white hover:text-black duration-200 focus:outline-none focus:shadow-2xl shadow-white focus:text-black bg-transparent  border-4 p-6"
					/>
					<Button
						type="submit"
						variant="default"
						disabled={loading}
						className="px-6 py-7 "
					>
						{loading && <div className="loader mx-2" />} Shorten URL
					</Button>
				</section>
			</form>
			<Toaster position="top-center" />
		</>
	);
}
