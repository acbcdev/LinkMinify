import { redirect } from "next/navigation";
export default async function page({ params }: { params: { short: string } }) {
	const rta = await fetch(`${window.location.href}/api/urls/${params.short}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const url = await rta.json();
	// console.log(url[0].url);
	redirect(url[0].url);
}
