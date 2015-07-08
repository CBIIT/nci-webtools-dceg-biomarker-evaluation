var generate_tables, disable_calculate, enable_calculate, generate_tabs, change_ff, lock_fixed_options, change_hidden, trim_spaces, example_code, reset_code, random_gen, clean_data;
generate_tables = function(jsonrtn){
  var key, kValue, tablesvar, ppvtabledata, cnpvtabledata, j, ref$, jValue, l, mValue;
  for (key in jsonrtn) {
    kValue = jsonrtn[key];
    tablesvar = "<table class='table_data table-condensed table-striped table-bordered'><TBODY>";
    tablesvar += "<TR><TH class='table_data header'>Sensitivity</TH><TH class='table_data header'>Optimal k</TH>";
    tablesvar += "<TH class='table_data header'>Relative efficiency gain or <br>loss compared to k = 0.5</TH></TR>";
    ppvtabledata = tablesvar;
    cnpvtabledata = tablesvar;
    for (j in ref$ = kValue.PPVData) {
      jValue = ref$[j];
      ppvtabledata += "<TR><TD>" + jValue['Sensitivity'] + "</TD>";
      ppvtabledata += "<TD>" + jValue['Optimal k'] + "</TD>";
      ppvtabledata += "<TD>" + jValue['Relative efficiency gain or loss compared to k = 0.5'] + "</TD>";
    }
    for (l in ref$ = kValue.cNPVData) {
      mValue = ref$[l];
      cnpvtabledata += "<TD>" + mValue.Sensitivity + "</TD>";
      cnpvtabledata += "<TD>" + mValue['Optimal k'] + "</TD>";
      cnpvtabledata += "<TD>" + mValue['Relative efficiency gain or loss compared to k = 0.5'] + "</TD></TR>";
    }
    ppvtabledata += "</TBODY></table>";
    cnpvtabledata += "</TBODY></table>";
    $("#" + key + "ppvdata").append(ppvtabledata);
    $("#" + key + "cnpvdata").append(cnpvtabledata);
  }
};
disable_calculate = function(){
  $('.post').prop('disabled', true);
};
enable_calculate = function(){
  $('.post').removeAttr('disabled');
};
generate_tabs = function(iterate, randomnumber){
  var fixed_flag, fixedvals, arrayLength, tabheaders, tabcontent, pimagename, cimagename, fixedtype, i$, to$, i, tabs;
  fixed_flag = $('#fixed_flag').text();
  fixedvals = iterate.split(',');
  arrayLength = fixedvals.length;
  $('#output_graph').empty();
  tabheaders = '<ul>';
  tabcontent = "";
  pimagename = 'PPVkSensSpec-';
  cimagename = 'cNPVkSensSpec-';
  fixedtype = $('#fixed_flag').text();
  if (deepEq$(fixedtype, 'Sensitivity', '===')) {
    pimagename = 'PPVkSpecSens-';
    cimagename = 'cNPVkSpecSens-';
  }
  for (i$ = 0, to$ = arrayLength - 1; i$ <= to$; ++i$) {
    i = i$;
    tabheaders += '<li><a href="#tab' + (i + 1) + '">' + fixed_flag + '<br />' + fixedvals[i] + '</a></li>';
    tabcontent += '<div id="tab' + (i + 1) + '"><table><TR><TD><table><TR><TD><img src="/biomarkerTools/tmp/' + pimagename + randomnumber + '-' + (i + 1) + '.png"></TD></TR><TR><TD><div id="tab' + (i + 1) + 'ppvdata"><div></TD></TR></table></TD><TD><table><TR><TD><img src="/biomarkerTools/tmp/' + cimagename + randomnumber + '-' + (i + 1) + '.png"></TD></TR> <TR><TD><div id="tab' + (i + 1) + 'cnpvdata"></div></TD></TR></table></TD></TR></table></div>';
  }
  tabheaders += '</ul>';
  tabs = $("<div id='tabs'> </div>");
  $('#output_graph').append(tabs);
  $('#tabs').append(tabheaders);
  $('#tabs').append(tabcontent);
  $('#tabs').tabs();
};
change_ff = function(){
  $('#fixed_flag').text($('#fixed_dropdown option:selected').text());
};
lock_fixed_options = function(){
  var contour;
  contour = $('#contour_dropdown option:selected').text();
  $('#fixed_dropdown').empty();
  if (deepEq$(contour, 'Specificity', '===')) {
    $('#fixed_dropdown').append('<option value="specificity" disabled="disabled">Specificity</a>');
    $('#fixed_dropdown').append('<option value="sensitivity" selected>Sensitivity</a>');
    $('#specificity_val').text($('#contour')).val();
    $('#sensitivity_val').text($('#fixed')).val();
  }
  if (deepEq$(contour, 'Sensitivity', '===')) {
    $('#fixed_dropdown').append('<option value="specificity" selected>Specificity</a>');
    $('#fixed_dropdown').append('<option value="sensitivity" disabled="disabled">Sensitivity</a>');
    $('#sensitivity_val').text($('#contour')).val();
    $('#specificity_val').text($('#fixed')).val();
  }
  change_ff();
};
change_hidden = function(callingbox){
  if (callingbox === 'contour' && $('#contour_dropdown option:selected').text() === 'Specificity') {
    $('#specificity_val').text(trim_spaces($('#contour').val()));
  } else if (callingbox === 'contour' && $('#contour_dropdown option:selected').text() === 'Sensitivity') {
    $('#sensitivity_val').text(trim_spaces($('#contour').val()));
  } else if (callingbox === 'fixed' && $('#fixed_dropdown option:selected').text() === 'Sensitivity') {
    $('#sensitivity_val').text(trim_spaces($('#fixed').val()));
  } else if (callingbox === 'fixed' && $('#fixed_dropdown option:selected').text() === 'Specificity') {
    $('#specificity_val').text(trim_spaces($('#fixed').val()));
  } else {
    return 0;
  }
};
trim_spaces = function(varstring){
  return varstring.replace(/\s/g, '');
};
example_code = function(){
  $('#message').removeClass('show');
  $('#message').addClass('hide');
  $('#minInput').val('0');
  $('#maxInput').val('1');
  $('#contour').val('0.8,0.9,0.95,0.995');
  $('#contour_dropdown').val('sensitivity');
  $('#fixed').val('0.7,0.8,0.9');
  $('#fixed_dropdown').val('specificity');
  $('#prevalence').val('0.001');
  $('#n_value').val('1');
  $('#fixed_flag').text('Specificity');
  change_hidden('contour');
  change_hidden('fixed');
  enable_calculate();
};
reset_code = function(){
  $('#minInput').val("0");
  $('#maxInput').val("1");
  $('#contour,#fixed,#prevalence,#n_value').val('');
  $('#contour_dropdown')[0].selectedIndex = 2;
  $('#fixed_dropdown')[0].selectedIndex = 1;
  $('#fixed_flag').text('');
  $('#output_graph, #message, #message-content').empty();
  $('#message').removeClass('show');
  $('#message').addClass('hide');
  disable_calculate();
};
random_gen = function(){
  var randomno;
  randomno = Math.floor(Math.random() * 1000 + 1);
  $('#randomnumber').text(randomno);
};
clean_data = function(ret){
  ret = JSON.parse(JSON.stringify(ret));
  $('#output_graph').empty();
  $('#spinner').addClass('hide');
  generate_tabs($('#fixed').val(), $('#randomnumber').text());
  generate_tables(ret);
  random_gen();
};
$(function(){
  random_gen();
  disable_calculate();
  $('.post').click(function(){
    var to_value, input, service, promise;
    $('#spinner').removeClass('hide');
    $('#message').removeClass('show');
    $('#message').addClass('hide');
    to_value = 15 * 1000;
    input = JSON.stringify({
      k: $('#minInput').val() + "," + $('#maxInput').val(),
      sens: trim_spaces($('#sensitivity_val').text()),
      spec: trim_spaces($('#specificity_val').text()),
      prev: $('#prevalence').val(),
      N: $('#n_value').val(),
      unique_id: $('#randomnumber').text(),
      fixed_flag: $('#fixed_flag').text()
    });
    if (window.location.hostname === 'localhost') {
      service = 'scripts/test-data.json';
    } else {
      service = '/sampleSizeRest/';
    }
    promise = $.ajax({
      dataType: 'json',
      method: 'POST',
      contentType: 'application/json',
      url: service,
      data: input,
      timeout: to_value
    });
    promise.then(clean_data, function(jqXHR, textStatus, errorThrown){
      var message;
      $('#spinner').addClass('hide');
      message = "Service Unavailable: " + textStatus + " <br>";
      message += "The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.<br>";
      $('#message-content').empty().append(message);
      $('#message').removeClass('hide');
      $('#message').addClass('show');
    });
    return false;
  });
});
$(function(){
  $('.reset').click(function(){
    reset_code();
    $('#message').removeClass('show');
    $('#message').addClass('hide');
  });
  $('#add-test-data').click(function(){
    example_code();
  });
  $('#contour').keyup(function(){
    change_hidden('contour');
  });
  $('#fixed').keyup(function(){
    change_hidden('fixed');
  });
});
function deepEq$(x, y, type){
  var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
      has = function (obj, key) { return hasOwnProperty.call(obj, key); };
  var first = true;
  return eq(x, y, []);
  function eq(a, b, stack) {
    var className, length, size, result, alength, blength, r, key, ref, sizeB;
    if (a == null || b == null) { return a === b; }
    if (a.__placeholder__ || b.__placeholder__) { return true; }
    if (a === b) { return a !== 0 || 1 / a == 1 / b; }
    className = toString.call(a);
    if (toString.call(b) != className) { return false; }
    switch (className) {
      case '[object String]': return a == String(b);
      case '[object Number]':
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        return +a == +b;
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') { return false; }
    length = stack.length;
    while (length--) { if (stack[length] == a) { return true; } }
    stack.push(a);
    size = 0;
    result = true;
    if (className == '[object Array]') {
      alength = a.length;
      blength = b.length;
      if (first) {
        switch (type) {
        case '===': result = alength === blength; break;
        case '<==': result = alength <= blength; break;
        case '<<=': result = alength < blength; break;
        }
        size = alength;
        first = false;
      } else {
        result = alength === blength;
        size = alength;
      }
      if (result) {
        while (size--) {
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
        }
      }
    } else {
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
        return false;
      }
      for (key in a) {
        if (has(a, key)) {
          size++;
          if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
        }
      }
      if (result) {
        sizeB = 0;
        for (key in b) {
          if (has(b, key)) { ++sizeB; }
        }
        if (first) {
          if (type === '<<=') {
            result = size < sizeB;
          } else if (type === '<==') {
            result = size <= sizeB
          } else {
            result = size === sizeB;
          }
        } else {
          first = false;
          result = size === sizeB;
        }
      }
    }
    stack.pop();
    return result;
  }
}