import { cloneDeep } from "lodash";
import { RESET, UPDATE_POSITION } from "./gameActions";
import { room1 } from "./rooms/Room1";
import { getIdFromPos, getItemByName, room1Items } from "./setup";

export const MAX_ITEMS = 4;

export const initialState = {
  inventory: [],
  currentJ: 0,
  currentI: 0,
  items: room1Items,
  hintMessage: "",
  successMessage: "",
  discardedInventory: [],
  activeChestId: null,
  activeChestIdOpenable: false,
  generalMessage: room1.startMessage,
};

export const init = ({ items }) => {
  return { ...initialState, items };
};

const updatePosition = (state, i, j) => {
  // TODO: Clean this
  const belowItem = state.items[getIdFromPos([j, i - 1])];
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
    activeChestId: belowItem && itemNotCollected ? belowItem.id : null,
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
      return init({ items: state.items });
    }

    default: {
      return state;
    }
  }
};

export default gameReducer;
