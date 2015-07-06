requirejs.config({
  baseUrl: 'scripts',
  paths: {
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min",
    'jquery.ui': "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min",
    bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
    sampleSize: 'sampleSize',
    bm_compare: 'bm_compare',
    glossary: '/common/js/meansToRiskGlossary',
    app: 'app',
    routes: 'routes'
  },
  shim: {
    'jquery.ui': {
      deps: ['jquery']
    },
    bootstrap: {
      deps: ['jquery']
    },
    glossary: {
      deps: ['jquery']
    },
    sampleSize: {
      deps: ['jquery.ui', 'bootstrap']
    },
    routes: {
      deps: ['bootstrap', 'glossary']
    }
  }
});
require(['routes'], function(){
  console.log("default scripts loaded");
  return {};
});