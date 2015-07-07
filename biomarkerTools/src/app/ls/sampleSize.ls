generate_tables = (jsonrtn) !->
    for key, kValue of jsonrtn
        console.log key
        tablesvar = "<table class='table_data table-condensed table-striped table-bordered'><TBODY>"
        tablesvar += "<TR><TH class='table_data header'>Sensitivity</TH><TH class='table_data header'>Optimal k</TH>"
        tablesvar += "<TH class='table_data header'>Relative efficiency gain or <br>loss compared to k = 0.5</TH></TR>"
        ppvtabledata = tablesvar
        cnpvtabledata = tablesvar
        
        for j, jValue of kValue.PPVData
            console.log \PPVData
            ppvtabledata += "<TR><TD>#{jValue['Sensitivity']}</TD>"
            ppvtabledata += "<TD>#{jValue['Optimal k']}</TD>"
            ppvtabledata += "<TD>#{jValue['Relative efficiency gain or loss compared to k = 0.5']}</TD>"
        
        for l, mValue of kValue.cNPVData
            console.log \cNPVData
            cnpvtabledata += "<TD>#{mValue.Sensitivity}</TD>"
            cnpvtabledata += "<TD>#{mValue['Optimal k']}</TD>"
            cnpvtabledata += "<TD>#{mValue['Relative efficiency gain or loss compared to k = 0.5']}</TD></TR>"
            
        ppvtabledata += "</TBODY></table>"
        cnpvtabledata += "</TBODY></table>"
        
        $ "##{key}ppvdata" .append ppvtabledata
        $ "##{key}cnpvdata" .append cnpvtabledata
        
disable_calculate = !-> $ \.post .prop \disabled yes

enable_calculate = !-> $ \.post .remove-attr \disabled

generate_tabs = (iterate, randomnumber) !->
    fixed_flag = $ \#fixed_flag .text!
    fixedvals = iterate.split ','
    arrayLength = fixedvals.length
    $ \#output_graph .empty!
    tabheaders = \<ul>
    tabcontent = ""
    pimagename = \PPVkSensSpec-
    cimagename = \cNPVkSensSpec-

    fixedtype = $ \#fixed_flag .text!
    console.log "Fixed flag is #{fixedtype}"
    
    if fixedtype === \Sensitivity
        pimagename = \PPVkSpecSens-
        cimagename = \cNPVkSpecSens-
        
    for i from 0 to arrayLength-1
        console.log fixedvals[i]
        tabheaders += '<li><a href="#tab' + (i + 1) + '">' + fixed_flag + '<br />' + fixedvals[i] + '</a></li>'
        tabcontent += '<div id="tab' + (i + 1) + '"><table><TR><TD><table><TR><TD><img src="/biomarkerTools/tmp/' + pimagename + randomnumber + '-' + (i + 1) + '.png"></TD></TR><TR><TD><div id="tab' + (i + 1) + 'ppvdata"><div></TD></TR></table></TD><TD><table><TR><TD><img src="/biomarkerTools/tmp/' + cimagename + randomnumber + '-' + (i + 1) + '.png"></TD></TR> <TR><TD><div id="tab' + (i + 1) + 'cnpvdata"></div></TD></TR></table></TD></TR></table></div>'
        #Do something

    tabheaders += \</ul>
    # First make the right tabs

    tabs = $ "<div id='tabs'> </div>"
    $ \#output_graph .append tabs
    $ \#tabs .append tabheaders
    $ \#tabs .append tabcontent
#Now execute
    $ \#tabs .tabs!

change_ff = !->
    $ \#fixed_flag .text( $ '#fixed_dropdown option:selected' .text!)

lock_fixed_options = !->
    contour = $ '#contour_dropdown option:selected' .text!
    $ \#fixed_dropdown .empty!
    if contour === \Specificity
        $ \#fixed_dropdown .append '<option value="specificity" disabled="disabled">Specificity</a>'
        $ \#fixed_dropdown .append '<option value="sensitivity" selected>Sensitivity</a>'
        $ \#specificity_val .text $ \#contour .val!
        $ \#sensitivity_val .text $ \#fixed .val!
        
    if contour === \Sensitivity
        $ \#fixed_dropdown .append '<option value="specificity" selected>Specificity</a>'
        $ \#fixed_dropdown .append '<option value="sensitivity" disabled="disabled">Sensitivity</a>'
        $ \#sensitivity_val .text $ \#contour .val!
        $ \#specificity_val .text $ \#fixed .val!
        
    change_ff!

