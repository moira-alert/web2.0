import { configure } from '@storybook/react';
import styles from '../src/style.less';

const req = require.context('../src/Stories', true, /.stories.js$/);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
