import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Box, Image } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { getTokenList } from "../../graphql/getTokenList";
import { providers, Contract } from "ethers";
import nftABI from "../../abi/nft.json";
import axios from "axios";

const List: NextPage = () => {
  const { loading, error, data } = useQuery(getTokenList);
  const [imageList, setImageList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    (async () => {
      if (loading || error) return;
      let lastTokenId = 0;
      data.transfers.forEach((element: { tokenId: number }) => {
        const tokenId = Number(element.tokenId);
        lastTokenId = tokenId > lastTokenId ? element.tokenId : lastTokenId;
      });

      const provider = new providers.StaticJsonRpcProvider(
        "https://rpc-mumbai.maticvigil.com/"
      );

      const erc721 = new Contract(
        "0xae1294597e6FB5eeA6cCEf498ED736de9573d677",
        nftABI,
        provider
      );

      const image: JSX.Element[] = [];
      for (let i = 0; lastTokenId >= i; i++) {
        const metaDataUri: string = await erc721.tokenURI(i);
        try {
          const res = await axios.get(metaDataUri, {
            timeout: 5000,
          });
          image.push(
            <Image
              src={res.data.image}
              alt={"logo"}
              width={100}
              height={100}
              p={4}
              mx={8}
              my={16}
            />
          );
          setImageList([...imageList, ...image]);
        } catch (error: any) {
          console.error(error);
        }
      }
    })();
  }, [data, error, loading]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Layout>List of minted TOKEN</Layout>
        <Box width={250}>{imageList}</Box>
      </Box>
    </>
  );
};

export default List;
