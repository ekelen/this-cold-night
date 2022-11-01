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

const cellLen = 50;
const gridWidth = 10;
const gridHeight = 10;
const pxPerFrame = cellLen * 0.1;

const validX = (x) => x >= 0 && x < gridWidth;
const validY = (y) => y >= 0 && y < gridHeight;
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
  const [count, setCount] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
  const [openedChests, setOpenedChests] = useState([]);

  const [currentI, setCurrentI] = useState(0);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const charRef = useRef();
  const gridRef = useRef();
  const [nMoves, setNMoves] = useState(0);

  useEffect(() => {
    if (grid && shouldOpenChest(currentJ, currentI, grid).length) {
      const chests = shouldOpenChest(currentJ, currentI, grid);
      setOpenedChests((prev) =>
        uniqWith(
          [...prev, ...chests.map((chest) => [chest.x, chest.y])],
          isEqual
        )
      );
    }
  }, [currentI, currentJ]);

  const moveToAnim =
    (_path, dirX, dirY, _count, startCharLeft, startCharTop) => (time) => {
      if (previousTimeRef.current != undefined) {
        if (_count > 10000) {
          console.error("Too many iterations");
          resetAnimation();
          return;
        }

        const [_targetJ, _targetI] = _path[0];

        const charLeft = parseInt(charRef.current.style.left);
        const charTop = parseInt(charRef.current.style.top);

        const _atX = charLeft === _targetJ * cellLen;
        const _atY = charTop === _targetI * cellLen;

        let newDirY, newDirX;
        if (_atX && _atY) {
          console.log(`[=] at x and y`);
          if (_path.length === 1) {
            setCurrentJ(Math.floor(charLeft / cellLen));
            setCurrentI(Math.floor(charTop / cellLen));
            cancelAnimation();
            return;
          }
          const [_nextTargetJ, _nextTargetI] = _path[1];
          newDirX = Math.sign(_nextTargetJ - _targetJ);
          newDirY = Math.sign(_nextTargetI - _targetI);
          requestRef.current = requestAnimationFrame(
            moveToAnim(_path.slice(1), newDirX, newDirY, 0, charLeft, charTop)
          );
        } else {
          charRef.current.style.left = `${startCharLeft + _count * dirX}px`;
          charRef.current.style.top = `${startCharTop + _count * dirY}px`;
          requestRef.current = requestAnimationFrame(
            moveToAnim(
              _path,
              dirX,
              dirY,
              _count + pxPerFrame,
              startCharLeft,
              startCharTop
            )
          );
        }
      } else {
        previousTimeRef.current = time;
        gridRef.current.style.pointerEvents = "none";
        requestRef.current = requestAnimationFrame(
          moveToAnim(_path, dirX, dirY, _count, startCharLeft, startCharTop)
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

      const charLeft = parseInt(charRef.current.style.left);
      const charTop = parseInt(charRef.current.style.top);

      const _path = getPath(currentJ, currentI, _targetJ, _targetI);
      setNMoves((prevMoves) => prevMoves + _path.length - 1);
      requestRef.current = requestAnimationFrame(
        moveToAnim(_path, dirX, dirY, 0, charLeft, charTop)
      );
    }
  };

  const cancelAnimation = () => {
    console.log(`[=] cancelling animation`);
    cancelAnimationFrame(requestRef.current);
    gridRef.current.style.pointerEvents = "auto";
    previousTimeRef.current = undefined;
    setCount(0);
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
    setCount(0);
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
        <div
          ref={gridRef}
          style={{
            border: "1px solid white",
            position: "relative",
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              height: `${cellLen}px`,
              width: `${cellLen}px`,
              backgroundColor: "pink",
              border: "1px solid red",
              position: "absolute",
              left: 0,
              top: 0,
              // transformOrigin: "0 0",
            }}
            ref={charRef}
          />
          {grid.nodes.map((row, i) => {
            return (
              <div
                key={`${i}-${i}`}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {row.map((node, j) => {
                  return (
                    <div
                      key={`${i}-${j}`}
                      onClick={() => {
                        startAnimation(currentJ, currentI, j, i, node);
                      }}
                      style={{
                        height: `${cellLen}px`,
                        width: `${cellLen}px`,
                        border: "1px solid white",
                        backgroundColor:
                          currentI == i && currentJ == j
                            ? "yellow"
                            : node.walkable
                            ? "green"
                            : "rgba(0, 0, 0, 0)",
                      }}
                    >
                      <div
                        style={{
                          backgroundImage: !node.walkable
                            ? "url('/chest2.png')"
                            : "none",
                          backgroundPosition: `${
                            openedChests.length &&
                            openedChests.some(
                              (chests) => chests[0] === j && chests[1] === i
                            )
                              ? -50
                              : -1
                          }px ${0}px`,
                          backgroundRepeat: "no-repeat",
                          height: `${cellLen}px`,
                          width: `${cellLen}px`,
                          backgroundSize: `${cellLen * 2}px ${cellLen}px`,
                        }}
                      >
                        {" "}
                        {j},{i}
                      </div>
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
