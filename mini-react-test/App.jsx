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

function ManCity({ num }) {
  return <MyComponent num={num} />;
}

function MyComponent({ num }) {
  return <div style="color: skyblue">Manchester City Player No.{num}</div>;
}

let count = 2000;
const App = () => {
  // let count = 2000;

  const handleClick = () => {
    console.log("clicked");
    count++;
    React.updateFn();
  };

  return (
    <div>
      <h1>Welcome to Etihad Stadium</h1>
      <ManCity num={21} />
      <ManCity num={17} />
      <span>Legendary Player</span>

      <button onClick={handleClick}>clicked{count}</button>
    </div>
  );
};

console.log("%c Line:10 🎂 App", "color:#b03734", App);

export default App;
