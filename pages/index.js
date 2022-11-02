import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import PF from "pathfinding";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isEqual, uniqWith } from "lodash";

const cellLen = 40;
const gridWidth = 15;
const gridHeight = 15;
const pxPerFrame = cellLen * 0.25;

const lookLeft = (x, y) => [Math.max(0, x - 1), y];
const lookRight = (x, y) => [Math.min(gridWidth - 1, x + 1), y];
const lookUp = (x, y) => [x, Math.max(0, y - 1)];
const lookDown = (x, y) => [x, Math.min(gridHeight - 1, y + 1)];
const grid = new PF.Grid(gridWidth, gridHeight);
const finder = new PF.AStarFinder(grid);
grid.getNodeAt(2, 2).walkable = false;
grid.getNodeAt(2, 6).walkable = false;
grid.getNodeAt(3, 7).walkable = false;

grid.getNodeAt(5, 5).walkable = false;
grid.getNodeAt(5, 6).walkable = false;
grid.getNodeAt(5, 7).walkable = false;

grid.getNodeAt(8, 9).walkable = false;
grid.getNodeAt(9, 9).walkable = false;
grid.getNodeAt(5, 9).walkable = false;

grid.getNodeAt(7, 2).walkable = false;
grid.getNodeAt(7, 3).walkable = false;
grid.getNodeAt(0, 4).walkable = false;
grid.getNodeAt(8, 4).walkable = false;

const getPath = (currentX, currentY, _x, _y) => {
  const path = finder.findPath(currentX, currentY, _x, _y, grid.clone());
  return path;
};

const shouldOpenChest = (currentX, currentY, _grid) => {
  try {
    const neighbors = [lookDown, lookUp, lookLeft, lookRight].map((fn) => {
      const [x, y] = fn(currentX, currentY);
      return _grid.getNodeAt(x, y);
    });
    return neighbors.filter((node) => !node.walkable);
  } catch (e) {
    console.log(`[=] e`, e);
    return [];
  }
};

