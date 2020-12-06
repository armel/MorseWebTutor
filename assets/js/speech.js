function randomLetters(length) {
   var result           = '';
   var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';   
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function morseEncode(pattern, context, dot) {
  letters = [ "a","b","c","d","e","f",
              "g","h","i","j","k","l",
              "m","n","o","p","q","r",
              "s","t","u","v","w","x",
              "y","z","0","1","2","3",
              "4","5","6","7","8","9",
              " "];

  symbols = [ ".-","-...","-.-.","-..",".","..-.",
              "--.","....","..",".---","-.-",".-..",
              "--","-.","---",".--.","--.-",".-.",
              "...","-","..-","...-",".--","-..-",
              "-.--","--..","-----",".----","..---","...--",
              "....-",".....","-....","--...","---..","----.",
              " "];

  pattern = pattern.split('').join(' ');
  console.log(pattern);

  var t = context.currentTime;

  var oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = localStorage.getItem('tone');

  var gainNode = context.createGain();
  gainNode.gain.setValueAtTime(0, t);

  for (const c of pattern) {
    for (const letter of symbols[letters.indexOf(c)]) {
      switch(letter) {
          case ".":
              gainNode.gain.setValueAtTime(1, t);
              t += dot;
              gainNode.gain.setValueAtTime(0, t);
              t += dot;
              break;
          case "-":
              gainNode.gain.setValueAtTime(1, t);
              t += 3 * dot;
              gainNode.gain.setValueAtTime(0, t);
              t += dot;
              break;
          case " ":
              t += 7 * dot;
              break;
      }
    }
  }

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();

  return t;
}

function morseSpeech(pattern, result) {
  for (const c of pattern) {
    var speech = new SpeechSynthesisUtterance(c);
    
    speech.lang = 'fr-CA';
    speech.name = 'Amelie';
    speech.rate = 1;
    speech.pitch = 1;
    
    console.log(speech);

    localStorage.setItem('tone',    $('#tone').val());
    localStorage.setItem('wpm',     $('#wpm').val());
    localStorage.setItem('letters', $('#letters').val());

    $('#pattern').val(pattern);

    speechSynthesis.speak(speech);
  }
}

function generateMorse() { 
  if ('speechSynthesis' in window) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var context = new AudioContext();
      var dot = 1.2 / 15;

      var tone = $('#tone').val();
      var wpm = $('#wpm').val();
      var letters = $('#letters').val();
      var series = $('#series').val();

      var pattern = randomLetters(letters);
      tempo = morseEncode(pattern, context, dot);
      setTimeout(function() {
          morseSpeech(pattern);
        }, tempo * 2000
      );
  } else {
    $('#modal1').openModal();
  }
}

$(function() {
  // Initialise value
  if (localStorage.getItem('tone') !== null) {
    $('#tone').val(localStorage.getItem('tone'));
  }

  if (localStorage.getItem('wpm') !== null) {
    $('#wpm').val(localStorage.getItem('wpm') * 10);
  }

  if (localStorage.getItem('letters') !== null) {
    $('#letters').val(localStorage.getItem('letters'));
  }

  $('#speak').click(function(){
    var inter = setInterval(function() {
        generateMorse(false);
    }, 10000);
  });
});
