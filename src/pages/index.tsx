import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div>
          {isConnected ? (
            <h1 className="text-4xl font-bold">Hi!</h1>
          ) : (
            <h1 className="text-4xl font-bold">App Title</h1>
          )}
        </div>
        <ConnectButton />
      </main>
    </>
  );
}
