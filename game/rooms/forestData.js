import { CONTAINER_IMAGE_TYPE } from "../constants";
import {
  createContainers,
  createObstacles,
  finderMaker,
  gridHeight,
  gridMaker,
  gridWidth,
} from "../setup";
import { village } from "./villageData";

const roomName = "forest";
const grid = gridMaker();
const finder = finderMaker(grid);

const player = {
  image: "/player_cloak2.png",
  style: {},
};

const startMessage =
  "You are deep in the FOREST beyond the village. It looks like a promising place for a PORTAL.";

const maxItems = 7;

const _containers = [
  {
    coordinates: [4, 8],
    emoji: "🔑",
    itemName: "small key",
    image: "/smallkey.png",
    description: "The ailing HUNTSMAN.",
    deps: ["village-bread"],
    container: CONTAINER_IMAGE_TYPE.HUNTER,
    metMessage:
      "The ailing HUNTSMAN is very happy to have some SWEETBREAD from his favorite baker, to whom he is betrothed.\n\nHe gives you the KEY to his CHEST of belongings, and says you may take whatever you need.",
    hint: "He is hoping you have brought something for him.",
  },
  {
    coordinates: [5, 8],
    emoji: "📦",
    itemName: "tinderbox",
    image: "/tinderbox.png",
    description: "A chest with useful things in it.",
    deps: ["small key"],
    container: CONTAINER_IMAGE_TYPE.CHEST,
    hint: "There are several TINDERBOXES and other camp gear in here, but it is locked.",
    metMessage:
      "You use the huntsman's KEY to open the chest and remove a TINDERBOX.",
  },
  {
    coordinates: [5, 1],
    emoji: "🌲",
    image: "/nuts.png",
    itemName: "nuts",
    description: "Various NUTS, hidden in a tree.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.TREE,
  },
  {
    coordinates: [0, 2],
    emoji: "?",
    itemName: "garbage",
    image: "/sack.png",
    description: "A sack.",
    deps: ["village-map"],
    container: CONTAINER_IMAGE_TYPE.SACK,
    hint: "A sack.",
    empty: true,
    metMessage:
      "A not-bear-proof GARBAGE SACK. You toss your MAP in. You no longer need it.",
  },
  {
    coordinates: [3, 7],
    emoji: "🪵",
    itemName: "wood",
    image: "/wood.png",
    description: "A stand of trees.",
    deps: ["village-axe"],
    container: CONTAINER_IMAGE_TYPE.TREE,
    metMessage: "You use the AXE to chop some WOOD.",
  },
  {
    coordinates: [8, 0],
    emoji: "🔦",
    itemName: "torch",
    image: "/torch.png",
    description: "There are some rags here soaked in oil.",
    deps: ["wood", "tinderbox"],
    container: CONTAINER_IMAGE_TYPE.SACK_ALT,
    hint: "You could make a TORCH, if you had the other materials...",
    metMessage:
      "You create a TORCH from the wood and oily cloth and set it aflame.",
  },
  {
    coordinates: [9, 0],
    emoji: "💎",
    itemName: "crystals",
    description:
      "A very dark shaft-like CAVE with something shimmering at the bottom.",
    deps: ["torch"],
    container: CONTAINER_IMAGE_TYPE.CAVE,
    hint: "It's TOO DARK to enter...",
    metMessage:
      "You retrieve sparkly CRYSTALS from the cave shaft, illuminated by the TORCH.",
  },
  {
    coordinates: [5, 5],
    emoji: "?",
    image: "/scroll.png",
    itemName: "ice scroll",
    description: "An ancient SCROLL, frozen in ice.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [9, 5],
    emoji: "?",
    itemName: "fire scroll",
    image: "/scroll.png",
    description: "An ancient SCROLL, glowing like embers.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [8, 6],
    emoji: "?",
    itemName: "wind scroll",
    image: "/scroll.png",
    description: "An ancient SCROLL, fluttering as if it might take flight.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [6, 6],
    emoji: "?",
    itemName: "sea scroll",
    image: "/scroll.png",
    description: "An ancient SCROLL, crusted with sand and sea salt.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [4, 3],
    emoji: "?",
    itemName: "elder1",
    image: "/hermit.png",
    description: "A HERMIT who says he has something important to tell you.",
    deps: ["acorns", "nuts", "mushrooms"],
    container: CONTAINER_IMAGE_TYPE.HERMIT,
    empty: true,
    hint: "He demands you bring him all the fruits of the forest. Whatever that means.\n\nHe also advises you that the OTHER HERMIT is untrustworthy.",
    metMessage:
      "The HERMIT is delighted with your gifts.\n\nHe tells you that all you'll need to open the portal is something SHINY to appease the greedy Otherworld lords.\n\nHe also apologizes for littering the forest with SCROLLS.\n\nThey don't do anything.",
  },
  {
    coordinates: [6, 2],
    emoji: "?",
    image: "/seeds.png",
    itemName: "acorns",
    description: "A cache of ACORNS.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.TREE,
  },
  {
    coordinates: [0, 7],
    emoji: "?",
    itemName: "elder2",
    image: "/hermit.png",
    description: "A HERMIT who says he has some vital information.",
    deps: ["acorns", "castle-dog", "village-backpack"],
    newMaxItems: 2,
    container: CONTAINER_IMAGE_TYPE.HERMIT,
    empty: true,
    metMessage:
      "The HERMIT is very pleased with his acorns. He laughs at you, takes your stuff and the dog, and slams the door in your face.\n\nYou might not have judged him very well.",
    hint: "He requests you bring him some ACORNS for his acorn mash.\n\nHe advises you that the OTHER HERMIT is not to be trusted.",
  },
  {
    coordinates: [7, 3],
    emoji: "?",
    itemName: "mushrooms",
    image: "/mushrooms.png",
    description: "A crop of half-frozen MUSHROOMS.",
    deps: [],
    container: CONTAINER_IMAGE_TYPE.TREE,
  },
  {
    coordinates: [7, 5],
    emoji: "?",
    itemName: "portal",
    image: "/portal_closed.png",
    description: "A mysterious-looking PORTAL.",
    deps: ["crystals"],
    container: CONTAINER_IMAGE_TYPE.PORTAL,
    metMessage:
      "You open the PORTAL and hear the sound of predictably ominous underworld-noises beyond.\n\nThere's a sudden SHLURRRRP noise, and you watch the FALSE KING get sucked into the portal.",
    empty: true,
    finalItemForLevel: true,
    hint: "You have no idea what you need to open it.",
  },
];

