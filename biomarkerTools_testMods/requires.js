requirejs.config({
    paths: {
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min",
        'jquery.ui': "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min",
        bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
        help: 'help/help',
        sampleSize: 'sampleSize/sampleSize',
        bc: 'bc/bc',
        meanstorisk: 'meanstorisk/meanstorisk',
        riskStratAdvanced: 'riskStratAdvanced/riskStratAdvanced',
        meanRiskStratification: 'meanRiskStratification/meanRiskStratification',
        glossary: '/common/js/meansToRiskGlossary',
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
        meanstorisk: {
            deps: ['jquery.ui', 'bootstrap']
        },
        riskStratAdvanced: {
            deps: ['bootstrap']
        },
        routes: {
            deps: ['bootstrap', 'glossary']
        },
        help:{
            deps: ['glossary']
        }
    }
});

require(['routes'], function(){
    console.log("default scripts loaded");
    return {};
});