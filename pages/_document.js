import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="A basic point and click game" />
        <link rel="icon" href="/scroll.png" />
        <link rel="preload" href="/baker.png" as="image" />
        <link rel="preload" href="/chest-open.png" as="image" />
        <link rel="preload" href="/chest.png" as="image" />
        <link rel="preload" href="/chicken.png" as="image" />
        <link rel="preload" href="/closed_door.png" as="image" />
        <link rel="preload" href="/dog.png" as="image" />
        <link rel="preload" href="/eggs.png" as="image" />
        <link rel="preload" href="/guard.png" as="image" />
        <link rel="preload" href="/house.png" as="image" />
        <link rel="preload" href="/hunter.png" as="image" />
        <link rel="preload" href="/open_door.png" as="image" />
        <link rel="preload" href="/player.png" as="image" />
        <link rel="preload" href="/potion.png" as="image" />
        <link rel="preload" href="/sack.png" as="image" />
        <link rel="preload" href="/scribe.png" as="image" />
        <link rel="preload" href="/scroll.png" as="image" />
        <link rel="preload" href="/shovel.png" as="image" />
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
