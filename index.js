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
    //This step is important because it sets the new mid point as the middle point of each new subarray.
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
    search(root); //Initial call of the root node
  };

  //Finds the min value of the whole tree
  const min = () => {
    let currentNode = root;

    while (currentNode.left) {
      currentNode = currentNode.left;
    }

    return currentNode.data;
  };

  //Finds the min value of a given subsection of the tree
  const minNode = (node) => {
    let currentNode = node;

    while (currentNode.left) {
      currentNode = currentNode.left;
    }

    return currentNode.data;
  };

  //Function to delete a node given a specific value. Like the insert function, it will search the tree base by comparing the value and the data of the node.
  //Lesser = Left, Greater = Right.
  //If the value matches, it will then check one of three conditions.
  //If it's a leaf node (no children), it will simply set the parent node to have a null value instead of a link to the deleted node
  //If there is a single child, the specified node will have it's value be replaced by the data of it's child and the link to the child will be set to null.
  //If there is two children, the minimum data of the right subtree will replace the data of the target value.
  const deleteNode = (value) => {
    //The search function that traverses the true with a provided node and a value to look for.
    const search = (currentNode, value) => {
      if (value < currentNode.data) {
        //By setting the left and right of the currentNode to be the return of the search function, when the function resolves, it will be replaced by the same node
        //if the search value is greater or lesser than the data value.
        currentNode.left = search(currentNode.left, value);
        return currentNode;
      } else if (value > currentNode.data) {
        currentNode.right = search(currentNode.right, value);
        return currentNode;
      }
      //Leaf Node
      if (!currentNode.left && !currentNode.right) {
        return null;
      }
      //One child
      if (!currentNode.right) {
        let temporaryNode = currentNode.left;
        currentNode.left = null;
        return temporaryNode;
      } else if (!currentNode.left) {
        let temporaryNode = currentNode.right;
        currentNode.right = null;
        return temporaryNode;
      }
      //If the node has both children. It first takes the right subtree of the node to be deleted then finds the minimum value of the subtree and saves it.
      //It then calls the search function recursively on the minimum value of the right subtree, thereby removing it.
      //The currentNode data is then set to be the saved minimum value of the right subtree. The node is then returned.
      if (currentNode.right && currentNode.left) {
        let rightSide = currentNode.right;
        let rightMin = minNode(rightSide);
        search(currentNode, rightMin);
        currentNode.data = rightMin;
        return currentNode;
      }
    };
    search(root, value);
  };

  //Find function that finds and returns the node when given a value;
  const find = (value) => {
    let newNode = null;
    const search = (node) => {
      if (value < node.data) {
        search(node.left);
      } else if (value > node.data) {
        search(node.right);
      } else {
        newNode = node;
      }
    };
    search(root);
    return newNode;
  };

  const levelOrder = (callback) => {
    if (!root) return [];
    const queue = [root];
    const results = [];
    while (queue.length) {
      let level = [];
      let size = queue.length;
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        level.push(node.data);
        node.left ? queue.push : null;
        node.right ? queue.push(node.right) : null;
        callback ? callback(node) : null;
      }
      results.push(level);
    }
    if (!callback) return results;
  };

  root = buildTree(sortedArr, first, last);
  return { root, buildTree, insert, min, deleteNode, find, levelOrder };
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

prettyPrint(nt.root);
// nt.insert(66);
// prettyPrint(nt.root);
// nt.deleteNode(67);
// prettyPrint(nt.root);
// nt.find(4)
nt.levelOrder();
