import React from 'react';
import csp from 'js-csp';


function startApp(app, mountNode) {
  let { model, view, update } = app
    , actionChan = csp.chan()
    , mountNode  = mountNode || document.getElementsByTagName('body')[0];

  let actionHandler = function(args) {
    csp.putAsync(actionChan, args);
  }

  let modelChan = foldp(update, model, actionChan)
    , renderFn  = render(view, actionHandler, mountNode);

  csp.go(function*() {
    while (true) {
      let newModel = yield csp.take(modelChan);
      renderFn(newModel);
    }
  });

  return renderFn(model);
}


function render(view, actionHandler, mountNode) {
  let View = view;
  return function(state) {
    return React.render(
      <View model={state} actionHandler={actionHandler} />,
      mountNode
    );
  }
}


function foldp(update, model, chan) {
  let _model  = model
    , outChan = csp.chan();

  csp.go(function*() {
    while (true) {
      let _args      = yield csp.take(chan)
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
