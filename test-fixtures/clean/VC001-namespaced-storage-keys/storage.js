// Browser game save slots. Each constant names a localStorage key; the
// values are identifiers, not credentials.
const AD_KEY = 'kartrush2.adNext';      // epoch ms at which the next ad unlocks
const PACE_KEY = 'kartrush2.pace.';     // prefix; a track id is appended
const CUSTOM_KEY = 'kartrush2.customTrack';
const SETTINGS_KEY = 'myapp:settings';
const CACHE_KEY = 'shop/cart/v2';

export function loadPace(trackId) {
  return Number(localStorage.getItem(PACE_KEY + trackId)) || 1;
}

export function saveCustom(track) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(track));
  localStorage.setItem(SETTINGS_KEY, '{}');
  localStorage.setItem(CACHE_KEY, '[]');
  localStorage.setItem(AD_KEY, String(Date.now()));
}
