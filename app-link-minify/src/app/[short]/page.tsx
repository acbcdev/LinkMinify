import { redirect } from "next/navigation";
export default function page({ params }: { params: { short: string } }) {
	if (params.short === "youtube") {
		redirect("https://www.youtube.com/");
	}
}
