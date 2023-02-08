import type { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Box, Button, Image } from "@chakra-ui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
// @ts-ignore
import LitJsSdk from "@lit-protocol/sdk-browser";
import { providers, Contract } from "ethers";
import erc721ABI from "../../abi/erc721.json";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const [txHash, setTxHash] = useState("");

  const connectWallet = () => {
    const mint = async () => {
      const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
      await client.connect();

      const erc721Address = "0x3A38Ff8d6276A6f26f86Add204bf9996e47dEBdc";

      const provider = new providers.StaticJsonRpcProvider(
        "https://rpc-mumbai.maticvigil.com/"
      );
      const erc20 = new Contract(erc721Address, erc721ABI, provider);

      const data = erc20.interface.encodeFunctionData("safeMint", [
        address,
        "uri",
      ]);

      const gas = await erc20.estimateGas.safeMint(address, "uri", {
        from: address,
      });

      const params = {
        provider,
        to: erc721Address,
        value: "0x",
        data,
        chain: "mumbai",
        gasLimit: gas.mul(2).toHexString(),
        publicKey:
          "0x047084a7474e2e939e7b1794f30ec6eb0d64cbc2cb8a00a75987bde726742af5a8d6c109941ecca2d6ef6694430ecea5dbc09f47383fc8145ef9ab215f9f1aa928",
      };

      const tx = await client.sendPKPTransaction(params);
      setTxHash(tx.hash);
    };
    return mint();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Layout>
        {isConnected && !txHash && (
          <>
            <Box>
              {address}
              <Button onClick={() => disconnect()}>Disconnect</Button>
            </Box>
            <Box>
              <Button onClick={() => connectWallet()}>mint</Button>
            </Box>
          </>
        )}
        {isConnected && txHash && (
          <>
            <Box>
              {address}
              <Button onClick={() => disconnect()}>Disconnect</Button>
            </Box>
            <Image
              src="/images/kari.png"
              alt={"logo"}
              width={100}
              height={100}
            />
            こんぐらっちゅれいしょん
            <Box>
              <Link href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
                https://mumbai.polygonscan.com/tx/${txHash}
              </Link>
            </Box>
          </>
        )}
        {!isConnected && !txHash && (
          <Button onClick={() => connect()}>Connect</Button>
        )}
      </Layout>
    </Box>
  );
};

export default Home;
