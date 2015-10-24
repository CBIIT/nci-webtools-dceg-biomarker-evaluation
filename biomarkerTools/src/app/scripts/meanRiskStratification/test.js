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
  }, {
    "markerName": "Pap",
    "ppv": 0.0941,
    "npv": 0.9990,
    "prob_m": 0.163,
    "sampsize": 30371
  }, {
    "markerName": "VIA",
    "ppv": 0.0834,
    "npv": 0.9917,
    "prob_m": 0.1066,
    "sampsize": 30371
  }];

function setup_test(e) {
  reset_mrs(e);
  new_marker(e);
  new_marker(e);
}

function test(e) {
  e.preventDefault();
  setup_test(e);
  // capture what element triggered test function
  var choice = $(this).prop('id');

  thisTool.find('#markers').children().each(function (key, markerElement) {
    var id = $(this).find('.collapse.in').prop('id');
    var index = key + 1; // biomarker ids are not zero based

    switch (choice) {
      case 'test1':
        thisTool.find('#marker-' + index + ' .option-1').collapse('show');
        var dataItem = values_option_1_bm[key];
        $(markerElement).find('[name="name-input"]').val(dataItem.markerName);
        $(markerElement).find("[name='a']").val(dataItem.a);
        $(markerElement).find("[name='b']").val(dataItem.b);
        $(markerElement).find("[name='c']").val(dataItem.c);
        $(markerElement).find("[name='d']").val(dataItem.d);
        break;
      case 'test2':
        thisTool.find('#marker-' + index + ' .option-2').collapse('show');
        var dataItem = values_option_2_bm[key];
        $(markerElement).find('input[name="name-input"]').val(dataItem.markerName);
        $(markerElement).find('input[name="sampsize"]').val(dataItem.sampsize);
        $(markerElement).find('input[name="param_1"]').val(dataItem.ppv);
        $(markerElement).find('input[name="param_2"]').val(dataItem.npv);
        $(markerElement).find('input[name="param_3"]').val(dataItem.prob_m);
        break;
    }
  });
}