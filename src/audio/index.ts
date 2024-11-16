import * as Tone from "tone";
import seedRandom from "seed-random";

import {
  getBass,
  getKick,
  getDrums,
  getHarmonySynth,
  getMelodySynth,
} from "./instruments";
import {
  between,
  getPosition,
  mapTransactionsToMelodyWithLogScaling,
} from "./helpers";

// XXX: Use object with get method to allow for reseeding
const random = { get: seedRandom("noun sounds") };

export const play = async (txValues: number[], address: string) => {
  await Tone.start();
  const harmonySynth = getHarmonySynth();
  const melodySynth = getMelodySynth();
  const drums = await getDrums();
  const bass = getBass();
  const kick = getKick();

  random.get = seedRandom(address);

  Tone.getTransport().start();
  Tone.getTransport().bpm.value = 130;

  playBassline(bass, kick);
  playHarmonies(harmonySynth);
  playMelody(melodySynth, txValues);
  playDrumBeat(drums);
};

const playBassline = (
  { bass, bassEnvelope }: ReturnType<typeof getBass>,
  { kickSnapEnv, kickEnvelope }: ReturnType<typeof getKick>
) => {
  const bassPart = new Tone.Part(
    (time, note) => {
      bass.frequency.setValueAtTime(note, time);
      bassEnvelope.triggerAttack(time);
    },
    [
      ["0:0", "A1"],
      ["0:2", "G1"],
      ["0:2:2", "C2"],
      ["0:3:2", "A1"],
    ]
  ).start(0);

  bassPart.loop = true;

  const kickPart = new Tone.Part(
    (time) => {
      kickEnvelope.triggerAttack(time);
      kickSnapEnv.triggerAttack(time);
    },
    ["0", "0:0:3", "0:2:0", "0:3:1"]
  ).start(0);

  kickPart.loop = true;
};

const playHarmonies = (harmonySynth: ReturnType<typeof getHarmonySynth>) => {
  const voicings = [
    ["F2", "F3", "A3", "C4", "E4"],
    ["G2", "F3", "A3", "C4", "E4"],
    ["C2", "C3", "E3", "G3", "B3", "E4"],
    ["D2", "D3", "F3", "A3", "C4", "E4"],
  ];

  const loop = new Tone.Loop((time) => {
    const { measure } = getPosition();
    const nextVoicing = voicings[measure % voicings.length];
    harmonySynth.triggerAttackRelease(
      nextVoicing,
      "16n",
      Tone.Time("4n").toSeconds() + time
    );
  }, "1m");

  loop.start(Tone.Time("4m").toSeconds());

  Tone.getTransport().scheduleOnce(() => {
    gain.gain.rampTo(1, 2);
  }, Tone.Time("1m").toSeconds());

  const gain = new Tone.Gain(0);

  harmonySynth.chain(gain, Tone.getDestination());
};

const playDrumBeat = (drums: Awaited<ReturnType<typeof getDrums>>) => {
  const loop = new Tone.Loop((time) => {
    const { measure, onbeat, offbeat } = getPosition();

    if (offbeat === 0) {
      drums.player("hihat").start(time, 0, "8n");
    }

    if (onbeat === 0 && offbeat === 0) {
      drums.player("kick").start(time, 0, "4n");
    }

    if (measure % 2 === 1 && onbeat === 1 && offbeat === 2) {
      drums.player("kick").start(time, 0, "4n");
    }

    if (onbeat === 2 && offbeat === 0) {
      drums.player("snare").start(time, 0, "2n");
    }
  }, "8n");

  loop.start(Tone.Time("8m").toSeconds());
};

type NestedMelodyArray = Array<string | null | NestedMelodyArray>;
const playMelody = (
  synth: ReturnType<typeof getMelodySynth>,
  txValues: number[]
) => {
  // Divide by 1e16 to get something that is close to dollar values
  const transactionValues = txValues.map((val) => val / 1e16) || [];
  const measure: NestedMelodyArray = mapTransactionsToMelodyWithLogScaling(
    transactionValues,
    0,
    10000
  );

  for (let index = 0; index < Math.floor(measure.length / 16); index++) {
    const index1 = Math.floor(random.get() * measure.length);
    measure[index1] = [null, measure[index1]];

    const index2 = Math.floor(random.get() * measure.length);
    measure[index2] = [null, measure[index2]];

    const index3 = Math.floor(random.get() * measure.length);
    measure[index3] = null;
  }

  while (measure.length % 16 !== 0) {
    measure.push(null);
  }

  console.log({ measure });

  const seq = new Tone.Sequence(
    (time, note) => {
      if (!note) {
        return;
      }

      synth.triggerAttackRelease(note, "16n", time, between(0.7, 0.9, random));
    },
    measure,
    "8n"
  );

  seq.start(Tone.Time("2m").toSeconds());
  seq.loop = true;
};
