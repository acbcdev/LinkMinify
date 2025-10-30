"use client";
import { MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLinkStore } from "@/lib/store";
import CopyButton from "./CopyButton";
import { Button } from "./ui/button";

export default function LinksList() {
	const { links, deleteLink } = useLinkStore();

	// const formatDate = (dateString: string) => {
	// 	const date = new Date(dateString);
	// 	return date.toLocaleDateString("en-US", {
	// 		month: "short",
	// 		day: "numeric",
	// 		year: "numeric",
	// 	});
	// };

	const removeProtocol = (url: string) => {
		return url.replace(/^https?:\/\//, "");
	};

	return (
		<>
			{links.length !== 0 && (
				<div className="w-full max-w-5xl animate-fade-in animate-delay-500">
					<h2 className="text-2xl font-bold text-white mb-6">My Links</h2>
					<div className="space-y-4">
						{links.toReversed().map(({ code, url }) => {
							const link = `${window.location.origin}/${code}`;
							return (
								<div
									key={code}
									className="flex items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors"
								>
									<div className="flex-1 min-w-0 mr-4">
										<div className="flex items-center gap-2 mb-2">
											<Link
												href={code ?? ""}
												target="_blank"
												className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
											>
												{removeProtocol(link)}
											</Link>
											<CopyButton
												text={link}
												className="h-6 w-6 hover:bg-zinc-800"
											/>
										</div>
										<p className="text-gray-400 text-sm truncate">
											{removeProtocol(url)}
										</p>
									</div>

									<div className="flex items-center gap-8">
										{/* <div className="text-right">
											<p className="text-xs text-gray-500 uppercase mb-1">
												Clicks
											</p>
											<p className="text-white font-medium">
												{clicked?.toLocaleString() ?? 0}
											</p>
										</div>
										<div className="text-right">
											<p className="text-xs text-gray-500 uppercase mb-1">
												Date
											</p>
											<p className="text-white font-medium">
												{formatDate(created_at)}
											</p>
										</div> */}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="hover:bg-zinc-800"
												>
													<MoreVertical className="h-5 w-5 text-gray-400" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="bg-zinc-900 border-zinc-800"
											>
												<DropdownMenuItem
													onClick={() => {
														deleteLink(code);
														toast.success("Link deleted successfully");
													}}
													className="text-red-400 hover:text-red-300 hover:bg-zinc-800 cursor-pointer"
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}
