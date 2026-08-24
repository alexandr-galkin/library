let sdkPromise = null;
let sdk = null;

function loadSDK() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    if (window.YaGames) return resolve(window.YaGames);
    const script = document.createElement('script');
    script.src = '/sdk.js';
    script.async = true;
    script.onload = () => resolve(window.YaGames ?? null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export async function initYandexSDK() {
  const YaGames = await loadSDK();
  if (!YaGames?.init) return null;
  try {
    sdk = await YaGames.init();
    setupPlatformEvents(sdk);
    return sdk;
  } catch (error) {
    console.warn('[Yandex SDK] init failed:', error);
    return null;
  }
}

export async function markGameReady() {
  const ysdk = sdk ?? await initYandexSDK();
  ysdk?.features?.LoadingAPI?.ready?.();
}

function setupPlatformEvents(ysdk) {
  ysdk.on?.('game_api_pause', () => window.dispatchEvent(new Event('yandex-game-pause')));
  ysdk.on?.('game_api_resume', () => window.dispatchEvent(new Event('yandex-game-resume')));
}

export async function showFullscreenAd() {
  const ysdk = sdk ?? await initYandexSDK();
  if (!ysdk?.adv?.showFullscreenAdv) return false;
  return new Promise((resolve) => {
    let settled = false;
    const finish = (wasShown) => {
      if (settled) return;
      settled = true;
      resolve(Boolean(wasShown));
    };
    try {
      ysdk.adv.showFullscreenAdv({
        callbacks: {
          onOpen: () => window.dispatchEvent(new Event('yandex-ad-open')),
          onClose: finish,
          onError: (error) => {
            console.warn('[Yandex SDK] fullscreen ad failed:', error);
            finish(false);
          },
        },
      });
    } catch (error) {
      console.warn('[Yandex SDK] fullscreen ad failed:', error);
      finish(false);
    }
  });
}

export function getYandexSDK() {
  return sdk;
}
