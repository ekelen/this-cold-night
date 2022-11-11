import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="A basic point and click game" />
        <link rel="icon" href="/scroll-cyan.png" />
        <link rel="preload" href="/baker.png" as="image" />
        <link rel="preload" href="/chest-open.png" as="image" />
        <link rel="preload" href="/chest.png" as="image" />
        <link rel="preload" href="/closed_door.png" as="image" />
        <link rel="preload" href="/dog_2.png" as="image" />
        <link rel="preload" href="/guard.png" as="image" />
        <link rel="preload" href="/hunter.png" as="image" />
        <link rel="preload" href="/player.png" as="image" />
        <link rel="preload" href="/scroll-cyan.png" as="image" />
        <link rel="preload" href="/yellow.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
