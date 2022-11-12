import { useReducer } from "react";
import * as gameActions from "./gameActions";
import gameReducer, { init } from "./gameReducer";

const useGame = ({ items, grid, finder, startMessage, maxItems }) => {
  const [state, dispatch] = useReducer(
    gameReducer,
    { items, grid, finder, startMessage, maxItems },
    init
  );

  const updatePosition = ({ j, i }) => {
    dispatch(gameActions.updatePosition({ j, i }));
  };

  const reset = ({ items, finder, grid, startMessage, maxItems }) => {
    dispatch(
      gameActions.reset({ items, finder, grid, startMessage, maxItems })
    );
  };

  return [
    state,
    {
      updatePosition,
      reset,
    },
  ];
};

export default useGame;
