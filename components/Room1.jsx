import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  cellLen,
  CONTAINERS,
  containers,
  grid,
  gridHeight,
  gridWidth,
  items,
} from "../game/setup";
import useGame from "../game/useGame";
import useAnimation from "../hooks/useAnimation";
import styles from "../styles/Room1.module.css";
import Modal from "./Modal";

export const useGridDecoration = (
  gridRef,
  inventory,
  itemsRef,
  activeChestId,
  activeChestIdOpenable
) => {
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
    generalMessage,
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
      <div className={styles.statusWrapper}>
        <div>Journey length: {nMoves}</div>
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
      <div className={styles.status}>
        <div className={styles.inventory}>
          <div>Inventory:</div>
          {inventory.length > 0 && (
            <div className={styles.inventoryItemsContainer}>
              {inventory.map((id) => (
                <div
                  key={id}
                  style={{
                    width: "28px",
                    height: "28px",
                    position: "relative",
                  }}
                >
                  {items[id].image ? (
                    <div
                      style={{
                        backgroundImage: `url(${items[id].image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <span>{items[id].emoji}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.messageContainer}>
          <div>
            {activeChestId && (
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  position: "relative",
                }}
              >
                {items[activeChestId].image ? (
                  <div
                    style={{
                      backgroundImage: `url(${items[activeChestId].image})`,
                      backgroundSize: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                    alt={`${items[activeChestId].description}`}
                  />
                ) : (
                  <span style={{ fontSize: "20px" }}>
                    {items[activeChestId].emoji}
                  </span>
                )}
              </div>
            )}
          </div>
          {generalMessage ? (
            <span>{generalMessage}</span>
          ) : hintMessage ? (
            <span className={styles.hintMessage}>{hintMessage}</span>
          ) : successMessage ? (
            <span className={styles.successMessage}>{successMessage}</span>
          ) : (
            ""
          )}
        </div>
      </div>

      <div ref={gridRef} className={styles.grid}>
        <div
          style={{
            height: `${cellLen}px`,
            width: `${cellLen}px`,
            left: "0px",
            top: "0px",
            backgroundImage: "url('/player.png')",
            backgroundSize: "contain",
          }}
          className={styles.player}
          ref={charRef}
        ></div>
        {grid.nodes.map((row, i) => {
          return (
            <div key={`${i}-${i}`} className={styles.row}>
              {row.map((node, j) => {
                const id = i * grid.width + j;
                const item = items[id];

                const containerStyle = !item
                  ? {}
                  : {
                      // backgroundSize: `${cellLen}px ${cellLen}px`,
                      backgroundSize: "contain",
                      backgroundImage: `url(${
                        containers[item.container][
                          inventory.includes(id) ||
                          discardedInventory.includes(id)
                            ? "open"
                            : "closed"
                        ]
                      })`,
                      filter: `brightness(${
                        inventory.includes(id) ||
                        discardedInventory.includes(id)
                          ? 0.5
                          : 1
                      })`,
                    };
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
                      ...containerStyle,
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
