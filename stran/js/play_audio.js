/**
 * Created by markozeman on 20.5.2017.
 */

var fromLang = 0;
var toLang = 0;

var startTime;
var recording = false;
var audio = false;
var curPred = false;
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

    $(".predavanja-seznam").on("click", ".predavanja-entry", function(){
        var i = $('.predavanja-seznam .predavanja-entry').index(this);

        curPred = predavanja[i];
        $("#txt-title").val(curPred.title);
        $(".top-bar .tags").html(`<span class="tag c-${curPred.color}">${curPred.predmet}</span>`);

        text_objects = curPred.content;
        renderBesedilo();
    });

    renderSeznam();
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

      let p = {
        title: $("#txt-title").val(),
        predmet:"TPO",
        color: 1,
        date: startTime,
        duration: (new Date()).getTime() - startTime.getTime(),
        audioFile: "audio/last.wav",
        content: text_objects
      };

      predavanja.unshift(p);

      curPred = p;
      
      renderSeznam();

    }
}

var testing_strings = [];
// var testing_strings = [{text: "Slovenia is in a rather active seismic zone because of its position on the small Adriatic Plate, which is squeezed between the Eurasian Plate to the north and the African Plate to the south and rotates counter-clockwise."},
//                         {text: "Thus the country is at the junction of three important geotectonic units: the Alps to the north, the Dinaric Alps to the south and the Pannonian Basin to the east.[99] Scientists have been able to identify 60 destructive earthquakes in the past."},
//                         {text: "Additionally, a network of seismic stations is active throughout the country.[99] Many parts of Slovenia have a carbonate ground, and an extensive subterranean system has developed."}];

var text_objects = [];

var predavanja = [
    {
        title: "Scrum",
        predmet:"PRPO",
        color: 2,
        date: new Date(2017,3,18,9,2,0,0),
        duration: 1000 * 60 * 60 * 3,
        audioFile: "audio/test1.wav",
        content: [
            {text:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet vel, dapibus id, mattis vel, nisi. Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Nullam mollis. Ut justo. Suspendisse potenti.", time: 0},
            {text:"Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, fermentum et, dapibus sed, urna.", time: 0},
            {text:"Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a ullamcorper laoreet, lectus arcu pulvinar risus, vitae facilisis libero dolor a purus. Sed vel lacus. Mauris nibh felis, adipiscing varius, adipiscing in, lacinia vel, tellus. Suspendisse ac urna. Etiam pellentesque mauris ut lectus. Nunc tellus ante, mattis eget, gravida vitae, ultricies ac, leo. Integer leo pede, ornare a, lacinia eu, vulputate vel, nisl.", time: 0},
            {text:"Suspendisse mauris. Fusce accumsan mollis eros. Pellentesque a diam sit amet mi ullamcorper vehicula. Integer adipiscing risus a sem. Nullam quis massa sit amet nibh viverra malesuada. Nunc sem lacus, accumsan quis, faucibus non, congue vel, arcu. Ut scelerisque hendrerit tellus. Integer sagittis. Vivamus a mauris eget arcu gravida tristique. Nunc iaculis mi in ante. Vivamus imperdiet nibh feugiat est.", time: 0},
            {text:"Ut convallis, sem sit amet interdum consectetuer, odio augue aliquam leo, nec dapibus tortor nibh sed augue. Integer eu magna sit amet metus fermentum posuere. Morbi sit amet nulla sed dolor elementum imperdiet. Quisque fermentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque adipiscing eros ut libero. Ut condimentum mi vel tellus. Suspendisse laoreet. Fusce ut est sed dolor gravida convallis. Morbi vitae ante. Vivamus ultrices luctus nunc. Suspendisse et dolor. Etiam dignissim. Proin malesuada adipiscing lacus. Donec metus. Curabitur gravida.", time: 0}
        ]
    },
    {
        title: "Errorji povsod",
        predmet:"PRPO",
        color: 2,
        date: new Date(2017,1,14,16,15,0,0),
        duration: 1000 * 60 * 60 * 2,
        audioFile: "audio/test2.wav",
        content: [
            {text: "Neko besedilo 2", time:0}
        ]
    },
    {
        title: "Prvo predavanje",
        predmet:"TPO",
        color: 1,
        date: new Date(2017,0,12,11,0,0,0),
        duration: 1000 * 60 * 60 * 3,
        audioFile: "audio/test2.wav",
        content: [
            {text: "Neko besedilo 3", time:0}
        ]
    }
];

function renderSeznam(){
    $(".predavanja-seznam").html('');

    for(let i=0; i<predavanja.length; i++){
        let pred = predavanja[i];
        let d = moment(pred.date);
        let dur = moment.duration(pred.duration);
        let el = `<div class="col-xs-12 predavanja-entry">
              <div class="col-xs-8">
                <span class="title">${pred.title}</span>
                <span class="tag c-${pred.color}">${pred.predmet}</span>
              </div>
              <div class="col-xs-4">
                <div class="timestamp">
                  <div class="datum">${d.format("DD.MM.YYYY")}</div>
                  <div class="time">
                    <span class="ura">${d.format("hh:mm")}</span>
                    <span class="glyphicon glyphicon-time time-icon"></span>
                    <span class="trajanje">${dur.hours()}h</span>
                  </div>
                </div>
              </div>
            </div>`;
        $(".predavanja-seznam").append(el);
    }
}

function renderBesedilo(){
    $("#speech_text").html('');

    for(let i=0; i<curPred.content.length; i++){
        var s = curPred.content[i].text;
        $("#speech_text").append(`<p class="odstavek">${s}</p>`);
    }
    
}



function make_html_from_text(text_object) {
    text_objects.push(text_object);
    var s = text_object.text;
    $("#speech_text").append(`<p class="odstavek">${s}</p>`);
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

