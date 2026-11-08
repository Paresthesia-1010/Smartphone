
(function () {
  'use strict';

  console.log('[Smartphone UI] sub/smartphone/ui.js loaded.');

  
  function getLocalImagePath(fileName) {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
        return chrome.runtime.getURL(`sub/smartphone/${fileName}`);
      }
    } catch (e) {}

    const extId = document.querySelector('meta[name="extension-id"]')?.content;
    if (extId) {
      return `chrome-extension:    }

    return `sub/smartphone/${fileName}`;
  }

  const ASSETS = {
    kakaotalk: getLocalImagePath('kakaotalk.png'),
    instagram: getLocalImagePath('instagram.png'),
    settings: getLocalImagePath('settings.png'),
    phone: getLocalImagePath('phone.png'),
    message: getLocalImagePath('message.png'),
    safari: getLocalImagePath('safari.png')
  };

  
  const STYLE_ID = 'neo-smartphone-ui-style';
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    
    #neo-phone-trigger-bar {
      position: fixed;
      right: 30px;
      bottom: 14px;
      width: 60px;
      height: 5px;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 3px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 6px rgba(255, 255, 255, 0.3);
      cursor: pointer;
      z-index: 9998;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
    }

    #neo-phone-trigger-bar:hover {
      background: #ffffff;
      transform: scale(1.15) translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7), 0 0 12px rgba(255, 255, 255, 0.6);
    }

    #neo-phone-trigger-bar.hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
    }

    
    #neo-phone-container {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 260px;
      height: 530px;
      background: #000000;
      border-radius: 44px;
      box-shadow: 
        0 0 0 3px #262626,
        0 0 0 4px #0d0d0d,
        0 24px 60px rgba(0, 0, 0, 0.85),
        0 10px 20px rgba(0, 0, 0, 0.6);
      z-index: 9999;
      overflow: visible;
      user-select: none;
      display: flex;
      flex-direction: column;
      border: 7px solid #050505;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
      
      
      transform: translateY(calc(100% + 40px));
      opacity: 0;
      pointer-events: none;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    }

    
    #neo-phone-container.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    
    .neo-phone-screen {
      position: relative;
      flex: 1;
      width: 100%;
      height: 100%;
      border-radius: 36px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: 
        radial-gradient(circle at 10% 20%, rgba(255, 99, 71, 0.85) 0%, transparent 40%),
        radial-gradient(circle at 80% 40%, rgba(255, 140, 0, 0.8) 0%, transparent 50%),
        radial-gradient(circle at 50% 65%, rgba(186, 85, 211, 0.9) 0%, transparent 45%),
        radial-gradient(circle at 20% 85%, rgba(0, 191, 255, 0.9) 0%, transparent 50%),
        linear-gradient(160deg, #1f0b38 0%, #290826 30%, #4a154b 60%, #0c3547 100%);
      padding: 6px 14px 8px 14px;
      box-sizing: border-box;
    }

    
    .neo-phone-top-dismiss-area {
      cursor: pointer;
      padding-top: 4px;
      padding-bottom: 2px;
      border-radius: 20px 20px 0 0;
      transition: opacity 0.15s ease;
    }

    .neo-phone-top-dismiss-area:hover {
      opacity: 0.8;
    }

    
    .neo-phone-status-bar {
      position: relative;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: -0.2px;
      z-index: 10;
      padding: 0 4px;
      pointer-events: none; 
    }

    .neo-phone-dynamic-island {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      width: 68px;
      height: 18px;
      background: #000000;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      box-sizing: border-box;
    }

    .neo-phone-camera-lens {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #11142b;
      box-shadow: inset 0 0 1px #223366;
      margin-left: auto;
    }

    .neo-phone-status-right {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    
    #neo-phone-cellular {
      display: flex;
      align-items: flex-end;
      gap: 1.5px;
      height: 10px;
    }
    .neo-cell-bar {
      width: 2.5px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 0.5px;
      transition: background 0.2s ease;
    }
    .neo-cell-bar.active { background: #ffffff; }
    .neo-cell-bar:nth-child(1) { height: 3px; }
    .neo-cell-bar:nth-child(2) { height: 5px; }
    .neo-cell-bar:nth-child(3) { height: 7px; }
    .neo-cell-bar:nth-child(4) { height: 10px; }

    
    #neo-phone-wifi {
      display: flex;
      align-items: center;
    }
    #neo-phone-wifi svg {
      width: 12px;
      height: 12px;
      fill: currentColor;
    }

    
    #neo-phone-battery-wrapper {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .neo-battery-shell {
      position: relative;
      width: 17px;
      height: 9px;
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: 2.5px;
      padding: 1px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }
    .neo-battery-shell::after {
      content: '';
      position: absolute;
      right: -2.5px;
      width: 1.5px;
      height: 3.5px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 0 1px 1px 0;
    }
    .neo-battery-level-bar {
      height: 100%;
      width: 100%;
      background: #ffffff;
      border-radius: 1px;
      transition: width 0.3s ease, background 0.3s ease;
    }
    .neo-battery-charging-bolt {
      display: none;
      width: 8px;
      height: 8px;
      fill: #facc15;
      margin-right: -1px;
    }
    .neo-battery-charging-bolt.active {
      display: block;
    }

    
    .neo-phone-app-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px 6px;
      margin-top: 14px;
      z-index: 5;
    }

    .neo-phone-app-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: transform 0.15s ease;
    }

    .neo-phone-app-item:hover {
      transform: scale(1.06);
    }

    .neo-phone-app-item:active {
      transform: scale(0.92);
    }

    .neo-phone-app-icon {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
      background: transparent;
    }

    .neo-phone-app-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 11px;
      pointer-events: none;
    }

    
    .neo-phone-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ff3b30;
      color: #ffffff;
      font-size: 9.5px;
      font-weight: 700;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 10px;
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      z-index: 10;
      pointer-events: none;
      line-height: 1;
      animation: badgePop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .neo-phone-badge.visible {
      display: flex;
    }

    @keyframes badgePop {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .neo-phone-app-label {
      font-size: 9.5px;
      font-weight: 500;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
      text-align: center;
      white-space: nowrap;
    }

    
    .neo-phone-dock-wrapper {
      margin-top: auto;
      padding-bottom: 2px;
      z-index: 5;
    }

    .neo-phone-dock {
      background: rgba(255, 255, 255, 0.28);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 7px 12px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    }

    
    .neo-phone-home-indicator {
      width: 80px;
      height: 3px;
      background: #ffffff;
      border-radius: 2px;
      margin: 6px auto 0 auto;
      opacity: 0.8;
    }
  `;

  
  let isClockAuto = true;
  let appClickListeners = [];

  function openPhone() {
    const container = document.getElementById('neo-phone-container');
    const triggerBar = document.getElementById('neo-phone-trigger-bar');
    if (container) container.classList.add('open');
    if (triggerBar) triggerBar.classList.add('hidden');
  }

  function closePhone() {
    const container = document.getElementById('neo-phone-container');
    const triggerBar = document.getElementById('neo-phone-trigger-bar');
    if (container) container.classList.remove('open');
    if (triggerBar) triggerBar.classList.remove('hidden');
  }

  function togglePhone() {
    const container = document.getElementById('neo-phone-container');
    if (container && container.classList.contains('open')) {
      closePhone();
    } else {
      openPhone();
    }
  }

  function injectSmartphoneUI() {
        const oldContainer = document.getElementById('neo-phone-container');
    if (oldContainer) oldContainer.remove();
    const oldBar = document.getElementById('neo-phone-trigger-bar');
    if (oldBar) oldBar.remove();

        const triggerBar = document.createElement('div');
    triggerBar.id = 'neo-phone-trigger-bar';
    triggerBar.title = '휴대폰 열기';
    triggerBar.addEventListener('click', (e) => {
      e.stopPropagation();
      openPhone();
    });
    document.body.appendChild(triggerBar);

        const container = document.createElement('div');
    container.id = 'neo-phone-container';
    container.innerHTML = `
      <div class="neo-phone-screen">
        <!-- 1. 최상단 영역 (클릭 시 닫기) -->
        <div class="neo-phone-top-dismiss-area" id="neo-phone-dismiss-area" title="클릭하여 휴대폰 접기">
          <div class="neo-phone-status-bar">
            <span id="neo-phone-clock">10:00</span>
            
            <div class="neo-phone-dynamic-island">
              <div class="neo-phone-camera-lens"></div>
            </div>

            <div class="neo-phone-status-right">
              <div id="neo-phone-cellular" title="신호 강도">
                <div class="neo-cell-bar active"></div>
                <div class="neo-cell-bar active"></div>
                <div class="neo-cell-bar active"></div>
                <div class="neo-cell-bar active"></div>
              </div>

              <div id="neo-phone-wifi" title="Wi-Fi">
                <svg viewBox="0 0 16 16">
                  <path d="M8 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-4.2-3a6 6 0 0 1 8.4 0 .75.75 0 0 1-1.06 1.06 4.5 4.5 0 0 0-6.28 0 .75.75 0 1 1-1.06-1.06zm-2.8-3a10 10 0 0 1 14 0 .75.75 0 0 1-1.06 1.06 8.5 8.5 0 0 0-11.88 0 .75.75 0 1 1-1.06-1.06z"/>
                </svg>
              </div>

              <div id="neo-phone-battery-wrapper" title="배터리">
                <svg class="neo-battery-charging-bolt" id="neo-battery-bolt" viewBox="0 0 24 24">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <div class="neo-battery-shell">
                  <div class="neo-battery-level-bar" id="neo-battery-fill" style="width: 100%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. 홈 화면 앱 그리드 -->
        <div class="neo-phone-app-grid">
          <!-- 카카오톡 -->
          <div class="neo-phone-app-item" data-app-id="kakaotalk">
            <div class="neo-phone-app-icon">
              <span class="neo-phone-badge" data-badge-for="kakaotalk"></span>
              <img src="${ASSETS.kakaotalk}" alt="카카오톡">
            </div>
            <span class="neo-phone-app-label">카카오톡</span>
          </div>

          <!-- 인스타그램 -->
          <div class="neo-phone-app-item" data-app-id="instagram">
            <div class="neo-phone-app-icon">
              <span class="neo-phone-badge" data-badge-for="instagram"></span>
              <img src="${ASSETS.instagram}" alt="Instagram">
            </div>
            <span class="neo-phone-app-label">Instagram</span>
          </div>

          <!-- 설정 -->
          <div class="neo-phone-app-item" data-app-id="settings">
            <div class="neo-phone-app-icon">
              <span class="neo-phone-badge" data-badge-for="settings"></span>
              <img src="${ASSETS.settings}" alt="설정">
            </div>
            <span class="neo-phone-app-label">설정</span>
          </div>
        </div>

        <!-- 3. 하단 독(Dock) 영역 -->
        <div class="neo-phone-dock-wrapper">
          <div class="neo-phone-dock">
            <!-- 전화 -->
            <div class="neo-phone-app-item" data-app-id="phone">
              <div class="neo-phone-app-icon">
                <span class="neo-phone-badge" data-badge-for="phone"></span>
                <img src="${ASSETS.phone}" alt="전화">
              </div>
            </div>

            <!-- 사파리 -->
            <div class="neo-phone-app-item" data-app-id="safari">
              <div class="neo-phone-app-icon">
                <span class="neo-phone-badge" data-badge-for="safari"></span>
                <img src="${ASSETS.safari}" alt="Safari">
              </div>
            </div>

            <!-- 메시지 -->
            <div class="neo-phone-app-item" data-app-id="message">
              <div class="neo-phone-app-icon">
                <span class="neo-phone-badge" data-badge-for="message"></span>
                <img src="${ASSETS.message}" alt="메시지">
              </div>
            </div>
          </div>

          <!-- 홈 바 -->
          <div class="neo-phone-home-indicator"></div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

        const dismissArea = container.querySelector('#neo-phone-dismiss-area');
    if (dismissArea) {
      dismissArea.addEventListener('click', (e) => {
        e.stopPropagation();
        closePhone();
      });
    }

        container.querySelectorAll('.neo-phone-app-icon img').forEach((img) => {
      img.addEventListener('error', () => {
        console.error('[Smartphone UI] 이미지 로드 실패 URL:', img.src);
      });
    });

        container.querySelectorAll('.neo-phone-app-item[data-app-id]').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const appId = item.dataset.appId;
        
        appClickListeners.forEach((callback) => {
          try {
            callback(appId, item);
          } catch (err) {
            console.error('[Smartphone UI] appClick listener error:', err);
          }
        });

        window.dispatchEvent(new CustomEvent('neo-phone-app-click', {
          detail: { appId, element: item }
        }));
      });
    });

    updateCurrentTime();
  }

  
  function updateCurrentTime() {
    if (!isClockAuto) return;
    const clockEl = document.getElementById('neo-phone-clock');
    if (clockEl) {
      const d = new Date();
      clockEl.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
  }

  setInterval(updateCurrentTime, 1000);

  
  window.NeoPhone = {
        open: openPhone,
    close: closePhone,
    toggle: togglePhone,

        onAppClick: function (callback) {
      if (typeof callback === 'function') {
        appClickListeners.push(callback);
      }
    },

        badge: {
      set: function (appId, count) {
        const badgeEl = document.querySelector(`.neo-phone-badge[data-badge-for="${appId}"]`);
        if (badgeEl) {
          if (count === 0 || count === null || count === false) {
            badgeEl.textContent = '';
            badgeEl.classList.remove('visible');
          } else {
            badgeEl.textContent = String(count);
            badgeEl.classList.add('visible');
          }
        }
      },
      clear: function (appId) {
        this.set(appId, null);
      },
      clearAll: function () {
        document.querySelectorAll('.neo-phone-badge').forEach((el) => {
          el.textContent = '';
          el.classList.remove('visible');
        });
      }
    },

        statusBar: {
      setTime: function (timeStr) {
        isClockAuto = false;
        const clockEl = document.getElementById('neo-phone-clock');
        if (clockEl) clockEl.textContent = timeStr;
      },
      resetTime: function () {
        isClockAuto = true;
        updateCurrentTime();
      },
      setCellular: function ({ visible = true, bars = 4 } = {}) {
        const cellContainer = document.getElementById('neo-phone-cellular');
        if (!cellContainer) return;
        cellContainer.style.display = visible ? 'flex' : 'none';
        const barEls = cellContainer.querySelectorAll('.neo-cell-bar');
        barEls.forEach((bar, index) => {
          bar.classList.toggle('active', index < bars);
        });
      },
      setWifi: function ({ visible = true } = {}) {
        const wifiEl = document.getElementById('neo-phone-wifi');
        if (wifiEl) wifiEl.style.display = visible ? 'flex' : 'none';
      },
      setBattery: function ({ level = 100, charging = false, visible = true } = {}) {
        const wrapper = document.getElementById('neo-phone-battery-wrapper');
        const fill = document.getElementById('neo-battery-fill');
        const bolt = document.getElementById('neo-battery-bolt');

        if (!wrapper || !fill || !bolt) return;
        wrapper.style.display = visible ? 'flex' : 'none';

        const clampedLevel = Math.max(0, Math.min(100, level));
        fill.style.width = `${clampedLevel}%`;
        fill.style.background = clampedLevel <= 20 ? '#ef4444' : '#ffffff';
        bolt.classList.toggle('active', !!charging);
      }
    },

        elements: {
      getContainer: () => document.getElementById('neo-phone-container'),
      getTriggerBar: () => document.getElementById('neo-phone-trigger-bar'),
      getAppItem: (appId) => document.querySelector(`.neo-phone-app-item[data-app-id="${appId}"]`)
    }
  };

    injectSmartphoneUI();
})();