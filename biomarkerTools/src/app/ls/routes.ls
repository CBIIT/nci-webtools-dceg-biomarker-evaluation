$ document .on 'show.bs.tab' (el) !->
  id = el.target.hash.replace \# ''
  require [ id ]

#requirejs.onError = (e) !->
#    if $ '#errors.alert' .length > 0
#      $ \#errors .alert \close
#      $ \#errors .alert \close .remove!
#
#    $ '<div id="errors" class="alert alert-danger">
#    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
#    ' + '"' + e.requireModules.0 + '" script not found'+'</div>' .insertAfter '.title.text-center'