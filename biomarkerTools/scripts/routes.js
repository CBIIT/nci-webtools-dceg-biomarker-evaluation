$(document).on('show.bs.tab', function(el){
  var id;
  id = el.target.hash.replace('#', '');
  require([id]);
});