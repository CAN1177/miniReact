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
let showTab = false;

function Count() {
  const handleClickShow = () => {
    showTab = !showTab;
    React.updateFn();
  };
  // const Footer = () => {
  //   return <div>footer
  //     <p>child</p>
  //     <p>son</p>
  //   </div>;
  // } 
  const tab = <div>tab</div>;
  // return (
  //   <div>
  //     {showTab ? tab : <Footer/>}
  //     <button onClick={handleClickShow}>展示</button>
  //   </div>
  // );
  return (
    // 当21Silva 不存在时报错，之前处理有问题
    <div>
      21silva
       {showTab && tab }
      <button onClick={handleClickShow}>展示</button>
     
    </div>
  );
}

let countBar = 1;
const Bar = () => {
  console.log("%c Line:58  Bar", "color:#4fff4B");
  
  const handleBarAdd = () => { 
    countBar++;
    React.updateFn();
  }

  return <div>
    {countBar}
    <button onClick={handleBarAdd}>bar+1</button>
  </div>
}

let countFoo = 1;
const Foo = () => {
  console.log("%c Line:73 Foo", "color:#4fff4B");
  
  const handleFooAdd = () => { 
    countFoo++;
    React.updateFn();
  }

  return <div>
    {countFoo}
    <button onClick={handleFooAdd}>foo+1</button>
  </div>
}

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
      <Count />
      <Bar />
      <Foo />
    </div>
  );
};

console.log("%c Line:10 🎂 App", "color:#b03734", App);

export default App;
