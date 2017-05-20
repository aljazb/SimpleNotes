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

console.log("teststst");