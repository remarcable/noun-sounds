"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNounsByAddress } from "@/data/getNounsByAddress";
import { useState } from "react";
import { NounGlasses } from "./nounGlasses";
import { NounImage } from "@/components/NounImage";
import { useToast } from "@/hooks/use-toast";
import { play } from "@/audio";

export default function Home() {
  const [selectedNoun, setSelectedNoun] = useState<number | null>(null);
  const { toast } = useToast();

  return (
    <div className="flex items-center justify-center flex-col min-h-screen p-8 pb-20 sm:p-20">
      <NounImage nounId={selectedNoun} />

      <div className="flex h-12 mb-4">
        <h1 className="text-6xl">Noun Sounds</h1>
        <NounGlasses className="h-36 w-36 items-center justify-center -mt-7 -ml-2" />
      </div>

      <div className="font-normal text-2xl text-stone-600 mb-8">
        Listen to your unique transaction history with your Noun
      </div>

      <form
        className="flex gap-2"
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const ethereumAddress = (
            formData.get("eth-address") as string
          ).trim();

          const nouns = await getNounsByAddress(ethereumAddress);

          if (nouns.length === 0) {
            toast({
              title: "No Noun found",
              description:
                "Couldn't find a Noun NFT on this address. Please try again.",
            });
            setSelectedNoun(null);
            return;
          }

          console.log(nouns);
          setSelectedNoun(nouns[0].id);

          play();
        }}
      >
        {/* TODO: Add ENS support */}
        <Input
          placeholder="Ethereum Address or ENS"
          className="w-48"
          name="eth-address"
        />
        <Button className="px-8" type="submit">
          Play Song
        </Button>
      </form>
    </div>
  );
}
