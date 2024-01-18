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
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // 确定根节点 wipRoot
  nextUnitOfWork = wipRoot;
}

function updateFn() {
  console.warn(wipFiber);
  let currentFiber = wipFiber;

  return () => {
    console.warn("%c Line:55 🧀 currentFiber", "color:#b03734", currentFiber);
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    // wipRoot = {
    //   dom: currentRoot.dom,
    //   props: currentRoot.props,
    //   alternate: currentRoot,
    // };
    // 确定根节点 wipRoot
    nextUnitOfWork = wipRoot;
  };
}

/**
 * workLoop 完整的工作循环
 * 源码：也就是DFS遍历ReactElement的过程，其中递阶段对应beginWork方法， 归阶段对应completeWork方法
 */
let wipRoot = null;
let currentRoot = null;
let nextUnitOfWork = null;
let deletionsNode = [];

// 正在进行中的节点
let wipFiber = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      console.log("%c Line:87 🧀", "color:#6ec1c2", "9999");
      nextUnitOfWork = undefined;
    }

    shouldYield = deadline.timeRemaining() < 1;
  }
  // 链表结束 且 确保执行一次，有根的时候执行
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  // 统一处理
  deletionsNode.forEach(commitDeletions);
  deletionsNode = [];

  commitWork(wipRoot.child);
  // 获取最新根节点
  currentRoot = wipRoot;
  // 确保执行一次，有根的时候执行，这里就重置为null
  wipRoot = null;
}

function commitDeletions(fiber) {
  // 不满足function component
  // fiber.parent.dom.removeChild(fiber.dom);

  if (fiber.dom) {
    let fiberParent = fiber.parent;
    // 这里就是 function component ， 没dom, 那么就继续向上👆, 所以这里应该是while,避免多个FC component
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletions(fiber.child);
  }
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
  // 1、old have new no
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
          // console.warn("%c Line:115 🥑 key", "color:#fca650", key); // onClick
          const eventType = key.toLowerCase().substring(2); // click
          // console.warn("%c Line:116 🍌 eventType", "color:#f5ce50", eventType);
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

function reconcileChildren(fiber, children) {
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
      if (child) {
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
      if (oldFiberNode) {
        deletionsNode.push(oldFiberNode);
      }
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

    // 解决case 处理顺序
    // console.log("%c Line:236 🍰 newFiber", "color:#e41a6a", newFiber);

    if (newFiber) {
      prevChild = newFiber;
    }
  });

  // 删除多余子节点
  while (oldFiberNode) {
    deletionsNode.push(oldFiberNode);
    // 更新（因为链表）
    oldFiberNode = oldFiberNode.sibling;
  }
}

function updateHostText(fiber) {
  // 区分是否是 function component，是的话，包装为数组【】
  // [fiber.type(fiber.props)] 中的 fiber.props 为实现 FC 的props 传递
  const children = fiber.props.children || [];
  // 转换： DOM tree -> 链表，遵循DFS递归
  reconcileChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  // 正在进行中的节点，需设置全局变量保存
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];

  // 转换： DOM tree -> 链表，遵循DFS递归
  reconcileChildren(fiber, children);
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
