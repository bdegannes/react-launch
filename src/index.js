import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App/App';

const rootEl = document.getElementById('root');

const renderApp = Component => {
  return render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl,
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept('./App/App', () => {
    const nextApp = require('./App/App');
    renderApp(App);
  });
}
