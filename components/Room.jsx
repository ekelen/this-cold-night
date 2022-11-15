import { useEffect, useMemo, useRef, useState } from "react";
import { containers } from "../game/constants";
import { cellLen, gridHeight, gridWidth } from "../game/setup";
import useGame from "../game/useGame";
import useAnimation from "../hooks/useAnimation";
import styles from "../styles/Room.module.css";
import Status from "./Status";

export default function Room({ onLevelComplete, room }) {
  const [gameState, { updatePosition, reset }] = useGame(room);
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
    previousLevelItems,
    items,
    successMessage,
    maxItems,
    levelComplete,
  } = gameState;

  const requestRef = useRef();
  const charRef = useRef();
  const gridRef = useRef();

  const { resetAnimation, startAnimation, nMoves } = useAnimation({
    charRef,
    gridRef,
    requestRef,
    reset: () => reset(room),
    updatePosition,
    cellRefs,
  });

  const displayInventory = useMemo(
    () => [
      ...previousLevelItems.filter((item) => item),
      ...inventory.map((id) => items[id]),
    ],
    [inventory, previousLevelItems, items]
  );

  return (
    <>
      <Status
        generalMessage={generalMessage}
        hintMessage={hintMessage}
        items={items}
        inventory={inventory}
        successMessage={successMessage}
        maxItems={maxItems}
        levelComplete={levelComplete}
        onReset={resetAnimation}
        debug={debug}
        onSetDebug={() => setDebug(!debug)}
        nMoves={nMoves}
        activeChestId={activeChestId}
        onLevelComplete={onLevelComplete}
        displayInventory={displayInventory}
      />

      <div ref={gridRef} className={styles.grid}>
        <div
          style={{
            height: `${cellLen}px`,
            width: `${cellLen}px`,
            left: "0px",
            top: "0px",
            backgroundImage: `url('/player.png')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
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

                const cellContainerStyle = !item
                  ? {}
                  : {
                      border:
                        activeChestId !== id
                          ? "1px solid #2d3147"
                          : activeChestIdOpenable
                          ? "1px solid #7ae2ae"
                          : "1px solid #e27a7a",
                    };

                const cellContentsStyle = !item
                  ? {}
                  : {
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
                      ...cellContainerStyle,
                    }}
                  >
                    <div
                      className={styles.cellContents}
                      style={{
                        ...cellContentsStyle,
                      }}
                    >
                      {debug && (
                        <>
                          {j},{i}
                        </>
                      )}
                    </div>
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
