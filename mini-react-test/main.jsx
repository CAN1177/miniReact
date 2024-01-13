import React from './packages/react/index.js'
import ReactDOM from './packages/react-dom/index.js'
import App from './App.jsx'

// 注意这里暂时不支持 function component 所以是 App 而不是<App/>
ReactDOM.createRoot(document.querySelector('#root')).render(App);