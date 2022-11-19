import { CONTAINERS } from "../constants";
import { createItems, createObstacles, finderMaker, gridMaker } from "../setup";

const grid = gridMaker();
const finder = finderMaker(grid);

const player = {
  image: "/player.png",
  style: {
    filter: `'brightness(${1.4})',`,
  },
};

const maxItems = 4;

const startMessage =
  "You find yourself trapped in a castle...\n\nRemember where things are, in case you need to retrace your steps. You can only carry a limited number of items at a time, and cannot return them once they have been moved...";

const _items = {
  [0]: {
    coordinates: [9, 8],
    emoji: "🚪",
    name: "door",
    image: "/closed_door.png",
    description: "The way out.",
    deps: ["large key", "scroll", "dog", "cloak"],
    hint: "You need a key to open the door. You will also need some items to pass safely in the town outside.",
    metMessage: "You open the door and escape the castle!",
    container: CONTAINERS.DOOR,
    finalItemForLevel: true,
  },
  [1]: {
    coordinates: [1, 8],
    emoji: "🪚",
    name: "bonesaw",
    description: "A saw for cutting bone.",
    image: "/saw.png",
    container: CONTAINERS.CHEST,
  },
  [2]: {
    coordinates: [2, 2],
    emoji: "🍷",
    name: "wine",
    description: "A quantity of wine.",
    deps: ["poison"],
    hint: "It would be effective in putting some guards to sleep, if it had something else in it...",
    metMessage: "You add the poison to the wine.",
    container: CONTAINERS.CHEST,
  },
  [3]: {
    coordinates: [2, 6],
    emoji: "🐶",
    name: "dog",
    image: "/dog.png",
    deps: ["bone"],
    hint: "He looks like he needs something to chew on.",
    description: "A dog.",
    metMessage:
      "You give the dog the ox bone. He drops it, wags his tail, and follows you.",
    keepForNextLevel: true,
    container: CONTAINERS.DOG,
  },
  [4]: {
    coordinates: [0, 7],
    emoji: "🕯",
    name: "candle",
    description: "A lit taper candle.",
    container: CONTAINERS.CHEST,
  },
  [5]: {
    coordinates: [1, 5],
    emoji: "🔑",
    name: "small key",
    image: "/smallkey.png",
    description: "A small key.",
    container: CONTAINERS.CHEST,
  },
  [6]: {
    coordinates: [5, 3],
    emoji: "🧪",
    name: "poison",
    image: "/potion.png",
    deps: ["strawberry"],
    description: "A vial of poison.",
    hint: "It will need poison berries added to it to make it strong enough to knock someone out.",
    metMessage:
      "You add the berries to the poison. It's strong enough to add to something palatable.",
    container: CONTAINERS.CHEST,
  },
  [7]: {
    coordinates: [5, 6],
    emoji: "🦴",
    name: "bone",
    deps: ["bonesaw"],
    description: "A large ox bone, full of fresh marrow.",
    metMessage: "You make a small crosscut of the bone using the saw.",
    hint: "This bone is too large to carry around by yourself. You'll need something to cut it with.",
    container: CONTAINERS.CHEST,
  },
  [8]: {
    coordinates: [0, 1],
    emoji: "✉️",
    name: "letter",
    deps: ["small key", "candle"],
    description: "A letter.",
    hint: "It is locked in a drawer in a dark room.",
    metMessage:
      "You open the drawer and find a letter. You can read it by candlelight. It says: 'All departures from the castle are blocked to those without identity papers.'",
    container: CONTAINERS.CHEST,
  },
  [9]: {
    coordinates: [7, 2],
    emoji: "💍",
    name: "ring",
    description: "A sparkly ring from your grandmother.",
    container: CONTAINERS.CHEST,
  },
  [10]: {
    coordinates: [7, 4],
    emoji: "🪶",
    name: "pen",
    image: "/pen.png",
    description: "A quill full of ink.",
    container: CONTAINERS.CHEST,
  },
  [11]: {
    coordinates: [8, 0],
    emoji: "🧥",
    name: "cloak",
    image: "/cloak.png",
    deps: ["huntsman"],
    description: "A cloak.",
    hint: "It looks very warm and is too bulky to steal.\n\nSomeone will have to gift it to you.",
    metMessage: "The young huntsman is happy to give you his cloak.",
    container: CONTAINERS.CHEST,
  },
  [12]: {
    coordinates: [8, 4],
    emoji: "🍓",
    name: "strawberry",
    description: "A poisonous strawberry.",
    container: CONTAINERS.CHEST,
  },
  [13]: {
    coordinates: [8, 6],
    emoji: "📜",
    name: "scroll",
    image: "/scroll.png",
    deps: ["letter", "pen"],
    description: "A scroll.",
    hint: "You don't know what to write on it. Maybe you need to read some important information first.",
    metMessage:
      "You draw a passable imitation of identity papers for yourself on the scroll with the quill.",
    keepForNextLevel: true,
    container: CONTAINERS.CHEST,
  },
  [14]: {
    coordinates: [9, 0],
    emoji: "👨",
    name: "huntsman",
    image: "/hunter.png",
    deps: ["baker"],
    description: "A friendly young huntsman.",
    hint: "He is sad he cannot afford a ring for the pretty baker he is courting.\n\nNor has the courage to give it to her himself...",
    metMessage:
      "The baker is delighted with the huntsman's proposal!\n\n The huntsman says you can have whatever you want from his meager possessions...",
    container: CONTAINERS.HUNTER,
  },
  [15]: {
    coordinates: [3, 0],
    emoji: "👩",
    name: "baker",
    deps: ["ring"],
    image: "/baker.png",
    description: "A pretty young baker.",
    hint: "She keeps looking amorously at the young huntsman...",
    metMessage:
      "You give the baker the ring on behalf of the friendly young huntsman. She blushes and asks you to help her find him.",
    container: CONTAINERS.BAKER,
  },
  [16]: {
    coordinates: [8, 8],
    emoji: "🗝",
    name: "large key",
    image: "/key.png",
    description: "A large key.",
    deps: ["wine"],
    hint: "The key is in possession of a formidable castle guard who will need to be disabled.",
    metMessage:
      "You give the wine to the guard. He falls asleep and you take the key.",
    container: CONTAINERS.GUARD,
  },
};

const _obstacles = [];

const obstacles = createObstacles({ obstacles: _obstacles, grid });

const items = createItems({ items: _items, grid });

export const room1 = {
  name: "castle",
  startMessage,
  items,
  grid,
  finder,
  maxItems,
  startInventory: [],
  previousLevelItems: [],
  obstacles,
  player,
};
