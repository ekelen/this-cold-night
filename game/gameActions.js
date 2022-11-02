export const OPEN_CHEST = "OPEN_CHEST";
export const MOVE = "MOVE";
export const RESET = "RESET";

export const move = ({ i, j }) => {
  return {
    type: MOVE,
    payload: { i, j },
  };
};

export const openChest = (chest) => {
  return {
    type: OPEN_CHEST,
    payload: { chest },
  };
};

export const reset = () => {
  return {
    type: RESET,
  };
};
