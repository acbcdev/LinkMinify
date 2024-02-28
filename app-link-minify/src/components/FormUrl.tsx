"use client";
import { useState } from "react";
import {
  inicializarLocalStorage,
  anadirURL,
  obtenerListaURLs,
} from "@/lib/localApi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { asegurarHttp } from "@/lib/utils";

export default function FormUrl() {
  const [url, setUrl] = useState<string>("");
  inicializarLocalStorage();
  async function createNewShort() {
    const linkToShort = asegurarHttp(url);
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
    anadirURL(JSON.stringify(data));

    console.log(obtenerListaURLs());
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
        <Input
          type="text"
          placeholder="Enter your link here"
          required
          value={url}
          onChange={(e) => {
            e.preventDefault;
            setUrl(e.target.value);
          }}
          className="w-64 text-white animate-fade-in-right animate-delay-300 border-white focus-visible:ring-0 focus:ring-offset-transparent focus:bg-white hover:bg-white hover:text-black duration-200 focus:outline-none focus:shadow-2xl shadow-white focus:text-black bg-transparent rounded-3xl border-4 p-6"
        />
        <Button
          type="submit"
          className="border-4 bg-transparent rounded-3xl px-5 animate-fade-in-left animate-delay-300 py-5 hover:bg-white hover:text-black border-white hover:scale-105 duration-200"
        >
          Shorten URL
        </Button>
      </form>
    </>
  );
}
