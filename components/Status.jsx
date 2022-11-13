import styles from "../styles/Status.module.css";

export default function Status({
  activeChestId,
  debug,
  generalMessage,
  hintMessage,
  inventory,
  items,
  levelComplete,
  maxItems,
  nMoves,
  onLevelComplete,
  onReset,
  onSetDebug,
  successMessage,
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
          {!levelComplete && (
            <button onClick={onLevelComplete}>Next level...</button>
          )}
        </div>
      </div>
    </>
  );
}
