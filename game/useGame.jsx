import { useReducer } from "react";
import * as gameActions from "./gameActions";
import gameReducer, { initialState } from "./gameReducer";

const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const updatePosition = ({ j, i }) => {
    dispatch(gameActions.updatePosition({ j, i }));
  };

  const reset = () => {
    dispatch(gameActions.reset());
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
