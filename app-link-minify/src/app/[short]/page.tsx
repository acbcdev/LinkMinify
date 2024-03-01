import { redirect } from "next/navigation";
export default async function page({ params }: { params: { short: string } }) {
  const rta = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/urls/${params.short}`
  );

  const url = await rta.json();
  // console.log(url[0].url);
  redirect(url[0].url);
}
