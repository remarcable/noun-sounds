"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBackgroundColorFromNounImage } from "@/lib/getBackgroundColorFromNounImage";
import { NOUN_SMART_CONTRACT_ADDRESS } from "@/lib/constants";

export const NounImage = ({ nounId }: { nounId: number | null }) => {
  const [background, setBackground] = useState<string | null>(null);
  const imageUrl = `https://noun.pics/${nounId}.svg`;

  return (
    <>
      <div
        className={cn(
          "absolute w-full h-full inset-0 -z-10 opacity-0 transition-all duration-500",
          {
            "opacity-100": background,
          }
        )}
        style={background ? { backgroundColor: background } : {}}
      />
      <div className="relative mb-8 overflow-hidden rounded-sm w-80 h-80 bg-stone-100 flex items-center justify-center align-center text-6xl text-stone-300 select-none border-2 border-slate-800/20">
        {nounId ? (
          <Image
            src={imageUrl}
            alt={`Noun with ID #${nounId}`}
            crossOrigin="anonymous"
            fill
            onLoad={(e) => {
              const image = e.currentTarget;
              const hex = getBackgroundColorFromNounImage(image);
              setBackground(hex);
            }}
          />
        ) : (
          "?"
        )}

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute bottom-2 right-2 text-slate-800/20 transition-opacity",
            {
              "opacity-0 pointer-events-none": !nounId,
              "opacity-100": !!nounId,
            }
          )}
          asChild
        >
          <Link
            href={`https://eth.blockscout.com/token/${NOUN_SMART_CONTRACT_ADDRESS}/instance/${nounId}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <ExternalLink />
          </Link>
        </Button>
      </div>
    </>
  );
};
