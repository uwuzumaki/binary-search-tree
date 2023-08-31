//Node factory that creates an object with three values. The actual value itself and its two children.
const Node = (value) => {
  const data = value;
  let left = null;
  let right = null;
  return { data, left, right };
};

//Tree factory that creates the BST based on array provided. First sorts it then removes duplicates.
const Tree = (array) => {
  let root = null;
  const sortedArr = [...new Set(array.sort((a, b) => a - b))];
  const first = 0;
  const last = sortedArr.length - 1;

  //Builds the node tree and returns level 0 root node
  const buildTree = (arr, start, end) => {
    //This step is important because it sets the new mid point as the middle point of the right/left arrays.
    //Math.ceil/floor to remove decimals.
    const mid = Math.ceil((start + end) / 2);
    if (start > end) {
      return null;
    }

    //Preorder traversal
    let node = Node(arr[mid]);
    node.left = buildTree(arr, start, mid - 1);
    node.right = buildTree(arr, mid + 1, end);
    return node;
  };

  //Function to find the appropriate leaf to insert a node on. The function first creates a note object with the value provided
  //The value of the root node is then compared with the provided value.
  //If the provided value is less than the node value, it will go to the left child node. If it is greater, it will go to the right node.
  //This process will repeat until there are no child nodes left (the node being compared is the leaf node).
  //The created note will then be appended to the left or right of the leaf node depending on its value.
  const insert = (value) => {
    let newNode = Node(value);

    const search = (node) => {
      if (value < node.data) {
        //If there is no left node, newNode will be appended
        if (!node.left) {
          node.left = newNode;
        } else {
          //Recursively call itself to check child node.
          search(node.left);
        }
      } else if (value > node.data) {
        //If there is no right node, newNode will be appended
        if (!node.right) {
          node.right = newNode;
        } else {
          //Recursively call itself to check child node.
          search(node.right);
        }
      }
    };
    search(root); //Initial call of the rule node
  };

  const delete2 = () => {};

  root = buildTree(sortedArr, first, last);
  return { root, buildTree, insert };
};

const nt = Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

nt.insert(67);
prettyPrint(nt.root);
