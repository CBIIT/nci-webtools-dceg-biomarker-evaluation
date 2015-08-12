var thisTool;
$(document).ready(function(){
    // pull in glossary js file
    requirejs(['main', 'glossary' ]);
    thisTool = $('#help');
    thisTool.find('h4, h5').each(tableOfContentsList);
});

$('a[href="#help"]').on('shown.bs.tab',function(e){
    thisTool = $("#help");
    require([ 'help']);
});

// used to construct links list for table of contents section
function tableOfContentsList(){
    var text = this.innerHTML;
    if(this.tagName == "H4")
        thisTool.find('#toc').append("<li><strong><a class='goToTopic' href='#" + this.id + "'>" + text + "</a><strong></li>");
    if(this.tagName == "H5"){
        var el = $("<li><a class='goToTopic' href='#" + this.id + "'>" + text + "</a></li>");    

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

thisTool.find('h4').each(toTop);

function toTop(){
    var el = $("<a class='pull-right' data-target='#top'>Top</a>").on('click', function(){
        document.getElementById("wrapper").scrollIntoView(true);
    });
    $(this).append(el);
}