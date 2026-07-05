import { notFound, redirect } from "next/navigation";
import { getUrl } from "@/actions/actions";

export default async function page({ params }: { params: { short: string } }) {
  const url = await getUrl(params.short);
  if (!url) notFound();
  redirect(url);
}