change_hidden = (callingbox) !->
    if (((callingbox == \contour )) && ($ '#contour_dropdown option:selected' .text! == \Specificity ))
        $ \#specificity_val .text trim_spaces($ \#contour .val!)
    else if (((callingbox == \contour )) && ($ '#contour_dropdown option:selected' .text! == \Sensitivity ))
        $ \#sensitivity_val .text trim_spaces($ \#contour .val!)
    else if (((callingbox == \fixed )) && ($ '#fixed_dropdown option:selected' .text! == \Sensitivity ))
        $ \#sensitivity_val .text trim_spaces($ \#fixed .val!)
    else if (((callingbox == \fixed )) && ($ '#fixed_dropdown option:selected' .text! == \Specificity ))
        $ \#specificity_val .text trim_spaces($ \#fixed .val!)
    else
        return 0

trim_spaces = (varstring) -> varstring.replace /\s/g  ''

example_code = !->
    $ \#message .remove-class \show
    $ \#message .add-class \hide
    $ \#minInput .val \0
    $ \#maxInput .val \1
    $ \#contour .val '0.8,0.9,0.95,0.995'
    $ \#contour_dropdown .val \sensitivity
    $ \#fixed .val '0.7,0.8,0.9'
    $ \#fixed_dropdown .val \specificity
    $ \#prevalence .val \0.001
    $ \#n_value .val \1
    $ \#fixed_flag .text \Specificity
    change_hidden \contour
    change_hidden \fixed
    enable_calculate!

reset_code = !->
    $ \#minInput .val "0"
    $ \#maxInput .val "1"
    $ '#contour,#fixed,#prevalence,#n_value' .val ''
    
    $ '#contour_dropdown' .0.selected-index = 2
    $ '#fixed_dropdown' .0.selected-index = 1
    
    $ \#fixed_flag .text ''
    $ '#output_graph, #message, #message-content' .empty!
    
    $ \#message .removeClass \show
    $ \#message .addClass \hide
    
    disable_calculate!

random_gen = !->
    randomno = Math.floor (Math.random! * 1000) + 1
    $ \#randomnumber .text randomno

clean_data = (ret) !->
    ret = JSON.parse JSON.stringify ret
    
    $ \#spinner .remove-class \show
    $ \#spinner .add-class \hide
    $ \#output_graph .empty!
    
    generate_tabs($ \#fixed .val!, $ \#randomnumber .text!)
    generate_tables ret
    random_gen!
  
$ !->
    random_gen!
    disable_calculate!
    
    # Post json to server
    $ \.post .click ->
        $ \#spinner .remove-class \hide
        $ \#spinner .add-class \show
        
        $ \#message .remove-class \show
        $ \#message .add-class \hide
        
        to_value = 15 * 1000 #15 sec
        
        input = JSON.stringify(
            k: "#{$ \#minInput .val!},#{$ \#maxInput .val!}"
            sens: trim_spaces($ \#sensitivity_val .text!)
            spec: trim_spaces($ \#specificity_val .text!)
            prev: $ \#prevalence .val!
            N: $ \#n_value .val!
            unique_id: $ \#randomnumber .text!
            fixed_flag: $ \#fixed_flag .text!
        )
        
        if window.location.hostname is \localhost
            service = \scripts/test-data.json
        else
            service = \/sampleSizeRest/
            
        promise = $.ajax(
            dataType: \json,
            method: \POST,
            contentType: \application/json,
            url: service,
            data: input,
            timeout: to_value
        )
        
        promise.then(clean_data, (jqXHR, textStatus, errorThrown) !->
            $ \#spinner .remove-class \show
            $ \#spinner .add-class \hide
            console.log "header: #{jqXHR} \n Status: #{textStatus} \n\nThe server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later."
            message = "Service Unavailable: #{textStatus} <br>"
            message += "The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.<br>"
            $ \#message-content .empty!append message
            $ \#message .removeClass \hide
            $ \#message .addClass \show
        )
        false

$ !->
    $ \.reset .click !->
        #$ \#ss .0.reset!
        reset_code!
        $ \#message .remove-class \show
        $ \#message .add-class \hide

    $ \#add-test-data .click !->
        example_code!
        
    $ \#contour .keyup !->
        change_hidden \contour

    $ \#fixed .keyup !->
        change_hidden \fixed