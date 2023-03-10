import Link from "next/link";
import { Image } from "@chakra-ui/react";
import { Box, Button } from "@chakra-ui/react";

export const Header = () => {
  return (
    <header>
      <Box>
        <Button>
          <Link href="/list">List</Link>
        </Button>
        <Button>
          <Link href="/home">Home</Link>
        </Button>
        <Button>
          <Link href="/how">How</Link>
        </Button>
      </Box>
      <Box>
        <Image src="/images/kari.png" alt={"logo"} width={100} height={100} />
      </Box>
      <Box>
        <Link href="/how">仕組みの解説はこちら</Link>
      </Box>
    </header>
  );
};
