import { setLocaleFromPlatform } from '../i18n/index.js';

let sdkPromise = null;
let sdkInitPromise = null;
let sdk = null;
let playerPromise = null;
let lastCloudData = null;

function loadSDK() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    if (window.YaGames) return resolve(window.YaGames);
    const script = document.createElement('script'); script.src = '/sdk.js'; script.async = true; script.onload = () => resolve(window.YaGames ?? null); script.onerror = () => resolve(null); document.head.appendChild(script);
  });
  return sdkPromise;
}
export async function initYandexSDK() { if (sdk) return sdk; if (sdkInitPromise) return sdkInitPromise; sdkInitPromise = (async () => { const YaGames = await loadSDK(); if (!YaGames?.init) return null; try { sdk = await YaGames.init(); applyPlatformLocale(sdk); setupPlatformEvents(sdk); return sdk; } catch (error) { console.warn('[Yandex SDK] init failed:', error); sdkInitPromise = null; return null; } })(); return sdkInitPromise; }
function applyPlatformLocale(ysdk) { const lang = ysdk?.environment?.i18n?.lang; if (lang) setLocaleFromPlatform(lang); }
export async function markGameReady() { const ysdk = sdk ?? await initYandexSDK(); ysdk?.features?.LoadingAPI?.ready?.(); }
async function getPlayer() { if (playerPromise) return playerPromise; const ysdk = sdk ?? await initYandexSDK(); if (!ysdk?.getPlayer) return null; playerPromise = ysdk.getPlayer().catch(error => { console.warn('[Yandex SDK] player init failed:', error); playerPromise = null; return null; }); return playerPromise; }
function serializeData(data) { try { return JSON.stringify(data); } catch { return null; } }
export async function loadCloudSave() { const player = await getPlayer(); if (!player) return null; try { const data = await player.getData(['library-game']); const saved = data?.['library-game'] ?? null; lastCloudData = serializeData(saved); return saved; } catch (error) { console.warn('[Yandex SDK] cloud load failed:', error); return null; } }
export async function saveCloud(data, flush = true) { const serialized = serializeData(data); if (serialized !== null && serialized === lastCloudData) return true; const player = await getPlayer(); if (!player) return false; try { await player.setData({ 'library-game': data }, flush); lastCloudData = serialized; return true; } catch (error) { console.warn('[Yandex SDK] cloud save failed:', error); return false; } }
export function resetYandexPlayer() { playerPromise = null; lastCloudData = null; }
function setupPlatformEvents(ysdk) { ysdk.on?.('game_api_pause', () => window.dispatchEvent(new Event('yandex-game-pause'))); ysdk.on?.('game_api_resume', () => window.dispatchEvent(new Event('yandex-game-resume'))); ysdk.on?.('account_selection_dialog_opened', () => resetYandexPlayer()); ysdk.on?.('account_selection_dialog_closed', () => resetYandexPlayer()); }
export function showFullscreenAd() { const ysdk = sdk; if (!ysdk?.adv?.showFullscreenAdv) return Promise.resolve(false); return new Promise((resolve) => { let settled = false; const finish = shown => { if (settled) return; settled = true; resolve(Boolean(shown)); }; try { ysdk.adv.showFullscreenAdv({ callbacks: { onOpen: () => window.dispatchEvent(new Event('yandex-ad-open')), onClose: finish, onError: error => { console.warn('[Yandex SDK] fullscreen ad failed:', error); finish(false); } } }); } catch (error) { console.warn('[Yandex SDK] fullscreen ad failed:', error); finish(false); } }); }
export async function showRewardedAd() {
  const ysdk = sdk ?? await initYandexSDK();
  if (!ysdk?.adv?.showRewardedVideo) return false;
  return new Promise(resolve => {
    let rewarded = false; let settled = false;
    const finish = value => { if (settled) return; settled = true; resolve(value); };
    try {
      ysdk.adv.showRewardedVideo({ callbacks: {
        onOpen: () => window.dispatchEvent(new Event('yandex-ad-open')),
        onRewarded: () => { rewarded = true; },
        onClose: () => finish(rewarded),
        onError: error => { console.warn('[Yandex SDK] rewarded ad failed:', error); finish(false); },
      } });
    } catch (error) { console.warn('[Yandex SDK] rewarded ad failed:', error); finish(false); }
  });
}
export function getYandexSDK() { return sdk; }
