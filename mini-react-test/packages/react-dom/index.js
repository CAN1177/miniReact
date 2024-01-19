import React from '../react/index2.js'

const ReactDOM = {
  createRoot(container) {
    return {
      render(APP) {
        React.render(APP, container);
      },
    };
  },
};

export default ReactDOM;
