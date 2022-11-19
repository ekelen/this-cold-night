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
    acc[id].hint = item.hint || "";
    acc[id].successMessage = item.successMessage || "";
    acc[id].image = item.image || "";
    acc[id].deps = item.deps || [];
    acc[id].metMessage = item.metMessage || "";
    acc[id].container = item.container || "";
    acc[id].node = grid.getNodeAt(x, y);
    return acc;
  }, {});
  chestCoordinates.forEach(([x, y]) => {
    grid.getNodeAt(x, y).walkable = false;
  });
  return formattedItems;
};

export const createObstacles = ({ obstacles, grid }) => {
  obstacles.forEach(({ coordinates }) => {
    grid.getNodeAt(...coordinates).walkable = false;
  });
  const formattedObstacles = obstacles.reduce((acc, obstacle) => {
    const { coordinates, image } = obstacle;
    const id = getIdFromPos(coordinates);
    acc[id] = obstacle;
    acc[id].id = id;
    acc[id].coordinates = coordinates;
    acc[id].image = image;
    return acc;
  }, {});
  return formattedObstacles;
};

export const getItemByName = (items) => (name) => {
  return Object.values(items).find((item) => item.name === name);
};

export const getPath = (startX, startY, endX, endY, grid, finder) => {
  return finder.findPath(startX, startY, endX, endY, grid.clone());
};
