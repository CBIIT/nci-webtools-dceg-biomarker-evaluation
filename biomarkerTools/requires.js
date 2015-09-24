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
        glossary: '/common/js/meansToRiskGlossary',
        main: 'main',
    },
    shim: {
        'jquery.ui': {
            deps: ['jquery']
        },
        datatables: {
            deps: ['jquery.ui']
        },
        bootstrap: {
            deps: ['jquery']
        },
        glossary: {
            deps: ['jquery']
        },
        sampleSize: {
            deps: ['jquery.ui', 'main']
        },
        meanstorisk: {
            deps: ['jquery.ui', 'main']
        },
        riskStratAdvanced: {
            deps: [ 'jquery.ui', 'datatables','bootstrap', 'main']
        },
        main: {
            deps: ['modernzr','jquery.ui','bootstrap', 'glossary', 'rand']
        },
        help:{
            deps: ['glossary']
        }
    }
});


require(['main'], function(){
    console.log("default scripts loaded");
    return {};
});