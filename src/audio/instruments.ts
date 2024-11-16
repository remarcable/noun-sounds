import * as Tone from "tone";

export const getHarmonySynth = () => {
  const synthReverb = new Tone.Reverb({
    decay: 5,
    preDelay: 0.05,
    wet: 0.4,
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

export const getDrums = (): Promise<Tone.Players> => {
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

export const getMelodySynth = () => {
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
      type: "fmsine2",
    },
    envelope: {
      attack: 0.01,
      sustain: 0.2,
      release: 0.4,
    },
    volume: -6,
  }).connect(chorus);

  return synth;
};

export const getBass = () => {
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

  return { bass, bassEnvelope };
};

export const getKick = () => {
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

  return { kickSnapEnv, kickEnvelope };
};
