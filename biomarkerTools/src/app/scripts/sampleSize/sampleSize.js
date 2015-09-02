var thisTool;

function init_sampleSize(){
    thisTool = $("#sampleSize");
    random_gen();
}    

$('a[href="#sampleSize"]').on('shown.bs.tab',function(e){
    init_sampleSize();
});

$(function(){
    init_sampleSize();

});

function checkValidity(){
    var isValid;
    var messages = [];
    thisTool.find("input, select").each(function(ind, el) {
        valObject = $(el)[0].validity;
        if(el.id == "contour_dropdown" && valObject.valueMissing) {
            messages.push("Please select an option from the Contour dropdown.");
        }
        else if(!valObject.valid && !valObject.stepMismatch) {
            if($(el)[0].title !== "") messages.push($(el)[0].title);
        }
        
        else if(el.id == "contour" || el.id == "fixed") {
            var values = $(el).val().split(',');

            for(var i = 0; i != values.length; i++) {
                if(isNaN(values[i])|| !isNumberBetweenZeroAndOne(values[i]))
                    messages.push(el.title);
            }
        }

    });

    if(messages.length > 0)
        isValid = false;
    else
        isValid = true;


    return [ isValid, messages ];
}

// Post json to server
thisTool.find('.post').click(function(){
    thisTool.find("#errors").addClass("hide");
    var valid = checkValidity();

    if(!valid[0]){
        display_errors(valid[1]);
    }
    else {
        disableAll();
        var service = "http://" + window.location.hostname + "/" + rest + "/sampleSize/" ;
        
        thisTool.find("#spinner").removeClass("hide");

        // scroll down to loader image
        document.querySelector(thisTool.find('#spinner').selector).scrollIntoView(true);

        thisTool.find(".post").attr('disabled','').text("Please Wait....");
        thisTool.find("#spinner").removeClass("hide");

        var request = function(){ 
            $.ajax({
                type: 'POST',
                // Provide correct Content-Type, so that Flask will know how to process it.
                contentType: 'application/json',
                data: JSON.stringify({
                    k: thisTool.find("#minInput").val() + "," + thisTool.find("#maxInput").val(),
                    sens: trim_spaces(thisTool.find("#sensitivity_val").text()),
                    spec: trim_spaces(thisTool.find("#specificity_val").text()),
                    prev: thisTool.find("#prevalence").val(),
                    N: thisTool.find("#n_value").val(),
                    unique_id: thisTool.find("#randomnumber").text(),
                    fixed_flag:thisTool.find("#fixed_flag").text() 
                }),
                // This is the type of data expected back from the server.
                dataType: 'json',
                url: service
            }).then(function (ret) {
                thisTool.find("#spinner").addClass("hide");
                thisTool.find("#output_graph").empty();
                generate_tabs(thisTool.find("#fixed").val(),thisTool.find("#randomnumber").text());
                generate_tables(ret);
                random_gen();
            },
            function(jqXHR, textStatus, errorThrown) {
                default_ajax_error(jqXHR, textStatus, errorThrown);
            }).always(function(){
                enableAll();
                thisTool.find(".post").removeAttr('disabled').text("Calculate");
                thisTool.find("#spinner").addClass("hide");
            });
        };

        request();
    } 
    return false;
});

thisTool.find('.reset').click(function(){
    thisTool.find('input').val("");
    thisTool.find("#output_graph").empty();
    thisTool.find("#errors").addClass("hide");
});

thisTool.find("#add-test-data").click(function() {
    example_code();
});	

thisTool.find("#contour").keyup(function(){
    change_hidden('contour');
});

thisTool.find("#fixed").keyup(function(){
    change_hidden('fixed');
});

thisTool.find("#minInput, #maxInput").on('change', function() {
    var thisVal = this.value;
    var compareVal;

    if(this.id == "minInput") {
        compareVal = thisTool.find("#maxInput").val();
    }
    else {
        compareVal = thisTool.find("#minInput").val();
    }

    if(thisVal.length + compareVal.length >= 2) {
        if(thisVal == compareVal) {
            display_errors("Min Value and Max Value of k cannot be equal");
        }
        else if( thisTool.find("#maxInput").val() < thisTool.find("#minInput").val()) {
            display_errors("Max Value cannot be less than the Min Value");
        }
    }
    else {
        thisTool.find("#errors").empty().addClass("hide");
    }
});

