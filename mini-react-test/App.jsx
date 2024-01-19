import React from "./packages/react/index.js";

let showBar = false;

const Counter = () => {
  const foo = <div>foo</div>;
  const bar = <div>bar</div>;

  const handleClick = () => {
    showBar = !showBar;
    React.updateFn();
  };

  return (
    <div>
      Count
      <div>{showBar ? bar : foo}</div>
      <button onClick={handleClick}>展示</button>
    </div>
  );
};

function App() {
  return <div>
    Hello World
    <Counter />
  </div>;
}

console.log("%c Line:10 🎂 App", "color:#b03734", App);

export default App;
