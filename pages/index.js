import { isEqual, uniqWith } from "lodash";
import Head from "next/head";
import Image from "next/image";
import PF from "pathfinding";
import { useEffect, useRef, useState } from "react";
import Room1 from "../components/Room1";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Point Click Move</title>
        <meta name="description" content="Click and move" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Room1 />
      </main>

      <footer className={styles.footer}>This is a game.</footer>
    </div>
  );
}
