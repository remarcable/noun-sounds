import * as Tone from "tone";
import { loadSynth } from "./instruments";

export const play = async () => {
  await Tone.start();
  const synth = loadSynth();
  console.log(synth);

  synth.triggerAttackRelease("C4", "16n");
};

if (typeof window !== "undefined") {
  window.playSynth = play;
}
