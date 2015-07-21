var uniqueKey, old_value, editing, row, col, validPrevValue;

uniqueKey = null;
old_value = null;
editing = false;
row = null;
col = null;
validPrevValue = false;
var thisTool;
$(document).ready(function(){
    thisTool = $("#bc");
    bind_reference_row();
    bind_input();
    bind_calculate_button();
    bind_remove_row();
    bind_add_new_row();
});
function bind_remove_row(){
    thisTool.find('.remove_row_button').on('click', function(){
        remove_row($(this));
    });
}
function bind_add_new_row(){
    thisTool.find('#new_row_button').click(function(){
        add_new_row();
    });
}
function bind_calculate_button(){
    thisTool.find('#calculate_button').click(function(){
        do_calculation();
    });
}
function bind_reference_row(){
    thisTool.find('.reference').click(function(e){
        var row, col;
        row = $(this).attr('row');
        col = $(this).attr('col');
        clear_reference_row();
        $(this).html("<img src='/common/images/checkbox.png' height='18' width='18' alt='check'/>");
        $(this).parent().addClass('reference_row').children().last().empty().html('&nbsp');
    });
}
function bind_input(){
    thisTool.find('.input').click(function(e){
        var row, col, val, inp;
        if (!editing) {
            row = $(this).attr('row');
            col = $(this).attr('col');
            val = $(this).text();
            old_value = val;
            inp = $("<INPUT id='new_value' type='text' size='5' class='new_value' value=''></INPUT>");
            $(this).empty();
            $(this).append(inp);
            bind_text_change(inp);
            inp.focus();
            editing = true;
        }
    });
}
function bind_text_change(inp){
    inp.on('blur', function(e){
        var $this, new_value;
        $this = $(this);
        new_value = thisTool.find('#new_value').val();
        change_value($this, new_value);
    });
    inp.on('keypress', function(e){
        var $this, new_value;
        $this = $(this);
        if (e.which === 13) {
            new_value = thisTool.find('#new_value').val();
            change_value($this, new_value);
        }
    });
}
function change_value(field, new_value){
    if (!new_value || new_value === '') {
        field.parent().empty().text(old_value);
        editing = false;
        return;
    }
    if (isNumberBetweenZeroAndOne(new_value)) {
        field.parent().empty().text(new_value);
        editing = false;
    } else {
        alert("Valid Values are between 0 and 1 inclusive, you tried: " + new_value);
        field.parent().empty().text(old_value);
        editing = false;
    }
}
function clear_reference_row(){
    var num_rows;
    thisTool.find('#inputdata').find('.reference').html("<img src='/common/images/uncheckbox.png' height='18' width='18' alt='uncheck'/>");
    thisTool.find('#inputdata').find('.row').each(function(){
        $(this).removeClass('reference_row');
        if (!$(this).hasClass('non-data-row')) {
            $(this).children().last().empty().html("<BUTTON class='remove_row_button'>Remove</BUTTON>");
        }
    });
    bind_remove_row();
    num_rows = thisTool.find('#inputdata').find('.row').length - 3;
    if (num_rows <= 2) {
        thisTool.find('#inputdata').find('.remove_row_button').remove();
    }
}
function add_new_row(){
    var num_rows, row_1, row_2, row_3, row_4;
    num_rows = thisTool.find('#inputdata').find('.row').length - 3;
    row_1 = "<div class='row' row='" + num_rows + "'><div class='col-md-1'><b>" + (num_rows + 1) + "</b></div>";
    row_2 ="<div class='col-md-3 reference' row='" + num_rows + "' col='reference'><img src='/common/images/uncheckbox.png' height='18' width='18'  alt='uncheck'/></div>";
    row_3 ="<div class='col-md-3 input sensitivity' row='" + num_rows + "' col='sensitivity'>&nbsp;</div>" ;
    row_4 = "<div class='col-md-2 input specificity' row='" + num_rows + "' col='specificity'>&nbsp;</div>";
    row_5 ="<div class='col-md-3'><BUTTON class='remove_row_button'>Remove</BUTTON></div></div>";
    thisTool.find('#inputdata').find('.row').last().prev().after(row_1 + row_2 + row_3 + row_4 +row_5);
    if (num_rows === 2) {
        thisTool.find('#inputdata').find('.row').each(function(){
            if (!$(this).hasClass('non-data-row') && !$(this).hasClass('reference_row')) {
                $(this).children().last().empty().html("<BUTTON class='remove_row_button'>Remove</BUTTON>");
            }
        });
    }
    bind_remove_row();
    bind_reference_row();
    bind_input();
}
function remove_row(el){
    var row_to_remove, num_rows;
    row_to_remove = el.parent().parent();
    row_to_remove.remove();
    num_rows = thisTool.find('#inputdata').find('.row').length - 3;
    if (num_rows <= 2) {
        thisTool.find('#inputdata').find('.remove_row_button').remove();
    }
}
function do_calculation(){
    var refSens, refSpec, sensArray, specArray, prev, sensArrayWithRef, specArrayWithRef, labels, prevalence, validPrevValue, hasNoErrors, hostname, promise;
    refSens = "";
    refSpec = "";
    sensArray = "";
    specArray = "";
    prev = "";
    sensArrayWithRef = "";
    specArrayWithRef = "";
    labels = "";
    prevalence = thisTool.find('#prevalence').val();
    if (!isNumberBetweenZeroAndOne(prevalence)) {
        validPrevValue = false;
        prev = 0;
    } else {
        validPrevValue = true;
        prev = prevalence;
    }
    hasNoErrors = true;
    thisTool.find('#inputdata .row').each(function(i, el){
        var hasNoErrors;
        if ($(this).hasClass('reference_row')) {
            refSens = parseFloat($(this).find('.sensitivity').text());
            refSpec = parseFloat($(this).find('.specificity').text());
            sensArrayWithRef += refSens + ",";
            specArrayWithRef += refSpec + ",";
            hasNoErrors = isNumberBetweenZeroAndOne(refSens);
            hasNoErrors = isNumberBetweenZeroAndOne(refSpec);
        } else if (!$(this).hasClass('non-data-row')) {
            sensArray += parseFloat($(this).find('.sensitivity').text()) + ",";
            specArray += parseFloat($(this).find('.specificity').text()) + ",";
            sensArrayWithRef += parseFloat($(this).find('.sensitivity').text()) + ",";
            specArrayWithRef += parseFloat($(this).find('.specificity').text()) + ",";
            hasNoErrors = isNumberBetweenZeroAndOne(parseFloat($(this).find('.sensitivity').text()));
            hasNoErrors = isNumberBetweenZeroAndOne(parseFloat($(this).find('.specificity').text()));
            labels += (i + 1) + ",";
        }
    });
    sensArray = sensArray.slice(0, -1);
    specArray = specArray.slice(0, -1);
    sensArrayWithRef = sensArrayWithRef.slice(0, -1);
    specArrayWithRef = specArrayWithRef.slice(0, -1);
    labels = labels.slice(0, -1);
    if (!hasNoErrors) {
        alert("Error with input data.  Not all values are numbers between Zero and One");
        return;
    }
    uniqueKey = new Date().getTime();
    hostname = window.location.hostname;
    var service = "http://" + hostname + "/" + rest + "/bc/";
    if (validPrevValue) {
        promise = $.ajax({
            type: 'POST',
            url: service,
            data: {
                numberOfValues: '8',
                refSpec: refSpec,
                refSens: refSens,
                specArray: specArray,
                specArrayWithRef: specArrayWithRef,
                sensArray: sensArray,
                sensArrayWithRef: sensArrayWithRef,
                prev: prev,
                labels: labels,
                unique_key: uniqueKey
            },
            dataType: 'json',
            timeout: 15000
        });
    } else {
        promise = $.ajax({
            type: 'POST',
            url: service,
            data: {
                numberOfValues: '7',
                refSpec: refSpec,
                refSens: refSens,
                specArray: specArray,
                specArrayWithRef: specArrayWithRef,
                sensArray: sensArray,
                sensArrayWithRef: sensArrayWithRef,
                labels: labels,
                unique_key: uniqueKey
            },
            dataType: 'json'
        });
    }
    thisTool.find('#spinner').removeClass('hide');
    promise.then(set_data, default_ajax_error);
}
function isNumberBetweenZeroAndOne(n){
    if (isNaN(parseFloat(n))) {
        return false;
    } else if (n > 1) {
        return false;
    } else if (n < 0) {
        return false;
    } else {
        return true;
    }
}
function refreshGraph(drawgraph){
    var graph_file, d;
    if (drawgraph === 1) {
        graph_file = "../bc/tmp/SensSpecLR-" + uniqueKey + ".png?";
    } else {
        graph_file = "/common/images/fail-message.jpg?";
    }
    d = new Date();
    thisTool.find('#graph').attr('src', graph_file + d.getTime());
}
function set_data(dt){
    var jsonObject;
    jsonObject = JSON.parse(JSON.stringify(dt));
    refreshGraph(1);
    thisTool.find('#output').empty();
    thisTool.find('#output th').remove();
    if (validPrevValue) {
        createOutputTableWithPrev(jsonObject);
    } else {
        createOutputTable(jsonObject);
    }
    bindTermToDefine();
    thisTool.find('#spinner').addClass('hide');
}
function jsonToCell(obj){
    var key, value, Specificity, Sensitivity, LRplus, LRminus, new_row;
    for (key in obj) {
        value = obj[key];
        if (obj.hasOwnProperty(key)) {
            value = obj[key];
        }
        if (key === 'Specificity') {
            Specificity = value;
        } else if (key === 'Sensitivity') {
            Sensitivity = value;
        } else if (key === 'LRplus') {
            LRplus = value;
        } else if (key === 'LRminus') {
            LRminus = value;
        }
    }
    new_row = $("<tr>");
    new_row.append("<td>" + Sensitivity + "</td>");
    new_row.append("<td>" + Specificity + "</td>");
    new_row.append("<td>" + LRplus + "</td>");
    new_row.append("<td>" + LRminus + "</td>");
    thisTool.find('#output').append(new_row);
}
function jsonToCellWithPrev(obj){
    var i$, len$, key, value, Specificity, Sensitivity, LRplus, LRminus, PPV, cNPV, new_row;
    for (i$ = 0, len$ = obj.length; i$ < len$; ++i$) {
        key = obj[i$];
        if (obj.hasOwnProperty(key)) {
            value = obj[key];
            if (key === 'Specificity') {
                Specificity = value;
            } else if (key === 'Sensitivity') {
                Sensitivity = value;
            } else if (key === 'LRplus') {
                LRplus = value;
            } else if (key === 'LRminus') {
                LRminus = value;
            } else if (key === 'PPV') {
                PPV = value;
            } else if (key === 'cNPV') {
                cNPV = value;
            }
        }
    }
    new_row = $("<tr>");
    new_row.append("<td>" + Sensitivity + "</td>");
    new_row.append("<td>" + Specificity + "</td>");
    new_row.append("<td>" + LRplus + "</td>");
    new_row.append("<td>" + LRminus + "</td>");
    if (validPrevValue) {
        new_row.append("<td>" + PPV + "</td>");
    }
    if (validPrevValue) {
        new_row.append("<td>" + cNPV + "</td>");
    }
    thisTool.find('#output').append(new_row);
}
function createOutputTable(jsondata){
    var top_header_row, header_row, i$, len$, each;
    thisTool.find('#output').empty();
    top_header_row = $("<tr>");
    top_header_row.append("<th class='top-header' colspan='7'>Output Data</th>");
    thisTool.find('#output').append(top_header_row);
    header_row = $("<tr>");
    header_row.append("<th class='header'><div class='termToDefine' id='Sens2' data-term='Sens'>Sensitivity</div><div class='popupDefinition' id='Sens2Definition'></div></th>");
    header_row.append("<th class='header'><div class='termToDefine' id='Spec2' data-term='Spec'>Specificity</div><div class='popupDefinition' id='Spec2Definition'></div></th>");
    header_row.append("<th class='header'><div class='termToDefine' id='LRP2' data-term='LRP'>LR+</div><div class='popupDefinition' id='LRP2Definition'></div></th>");
    header_row.append("<th class='header'><div class='termToDefine' id='LRN2' data-term='LRN'>LR-</div><div class='popupDefinition' id='LRN2Definition'></div></th>");
    thisTool.find('#output').append(header_row);
    for (i$ = 0, len$ = jsondata.length; i$ < len$; ++i$) {
        each = jsondata[i$];
        jsonToCell(each);
    }
}
function createOutputTableWithPrev(jsondata){
    var top_header_row, header_row, i$, len$, each;
    thisTool.find('#output').empty();
    top_header_row = $("<tr>");
    top_header_row.append("<th class='top-header' colspan='7'>Output Data</th>");
    thisTool.find('#output').append(top_header_row);
    header_row = $("<tr>");
    header_row.append("<th class='header'><div class='termToDefine' id='Sens3' data-term='Sens'>Sensitivity</div><div class='popupDefinition' id='Sens3Definition'></div></th>");
    header_row.append("<th class='header'><div class='termToDefine' id='Spec3' data-term='Spec'>Specificity</div><div class='popupDefinition' id='Spec3Definition'></div></th>");
    header_row.append("<th class='header'><div class='termToDefine' id='LRP3' data-term='LRP'>LR+</div><div class='popupDefinition' id='LRP3Definition'></div></th>");
    header_row.append("<th class='header'><div class='termToDefine' id='LRN3' data-term='LRN'>LR-</div><div class='popupDefinition' id='LRN3Definition'></div></th>");
    header_row.append("<th class='header'><div class='termToDefine' id='PPV3' data-term='PPV'>PPV</div><div class='popupDefinition' id='PPV3Definition'></div></th>");
    header_row.append("<th class='header'><div class='termToDefine' id='cNPV3' data-term='cNPV'>cNPV</div><div class='popupDefinition' id='cNPV3Definition'></div></th>");
    thisTool.find('#output').append(header_row);
    for (i$ = 0, len$ = jsondata.length; i$ < len$; ++i$) {
        each = jsondata[i$];
        jsonToCellWithPrev(jsondata[each]);
    }
}
function ajax_error(jqXHR, exception){
    refreshGraph(1);
    alert("ajax problem");
}