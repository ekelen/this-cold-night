import { useCallback, useEffect, useRef, useState } from "react";
import { cellLen, getPath, grid, items, pxPerFrame } from "../game/setup";
import useGame from "../game/useGame";
import styles from "../styles/Home.module.css";
import Modal from "./Modal";

export default function Room1() {
  const [gameState, { move, reset }] = useGame();
  const [nMoves, setNMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const { currentI, currentJ, inventory, hintMessage, successMessage } =
    gameState;

  const onClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const charRef = useRef();
  const gridRef = useRef();

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
          if (path.length === 1) {
            move({
              j: Math.floor(charLeft / cellLen),
              i: Math.floor(charTop / cellLen),
            });
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

      const path = getPath(_currentJ, _currentI, _targetJ, _targetI);
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
    reset();
    setNMoves(0);
  };

  return (
    <>
      {showModal && (
        <Modal onClose={onClose}>
          You found {inventory[inventory.length - 1]}
        </Modal>
      )}
      <code>Journey length: {nMoves}</code>
      <div
        style={{
          height: "50px",
          width: "400px",
          maxWidth: "90vw",
          overflowY: "auto",
          padding: "10px 0px",
        }}
      >
        <code style={{ color: "green", fontSize: "larger" }}>
          Inventory: {inventory.map((id) => items[id].emoji).join(" ")}{" "}
        </code>
        {hintMessage && (
          <code style={{ color: "red", fontSize: "smaller" }}>
            {hintMessage}
          </code>
        )}
        {successMessage && (
          <code style={{ color: "green", fontSize: "smaller" }}>
            {successMessage}
          </code>
        )}
      </div>
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
                const id = i * grid.width + j;
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
                        !node.walkable && inventory.includes(id)
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
