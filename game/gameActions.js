export const UPDATE_POSITION = "UPDATE_POSITION";
export const RESET = "RESET";

export const updatePosition = ({ i, j }) => {
  return {
    type: UPDATE_POSITION,
    payload: { i, j },
  };
};

export const reset = (room) => {
  return {
    type: RESET,
    payload: room,
  };
};
