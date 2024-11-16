import * as Tone from "tone";
// import { loadSynth } from "./instruments";

export const play = async () => {
  await Tone.start();
  // const synth = loadSynth();

  Tone.getTransport().start();
  Tone.getTransport().bpm.value = 130;

  playBassline();
};

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
