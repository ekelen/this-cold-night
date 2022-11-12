import { CONTAINERS } from "../constants";
import { createItems, finderMaker, gridMaker } from "../setup";

const grid = gridMaker();
const finder = finderMaker(grid);

const startMessage =
  "You are in the village outside the castle. You will need some items to prepare to enter the forest beyond...";

const chestCoordinates = [
  [9, 8],
  [1, 8],
  [2, 2],
  [2, 6],
  [0, 7],
  [1, 5],
  [5, 3],
  [5, 6],
  [0, 1],
  [7, 2],
  [7, 4],
  [8, 0],
  [8, 4],
  [8, 6],
  [9, 0],
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
    container: CONTAINERS.CHEST,
  },
  [2]: {
    emoji: "🔎",
    name: "magnifying glass",
    description: "A magnifying glass.",
    container: CONTAINERS.CHEST,
  },
  [3]: {
    emoji: "♤",
    name: "spade",
    description: "A spade for digging.",
    container: CONTAINERS.CHEST,
  },
  [4]: {
    emoji: "🎒",
    name: "backpack",
    description:
      "A backpack, lopsided but serviceable, which might allow you to carry more things.",
    deps: ["sewing things", "leather"],
    hint: "Although it's too ugly for sale, the craftsman will not give it to you unless you can find the materials for him to make another.",
    metMessage:
      "You give the craftsman the required materials, and he gives you the irregular backpack.",
    newMaxItems: 6,
    keepForNextLevel: true,
    container: CONTAINERS.GUARD,
  },
  [5]: {
    emoji: "🔑",
    name: "key",
    description: "A small key.",
    container: CONTAINERS.CHEST,
  },
  [6]: {
    emoji: "📕",
    name: "book",
    description: "A very dusty red book.",
    deps: ["key"],
    hint: "It is in a locked case.",
    metMessage: "You unlock the bookcase and take the book.",
    container: CONTAINERS.CHEST,
  },
  [7]: {
    emoji: "🥜",
    name: "seeds",
    description: "A handful of seeds.",
    deps: ["spade"],
    hint: "Most of them are buried in the ground.",
    metMessage:
      "You churn up the earth and take as many seeds as you can find.",
    container: CONTAINERS.CHEST,
  },
  [8]: {
    emoji: "🪺",
    name: "eggs",
    deps: ["seeds"],
    description: "Unfertilized chicken eggs.",
    hint: "They are guarded by an unusually fearsome chicken.",
    metMessage:
      "You throw the seeds out into the yard. The fearsome chicken runs after them and you take her eggs.",
    container: CONTAINERS.CHEST,
  },
  [9]: {
    emoji: "⊾",
    name: "drawing compass",
    description: "A drawing compass, used to inscribe circles.",
    container: CONTAINERS.CHEST,
  },
  [10]: {
    emoji: "🪶",
    name: "pen",
    description: "A quill full of ink.",
    container: CONTAINERS.CHEST,
  },
  [11]: {
    emoji: "🗺",
    name: "map",
    deps: ["drawing compass", "pen", "book", "magnifying glass"],
    description: "A map.",
    hint: "It is missing some important details. The scribe here is willing to help you, if you can bring him the materials he needs. He has very poor vision.",
    metMessage: "The scribe draws you a map.",
    keepForNextLevel: true,
    container: CONTAINERS.CHEST,
  },
  [12]: {
    emoji: "🥐",
    name: "bread",
    description: "Nonperishable sweetbread.",
    hint: "The baker says you can have some if you can find some eggs for her next batch.",
    metMessage:
      "The baker takes the eggs, and within the hour, you have a highly portable snack.",
    keepForNextLevel: true,
    deps: ["eggs"],
    container: CONTAINERS.BAKER,
  },
  [13]: {
    emoji: "📜",
    name: "leather",
    deps: [],
    description: "Some leather scraps.",
    hint: "",
    metMessage: "",
    container: CONTAINERS.CHEST,
  },
  [14]: {
    emoji: "🪡",
    name: "sewing things",
    description: "A very sturdy needle and thick thread.",

    container: CONTAINERS.CHEST,
  },
};

const items = createItems({ items: _items, chestCoordinates, grid });

export const room2 = {
  startMessage,
  items,
  grid,
  finder,
  maxItems: 4,
  startInventory: [],
};
