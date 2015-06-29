requirejs.config
  baseUrl: \scripts
  paths :
    jquery : "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min"
    jquery-ui : "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min"
    bootstrap : "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min"
    glossary : '/common/js/meansToRiskGlossary'
    app : \app
    routes : \routes
  shim :
    jquery :
      exports: <[ jquery ]>
    jquery-ui :
      deps : <[ jquery ]>
    bootstrap :
      deps: <[ jquery-ui ]>
    routes :
      deps : <[ bootstrap glossary ]>

require <[ jquery bootstrap routes ]> ($) ->
  console.log "Loaded :)"
  {}