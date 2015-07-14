var default_ajax_error;

$.fn.goTo = function() {
    var selector = this.selector.replace("#","");
    document.getElementById(selector).scrollIntoView; // for chaining...\ 
    
    $('html, body').animate({
        scrollTop: $(this).offset().top + 'px'
    }, 'fast');
    
    return this;
};

$(document).ready(function(){
    document.title = "Biomarker Tools: Home";
});

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
    $.when$((".nav a[data-target='" + ref + "']").tab('show').parent().addClass('active')).then($(ref).goTo());
});

$('.goToHelp,.goToGlossary').on('click', function(el){
    var ref;
    $('.nav li.active').removeClass('active');
    ref = '#' + $(this).attr('data-target');
    $.when($(".nav a[data-target='#help']").tab('show').parent().addClass('active')).then($(ref).goTo());
});

default_ajax_error = function(request, status, error){
    $('#spinner').addClass('hide');
    alert(request.responseText);
};