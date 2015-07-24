import React from 'react';
import csp from 'js-csp';


function startApp(app, mountNode) {
  var { model, view, update } = app;
  var actionChan = csp.chan()
    , mountNode  = mountNode || document.getElementsByTagName('body')[0];

  var actionHandler = function(args) {
    csp.putAsync(actionChan, args);
  }

  var modelChan = foldp(update, model, actionChan)
    , renderFn  = render(view, actionHandler, mountNode);

  csp.go(function*() {
    while (true) {
      var newModel = yield csp.take(modelChan);
      renderFn(newModel);
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
    while (true) {
      var _args      = yield csp.take(chan)
        , action     = _args[0]
        , args       = _args.slice(1)
        , updateArgs = [action, _model].concat(args);
      _model = update.apply(null, updateArgs);
      yield csp.put(outChan, _model);
    }
  });

  return outChan;
}


export default startApp;
