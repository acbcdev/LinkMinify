"use client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "./ui/button";
import { useLinkStore } from "@/lib/store";
export default function UrlsCreated() {
  const { links } = useLinkStore();
  return (
    <>
      {links.length !== 0 && (
        <Table className="text-white animate-fade-in animate-delay-500">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-white font-bold text-center">
                Url
              </TableHead>
              <TableHead
                colSpan={2}
                className="text-white font-bold text-center"
              >
                ShortLink
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.toReversed().map(({ code, url }) => {
              const link = `${window.location.origin}/${code}`;
              return (
                <TableRow key={code}>
                  <TableCell className="font-medium">
                    <p className="hover:bg-zinc-200 hover:text-zinc-700  px-2 py-3 duration-200 rounded-3xl">
                      {url}
                    </p>
                  </TableCell>

                  <TableCell className="text-right">
                    <Link
                      target="_blank"
                      href={code}
                      className="hover:underline"
                    >
                      {link}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="rounded-3xl"
                      variant={"ghost"}
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        toast(`link Copied on your clipboard ${link}`);
                      }}
                    >
                      Copy
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Toaster position="top-center" />
    </>
  );
}
