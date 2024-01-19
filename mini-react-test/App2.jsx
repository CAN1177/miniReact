import React from "./packages/react/index2.js";

// const Bar = () => {
//   console.log("%c Line:58  Bar", "color:#4fff4B");
//   const [count, setCount] = React.useState(1);

// 	const handleBarAdd = () => {
// 		setCount((count)=>count + 1);
// 	};

//   return (
//     <div>
//       {count}
//       <button onClick={handleBarAdd}>bar+1</button>
//     </div>
//   );
// };

// const Foo = () => {
//   console.log("%c Line:73 Foo", "color:#4fff4B");
//   const [count, setCount] = React.useState(1);
// 	const handleFooAdd = () => {
// 		setCount((count)=>count + 1);
// 	};

//   return (
//     <div>
//       {count}
//       <button onClick={handleFooAdd}>foo+1</button>
//     </div>
//   );
// };

let count = 10
function Counter({ num }) {
  const handelClick = () => {
    console.log("%c Line:37 🍐", "color:#ed9ec7", "click");
    count++;
    React.updateFn()
  };

  return (
    <div>
      count:{count}
      <button onClick={handelClick}>click</button>
    </div>
  );
}

const App2 = () => {
  return (
    <div>
      Hello World
      <Counter num={10} />
    </div>
  );
};

console.log("%c Line:10 🎂 App", "color:#b03734", App2);

export default App2;