thisTool.find("#contour_dropdown").on("change", lock_fixed_options);

function generate_tables(jsonrtn){
    // use this value as a key in the json data
    var label = thisTool.find("#contour_dropdown option:selected").text();

    for(var i in jsonrtn) {
        //        console.log(i);
        var tablesvar = "<TABLE class='table table-bordered table-condensed small'><TBODY>";
        tablesvar += "<TR><TH class='table_data header'>" + label + "</TH><TH class='table_data header'>Optimal k</TH><TH class='table_data header'>Relative efficiency gain or <br>loss compared to k = 0.5</TH></TR>";
        var ppvtabledata = tablesvar;
        var cnpvtabledata = tablesvar;
        for(var n=0; n<jsonrtn[i].PPVData.length; n++) {
            //            console.log("PPVData");
            ppvtabledata += "<TR><TD>" + jsonrtn[i].PPVData[n][label] + "</TD>";
            ppvtabledata += "<TD>"+jsonrtn[i].PPVData[n]["Optimal k"]+"</TD>";
            ppvtabledata += "<TD>"+jsonrtn[i].PPVData[n]['Relative efficiency gain or loss compared to k = 0.5']+"</TD>";

            cnpvtabledata += "<TD>" + jsonrtn[i].cNPVData[n][label] + "</TD>";
            cnpvtabledata += "<TD>"+jsonrtn[i].cNPVData[n]["Optimal k"]+"</TD>";
            cnpvtabledata += "<TD>"+jsonrtn[i].cNPVData[n]['Relative efficiency gain or loss compared to k = 0.5']+"</TD></TR>";
        }
        ppvtabledata += "</TBODY></TABLE>";
        cnpvtabledata += "</TBODY></TABLE>";
        thisTool.find("#"+i+"ppvdata").append(ppvtabledata);
        thisTool.find("#"+i+"cnpvdata").append(cnpvtabledata);
    }
}

function disable_calculate(){
    thisTool.find('.post').attr("disabled","");
}

function enable_calculate(){
    thisTool.find('.post').removeAttr("disabled");

}

function generate_tabs(iterate,randomnumber){
    var fixed_flag = thisTool.find("#fixed_flag").text();
    var fixedvals=iterate.split(',');
    var arrayLength = fixedvals.length;
    thisTool.find("#output_graph").empty();
    var tabheaders = "<ul>";
    var tabcontent="";
    var pimagename="PPVkSensSpec-";
    var cimagename="cNPVkSensSpec-";

    var fixedtype=thisTool.find("#fixed_flag").text();
    //console.log("Fixed flag is "+fixedtype);
    if (fixedtype === "Sensitivity"){
        pimagename="PPVkSpecSens-";
        cimagename="cNPVkSpecSens-";
    }

    for(var i = 0; i < arrayLength; i++) {
        // console.log(fixedvals[i]);
        tabheaders += '<li><a href="#tab'+(i+1)+'">'+fixed_flag+'<br />'+fixedvals[i]+'</a></li>';
        tabcontent += '<div id="tab'+(i+1)+'"> <TABLE><TR><TD> <TABLE><TR><TD><IMG alt="output graph images for tab '+(i+1)+'" SRC="tmp/'+pimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div class="extra-padding" id="tab'+(i+1)+'ppvdata"><div></TD></TR></TABLE> </TD><TD> <TABLE><TR><TD><IMG alt="output graph images for tab '+(i+1)+'" SRC="tmp/'+cimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div class="extra-padding" id="tab'+(i+1)+'cnpvdata"></div></TD></TR></TABLE> </TD></TR></TABLE> </div>';	  

        //Do something
    }    
    tabheaders += "</ul>";
    // First make the right tabs

    var tabs = $("<div id='tabs'> </div>");
    thisTool.find("#output_graph").append(tabs);
    thisTool.find("#tabs").append(tabheaders);
    thisTool.find("#tabs").append(tabcontent);
    //Now execute
    thisTool.find("#tabs").tabs();

}

