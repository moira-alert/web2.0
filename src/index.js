// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import Api from './Api/MoiraAPI';
import App from './App';
import { ApiProvider } from './Api/MoiraApiInjection';
import config from './config';
import './style.less';

const api = new Api(config);

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <BrowserRouter>
                <ApiProvider moiraApi={api}>
                    <Component />
                </ApiProvider>
            </BrowserRouter>
        </AppContainer>,
        document.getElementById('root')
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./App', () => {
        render(App);
    });
}
