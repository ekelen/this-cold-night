import { RESET, UPDATE_POSITION } from "./gameActions";
import { getIdFromPos, getItemByName } from "./setup";

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
    startInventory,
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
    inventory: startInventory,
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
    const maxItems = belowItem.newMaxItems
      ? belowItem.newMaxItems
      : state.maxItems;
    const levelComplete = belowItem.finalItemForLevel;

    const inventory = [...state.inventory, belowItem.id].filter(
      (id) => !depsToRemove.map((dep) => dep.id).includes(id)
    );

    const discardedInventory = [
      ...state.discardedInventory,
      ...depsToRemove.map((d) => d.id),
    ];
    const successMessage = belowItem.metMessage || `${belowItem.description}`;

    return {
      activeChestIdOpenable: true,
      discardedInventory,
      inventory,
      levelComplete,
      maxItems,
      successMessage,
    };
  };
  const visitNewItemResults = (belowItem) => {
    const depItems = belowItem.deps.map(getItemByName(state.containers));
    const depsAreNotCollected = depItems.some(
      (dep) => !collectedItems.includes(dep.id)
    );
    const depIdsInInventory = state.inventory.filter((id) =>
      depItems.map((dep) => dep.id).includes(id)
    );
    const depsToRemove = depItems.every((dep) =>
      depIdsInInventory.includes(dep.id)
    )
      ? depItems.filter((d) => !d.keepForNextLevel)
      : [];
    const shouldAddItemIfRoom = depItems.every((dep) =>
      state.inventory.includes(dep.id)
    );

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
