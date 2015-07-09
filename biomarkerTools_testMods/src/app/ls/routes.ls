$ document .ready !->
  document.title = "Biomarker Tools: Home"

$ document .on 'show.bs.tab' (el) !->
  id = el.target.dataset.target.replace \# ''
  require [ id ]
  title = "Biomarker Tools: #{el.target.text}"
  document.title = title 
  
$ '.goToTab' .on \click (el) !->
  $ '.nav li.active' .remove-class \active
  ref = $ @ .attr \data-target
  $ ".nav a[data-target='#{ref}']" .tab \show .parent!add-class \active
  window.scroll-to 0, 0
  
default_ajax_error = (request, status, error) !->
  $ \#spinner .add-class \hide
  alert request.responseText