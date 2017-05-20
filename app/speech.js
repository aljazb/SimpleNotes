const record = require('node-record-lpcm16');
var fs = require('fs');

var curSocket = false;
var startTime = new Date();
var curTime = new Date();

exports.snemaj = function(req, res) {
  // Imports the Google Cloud client library
  const Speech = require('@google-cloud/speech');

  // Instantiates a client
  const speech = Speech();

  // The encoding of the audio file, e.g. 'LINEAR16'
  const encoding = 'LINEAR16';

  // The sample rate of the audio file in hertz, e.g. 16000
  const sampleRateHertz = 16000;

  // The BCP-47 language code to use, e.g. 'en-US'
  const languageCode = 'sl-SI';

  var audioFile = fs.createWriteStream('/Users/Aljaz/Desktop/test.wav', { encoding: 'binary' });

  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode
    },
    interimResults: false // If you want interim results, set this to true
  };

  // Create a recognize stream
  const recognizeStream = speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
      if(curSocket){
        curSocket.emit('recognized',{text:data.results, time: (curTime.getTime() - startTime.getTime())/1000.0});
      }
      curTime = new Date();
    });

  // Start recording and send the microphone input to the Speech API
  var recorder = record
    .start({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      verbose: false,
      recordProgram: 'rec' // Try also "arecord" or "sox"
      // silence: '10.0'
    })
    .on('error', console.error);

  startTime = new Date();
  curTime = startTime;

  recorder.pipe(audioFile);
  recorder.pipe(recognizeStream);

  console.log('Prisluškujem...');
  res.end();
}

exports.ustavi = function(req, res) {
  record.stop();
  res.end();
}


exports.socketConnection = function(socket){
  curSocket = socket;
}

exports.socketMessage = function(message){
  console.log(message);
}
