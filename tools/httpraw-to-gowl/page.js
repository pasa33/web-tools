
//copy button
function copyCode() {
	selectCode("output");
	document.execCommand("copy");
}

//select all output code
function selectCode(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

$(function()
{
	var emptyOutputMsg = "Go code will appear here";
	var formattedEmptyOutputMsg = '<span style="color: #777;">'+emptyOutputMsg+'</span>';

	var emptyUaMsg = "UserAgent will appear here";
	var formattedEmptyUaMsg = '<span style="color: #777;">'+emptyUaMsg+'</span>';

	// Hides placeholder text
	$('#input').on('focus', function() {
		if (!$(this).val()){
			$('#output').html(formattedEmptyOutputMsg);
			$('#ua').html(formattedEmptyUaMsg);
		}
	});

	// Shows placeholder text
	$('#input').on('blur', function() {
		if (!$(this).val()){
			$('#output').html(formattedEmptyOutputMsg);
			$('#ua').html(formattedEmptyUaMsg);
		}
	}).blur();

	// Automatically do the conversion
	$('#input').on('input', function()
	{
		var input = $(this).val();
		if (!input)
		{
			$('#output').html(formattedEmptyOutputMsg);
			$('#ua').html(formattedEmptyUaMsg);
			return;
		}

		try {
			res = httpRawToGowl(input);
			var ua = res[0]
			var output = res[1]
			if (output) {
				if (typeof gofmt === 'function')
					output = gofmt(output);
				var coloredOutput = hljs.highlight("go", output);
				$('#output').html(coloredOutput.value);
				$('#ua').html(ua);
			}			
		} catch (e) {
			$('#output').html('<span class="clr-red">'+e+'</span>');
		}
	});

	var dark = true;	
	$("#dark").click(function()
	{
		dark = !dark;
		if(dark)
		{
			$("head").append("<link rel='stylesheet' href='../../resources/css/dark.css' id='dark-css'>");
			$("#dark").html("Light mode");

		} else
		{
			$("#dark-css").remove();
			$("#dark").html("Dark mode");
		}		
	});
});