export default function Home() {
  const [openedChests, setOpenedChests] = useState([]);
  const [currentJ, setCurrentJ] = useState(0);
  const [currentI, setCurrentI] = useState(0);
  const [nMoves, setNMoves] = useState(0);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const charRef = useRef();
  const gridRef = useRef();

  useEffect(() => {
    let chests;
    if (grid && (chests = shouldOpenChest(currentJ, currentI, grid)).length) {
      setOpenedChests((prev) =>
        uniqWith(
          [...prev, ...chests.map((chest) => [chest.x, chest.y])],
          isEqual
        )
      );
    }
  }, [currentI, currentJ]);

  useEffect(() => {
    return () => requestRef.current && cancelAnimationFrame(requestRef.current);
  }, []);

  const moveToAnim =
    ({ path, dirX, dirY, count, startCharLeft, startCharTop }) =>
    (time) => {
      if (previousTimeRef.current != undefined) {
        if (count > 10000) {
          console.error("Too many iterations");
          resetAnimation();
          return;
        }

        const [_targetJ, _targetI] = path[0];

        const charLeft = parseInt(charRef.current.style.left);
        const charTop = parseInt(charRef.current.style.top);

        const _atX = charLeft === _targetJ * cellLen;
        const _atY = charTop === _targetI * cellLen;

        let newDirY, newDirX;
        if (_atX && _atY) {
          console.log(`[=] at x and y`);
          if (path.length === 1) {
            setCurrentJ(Math.floor(charLeft / cellLen));
            setCurrentI(Math.floor(charTop / cellLen));
            cancelAnimation();
            return;
          }
          const [_nextTargetJ, _nextTargetI] = path[1];
          newDirX = Math.sign(_nextTargetJ - _targetJ);
          newDirY = Math.sign(_nextTargetI - _targetI);
          requestRef.current = requestAnimationFrame(
            moveToAnim({
              path: path.slice(1),
              dirX: newDirX,
              dirY: newDirY,
              count: 0,
              startCharLeft: charLeft,
              startCharTop: charTop,
            })
          );
        } else {
          charRef.current.style.left = `${startCharLeft + count * dirX}px`;
          charRef.current.style.top = `${startCharTop + count * dirY}px`;
          requestRef.current = requestAnimationFrame(
            moveToAnim({
              path,
              dirX,
              dirY,
              count: count + pxPerFrame,
              startCharLeft,
              startCharTop,
            })
          );
        }
      } else {
        previousTimeRef.current = time;
        gridRef.current.style.pointerEvents = "none";
        requestRef.current = requestAnimationFrame(
          moveToAnim({ path, dirX, dirY, count, startCharLeft, startCharTop })
        );
      }
    };

  const startAnimation = (_currentJ, _currentI, _targetJ, _targetI, node) => {
    if (charRef.current && gridRef.current) {
      const dirX = Math.sign(_targetJ - _currentJ);
      const dirY = Math.sign(_targetI - _currentI);
      if (dirX === 0 && dirY === 0) {
        console.log(`[=] you are already there!`);
        return;
      }
      if (!node.walkable) {
        console.log(`[=] node not walkable!`);
        return;
      }

      const startCharLeft = parseInt(charRef.current.style.left);
      const startCharTop = parseInt(charRef.current.style.top);

      const path = getPath(currentJ, currentI, _targetJ, _targetI);
      setNMoves((prevMoves) => prevMoves + path.length - 1);
      requestRef.current = requestAnimationFrame(
        moveToAnim({
          path,
          dirX,
          dirY,
          count: 0,
          startCharLeft,
          startCharTop,
        })
      );
    }
  };

  const cancelAnimation = () => {
    console.log(`[=] cancelling animation`);
    cancelAnimationFrame(requestRef.current);
    gridRef.current.style.pointerEvents = "auto";
    previousTimeRef.current = undefined;
  };

  const resetAnimation = () => {
    console.log(`[=] cancelling animation`);
    cancelAnimationFrame(requestRef.current);
    gridRef.current.style.pointerEvents = "auto";
    previousTimeRef.current = undefined;
    charRef.current.style.left = "0px";
    charRef.current.style.top = "0px";
    setCurrentI(0);
    setCurrentJ(0);
    setNMoves(0);

    setOpenedChests([]);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Point Click Move</title>
        <meta name="description" content="Click and move" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <code>Journey length: {nMoves}</code>
        <code>Opened chests: {openedChests.length} </code>
        <button
          onClick={() => {
            resetAnimation();
          }}
        >
          [debug] Reset
        </button>
        <div ref={gridRef} className={styles.grid}>
          <div
            style={{
              height: `${cellLen}px`,
              width: `${cellLen}px`,
              left: "0px",
              top: "0px",
            }}
            className={styles.player}
            ref={charRef}
          />
          {grid.nodes.map((row, i) => {
            return (
              <div key={`${i}-${i}`} className={styles.row}>
                {row.map((node, j) => {
                  return (
                    <div
                      key={`${i}-${j}`}
                      onClick={() => {
                        startAnimation(currentJ, currentI, j, i, node);
                      }}
                      className={styles.cell}
                      style={{
                        height: `${cellLen}px`,
                        width: `${cellLen}px`,
                        backgroundColor:
                          currentI == i && currentJ == j
                            ? "yellow"
                            : "rgba(0, 0, 0, 0)",
                        backgroundImage: !node.walkable
                          ? "url('/chest2.png')"
                          : "none",
                        backgroundPosition: `${
                          !node.walkable &&
                          openedChests.length &&
                          openedChests.some(
                            (chests) => chests[0] === j && chests[1] === i
                          )
                            ? `-${cellLen}`
                            : -1
                        }px ${0}px`,
                        backgroundSize: node.walkable
                          ? "initial"
                          : `${cellLen * 2}px ${cellLen}px`,
                      }}
                    >
                      {j},{i}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
