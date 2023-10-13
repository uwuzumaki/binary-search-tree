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

  root = buildTree(sortedArr, first, last);

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

  //Function to traverse a binary tree in breadth-first level order. The root node is put into the queue first.
  //It is then moved out of the queue into a node object and the data is pushed into a level array. If the node has a child,
  //it is pushed into the queue. If a callback function exists, it will be called after the nodes are pushed into the queue.
  //Additionally, the level array can be removed if nested arrays are undesired and the node.data can be pushed directly into
  //the results array.
  const levelOrder = (callbackFN) => {
    if (!root) return [];
    const queue = [root];
    const results = [];
    while (queue.length) {
      let level = [];
      let size = queue.length;
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        level.push(node.data);
        node.left ? queue.push(node.left) : null;
        node.right ? queue.push(node.right) : null;
        callbackFN ? callbackFN(node) : null;
      }
      results.push(level);
    }
    if (!callbackFN) return results;
  };

  //Left, root, right
  const inOrder = (callbackFn) => {
    let results = [];
    const traverse = (node) => {
      node.left ? traverse(node.left) : null;
      results.push(node.data);
      callbackFn ? callbackFn(node) : null;
      node.right ? traverse(node.right) : null;
    };
    traverse(root);
    if (!callbackFn) return results;
  };

  //Root, left, right
  const preOrder = (callbackFn) => {
    let results = [];
    const traverse = (node) => {
      results.push(node.data);
      callbackFn ? callbackFn(node) : null;
      node.left ? traverse(node.left) : null;
      node.right ? traverse(node.right) : null;
    };
    traverse(root);
    if (!callbackFn) return results;
  };

  //Left, right, root
  const postOrder = (callbackFn) => {
    let results = [];
    const traverse = (node) => {
      node.left ? traverse(node.left) : null;
      node.right ? traverse(node.right) : null;
      results.push(node.data);
      callbackFn ? callbackFn(node) : null;
    };
    traverse(root);
    if (!callbackFn) return results;
  };

  //Function to find a height of a specific node. First checks if the node is present in the tree.
  //Then recursively searches the left and right nodes. Whichever subtree value is higher, it'll return that value as height.
  const height = (gNode) => {
    if (!gNode) return -1;

    let leftH = height(gNode.left);
    let rightH = height(gNode.right);

    if (leftH > rightH) {
      return leftH++;
    } else {
      return rightH++;
    }
  };

  //Finds the depth of a specific node. First checks that the node is present in the tree.
  //Then recursively searches for the node, adding 1 to the distance each time it fails to find a node.
  //When the node is found, distance is increased by 1 again. The distance is then returned.
  const depth = (gNode) => {
    const present = find(gNode.data);
    if (!present) return null;

    let dist = -1;
    const search = (node) => {
      if (gNode.data < node.data) {
        dist++;
        search(node.left);
      } else if (gNode.data > node.data) {
        dist++;
        search(node.right);
      } else {
        dist++;
      }
    };
    search(root);
    return dist;
  };

  //Function for finding if the BST is balanced. A tree is balanced when the left and right subtree of any node do not differ
  //by more than one. The traversal function takes a node (the root in this case) and first checks if the currentNode is null.
  //If it is null, it means we've reached a leaf node and can start working backwards up the tree.
  //A DFS is performed and at each node, the absolute value of the height of the subtrees are compared. If the absolute difference
  //between the two height return results are greater than 1, -1 is returned. If at the end they do not differ by more than 1,
  //The height of the entire tree is returned. A determination is made of whether or not the tree is balanced at the bottom based on the result.
  const isBalanced = () => {
    const traverse = (currentNode) => {
      if (currentNode == null) return 0;

      let leftH = traverse(currentNode.left);
      if (leftH == -1) return -1;

      let rightH = traverse(currentNode.right);
      if (rightH == -1) return -1;

      if (Math.abs(leftH - rightH) > 1) return -1;

      return Math.max(leftH, rightH) + 1;
    };

    let results = traverse(root);

    return results == -1 ? "Tree is not balanced" : "Tree is balanced";
  };

  //Rebalances the tree. The inOrder function will go through the tree and create an inOrder array (based on the tree). The sort
  //function will ensure the array only ascends. A new tree and root node will be created with the tree function.
  const rebalance = () => {
    const newArray = inOrder().sort((a, b) => a - b);
    return (root = Tree(newArray).root);
  };

  //Helper function to return the root. For whatever reason when directly referencing the root, outside, the root never updates
  //despite despite the tree being manipulated by the various methods. Workaround solution until I figure out a way to address this.
  const rootGetter = () => root;

  return {
    // root,
    rootGetter,
    buildTree,
    insert,
    min,
    deleteNode,
    find,
    levelOrder,
    inOrder,
    preOrder,
    postOrder,
    height,
    depth,
    isBalanced,
    rebalance,
  };
};

let nt = Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

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

// prettyPrint(nt.rootGetter());
// nt.insert(500);
// nt.insert(501);
// nt.insert(502);
// prettyPrint(nt.rootGetter());
// nt.deleteNode(67);
// prettyPrint(nt.rootGetter());
// console.log(nt.find(4));
// console.log(nt.levelOrder());
// console.log(nt.inOrder());
// console.log(nt.preOrder());
// console.log(nt.postOrder());
// console.log(nt.depth(nt.find(7)));
// console.log(nt.height(nt.find(8)));
console.log(nt.isBalanced());
nt.rebalance();
console.log(nt.rootGetter());
prettyPrint(nt.rootGetter());
