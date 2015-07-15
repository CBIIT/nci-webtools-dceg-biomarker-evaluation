var default_ajax_error;

$(document).ready(function(){
    document.title = "Biomarker Tools: Home";
});

$.fn.goTo = function() {
    var selector = this.selector.replace("#","");

    //    document.getElementById(selector).scrollIntoView; // for chaining...\ 
    document.getElementById(selector).scrollTop = $(this).offset().top + 'px';

    return this;
};

$(document).on('show.bs.tab', function(el){
    var id, title;
    id = el.target.dataset.target.replace('#', '');
    require([id]);
    title = "Biomarker Tools: " + el.target.text;
    document.title = title;
});

$('.goToTab').on('click', function(el){
    var ref;
    $('.nav li.active').removeClass('active');
    ref = $(this).attr('data-target');
    $.when($(".nav a[data-target='" + ref + "']").tab('show').parent().addClass('active')).done(goToTarget(this));
});

$('.goToHelp,.goToGlossary').on('click', function(el){
    $('.nav li.active').removeClass('active');
    $(".nav a[data-target='#help']").tab('show').parent().addClass('active');

    $($(this).attr('data-target')).goTo();
});

function goToTarget(tar){
    var ref = $(tar).attr('data-target');
    
    if(!$(tar).hasClass('goToGlossary')){

        if($(tar).attr('data-target').indexOf("#") > -1)
            ref = "#" + ref;
    }
    else{
        ref = "glossary";
        $(ref).goTo();
    }
}

function default_ajax_error(request, status, error){
    $('#spinner').addClass('hide');
    alert(request.responseText);
}