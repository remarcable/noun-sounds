import * as Tone from "tone";
import { loadDrums, loadSynth, loadSynth2 } from "./instruments";
import seedRandom from "seed-random";

// XXX: Use object with get method to allow for reseeding
const random = { get: seedRandom("noun sounds") };

export const play = async (txValues, address) => {
  await Tone.start();
  const synth = loadSynth();
  const synth2 = loadSynth2();
  const drums = await loadDrums();

  random.get = seedRandom(address);

  Tone.getTransport().start();
  Tone.getTransport().bpm.value = 130;

  playBassline();
  playSynth(synth);

  playMelody(synth2, txValues);
  playDrumBeat(drums);
};

// TODO: refactor to put instrument in extra file
const playBassline = () => {
  const bassFilter = new Tone.Filter({ frequency: 600, Q: 8 });
  const bassEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.2,
    sustain: 0,
  });
  const gain = new Tone.Gain(0.2);
  const bass = new Tone.PulseOscillator("A2", 0.4)
    .chain(bassFilter, bassEnvelope, gain, Tone.getDestination())
    .start();

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

  const kickGain = new Tone.Gain(0.1);
  const kickEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.2,
    sustain: 0,
  });

  const kick = new Tone.Oscillator("A2")
    .chain(kickEnvelope, kickGain, Tone.getDestination())
    .start();

  const kickSnapEnv = new Tone.FrequencyEnvelope({
    attack: 0.005,
    decay: 0.01,
    sustain: 0,
    baseFrequency: "A2",
    octaves: 2.7,
  }).connect(kick.frequency);

  const kickPart = new Tone.Part(
    (time) => {
      kickEnvelope.triggerAttack(time);
      kickSnapEnv.triggerAttack(time);
    },
    ["0", "0:0:3", "0:2:0", "0:3:1"]
  ).start(0);

  kickPart.loop = true;
};

const playSynth = (instrument) => {
  const voicings = [
    ["F2", "F3", "A3", "C4", "E4"],
    ["G2", "F3", "A3", "C4", "E4"],
    ["C2", "C3", "E3", "G3", "B3", "E4"],
    ["D2", "D3", "F3", "A3", "C4", "E4"],
  ];

  const loop = new Tone.Loop((time) => {
    const { measure } = getPosition();
    const nextVoicing = voicings[measure % voicings.length];
    instrument.triggerAttackRelease(
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

  instrument.chain(gain, Tone.getDestination());

  return instrument;
};

const getPosition = () => {
  const position = Tone.getTransport()
    .position as Tone.Unit.BarsBeatsSixteenths;

  const [measureString, onbeatString, offbeatString] = position.split(":");

  const measure = +measureString;
  const onbeat = +onbeatString;
  const offbeat = +offbeatString.split(".")[0];

  return { measure, onbeat, offbeat };
};

const playDrumBeat = (drums) => {
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

const playMelody = (synth, txValues) => {
  // Divide by 1e16 to get something that is close to dollar values
  const transactionValues = txValues.map((val) => val / 1e16) || [];
  const measure = mapTransactionsToMelodyWithLogScaling(
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

  console.log(measure);

  const seq = new Tone.Sequence(
    (time, note) => {
      if (!note) {
        return;
      }

      console.log({ note });

      synth.triggerAttackRelease(note, "16n", time, between(0.7, 0.9));
    },
    measure,
    "8n"
  );

  seq.start(Tone.Time("2m").toSeconds());
  seq.loop = true;
};

function between(min: number, max: number) {
  const range = max - min;
  return min + random.get() * range;
}

// Function to normalize using logarithmic scaling
function logScale(value: number, minValue: number, maxValue: number): number {
  const logMin = Math.log(minValue + 1); // Avoiding log(0)
  const logMax = Math.log(maxValue + 1);
  const logValue = Math.log(value + 1); // Avoiding log(0)

  return (logValue - logMin) / (logMax - logMin);
}

const notes = [
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
  "A4",
  "B4",
  "C5",
  "D5",
  "E5",
  "F5",
  "G5",
  "A5",
  "B5",
];

export function mapTransactionsToMelodyWithLogScaling(
  transactions: number[],
  minValue: number,
  maxValue: number
): string[] {
  const melody: string[] = [];

  transactions.forEach((transactionValue) => {
    const normalizedValue = logScale(transactionValue, minValue, maxValue);
    const noteIndex = Math.floor(normalizedValue * (notes.length - 1));
    melody.push(notes[noteIndex]);
  });

  return melody;
}
