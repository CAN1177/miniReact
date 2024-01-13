import ReactDOM from "./mini-react-test/packages/react-dom/index.js";
import App from "./mini-react-test/App.js";

// 注意这里暂时不支持 function component 所以是 App 而不是<App/>
ReactDOM.createRoot(document.querySelector("#root")).render(App);
