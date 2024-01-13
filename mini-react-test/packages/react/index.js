
/**
 * 引入vdom
 * */ 

// 创建文本节点
function createTextNode(text) {
	return {
	 type: 'TEXT_ELEMENT',
	 props: {
		 nodeValue: text,
		 children: []
	 }
 }
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
		 children: children.map(child => 
			 typeof child === 'string'
			 ? createTextNode(child)
			 : child
		 )
	 }
 }
}

/**
* 简易render函数
* @param {*} el 
* @param {*} container 
*/
function render(el,container) {
 const dom = el.type ===
	 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
 
 // 处理class
 Object.keys(el.props).forEach((key) => {
	 if (key !== 'children') {
		 dom[key] = el.props[key]
	 }
 })
 
 // 处理子节点
 const children = el.props.children || []	
 children.forEach(child => render(child, dom))
 
 // 添加给容器
 container.append(dom)
}	



// 导出React
const React = {
  render,
  createElement
};
export default React;