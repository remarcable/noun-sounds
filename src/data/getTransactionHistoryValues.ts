"use server";

export const getTransactionHistoryValues = async (address: string) => {
  const response = await fetch(
    `https://eth.blockscout.com/api/v2/addresses/${address}/transactions`
  );
  const { items } = await response.json();

  if (!items) {
    return [];
  }

  return items.map((i) => i.value);
};
