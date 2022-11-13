import { useState } from "react";
import { cellLen, getIdFromPos, getPath, pxPerFrame } from "../game/setup";
import styles from "../styles/Room.module.css";

const useAnimation = ({
  charRef,
  gridRef,
  requestRef,
  reset,
  updatePosition,
  cellRefs,
}) => {
  const [nMoves, setNMoves] = useState(0);

  const cancelAnimation = () => {
    cancelAnimationFrame(requestRef.current);
    gridRef.current.style.pointerEvents = "auto";
  };

  const resetAnimation = () => {
    cancelAnimation();
    charRef.current.style.left = "0px";
    charRef.current.style.top = "0px";
    reset();
    setNMoves(0);
  };

  const animatePositionUpdate =
    ({ path, dirX, dirY, count, startCharLeft, startCharTop }) =>
    (_time) => {
      const [endX, endY] = path[0];
      const cellRef = cellRefs.current[getIdFromPos([endX, endY])];

      if (cellRef) {
        cellRef.classList.add(styles.clicked);
        setTimeout(() => cellRef.classList.remove(styles.clicked), 300);
      }

      const charLeft = parseInt(charRef.current.style.left);
      const charTop = parseInt(charRef.current.style.top);

      const atDestination =
        charLeft === endX * cellLen && charTop === endY * cellLen;

      let newDirY, newDirX;
      if (atDestination) {
        if (path.length === 1) {
          updatePosition({
            j: Math.floor(charLeft / cellLen),
            i: Math.floor(charTop / cellLen),
          });
          cancelAnimation();
          return;
        }
        const [nextEndX, nextEndY] = path[1];
        newDirX = Math.sign(nextEndX - endX);
        newDirY = Math.sign(nextEndY - endY);
        requestRef.current = requestAnimationFrame(
          animatePositionUpdate({
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
          animatePositionUpdate({
            path,
            dirX,
            dirY,
            count: count + pxPerFrame,
            startCharLeft,
            startCharTop,
          })
        );
      }
    };

  const startAnimation = (startX, startY, endX, endY, node, grid, finder) => {
    if (charRef.current && gridRef.current) {
      const dirX = Math.sign(endX - startX);
      const dirY = Math.sign(endY - startY);
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

      const path = getPath(startX, startY, endX, endY, grid, finder);
      setNMoves((prevMoves) => prevMoves + path.length - 1);
      gridRef.current.style.pointerEvents = "none";
      requestRef.current = requestAnimationFrame(
        animatePositionUpdate({
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

  return {
    resetAnimation,
    startAnimation,
    nMoves,
  };
};

export default useAnimation;
