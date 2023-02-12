import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/janken58/gasless-airdropper",
  cache,
});

const client = createClient({
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </ApolloProvider>
  );
}
