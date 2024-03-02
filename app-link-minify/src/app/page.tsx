import FormUrl from "@/components/FormUrl";
import UrlsCreated from "@/components/UrlsCreated";
export default function Home() {
  return (
    <>
      <main id="Create" className="grid place-content-center h-screen gap-10">
        <header>
          <h1 className="text-white text-center text-8xl animate-fade-in animate-duration-200 animate-delay-250">
            Link Minify
          </h1>
        </header>
        <FormUrl />
      </main>
      <section
        id="Links"
        className="w-full grid place-content-center h-auto mb-16 "
      >
        <UrlsCreated />
      </section>
      <footer className="h-11">
        <p className="text-white text-center">Made by ACBC</p>
      </footer>
    </>
  );
}
