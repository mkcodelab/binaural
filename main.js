const playBtn = document.querySelector('.btn');
let isPlaying = false;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let freqR = 99;
let freqL = 97;
const theta250hz = 250;
const darkness = 105;
// 113

// additional reference to the oscillators for turning them off
let oscR = audioCtx.createOscillator();
let oscL = audioCtx.createOscillator();

//fade in fade out
const fade = true;

const masterGain = audioCtx.createGain();
let currentVolume = .4;
masterGain.gain.value = currentVolume;


//channel merging for two separate channels
const merger = audioCtx.createChannelMerger(2);

// let waveformL = 'sine';
// let waveformR = 'sine';

let waveform = 'sine'

merger.connect(masterGain);
masterGain.connect(audioCtx.destination);

// we have to assign audioCtx.createOscillator to  oscR, oscL before function, because it otherwise doing error...

function start() {

  let osc2 = audioCtx.createOscillator();
  osc2.type = waveform;
  osc2.frequency.value = freqL;
  //connecting to the left channel
  osc2.connect(merger, 0, 1);

  let osc1 = audioCtx.createOscillator();
  osc1.type = waveform;
  osc1.frequency.value = freqR;
  //connecting to the right channel
  osc1.connect(merger, 0, 0);

  oscR = osc1;
  oscL = osc2;
  
  osc1.start();
  osc2.start();

  if(fade) masterGain.gain.exponentialRampToValueAtTime(currentVolume, audioCtx.currentTime + 1.2)
  isPlaying = true;
}

function stop() {
  if(fade){
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
    setTimeout(function(){
      // they never end, and overlap eachother
      // maybe we can use it somehow later
      // if (oscR.state == "running" || oscL.state == "running"){
      //   oscR.stop();
      //   oscL.stop();
      // }
      oscR.stop();
      oscL.stop();
      
    }, 1000)
  } else {
    oscR.stop();
    oscL.stop();
  }
  
  isPlaying = false;
}

playBtn.addEventListener('click', () => {
  
  !isPlaying ? start() : stop();
  playBtn.innerText = !isPlaying ? 'Play' : 'Stop';

})

// volume rangebar, left and right channels rangebars
//initial value set to 0.02;
const volumeRange = document.querySelector('#volume');
const leftChannel = document.querySelector('#leftChannel')
const rightChannel = document.querySelector('#rightChannel')

const leftLabel = document.querySelector('#leftLabel');
const rightLabel = document.querySelector('#rightLabel');

function updateChannels() {
  leftChannel.value = freqL;
  leftLabel.innerText = `Left Channel: ${freqL} Hz`
  rightChannel.value = freqR;
  rightLabel.innerText = `Right Channel: ${freqR} Hz`;
}
function updateVolume() {
  volumeRange.value = currentVolume;
}

volumeRange.value = 0.4;
updateChannels();

// volume change
volumeRange.addEventListener('input', e => {
  currentVolume = parseFloat(e.target.value);
  masterGain.gain.value = currentVolume;

  //changing the icon
  const volIcon = document.querySelector('#volumeIcon');
  if(currentVolume == 0){
    volIcon.src = 'assets/volume-x.svg';
  } else if(currentVolume > 0 && currentVolume <= 0.4) {
    volIcon.src = 'assets/volume.svg';
  } else if (currentVolume > 0.4 && currentVolume < 0.8) {
    volIcon.src = 'assets/volume-1.svg';
  } else {
    volIcon.src = 'assets/volume-2.svg';
  }

})
//maybe we can unify those function with parameters passed in
//left channel frequency change
leftChannel.addEventListener('input', e => {
  let freq = e.target.value;
  freqL = freq;
  if (oscL !== null) oscL.frequency.value = freq;
  leftLabel.innerText = `Left Channel: ${freq} Hz`;
})

//right channel frequency change
rightChannel.addEventListener('input', e => {
  let freq = e.target.value;
  freqR = freq;
  if (oscR !== null) oscR.frequency.value = freq;
  rightLabel.innerText = `Right Channel: ${freq} Hz`;
})

// settings ui
const settings = document.querySelector('.settings');
const cog = document.querySelector('.cog');
const settingsClose = document.querySelector('.settings-close');

cog.addEventListener('click', ()=> {
  settings.classList.add('visible');
})
settingsClose.addEventListener('click', ()=> {
  settings.classList.remove('visible');
})
//todo
//change freq range up to 400 hz
//waveform swtich declaration, for further updating
const wSwitch = document.querySelector('.waveform-switch');

function presetChosen(waveform) {
  wSwitch.innerText = waveform;
  stop();
  updateChannels();
  updateVolume();
  playBtn.innerText = 'Play';
}

const thetaPreset = document.querySelector('.preset-1');
thetaPreset.addEventListener('click', ()=> {
  freqL = theta250hz;
  freqR = theta250hz + 6;
  currentVolume = 0.02;
  waveform = 'sine';
  // wSwitch.innerText = 'Sine';
  // stop();
  // updateChannels();
  // updateVolume();
  // playBtn.innerText = 'Play';
  presetChosen('Sine');
  
})
const darknessPreset = document.querySelector('.preset-2');
darknessPreset.addEventListener('click', ()=> {
  freqL = darkness;
  freqR = darkness + 8;
  currentVolume = 0.5;
  waveform = 'sine';
  // wSwitch.innerText = 'Sine';
  // stop();
  // updateChannels();
  // updateVolume();
  // playBtn.innerText = 'Play';
  presetChosen('Sine');
})

const ufoPreset = document.querySelector('.preset-3');
ufoPreset.addEventListener('click', ()=> {
  freqL = 237;
  freqR = 227;
  currentVolume = 0.04;
  waveform = 'triangle';
  // wSwitch.innerText = 'Triangle';
  // stop();
  // updateChannels();
  // updateVolume();
  // playBtn.innerText = 'Play';
  presetChosen('Triangle');

})
// make function with those redundant functions and other stuff

const darkBuzz = document.querySelector('.preset-4');
darkBuzz.addEventListener('click', ()=> {
  freqL = 49;
  freqR = 51;
  currentVolume = 0.04;
  waveform = 'sawtooth';
  // wSwitch.innerText = 'Square';
  // stop();
  // updateChannels();
  // updateVolume();
  // playBtn.innerText = 'Play';
  presetChosen('Square');
})

//waveform switch

wSwitch.addEventListener('click', ()=> {
  stop();
  playBtn.innerText = 'Play';
  switch (wSwitch.innerText) {
    case 'Sine':
      wSwitch.innerText = 'Square';
      waveform = 'square'
      console.log(waveform);
      break;

    case 'Square':
      wSwitch.innerText = 'Triangle';
      waveform = 'triangle'
      console.log(waveform);
      break;

    case 'Triangle':
      wSwitch.innerText = 'Sawtooth';
      waveform = 'sawtooth'
      console.log(waveform);
      break;

    case 'Sawtooth':
      wSwitch.innerText = 'Sine';
      waveform = 'sine'
      console.log(waveform);
      break;
  } 
 
})

//ufo xd
//237hz
//227hz
//triangle

//buzz
//49hz
// 42hz
//square

//sources of KNOWLEDGE :P
//https://www.frontiersin.org/articles/10.3389/fnins.2017.00365/full