import React from "./packages/react/index.js";


// function deepNode(num) {
//   if (num === 1) {
//     return "1";
//   } else {
//     return deepNode(num - 1) + "," + num;
//   }
// }

// const App = React.createElement(
//   "div",
//   { id: "container" },
//   deepNode(5000)
// );

const App = <div>21silva-miniReact hello world
	<span>90900</span>
</div>
console.log("%c Line:10 🎂 App", "color:#b03734", App);

export default App;
