# Gasless-Airdropper

https://gasless-airdropper.vercel.app/

**ガス代無料の Air Dropper**

## 概要

https://www.canva.com/design/DAFZ_eLoFgo/ICO3g2xu8Ssr_0Bv0Z38wQ/view?utm_content=DAFZ_eLoFgo&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink#1

## アプリケーションの起動方法

```
cd packages/frontend
```

```
yarn install --frozen-lockfile
```

`http://localhost:3000/` へアクセス。


## 詳細情報

### `packages/frontend`

- フロントエンドアプリケーション。

### `packages/contract`
- コントラクト

    - エアドロップコントラクト(MerkleDistributor.sol)
        - マークルツリーによって保存されたホワイトリスト登録されたアドレスへNFTをミントするコントラクト

        - **mumbaiネットワークでのみ登録しなくてもミントできる仕様(ハッカソンのデモ用)**

    - NFTコントラクト(Nft.sol)
        - エアドロップによって送付されるERC721トークン


### 使用した tech stacks

_Frontend_

- Next.js
- wagmi.sh
- GraphQL

_Smartcontract_

- Solidity
- Foundry
- OpenZeppelin

### 使用した 分散型インフラサービス

- The Graph
- Lit Protocol
- Arweave

### deploy した Contract(Explorer で OK）

[Airdrop](https://mumbai.polygonscan.com/address/0xb1b3d3930ec3a721db287d21c1ff0541c2fc5849)

[NFT](https://mumbai.polygonscan.com/address/0xae1294597e6fb5eea6ccef498ed736de9573d677)

