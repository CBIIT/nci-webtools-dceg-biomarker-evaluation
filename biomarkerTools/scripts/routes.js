$(document).ready(function(){
  document.title = "Biomarker Tools: Home";
});
$(document).on('show.bs.tab', function(el){
  var id, title;
  id = el.target.hash.replace('#', '');
  require([id]);
  title = "Biomarker Tools: " + el.target.text;
  document.title = title;
});