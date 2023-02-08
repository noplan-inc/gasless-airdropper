import type { NextPage } from "next";
import { Layout } from "@/components/Layout";
import { Box } from "@chakra-ui/react";

const How: NextPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Layout>仕組み</Layout>
    </Box>
  );
};

export default How;
