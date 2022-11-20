import { CONTAINER_IMAGE_TYPE } from "../constants";
import {
  createContainers,
  createObstacles,
  finderMaker,
  gridHeight,
  gridMaker,
  gridWidth,
} from "../setup";

const name = "castle";
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
  "You are trapped in a plague-ravaged CASTLE...\n\nRemember where things are, in case you need to retrace your steps. You can only carry a limited number of items at a time, and cannot return them once they have been moved...";

const _containers = [
  {
    coordinates: [9, 8],
    emoji: "🚪",
    itemName: "door",
    image: "/closed_door.png",
    description: "The way out.",
    deps: ["large key", "scroll", "dog", "cloak"],
    hint: "You need a KEY to open the door. You will also need some items to pass safely in the town outside.",
    metMessage: "You open the door and escape the castle!",
    container: CONTAINER_IMAGE_TYPE.DOOR,
    finalItemForLevel: true,
    empty: true,
  },
  {
    coordinates: [1, 8],
    emoji: "🪚",
    itemName: "bonesaw",
    description: "A SAW for cutting BONE.",
    image: "/saw.png",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [9, 4],
    emoji: "🍷",
    itemName: "wine",
    description: "A quantity of tasty WINE.",
    deps: ["poison"],
    hint: "It would be effective in putting some GUARDS to sleep, if it had something else in it...",
    metMessage: "You add the POISON to the WINE.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [3, 7],
    emoji: "🐶",
    itemName: "dog",
    image: "/dog.png",
    deps: ["bone"],
    hint: "He looks like he needs something to chew on.",
    description: "A DOG.",
    metMessage:
      "You give the dog the OX BONE. He drops it, wags his tail, and follows you.",
    keepForNextLevel: "FOREVER",
    container: CONTAINER_IMAGE_TYPE.DOG,
  },
  {
    coordinates: [1, 2],
    emoji: "🕯",
    itemName: "candle",
    description: "A lit taper CANDLE.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [1, 5],
    emoji: "🔑",
    itemName: "small key",
    image: "/smallkey.png",
    description: "A small KEY.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [7, 3],
    emoji: "🧪",
    itemName: "poison",
    image: "/potion.png",
    deps: ["strawberry"],
    description: "A vial of POISON.",
    hint: "It will need poison BERRIES added to it to make it strong enough to knock someone out.",
    metMessage:
      "You add the BERRIES to the poison. It's strong enough to add to SOMETHING PALATABLE.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [5, 8],
    emoji: "🦴",
    itemName: "bone",
    deps: ["bonesaw"],
    description: "A large ox BONE, full of fresh marrow.",
    metMessage: "You make a small crosscut of the bone using the SAW.",
    hint: "It's too large to carry around by yourself. You'll need something to CUT it with.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [0, 1],
    emoji: "✉️",
    itemName: "letter",
    deps: ["small key", "candle"],
    description: "A LETTER.",
    hint: "It is LOCKED in a drawer in a DARK ROOM.",
    metMessage:
      "You UNLOCK the drawer and retrieve the LETTER. You can read it by candlelight. It says: 'All departures from the castle are blocked to those without IDENTITY PAPERS.'",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [9, 2],
    emoji: "💍",
    itemName: "ring",
    description: "A sparkly RING from your grandmother.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [0, 4],
    emoji: "🪶",
    itemName: "pen",
    image: "/pen.png",
    description: "A QUILL full of ink.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [8, 0],
    emoji: "🧥",
    itemName: "cloak",
    image: "/cloak.png",
    deps: ["huntsman"],
    description: "A CLOAK.",
    hint: "It looks very warm and is too bulky to steal.\n\nSomeone will have to gift it to you.",
    metMessage: "The young HUNTSMAN is happy to give you his cloak.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [8, 5],
    emoji: "🍓",
    itemName: "strawberry",
    description: "A poisonous STRAWBERRY.",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [2, 4],
    emoji: "📜",
    itemName: "scroll",
    image: "/scroll.png",
    deps: ["letter", "pen"],
    description: "A SCROLL.",
    hint: "You don't know what to write on it. Maybe you need to read some important INFORMATION first, and find SOMETHING TO WRITE WITH.",
    metMessage:
      "You draw a passable imitation of IDENTITY PAPERS for yourself on the scroll with the QUILL.",
    keepForNextLevel: "village",
    container: CONTAINER_IMAGE_TYPE.CHEST,
  },
  {
    coordinates: [9, 0],
    emoji: "👨",
    itemName: "huntsman",
    image: "/hunter.png",
    deps: ["baker"],
    description: "A friendly young HUNTSMAN, coughing painfully.",
    hint: "He is sad he cannot afford a RING for the pretty BAKER he is courting.\n\nNor has the courage to give it to her himself...",
    metMessage:
      "The baker is delighted with the huntsman's proposal!\n\n The huntsman says you can have whatever you want from his meager possessions...",
    container: CONTAINER_IMAGE_TYPE.HUNTER,
  },
  {
    coordinates: [3, 0],
    emoji: "👩",
    itemName: "baker",
    deps: ["ring"],
    image: "/baker.png",
    description: "A pretty young BAKER, sick with plague.",
    hint: "She keeps looking amorously at the young huntsman...",
    metMessage:
      "You give the BAKER the RING on behalf of the friendly young HUNTSMAN. She blushes and asks you to help her find him.",
    container: CONTAINER_IMAGE_TYPE.BAKER,
  },
  {
    coordinates: [8, 8],
    emoji: "🗝",
    itemName: "large key",
    image: "/key.png",
    description: "A large key.",
    deps: ["wine"],
    hint: "The KEY is in possession of a formidable castle GUARD who will need to be disabled.",
    metMessage:
      "You give the wine to the guard. He falls asleep and you take the KEY.",
    container: CONTAINER_IMAGE_TYPE.GUARD,
  },
  {
    coordinates: [5, 4],
    emoji: "?",
    itemName: "king",
    image: "/king1.png",
    description: "The king.",
    deps: [],
    empty: true,
    metMessage:
      "The KING looks at you suspiciously.\n\nBut this is not your king. This is an underworld USURPER, stealing the souls of the plague-dead for his twisted ends!\n\nYou will have to find a way to send him back to his own realm.",
    container: CONTAINER_IMAGE_TYPE.KING,
  },
];

const _obstacles = [];

const obstacles = createObstacles({ obstacles: _obstacles, grid });

const containers = createContainers({ containers: _containers, grid, name });

console.assert(
  [...Array(gridWidth * gridHeight).keys()]
    .map((i) => [i % gridWidth, Math.floor(i / gridWidth)])
    .map(([x, y]) => grid.getNodeAt(x, y))
    .filter((node) => !node.walkable).length ===
    _obstacles.length + _containers.length,
  `${name}: All containers and obstacles should be placed on the grid.`
);

export const room1 = {
  name,
  startMessage,
  containers,
  grid,
  finder,
  maxItems,
  previousLevelItems: [],
  obstacles,
  player,
};
