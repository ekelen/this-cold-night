import { getIdFromPos, getItemByName, gridHeight, items } from "./setup";
import { OPEN_CHEST, UPDATE_POSITION, RESET } from "./gameActions";
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
  discardedInventory: [],
  activeChestId: null,
  activeChestIdOpenable: false,
  generalMessage: "You find yourself trapped in a castle...",
};

const openChest = (state, chest) => {
  const common = {
    ...state,
    openedChests: [...state.openedChests, chest],
  };

  return common;
};

const updatePosition = (state, i, j) => {
  const belowItem = items[getIdFromPos([j, i - 1])];
  const itemNotInInventory =
    belowItem &&
    !state.inventory.includes(belowItem.id) &&
    !state.discardedInventory.includes(belowItem.id);
  const depItems = belowItem?.deps && belowItem.deps.map(getItemByName);
  const depsNotInInventory =
    depItems &&
    depItems.some(
      (dep) =>
        !state.inventory.includes(dep.id) &&
        !state.discardedInventory.includes(dep.id)
    );
  const shouldAddItem =
    itemNotInInventory &&
    (!depItems ||
      depItems
        .map((dep) => dep.id)
        .every((id) => state.inventory.includes(id)));

  const common = {
    ...state,
    currentI: i,
    currentJ: j,
    hintMessage: "",
    successMessage: "",
    generalMessage: "",
    activeChestId:
      belowItem && itemNotInInventory ? getIdFromPos([j, i - 1]) : null,
    activeChestIdOpenable: !!shouldAddItem,
  };
  if (shouldAddItem) {
    // Add item to inventory
    // Remove dependent items from inventory and add to discarded inventory
    return {
      ...common,
      inventory: [...state.inventory, belowItem.id].filter((id) =>
        depItems
          ? !depItems
              .filter((d) => !d.keepForNextLevel)
              .map((d) => d.id)
              .includes(id)
          : true
      ),
      discardedInventory: depItems
        ? [
            ...state.discardedInventory,
            ...depItems.filter((d) => !d.keepForNextLevel).map((d) => d.id),
          ]
        : state.discardedInventory,
      successMessage: belowItem.metMessage
        ? `${belowItem.metMessage}`
        : `${belowItem.description}`,
    };
  }
  if (depsNotInInventory) {
    return {
      ...common,
      hintMessage: `${belowItem.description} - ${belowItem.hint}`,
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

    case UPDATE_POSITION: {
      return updatePosition(state, action.payload.i, action.payload.j);
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
