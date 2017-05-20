/**
 * Created by markozeman on 20.5.2017.
 */

function on_button_click() {

    play_audio("file:///home/markozeman/Desktop/organfinale.wav", 8);
}


function play_audio(path, startTime) {
    var audio = new Audio(path);
    audio.currentTime = startTime;
    audio.play();
}


// function loadAudio() {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             var audio = new Audio(this.response);
//             audio.play();
//         }
//     };
//     xhttp.open("GET", "file:///home/markozeman/Desktop/organfinale.wav", true);
//     xhttp.send();
// }