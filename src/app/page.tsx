import { NounGlasses } from "./nounGlasses";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex h-12">
        <h1 className="text-6xl">Noun Sounds</h1>
        <NounGlasses className="h-36 w-36 items-center justify-center -mt-7 -ml-2" />
      </div>
    </div>
  );
}
