import * as Tone from "tone";

export const getPosition = () => {
  const position = Tone.getTransport()
    .position as Tone.Unit.BarsBeatsSixteenths;

  const [measureString, onbeatString, offbeatString] = position.split(":");

  const measure = +measureString;
  const onbeat = +onbeatString;
  const offbeat = +offbeatString.split(".")[0];

  return { measure, onbeat, offbeat };
};

export function between(
  min: number,
  max: number,
  random: { get: () => number }
) {
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
  return transactions.map((transactionValue) => {
    const normalizedValue = logScale(transactionValue, minValue, maxValue);
    const noteIndex = Math.floor(normalizedValue * (notes.length - 1));
    return notes[noteIndex];
  });
}
