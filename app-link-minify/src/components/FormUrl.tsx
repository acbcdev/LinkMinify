"use client";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Input } from "./ui/input";
import { useLinkStore } from "@/lib/store";
import { CreateUrl } from "@/actions/Actions";
import { tree } from "next/dist/build/templates/app-page";
export default function FormUrl() {
	const [url, setUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const { addLink } = useLinkStore();

	async function createNewShort() {
		setLoading(true);

		if (url === "") {
			toast.error("Invalid URL");
			setLoading(false);
			return;
		}
		const rta = await CreateUrl(url);
		const data = JSON.parse(rta);
		setUrl("");
		setLoading(false);
		addLink(data);
		toast.success("Link created successfully");
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
						type="url"
						placeholder="Enter your link here"
						required
						value={url}
						onChange={(e) => {
							e.preventDefault;
							setUrl(e.target.value);
						}}
						className="w-64 text-white  border-white focus-visible:ring-0 focus:ring-offset-transparent focus:bg-white hover:bg-white hover:text-black duration-200 focus:outline-none focus:shadow-2xl shadow-white focus:text-black bg-transparent rounded-3xl border-4 p-6"
					/>
					<button
						type="submit"
						disabled={loading}
						className="border-4 bg-white  disabled:bg-transparent disabled:text-white disabled:border-opacity-40 flex items-center gap-x-2 text-zinc-950 rounded-3xl px-5 hover:scale-110 duration-300  py-2  border-white"
					>
						{loading && <div className="loader" />} Shorten URL
					</button>
				</section>
			</form>
			<Toaster position="top-center" richColors />
		</>
	);
}
/* HTML: <div class="loader"></div> */
