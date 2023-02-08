import type { NextPage } from "next";
import { Layout } from "@/components/Layout";
import { Box } from "@chakra-ui/react";

const List: NextPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Layout>MintされたToken一覧</Layout>
    </Box>
  );
};

export default List;
