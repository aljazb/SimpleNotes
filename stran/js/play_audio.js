/**
 * Created by markozeman on 20.5.2017.
 */

function on_button_click() {
    play_audio("/Users/Aljaz/Desktop/test.wav", 0);
}


function play_audio(path, startTime) {
    var audio = new Audio(path);
    audio.currentTime = startTime;
    audio.play();
}


function start_stop_recording () {
    if ($('#btn-record').hasClass('start')) {
        $('#btn-record').removeClass('start');
        $('#btn-record').addClass('stop');
    }
    else {
        $('#btn-record').removeClass('stop');
        $('#btn-record').addClass('start');
    }
}


var testing_strings = [{text: "Slovenia is in a rather active seismic zone because of its position on the small Adriatic Plate, which is squeezed between the Eurasian Plate to the north and the African Plate to the south and rotates counter-clockwise."},
                        {text: "Thus the country is at the junction of three important geotectonic units: the Alps to the north, the Dinaric Alps to the south and the Pannonian Basin to the east.[99] Scientists have been able to identify 60 destructive earthquakes in the past."},
                        {text: "Additionally, a network of seismic stations is active throughout the country.[99] Many parts of Slovenia have a carbonate ground, and an extensive subterranean system has developed."}];

var text_objects = [];

function make_html_from_text(text_object) {
    text_objects.push(text_object);
    var s = text_object.text;
    $("#speech_text").append(`<p class="odstavek"> <span class="glyphicon glyphicon-play hidden"></span> ${s}</p>`);
}

$(document).ready(main);


function main() {
    testing_strings.forEach(t => {
        make_html_from_text(t);
    });

}


var counter = 0;
var found_indices = [];

function search() {
    remove_children('speech_text');

    $("#speech_text").append("<h2>Trenutno predavanje</h2>");

    var found = false;

    var search_string = $('#search').val().toLowerCase();

    for (var i=0; i<text_objects.length; i++) {
        var text = text_objects[i].text;
        var lower_text = text.toLowerCase();

        var index = lower_text.indexOf(search_string);

        if (index != -1) {
            found = true;
            found_indices.push(i);

            var substring = text.substring(index, index+search_string.length);

            if (counter == i) {
                var changed_substring = '<span style=\"background-color: #ffff00;\">'+ substring +'</span>';
            }
            else {
                var changed_substring = '<span style=\"background-color: #aaaa00;\">'+ substring +'</span>';
            }

            var res_html = text.replace(substring, changed_substring);

            $("#speech_text").append(`<p class="odstavek">${res_html}</p>`);
        }
        else {
            $("#speech_text").append(`<p class="odstavek">${text}</p>`);
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
        var index = found_indices.indexOf(counter);
        if (index+1 < found_indices.length) {
            counter = found_indices[index+1];
        }
        else {
            counter = found_indices[0];
        }

    }

}


function remove_children (id) {
    var myNode = document.getElementById(id);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

