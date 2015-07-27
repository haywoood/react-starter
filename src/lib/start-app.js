import React from 'react';
import csp from 'js-csp';


function startApp(app, mountNode) {
  var { model, view, update } = app;
  var actionChan = csp.chan()
    , mountNode  = mountNode || document.getElementsByTagName('body')[0];

  var actionHandler = function(...args) {
    csp.putAsync.apply(null, [actionChan, args]);
  }

  var modelChan = foldp(update, model, actionChan)
    , renderFn  = render(view, actionHandler, mountNode);

  csp.go(function*() {
    var newModel = yield csp.take(modelChan);
    while (newModel !== csp.CLOSED) {
      renderFn(newModel);
      newModel = yield csp.take(modelChan);
    }
  });

  return renderFn(model);
}


function render(view, actionHandler, mountNode) {
  return function(state) {
    return React.render(
      React.createElement(view, { model: state, actionHandler: actionHandler}),
      mountNode
    );
  }
}


function foldp(update, model, chan) {
  var _model  = model
    , outChan = csp.chan();

  csp.go(function*() {
    var args = yield csp.take(chan);
    while (args !== csp.CLOSED) {
      _model = update.apply(null, [_model].concat(args));
      yield csp.put(outChan, _model);
      args = yield csp.take(chan);
    }
  });

  return outChan;
}


export default startApp;
