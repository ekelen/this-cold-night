import PF from "pathfinding";

export const cellLen = 40;
export const gridWidth = 10;
export const gridHeight = 10;
export const pxPerFrame = cellLen * 0.25;

const lookLeft = (x, y) => [Math.max(0, x - 1), y];
const lookRight = (x, y) => [Math.min(gridWidth - 1, x + 1), y];
const lookUp = (x, y) => [x, Math.max(0, y - 1)];
const lookDown = (x, y) => [x, Math.min(gridHeight - 1, y + 1)];

export const grid = new PF.Grid(gridWidth, gridHeight);
export const finder = new PF.AStarFinder(grid);
grid.getNodeAt(2, 2).walkable = false;
grid.getNodeAt(2, 6).walkable = false;
grid.getNodeAt(3, 7).walkable = false;

grid.getNodeAt(5, 5).walkable = false;
grid.getNodeAt(5, 6).walkable = false;
grid.getNodeAt(5, 7).walkable = false;

grid.getNodeAt(8, 9).walkable = false;
grid.getNodeAt(9, 9).walkable = false;
grid.getNodeAt(5, 9).walkable = false;

grid.getNodeAt(7, 2).walkable = false;
grid.getNodeAt(7, 3).walkable = false;
grid.getNodeAt(0, 4).walkable = false;
grid.getNodeAt(8, 4).walkable = false;

export const getPath = (startX, startY, endX, endY) => {
  const path = finder.findPath(startX, startY, endX, endY, grid.clone());
  return path;
};

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
