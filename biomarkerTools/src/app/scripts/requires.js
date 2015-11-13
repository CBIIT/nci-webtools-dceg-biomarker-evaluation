requirejs.config({
    paths: {
        rand: "//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.3.10/seedrandom.min",
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min",
        'jquery.ui': "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min",
        modernzr: "https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr",
        bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
        datatables:"http://cdn.datatables.net/1.10.2/js/jquery.dataTables.min",
        help: 'help/help',
        sampleSize: 'sampleSize/sampleSize',
        bc: 'bc/bc',
        meanstorisk: 'meanstorisk/meanstorisk',
        riskStratAdvanced: 'riskStratAdvanced/riskStratAdv',
        meanRiskStratification: 'meanRiskStratification/mrs',
        glossary: '/common/js/popover-functions',
        main: 'main',
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        'jquery.ui': {
            deps: ['bootstrap' /* not really, but we want them to load in order */]
        },
        datatables: {
            deps: ['jquery.ui']
        },
        glossary: {
            deps: ['jquery.ui']
        },
        main: {
            deps: ['glossary', 'modernzr', 'rand']
        },
        riskStratAdvanced: {
            deps: ['datatables']
        },
        help:{
            deps: ['glossary', 'bc', 'meanstorisk', 'meanRiskStratification', 'riskStratAdvanced']
        }
    }
});

// start off the application by loading main and all its dependencies
require(['main'], function(){
    console.log("default scripts loaded");
    return {};
});