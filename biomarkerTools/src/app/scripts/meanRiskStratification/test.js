var values_option_1_bm = [
    {"markerName": "HPV", "a": 471, "b": 13, "c": 4680, "d": 25207},
    {"markerName": "Pap", "a": 466, "b": 25, "c": 4484, "d": 25396},
    {"markerName": "VIA", "a": 270, "b": 225, "c": 2967, "d": 26909}
];

var values_option_2_bm = [{
    "markerName": "HPV",
    "ppv": 0.0914,
    "npv": 0.9995,
    "prob_m": 0.1696,
    "sampsize": 30371
},
                          {
                              "markerName": "Pap",
                              "ppv": 0.0941,
                              "npv": 0.9990,
                              "prob_m": 0.163,
                              "sampsize": 30371
                          },
                          {
                              "markerName": "VIA",
                              "ppv": 0.0834,
                              "npv": 0.9917,
                              "prob_m": 0.1066,
                              "sampsize": 30371
                          }];

function setup_test(e) {
    reset_mrs(e);

    // add 2 biomarkers
    new_marker();
    new_marker();
}

function test(e) {
    e.preventDefault();
    setup_test();
    // capture what element triggered test function
    var choice = $(this).prop('id');

    thisTool.find('#markers').children().each(function (key, markerElement) {
        var id = $(this).find('.collapse.in').prop('id');
        var index = key + 1; // biomarker ids are not zero based

        if (choice == "test1") {
            // open option 1 for each
            thisTool.find('#marker-' + index + '-option-1').collapse('show');


            // then populate with data
            $(markerElement).find('[name="name-input"]').val(values_option_1_bm[key].markerName);
            if(index > 1){
                $(markerElement).find('#a-bm-'+ index).val(values_option_1_bm[key].a);
                $(markerElement).find('#b-bm-'+ index).val(values_option_1_bm[key].b);
                $(markerElement).find('#c-bm-'+ index).val(values_option_1_bm[key].c);
                $(markerElement).find('#d-bm-'+ index).val(values_option_1_bm[key].d);
            }
            else{
                $(markerElement).find('#a').val(values_option_1_bm[key].a);
                $(markerElement).find('#b').val(values_option_1_bm[key].b);
                $(markerElement).find('#c').val(values_option_1_bm[key].c);
                $(markerElement).find('#d').val(values_option_1_bm[key].d);
            }
        }

        if (choice == "test2") {
            // open option 2 for each
            thisTool.find('#marker-' + index + '-option-2').collapse('show');

            var data = [
                values_option_2_bm[0],
                values_option_2_bm[1],
                values_option_2_bm[2]
            ];
            // marker name
            $(markerElement).find('input[name="name-input"]').val(data[key].markerName);
            // sample size
            $(markerElement).find('input[name="sampsize"]').val(data[key].sampsize);

            var dataItem = data[key];

            //first row
            $(markerElement).find('input[name="param_1"]').val(dataItem.ppv);

            // second row
            $(markerElement).find('input[name="param_2"]').val(dataItem.npv);

            // third row
            $(markerElement).find('input[name="param_3"]').val(dataItem.prob_m);
        }
    });
}