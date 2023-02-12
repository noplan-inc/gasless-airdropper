import { gql } from "@apollo/client";

export const getTokenList = gql`
  {
    transfers(orderBy: blockTimestamp) {
      to
      tokenId
    }
  }
`;
