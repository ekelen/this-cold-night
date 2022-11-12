import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Room1 from "../components/Room1";
import Room2 from "../components/Room2";
import { room1 } from "../game/rooms/room1Data";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [room, setRoom] = useState("room1");

  const onChangeRoom = () => {
    setRoom(room === "room1" ? "room2" : "room1");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Game</title>
      </Head>

      <main className={styles.main}>
        {room === "room1" ? (
          <Room1 onUpdateRoom={onChangeRoom} />
        ) : room === "room2" ? (
          <Room2 />
        ) : null}
        <footer className={styles.footer}>
          <p>by</p>
          <a href="https://github.com/ekelen" target="_blank" rel="noreferrer">
            <Image src="/github.svg" height={10} width={10} alt="github" />
            ekelen
          </a>
        </footer>
      </main>

      {Object.values(room1.items)
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
