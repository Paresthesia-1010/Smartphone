
(function () {
  'use strict';

  console.log('[Smartphone Sound & Notification] sound.js (Instagram App.mp3 Enabled) loaded.');

  
  let audioContextUnlocked = false;

  function unlockAudioEngine() {
    if (audioContextUnlocked) return;
    audioContextUnlocked = true;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume().then(() => ctx.close());
      }
    } catch (e) {}

    document.removeEventListener('pointerdown', unlockAudioEngine);
    document.removeEventListener('keydown', unlockAudioEngine);
  }

  document.addEventListener('pointerdown', unlockAudioEngine, { capture: true });
  document.addEventListener('keydown', unlockAudioEngine, { capture: true });

  function getCandidateUrls(fileName) {
    const nameWithExt = fileName.endsWith('.mp3') ? fileName : `${fileName}.mp3`;
    const paths = [
      `sub/smartphone/sounds/iphone/${nameWithExt}`,
      `smartphone/sounds/iphone/${nameWithExt}`,
      `sounds/iphone/${nameWithExt}`
    ];

    const urls = [];
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
      paths.forEach(p => urls.push(chrome.runtime.getURL(p)));
    }

    const extId = document.querySelector('meta[name="extension-id"]')?.content;
    if (extId) {
      paths.forEach(p => urls.push(`chrome-extension://${extId}/${p}`));
    }

    paths.forEach(p => urls.push(p));
    return [...new Set(urls)];
  }

  function playSoundWithFallback(candidates, volume = 0.8, index = 0) {
    if (index >= candidates.length) {
      return;
    }

    const url = candidates[index];
    const audio = new Audio(url);
    audio.volume = volume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        playSoundWithFallback(candidates, volume, index + 1);
      });
    }
  }

  function playSound(name, volume = 0.8) {
    const candidates = getCandidateUrls(name);
    playSoundWithFallback(candidates, volume, 0);
  }

  window.NeoSound = {
    play: playSound,
    test: function (name = 'App') {
      const candidates = getCandidateUrls(name);
      playSound(name, 1.0);
    }
  };

  
  document.addEventListener('keydown', (e) => {
    const target = e.target;
    if (!target) return;

    const isInsidePhone = target.closest && target.closest('#neo-phone-container');
    if (!isInsidePhone) return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      playSound('delete', 0.6);
    } else if (
      !e.ctrlKey && !e.metaKey && !e.altKey &&
      !['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
      playSound('type', 0.45);
    }
  }, true);

  
  const STYLE_ID = 'neo-notification-banner-style';
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    #neo-top-banner-stack {
      position: fixed;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 410px;
      z-index: 100000;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", Roboto, sans-serif;
    }

    .neo-top-banner-card {
      width: 100%;
      background: rgba(28, 28, 30, 0.94);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 20px;
      padding: 12px 14px;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.35);
      display: flex;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      user-select: none;
      pointer-events: auto;
      box-sizing: border-box;
      animation: bannerSlideIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), 
                  opacity 0.28s ease, 
                  max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  margin-top 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      max-height: 220px;
      overflow: hidden;
    }

    .neo-top-banner-card:active {
      transform: scale(0.98);
    }

    @keyframes bannerSlideIn {
      0% {
        opacity: 0;
        transform: translateY(-24px) scale(0.92);
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        max-height: 220px;
        padding-top: 12px;
        padding-bottom: 12px;
      }
    }

    .neo-top-banner-card.removing {
      opacity: 0 !important;
      transform: translateY(-20px) scale(0.9) !important;
      max-height: 0 !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      margin-bottom: -8px !important;
      pointer-events: none !important;
    }

    .neo-top-banner-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .neo-top-banner-left {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .neo-top-banner-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .neo-top-banner-app-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #a1a1aa;
      letter-spacing: -0.2px;
    }

    .neo-top-banner-time {
      font-size: 11px;
      color: #71717a;
    }

    .neo-top-banner-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .neo-top-banner-sender {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
    }

    .neo-top-banner-msg {
      font-size: 12.5px;
      color: #e4e4e7;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 60px;
      overflow: hidden;
    }

    
    .neo-top-banner-card.instagram-banner {
      background: rgba(18, 18, 20, 0.94) !important;
      border: 1px solid rgba(225, 48, 108, 0.4) !important;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(225, 48, 108, 0.22) !important;
    }

    .neo-top-banner-card.instagram-banner .neo-top-banner-app-title {
      background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
      letter-spacing: -0.1px;
    }

    
    .neo-top-banner-card.eas-emergency {
      background: rgba(42, 10, 10, 0.95) !important;
      border: 1.5px solid #ef4444 !important;
      box-shadow: 0 0 25px rgba(239, 68, 68, 0.45), 0 16px 36px rgba(0, 0, 0, 0.8) !important;
    }

    
    .neo-top-banner-card.eas-safety {
      background: rgba(42, 26, 10, 0.95) !important;
      border: 1.5px solid #f59e0b !important;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.4), 0 16px 36px rgba(0, 0, 0, 0.8) !important;
    }

    .eas-progress-bar-wrap {
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
      overflow: hidden;
      margin-top: 4px;
    }

    .eas-progress-bar-fill {
      height: 100%;
      width: 100%;
      background: #ffffff;
      animation: easCountdown 12s linear forwards;
    }

    @keyframes easCountdown {
      from { width: 100%; }
      to { width: 0%; }
    }
  `;

  
  let stackContainer = null;

  function ensureStackContainer() {
    if (stackContainer) return;
    stackContainer = document.getElementById('neo-top-banner-stack');
    if (!stackContainer) {
      stackContainer = document.createElement('div');
      stackContainer.id = 'neo-top-banner-stack';
      document.body.appendChild(stackContainer);
    }
  }

  function dismissCard(card) {
    if (!card || card.classList.contains('removing')) return;
    card.classList.add('removing');
    setTimeout(() => {
      if (card.parentNode) card.remove();
    }, 350);
  }

  function pushNotificationToStack({ appType, title, sender, content, duration = 4500, onClick, easType }) {
    ensureStackContainer();

    const isEAS = appType === 'eas';
    let cardClass = '';
    let iconHTML = '💬';

    if (appType === 'kakaotalk') {
      iconHTML = '🟡';
    } else if (appType === 'message') {
      iconHTML = '💬';
    } else if (appType === 'instagram') {
      cardClass = 'instagram-banner';
      iconHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#neo-ig-banner-grad)"/>
          <circle cx="12" cy="12" r="4.3" stroke="#ffffff" stroke-width="1.8"/>
          <circle cx="17.4" cy="6.6" r="1.1" fill="#ffffff"/>
          <defs>
            <linearGradient id="neo-ig-banner-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
              <stop stop-color="#f09433"/>
              <stop offset="0.25" stop-color="#e6683c"/>
              <stop offset="0.5" stop-color="#dc2743"/>
              <stop offset="0.75" stop-color="#cc2366"/>
              <stop offset="1" stop-color="#bc1888"/>
            </linearGradient>
          </defs>
        </svg>
      `;
    } else if (isEAS) {
      const isEmergency = String(easType).includes('긴급');
      cardClass = isEmergency ? 'eas-emergency' : 'eas-safety';
      iconHTML = isEmergency ? '🚨' : '⚠️';
    }

    const card = document.createElement('div');
    card.className = `neo-top-banner-card ${cardClass}`;
    card.innerHTML = `
      <div class="neo-top-banner-header">
        <div class="neo-top-banner-left">
          <span class="neo-top-banner-icon">${iconHTML}</span>
          <span class="neo-top-banner-app-title">${title}</span>
        </div>
        <span class="neo-top-banner-time">지금</span>
      </div>

      <div class="neo-top-banner-body">
        <div class="neo-top-banner-sender">${sender}</div>
        <div class="neo-top-banner-msg">${content}</div>
      </div>

      ${isEAS ? `
        <div class="eas-progress-bar-wrap">
          <div class="eas-progress-bar-fill"></div>
        </div>
      ` : ''}
    `;

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissCard(card);
      if (typeof onClick === 'function') onClick();
    });

    stackContainer.prepend(card);

    if (stackContainer.children.length > 4) {
      const oldest = stackContainer.lastElementChild;
      if (oldest) dismissCard(oldest);
    }

    setTimeout(() => {
      dismissCard(card);
    }, duration);
  }

  
  window.NeoNotification = {
    
    showKakao: function ({ name, text }) {
      playSound('kakaotalk', 0.85);
      pushNotificationToStack({
        appType: 'kakaotalk',
        title: '카카오톡',
        sender: name,
        content: text,
        duration: 4500,
        onClick: () => {
          if (window.NeoPhone?.open) window.NeoPhone.open();
          if (window.NeoKakao?.open) window.NeoKakao.open();
        }
      });
    },

    
    showMessage: function ({ name, text }) {
      playSound('message', 0.85);
      pushNotificationToStack({
        appType: 'message',
        title: '메시지',
        sender: name,
        content: text,
        duration: 4500,
        onClick: () => {
          if (window.NeoPhone?.open) window.NeoPhone.open();
          if (window.NeoMessage?.open) window.NeoMessage.open();
        }
      });
    },

    
    showInstagram: function ({ name, text, onClick }) {
      playSound('App', 0.85);
      pushNotificationToStack({
        appType: 'instagram',
        title: 'Instagram',
        sender: name,
        content: text,
        duration: 4500,
        onClick: () => {
          if (typeof onClick === 'function') {
            onClick();
          } else {
            if (window.NeoPhone?.open) window.NeoPhone.open();
            if (window.NeoIG?.Main?.open) window.NeoIG.Main.open();
          }
        }
      });
    },

    
    showEAS: function ({ type, group, content }) {
      const isEmergency = String(type).includes('긴급');
      const badgeText = isEmergency ? '긴급 재난 문자' : '안전 안내 문자';

      if (isEmergency) {
        playSound('eas', 0.95);
      }

      pushNotificationToStack({
        appType: 'eas',
        easType: type,
        title: badgeText,
        sender: `[${badgeText}] ${group || '행정안전부'}`,
        content: content,
        duration: 12000,
        onClick: () => {}
      });
    }
  };

  ensureStackContainer();
})();