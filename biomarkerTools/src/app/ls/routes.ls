$ document .ready !->
  document.title = "Biomarker Tools: Home"

$ document .on 'show.bs.tab' (el) !->
  id = el.target.hash.replace \# ''
  require [ id ]
  title = "Biomarker Tools: #{el.target.text}"
  document.title = title 
  
#$ 'a[data-toggle="tab"]' .on \click (el) !->
#  ref = $ @ .attr \data-target
#  
#  $ '.nav li' find \.active .remove-class \active
#  target = 'a[data-target="' + ref + '"]'
#  $ '.nav li' .find target .parent!add-class \active 
#  $ ref .tab \show