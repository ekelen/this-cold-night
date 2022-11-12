import { useEffect, useRef, useState } from "react";
import { containers } from "../game/constants";
import { room1 } from "../game/rooms/room1Data";
import { cellLen, gridHeight, gridWidth } from "../game/setup";
import useGame from "../game/useGame";
import useAnimation from "../hooks/useAnimation";
import styles from "../styles/Room1.module.css";

export default function Room1() {
  const [gameState, { updatePosition, reset }] = useGame(room1);
  const [debug, setDebug] = useState(false);

  const cellRefs = useRef([]);
  useEffect(() => {
    cellRefs.current = cellRefs.current.slice(0, gridWidth * gridHeight);
  }, []);

  const {
    activeChestId,
    activeChestIdOpenable,
    currentI,
    currentJ,
    discardedInventory,
    finder,
    generalMessage,
    grid,
    hintMessage,
    inventory,
    items,
    successMessage,
    maxItems,
  } = gameState;

  const requestRef = useRef();
  const charRef = useRef();
  const gridRef = useRef();

  const { resetAnimation, startAnimation, nMoves } = useAnimation({
    charRef,
    gridRef,
    requestRef,
    reset,
    updatePosition,
    cellRefs,
  });

  return (
    <>
      <div className={styles.status}>
        <div className={styles.statusWrapper}>
          {debug ? (
            <div>Journey length: {nMoves}</div>
          ) : (
            <div className={styles.title}>this cold night</div>
          )}
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

        <div className={styles.inventory}>
          <div>Inventory:</div>

          <div className={styles.inventoryItemsContainer}>
            {[...Array(maxItems).keys()].map((i) => (
              <div key={i} className={styles.inventoryItem}>
                {!inventory[i] ? null : items[inventory[i]].image ? (
                  <div
                    style={{
                      backgroundImage: `url(${items[inventory[i]].image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <span>{items[inventory[i]].emoji}</span>
                )}
              </div>
            ))}
          </div>
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
            backgroundImage: `url('/player.png')`,
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
                      border:
                        activeChestId !== id
                          ? "1px solid #2d3147"
                          : activeChestIdOpenable
                          ? "1px solid #7ae2ae"
                          : "1px solid #e27a7a",
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
                          ? 0.6
                          : 1
                      })`,
                    };
                return (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => {
                      startAnimation(
                        currentJ,
                        currentI,
                        j,
                        i,
                        node,
                        grid,
                        finder
                      );
                    }}
                    className={styles.cell}
                    ref={(el) => (cellRefs.current[id] = el)}
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
