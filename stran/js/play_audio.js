/**
 * Created by markozeman on 20.5.2017.
 */

var fromLang = 0;
var toLang = 0;

var startTime;
var recording = false;
var stopwatch = function() { 
    var diff = moment.utc((new Date()).getTime() - startTime.getTime());

    $("#timer-text").text(diff.format("H:mm:ss")); 
}

$(document).ready(function() {
    $('#from-flag').click(function() {
        if (fromLang == 0) {
            fromLang = 1;
            $('#from-flag').attr('src', 'united-kingdom.png');
        } else {
            fromLang = 0;
            $('#from-flag').attr('src', 'slovenia.png');
        }

    });
    $('#to-flag').click(function() {
        if (toLang == 0) {
            toLang = 1;
            $('#to-flag').attr('src', 'united-kingdom.png');
        } else {
            toLang = 0;
            $('#to-flag').attr('src', 'slovenia.png');
        }

    });
});

var stopwatchHandle = false;

function on_button_click() {
    play_audio("/Users/Aljaz/Desktop/test.wav", 0);
}


function play_audio(path, startTime) {
    var audio = new Audio(path);
    audio.currentTime = startTime;
    audio.play();
}


function start_stop_recording () {
    if(!recording){
      recording = true;
      startTime = new Date();
      stopwatchHandle = setInterval(stopwatch, 1000);
      $('#btn-record').removeClass('start');
      $('#btn-record').addClass('stop');
      $.get('http://localhost:8042/record/'+fromLang+toLang);
    } else {
      recording = false;
      clearInterval(stopwatchHandle);
      $('#btn-record').removeClass('stop');
      $('#btn-record').addClass('start');
      $.get('http://localhost:8042/stop');
    }
}


var testing_strings = ["Slovenia is in a rather active seismic zone because of its position on the small Adriatic Plate, which is squeezed between the Eurasian Plate to the north and the African Plate to the south and rotates counter-clockwise.",
                        "Thus the country is at the junction of three important geotectonic units: the Alps to the north, the Dinaric Alps to the south and the Pannonian Basin to the east.[99] Scientists have been able to identify 60 destructive earthquakes in the past.",
                        "Additionally, a network of seismic stations is active throughout the country.[99] Many parts of Slovenia have a carbonate ground, and an extensive subterranean system has developed."];


function make_html_from_text(text_array) {
    
}



function search() {
    
}