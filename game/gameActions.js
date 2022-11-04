export const OPEN_CHEST = "OPEN_CHEST";
export const UPDATE_POSITION = "UPDATE_POSITION";
export const RESET = "RESET";

export const updatePosition = ({ i, j }) => {
  return {
    type: UPDATE_POSITION,
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
