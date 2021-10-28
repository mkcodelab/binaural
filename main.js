const playBtn = document.querySelector('.btn');
let isPlaying = false;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let freqR = 99;
let freqL = 97;
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

let waveformL = 'sine';
let waveformR = 'sine';

merger.connect(masterGain);
masterGain.connect(audioCtx.destination);

// we have to assign audioCtx.createOscillator to  oscR, oscL before function, because it otherwise doing error...

function start() {

  let osc2 = audioCtx.createOscillator();
  osc2.type = waveformL;
  osc2.frequency.value = freqL;
  //connecting to the left channel
  osc2.connect(merger, 0, 1);

  let osc1 = audioCtx.createOscillator();
  osc1.type = waveformR;
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

leftLabel.innerText = `Left Channel: ${freqL} Hz`
rightLabel.innerText = `Right Channel: ${freqR} Hz`;


volumeRange.value = 0.4;
leftChannel.value = freqL;
rightChannel.value = freqR;
// volume change
volumeRange.addEventListener('input', e => {
  currentVolume = e.target.value;
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


//todo
//change freq range up to 400 hz