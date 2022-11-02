import PF from "pathfinding";

export const cellLen = 40;
export const gridWidth = 10;
export const gridHeight = 10;
export const pxPerFrame = cellLen * 0.25;

export const grid = new PF.Grid(gridWidth, gridHeight);
export const finder = new PF.AStarFinder(grid);

const itemNodes = [
  [2, 2],
  [2, 6],
  [3, 7],
  [5, 5],
  [5, 6],
  [5, 7],
  [8, 9],
  [9, 9],
  [5, 9],
  [7, 2],
  [7, 3],
  [0, 4],
  [8, 4],
];

itemNodes.map(([x, y]) => grid.setWalkableAt(x, y, false));

const items = {
  [itemNodes[0][0] * gridWidth + itemNodes[0][1]]: "🍎",
  [itemNodes[1][0] * gridWidth + itemNodes[1][1]]: "🗡",
  [itemNodes[2][0] * gridWidth + itemNodes[2][1]]: "🏹",
  [itemNodes[3][0] * gridWidth + itemNodes[3][1]]: "🔫",
  [itemNodes[4][0] * gridWidth + itemNodes[4][1]]: "🔪",
  [itemNodes[5][0] * gridWidth + itemNodes[5][1]]: "🔨",
  [itemNodes[6][0] * gridWidth + itemNodes[6][1]]: "🔧",
  [itemNodes[7][0] * gridWidth + itemNodes[7][1]]: "🔩",
  [itemNodes[8][0] * gridWidth + itemNodes[8][1]]: "✉️",
  [itemNodes[9][0] * gridWidth + itemNodes[9][1]]: "📦",
  [itemNodes[10][0] * gridWidth + itemNodes[10][1]]: "✏️",
  [itemNodes[11][0] * gridWidth + itemNodes[11][1]]: "🧥",
  [itemNodes[12][0] * gridWidth + itemNodes[12][1]]: "🧦",
};
export const getItem = (x, y) => {
  const key = x * gridWidth + y;
  return items[key];
};
export const getPath = (startX, startY, endX, endY) => {
  const path = finder.findPath(startX, startY, endX, endY, grid.clone());
  return path;
};

const lookLeft = (x, y) => [Math.max(0, x - 1), y];
const lookRight = (x, y) => [Math.min(gridWidth - 1, x + 1), y];
const lookUp = (x, y) => [x, Math.max(0, y - 1)];
const lookDown = (x, y) => [x, Math.min(gridHeight - 1, y + 1)];

export const shouldOpenChest = (currentX, currentY, _grid) => {
  try {
    const neighbors = [lookDown, lookUp, lookLeft, lookRight].map((fn) => {
      const [x, y] = fn(currentX, currentY);
      return _grid.getNodeAt(x, y);
    });
    return neighbors.filter((node) => !node.walkable);
  } catch (e) {
    console.log(`[=] e`, e);
    return [];
  }
};
