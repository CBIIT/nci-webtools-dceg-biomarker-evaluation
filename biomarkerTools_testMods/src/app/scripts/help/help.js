// pull in glossary js file
requirejs(['routes', 'glossary' ]);
var thisTool = $('#help');

thisTool.find('h4, h5').each(tableOfContentsList);

// used to construct links list for table of contents section
function tableOfContentsList(){
    var text = this.innerHTML;
    if(this.tagName == "H4")
        thisTool.find('#toc').append("<li><strong>" + text + "<strong></li>");
    if(this.tagName == "H5"){
        var el = $("<li><a class='goToTopic' href='javascript:void(0);' data-target='#" + this.id + "'>" + text + "</a></li>");    

        if(this.id.indexOf("help_") != -1){
            el.find('.goToTopic').on('click', function(){
                goToTarget(this);
            });
            thisTool.find('#toc li:contains("Tools Help")').append(el);
        }
    }
}

$('.goToTopic').on('click', function(){
    goToTarget(this);
});
