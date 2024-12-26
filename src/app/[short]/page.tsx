import { permanentRedirect } from "next/navigation";
import { GetUrl } from "@/actions/Actions";
export default async function page({ params }: { params: { short: string } }) {
	const url = await GetUrl(params.short);
	permanentRedirect(url);
}
