const React = require('react');
const ReactDOMServer = require('react-dom/server');
const AnimateHeight = require('./dist/cjs/index.js').default;

const example = React.createElement('div', null, [
  React.createElement(AnimateHeight, { key: '1', height: 0 }, 'Hello World'),
  React.createElement(
    AnimateHeight,
    { key: '2', height: 'auto' },
    'Hello World'
  ),
  React.createElement(AnimateHeight, { key: '3', height: 100 }, 'Hello World'),
]);

const renderedString = ReactDOMServer.renderToString(example);

// eslint-disable-next-line max-len
const expectedString =
  '<div><div aria-hidden="true" class="rah-static rah-static--height-zero " style="height:0;overflow:hidden"><div>Hello World</div></div><div aria-hidden="false" class="rah-static rah-static--height-auto " style="height:auto;overflow:visible"><div>Hello World</div></div><div aria-hidden="false" class="rah-static rah-static--height-specific " style="height:100px;overflow:hidden"><div>Hello World</div></div></div>';

const reset = '\x1b[0m';
const red = '\x1b[31m';
const green = '\x1b[32m';

if (renderedString === expectedString) {
  console.log(green + '\nTest passed\n' + reset);
} else {
  console.log('\nRendered:');
  console.log(red + renderedString + reset);
  console.log('\nExpected:');
  console.log(green + expectedString + reset);
  console.log('\n', red);
  throw new Error('Test failed');
}
