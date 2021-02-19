import { API_URL } from "..";
import { Network } from "../../beacon/context";
import { dtoToLedger } from "./mappers";
import { Ledger, LedgerDTO } from "./types";

export const getLedgerAddresses = async (
  ledgerMapNumber: number,
  network: Network
): Promise<Ledger> => {
  const url = `${API_URL}/bigmap/${network}/${ledgerMapNumber}/keys`;

  const response = await fetch(url);

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to fetch ledger addresses from BakingBad API");
  }

  const result: LedgerDTO = await response.json();

  return dtoToLedger(result);
};
