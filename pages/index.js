import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Room from "../components/Room";
import { CONTAINER_IMAGES } from "../game/constants";
import { castleReturn } from "../game/rooms/castleReturnData";
import { forest } from "../game/rooms/forestData";
import { castle } from "../game/rooms/castleData";
import { village } from "../game/rooms/villageData";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [room, setRoom] = useState("room1");

  const onChangeRoom = () => {
    setRoom((prev) =>
      prev === "castle"
        ? "village"
        : prev === "village"
        ? "forest"
        : prev === "forest"
        ? "castleReturn"
        : "castle"
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>This Cold Night</title>
      </Head>

      <main className={styles.main}>
        {!room ? null : (
          <Room
            room={
              room === "room1"
                ? castle
                : room === "forest"
                ? forest
                : room === "castleReturn"
                ? castleReturn
                : village
            }
            onLevelComplete={onChangeRoom}
            key={room}
          />
        )}
        <footer className={styles.footer}>
          <p>by</p>
          <a href="https://github.com/ekelen" target="_blank" rel="noreferrer">
            <Image src="/github.svg" height={10} width={10} alt="github" />
            ekelen
          </a>
        </footer>
      </main>

      {[
        ...Object.values(castle.containers),
        ...Object.values(village.containers),
        ...Object.values(forest.containers),
        ...Object.values(castleReturn.containers),
      ]
        .filter((item) => !!item.image)
        .map((item, i) => (
          <div
            style={{
              backgroundImage: `url('${item.image}')`,
              height: 0,
              width: 0,
            }}
            key={item.image + `_${i}`}
          />
        ))}
      {Object.values(CONTAINER_IMAGES)
        .flatMap((obj) => Object.values(obj))
        .map((image, i) => (
          <div
            style={{ backgroundImage: `url('${image}')`, height: 0, width: 0 }}
            key={image + `_${i}`}
          />
        ))}
    </div>
  );
}
