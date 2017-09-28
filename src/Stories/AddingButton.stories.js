// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import AddingButton from '../Components/AddingButton/AddingButton';

storiesOf('AddingButton', module)
    .addDecorator(StoryRouter())
    .add('Default', () => <AddingButton to='/' />);
