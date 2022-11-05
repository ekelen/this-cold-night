import { getIdFromPos, getItemByName, gridHeight, items } from "./setup";
import { UPDATE_POSITION, RESET } from "./gameActions";
import { cloneDeep } from "lodash";

export const MAX_ITEMS = 5;

export const initialState = {
  inventory: [],
  currentJ: 0,
  currentI: 0,
  items,
  hintMessage: "",
  successMessage: "",
  discardedInventory: [],
  activeChestId: null,
  activeChestIdOpenable: false,
  generalMessage: "You find yourself trapped in a castle...",
};

const updatePosition = (state, i, j) => {
  const belowItem = items[getIdFromPos([j, i - 1])];
  const collectedItems = [...state.inventory, ...state.discardedInventory];
  const itemNotCollected = belowItem && !collectedItems.includes(belowItem.id);
  const depItems = belowItem?.deps && belowItem.deps.map(getItemByName);
  const depsAreNotCollected =
    depItems && depItems.some((dep) => !collectedItems.includes(dep.id));
  const depIdsInInventory =
    depItems &&
    state.inventory.filter((id) => depItems.map((dep) => dep.id).includes(id));
  const depsToRemove =
    depItems && depItems.every((dep) => depIdsInInventory.includes(dep.id))
      ? depItems
      : [];
  const shouldAddItemIfRoom =
    itemNotCollected &&
    (!depItems || depItems.every((dep) => state.inventory.includes(dep.id)));

  const shouldAddItem =
    shouldAddItemIfRoom &&
    state.inventory.length - depsToRemove.length < MAX_ITEMS;
  const notEnoughRoom = shouldAddItemIfRoom && !shouldAddItem;

  const common = {
    ...state,
    currentI: i,
    currentJ: j,
    hintMessage: "",
    successMessage: "",
    generalMessage: "",
    activeChestId:
      belowItem && itemNotCollected ? getIdFromPos([j, i - 1]) : null,
    activeChestIdOpenable: !!shouldAddItem,
  };

  if (notEnoughRoom) {
    return {
      ...common,
      hintMessage: "You don't have enough room in your inventory.",
    };
  }
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
  if (depsAreNotCollected) {
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
