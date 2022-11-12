import { RESET, UPDATE_POSITION } from "./gameActions";
import { getIdFromPos, getItemByName } from "./setup";

export const initialState = {
  activeChestId: null,
  activeChestIdOpenable: false,
  chestCoordinates: [],
  currentI: 0,
  currentJ: 0,
  discardedInventory: [],
  finder: null,
  generalMessage: "",
  grid: {},
  hintMessage: "",
  inventory: [],
  items: [],
  successMessage: "",
  maxItems: 0,
  levelComplete: false,
};

export const init = (room) => {
  const { items, finder, grid, startMessage, maxItems, startInventory } = room;
  return {
    ...initialState,
    items,
    finder,
    grid,
    generalMessage: startMessage,
    maxItems,
    inventory: startInventory,
  };
};

const updatePosition = (state, i, j) => {
  // TODO: Clean this
  const belowItem = state.items[getIdFromPos([j, i - 1])];
  // const finalItemForLevel = belowItem
  const collectedItems = [...state.inventory, ...state.discardedInventory];
  const itemNotCollected = belowItem && !collectedItems.includes(belowItem.id);
  const depItems =
    belowItem?.deps && belowItem.deps.map(getItemByName(state.items));
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
    state.inventory.length - depsToRemove.length <
      (belowItem.newMaxItems ?? state.maxItems);

  const notEnoughRoom = shouldAddItemIfRoom && !shouldAddItem;
  const maxItems =
    shouldAddItem && belowItem.newMaxItems
      ? belowItem.newMaxItems
      : state.maxItems;

  const levelComplete = shouldAddItem && belowItem.finalItemForLevel;

  const common = {
    ...state,
    currentI: i,
    currentJ: j,
    hintMessage: "",
    successMessage: "",
    generalMessage: "",
    activeChestId: belowItem && itemNotCollected ? belowItem.id : null,
    activeChestIdOpenable: !!shouldAddItem,
    maxItems,
    levelComplete,
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
      return init(action.payload);
    }

    default: {
      return state;
    }
  }
};

export default gameReducer;
