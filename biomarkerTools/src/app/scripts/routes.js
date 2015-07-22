var default_ajax_error;

// reuse this variable across tools
var rest = "biomarkerToolsRest";

var custom_po_tmpl = "<div class='popover' role='tooltip'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div></div>";

$(document).ready(function(){
    document.title = "Biomarker Tools: Home";
});

// applying new function to base jquery to scroll to 
// specific element using data-target attribute
$.fn.goTo = function() {
    if($(this).attr('id') == "glossary"){
        document.getElementById($(this).attr('id')).scrollIntoView(true);
    }
    else { 
        var selector = $(this).attr('data-target').replace("#","");
        document.getElementById(selector).scrollIntoView(true);
    }
    return this;
};

$('#contentTabs .nav-tabs').on('show.bs.tab', function(el){
    var id, title;
    
    // IE10 doesn't support data-attributes
    if(el.target.dataset == undefined)
        id = el.target.attributes.getNamedItem("data-target").nodeValue;
    else
        id = el.target.dataset.target.replace('#', '');
    
    require([id]);
    title = "Biomarker Tools: " + el.target.text;
    document.title = title;
});

$('.goToTab').on('click', function(el){
    var ref;
    $('.nav li.active').removeClass('active');
    ref = $(this).attr('data-target');
    $.when($(".nav a[data-target='" + ref + "']").tab('show').parent().addClass('active'));
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.dataset == undefined)
        previousTab = e.relatedTarget.attributes.getNamedItem("data-target").nodeValue;
    else
        previousTab = e.relatedTarget.dataset.target.replace('#', '');
    
    if(previousTab != "home" && previousTab != "glossary")
        $($(e.relatedTarget).attr('data-target')).find("#reset").click();        
});

$('.goToHelp,.goToGlossary').on('click', function(el){
    var $this = this;
    $(".nav a[data-target='#help']").on('shown.bs.tab',function(){
        goToTarget($this);
    });
    $('.nav li.active').removeClass('active');
    $(".nav a[data-target='#help']").tab('show').parent().addClass('active');

});

$('.define').on('click', termDisplay);

function goToTarget(tar){
    var ref = "";

    if(!$(tar).hasClass('goToGlossary')){
        ref = tar;
    }
    else if(!$(tar).hasClass('goToHelp')){
        ref = $(tar).attr('data-target');
    }
    else{
        ref = "glossary";
    }

    $(ref).goTo();
}

// misc functions
function default_ajax_error(request, status, error){
    $('#spinner').addClass('hide');
    alert(request.responseText);
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