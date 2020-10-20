(function() {

  var thisTool = $('#help');
  $(function(){
      thisTool = $('#help');
      var glossary = $('#glossary');
      var keys = [];
      var terms = {};
      for (var term in $_Glossary) {
        if (keys.indexOf(term.toUpperCase()) < 0) {
          keys.push(term.toUpperCase());
          terms[term.toUpperCase()] = $_Glossary[term];
        }
      }
      keys = keys.sort();
      for (var index in keys) {
        index = keys[index];
        $("<p><b>" + terms[index].fullName + ":</b><span> " +
          (terms[index].glossaryDefinition || terms[index].definition) +
          "</span></p>").appendTo(glossary);
      }
  });
  
  $('a[href="#help"]').on('shown.bs.tab',function(e){
      thisTool = $("#help");
  });
  
  $('.goToTopic').on('click', function(){
      goToTarget(this);
  });
  
  thisTool.find('h4').each(toTop);
  
  function toTop(){
      var el = $("<a class='pull-right' data-target='#top'>Top</a>").on('click', function(){
          document.getElementById("wrapper").scrollIntoView(true);
      });
      $(this).append(el);
  }
  
})();