"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DeleteUrl } from "@/actions/Actions";
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
	const links = useLinkStore((state) => state.links);
	const deleteLink = useLinkStore((state) => state.deleteLink);
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
				<div className="w-full max-w-7xl animate-fade-in animate-delay-500">
					<h2 className="text-2xl font-bold text-white mb-6">My Links</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-10s,c">
						{links.map(({ code, url }) => {
							const link = `${window.location.origin}/${code}`;
							return (
								<div
									key={code}
									className="flex flex-col p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-2">
												<Link
													href={link}
													target="_blank"
													className="text-blue-400 hover:text-blue-300 font-medium transition-colors truncate"
												>
													{removeProtocol(link)}
												</Link>
												<CopyButton
													text={link}
													className="h-6 w-6 hover:bg-zinc-800 flex-shrink-0"
												/>
											</div>
											<p className="text-gray-400 text-sm truncate">
												{removeProtocol(url)}
											</p>
										</div>

										<div className="flex items-center ml-2">
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
														onClick={async () => {
															try {
																await DeleteUrl(code);
																deleteLink(code);
																toast.success("Link deleted successfully");
															} catch (error) {
																toast.error("Failed to delete link");
																console.error("Delete error:", error);
															}
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
								</div>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}
