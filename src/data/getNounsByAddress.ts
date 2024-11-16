"use server";

import { NOUN_SMART_CONTRACT_ADDRESS } from "@/lib/constants";

export const getNounsByAddress = async (address: string) => {
  const response = await fetch(
    `https://eth.blockscout.com/api/v2/addresses/${address}/nft`
  );
  const { items: nfts } = await response.json();

  if (!nfts) {
    return [];
  }

  const nouns = nfts.filter(
    // @ts-expect-error Ignore for now
    (nft) => nft.token.address === NOUN_SMART_CONTRACT_ADDRESS
  );

  return nouns;
};
