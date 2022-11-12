import { CONTAINERS } from "../constants";
import { createItems, finderMaker, gridMaker } from "../setup";

const grid = gridMaker();
const finder = finderMaker(grid);

const maxItems = 4;

const startMessage =
  "You find yourself trapped in a castle... Remember where things are, in case you need to retrace your steps. You can only carry 4 items at a time, and cannot return items once they have been moved...";

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
  [3, 0],
  [8, 8],
];

// chestCoordinates.forEach(([x, y]) => {
//   grid.getNodeAt(x, y).walkable = false;
// });

const _items = {
  [0]: {
    emoji: "🚪",
    name: "door",
    image: "/closed_door.png",
    description: "The way out.",
    deps: ["large key", "scroll", "dog", "cloak"],
    hint: "You need a key to open the door. You will also need some items to pass safely in the town outside.",
    metMessage: "You open the door and escape the castle!",
    container: CONTAINERS.DOOR,
  },
  [1]: {
    emoji: "🪚",
    name: "bonesaw",
    description: "A saw for cutting bone.",
    container: CONTAINERS.CHEST,
  },
  [2]: {
    emoji: "🍷",
    name: "wine",
    description: "A quantity of wine.",
    deps: ["poison"],
    hint: "It would be effective in putting some guards to sleep, if it had something else in it...",
    metMessage: "You add the poison to the wine.",
    container: CONTAINERS.CHEST,
  },
  [3]: {
    emoji: "🐶",
    name: "dog",
    image: "/dog_2.png",
    deps: ["bone"],
    hint: "He looks like he needs something to chew on.",
    description: "A dog.",
    metMessage:
      "You give the dog the ox bone. He drops it, wags his tail, and follows you.",
    keepForNextLevel: true,
    container: CONTAINERS.DOG,
  },
  [4]: {
    emoji: "🕯",
    name: "candle",
    description: "A lit taper candle.",
    container: CONTAINERS.CHEST,
  },
  [5]: {
    emoji: "🔑",
    name: "key",
    description: "A small key.",
    container: CONTAINERS.CHEST,
  },
  [6]: {
    emoji: "🧪",
    name: "poison",
    image: "/yellow.png",
    deps: ["strawberry"],
    description: "A vial of poison.",
    hint: "It will need poison berries added to it to make it strong enough to knock someone out.",
    metMessage:
      "You add the berries to the poison. It's strong enough to add to something palatable.",
    container: CONTAINERS.CHEST,
  },
  [7]: {
    emoji: "🦴",
    name: "bone",
    deps: ["bonesaw"],
    description: "A large ox bone, full of fresh marrow.",
    metMessage: "You make a small crosscut of the bone using the saw.",
    hint: "This bone is too large to carry around by yourself. You'll need something to cut it with.",
    container: CONTAINERS.CHEST,
  },
  [8]: {
    emoji: "✉️",
    name: "letter",
    deps: ["key", "candle"],
    description: "A letter.",
    hint: "It is locked in a drawer in a dark room.",
    metMessage:
      "You open the drawer and find a letter. You can read it by candlelight. It says: 'All departures from the castle are blocked to those without identity papers.'",
    container: CONTAINERS.CHEST,
  },
  [9]: {
    emoji: "💍",
    name: "ring",
    description: "A sparkly ring from your grandmother.",
    container: CONTAINERS.CHEST,
  },
  [10]: {
    emoji: "🪶",
    name: "pen",
    description: "A quill full of ink.",
    container: CONTAINERS.CHEST,
  },
  [11]: {
    emoji: "🧥",
    name: "cloak",
    image: "/cloak_2.png",
    deps: ["friend"],
    description: "A cloak.",
    hint: "It looks very warm and is too bulky to steal.\n\nSomeone will have to gift it to you.",
    metMessage: "The young huntsman is happy to give you his cloak.",
    keepForNextLevel: true,
    container: CONTAINERS.CHEST,
  },
  [12]: {
    emoji: "🍓",
    name: "strawberry",
    description: "A poisonous strawberry.",
    container: CONTAINERS.CHEST,
  },
  [13]: {
    emoji: "📜",
    name: "scroll",
    image: "/scroll-cyan.png",
    deps: ["letter", "pen"],
    description: "A scroll.",
    hint: "You don't know what to write on it. Maybe you need to read some important information first.",
    metMessage:
      "You draw a passable imitation of identity papers for yourself on the scroll with the quill.",
    keepForNextLevel: true,
    container: CONTAINERS.CHEST,
  },
  [14]: {
    emoji: "👨",
    name: "friend",
    image: "/hunter.png",
    deps: ["friend2"],
    description: "A friendly young huntsman.",
    hint: "He is sad he cannot afford a ring for the pretty baker he is courting\n\nNor has the courage to give it to her himself...",
    metMessage:
      "The baker is delighted with the huntsman's proposal!\n\n The huntsman says you can have whatever you want from his meager possessions...",
    container: CONTAINERS.HUNTER,
  },
  [15]: {
    emoji: "👩",
    name: "friend2",
    deps: ["ring"],
    image: "/baker.png",
    description: "A pretty young baker.",
    hint: "She keeps looking amorously at the young huntsman...",
    metMessage:
      "You give the baker the ring on behalf of the friendly young huntsman. She blushes and asks you to help her find him.",
    container: CONTAINERS.BAKER,
  },
  [16]: {
    emoji: "🗝",
    name: "large key",
    description: "A large key.",
    deps: ["wine"],
    hint: "The key is in possession of a formidable castle guard who will need to be disabled.",
    metMessage:
      "You give the wine to the guard. He falls asleep and you take the key.",
    container: CONTAINERS.GUARD,
  },
};

const items = createItems({ items: _items, chestCoordinates, grid });

export const room1 = {
  startMessage,
  items,
  grid,
  finder,
  maxItems,
};
