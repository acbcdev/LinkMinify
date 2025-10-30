import LinksList from "@/components/LinksList";
import ShortenForm from "@/components/ShortenForm";

export default function Home() {
	return (
		<>
			<section
				id={"shorten-url"}
				className="flex-1 flex flex-col items-center justify-center gap-10 px-4 min-h-[60vh]"
			>
				<ShortenForm />
			</section>

			<section
				id={"links-created"}
				className="w-full grid place-content-center h-auto mb-16 px-4"
			>
				<LinksList />
			</section>
		</>
	);
}
