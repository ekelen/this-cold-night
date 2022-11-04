import { useState } from "react";
import { cellLen, getPath, pxPerFrame } from "../game/setup";

const useAnimation = (
  charRef,
  gridRef,
  requestRef,
  previousTimeRef,
  reset,
  updatePosition
) => {
  const [nMoves, setNMoves] = useState(0);

  const cancelAnimation = () => {
    cancelAnimationFrame(requestRef.current);
    gridRef.current.style.pointerEvents = "auto";
    previousTimeRef.current = undefined;
  };

  const resetAnimation = () => {
    cancelAnimationFrame(requestRef.current);
    gridRef.current.style.pointerEvents = "auto";
    previousTimeRef.current = undefined;
    charRef.current.style.left = "0px";
    charRef.current.style.top = "0px";
    reset();
    setNMoves(0);
  };

  const animatePositionUpdate =
    ({ path, dirX, dirY, count, startCharLeft, startCharTop }) =>
    (time) => {
      if (previousTimeRef.current != undefined) {
        const [endX, endY] = path[0];

        const charLeft = parseInt(charRef.current.style.left);
        const charTop = parseInt(charRef.current.style.top);

        const atX = charLeft === endX * cellLen;
        const atY = charTop === endY * cellLen;

        let newDirY, newDirX;
        if (atX && atY) {
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
      } else {
        previousTimeRef.current = time;
        gridRef.current.style.pointerEvents = "none";
        requestRef.current = requestAnimationFrame(
          animatePositionUpdate({
            path,
            dirX,
            dirY,
            count,
            startCharLeft,
            startCharTop,
          })
        );
      }
    };

  const startAnimation = (startX, startY, endX, endY, node) => {
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

      const path = getPath(startX, startY, endX, endY);
      setNMoves((prevMoves) => prevMoves + path.length - 1);
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
