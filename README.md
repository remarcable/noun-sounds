# [Noun Sounds](https://www.nounsounds.xyz/)

_Noun Sounds_ transforms your Ethereum journey into a symphony, offering a groundbreaking way to explore your blockchain activity. Enter your ENS name or wallet address, and watch as data becomes art—sounds that uniquely tell _your_ story.

What makes _Noun Sounds_ special is its ability to algorithmically generate audio entirely within your browser. This isn’t just another visual dashboard; it’s a fully synthesized, interactive soundscape that lets you _hear_ your blockchain history.

But this isn’t just about music. It’s about expanding what’s possible.

**From Visuals to Sound: Expanding the Noun Identity**

We know the [Nouns brand](https://nouns.wtf/) as a visual icon, but with _Noun Sounds_, we take it to a new dimension—one you can hear. By sonifying on-chain data, _Noun Sounds_ creates a connection that’s both artistic and personal.

**Why Audio?**

Audio isn’t just aesthetic—it’s powerful. Unlike visuals, music can layer multiple dimensions of data at once, allowing you to grasp patterns and anomalies intuitively. It’s a tool for both discovery and creativity.

Imagine this:

- **Piano:** Transaction amounts
- **Drums:** Gas usage
- **Strings:** Network activity
- **Horns:** Smart contract interactions
- **Synths:** Extracted MEV

The result? A rich, dynamic composition where blockchain data becomes an orchestra. _Noun Sounds_ currently only represents transaction values, but aims to incorporate the other dimensions in later versions.

**A Vision for the Future**

Currently, _Noun Sounds_ generates music in real-time, providing a consistent backing track for each Noun. But this is just the beginning. Future iterations will personalize the music even further, creating distinct sounds based on the unique traits of your Nouns. Own multiple Nouns? You’ll get an evolving soundtrack that changes as your collection grows.

**Why It Matters**

_Noun Sounds_ balances art and utility, turning raw data into something meaningful, fun, and downright beautiful. Whether you’re a blockchain enthusiast, a data scientist, or simply someone who loves music, _Noun Sounds_ invites you to experience Ethereum in a whole new way.

Plug in your address. Tune into your history. Hear the blockchain come alive.

## How It's Made

At its core, the project checks if your Ethereum address owns a Noun NFT. If it does, it queries your transaction history, extracting the values of each transaction. These values are then transformed into a melody, turning your financial data into an audible narrative.

### Generating Music

**Mapping Values to Melody:**
Low-value transactions are represented by low notes, while high-value transactions create higher notes. Through experimentation, I discovered that most transactions tend to cluster at lower values. To capture this subtlety, transaction values are scaled logarithmically, giving greater nuance to the lower spectrum.

**A Musical Framework:**
Notes are mapped to the **C major scale**, providing a familiar and harmonious base for the melodies. A random but repeatable rhythm is generated using a seeded random generator, ensuring that every melody is unique to its Noun while remaining consistent on playback.

**Dynamic Backing Tracks:**
To enhance the experience, a pre-programmed beat adds bass lines and harmonies. The rhythm is crafted around **16th notes**, creating an energetic, funky groove that complements the melody. If a user’s transaction history is limited, the song seamlessly loops, creating an endless and cohesive listening experience.

### Tooling

**Audio Generation:**
The sounds are synthesized and scheduled using **Tone.js**, a powerful Web Audio framework designed for creating interactive music directly in the browser.

**On-Chain Queries:**
All blockchain data—whether it’s confirming Noun NFT ownership or fetching transaction details—is sourced using **Blockscout**, ensuring real-time accuracy and reliability.

**Tech Stack:**
Built with **TypeScript** and **Next.js**, the project uses **Tailwind CSS** for styling and **shadcn/ui** for shared components, combining modern web development tools with sleek, responsive design.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
