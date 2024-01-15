/**
 * 引入vdom
 * */

// 创建文本节点
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 *
 * @param {*} type 类型
 * @param {*} props 属性
 * @param  {...any} children 子节点
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 为了createElement('div', { id: 'container' }, '21silva-miniReact second')直接传值，而不是createElement('div', { id: 'container' }, createTextNode('21silva-miniReact second'))这样
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
}

/**
 * 简易render函数
 * @param {*} el
 * @param {*} container
 */
function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // 确定根节点 root
  root = nextUnitOfWork;
}

let root = null;

/**
 * workLoop 完整的工作循环
 * 源码：也就是DFS遍历ReactElement的过程，其中递阶段对应beginWork方法， 归阶段对应completeWork方法
 */
let nextUnitOfWork = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // shouldYield = deadline.timeRemaining() < 1;
  }
  // 链表结束 且 确保执行一次，有根的时候执行
  if (!nextUnitOfWork && root) {
    commitRoot();
  }

  // requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child);
  // 确保执行一次，有根的时候执行，这里就重置为null
  root = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  // 当前的dom 添加到父级dom里
  domParent.append(fiber.dom);
  // 递归子节点
  commitWork(fiber.child);
  // 递归兄弟节点
  commitWork(fiber.sibling);
}

/**
 *
 * @param {*} type
 */
function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber) {
  const children = fiber.props.children || [];
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      dom: null,
      child: null,
      sibling: null,
    };

    // 根结点的第一个子节点
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function performUnitOfWork(fiber) {
  // 判断dom存在不，不存在再去create
  if (!fiber.dom) {
    // c dom
    const dom = (fiber.dom = createDom(fiber.type));
    // fiber.parent.dom.append(dom);

    // update  props
    updateProps(dom, fiber.props);
  }

  // 转换： DOM tree -> 链表，遵循DFS+BFS递归
  initChildren(fiber);

  // 继续执行
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

// 导出React
const React = {
  render,
  createElement,
};
export default React;
