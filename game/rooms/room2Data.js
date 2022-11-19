import { CONTAINER_IMAGE_TYPE } from "../constants";
import {
  createContainers,
  createObstacles,
  finderMaker,
  gridHeight,
  gridMaker,
  gridWidth,
} from "../setup";
import { room1 } from "./room1Data";

const name = "village";
const grid = gridMaker();
const finder = finderMaker(grid);

const player = {
  image: "/player_cloak2.png",
  style: {},
};

const startMessage =
  "You are in the village outside the castle. You will need some additional items to prepare to enter the forest beyond...";

const _containers = [
  {
    coordinates: [0, 1],
    itemName: "guard",
    empty: true,
    container: CONTAINER_IMAGE_TYPE.GUARD,
    deps: [`${room1.name}-scroll`],
    hint: "You need to show the guard your identity papers to pass.",
    metMessage: "The guard takes your papers.",
    description: "A guardsman.",
    image: "/guard.png",
  },
  {
    coordinates: [9, 8],
    emoji: "🌲",
    itemName: "door",
    image: "/closed_door.png",
    description: "The village exit.",
    deps: ["backpack", "axe", "bread", "map"],
    hint: "You will need some items to pass safely through the forest.",
    metMessage: "You enter the woods!",
    container: CONTAINER_IMAGE_TYPE.DOOR,
    empty: true,
  },
  {
    coordinates: [1, 3],
    emoji: "🪓",
    itemName: "axe",
    image: "/axe.png",
    description: "A small axe.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
    keepForNextLevel: "forest",
  },
  {
    emoji: "📜",
    coordinates: [4, 0],
    itemName: "canvas",
    description: "Sturdy canvas cloth.",
    container: CONTAINER_IMAGE_TYPE.SACK,
  },
  {
    emoji: "🏴‍☠️",
    coordinates: [5, 0],
    itemName: "patch",
    description: "An iron-on pirate flag.",
    container: CONTAINER_IMAGE_TYPE.SACK,
  },
  {
    coordinates: [4, 6],
    emoji: "♤",
    itemName: "spade",
    image: "/shovel.png",
    description: "A spade for digging.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    coordinates: [3, 0],
    emoji: "🎒",
    itemName: "backpack",
    image: "/backpack.png",
    description: "A craftsman has a lopsided backpack on display.",
    deps: ["sewing things", "canvas", "patch"],
    hint: "Although it's too ugly for sale, the craftsman will not give it to you unless you can find him something useful to his trade.\n\nHe's pretty sure you might find something useful in some sacks nearby.",
    metMessage:
      "You give the craftsman the materials, and he gives you the irregular backpack.",
    newMaxItems: 7,
    keepForNextLevel: "forest",
    container: CONTAINER_IMAGE_TYPE.CRAFTER,
  },
  {
    emoji: "🔑",
    coordinates: [5, 3],
    itemName: "small key",
    image: "/smallkey.png",
    description: "A small key.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "📕",
    itemName: "book",
    coordinates: [5, 6],
    description: "A very dusty red book.",
    deps: ["small key"],
    hint: "It is in a locked case.",
    metMessage: "You unlock the bookcase and take the book.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "🥜",
    itemName: "seeds",
    coordinates: [2, 6],
    description: "A handful of seeds.",
    image: "/seeds.png",
    deps: ["spade"],
    hint: "Most of them are buried in the ground.",
    metMessage:
      "You churn up the earth and take as many seeds as you can find.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "🪺",
    image: "/eggs.png",
    itemName: "eggs",
    deps: ["seeds"],
    coordinates: [1, 7],
    description: "Unfertilized chicken eggs.",
    hint: "They are guarded by an unusually fearsome chicken.",
    metMessage:
      "You throw the seeds out into the yard.\n\nThe fearsome chicken runs after them and you take her eggs.",
    container: CONTAINER_IMAGE_TYPE.CHICKEN,
  },
  {
    emoji: "📐",
    coordinates: [8, 6],
    itemName: "angle ruler",
    description: "A angle ruler, used for precision drawing.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "🪶",
    coordinates: [9, 2],
    itemName: "pen",
    image: "/pen.png",
    description: "A quill full of ink.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "🗺",
    itemName: "map",
    coordinates: [8, 0],
    deps: ["angle ruler", "pen", "book"],
    description: "A scribe is selling a vague map.",
    hint: "She is willing to fill in the map's missing details, if you can bring her the materials she needs.\n\nShe will need things to draw with, and reference material.",
    metMessage: "The scribe draws you a map.",
    keepForNextLevel: "forest",
    container: CONTAINER_IMAGE_TYPE.ELDER,
  },
  {
    emoji: "🥐",
    coordinates: [8, 4],
    itemName: "bread",
    description: "Nonperishable sweetbread.",
    hint: "The baker says you can have some if you can find some eggs for her recipe.",
    metMessage:
      "The baker takes the eggs, and within the hour, you have a highly portable snack.",
    keepForNextLevel: "forest",
    deps: ["eggs"],
    container: CONTAINER_IMAGE_TYPE.BAKER,
  },
  {
    emoji: "🪡",
    coordinates: [2, 0],
    itemName: "sewing things",
    description: "A very sturdy needle and thick thread.",
    image: "/needle.png",
    container: CONTAINER_IMAGE_TYPE.SACK,
  },
];

const previousLevelItems = Object.values(room1.containers)
  .filter((item) => item.keepForNextLevel)
  .map((item) => ({
    ...item,
    id: `castle-${item.itemName}`,
    keepForNextLevel: item.keepForNextLevel !== name,
    node: null,
    deps: [],
  }));

const containers = createContainers({ containers: _containers, grid, name });

const _obstacles = [
  {
    coordinates: [0, 9],
    image: "/tree.png",
  },
  {
    coordinates: [9, 0],
    image: "/tree2.png",
  },
  {
    coordinates: [9, 1],
    image: "/house.png",
  },

  {
    coordinates: [6, 6],
    image: "/house.png",
  },
  {
    coordinates: [7, 6],
    image: "/house.png",
  },
  {
    coordinates: [7, 0],
    image: "/house.png",
  },
  {
    coordinates: [1, 9],
    image: "/house.png",
  },
  {
    coordinates: [2, 9],
    image: "/house.png",
  },
  {
    coordinates: [7, 8],
    image: "/house.png",
  },
  {
    coordinates: [8, 8],
    image: "/house.png",
  },
  {
    coordinates: [0, 5],
    image: "/house.png",
  },
  {
    coordinates: [0, 6],
    image: "/tree2.png",
  },
  {
    coordinates: [1, 6],
    image: "/house.png",
  },
];
const obstacles = createObstacles({ obstacles: _obstacles, grid });

console.assert(
  [...Array(gridWidth * gridHeight).keys()]
    .map((i) => [i % gridWidth, Math.floor(i / gridWidth)])
    .map(([x, y]) => grid.getNodeAt(x, y))
    .filter((node) => !node.walkable).length ===
    _obstacles.length + _containers.length,
  `${name}: All containers and obstacles should be placed on the grid.`
);

export const room2 = {
  name,
  startMessage,
  containers,
  grid,
  finder,
  maxItems: 4,
  startInventory: [],
  previousLevelItems,
  obstacles,
  player,
};
