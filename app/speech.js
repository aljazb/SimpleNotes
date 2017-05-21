const record = require('node-record-lpcm16');
var fs = require('fs');
var path = require('path');

var curSocket = false;
var startTime = new Date();
var curTime = new Date();

exports.snemaj = function(req, res) {
  // Imports the Google Cloud client library
  const Speech = require('@google-cloud/speech');

  var prevedi = false;

  // Instantiates a client
  const speech = Speech();

  // The encoding of the audio file, e.g. 'LINEAR16'
  const encoding = 'LINEAR16';

  // The sample rate of the audio file in hertz, e.g. 16000
  const sampleRateHertz = 16000;

  // The BCP-47 language code to use, e.g. 'en-US'
  var languageCode;
  if (req.url.substring(8,9) == 1) {
    languageCode = 'sl-SI';
    if (req.url.substring(9) == 0) {
      prevedi = true;
    }
  } else {
    languageCode = 'en-US';
    if (req.url.substring(9) == 1) {
      prevedi = true;
    }
  }

  var audioFile = fs.createWriteStream(path.join(__dirname, '..', 'stran', 'audio', 'last.wav'), { encoding: 'binary' });

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
      if (prevedi && req.url.substring(8,9) == 1) {
        translateText(data.results, 'en');
      } else if (prevedi && req.url.substring(8,9) == 0) {
        translateText(data.results, 'sl');
      } else {
        if(curSocket){
          curSocket.emit('recognized',{text:data.results, time: (curTime.getTime() - startTime.getTime())/1000.0});
        }
        curTime = new Date();
      } 
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
  console.log('Sem ustavljen!');
}


exports.socketConnection = function(socket){
  curSocket = socket;
}

exports.socketMessage = function(message){
  console.log(message);
}

function translateText (text, target) {
  // [START translate_translate_text]
  // Imports the Google Cloud client library
  const Translate = require('@google-cloud/translate');

  // Instantiates a client
  const translate = Translate();

  // The text to translate, e.g. "Hello, world!"
  // const text = 'Hello, world!';

  // The target language, e.g. "ru"
  // const target = 'sl';

  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  translate.translate(text, target)
    .then((results) => {
      let translations = results[0];
      translations = Array.isArray(translations) ? translations : [translations];

      console.log('Translations:');
      translations.forEach((translation, i) => {
        console.log(`${text[i]} => (${target}) ${translation}`);
        if(curSocket){
          curSocket.emit('recognized',{text:translation, time: (curTime.getTime() - startTime.getTime())/1000.0});
        }
        curTime = new Date();
      });
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
  // [END translate_translate_text]
}