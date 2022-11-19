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

export const createContainers = ({ containers, grid }) => {
  const formattedContainers = containers.reduce((acc, container) => {
    const [x, y] = container.coordinates;
    const id = getIdFromPos([x, y]);
    acc[id] = container;
    acc[id].id = id;
    acc[id].hint = container.hint || "";
    acc[id].successMessage = container.successMessage || "";
    acc[id].image = container.image || "";
    acc[id].deps = container.deps || [];
    acc[id].metMessage = container.metMessage || "";
    acc[id].container = container.container || "";
    acc[id].node = grid.getNodeAt(x, y);
    return acc;
  }, {});
  Object.values(formattedContainers).forEach((container) => {
    container.node.walkable = false;
  });
  return formattedContainers;
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
