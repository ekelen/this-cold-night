import { useReducer } from "react";
import * as gameActions from "./gameActions";
import gameReducer, { init, initialState } from "./gameReducer";

const useGame = ({ items }) => {
  const [state, dispatch] = useReducer(gameReducer, { items }, init);

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
