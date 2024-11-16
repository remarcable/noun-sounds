"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNounsByAddress } from "@/data/getNounsByAddress";
import { useCallback, useState } from "react";
import { NounGlasses } from "./nounGlasses";
import { NounImage } from "@/components/NounImage";
import { useToast } from "@/hooks/use-toast";
import { play } from "@/audio";
import { getTransactionHistoryValues } from "@/data/getTransactionHistoryValues";
import { publicClient } from "@/lib/viemPublicClient";
import { normalize } from "viem/ens";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [selectedNoun, setSelectedNoun] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const { toast } = useToast();

  const handleOnSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setStarted(true);

      const formData = new FormData(e.currentTarget);
      const ethereumAddress = (formData.get("eth-address") as string).trim();

      const isEns = ethereumAddress.includes(".eth");

      const address = isEns
        ? await publicClient.getEnsAddress({
            name: normalize(ethereumAddress),
          })
        : ethereumAddress;

      if (address === null) {
        toast({
          title: "Couldn't resolve ENS name",
          description: "Please try again with another address",
        });

        setStarted(false);

        return;
      }

      const nouns = await getNounsByAddress(address);
      const txValues = await getTransactionHistoryValues(address);

      if (nouns.length === 0) {
        toast({
          title: "No Noun found",
          description:
            "Couldn't find a Noun NFT for this address. Please try again.",
        });
        setSelectedNoun(null);
        setStarted(false);
        return;
      }

      console.log({ nouns });
      setSelectedNoun(nouns[0].id);

      play(txValues, ethereumAddress);
    },
    []
  );

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

      <form className="flex gap-2" onSubmit={handleOnSubmit}>
        <Input
          placeholder="Ethereum Address or ENS"
          className="w-48"
          name="eth-address"
          disabled={started}
        />
        <Button className="px-6" type="submit" disabled={started}>
          <Loader2Icon
            className={cn("animate-spin transition-opacity", {
              "opacity-100": started,
              "opacity-0": !started,
            })}
          />
          <span
            className={cn("transition-transform", {
              "-translate-x-3": !started,
            })}
          >
            Play Song
          </span>
        </Button>
      </form>
    </div>
  );
}
