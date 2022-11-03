import PF from "pathfinding";

export const cellLen = 40;
export const gridWidth = 10;
export const gridHeight = 10;
export const pxPerFrame = cellLen * 0.25;

export const grid = new PF.Grid(gridWidth, gridHeight);
export const finder = new PF.AStarFinder(grid);

export const getIdFromPos = ([x, y]) => y * gridHeight + x;
export const getPosFromId = (id) => [
  id % gridWidth,
  Math.floor(id / gridHeight),
];

export const chestCoordinates = [
  [0, 4],
  [1, 8],
  [2, 2],
  [2, 6],
  [3, 7],
  [5, 0],
  [5, 3],
  [5, 6],
  [5, 8],
  [7, 2],
  [7, 4],
  [8, 0],
  [8, 4],
  [8, 6],
  [9, 0],
  [7, 8],
  [9, 8],
];

chestCoordinates.forEach(([x, y]) => grid.setWalkableAt(x, y, false));

const _items = {
  [0]: {
    emoji: "🚪",
    name: "door",
    description: "The way out.",
    deps: ["large key", "scroll", "dog", "coat"],
    hint: "You need a key to open the door. You will also need some items to pass safely in the town outside.",
    metMessage: "You open the door and leave the castle.",
  },
  [1]: {
    emoji: "🪚",
    name: "bonesaw",
    description: "A saw for cutting bone.",
  },
  [2]: {
    emoji: "🍷",
    name: "wine",
    description: "A quantity of wine.",
    deps: ["poison"],
    hint: "It would be effective in putting some guards to sleep, if it had something else in it...",
    metMessage: "You add the poison to the wine.",
  },
  [3]: {
    emoji: "🐶",
    name: "dog",
    deps: ["bone"],
    hint: "He looks like he needs something to chew on.",
    description: "A dog.",
    metMessage:
      "You give the dog the ox bone. He drops it, wags his tail, and follows you.",
    keepForNextLevel: true,
  },
  [4]: {
    emoji: "🕯",
    name: "candle",
    description: "A lit taper candle.",
  },
  [5]: { emoji: "🔑", name: "key", description: "A small key." },
  [6]: {
    emoji: "🧪",
    name: "poison",
    deps: ["strawberry"],
    description: "A vial of poison.",
    hint: "It will need poison berries added to it to make it strong enough to knock someone out.",
    metMessage: "You add the berries to the poison. It's ready to use.",
  },
  [7]: {
    emoji: "🦴",
    name: "bone",
    deps: ["bonesaw"],
    description: "A large ox bone, full of fresh marrow.",
    metMessage: "You make a small crosscut of the bone using the saw.",
    hint: "This bone is too large to carry around by yourself. You'll need something to cut it with.",
  },
  [8]: {
    emoji: "✉️",
    name: "letter",
    deps: ["key", "candle"],
    description: "A letter.",
    hint: "It is locked in a drawer in a dark room.",
    metMessage:
      "You open the drawer and find a letter. You can read it by candlelight. It says: 'All departures from the castle are blocked to those without identity papers.'",
  },
  [9]: {
    emoji: "💍",
    name: "ring",
    description: "A sparkly ring from your grandmother.",
  },
  [10]: {
    emoji: "✏️",
    name: "pen",
    description: "A quill full of ink.",
  },
  [11]: {
    emoji: "🧥",
    name: "coat",
    deps: ["friend"],
    description: "A coat.",
    hint: "It looks very warm and is too bulky to steal.\n\nSomeone will have to gift it to you.",
    metMessage: "The young baker is happy to give you his coat.",
    keepForNextLevel: true,
  },
  [12]: {
    emoji: "🍓",
    name: "strawberry",
    description: "A poisonous strawberry.",
  },
  [13]: {
    emoji: "📜",
    name: "scroll",
    deps: ["letter", "pen"],
    description: "A scroll.",
    hint: "You don't know what to write on it.",
    metMessage:
      "You draw a passable imitation of identity papers for yourself on the scroll.",
    keepForNextLevel: true,
  },
  [14]: {
    emoji: "👨",
    name: "friend",
    deps: ["friend2"],
    description: "A friendly young baker.",
    hint: "He is sad he cannot afford a ring for the kitchen maid he is courting\n\nNor has the courage to give it to her himself...",
    metMessage:
      "The kitchen maid tells the baker she is delighted with the ring!\n\n The baker says you have whatever you want from his meager possessions.",
  },
  [15]: {
    emoji: "👩",
    name: "friend2",
    deps: ["ring"],
    description: "A nice young kitchen maid.",
    hint: "She keeps looking amorously at the young blond fellow in the bakery.",
    metMessage:
      "You give the kitchen maid the ring on behalf of the friendly young baker. She blushes and follows you.",
  },
  [16]: {
    emoji: "🗝",
    name: "large key",
    description: "A large key.",
    deps: ["wine"],
    hint: "The key is in possession of a formidable castle guard who will need to be disabled.",
  },
};

Object.keys(_items).forEach((i) => {
  _items[i].id = getIdFromPos(chestCoordinates[i]);
  _items[i].node = grid.getNodeAt(...chestCoordinates[i]);
});

const newItems = Object.values(_items).reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

export const items = newItems;

export const getItemIdByName = (name) => {
  return (Object.values(items).find((item) => item.name === name) ?? {}).id;
};

export const getItemByName = (name) => {
  return Object.values(items).find((item) => item.name === name);
};

export const getItemEmoji = (x, y) => {
  return items[getIdFromPos([x, y])].emoji;
};

export const getPath = (startX, startY, endX, endY) => {
  const path = finder.findPath(startX, startY, endX, endY, grid.clone());
  return path;
};

const lookLeft = (x, y) => [x - 1, y];
const lookRight = (x, y) => [x + 1, y];
const lookUp = (x, y) => [x, y - 1];
const lookDown = (x, y) => [x, y + 1];

const getValidNeighbors = (x, y) => {
  const neighbors = [
    lookLeft(x, y),
    lookRight(x, y),
    lookUp(x, y),
    lookDown(x, y),
  ];
  return neighbors.filter(
    ([x, y]) => x >= 0 && x < gridWidth && y >= 0 && y < gridHeight
  );
};

const checkChestsToOpen = (currentX, currentY, _grid) => {
  try {
    const neighbors = getValidNeighbors(currentX, currentY).map(([x, y]) =>
      _grid.getNodeAt(x, y)
    );
    return neighbors
      .filter((node) => !node.walkable)
      .map((node) => [node.x, node.y]);
  } catch (e) {
    console.log(`[=] e`, e);
    return [];
  }
};
