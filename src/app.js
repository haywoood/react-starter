import React from 'react';
import Immutable from 'immutable';
import ImmutableRenderMixin from 'react-immutable-render-mixin';

import './styles/app.css';

const Actions = {
  toggleSubhead(state) {
    let curVal = state.get('showSubhead');
    let newState = state.set('showSubhead', !curVal);
    return newState;
  }
}

const App = React.createClass({
  mixins: [ImmutableRenderMixin],

  actionHandler(...args) {
    this.props.data.get('actionHandler').apply(null, [this.props.data].concat(args));
  },

  render() {
    let message = this.props.data.get('message');
    let showSubhead = this.props.data.get('showSubhead');

    if (showSubhead) {
      var subhead = <h2>I'm the subhead</h2>;
    }

    let toggleSubhead = this.actionHandler.bind(null, 'toggleSubhead');
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

const State = Immutable.Map({
  message: null,
  actionHandler: null,
  showSubhead: false
});

const actionHandler = function(actionsMap, renderFn, mountNode) {
  return (state, fnName, ...args) => {
    let newState = actionsMap[fnName].apply(null, [state].concat(args));
    renderFn(mountNode, newState);
  }
}

const render = function(mountNode, state) {
  return React.render(<App data={state} />, mountNode);
}

const mountNode = document.getElementsByTagName('body')[0]

let state = State.merge({
  message: "Hello World!",
  actionHandler: actionHandler(Actions, render, mountNode)
});

render(mountNode, state);
