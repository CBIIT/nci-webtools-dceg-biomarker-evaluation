var default_ajax_error;

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
  $(".nav a[data-target='" + ref + "']").tab('show').parent().addClass('active');
  window.scrollTo(0, 0);
});

$('.goToHelp,.goToGlossary').on('click', function(el){
  var ref;
  $('.nav li.active').removeClass('active');
  ref = '#' + $(this).attr('data-target');
  $(".nav a[data-target='#help']").tab('show').parent().addClass('active');
  $('html, body').animate({
    scrollTop: $(ref).offset().top
  }, 2000);
});

default_ajax_error = function(request, status, error){
  $('#spinner').addClass('hide');
  alert(request.responseText);
};