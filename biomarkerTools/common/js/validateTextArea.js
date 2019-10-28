// author: Dev Kavathekar NCI CBIIT
// date: June 2 2015

// generic textarea regular expression validator
// parameters: pattern without //, id of element (ex: "#textbox"), custom error message 
// return: returns true if invalid input, false otherwise (proper input)
function validateTextArea(pattern,textid,errorMsg) {

    var regexp = new RegExp(pattern,'g');
    var val = $(textid).val();
    var lines = val.split('\n');

    for(var i = 0; i < lines.length; i++) {
	
	if(!lines[i].match(regexp)) {

	    alert('Invalid input: ' + lines[i] + '\n' + errorMsg);
	    return true;
	}
	
    }

    return false;

}
