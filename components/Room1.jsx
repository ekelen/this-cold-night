import { isEqual, uniqWith } from "lodash";
import { useEffect, useRef, useState } from "react";
import { cellLen, getPath, grid, pxPerFrame, shouldOpenChest } from "../game";
import styles from "../styles/Home.module.css";

export default function Room1() {
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

        const atX = charLeft === _targetJ * cellLen;
        const atY = charTop === _targetI * cellLen;

        let newDirY, newDirX;
        if (atX && atY) {
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
    <>
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
        >
          <div
            style={{
              background:
                'url("/aristocrate-f-001-light.png") no-repeat -27px -69px',
              height: `${27}px`,
              width: `${18}px`,
            }}
          ></div>
        </div>
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
    </>
  );
}
