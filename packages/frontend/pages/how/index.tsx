import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "@/components/header";

const How: NextPage = () => {
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
        <Header />
        仕組み
      </main>
    </>
  );
};

export default How;
