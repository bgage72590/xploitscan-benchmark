// Entry module of a browser game. No server: it runs in the page.
import { startRace, nextLap } from './race.js';

const AD_KEY = 'game.adNext';
let nextUnlock = Number(localStorage.getItem(AD_KEY)) || 0;

function onNextButton() {
  nextLap();
  nextUnlock = Date.now() + 180000;
  localStorage.setItem(AD_KEY, String(nextUnlock));
}

document.getElementById('next').addEventListener('click', onNextButton);
window.addEventListener('load', () => startRace());
