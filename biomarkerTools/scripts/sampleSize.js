var generate_tables, disable_calculate, enable_calculate, generate_tabs, change_ff, lock_fixed_options, change_hidden, trim_spaces, example_code, reset_code, random_gen;
generate_tables = function(jsonrtn){
  var i$, len$, i, tablesvar, ppvtabledata, cnpvtabledata, j$, to$, n;
  for (i$ = 0, len$ = jsonrtn.length; i$ < len$; ++i$) {
    i = jsonrtn[i$];
    console.log(i);
    tablesvar = "<TABLE class='table_data'><TBODY>";
    tablesvar += "<TR><TH class='table_data header'>Sensitivity</TH><TH class='table_data header'>Optimal K</TH><TH class='table_data header'>Relative efficiency gain or <br>loss compared to k = 0.5</TH></TR>";
    ppvtabledata = tablesvar;
    cnpvtabledata = tablesvar;
    for (j$ = 0, to$ = jsonrtn[i].PPVData.length; j$ <= to$; ++j$) {
      n = j$;
      console.log('PPVData');
      ppvtabledata += "<TR><TD>" + jsonrtn[i].PPVData[n].Sensitivity + "</TD>";
      ppvtabledata += "<TD>" + jsonrtn[i].PPVData[n]["Optimal k"] + "</TD>";
      ppvtabledata += "<TD>" + jsonrtn[i].PPVData[n]['Relative efficiency gain or loss compared to k = 0.5'] + "</TD>";
      console.log('cNPVData');
      cnpvtabledata += "<TD>" + jsonrtn[i].cNPVData[n].Sensitivity + "</TD>";
      cnpvtabledata += "<TD>" + jsonrtn[i].cNPVData[n]["Optimal k"] + "</TD>";
      cnpvtabledata += "<TD>" + jsonrtn[i].cNPVData[n]['Relative efficiency gain or loss compared to k = 0.5'] + "</TD></TR>";
    }
    ppvtabledata += "</TBODY></TABLE>";
    cnpvtabledata += "</TBODY></TABLE>";
    $("#" + i + "ppvdata").append(ppvtabledata);
    $("#" + i + "cnpvdata").append(cnpvtabledata);
  }
};
disable_calculate = function(){
  $('.post').prop('disabled', true);
};
enable_calculate = function(){
  $('.post').removeAttr('disabled');
};
generate_tabs = function(iterate, randomnumber){
  var fixed_flag, fixedvals, arrayLength, tabheaders, tabcontent, pimagename, cimagename, fixedtype, i$, x$, ref$, i, len$, tabs;
  fixed_flag = $(fixed_flag + "").text();
  fixedvals = iterate.split(',');
  arrayLength = fixedvals.length;
  $('#output_graph').empty();
  tabheaders = '<ul>';
  tabcontent = "";
  pimagename = 'PPVkSensSpec-';
  cimagename = 'cNPVkSensSpec-';
  fixedtype = $('#fixed_flag').text();
  console.log("Fixed flag is " + fixedtype);
  if (deepEq$(fixedtype, "Sensitivity", '===')) {
    pimagename = 'PPVkSpecSens-';
    cimagename = 'cNPVkSpecSens-';
  }
  for (i$ = 0, len$ = (ref$ = (i = 0, i < arrayLength, i++)).length; i$ < len$; ++i$) {
    x$ = ref$[i$];
    console.log(fixedvals[i]);
    tabheaders += '<li><a href="#tab' + (i + 1) + '">' + fixed_flag + '<br />' + fixedvals[i] + '</a></li>';
    tabcontent += '<div id="tab' + (i + 1) + '"> <TABLE><TR><TD> <TABLE><TR><TD><IMG SRC="/sampleSize/tmp/' + pimagename + randomnumber + '-' + (i + 1) + '.png"></TD></TR> <TR><TD><div id="tab' + (i + 1) + 'ppvdata"><div></TD></TR></TABLE> </TD><TD> <TABLE><TR><TD><IMG SRC="/sampleSize/tmp/' + cimagename + randomnumber + '-' + (i + 1) + '.png"></TD></TR> <TR><TD><div id="tab' + (i + 1) + 'cnpvdata"></div></TD></TR></TABLE> </TD></TR></TABLE> </div>';
  }
  tabheaders += "</ul>";
  tabs = $("<div id='tabs'> </div>");
  $('#output_graph').append(tabs);
  $('#tabs').append(tabheaders);
  $('#tabs').append(tabcontent);
  $(tabs + "").tabs();
};
change_ff = function(){
  $('#fixed_flag').text($(fixed_dropdown + " option:selected").text());
};
lock_fixed_options = function(){
  var contour;
  contour = $(contour_dropdown + " option:selected").text();
  $(fixed_dropdown + "").empty();
  if (deepEq$(contour, 'Specificity', '===')) {
    $('#fixed_dropdown').append('<option value="specificity" disabled="disabled">Specificity</a>');
    $('#fixed_dropdown').append('<option value="sensitivity" selected>Sensitivity</a>');
    $('#specificity_val').text($(contour + "")).val();
    $('#sensitivity_val').text($(fixed + "")).val();
  }
  if (deepEq$(contour, 'Sensitivity', '===')) {
    $(fixed_dropdown + "").append('<option value="specificity" selected>Specificity</a>');
    $(fixed_dropdown + "").append('<option value="sensitivity" disabled="disabled">Sensitivity</a>');
    $(sensitivity_val + "").text($(contour + "")).val();
    $(specificity_val + "").text($(fixed + "")).val();
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
  $('#contour').val("0.8,0.9,0.95,0.995");
  $('#contour_dropdown').val('sensitivity');
  $('#fixed').val("0.7,0.8,0.9");
  $('#fixed_dropdown').val('specificity');
  $('#prevalence').val('0.001');
  $('#n_value').val('1');
  $('#fixed_flag').text('Specificity');
  change_hidden('contour');
  change_hidden('fixed');
  enable_calculate();
};
reset_code = function(){
  $('#independent').val("0,1");
  $(contour + "," + contour_dropdown + "," + fixed + "," + fixed_dropdow + "," + prevalencen + "," + n_value).val('');
  $('#fixed_flag').text('');
  $(output_graph + ", " + message + ", " + messageContent).empty();
  $('#message').removeClass('show');
  $('#message').addClass('hide');
  disable_calculate();
};
random_gen = function(){
  var randomno;
  randomno = Math.floor(Math.random() * 1000 + 1);
  $('#randomnumber').text(randomno);
};
$(function(){
  random_gen();
  disable_calculate();
  $('.post').click(function(){
    $('#spinner').show();
    $('#message').removeClass('show');
    $('#message').addClass('hide');
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        min: $('#minInput').val(),
        max: $('#maxInput').val(),
        sens: trim_spaces($('#sensitivity_val').text()),
        spec: trim_spaces($('#specificity_val').text()),
        prev: $('#prevalence').val(),
        N: $('#n_value').val(),
        unique_id: $('#randomnumber').text(),
        fixed_flag: $('#fixed_flag').text()
      }, {
        dataType: 'json'
      }),
      url: '/sampleSizeRest/',
      success: function(ret){
        $('#spinner').removeClass('show');
        $('#spinner').addClass('hide');
        $('#output_graph').empty();
        generate_tabs($('#fixed').val(), $('#randomnumber').text());
        generate_tables(ret);
        random_gen();
      },
      error: function(jqXHR, textStatus, errorThrown){
        var message;
        $('#spinner').hide();
        console.log("header: " + jqXHR + " \n Status: " + textStatus + " \n\nThe server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.");
        message = "Service Unavailable: " + textStatus + " <br>";
        message += "The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.<br>";
        $('#message-content').empty().append(message);
        $('#message').removeClass('hide');
        $('#message').addClass('show');
      }
    });
    return false;
  });
});
$(function(){
  $('.reset').click(function(){
    $('#ss')[0].reset();
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