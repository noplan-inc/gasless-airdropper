//@ts-ignore
import LitJsSdk from "@lit-protocol/sdk-nodejs";

import {Wallet} from "ethers";
import * as siwe from "siwe";

// 0x38C50D0d825b492f423d1eb9Af5ACF6B81c02358
const pubkey = "04cbacd8249dd6ee4428e5d8bd9153c4306d140e1488a6f44ccbed03e924716ac8078ee08fd06b948fa9a2addd17ffc7108852562333c2374944b55423f1f5645c";

const generateAuthSig = async () => {
    const wallet = Wallet.createRandom();

    const domain = "localhost";
    const origin = "https://localhost/login";
    const statement =
        "This is a test statement.  You can put anything you want here.";


    const siweMessage = new siwe.SiweMessage({
        domain,
        address: wallet.address,
        statement,
        uri: origin,
        version: "1",
        chainId: 1,
    });

    const messageToSign = siweMessage.prepareMessage();

    const signature = await wallet.signMessage(messageToSign);

    console.log("signature", signature);

    const authSig = {
        sig: signature,
        derivedVia: "web3.eth.personal.sign",
        signedMessage: messageToSign,
        address: wallet.address,
    };

    console.log("authSig", authSig);

    return authSig;
}



const main = async () => {

    const litNodeClient = new LitJsSdk.LitNodeClient({
        alertWhenUnauthorized: false,
    });
    await litNodeClient.connect();

    // const authSig = await generateAuthSig();
    // console.log()


}

main().catch((err) => {
    console.error(err);
})