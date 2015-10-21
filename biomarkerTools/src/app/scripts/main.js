if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
  };
}

var default_ajax_error;
var rest = "biomarkerToolsRest"; // reuse this variable across tools
var activeRequest = false; // will be used to detect if requests are running
var custom_po_tmpl = "<div class='popover' role='tooltip'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div></div>";

function disableAll(){
  // Disable all controls for use during ajax request
  activeRequest = true;
  $("a, button,select,input").attr("disabled","").addClass("disable_control");

  // disabling tabs and collapse elements
  $("[data-toggle='tab']").attr("data-toggle", "disabledTab");
  $("[data-toggle='collapse']").attr("data-toggle", "disabledCollapse");
}

function enableAll() {
  // Enable all controls for use after ajax request completes
  activeRequest = false;
  $("a, button, select, input").removeAttr("disabled").removeClass("disable_control");
  $(".disable_control").unbind("click");

  // enabling tabs and collapse elements
  $("[data-toggle='disabledTab']").attr("data-toggle", "tab");
  $("[data-toggle='disabledCollapse']").attr("data-toggle", "collapse");
}

function generateUniqueKey(){
  Math.seedrandom();
  var multiples = [100, 1000, 10000, 100000, 1000000, 10000000,100000000, 1000000000];
  var randomKey = Math.floor(Math.random() * multiples[Math.floor(Math.random() * multiples.length)]);

  return randomKey;
}

$(document).ready(function(){
  this.title = "Biomarker Tools: Home";
});

$(document).on('hide.bs.tab', function (e) {
  var id = e.relatedTarget.hash;
  var currentTab = id.toString().replace('#', '');
  // set this tab variable to new tab before being shown
  if(currentTab != "home" && currentTab != "help")
    thisTool = $(id);
});

$(document).on('shown.bs.tab', function (e) {
  if(e.target.hash !== undefined){
    var id = e.target.hash.toString().replace('#', '');
    require([ id ]);
  }
});

$('#contentTabs .nav-tabs').on('show.bs.tab', function(el){
  var id = el.target.hash.toString().replace('#', '');

  require([id]);
  var title = "Biomarker Tools: " + el.target.text;
  document.title = title;
});

$('.define').on('click', termDisplay);

$('.disable_control').on('click',function(e){
  e.preventDefault();
});

$('.goToGlossary').on('click', function(el){
  var id = el.target.hash;
  var $this = this;

  $(".nav a[href='#help']").tab('show');
  $(".nav a[href='#help']").on('shown.bs.tab', function(){
    document.getElementById("header-glossary").scrollIntoView(true);
  });

});

$('.goToHelp').on('click', function(el){
  var $this = this;
  $(".nav a[href='#help']").tab('show');
  $(".nav a[href='#help']").on('shown.bs.tab', function(){
    var selector = $($this).attr('href').toString().replace("#","");
    document.getElementById(selector).scrollIntoView(true);
  });
});

$('.goToTab').on('click', function(el){
  el.preventDefault();
  var ref = $(this).attr('href');
  $('.nav li.active').removeClass('active');
  $(".nav a[href='" + ref + "']").tab('show').parent().addClass('active');
  var id = ref.replace("#","");
  require([id]);
});


function goToTarget(tar) {
  document.getElementById(tar.hash.replace("#","")).scrollIntoView(true);
}

// misc functions
function default_ajax_error(request, status, error){
  display_errors([error]);
  console.log(request.responseText);
}

function isNumberBetweenZeroAndOne(n) {
  if(isNaN(n))
    return false;
  if (isNaN(parseFloat(n)))
    return false;
  if (n >= 1)
    return false;
  if (n <= 0)
    return false;
  return true;
}

function isInt(n){
  return Number(n) == n && n % 1 === 0;
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
    thisTool.find("#errors").empty().remove();
  }

  thisTool.find("#helpGlossaryLinks").after("<div id='errors' class='alert alert-danger fade in'>" +
                        "<ul class='list-unstyled'>" + text + "</ul></div>");

  thisTool.find('#errors').fadeIn();
  document.querySelector('header').scrollIntoView(true);
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
