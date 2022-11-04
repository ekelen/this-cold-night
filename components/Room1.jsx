import { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
  cellLen,
  getItemIdByName,
  getPath,
  grid,
  gridHeight,
  gridWidth,
  items,
  pxPerFrame,
} from "../game/setup";
import useGame from "../game/useGame";
import useAnimation from "../hooks/useAnimation";
import styles from "../styles/Home.module.css";
import Modal from "./Modal";

export default function Room1() {
  const [gameState, { updatePosition, reset }] = useGame();

  const [showModal, setShowModal] = useState(false);
  const itemsRef = useRef([]);
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, gridWidth * gridHeight);
  }, []);

  const {
    currentI,
    currentJ,
    inventory,
    hintMessage,
    successMessage,
    discardedInventory,
    activeChestId,
    activeChestIdOpenable,
  } = gameState;

  useEffect(() => {
    if (activeChestId && itemsRef?.current[activeChestId]) {
      itemsRef.current.forEach((item) => {
        if (item) {
          item.style.borderColor = "rgba(255,255,255, 0.1)";
        }
      });
      itemsRef.current[activeChestId].style.borderColor = activeChestIdOpenable
        ? "rgba(0,255,100, 0.75)"
        : "rgba(255,0,50, 0.75)";
    } else {
      itemsRef?.current.forEach((item) => {
        if (item) {
          item.style.borderColor = item.style.borderColor =
            "rgba(255,255,255, 0.1)";
        }
      });
    }
  }, [activeChestId, activeChestIdOpenable]);

  const onClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const charRef = useRef();
  const gridRef = useRef();

  const { resetAnimation, startAnimation, nMoves } = useAnimation(
    charRef,
    gridRef,
    requestRef,
    previousTimeRef,
    reset,
    updatePosition
  );

  return (
    <>
      {showModal && (
        <Modal onClose={onClose}>
          You found {inventory[inventory.length - 1]}
        </Modal>
      )}
      <div
        style={{
          display: "flex",
          width: "400px",
          maxWidth: "90vw",
          justifyContent: "space-between",
        }}
      >
        <code>Journey length: {nMoves}</code>{" "}
        <button
          onClick={() => {
            resetAnimation();
          }}
        >
          reset
        </button>
      </div>
      <div
        style={{
          height: "100px",
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
                    ref={(el) => (itemsRef.current[id] = el)}
                    style={{
                      height: `${cellLen}px`,
                      width: `${cellLen}px`,
                      backgroundImage: !node.walkable
                        ? "url('/chest2.png')"
                        : "none",
                      backgroundPosition: `${
                        !node.walkable &&
                        (inventory.includes(id) ||
                          discardedInventory.includes(id))
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
