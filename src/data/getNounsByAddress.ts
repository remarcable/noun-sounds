import { NOUN_SMART_CONTRACT_ADDRESS } from "@/lib/constants";

export const getNounsByAddress = async (address: string) => {
  const response = await fetch(
    `https://eth.blockscout.com/api/v2/addresses/${address}/nft/collections`
  );
  const x = await response.json();
  const { items } = x;

  if (!items) {
    return [];
  }

  const nouns = items.find(
    (item) => item?.token?.address === NOUN_SMART_CONTRACT_ADDRESS
  );

  if (!nouns) {
    return [];
  }

  return nouns.token_instances;
};
