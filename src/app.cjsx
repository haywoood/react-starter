React                = require 'react'
Immutable            = require 'immutable'
ImmutableRenderMixin = require 'react-immutable-render-mixin'

App = React.createClass
  render: ->
    <h1>hi</h1>

mountNode = document.getElementsByTagName('body')[0]
React.render <App />, mountNode
