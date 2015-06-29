#baseURL = 'pages'
##load content for first tab and initialize
#tabs = $ \#contentTabs
#$ '#contentTabs .tab-content' .load "#{baseURL}/home.html" !->
#  tabs.tab(); #initialize tabs
#
#tabs.bind \show (e) !->
#  pattern = new regExp '/#.+/gi' #use regex to get anchor(==selector)
#  contentID = e.target.toString!match(pattern).0 #get anchor
#  #load content for selected tab
#  $ contentID .load baseURL+contentID.replace '#' '' !->
#  tabs.tab! #reinitialize tabs