import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "@/components/header";

const List: NextPage = () => {
  return (
    <>
      <main>
        <Header />
        MintされたToken一覧
      </main>
    </>
  );
};

export default List;
