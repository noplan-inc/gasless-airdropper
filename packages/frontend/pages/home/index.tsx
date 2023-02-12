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
import { serialize } from "@ethersproject/transactions";

const sendPKPTransaction = async (params: {client: any, chain: string, publicKey: string, provider: providers.JsonRpcProvider, to: string, value: string, data: string, gasPrice: string, gasLimit: string}) => {
  const {client, chain, publicKey, provider, to, value, data, gasPrice, gasLimit} = params;
  if (!client.ready) {
    console.error({
      message:
        "LitNodeClient is not ready.  Please call await litNodeClient.connect() first.",
      name: "LitNodeClientNotReadyError",
      errorCode: "lit_node_client_not_ready",
    });
    return;
  }

  const chainId = LitJsSdk.LIT_CHAINS[chain].chainId;
  if (!chainId) {
    console.error({
      message: "Invalid chain.  Please pass a valid chain.",
      name: "InvalidChain",
      errorCode: "invalid_input_chain",
    });
    return;
  }

  if (!publicKey) {
    console.error({
      message: "Pubic Key not provided.  Please pass a valid Public Key.",
      name: "MissingPublicKey",
      errorCode: "missing_public_key",
    });
    return;
  }

  const authSig = {
    "sig": "0xdd290f886395b4f21881ef731864cc6ec01011258468a176abb68072b4ee669732eafc12d5e6cd60b8fa540cef72503c873d1b03931ea67137f206b0c697de421b",
    "derivedVia": "web3.eth.personal.sign",
    "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:\n0x35ae1BDaBcbAa739A95ddb8A33fA6Db5ad2EC492\n\n\nURI: http://localhost:3000/\nVersion: 1\nChain ID: 80001\nNonce: YCXlAZq0Nix4t6VZx\nIssued At: 2023-02-11T06:14:52.407Z\nExpiration Time: 2024-02-11T06:14:52.379Z",
    "address": "0x35ae1BDaBcbAa739A95ddb8A33fA6Db5ad2EC492"
  };

  const signLitTransaction = `
    (async () => {
      const fromAddress = ethers.utils.computeAddress(publicKey);
      const latestNonce = await LitActions.getLatestNonce({ address: fromAddress, chain });
      const txParams = {
        nonce: latestNonce,
        gasPrice,
        gasLimit,
        to,
        value,
        chainId,
        data,
      };
      LitActions.setResponse({ response: JSON.stringify(txParams) });
      
      const serializedTx = ethers.utils.serializeTransaction(txParams);
      const rlpEncodedTxn = ethers.utils.arrayify(serializedTx);
      const unsignedTxn =  ethers.utils.arrayify(ethers.utils.keccak256(rlpEncodedTxn));
      const sigShare = await LitActions.signEcdsa({ toSign: unsignedTxn, publicKey, sigName });
    })();
  `;

  const signResult = await client.executeJs({
    code: signLitTransaction,
    authSig,
    jsParams: {
      publicKey,
      chain,
      sigName: "sig1",
      chainId,
      to,
      value,
      data,
      gasPrice: gasPrice || "0x2e90edd000",
      gasLimit: gasLimit || "0x" + (30000).toString(16),
    },
  });

  const tx = signResult.response;
  const signature = signResult.signatures["sig1"].signature;
  const serializedTx = serialize(tx, signature);
  return provider.sendTransaction(serializedTx);
}

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const [txHash, setTxHash] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  const connectWallet = () => {
    const mint = async () => {
      setIsMinting(true);
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
        client,
        provider,
        to: erc721Address,
        value: "0x",
        data,
        chain: "mumbai",
        gasPrice: "0x2e90edd000",
        gasLimit: gas.mul(2).toHexString(),
        publicKey: '0x04cbacd8249dd6ee4428e5d8bd9153c4306d140e1488a6f44ccbed03e924716ac8078ee08fd06b948fa9a2addd17ffc7108852562333c2374944b55423f1f5645c'
      };

      const tx = await sendPKPTransaction(params);
      if (!tx) {
        alert('failed to mint');
        return;
      }
      setTxHash(tx.hash);
      setIsMinting(false);
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
              <Button p={4} m={4} onClick={() => disconnect()}>Disconnect</Button>
            </Box>
            <Box>
              <Button p={4} m={4} onClick={() => connectWallet()} disabled={isMinting}>{ isMinting?  "minting..." : "mint"}</Button>
            </Box>
          </>
        )}
        {isConnected && txHash && (
          <>
            <Box>
              {address}
              <Button p={4} m={4} onClick={() => disconnect()}>Disconnect</Button>
            </Box>
            <Image
              src="/images/kari.png"
              alt={"logo"}
              width={100}
              height={100}
            />
            こんぐらっちゅれいしょん
            <Box>
              <Link href={`https://mumbai.polygonscan.com/tx/${txHash}`} target="_blank">
                https://mumbai.polygonscan.com/tx/${txHash}
              </Link>
            </Box>
          </>
        )}
        {!isConnected && !txHash && (
          <Button p={4} m={4} onClick={() => connect()}>Connect</Button>
        )}
      </Layout>
    </Box>
  );
};

export default Home;
