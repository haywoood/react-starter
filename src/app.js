import React from 'react';
import Immutable from 'immutable';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import StartApp from './lib/start-app';

import './styles/app.css';

var update = function (model, action) {
  switch (action) {
    case 'increment':
      return model + 1;
    case 'decrement':
      return model - 1;
  }
}

var App = React.createClass({
  mixins: [ImmutableRenderMixin],

  render() {
    var ah = this.props.actionHandler;

    return (
      <div>
        <h1>{this.props.model}</h1>
        <button onClick={ah.bind(null, 'increment')}>+</button>
        <button onClick={ah.bind(null, 'decrement')}>-</button>
      </div>
    )
  }
});

StartApp({ model: 0, view: App, update: update });
