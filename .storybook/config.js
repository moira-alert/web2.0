const { configure, addDecorator } = require("@storybook/react");
const { withCreevey } = require('creevey');
const styles = require("../src/style.less");

addDecorator(withCreevey({ captureElement: '#root' }));

const req = require.context("../src/Stories", true, /.stories.js$/);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
