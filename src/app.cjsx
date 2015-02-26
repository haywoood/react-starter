React                = require 'react'
Immutable            = require 'immutable'
ImmutableRenderMixin = require 'react-immutable-render-mixin'

Actions =
  toggleSubhead: (state) ->
    curVal = state.get 'showSubhead'
    newState = state.set 'showSubhead', not curVal

App = React.createClass
  mixins: [ImmutableRenderMixin]

  actionHandler: (args...) ->
    @props.data.get('actionHandler').apply null, [@props.data].concat args

  render: ->
    message = @props.data.get 'message'
    showSubhead = @props.data.get 'showSubhead'
    subhead = <h2>I'm the subhead</h2> if showSubhead
    toggleSubhead = @actionHandler.bind null, 'toggleSubhead'

    return (
      <div>
        <h1>{message}</h1>
        {subhead}
        {if showSubhead
          <button onClick={toggleSubhead}>hide subhead</button>
        else
          <button onClick={toggleSubhead}>show subhead</button>
        }
      </div>
    )

State = Immutable.Map
  message: null
  actionHandler: null
  showSubhead: false

actionHandler = (actionsMap, renderFn, mountNode) ->
  (state, fnName, args...) ->
    # our action functions are pure, and always return a new state object
    newState = actionsMap[fnName].apply null, [state].concat args
    # we re-render our app with the updated state
    renderFn mountNode, newState

render = (mountNode, state) ->
  React.render <App data={state} />, mountNode

mountNode = document.getElementsByTagName('body')[0]

state = State.merge
  message: 'Hello World!'
  actionHandler: actionHandler(Actions, render, mountNode)

render mountNode, state
