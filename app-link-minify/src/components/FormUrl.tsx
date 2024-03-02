"use client";
import { useState } from "react";
import {} from "@/components/ui/sonner";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { asegurarHttp } from "@/lib/utils";
import { useLinkStore } from "@/lib/store";
export default function FormUrl() {
  const [url, setUrl] = useState<string>("");
  const { addLink, links } = useLinkStore();
  async function createNewShort() {
    const linkToShort = asegurarHttp(url);
    if (linkToShort === null) {
      toast.error("Invalid URL");
      return;
    }
    const rta = await fetch("/api/urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: linkToShort,
      }),
    });
    setUrl("");
    const data = await rta.json();
    addLink(data);
    toast.success("Link created successfully");
    console.log(links);
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNewShort();
        }}
        className=" flex flex-col md:flex-row items-center justify-center w-full gap-2"
      >
        <section className="flex flex-col md:flex-row gap-2 animate-bounce-fade-in animate-delay-300 animate-duration-250 ">
          <Input
            type="text"
            placeholder="Enter your link here"
            required
            value={url}
            onChange={(e) => {
              e.preventDefault;
              setUrl(e.target.value);
            }}
            className="w-64 text-white  border-white focus-visible:ring-0 focus:ring-offset-transparent focus:bg-white hover:bg-white hover:text-black duration-200 focus:outline-none focus:shadow-2xl shadow-white focus:text-black bg-transparent rounded-3xl border-4 p-6"
          />
          <Button
            type="submit"
            className={cn(
              "border-4 bg-white text-zinc-950 rounded-3xl px-5 hover:scale-125 duration-300  py-5 hover:bg-white hover:text-black border-white"
            )}
          >
            Shorten URL
          </Button>
        </section>
      </form>
      <Toaster position="top-center" richColors />
    </>
  );
}
