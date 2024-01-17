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
      children: children.map((child) => {
        return typeof child === "number" || typeof child === "string"
          ? createTextNode(child)
          : child;
      }),
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

function updateFn() {
  nextUnitOfWork = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  // 确定根节点 root
  root = nextUnitOfWork;
}

/**
 * workLoop 完整的工作循环
 * 源码：也就是DFS遍历ReactElement的过程，其中递阶段对应beginWork方法， 归阶段对应completeWork方法
 */
let root = null;
let currentRoot = null;
let nextUnitOfWork = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 链表结束 且 确保执行一次，有根的时候执行
  if (!nextUnitOfWork && root) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child);
  // 获取最新根节点
  currentRoot = root;
  // 确保执行一次，有根的时候执行，这里就重置为null
  root = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let fiberParent = fiber.parent;
  // 这里就是 function component ， 没dom, 那么就继续向上👆, 所以这里应该是while,避免多个FC component
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  // 处理不同effectTag情况
  if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    const domParent = fiberParent.dom;
    // fiber.dom存在的时候再去添加，去除FC的情况，因为FC 的 fiber.dom 是null
    if (fiber.dom) {
      // 当前的dom 添加到父级dom里
      domParent.append(fiber.dom);
    }
  }

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

/**
 * 处理更新，分不同对比情况
 * @param {*} dom
 * @param {*} newProps
 * @param {*} oldProps
 */
function updateProps(dom, newProps, oldProps) {
  // 1、old have new 没有
  Object.keys(oldProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in newProps)) {
        // removeAttribute() 从指定的元素中删除一个属性
        dom.removeAttribute(key);
      }
    }
  });

  //2、new have old no , new have old have、
  Object.keys(newProps).forEach((key) => {
    if (key !== "children") {
      if (key !== oldProps[key]) {
        // 监听点击事件
        if (key.startsWith("on")) {
          console.warn("%c Line:115 🥑 key", "color:#fca650", key); // onClick
          const eventType = key.toLowerCase().substring(2); // click
          console.warn("%c Line:116 🍌 eventType", "color:#f5ce50", eventType);
          // 删除之前的旧的dom 因为更新每次都是新创建的
          dom.removeEventListener(eventType, oldProps[key]);
          dom.addEventListener(eventType, newProps[key]);
        } else {
          dom[key] = newProps[key];
        }
      }
    }
  });
}

function initChildren(fiber, children) {
  let oldFiberNode = fiber.alternate?.child;
  let prevChild = null;

  children.forEach((child, index) => {
    let newFiber;
    const isSameType = oldFiberNode && child.type === oldFiberNode.type;
    if (isSameType) {
      // effectTag update
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        dom: oldFiberNode.dom,
        child: null,
        sibling: null,
        effectTag: "UPDATE",
        alternate: oldFiberNode,
      };
    } else {
      // effectTag placement
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        dom: null,
        child: null,
        sibling: null,
        effectTag: "PLACEMENT",
      };
    }

    // （多个child节点）首先检查 oldFiberNode 是否存在，如果存在的话，将其更新为 oldFiberNode 的兄弟节点。这样，我们就可以不断地更新 oldFiberNode，直到它不再有兄弟节点。这时，我们就完成了状态节点的更新
    if (oldFiberNode) {
      oldFiberNode = oldFiberNode.sibling;
    }

    // 根结点的第一个子节点
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function updateHostText(fiber) {
  // 区分是否是 function component，是的话，包装为数组【】
  // [fiber.type(fiber.props)] 中的 fiber.props 为实现 FC 的props 传递
  const children = fiber.props.children || [];
  // 转换： DOM tree -> 链表，遵循DFS递归
  initChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];

  // 转换： DOM tree -> 链表，遵循DFS递归
  initChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  // 不是 isFunctionComponent 是再去 c dom
  if (!isFunctionComponent) {
    // 判断dom存在不，不存在再去create
    if (!fiber.dom) {
      // c dom
      const dom = (fiber.dom = createDom(fiber.type));
      // fiber.parent.dom.append(dom);

      // update  props
      updateProps(dom, fiber.props, {});
    }
  }
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostText(fiber);
  }

  // 继续执行下一个返回的任务
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  // while 处理sibling 时的情况，有sibling 时返回sibling，没有则返回 parent
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  // return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

// 导出React
const React = {
  updateFn,
  render,
  createElement,
};
export default React;
