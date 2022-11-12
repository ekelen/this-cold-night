import PF from "pathfinding";

export const cellLen = 40;
export const gridWidth = 10;
export const gridHeight = 10;
export const pxPerFrame = cellLen * 0.25;

export const getIdFromPos = ([x, y]) => y * gridHeight + x;
export const getPosFromId = (id) => [
  id % gridWidth,
  Math.floor(id / gridHeight),
];

export const gridMaker = () => new PF.Grid(gridWidth, gridHeight);
export const finderMaker = (grid) => new PF.AStarFinder(grid);

export const createItems = ({ items, chestCoordinates, grid }) => {
  const formattedItems = Object.values(items).reduce((acc, item, i) => {
    const [x, y] = chestCoordinates[i];
    const id = getIdFromPos([x, y]);
    acc[id] = item;
    acc[id].id = id;
    acc[id].node = grid.getNodeAt(x, y);
    return acc;
  }, {});
  chestCoordinates.forEach(([x, y]) => {
    grid.getNodeAt(x, y).walkable = false;
  });
  return formattedItems;
};

export const getItemByName = (items) => (name) => {
  return Object.values(items).find((item) => item.name === name);
};

export const getPath = (startX, startY, endX, endY, grid, finder) => {
  return finder.findPath(startX, startY, endX, endY, grid.clone());
};
