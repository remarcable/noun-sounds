import * as Tone from "tone";

let polySynth: ReturnType<typeof getPolySynth> | null = null;
export const loadSynth = () => {
  if (!polySynth) {
    polySynth = getPolySynth();
  }

  return polySynth;
};

const getPolySynth = () => {
  const synthReverb = new Tone.Reverb({
    decay: 5,
    preDelay: 0.05,
    wet: 0.1,
  }).toDestination();

  const chorus = new Tone.Chorus({
    delayTime: 20,
    wet: 0.4,
  }).connect(synthReverb);

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "sawtooth",
    },
    envelope: {
      attack: 0.01,
      sustain: 0.2,
      release: 0.1,
    },
    volume: -15,
  }).connect(chorus);

  return synth;
};

let drums: ReturnType<typeof getDrums> | null = null;
export const loadDrums = () => {
  if (!drums) {
    drums = getDrums();
  }

  return drums;
};

const getDrums = (): Promise<Tone.Players> => {
  return new Promise((resolve) => {
    const drums = new Tone.Players({
      urls: {
        kick: "kick.wav",
        snare: "snare.wav",
        hihat: "hihat.wav",
      },
      baseUrl: "/samples/",
      volume: -16,
      fadeOut: "64n",
      onload: () => {
        resolve(drums);
      },
    });

    const reverb = new Tone.Reverb({
      decay: 5,
      preDelay: 0.05,
      wet: 0.05,
    });

    drums.chain(reverb, Tone.getDestination());
  });
};
