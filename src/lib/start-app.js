import React from 'react';
import csp from 'js-csp';

var startApp = function(app) {
  var {model, view, update} = app
  var chan = csp.chan()
  var mountNode = document.getElementsByTagName('body')[0]
  var View = view
  var __state = model

  var actionHandler = function(args) {
    csp.putAsync(chan, args);
  }

  var stateChan = csp.go(function*() {
    while (true) {
      var _args  = yield csp.take(chan)
      var action = _args[0]
      var args   = _args.slice(1)
      var updateArgs = [action, __state].concat(args)
      return update.apply(null, updateArgs)
    }
  });

  csp.go(function*() {
    while (true) {
      var newState = yield csp.take(stateChan)
      if (newState) {
        __state = newState
        render(newState, actionHandler)
      }
    }
  })

  render(model, actionHandler)

  function render(state, actionHandler) {
    React.render(
      <View model={state} actionHandler={actionHandler} />,
      mountNode
    );
  }
}

export default startApp

/*

root app gets an actions channel
can put an array of stuff on the channel
  - ['some action', 4, "h", false']


there's a go routine listening for these
when it gets one, it app


when I get arguments
  - take the current state and prepend it to the arguments
  - call the correct function with the arguments
  - save the resulting state
  - re-render

*/
