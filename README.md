# [Noun Sounds](https://www.nounsounds.xyz/)

_Noun Sounds_ transforms your Ethereum transaction history into music, offering a new way to explore your blockchain activity. Enter your ENS name or wallet address, and listen to sounds that uniquely tell _your_ onchain story.

What makes _Noun Sounds_ special is its ability to algorithmically generate audio entirely within your browser. This isn’t just another visual dashboard; it’s a fully synthesized, interactive soundscape that lets you _hear_ your blockchain history.

**Why Audio?**

Audio isn’t just aesthetic – it’s powerful. Unlike visuals, music can layer multiple dimensions of data at once, allowing you to grasp patterns and anomalies intuitively. It’s a tool for both discovery and creativity.

This might look like different instruments representing different dimensions of the data:

- **Piano:** Transaction amounts
- **Drums:** Gas usage
- **Strings:** Network activity
- **Horns:** Smart contract interactions
- **Synths:** Extracted MEV

While _Noun Sounds_ currently only represents transaction values, it aims to incorporate the other dimensions above in future versions.

Currently, _Noun Sounds_ provides a consistent backing track for each Noun. Future iterations will personalize the music even further, creating distinct sounds based on the unique traits of each Nouns. If you own multiple Nouns, you’d get an evolving soundtrack that changes as your collection grows.

## How It's Made

At its core, the project checks if your Ethereum address owns a Noun NFT. If it does, it queries your transaction history, extracting the values of each transaction. These values are then transformed into a melody, turning your financial data into an audible narrative.

### Generating Music

**Mapping Values to Melody:**
Low-value transactions are represented by low notes, while high-value transactions create higher notes. Through experimentation, we discovered that most transactions tend to cluster at lower values. To capture this subtlety, transaction values are scaled logarithmically, giving greater nuance to the lower spectrum.

**Musical Framework:**
Notes are mapped to the **C major scale**, providing a familiar and harmonious base for the melodies. A random but repeatable rhythm is generated using a seeded random generator, ensuring that every melody is unique to its Noun while remaining consistent on playback.

**Backing Tracks:**
A pre-programmed beat adds bass lines and harmonies. The rhythm is crafted around **16th notes**, creating an energetic, funky groove that complements the melody. If a user’s transaction history is limited, the song seamlessly loops, creating an endless and cohesive listening experience.

### Tooling

**Audio Generation:**
The sounds are synthesized and scheduled using [Tone.js](https://github.com/Tonejs/Tone.js), a Web Audio framework designed for creating interactive music directly in the browser.

**Onchain Queries:**
All blockchain data – whether it’s confirming Noun NFT ownership or fetching transaction details—is sourced using [Blockscout](https://blockscout.com/), ensuring real-time accuracy and reliability.

**Tech Stack:**
The project is built with **TypeScript** and **Next.js**, uses **Tailwind CSS** for styling and **shadcn/ui** for shared components.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
