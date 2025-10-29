"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface CopyButtonProps {
	text: string;
	className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(text);
		toast.success("Link copied to clipboard");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className={className}
			onClick={handleCopy}
		>
			{copied ? (
				<Check className="h-4 w-4 text-green-400" />
			) : (
				<Copy className="h-4 w-4 text-gray-400" />
			)}
		</Button>
	);
}
