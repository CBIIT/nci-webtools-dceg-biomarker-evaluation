var thisTool;
var spinner;
function init_sampleSize(){
    thisTool = $("#sampleSize");
    spinner = thisTool.find("#spinner");
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
    
    if(thisTool.find("#minInput").val() == thisTool.find("#maxInput").val()) {
        messages.push("Min and Max values of k cannot be equal.");
    }
    
    thisTool.find("input, select").each(function(ind, el) {
        valObject = $(el)[0].validity;
        if(el.id == "contour_dropdown" && valObject.valueMissing) {
            messages.push("Please select an option from the Contour dropdown.");
        }        
        else if(el.id == "n_value"){
            if($(el).val() <= 0)
                messages.push($(el)[0].title + ". You entered '" + $(el).val() + "'");
        }        
        else if(el.id == "prevalence"){
            if(!isNumberBetweenZeroAndOne($(el).val())) 
                messages.push($(el)[0].title + ". You entered '" + $(el).val() + "'");
        }
        else if(!valObject.valid && !valObject.stepMismatch) {
            if($(el)[0].title !== "") messages.push($(el)[0].title + ". You entered '" + $(el).val() + "'");
        }

        else if(el.id == "contour" || el.id == "fixed") {
            var values = $(el).val().split(',');

            for(var i = 0; i != values.length; i++) {
                if(isNaN(values[i])|| !isNumberBetweenZeroAndOne(values[i]))
                    messages.push(el.title + ". You entered '" + values[i] + "'");
            }
        }
    });

    if(messages.length > 0)
        isValid = false;
    else
        isValid = true;


    return [ isValid, messages ];
}


thisTool.find('.post').click(function(){
    thisTool.find("#errors").addClass("hide");
    var valid = checkValidity();

    if(!valid[0]){
        display_errors(valid[1]);
    }
    else {
        var request = function(){
            sampleSizeRequest(false).then(function (ret) {
                spinner.addClass("hide");
                thisTool.find("#output_graph").empty();
                generate_tabs(thisTool.find("#fixed").val(),
                              thisTool.find("#randomnumber").text());
                generate_tables(ret);
                random_gen();
                spinner.removeClass("hide");
                thisTool.find(".download").removeClass("hide");
            },
            function(jqXHR, textStatus, errorThrown) {
                default_ajax_error(jqXHR, textStatus, errorThrown);
            }).always(function(){
                enableAll();
                thisTool.find(".post").removeAttr('disabled').text("Calculate");
                spinner.addClass("hide");
            });
        };

        request();
    } 
    return false;
});

thisTool.find('.reset').click(reset_code);

thisTool.find("#add-test-data").click(function() {
    example_code();
});	

thisTool.find("#contour").keyup(function(){
    change_hidden('contour');
});

thisTool.find("#fixed").keyup(function(){
    change_hidden('fixed');
});

thisTool.find("#contour_dropdown").on("change", lock_fixed_options);

function generate_tables(jsonrtn){
   
    var label = thisTool.find("#contour_dropdown option:selected").text();

    for(var i in jsonrtn) {
       
        var tablesvar = "<TABLE class='table table-bordered table-condensed small'><TBODY>";
        tablesvar += "<TR><TH class='table_data header'>" + label + "</TH><TH class='table_data header'>Optimal k</TH><TH class='table_data header'>Relative efficiency gain or <br>loss compared to k = 0.5</TH></TR>";
        var ppvtabledata = tablesvar;
        var cnpvtabledata = tablesvar;
        for(var n=0; n<jsonrtn[i].PPVData.length; n++) {
           
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
   
    if (fixedtype === "Sensitivity"){
        pimagename="PPVkSpecSens-";
        cimagename="cNPVkSpecSens-";
    }

    for(var i = 0; i < arrayLength; i++) {
       
        tabheaders += '<li><a href="#tab'+(i+1)+'">'+fixed_flag+'<br />'+fixedvals[i]+'</a></li>';
        tabcontent += '<div id="tab'+(i+1)+'"> <TABLE><TR><TD> <TABLE><TR><TD><IMG alt="PPV graph image for tab '+(i+1)+'" SRC="tmp/'+pimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div class="extra-padding" id="tab'+(i+1)+'ppvdata"><div></TD></TR></TABLE> </TD><TD> <TABLE><TR><TD><IMG alt="cNPV graph image for tab '+(i+1)+'" SRC="tmp/'+cimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div class="extra-padding" id="tab'+(i+1)+'cnpvdata"></div></TD></TR></TABLE> </TD></TR></TABLE> </div>';	  

       
    }    
    tabheaders += "</ul>";
   

    var tabs = $("<div id='tabs'> </div>");
    thisTool.find("#output_graph").append(tabs);
    thisTool.find("#tabs").append(tabheaders);
    thisTool.find("#tabs").append(tabcontent);
   
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
    thisTool.find("#errors, .download").addClass("hide");
    
    spinner.addClass("hide");
    thisTool.find(".post").removeAttr("disabled").text("Calculate");
}

function random_gen(){
    var randomno = generateUniqueKey();
    thisTool.find("#randomnumber").text(randomno);
}

thisTool.find(".download").on("click", retrieve_excel);

function retrieve_excel() {
    return sampleSizeRequest(true)
        .then(
        function (excelFileRequest) {
            if(excelFileRequest.length > 0)
                window.open(excelFileRequest);
            else {
                display_errors("There was a problem generating or downloading the excel file.");
                console.log("problem generating excel file");
            }
        },
        function(jqXHR, textStatus, errorThrown) {
            default_ajax_error(jqXHR, textStatus, errorThrown);
        })
        .always(
        function() {
            enableAll();
            thisTool.find(".post").removeAttr('disabled').text("Calculate");
            spinner.addClass("hide");
        });
}

function sampleSizeRequest(exporting){

    hostname = window.location.hostname;
    url = "http://" + hostname +"/" + rest + "/sampleSize/";
    
    disableAll();
    thisTool.find(".post").attr('disabled','').text("Please Wait....");
    spinner.removeClass("hide");

   
    document.querySelector(thisTool.find('#spinner').selector).scrollIntoView(true);

    return $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({
            k: thisTool.find("#minInput").val() + "," + thisTool.find("#maxInput").val(),
            export:exporting,
            sens: trim_spaces(thisTool.find("#sensitivity_val").text()),
            spec: trim_spaces(thisTool.find("#specificity_val").text()),
            prev: thisTool.find("#prevalence").val(),
            N: thisTool.find("#n_value").val(),
            unique_id: thisTool.find("#randomnumber").text(),
            fixed_flag: thisTool.find("#fixed_flag").text()
        }),
        dataType: "json",
        contentType: "application/json"
    }).always(function(){
        thisTool.find("#calculate_button").text("Calculate");
        enableAll();
        spinner.addClass("hide");
    });
}

