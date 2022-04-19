const React = require('react');
const ReactDOMServer = require('react-dom/server');
const AnimateHeight = require('./lib/index.js').default;

const example = React.createElement('div', null, [
  React.createElement(AnimateHeight, { key: '1', height: 0 }, 'Hello World'),
  React.createElement(AnimateHeight, { key: '2', height: 'auto' }, 'Hello World'),
  React.createElement(AnimateHeight, { key: '3', height: 100 }, 'Hello World'),
]);

const renderedString = ReactDOMServer.renderToString(example);

// eslint-disable-next-line max-len
const expectedString = '<div><div style="height:0;overflow:hidden" aria-hidden="true" class="rah-static rah-static--height-zero"><div>Hello World</div></div><div style="height:auto;overflow:visible" aria-hidden="false" class="rah-static rah-static--height-auto"><div>Hello World</div></div><div style="height:100px;overflow:hidden" aria-hidden="false" class="rah-static rah-static--height-specific"><div>Hello World</div></div></div>';

console.log(renderedString === expectedString);
console.log(renderedString);
