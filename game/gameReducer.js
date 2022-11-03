import { gridHeight, items } from "./setup";
import { OPEN_CHEST, MOVE, RESET } from "./gameActions";
import { cloneDeep } from "lodash";

export const initialState = {
  chests: [],
  openedChests: [],
  inventory: [],
  currentJ: 0,
  currentI: 0,
  items: items,
  hintMessage: "",
  successMessage: "",
};

const openChest = (state, chest) => {
  const common = {
    ...state,
    openedChests: [...state.openedChests, chest],
  };

  return common;
};

const move = (state, i, j) => {
  const isBelowItem = items[(i - 1) * gridHeight + j];
  const doesntHaveItem =
    isBelowItem && !state.inventory.includes(isBelowItem.id);
  const hasDeps =
    isBelowItem?.deps &&
    isBelowItem.deps.map((name) =>
      Object.values(items).find((i) => i.name === name)
    );
  const shouldShowHint =
    hasDeps && hasDeps.some((dep) => !state.inventory.includes(dep.id));
  const shouldAddItem =
    doesntHaveItem &&
    (!hasDeps || state.inventory.includes(...hasDeps.map((d) => d.id)));

  const common = {
    ...state,
    currentI: i,
    currentJ: j,
    hintMessage: "",
    successMessage: "",
  };
  if (shouldAddItem) {
    return {
      ...common,
      inventory: [...state.inventory, isBelowItem.id],
      successMessage: isBelowItem.metMessage
        ? `${isBelowItem.emoji} - ${isBelowItem.metMessage}`
        : `${isBelowItem.emoji} - ${isBelowItem.description}`,
    };
  }
  if (shouldShowHint) {
    return {
      ...common,
      hintMessage: `${isBelowItem.emoji} - ${isBelowItem.description} - ${isBelowItem.hint}`,
    };
  }

  return {
    ...common,
  };
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case OPEN_CHEST: {
      return openChest(state, action.payload.chest);
    }

    case MOVE: {
      return move(state, action.payload.i, action.payload.j);
    }

    case RESET: {
      return cloneDeep(initialState);
    }

    default: {
      return state;
    }
  }
};

export default gameReducer;
