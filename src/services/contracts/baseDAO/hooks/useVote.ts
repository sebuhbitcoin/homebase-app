import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { doDAOVote } from "services/contracts/baseDAO";
import { VoteParams } from "services/contracts/baseDAO/types";
import { connectIfNotConnected } from "services/contracts/utils";

type UseVoteParams = Omit<VoteParams, "tezos">;

export const useVote = async () => {
  const queryClient = useQueryClient();
  const { tezos, connect } = useTezos();

  await connectIfNotConnected(tezos, connect);

  return useMutation<TransactionWalletOperation, Error, UseVoteParams>(
    async (params) => {
      return await doDAOVote({
        ...params,
        tezos,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("votes");
      },
    }
  );
};
