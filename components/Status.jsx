import { castleReturn } from "../game/rooms/castleReturnData";
import styles from "../styles/Status.module.css";

export default function Status({
  activeChestId,
  debug,
  generalMessage,
  hintMessage,
  containers,
  levelComplete,
  maxItems,
  nMoves,
  onLevelComplete,
  onReset,
  onSetDebug,
  successMessage,
  displayInventory,
  roomName,
}) {
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
              onReset();
            }}
          >
            reset
          </button>
          <button onClick={onSetDebug}>debug {!debug ? "on" : "off"}</button>
        </div>

        <div className={styles.inventory}>
          <div>Inventory:</div>

          <div className={styles.inventoryItemsContainer}>
            {[...Array(maxItems).keys()].map((i) => (
              <div key={i} className={styles.inventoryItem}>
                {!displayInventory[i] ? null : displayInventory[i].image ? (
                  <div
                    style={{
                      backgroundImage: `url(${displayInventory[i].image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <span>{displayInventory[i].emoji}</span>
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
                {containers[activeChestId].image ? (
                  <div
                    style={{
                      backgroundImage: `url(${containers[activeChestId].image})`,
                      backgroundSize: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                    alt={`${containers[activeChestId].description}`}
                  />
                ) : (
                  <span style={{ fontSize: "20px" }}>
                    {containers[activeChestId].emoji}
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
          {(levelComplete || debug) && (
            <button onClick={onLevelComplete}>
              {roomName === castleReturn.roomName ? "restart" : "next level..."}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
