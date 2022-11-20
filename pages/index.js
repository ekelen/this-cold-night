import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Room from "../components/Room";
import { CONTAINER_IMAGES } from "../game/constants";
import { castleReturn } from "../game/rooms/castleReturnData";
import { forest } from "../game/rooms/forestData";
import { room1 } from "../game/rooms/room1Data";
import { room2 } from "../game/rooms/room2Data";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [room, setRoom] = useState("room1");

  const onChangeRoom = () => {
    setRoom((prev) =>
      prev === "room1"
        ? "room2"
        : prev === "room2"
        ? "forest"
        : prev === "forest"
        ? "castleReturn"
        : "room1"
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
                ? room1
                : room === "forest"
                ? forest
                : room === "castleReturn"
                ? castleReturn
                : room2
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
        ...Object.values(room1.containers),
        ...Object.values(room2.containers),
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
