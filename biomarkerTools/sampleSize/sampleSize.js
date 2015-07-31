

var thisTool;

function init_sampleSize(){
    thisTool = $("#sampleSize");
    random_gen();
    disable_calculate(); 
}    

$('a[href="#sampleSize"]').on('shown.bs.tab',function(e){
    init_sampleSize();
});

$(function(){
    init_sampleSize();

});
    

thisTool.find('.post').click(function(){
        thisTool.find("#spinner").removeClass("hide"); 
        thisTool.find("#message").addClass("hide");
        var service = "http://" + window.location.hostname + "/" + rest + "/sampleSize/" ;
        if(window.location.hostname == "localhost") service = "sampleSize/test-data.json";
        disable_calculate();
       
        document.querySelector(thisTool.find('#spinner').selector).scrollIntoView(true);
        $.ajax({
            type: 'POST',
           
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
           
            dataType: 'json',
            url: service,

            success: function (ret) {
                thisTool.find("#spinner").addClass("hide");
                thisTool.find("#output_graph").empty();
                generate_tabs(thisTool.find("#fixed").val(),thisTool.find("#randomnumber").text());
                generate_tables(ret);
                random_gen();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                thisTool.find("#spinner").addClass("hide");
                console.log("header: " + jqXHR + "\n" + "Status: " + textStatus + "\n\nThe server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.");
                
                var message = 'Service Unavailable: ' + textStatus + "<br>";
                message += "The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.<br>";
                thisTool.find("#message-content").empty().append(message);	   
                thisTool.find("#message").removeClass("hide");    
            },
        });
        enable_calculate();
        return false;
    });

    thisTool.find('.reset').click(function(){
        thisTool.find('input').val("");
        thisTool.find("#output_graph").empty();
        thisTool.find("#message").addClass("hide");
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

function generate_tables(jsonrtn){
    for(var i in jsonrtn) {

        var tablesvar = "<TABLE class='table table-bordered table-condensed small'><TBODY>";
        tablesvar += "<TR><TH class='table_data header'>Sensitivity</TH><TH class='table_data header'>Optimal k</TH><TH class='table_data header'>Relative efficiency gain or <br>loss compared to k = 0.5</TH></TR>";
        var ppvtabledata = tablesvar;
        var cnpvtabledata = tablesvar;
        for(var n=0; n<jsonrtn[i].PPVData.length; n++) {

            ppvtabledata += "<TR><TD>"+jsonrtn[i].PPVData[n].Sensitivity+"</TD>";
            ppvtabledata += "<TD>"+jsonrtn[i].PPVData[n]["Optimal k"]+"</TD>";
            ppvtabledata += "<TD>"+jsonrtn[i].PPVData[n]['Relative efficiency gain or loss compared to k = 0.5']+"</TD>";

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
    thisTool.find('.post').prop("enabled",false);
    thisTool.find('.post').prop("disabled",true);
}

function enable_calculate(){
    thisTool.find('.post').prop("disabled",false);
    thisTool.find('.post').prop("enabled",true);
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
        tabcontent += '<div id="tab'+(i+1)+'"> <TABLE><TR><TD> <TABLE><TR><TD><IMG SRC="tmp/'+pimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div class="extra-padding" id="tab'+(i+1)+'ppvdata"><div></TD></TR></TABLE> </TD><TD> <TABLE><TR><TD><IMG SRC="tmp/'+cimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div class="extra-padding" id="tab'+(i+1)+'cnpvdata"></div></TD></TR></TABLE> </TD></TR></TABLE> </div>';	  

       
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
    thisTool.find("#message").addClass("hide");
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
 thisTool.find("#contour,#contour_dropdown,#fixed,#fixed_dropdown,#fixed_flag").val("");
    thisTool.find("#prevalence").val(0.001);
    thisTool.find("#n_value").val("1");
    thisTool.find("#minInput").val(0);
    thisTool.find("#maxInput").val(1);
    thisTool.find("#output_graph,#message,#message-content").empty();
    thisTool.find("#message").addClass("hide");
    disable_calculate();
    thisTool.find("#spinner").addClass('hide');
}



function random_gen(){
    var randomno = Math.floor((Math.random() * 1000) + 1);
    thisTool.find("#randomnumber").text(randomno);
}
