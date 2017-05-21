/**
 * Created by markozeman on 20.5.2017.
 */

var fromLang = 0;
var toLang = 0;

var startTime;
var recording = false;
var audio = false;
var stopwatch = function() { 
    var diff = moment.utc((new Date()).getTime() - startTime.getTime());

    $("#timer-text").text(diff.format("H:mm:ss")); 
}

$(document).ready(function() {
    $('#from-flag').click(function() {
        if (fromLang == 0) {
            fromLang = 1;
            $('#from-flag').attr('src', 'slovenia.png');
        } else {
            fromLang = 0;
            $('#from-flag').attr('src', 'united-kingdom.png');
        }

    });
    $('#to-flag').click(function() {
        if (toLang == 0) {
            toLang = 1;
            $('#to-flag').attr('src', 'slovenia.png');
        } else {
            toLang = 0;
            $('#to-flag').attr('src', 'united-kingdom.png');
        }

    });

    $('#speech_text').on('click', '.odstavek', function(){
        var i = $('#speech_text .odstavek').index(this);
        console.log(text_objects[i]);
        play_audio("audio/last.wav", text_objects[i].time);
    });
});

var stopwatchHandle = false;

function on_button_click() {
    play_audio("audio/last.wav", 0);
}


function play_audio(path, startTime) {
    if(!audio){
        audio = new Audio(path);
    }
    
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
      text_objects = [];
      $('#speech_text').html('');
      $.get('http://localhost:8042/record/'+fromLang+toLang);
    } else {
      recording = false;
      clearInterval(stopwatchHandle);
      $('#btn-record').removeClass('stop');
      $('#btn-record').addClass('start');
      $.get('http://localhost:8042/stop');
    }
}

var testing_strings = [];
// var testing_strings = [{text: "Slovenia is in a rather active seismic zone because of its position on the small Adriatic Plate, which is squeezed between the Eurasian Plate to the north and the African Plate to the south and rotates counter-clockwise."},
//                         {text: "Thus the country is at the junction of three important geotectonic units: the Alps to the north, the Dinaric Alps to the south and the Pannonian Basin to the east.[99] Scientists have been able to identify 60 destructive earthquakes in the past."},
//                         {text: "Additionally, a network of seismic stations is active throughout the country.[99] Many parts of Slovenia have a carbonate ground, and an extensive subterranean system has developed."}];

var text_objects = [];

function make_html_from_text(text_object) {
    text_objects.push(text_object);
    var s = text_object.text;
    $("#speech_text").append(`<p class="odstavek"></span> ${s}</p>`);
    if (fromLang != toLang) {
        if (toLang == 0) {
            responsiveVoice.speak(text_object.text);
        } else {
            responsiveVoice.speak(text_object.text, "Serbo-Croatian Male");
        }
    }
}

$(document).ready(main);


function main() {
    testing_strings.forEach(t => {
        make_html_from_text(t);
    });

}


var counter = 0;
var found_indices = [];

function search(classname) {
    console.log(classname);

    remove_children('speech_text');

    var found = false;

    var search_string = $('#search').val().toLowerCase();

    for (var i=0; i<text_objects.length; i++) {
        var text = text_objects[i].text;
        var lower_text = text.toLowerCase();

        var index = lower_text.indexOf(search_string);

        if (index != -1) {
            found = true;
            found_indices.push(i);
            found_indices = found_indices.filter( onlyUnique );

            var substring = text.substring(index, index+search_string.length);

            if (counter == i) {
                var changed_substring = '<span style=\"background-color: #ffff00;\">'+ substring +'</span>';
            }
            else {
                var changed_substring = '<span style=\"background-color: orange;\">'+ substring +'</span>';
            }

            var res_html = text.replace(substring, changed_substring);

            $("#speech_text").append(`<p class="odstavek"></span> ${res_html}</p>`);
        }
        else {
            $("#speech_text").append(`<p class="odstavek"></span>${text}</p>`);
        }
    }

    if (!found) {
        // document.getElementsByName('search')[0].style.backgroundColor = "red";
        var bg = $("#search").css('background'); // store original background
        $("#search").css('background', 'tomato'); //change second element background
        setTimeout(function() {
            $("#search").css('background', bg); // change it back after ...
        }, 1000);
    }
    else {
        console.log(found_indices);
        console.log(counter);

        var index = found_indices.indexOf(counter);
        if (classname == "right") {
            if (index+1 < found_indices.length) {
                counter = found_indices[index+1];
            }
            else {
                counter = found_indices[0];
            }
        }
        else {
            if (index > 0) {
                counter = found_indices[index-1];
            }
            else {
                counter = found_indices[found_indices.length-1];
            }
        }
        console.log(counter);
        console.log();
    }
}


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


function remove_children (id) {
    var myNode = document.getElementById(id);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

