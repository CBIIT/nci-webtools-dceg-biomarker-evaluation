var default_ajax_error;


var rest = "biomarkerToolsRest";

var custom_po_tmpl = "<div class='popover' role='tooltip'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div></div>";

$(document).ready(function(){
    this.title = "Biomarker Tools: Home";
});

$('#contentTabs .nav-tabs').on('show.bs.tab', function(el){
    var id = el.target.hash.toString().replace('#', '');

    require([id]);
    var title = "Biomarker Tools: " + el.target.text;
    document.title = title;
});

$(document).on('shown.bs.tab', function (e) {
    if(e.target.hash !== undefined){
        var id = e.target.hash.toString().replace('#', '');
        require([ id ]);
    }
});


$(document).on('hide.bs.tab', function (e) {
   
    var previousTab = e.target.hash.toString().replace('#', '');
    if($(e.target.hash).find("button[type='reset']").length > 0)
        $(e.target.hash).find("button[type='reset']").click();
    
    if(e.target.hash == "#bc")
        $(e.target.hash).find('input').val("");
        
});

$(document).on('hide.bs.tab', function (e) {
    var id = e.relatedTarget.hash;
    var currentTab = id.toString().replace('#', '');
   
    if(currentTab != "home" && currentTab != "help")
        thisTool = $(id);
});

$('.goToTab').on('click', function(el){
    var ref = $(this).attr('href');

    $('.nav li.active').removeClass('active');
    $(".nav a[href='" + ref + "']").tab('show').parent().addClass('active');
    var id = ref.replace("#","");
    require([id]);
});
$('.goToHelp').on('click', function(el){
    var $this = this;
    $(".nav a[href='#help']").tab('show');
    $(".nav a[href='#help']").on('shown.bs.tab', function(){
        var selector = $($this).attr('href').toString().replace("#","");
        document.getElementById(selector).scrollIntoView(true);
    });
});

$('.goToGlossary').on('click', function(el){
    var id = el.target.hash;
    var $this = this;
    
    $(".nav a[href='#help']").tab('show');
    $(".nav a[href='#help']").on('shown.bs.tab', function(){
        document.getElementById("header-glossary").scrollIntoView(true);
    });

});

$('.define').on('click', termDisplay);

function goToTarget(tar) {
    document.getElementById(tar.hash.replace("#","")).scrollIntoView(true);
}


function default_ajax_error(request, status, error){
    $('#spinner').addClass('hide');
    alert(request.responseText);
}

function isNumberBetweenZeroAndOne(n) {
    if (isNaN(parseFloat(n)))
        return false;
    if (n > 1)
        return false;
    if (n < 0)
        return false;
    return true;
}

function display_errors(message) {
    var text = "";

    if ($.isArray(message) && message.length > 0) {
        $(message).each(function (i, v) {
            text += "<li>" + v + "</li>";
        });
    }
    if (typeof message == "string") {
        text = message;
    }
    if(thisTool.find('#errors').length > 0){
        thisTool.find("#errors").empty();
        thisTool.find("#errors").remove();
    }

    thisTool.find("#helpGlossaryLinks").after("<div id='errors' class='col-md-12 alert alert-danger fade in'>" +
        "<ul class='list-unstyled'>" + text + "</ul></div>");

    thisTool.find('#errors').fadeIn();
    document.querySelector('#banners').scrollIntoView(true);
}

function termDisplay(){
    var $self = $(this);
    var dTerm = $self.attr('data-term');

    var definition = Glossary[dTerm].definition;
    var term = Glossary[dTerm].fullName;

    if (definition || term) {
        $self.popover(
            {
                template: custom_po_tmpl,
                container: 'body',
                trigger: 'manual',
                placement: 'top',
                title: term,
                content: definition}
        ).on('mouseout', function () {
            $self.popover('hide');
            $self.popover('destroy');
        });

        $self.popover();
        $self.popover('show');
    }

}