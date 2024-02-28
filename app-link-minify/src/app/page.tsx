import FormUrl from "@/components/FormUrl";
import UrlsCreated from "@/components/UrlsCreated";
export default function Home() {
  return (
    <main className="grid place-content-center h-screen gap-10">
      <header>
        <h1 className="text-white text-center text-8xl animate-fade-in animate-delay-250">
          Link Minify
        </h1>
      </header>
      <FormUrl />
      <UrlsCreated />
    </main>
  );
}
