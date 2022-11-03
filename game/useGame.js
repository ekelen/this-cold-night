import { useEffect, useReducer } from "react";
import gameReducer, { initialState } from "./gameReducer";
import * as gameActions from "./gameActions";

const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const openChest = (chest) => {
    dispatch(gameActions.openChest(chest));
  };

  const move = ({ j, i }) => {
    dispatch(gameActions.move({ j, i }));
  };

  const reset = () => {
    dispatch(gameActions.reset());
  };

  return [
    state,
    {
      openChest,
      move,
      reset,
    },
  ];
};

export default useGame;