const containers = createContainers({
  containers: _containers,
  grid,
  roomName,
});

const previousRoomItems = [
  ...Object.values(village.containers)
    .filter((item) => item.keepForNextRoom)
    .map((item) => ({
      ...item,
      id: `${item.room}-${item.itemName}`,
      keepForNextRoom:
        item.keepForNextRoom === roomName ? false : item.keepForNextRoom,
      node: null,
      deps: [],
    })),
  ...village.previousRoomItems.filter((item) => item.keepForNextRoom),
];

const _obstacles = [
  {
    coordinates: [0, 9],
    image: "/tree.png",
  },

  {
    coordinates: [6, 5],
    image: "/tree2.png",
  },
  {
    coordinates: [8, 5],
    image: "/tree.png",
  },
  {
    coordinates: [1, 9],
    image: "/tree2.png",
  },
  {
    coordinates: [2, 9],
    image: "/tree2.png",
  },
  {
    coordinates: [7, 8],
    image: "/tree.png",
  },
  {
    coordinates: [9, 9],
    image: "/tree.png",
  },
  {
    coordinates: [9, 8],
    image: "/tree.png",
  },
  {
    coordinates: [8, 9],
    image: "/tree2.png",
  },
  {
    coordinates: [0, 5],
    image: "/tree.png",
  },
  {
    coordinates: [0, 6],
    image: "/tree2.png",
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

export const forest = {
  containers,
  finder,
  grid,
  maxItems,
  roomName,
  obstacles,
  player,
  previousRoomItems,
  startMessage,
};
