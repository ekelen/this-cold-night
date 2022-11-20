import { CONTAINER_IMAGE_TYPE } from "../constants";
import {
  createContainers,
  createObstacles,
  finderMaker,
  gridHeight,
  gridMaker,
  gridWidth,
} from "../setup";
import { castle } from "./castleData";

const roomName = "village";
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
    deps: [`${castle.roomName}-scroll`],
    hint: "You need to show him your identity papers to pass.",
    metMessage: "The GUARDSMAN takes your IDENTITY PAPERS.",
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
    finalItemForLevel: true,
  },
  {
    coordinates: [1, 3],
    emoji: "🪓",
    itemName: "axe",
    image: "/axe.png",
    description: "A small AXE.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
    keepForNextRoom: "forest",
  },
  {
    emoji: "📜",
    coordinates: [4, 0],
    itemName: "canvas",
    description: "Sturdy SACKCLOTH.",
    container: CONTAINER_IMAGE_TYPE.SACK,
  },
  {
    emoji: "🏴‍☠️",
    coordinates: [5, 0],
    itemName: "patch",
    description: "An iron-on pirate flag PATCH.",
    container: CONTAINER_IMAGE_TYPE.SACK,
  },
  {
    coordinates: [4, 6],
    emoji: "♤",
    itemName: "spade",
    image: "/shovel.png",
    description: "A SHOVEL for digging.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    coordinates: [3, 0],
    emoji: "🎒",
    itemName: "backpack",
    image: "/backpack.png",
    description: "A sickly CRAFTSMAN has a lopsided BACKPACK on display.",
    deps: ["sewing things", "canvas", "patch"],
    hint: "Although it's too ugly for sale, the CRAFTSMAN will not give it to you unless you can find him some useful items for his trade.\n\nHe is too sick to make his usual rounds of the market.\n\nHe's pretty sure you might find some things in the SACKS nearby.",
    metMessage:
      "You give the craftsman the materials, and he gives you the irregular BACKPACK with a plagueish wheeze.",
    newMaxItems: 7,
    keepForNextRoom: "FOREVER",
    container: CONTAINER_IMAGE_TYPE.CRAFTER,
  },
  {
    emoji: "🔑",
    coordinates: [5, 3],
    itemName: "small key",
    image: "/smallkey.png",
    description: "A small KEY.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "📕",
    itemName: "book",
    coordinates: [5, 6],
    description: "A dusty ATLAS.",
    deps: ["small key"],
    hint: "It is in a locked case.",
    metMessage: "You unlock the bookcase and take the ATLAS.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "🥜",
    itemName: "seeds",
    coordinates: [2, 6],
    description: "A handful of SEEDS.",
    image: "/seeds.png",
    deps: ["spade"],
    hint: "Most of them are buried in the ground.",
    metMessage:
      "You churn up the earth with the SHOVEL and take as many SEEDS as you can find.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "🪺",
    image: "/eggs.png",
    itemName: "eggs",
    deps: ["seeds"],
    coordinates: [1, 7],
    description: "Unfertilized chicken EGGS.",
    hint: "They are guarded by an unusually fearsome chicken.",
    metMessage:
      "You throw the SEEDS out into the yard.\n\nThe fearsome chicken runs after them and you take her EGGS.",
    container: CONTAINER_IMAGE_TYPE.CHICKEN,
  },
  {
    emoji: "📐",
    coordinates: [8, 6],
    itemName: "angle ruler",
    description: "An ANGLE RULER, used for precise drawing.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "🪶",
    coordinates: [9, 2],
    itemName: "pen",
    image: "/pen.png",
    description: "A QUILL full of ink.",
    container: CONTAINER_IMAGE_TYPE.HOUSE,
  },
  {
    emoji: "🗺",
    itemName: "map",
    coordinates: [8, 0],
    deps: ["angle ruler", "pen", "book"],
    description: "A plague-riddled SCRIBE is selling a vague MAP.",
    hint: "She is willing to fill in its missing details, if you can bring her the materials she needs.\n\nShe will need things to DRAW with, and REFERENCE material.",
    metMessage: "The SCRIBE draws you a map, coughing feebly throughout.",
    keepForNextRoom: "forest",
    container: CONTAINER_IMAGE_TYPE.ELDER,
  },
  {
    emoji: "🥐",
    coordinates: [8, 4],
    itemName: "bread",
    description: "Nonperishable SWEETBREAD.",
    hint: "The BAKER says you can have some if you can find some eggs for her recipe. She is too weak to gather them herself.",
    metMessage:
      "The BAKER takes the EGGS, and within the hour, you have a highly portable snack.",
    keepForNextRoom: "forest",
    deps: ["eggs"],
    container: CONTAINER_IMAGE_TYPE.BAKER,
  },
  {
    emoji: "🪡",
    coordinates: [2, 0],
    itemName: "sewing things",
    description: "A very sturdy NEEDLE AND TWINE.",
    image: "/needle.png",
    container: CONTAINER_IMAGE_TYPE.SACK,
  },
];

const previousRoomItems = Object.values(castle.containers)
  .filter((item) => item.keepForNextRoom)
  .map((item) => ({
    ...item,
    id: `${castle.roomName}-${item.itemName}`,
    keepForNextRoom:
      item.keepForNextRoom === roomName ? false : item.keepForNextRoom,
    node: null,
    deps: [],
  }));

const containers = createContainers({
  containers: _containers,
  grid,
  roomName,
});

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
  `${roomName}: All containers and obstacles should be placed on the grid.`
);

export const village = {
  containers,
  finder,
  grid,
  maxItems: 4,
  roomName,
  obstacles,
  player,
  previousRoomItems,
  startMessage,
};
