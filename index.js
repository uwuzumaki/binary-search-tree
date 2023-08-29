const Node = () => {
  const data = null;
  const left = null;
  const right = null;
};

const Tree = () => {
  let root = null;

  const buildTree = (arr) => {
    const newArr = arr.sort((a, b) => a - b);
    return [...new Set(newArr)];
  };
  return { root, buildTree };
};

const nt = Tree();

console.log(nt.buildTree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]));
