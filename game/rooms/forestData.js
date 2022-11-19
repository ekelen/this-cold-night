import { CONTAINER_IMAGE_TYPE } from "../constants";
import {
  createContainers,
  createObstacles,
  finderMaker,
  gridHeight,
  gridMaker,
  gridWidth,
} from "../setup";
import { room2 } from "./room2Data";

const name = "forest";
const grid = gridMaker();
const finder = finderMaker(grid);

const player = {
  image: "/player_cloak2.png",
  style: {},
};

const startMessage =
  "You are deep in the forest beyond the village. It looks like a promising place for a portal.";

const maxItems = 7;

const _containers = [
  {
    coordinates: [4, 0],
    emoji: "🔑",
    itemName: "small key",
    image: "/smallkey.png",
    description: "The huntsman has many useful items in his chest.",
    deps: ["village-bread"],
    container: CONTAINER_IMAGE_TYPE.HUNTER,
    metMessage:
      "The huntsman is very happy to have some sweetbread from his favorite baker.\n\nHe gives you the key to his chest of belongings, and says you may take whatever you need.",
    hint: "The huntsman is hoping you have brought something for him.",
  },
  {
    coordinates: [5, 0],
    emoji: "📦",
    itemName: "tinderbox",
    image: "/tinderbox.png",
    description: "A tinderbox, with all you need to start a fire.",
    deps: ["small key"],
    container: CONTAINER_IMAGE_TYPE.CHEST,
    hint: "There are several tinderboxes in this chest, but it belongs to someone...",
    metMessage:
      "You use the huntsman's key to open the chest and remove a tinderbox.",
  },
  {
    coordinates: [6, 0],
    emoji: "🌲",
    image: "/nuts.png",
    itemName: "nuts",
    description: "Various nuts, hidden in a tree.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.TREE,
  },
  {
    coordinates: [7, 0],
    emoji: "🪵",
    itemName: "wood",
    description: "A stand of trees.",
    deps: ["village-axe"],
    container: CONTAINER_IMAGE_TYPE.TREE,
    // empty: true,
    // hint: "There are several tinderboxes in this chest, but it belongs to someone...",
    metMessage: "You use the axe to chop some wood.",
  },
  {
    coordinates: [8, 0],
    emoji: "🔦",
    itemName: "torch",
    image: "/torch.png",
    description: "There are some rags here soaked in oil.",
    deps: ["wood", "tinderbox"],
    container: CONTAINER_IMAGE_TYPE.CHEST,
    // empty: true,
    hint: "You could make a torch, if you had the materials...",
    metMessage:
      "You create a torch from the wood and oily cloth and set it aflame.",
  },
  {
    coordinates: [9, 0],
    emoji: "💎",
    itemName: "crystals",
    description:
      "A very dark shaft-like cave with something shimmering at the bottom.",
    deps: ["torch"],
    container: CONTAINER_IMAGE_TYPE.CAVE,
    // empty: true,
    hint: "It's too dark to enter...",
    metMessage: "You retrieve sparkly crystals from the cave shaft.",
  },
  {
    coordinates: [8, 3],
    emoji: "?",
    image: "/scroll.png",
    itemName: "ice scroll",
    description: "An ancient scroll, frozen in ice.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.CHEST,
    // empty: true,
    // hint: "It's too dark to see anything in this cave...",
    // metMessage: "You enter the dark cave and remove some sparkly crystals.",
  },
  {
    coordinates: [7, 3],
    emoji: "?",
    itemName: "fire scroll",
    image: "/scroll.png",
    description: "An ancient scroll, glowing like embers.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.CHEST,
    // empty: true,
    // hint: "It's too dark to see anything in this cave...",
    // metMessage: "You enter the dark cave and remove some sparkly crystals.",
  },
  {
    coordinates: [6, 3],
    emoji: "?",
    itemName: "wind scroll",
    image: "/scroll.png",
    description: "An ancient scroll, fluttering as if it might take flight.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [5, 3],
    emoji: "?",
    itemName: "sea scroll",
    image: "/scroll.png",
    description: "An ancient scroll, crusted with sand and sea salt.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [4, 3],
    emoji: "?",
    itemName: "elder1",
    image: "/hermit.png",
    description: "A hermit who says he has something important to tell you.",
    deps: ["village-map", "acorns", "nuts"],
    container: CONTAINER_IMAGE_TYPE.ELDER,
    empty: true,
    hint: "He demands you bring him all the fruits of the forest. Whatever that means.",
    metMessage:
      "The hermit is delighted with your gifts. He tells you that all you'll need to open the portal is something shiny to appease the greedy Otherworld lords.\n\nHe also apologizes for littering the forest with scrolls.\n\nThey don't do anything.",
  },
  {
    coordinates: [3, 3],
    emoji: "?",
    image: "/seeds.png",
    itemName: "acorns",
    description: "A cache of acorns.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.SACK_ALT,
  },
  {
    coordinates: [2, 3],
    emoji: "?",
    itemName: "elder2",
    image: "/hermit.png",
    description: "A hermit who says he has some vital information.",
    deps: [
      "acorns",
      "village-axe",
      "village-bread",
      "village-map",
      "village-backpack",
    ],
    newMaxItems: 1,
    container: CONTAINER_IMAGE_TYPE.ELDER,
    empty: true,
    metMessage:
      "The elder is very pleased with his acorns. He laughs at you, takes your stuff, and slams the door in your face.\n\nYou might have messed up.",
    hint: "The elder requests you bring him some acorns for his acorn mash. He advises you that the other hermit is not to be trusted.",
  },
  {
    coordinates: [1, 3],
    emoji: "?",
    itemName: "mushrooms",
    image: "/mushrooms.png",
    description: "A crop of half-frozen mushrooms.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.TREE,
  },
  {
    coordinates: [8, 5],
    emoji: "?",
    itemName: "portal",
    image: "/portal_closed.png",
    description: "A mysterious-looking portal.",
    deps: ["crystals"],
    container: CONTAINER_IMAGE_TYPE.PORTAL,
    metMessage:
      "You open the portal and hear the sound of predictably evil laughter beyond.",
    empty: true,
    finalItemForLevel: true,
  },
];

const containers = createContainers({ containers: _containers, grid, name });

const previousLevelItems = [
  ...Object.values(room2.containers)
    .filter((item) => item.keepForNextLevel)
    .map((item) => ({
      ...item,
      id: `${item.room}-${item.itemName}`,
      keepForNextLevel:
        item.keepForNextLevel === name ? false : item.keepForNextLevel,
      node: null,
      deps: [],
    })),
  ...room2.previousLevelItems.filter((item) => item.keepForNextLevel),
];

const _obstacles = [
  {
    coordinates: [0, 9],
    image: "/tree.png",
  },

  {
    coordinates: [6, 6],
    image: "/tree.png",
  },
  {
    coordinates: [7, 6],
    image: "/tree.png",
  },
  {
    coordinates: [1, 9],
    image: "/tree.png",
  },
  {
    coordinates: [2, 9],
    image: "/tree.png",
  },
  {
    coordinates: [7, 8],
    image: "/tree.png",
  },
  {
    coordinates: [8, 8],
    image: "/tree.png",
  },
  {
    coordinates: [0, 5],
    image: "/tree.png",
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

export const forest = {
  containers,
  finder,
  grid,
  maxItems,
  name,
  obstacles,
  player,
  previousLevelItems,
  startMessage,
};
