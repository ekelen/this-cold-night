import Head from "next/head";
import Image from "next/image";
import Room1 from "../components/Room1";
import { items } from "../game/setup";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Point Click Move</title>
      </Head>

      <main className={styles.main}>
        <Room1 />
      </main>

      {/* <footer className={styles.footer}>This is a game.</footer> */}
      {Object.values(items)
        .filter((item) => !!item.image)
        .map((item) => (
          <div
            style={{
              backgroundImage: `url('${item.image}')`,
              height: 0,
              width: 0,
            }}
            key={item.image}
          />
        ))}
      {["/chest-open.png", "/open_door.png"].map((image) => (
        <div
          style={{ backgroundImage: `url('${image}')`, height: 0, width: 0 }}
          key={image}
        />
      ))}
    </div>
  );
}
