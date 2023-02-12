import Link from "next/link";
import { Image } from "@chakra-ui/react";
import { Box, Button } from "@chakra-ui/react";

export const Layout = ({ children }: any) => {
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button p={4} mx={8} my={16}>
          <Link href="/list">List</Link>
        </Button>
        <Button p={4} mx={8} my={16}>
          <Link href="/home">Home</Link>
        </Button>
        <Button p={4} mx={8} my={16}>
          <Link href="/how">How</Link>
        </Button>
      </Box>
      <Box>
        <Image src="/images/logo.png" alt={"logo"} width={100} height={100} />
      </Box>
      <Box>
        <Link href="/how">仕組みの解説はこちら</Link>
      </Box>
      {children}
    </>
  );
};
