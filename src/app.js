import React from 'react';
import Immutable from 'immutable';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import StartApp from './lib/start-app';

import './styles/app.css';

var Actions = {
  toggleSubhead(state) {
    let curVal = state.get('showSubhead');
    let newState = state.set('showSubhead', !curVal);
    return newState;
  }
}

var update = function (action, ...args) {
  return Actions[action].apply(null, args)
}

var App = React.createClass({
  mixins: [ImmutableRenderMixin],

  render() {
    let message = this.props.model.get('message');
    let showSubhead = this.props.model.get('showSubhead');

    if (showSubhead) {
      var subhead = <h2>I'm the subhead</h2>;
    }

    let toggleSubhead = this.props.actionHandler.bind(null, ['toggleSubhead']);

    if (showSubhead) {
      var button = <button onClick={toggleSubhead}>hide subhead</button>;
    } else {
      var button = <button onClick={toggleSubhead}>show subhead</button>;
    }

    return (
      <div>
        <h1>{message}</h1>
        {subhead}
        {button}
      </div>
    )
  }
});

var State = Immutable.Map({
  message: null,
  showSubhead: false
});

var state = State.merge({
  message: "Hello World!"
});

StartApp({ model: state, view: App, update: update });
