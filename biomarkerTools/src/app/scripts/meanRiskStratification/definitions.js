$(document).ready(function() {
  thisTool.find("select").on('change', function() {
    $(this).parent().prev().attr('data-term',$(this).val());
  });
});
