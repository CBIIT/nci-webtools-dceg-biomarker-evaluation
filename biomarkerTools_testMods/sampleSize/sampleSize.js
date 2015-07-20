var thisTool;

$(function(){
    thisTool = $("#sampleSize");
    random_gen();
    disable_calculate();

   
    $('.post').click(function(){
        thisTool.find("#spinner").show(); 
        thisTool.find("#message").hide(); 
        $.ajax({
            type: 'POST',
           
            contentType: 'application/json',
           
           
            data: JSON.stringify({
                k: thisTool.find("#independent").val(),
                sens: trim_spaces(thisTool.find("#sensitivity_val").text()),
                spec: trim_spaces(thisTool.find("#specificity_val").text()),
                prev: thisTool.find("#prevalence").val(),
                N: thisTool.find("#n_value").val(),
                unique_id: thisTool.find("#randomnumber").text(),
                fixed_flag:thisTool.find("#fixed_flag").text() 
            }),
           
            dataType: 'json',
            url: 'biomarkerToolsRest/sampleSizeRest/',
            success: function (ret) {
                thisTool.find("#spinner").hide();
                thisTool.find("#output_graph").empty();
                generate_tabs(thisTool.find("#fixed").val(),thisTool.find("#randomnumber").text());
                generate_tables(ret);
                random_gen();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                thisTool.find("#spinner").hide();
                console.log("header: " + jqXHR + "\n" + "Status: " + textStatus + "\n\nThe server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.");
                message = 'Service Unavailable: ' + textStatus + "<br>";
                message += "The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.<br>";
                thisTool.find("#message-content").empty().append(message);	   
                thisTool.find("#message").show();    
            },
        });
       
        return false;
    });
});

$(function(){
    $('.reset').click(function(){
        $('#ss')[0].reset();
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

});


function generate_tables(jsonrtn){
    for(var i in jsonrtn) {
        console.log(i);
        var tablesvar = "<TABLE class='table_data'><TBODY>";
        tablesvar += "<TR><TH class='table_data header'>Sensitivity</TH><TH class='table_data header'>Optimal K</TH><TH class='table_data header'>Relative efficiency gain or <br>loss compared to k = 0.5</TH></TR>";
        ppvtabledata = tablesvar;
        cnpvtabledata = tablesvar;
        for (n=0; n<jsonrtn[i].PPVData.length; n++) {
            console.log("PPVData");
            ppvtabledata += "<TR><TD>"+jsonrtn[i].PPVData[n].Sensitivity+"</TD>";
            ppvtabledata += "<TD>"+jsonrtn[i].PPVData[n]["Optimal k"]+"</TD>";
            ppvtabledata += "<TD>"+jsonrtn[i].PPVData[n]['Relative efficiency gain or loss compared to k = 0.5']+"</TD>";
            console.log("cNPVData");
            cnpvtabledata += "<TD>"+jsonrtn[i].cNPVData[n].Sensitivity+"</TD>";
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
    $('.post').prop("disabled", true);
}

function enable_calculate(){
    $('.post').removeAttr("disabled");
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
    console.log("Fixed flag is "+fixedtype);
    if (fixedtype === "Sensitivity"){
        pimagename="PPVkSpecSens-";
        cimagename="cNPVkSpecSens-";
    }

    for (var i = 0; i < arrayLength; i++) {
        console.log(fixedvals[i]);
        tabheaders += '<li><a href="#tab'+(i+1)+'">'+fixed_flag+'<br />'+fixedvals[i]+'</a></li>';
       
        tabcontent += '<div id="tab'+(i+1)+'"> <TABLE><TR><TD> <TABLE><TR><TD><IMG SRC="/sampleSize/tmp/'+pimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div id="tab'+(i+1)+'ppvdata"><div></TD></TR></TABLE> </TD><TD> <TABLE><TR><TD><IMG SRC="/sampleSize/tmp/'+cimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div id="tab'+(i+1)+'cnpvdata"></div></TD></TR></TABLE> </TD></TR></TABLE> </div>';	  

       
    }    
    tabheaders += "</ul>";
   

    tabs = $("<div id='tabs'> </div>");
    thisTool.find("#output_graph").append(tabs);
    thisTool.find("#tabs").append(tabheaders);
    thisTool.find("#tabs").append(tabcontent);
   
    thisTool.find("#tabs").tabs();

}

function change_ff(){
    thisTool.find("#fixed_flag").text(thisTool.find("#fixed_dropdown option:selected").text());
}

function lock_fixed_options(){
    var contour = thisTool.find("#contour_dropdown option:selected").text();
    thisTool.find("#fixed_dropdown").empty();
    if (contour === "Specificity"){
        thisTool.find("#fixed_dropdown").append('<option value="specificity" disabled="disabled">Specificity</a>');
        thisTool.find("#fixed_dropdown").append('<option value="sensitivity" selected>Sensitivity</a>');
        thisTool.find("#specificity_val").text(thisTool.find("#contour").val());
        thisTool.find("#sensitivity_val").text(thisTool.find("#fixed").val());
    }
    if (contour === "Sensitivity"){
        thisTool.find("#fixed_dropdown").append('<option value="specificity" selected>Specificity</a>');
        thisTool.find("#fixed_dropdown").append('<option value="sensitivity" disabled="disabled">Sensitivity</a>');
        thisTool.find("#sensitivity_val").text(thisTool.find("#contour").val());
        thisTool.find("#specificity_val").text(thisTool.find("#fixed").val());
    }
    change_ff();
}




function change_hidden(callingbox){
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

function trim_spaces(varstring){
    return varstring.replace(/\s/g, '');	
}

function example_code(){
    thisTool.find("#message").hide();
    thisTool.find("#minInput").val(0);
    thisTool.find("#maxInput").val(1);
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
    thisTool.find("#independent").val("0,1");
    thisTool.find("#contour").val("");
    thisTool.find("#contour_dropdown").val("");
    thisTool.find("#fixed").val("");
    thisTool.find("#fixed_dropdown").val("");
    thisTool.find("#prevalence").val("");
    thisTool.find("#n_value").val("");
    thisTool.find("#fixed_flag").text("");
    thisTool.find("#output_graph").empty();
    thisTool.find("#message").empty();
    thisTool.find("#message-content").empty();
    thisTool.find("#message").hide();
    disable_calculate();
   
   
}



function random_gen(){
    var randomno = Math.floor((Math.random() * 1000) + 1);
    thisTool.find("#randomnumber").text(randomno);
}
