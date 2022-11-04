import { useEffect, useReducer } from "react";
import gameReducer, { initialState } from "./gameReducer";
import * as gameActions from "./gameActions";

const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const openChest = (chest) => {
    dispatch(gameActions.openChest(chest));
  };

  const updatePosition = ({ j, i }) => {
    dispatch(gameActions.updatePosition({ j, i }));
  };

  const reset = () => {
    dispatch(gameActions.reset());
  };

  return [
    state,
    {
      openChest,
      updatePosition,
      reset,
    },
  ];
};

export default useGame;
