import React, { useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
// @ts-ignore
import LitJsSdk from "@lit-protocol/sdk-browser";
import { providers, Contract } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import erc20ABI from "./erc20.json";


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
  return (<>
    <button onClick={sendMaticHandler}>send matic from lit</button>
    <button onClick={transferERC20Handler}>send ERC20 from lit</button>
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

