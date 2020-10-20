requirejs.config({
    paths: {
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min",
        'jquery.ui': "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min",
        modernzr: "https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr",
        bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
        datatables:"https://cdn.datatables.net/1.10.2/js/jquery.dataTables.min",
        help: 'help/help',
        //        sampleSize: 'sampleSize/sampleSize',
        bc: 'bc/bc',
        meanstorisk: 'meanstorisk/meanstorisk',
        riskStratAdvanced: 'riskStratAdvanced/riskStratAdv',
        meanRiskStratification: 'meanRiskStratification/mrs',
        define: 'common/js/popover-functions',
        glossary: 'glossary',
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
        define: {
            deps: ['jquery.ui']
        },
        glossary: {
            deps: ['define']
        },
        main: {
            deps: ['glossary']
        },
        riskStratAdvanced: {
            deps: ['datatables']
        }
    }
});

// start off the application by loading main and all its dependencies
require(['main'], function(){
    console.log("default scripts loaded");
    var id = $('[role="tab"].active a')[0].hash.replace('#','');
    if (id != 'home') {
      require([ id ]);
    }
    return {};
});
