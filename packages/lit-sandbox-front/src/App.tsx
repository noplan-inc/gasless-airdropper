import React, { useCallback } from 'react';
import './App.css';
// @ts-ignore
import LitJsSdk from "@lit-protocol/sdk-browser";
import { providers, Contract, Wallet } from 'ethers';
import { parseEther, formatBytes32String } from 'ethers/lib/utils';

import { serialize } from "@ethersproject/transactions";

import erc20ABI from "./erc20.json";
import airdropABI  from "./airdrop-abi.json"

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

  // const authSig = await checkAndSignAuthMessage({ chain });
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


const ConnectButton: React.FC<{}> = () => {
  const sendMaticHandler = useCallback(async () => {
    const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
    await client.connect();
    console.log(client);

    const provider = new providers.StaticJsonRpcProvider('https://rpc-mumbai.maticvigil.com/');

    const params = {
      provider,
      to: '0x35ae1BDaBcbAa739A95ddb8A33fA6Db5ad2EC492', // metamask test1
      value: "0x000001",
      data: '0x',
      chain: 'mumbai',
      gasPrice: "0x2e90edd000",
      gasLimit: "0x" + (30000).toString(16),
      publicKey: '0x04cbacd8249dd6ee4428e5d8bd9153c4306d140e1488a6f44ccbed03e924716ac8078ee08fd06b948fa9a2addd17ffc7108852562333c2374944b55423f1f5645c'
    };

    const tx = await client.sendPKPTransaction(params);
    console.log(`tx`);
    console.log(tx);
  }, []);

  const transferERC20Handler = useCallback(async () => {
    const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
    await client.connect();
    console.log(client);


    const provider = new providers.StaticJsonRpcProvider('https://rpc-mumbai.maticvigil.com/');

    const erc20 = new Contract("0xe3D97fa246e0336fb365EdE880f70ED41a824052", erc20ABI, provider);
    const metamaskAddress = "0x35ae1BDaBcbAa739A95ddb8A33fA6Db5ad2EC492" // serinuntius address
    const amount = parseEther('1919');
    const data = erc20.interface.encodeFunctionData("transfer", [metamaskAddress, amount]);

    const gas = await erc20.estimateGas.transfer(metamaskAddress, amount, {from: metamaskAddress});

    const params = {
      client,
      provider,
      to: '0xe3D97fa246e0336fb365EdE880f70ED41a824052', // てきとーなERC20
      value: "0x",
      data,
      chain: 'mumbai',
      gasPrice: "0x2e90edd000",
      gasLimit: gas.mul(2).toHexString(),
      publicKey: '0x04cbacd8249dd6ee4428e5d8bd9153c4306d140e1488a6f44ccbed03e924716ac8078ee08fd06b948fa9a2addd17ffc7108852562333c2374944b55423f1f5645c'
    };


    const tx = await sendPKPTransaction(params);
    console.log(`tx`);
    console.log(tx);
  }, []);

  const airdropNftHandler = useCallback(async () => {
    const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
    await client.connect();
    console.log(client);

    const provider = new providers.StaticJsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
    
    // NFT配布先アドレス
    const metamaskAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199" // soma address
    const mintTo = "0x2ad81113A9414A1c4EfA2351fde2accaa6a79FaE"

    // https://explorer.litprotocol.com/profile にてlit.protocolのアカウント作ってpublickey作成する
    const litPublicKey = "0x" + "049dda3ebdea43fcc333e067854de5f0a9c93a7d5fb840455fd738b639de4d81fa839ff913da97fa3283bdf716d2e277e00608df497eab8650ef3a71ceec330eff"
    // airdrop contract MerkleDistributor
    
    const airdropContractAddress = "0xb1b3d3930eC3A721Db287D21c1ff0541C2Fc5849"
    const airdropContract = new Contract(airdropContractAddress, airdropABI, provider);
    
    // bytes32[] ウォレットアドレスが、ホワイトリストに入っているかどうか証明するために必要な値たち rootに辿り着くために必要なleafの片割れたち
    const merkleProof = [formatBytes32String("1"), formatBytes32String("2")]
    // ウォレットアドレスがmerkle tree配列のどの位置にあるか
    const index = 1
    // ミントする量
    const mintAmount = 1
    
    const data = airdropContract.interface.encodeFunctionData("claim", [index, metamaskAddress, mintAmount, merkleProof, "tokenuri"]);
    // const data = airdropContract.interface.encodeFunctionData("claim", [index, mintTo, mintAmount, merkleProof, "tokenuri"]);
    // const data = airdropContract.interface.encodeFunctionData("claim", [index, "0xc9b1CF19765d4DB31024AdFE09D14603cD56a476", mintAmount, merkleProof]);

    const gas = await airdropContract.estimateGas.claim(index, metamaskAddress, mintAmount, merkleProof, "tokeuri", {from: metamaskAddress});
    // const gas = await airdropContract.estimateGas.claim(index, mintTo, mintAmount, merkleProof, "tokeuri", {from: metamaskAddress});
    // const gas = await airdropContract.estimateGas.claim(index, "0xc9b1CF19765d4DB31024AdFE09D14603cD56a476", mintAmount, merkleProof, "tokeuri", {from: metamaskAddress});

  
    const params = {
      provider,
      to: airdropContractAddress, // airdrop contract address
      value: "0x",
      data,
      chain: 'mumbai',
      gasLimit: gas.toHexString(),
      publicKey: litPublicKey // soma PKP publicKey
    };

    const tx = await client.sendPKPTransaction(params);
    console.log(`tx`);
    console.log(tx);
  }, []);

  const generateAuthSig = async () => {
    const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
    await client.connect();
    const chain = "mumbai";
    const oneYear = 365;
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * oneYear).toISOString();

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain,  expiration});
    console.log(authSig);
  }

  return (<>
    <button onClick={sendMaticHandler}>send matic from lit</button>
    <button onClick={transferERC20Handler}>send ERC20 from lit</button>
    <button onClick={airdropNftHandler}>claim airdrop NFT from lit</button>
    <button onClick={generateAuthSig}>generate authSig 1year</button>
  </>);
}

function App() {
  return (
    <div className="App">
      <ConnectButton />
    </div>
  );
}

export default App;