function change_ff(){
    thisTool.find("#fixed_flag").text(thisTool.find("#fixed_dropdown option:selected").text());
}

function lock_fixed_options(){
    var contour = thisTool.find("#" + this.id + " option:selected").text();

    if(contour.length > 0){
        if (contour == "Specificity"){
            thisTool.find("#fixed_dropdown option:not([value='sensitivity'])").removeAttr("disabled").removeAttr("selected").prop("disabled",true);
            thisTool.find("#fixed_dropdown option[value='sensitivity']").removeAttr("disabled").prop("selected", true).prop("disabled",true);
            thisTool.find("#specificity_val").text(thisTool.find("#contour").val());
            thisTool.find("#sensitivity_val").text(thisTool.find("#fixed").val());
        }
        else if (contour == "Sensitivity"){
            thisTool.find("#fixed_dropdown option:not([value='specificity'])").removeAttr("disabled").removeAttr("selected").prop("disabled",true);
            thisTool.find("#fixed_dropdown option[value='specificity']").removeAttr("disabled").prop("selected", true).prop("disabled",true);
            thisTool.find("#sensitivity_val").text(thisTool.find("#contour").val());
            thisTool.find("#specificity_val").text(thisTool.find("#fixed").val());
        }
    }
    else {
        thisTool.find("#fixed_dropdown option").removeAttr("selected");
        thisTool.find("#fixed_dropdown").val(" ");
    }

    change_ff();
}

function change_hidden(callingbox) {
    if (((callingbox == "contour")) && (thisTool.find("#contour_dropdown option:selected").text() == "Specificity")) {   
        thisTool.find("#specificity_val").text(trim_spaces(thisTool.find("#contour").val()));
    }else if (((callingbox == "contour")) && (thisTool.find("#contour_dropdown option:selected").text() == "Sensitivity")){
        thisTool.find("#sensitivity_val").text(trim_spaces(thisTool.find("#contour").val()));
    }else if (((callingbox == "fixed")) && (thisTool.find("#fixed_dropdown option:selected").text() == "Sensitivity")){
        thisTool.find("#sensitivity_val").text(trim_spaces(thisTool.find("#fixed").val()));
    }else if (((callingbox == "fixed")) && (thisTool.find("#fixed_dropdown option:selected").text() == "Specificity")){
        thisTool.find("#specificity_val").text(trim_spaces(thisTool.find("#fixed").val()));
    }else{
        return 0;
    }
}

function trim_spaces(varstring) {
    return varstring.replace(/\s/g, '');	
}

function example_code(){
    thisTool.find("#minInput").val("0");
    thisTool.find("#maxInput").val("1");
    thisTool.find("#contour").val("0.8,0.9,0.95,0.995");
    thisTool.find("#contour_dropdown").val("sensitivity");
    thisTool.find("#fixed").val("0.7,0.8,0.9");
    thisTool.find("#fixed_dropdown").val("specificity");
    thisTool.find("#prevalence").val("0.001");
    thisTool.find("#n_value").val("1");
    thisTool.find("#fixed_flag").text("Specificity");
    change_hidden("contour");
    change_hidden("fixed");
    enable_calculate();
}

function reset_code(){
    thisTool.find("#contour_dropdown option:first, #fixed_dropdown option:first").attr("selected");
    thisTool.find("#contour,#fixed,#fixed_flag").val("");
    thisTool.find("#prevalence").val(0.001);
    thisTool.find("#n_value").val("1");
    thisTool.find("#minInput").val(0.0);
    thisTool.find("#maxInput").val(1.0);
    thisTool.find("#output_graph").empty();
    thisTool.find("#spinner, #error").addClass("hide");
    thisTool.find(".post").removeAttr("disabled").text("Calculate");
}

function random_gen(){
    var randomno = Math.floor((Math.random() * 1000) + 1);
    thisTool.find("#randomnumber").text(randomno);
}
