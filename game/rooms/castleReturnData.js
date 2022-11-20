import { CONTAINER_IMAGES, CONTAINER_IMAGE_TYPE } from "../constants";
import {
  createContainers,
  createObstacles,
  finderMaker,
  gridHeight,
  gridMaker,
  gridWidth,
} from "../setup";
import { forest } from "./forestData";
import { room1 } from "./castleData";

const name = "castleReturn";
const grid = gridMaker();
const finder = finderMaker(grid);

const player = {
  image: "/player.png",
  style: {
    filter: `'brightness(${1.4})',`,
  },
};

const maxItems = forest.maxItems;

const startMessage =
  "You return to the castle, and find things subtly changed...";

const _containers = [
  {
    coordinates: [9, 0],
    emoji: "💰",
    itemName: "money1",
    image: "/gold.png",
    description: "The huntsman thanks you for your heroic deed.",
    metMessage:
      "The HUNTSMAN, looking much healthier, thanks you for your heroic act, and gives you some gold to help you on your way.",
    keepForNextLevel: true,
    container: CONTAINER_IMAGE_TYPE.HUNTER,
  },
  {
    coordinates: [3, 0],
    emoji: "💰",
    itemName: "money2",
    image: "/gold2.png",
    deps: [],
    description: "The baker thanks you for your heroic act.",
    metMessage:
      "The BAKER, looking much healthier, thanks you for your heroic act, and gives you some gold to help you on your way.",
    keepForNextLevel: true,
    container: CONTAINER_IMAGE_TYPE.BAKER,
  },
  {
    coordinates: [2, 6],
    emoji: "💰",
    itemName: "money3",
    image: "/gold.png",
    deps: [],
    description: "The scribe thanks you for your heroic act.",
    metMessage:
      "The SCRIBE, looking much healthier, thanks you for your heroic act, and gives you some gold to help you on your way.",
    keepForNextLevel: true,
    container: CONTAINER_IMAGE_TYPE.ELDER,
  },
  {
    coordinates: [6, 8],
    emoji: "💰",
    itemName: "money4",
    image: "/gold2.png",
    deps: [],
    description: "The craftsman thanks you for your heroic act.",
    metMessage:
      "The CRAFTSMAN, looking much healthier, thanks you for your heroic act, and gives you some gold to help you on your way.",
    keepForNextLevel: true,
    container: CONTAINER_IMAGE_TYPE.CRAFTER,
  },
  {
    coordinates: [8, 8],
    emoji: "?",
    itemName: "guard",
    image: "/guard.png",
    deps: [],
    description: "The guard thanks you for your heroic act.",
    empty: true,
    metMessage:
      "The GUARD, looking much healthier, thanks you for your heroic act, and allows you to pass unfettered.",
    container: CONTAINER_IMAGE_TYPE.GUARD,
  },
  {
    coordinates: [5, 4],
    emoji: "👑",
    itemName: "money5",
    image: "/gold3.png",
    deps: [],
    description:
      "The KING, looking much healthier, thanks you for your heroic act.",
    metMessage:
      "The KING, looking much healthier, thanks you for your heroic act, and gives you some gold to help you on your way.",
    keepForNextLevel: true,
    container: CONTAINER_IMAGE_TYPE.KING2,
  },
  {
    coordinates: [9, 8],
    emoji: "🚪",
    itemName: "door",
    image: "/closed_door.png",
    description: "The way out.",
    deps: ["money1", "money2", "money3", "money4", "money5"],
    hint: "You have a lot of GOLD to collect.",
    metMessage:
      "You open the door and leave the castle, with enough gold to make of yourself what you will...\n\nThe End",
    container: CONTAINER_IMAGE_TYPE.DOOR,
    finalItemForLevel: true,
    empty: true,
  },
];

const _obstacles = Object.values(room1.containers)
  .filter((container) => container.container === CONTAINER_IMAGE_TYPE.CHEST)
  .map((container) => ({
    coordinates: container.coordinates,
    image: CONTAINER_IMAGES[CONTAINER_IMAGE_TYPE.CHEST].open,
  }));

const obstacles = createObstacles({ obstacles: _obstacles, grid });

const containers = createContainers({ containers: _containers, grid, name });

const previousLevelItems = [
  ...Object.values(forest.containers)
    .filter((item) => item.keepForNextLevel)
    .map((item) => ({
      ...item,
      id: `${item.room}-${item.itemName}`,
      keepForNextLevel:
        item.keepForNextLevel === name ? false : item.keepForNextLevel,
      node: null,
      deps: [],
    })),
  ...forest.previousLevelItems.filter((item) => item.keepForNextLevel),
];

console.assert(
  [...Array(gridWidth * gridHeight).keys()]
    .map((i) => [i % gridWidth, Math.floor(i / gridWidth)])
    .map(([x, y]) => grid.getNodeAt(x, y))
    .filter((node) => !node.walkable).length ===
    _obstacles.length + _containers.length,
  `${name}: All containers and obstacles should be placed on the grid.`
);

export const castleReturn = {
  name,
  startMessage,
  containers,
  grid,
  finder,
  maxItems,
  previousLevelItems,
  obstacles,
  player,
};
