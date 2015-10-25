function encodeURL(S) {
	var U = encodeURIComponent(S);
	return U.replace('(','%28').replace(')','%29').replace('.','%2E');
}

function sendcode() {
	var code = $('#code-input').val();
	var input = $('#input-text').val();
	$('#output-text').text("");
	$('#stack-text').text("");
	$('#loops-text').text("");
	
	$('#run-button').show();
	$('#stop-button').hide();
	$('#run-button').attr('disabled', false);
	$('#step-button').attr('disabled', false);
	$('#slow-button').attr('disabled', false);
	$('#slow-button').show();
	$('#stopslow-button').hide();
	
	if (slow_repeat) { stopslow(); };
	
	$.ajax({
		url: window.location,
		type: 'get',
		data: {'code':code, 'action':'start', 'input':input, 'uid':$('#uid').text()},
		dataType: 'html',
		success: function(response) {
			$('#code-table').children().remove();
			$('#code-table').append(response);
			var permalinkHREF = "?code=" + encodeURL(code)
			if (input) { permalinkHREF += "&input=" + encodeURL(input) }
			$('#permalink').attr('href', permalinkHREF);
			
			stepcode(0, state="init");
		},
		failure: function(response) { console.log(response); }
	});
};

function stepcode(steps, state) {
	// state = state || ""
	if (steps == -1) {
		$('#run-button').toggle();
		$('#stop-button').toggle();
	}
	$('#status-text').text("Status: running...");
	
	$.ajax({
		url: window.location,
		type: 'get',
		data: {'action':'step', 'steps':steps, 'uid':$('#uid').text()},
		dataType: 'json',
		success: function(response) {
			$('.cell_highlight').removeClass('cell_highlight');
			$('#output-text').html(response['output']);
			$('#stack-text').text(response['stack']);
			$('#loops-text').html(response['loops']);
			$('#code-table').find('table').eq(response['z']).find('tr').eq(response['y']).find('td').eq(response['x']).addClass('cell_highlight');
			
			$('#curr-inst').html("Current instruction: <kbd>"+response['currchar']+"</kbd>");
			$('#input-str').html("Input: <code>"+response['inputstr']+"</code>");
			
			if (steps == -1) {
				$('#run-button').toggle();
				$('#stop-button').toggle();
			}
			
			if (response['done']) {
				$('#run-button').attr('disabled', true);
				$('#step-button').attr('disabled', true);
				$('#slow-button').attr('disabled', true);
				$('#status-text').text("Status: done!");
			} else {
				$('#status-text').text("Status: waiting...");
			}
			
			if (state === "init") {
				$('.cell_highlight').removeClass('cell_highlight');
				$('#status-text').text("Status: ready!");
			}
		},
		failure: function(response) {
			// if (steps == -1) {
				// $('#run-button').toggle();
				// $('#stop-button').toggle();
			// }
			// $('#status-text').text("Status: error!").style('color:red');
		}
	});
};

var slow_repeat;
var slow_break;
var stepLim;
var ready;

function slowcode(steps, speed) {
	stepLim = 1000;
	ready = 1;
	$('#slow-button').toggle();
	$('#stopslow-button').toggle();
	
	slow_break = setTimeout( function() { stopslow() }, 60000 );
	
	slow_repeat = setInterval( function() {
		if (stepLim <= 0) {
			stopslow();
		} else {
			if (ready) {
				ready = 0;
				$.ajax({
					url: window.location,
					type: 'get',
					data: {'action':'step', 'steps':Math.min(steps, stepLim), 'uid':$('#uid').text()},
					dataType: 'json',
					success: function(response) {
						$('.cell_highlight').removeClass('cell_highlight');
						$('#output-text').text(response['output']);
						$('#stack-text').text(response['stack']);
						$('#loops-text').html(response['loops']);
						$('#code-table').find('table').eq(response['z']).find('tr').eq(response['y']).find('td').eq(response['x']).addClass('cell_highlight');
						
						$('#curr-inst').html("Current instruction: <kbd>"+response['currchar']+"</kbd>");
						$('#input-str').html("Input: <code>"+response['inputstr']+"</code>");
						
						if (response['done']) {
							stepLim = -1;
							$('#run-button').attr('disabled', true);
							$('#step-button').attr('disabled', true);
							$('#slow-button').attr('disabled', true);
						} else {
							stepLim -= steps;
							ready = 1;
						}
					},
					failure: function(response) { console.log(response); stepLim = -1; }
				});
			};
		}
	}, speed);
};

function stopslow() {
	$('#slow-button').toggle();
	$('#stopslow-button').toggle();
	clearInterval(slow_repeat);
	clearTimeout(slow_break);
};

$(function() {
    $( "#speed-slider" ).slider({
		value:100,
		min: 0,
		max: 1000,
		step: 25,
		slide: function( event, ui ) {
			$( "#speed-input" ).val( ui.value );
		}
	});
	$( "#speed-input" ).val( $( "#speed-slider" ).slider( "value" ) );
  }
);