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
  //  const dom = el.type ===
  // 	 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

  //  // 处理class
  //  Object.keys(el.props).forEach((key) => {
  // 	 if (key !== 'children') {
  // 		 dom[key] = el.props[key]
  // 	 }
  //  })

  //  // 处理子节点
  //  const children = el.props.children || []
  //  children.forEach(child => render(child, dom))

  //  // 添加给容器
  //  container.append(dom)
}

/**
 * workLoop 完整的工作循环
 * 源码：也就是DFS遍历ReactElement的过程，其中递阶段对应beginWork方法， 归阶段对应completeWork方法
 */
let nextUnitOfWork = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
}

/**
 *
 * @param {*} fiber
 */
function createDom(fiber) {
  const { type } = fiber;
  const dom = (fiber.dom =
    type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(type));
  fiber.parent.dom.append(dom);
}

function updateProps(fiber) {
  const { dom, props } = fiber;
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
      prevChild = newFiber;
    }
    prevChild = newFiber;
  });
}

function performUnitOfWork(fiber) {
  // 判断dom存在不，不存在再去create
  if (!fiber.dom) {
    // c dom
    createDom(fiber);

    // update  props
    updateProps(fiber);
  }

  // 转换： DOM tree -> 链表，遵循DFS+BFS递归
  initChildren(fiber);

  // 继续执行
  if (fiber.child) {
    return fiber.child;
  }
  if (workLoop.sibling) {
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
