import { CONTAINERS } from "../constants";
import { createItems, finderMaker, gridMaker } from "../setup";
import { room1 } from "./room1Data";

const grid = gridMaker();
const finder = finderMaker(grid);

const startMessage =
  "You are in the village outside the castle. You will need some additional items to prepare to enter the forest beyond...";

const chestCoordinates = [
  [9, 8],
  [1, 3],
  [6, 3],
  [4, 6],
  [0, 7],
  [3, 3],
  [5, 3],
  [5, 6],
  [0, 1],
  [4, 4],
  [7, 4],
  [8, 0],
  [8, 4],
  // [8, 6],
  [0, 5],
];

const _items = {
  [0]: {
    emoji: "🌲",
    name: "door",
    image: "/closed_door.png",
    description: "The village exit.",
    deps: ["backpack", "axe", "bread", "map"],
    hint: "You will need some items to pass safely through the forest.",
    metMessage: "You enter the woods!",
    container: CONTAINERS.DOOR,
  },
  [1]: {
    emoji: "🪓",
    name: "axe",
    description: "A small axe.",
    container: CONTAINERS.SACK,
  },
  [2]: {
    emoji: "🔎",
    name: "magnifying glass",
    description: "A magnifying glass.",
    container: CONTAINERS.SACK,
  },
  [3]: {
    emoji: "♤",
    name: "spade",
    image: "/shovel.png",
    description: "A spade for digging.",
    container: CONTAINERS.SACK,
  },
  [4]: {
    emoji: "🎒",
    name: "backpack",
    image: "/backpack.png",
    description: "A craftsman has a lopsided backpack on display.",
    deps: ["sewing things"],
    hint: "Although it's too ugly for sale, the craftsman will not give it to you unless you can find him something useful to his trade.\n\nHe's pretty sure you might find something useful in a sack nearby.",
    metMessage:
      "You give the craftsman the needle and thread, and he gives you the irregular backpack.",
    newMaxItems: 9,
    keepForNextLevel: true,
    container: CONTAINERS.GUARD,
  },
  [5]: {
    emoji: "🔑",
    name: "key",
    description: "A small key.",
    container: CONTAINERS.SACK,
  },
  [6]: {
    emoji: "📕",
    name: "book",
    description: "A very dusty red book.",
    deps: ["key"],
    hint: "It is in a locked case.",
    metMessage: "You unlock the bookcase and take the book.",
    container: CONTAINERS.HOUSE,
  },
  [7]: {
    emoji: "🥜",
    name: "seeds",
    description: "A handful of seeds.",
    deps: ["spade"],
    hint: "Most of them are buried in the ground.",
    metMessage:
      "You churn up the earth and take as many seeds as you can find.",
    container: CONTAINERS.HOUSE,
  },
  [8]: {
    emoji: "🪺",
    image: "/eggs.png",
    name: "eggs",
    deps: ["seeds"],
    description: "Unfertilized chicken eggs.",
    hint: "They are guarded by an unusually fearsome chicken.",
    metMessage:
      "You throw the seeds out into the yard.\n\nThe fearsome chicken runs after them and you take her eggs.",
    container: CONTAINERS.CHICKEN,
  },
  [9]: {
    emoji: "⊾",
    name: "drawing compass",
    description: "A drawing compass, used to inscribe circles.",
    container: CONTAINERS.HOUSE,
  },
  [10]: {
    emoji: "🪶",
    name: "pen",
    description: "A quill full of ink.",
    container: CONTAINERS.SACK,
  },
  [11]: {
    emoji: "🗺",
    name: "map",
    deps: ["drawing compass", "pen", "book", "magnifying glass"],
    description: "A scribe is selling a vague map.",
    hint: "She is willing to fill in the map's missing details, if you can bring her the materials she needs.\n\nShe has very poor vision.\n\nShe will need things to draw with, and reference material.",
    metMessage: "The scribe draws you a map.",
    keepForNextLevel: true,
    container: CONTAINERS.ELDER,
  },
  [12]: {
    emoji: "🥐",
    name: "bread",
    description: "Nonperishable sweetbread.",
    hint: "The baker says you can have some if you can find some eggs for her recipe.",
    metMessage:
      "The baker takes the eggs, and within the hour, you have a highly portable snack.",
    keepForNextLevel: true,
    deps: ["eggs"],
    container: CONTAINERS.BAKER,
  },
  // [13]: {
  //   emoji: "📜",
  //   name: "leather",
  //   deps: [],
  //   description: "Some leather scraps.",
  //   hint: "",
  //   metMessage: "",
  //   container: CONTAINERS.HOUSE,
  // },
  [13]: {
    emoji: "🪡",
    name: "sewing things",
    description: "A very sturdy needle and thick thread.",

    container: CONTAINERS.SACK,
  },
};

const previousLevelItems = Object.values(room1.items)
  .filter((item) => item.keepForNextLevel)
  .map((item) => ({ ...item, id: `prev-${item.id}` }));

const items = createItems({ items: _items, chestCoordinates, grid });

export const room2 = {
  startMessage,
  items,
  grid,
  finder,
  maxItems: 4,
  startInventory: [],
  previousLevelItems,
};
