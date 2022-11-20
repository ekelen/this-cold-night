import { RESET, UPDATE_POSITION } from "./gameActions";
import { getIdFromPos } from "./setup";

export const initialState = {
  activeChestId: null,
  activeChestIdOpenable: false,
  currentI: 0,
  currentJ: 0,
  discardedInventory: [],
  finder: null,
  generalMessage: "",
  grid: {},
  hintMessage: "",
  inventory: [],
  containers: [],
  levelComplete: false,
  maxItems: 0,
  name: "",
  obstacles: {},
  previousLevelItems: [],
  successMessage: "",
  player: {
    image: "/player.png",
    style: {},
  },
};

export const init = (room) => {
  const {
    containers,
    finder,
    grid,
    startMessage,
    maxItems,
    previousLevelItems,
    obstacles,
    name,
    player,
  } = room;
  return {
    ...initialState,
    containers,
    finder,
    grid,
    generalMessage: startMessage,
    maxItems,
    previousLevelItems,
    obstacles,
    name,
    player,
  };
};

const updatePosition = (state, i, j) => {
  const common = {
    ...state,
    currentI: i,
    currentJ: j,
    hintMessage: "",
    successMessage: "",
    generalMessage: "",
    activeChestId: null,
    levelComplete: false,
    activeChestIdOpenable: false,
  };

  const shouldAddItemResults = (belowItem, depsToRemove) => {
    const depIdsToRemove = depsToRemove.map((d) => d.id);
    const maxItems = belowItem.newMaxItems
      ? belowItem.newMaxItems
      : state.maxItems;
    const levelComplete = belowItem.finalItemForLevel;

    const inventory = [...state.inventory, belowItem.id].filter(
      (id) => !depIdsToRemove.includes(id)
    );

    const discardedInventory = [...state.discardedInventory, ...depIdsToRemove];
    const previousLevelItems = state.previousLevelItems.filter(
      (item) => !depIdsToRemove.includes(item.id)
    );
    const successMessage = belowItem.metMessage || `${belowItem.description}`;

    return {
      activeChestIdOpenable: true,
      discardedInventory,
      inventory,
      levelComplete,
      maxItems,
      successMessage,
      previousLevelItems,
    };
  };
  const visitNewItemResults = (belowItem) => {
    const { deps } = belowItem;
    const depItems = deps.map(
      (id) =>
        state.containers[id] ??
        state.previousLevelItems.find((i) => i.id === id)
    );
    const depsAreNotCollected = deps.some(
      (dep) => !collectedItems.includes(dep)
    );
    const previousLevelItemIds = state.previousLevelItems.map(
      (item) => item.id
    );
    const depIdsInInventory = state.inventory.filter((id) => deps.includes(id));
    const depIdsInPreviousInventory = previousLevelItemIds.filter((id) =>
      deps.includes(id)
    );
    const hasAllDeps = deps.every(
      (dep) =>
        depIdsInPreviousInventory.includes(dep) ||
        depIdsInInventory.includes(dep)
    );
    const depsToRemove = hasAllDeps
      ? depItems.filter((d) => !d.keepForNextLevel)
      : [];
    const depIdsToRemove = depsToRemove.map((d) => d.id);
    const addable = !belowItem.empty;
    // TODO: Clean/de-dupe code
    if (!addable) {
      const shouldGiveDepsToEmptyItem = deps.every((dep) =>
        [...state.inventory, ...previousLevelItemIds].includes(dep)
      );
      if (shouldGiveDepsToEmptyItem) {
        const discardedInventory = [
          ...state.discardedInventory,
          belowItem.id,
          ...depIdsToRemove,
        ];
        const inventory = state.inventory.filter(
          (id) => !depIdsToRemove.includes(id)
        );
        const previousLevelItems = state.previousLevelItems.filter(
          (item) => !depIdsToRemove.includes(item.id)
        );
        const successMessage = belowItem.metMessage;
        const levelComplete = belowItem.finalItemForLevel;
        const maxItems = belowItem.newMaxItems ?? state.maxItems; // TODO: Careful
        console.assert(
          inventory.length + previousLevelItems.length <= maxItems,
          "Too many items in inventory"
        );
        return {
          activeChestIdOpenable: true,
          discardedInventory,
          inventory,
          successMessage,
          previousLevelItems,
          levelComplete,
          maxItems,
        };
      } else {
        const hintMessage = belowItem.description + " - " + belowItem.hint;
        return {
          hintMessage,
        };
      }
    }

    const shouldAddItemIfRoom = hasAllDeps;

    const isRoom =
      state.inventory.length +
        state.previousLevelItems.length -
        depsToRemove.length <
      (belowItem.newMaxItems ?? state.maxItems);

    const shouldAddItem = shouldAddItemIfRoom && isRoom;

    const notEnoughRoom = shouldAddItemIfRoom && !shouldAddItem;

    const hintMessage = notEnoughRoom
      ? "You don't have enough room in your inventory."
      : depsAreNotCollected
      ? belowItem.description + " - " + belowItem.hint
      : "";

    return shouldAddItem
      ? shouldAddItemResults(belowItem, depsToRemove)
      : {
          hintMessage,
        };
  };

  const belowItem = state.containers[getIdFromPos([j, i - 1])];
  const collectedItems = [
    ...state.inventory,
    ...state.discardedInventory,
    ...state.previousLevelItems.map((item) => item.id),
  ];
  const itemNotCollected = belowItem && !collectedItems.includes(belowItem.id);

  return itemNotCollected
    ? {
        ...common,
        activeChestId: belowItem.id,
        ...visitNewItemResults(belowItem),
      }
    : { ...common };
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
