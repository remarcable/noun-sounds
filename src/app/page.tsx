"use client";

import { Input } from "@/components/ui/input";
import { NounGlasses } from "./nounGlasses";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col min-h-screen p-8 pb-20 sm:p-20">
      <div className="flex h-12 mb-4">
        <h1 className="text-6xl">Noun Sounds</h1>
        <NounGlasses className="h-36 w-36 items-center justify-center -mt-7 -ml-2" />
      </div>

      <div className="font-normal text-2xl text-stone-600 mb-16">
        Listen to your unique Noun transaction history
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const ethereumAddress = (
            formData.get("eth-address") as string
          ).trim();

          console.log(ethereumAddress);
        }}
      >
        <Input
          placeholder="0x1234...1234"
          className="w-64"
          name="eth-address"
        />
        <Button className="px-8" type="submit">
          Play
        </Button>
      </form>
    </div>
  );
}
