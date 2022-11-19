import { useReducer } from "react";
import * as gameActions from "./gameActions";
import gameReducer, { init } from "./gameReducer";

const useGame = (
  room = {
    items: [],
    grid: null,
    finder: () => ({}),
    startMessage: "",
    maxItems: 0,
    startInventory: [],
    previousLevelItems: [],
    obstacles: {},
    player: {
      image: "",
      style: {},
    },
  }
) => {
  const [state, dispatch] = useReducer(gameReducer, room, init);
  const updatePosition = ({ j, i }) => {
    dispatch(gameActions.updatePosition({ j, i }));
  };

  const reset = (room) => {
    dispatch(gameActions.reset(room));
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
