import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

describe('App', () => {
  let props;

  const app = (givenStubs = {}) => {
    const merged = global._.merge(props, givenStubs);
    return <App {...merged} />;
  };

  beforeEach(() => {
    props = {};
  });
  it('should match snapshot', () => {
    const wrapper = renderer.create(app()).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});
