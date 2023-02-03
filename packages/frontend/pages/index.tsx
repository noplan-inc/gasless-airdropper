import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

export default function Top() {
  return (
    <>
      <Head>
        <title>gasless airdoropper</title>
        <meta name="description" content="gasless airdoropper application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* TODO: add favicon */}
        {/* <link rel="icon" href="/" /> */}
      </Head>
      <main>
        <div>Hellow World</div>
      </main>
    </>
  );
}
