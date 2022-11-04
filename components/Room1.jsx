import { useCallback, useEffect, useRef, useState } from "react";
import { cellLen, grid, gridHeight, gridWidth, items } from "../game/setup";
import useGame from "../game/useGame";
import useAnimation from "../hooks/useAnimation";
import styles from "../styles/Home.module.css";
import Modal from "./Modal";

export const useGridDecoration = (
  gridRef,
  inventory,
  itemsRef,
  activeChestId,
  activeChestIdOpenable
) => {
  useEffect(() => {
    if (itemsRef.current) {
      Object.values(items)
        .map((item) => item.id)
        .map((key) => {
          if (inventory.includes(key)) {
            itemsRef.current[key].style.backgroundImage =
              "url('/chest-open.png')";
          }
        });
    }
  }, [inventory, itemsRef]);

  useEffect(() => {
    if (itemsRef.current) {
      Object.keys(items).map((key) => {
        const item = items[key];
        if (item) {
          itemsRef.current[key].style.backgroundImage = "url('/chest.png')";
          itemsRef.current[key].style.backgroundPosition = "center";
          itemsRef.current[
            key
          ].style.backgroundSize = `${cellLen}px ${cellLen}px`;
        }
      });
    }
  }, [itemsRef]);

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
  }, [activeChestId, activeChestIdOpenable, itemsRef]);
};

export default function Room1() {
  const [gameState, { updatePosition, reset }] = useGame();
  const [debug, setDebug] = useState(false);

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

  const onClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const charRef = useRef();
  const gridRef = useRef();

  useGridDecoration(
    gridRef,
    inventory,
    itemsRef,
    activeChestId,
    activeChestIdOpenable
  );

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
          style={{ marginLeft: "auto" }}
          onClick={() => {
            resetAnimation();
          }}
        >
          reset
        </button>
        <button
          onClick={() => {
            setDebug((prevDebug) => !prevDebug);
          }}
        >
          debug {!debug ? "on" : "off"}
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
                    }}
                  >
                    {debug && (
                      <>
                        {j},{i}
                      </>
                    )}
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
