import React, { useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
// @ts-ignore
import LitJsSdk, { checkAndSignAuthMessage } from "@lit-protocol/sdk-browser";
import { providers, Contract } from 'ethers';
import { parseEther, formatBytes32String } from 'ethers/lib/utils';

import erc20ABI from "./erc20.json";
import airdropABI  from "./airdrop-abi.json"
import sign from "./sign.json"

class LitClient extends LitJsSdk.LitNodeClient {
  // let ready;
  constructor(config:any){
    super(config)
  }

  async connect(){
    await super.connect()
  }

  async sendPKPTransaction({
    provider,
    to,
    value,
    data,
    chain,
    publicKey,
    gasPrice,
    gasLimit,
  }: any) {
    const signResult = await this.signPKPTransaction({
      to,
      value,
      data,
      gasPrice,
      gasLimit,
      chain,
      publicKey,
    });

    const tx = signResult.response;
    const signature = signResult.signatures["sig1"].signature;
    const serializedTx = super.serialize(tx, signature);
    return provider.sendTransaction(serializedTx);
  }

  async signPKPTransaction({
    to,
    value,
    data,
    chain,
    publicKey,
    gasPrice,
    gasLimit,
  }: any) {
    // if (!super.ready) {
    //   super.throwError({
    //     message:
    //       "LitNodeClient is not ready.  Please call await litNodeClient.connect() first.",
    //     name: "LitNodeClientNotReadyError",
    //     errorCode: "lit_node_client_not_ready",
    //   });
    // }
    console.log(super.LIT_CHAINS)
    console.log(super.LIT_CHAINS)

    // const chainId = await super.LIT_CHAINS[chain].chainId;
    const chainId = 80001;
    // if (!chainId) {
    //   super.throwError({
    //     message: "Invalid chain.  Please pass a valid chain.",
    //     name: "InvalidChain",
    //     errorCode: "invalid_input_chain",
    //   });
    // }

    // if (!publicKey) {
    //   super.throwError({
    //     message: "Pubic Key not provided.  Please pass a valid Public Key.",
    //     name: "MissingPublicKey",
    //     errorCode: "missing_public_key",
    //   });
    // }

    // const authSig = await checkAndSignAuthMessage({ 
    //   to: to,
    //   value: value,
    //   data: data,
    //   publicKey: publicKey,
    //   gasPrice: gasPrice,
    //   gasLimit: gasLimit,
    //   chain: chain,
    //   expiration: new Date(Date.now() + 24 * 60 * 60 * 500).toISOString() 
    // });
    // console.log("authSig")
    // console.log(authSig)
    // return;

    const authSig = sign

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

    return await super.executeJs({
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
  }


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
      provider,
      to: '0xe3D97fa246e0336fb365EdE880f70ED41a824052', // てきとーなERC20
      value: "0x",
      data,
      chain: 'mumbai',
      gasLimit: gas.mul(10).toHexString(),
      publicKey: '0x04cbacd8249dd6ee4428e5d8bd9153c4306d140e1488a6f44ccbed03e924716ac8078ee08fd06b948fa9a2addd17ffc7108852562333c2374944b55423f1f5645c'
    };

    const tx = await client.sendPKPTransaction(params);
    console.log(`tx`);
    console.log(tx);
  }, []);

  const airdropNftHandler = useCallback(async () => {
    const client = new LitClient({ litNetwork: "serrano" });
    await client.connect();
    console.log(client);
    console.log("client.authSig")
    // console.log(await client.authSig)
    // let auth = checkAndSignAuthMessage()
    console.log("auth")
    // client.signPKPTransaction(
    //   { 
    //     to: "0x4EFA4f689d11d94DfF747Cd3dc2cC92717a91055",
    //     value: "000",
    //     data: "000",
    //     chain: "mumbai",
    //     publicKey: "0x049dda3ebdea43fcc333e067854de5f0a9c93a7d5fb840455fd738b639de4d81fa839ff913da97fa3283bdf716d2e277e00608df497eab8650ef3a71ceec330eff",
    //     gasPrice: "000",
    //     gasLimit: "000",
    //   }
    //   )
    // console.log(auth)

    // return;


    const provider = new providers.StaticJsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
    // airdrop contract MerkleDistributor
    const airdropContractAddress = "0x4EFA4f689d11d94DfF747Cd3dc2cC92717a91055"
    const airdropContract = new Contract(airdropContractAddress, airdropABI, provider);
    // NFT配布先アドレス
    const metamaskAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199" // soma address
    const amount = parseEther('1919');
    // bytes32[] ウォレットアドレスが、ホワイトリストに入っているかどうか証明するために必要な値たち rootに辿り着くために必要なleafの片割れたち
    const merkleProof = [formatBytes32String("1"), formatBytes32String("2")]
    // ウォレットアドレスがmerkle tree配列のどの位置にあるか
    const index = 1
    // ミントする量
    const mintAmount = 1
    
    const data = airdropContract.interface.encodeFunctionData("claim", [index, "0xc9b1CF19765d4DB31024AdFE09D14603cD56a476", mintAmount, merkleProof]);
    // const data = airdropContract.interface.encodeFunctionData("claim", [index, metamaskAddress, mintAmount, merkleProof]);

    // const gas = await airdropContract.estimateGas.claim(index, metamaskAddress, mintAmount, merkleProof, {from: metamaskAddress});
    const gas = await airdropContract.estimateGas.claim(index, "0xc9b1CF19765d4DB31024AdFE09D14603cD56a476", mintAmount, merkleProof, {from: metamaskAddress});

    const params = {
      provider,
      to: airdropContractAddress, // airdrop contract address
      value: "0x",
      data,
      chain: 'mumbai',
      gasLimit: gas.mul(2).toHexString(),
      publicKey: '0x049dda3ebdea43fcc333e067854de5f0a9c93a7d5fb840455fd738b639de4d81fa839ff913da97fa3283bdf716d2e277e00608df497eab8650ef3a71ceec330eff' // soma PKP publicKey
    };

    const tx = await client.sendPKPTransaction(params);
    console.log(`tx`);
    console.log(tx);
  }, []);

  return (<>
    <button onClick={sendMaticHandler}>send matic from lit</button>
    <button onClick={transferERC20Handler}>send ERC20 from lit</button>
    <button onClick={airdropNftHandler}>claim airdrop NFT from lit</button>
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

