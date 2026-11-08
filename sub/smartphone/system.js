(function () {
  'use strict';

  console.log('[Smartphone System] sub/smartphone/system.js loaded.');

  const STYLE_ID = 'neo-smartphone-system-style';
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    smartphone_normal,
    ms-chat-turn smartphone_normal,
    EAS,
    ms-chat-turn EAS,
    .neo-phone-hidden-block {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .neo-phone-status-right {
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
    }

    #neo-phone-cellular {
      display: flex !important;
      align-items: flex-end !important;
      gap: 1.5px !important;
      height: 10px !important;
    }

    #neo-phone-5g-badge {
      display: none;
      font-size: 9px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      line-height: 1;
      margin: 0 1px;
    }
    #neo-phone-5g-badge.visible {
      display: inline-block !important;
    }

    #neo-phone-wifi {
      margin: 0 1px;
    }

    #neo-phone-battery-wrapper {
      display: flex !important;
      align-items: center !important;
      margin-left: 1px;
    }

    #neo-battery-bolt {
      display: none !important;
    }

    .neo-battery-shell {
      position: relative !important;
      width: 26px !important;
      height: 11px !important;
      border: 1.2px solid rgba(255, 255, 255, 0.85) !important;
      border-radius: 3.5px !important;
      padding: 1px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      display: flex !important;
      align-items: center !important;
    }

    .neo-battery-shell::after {
      content: '' !important;
      position: absolute !important;
      right: -2.5px !important;
      top: 2.2px !important;
      width: 1.5px !important;
      height: 4.5px !important;
      background: rgba(255, 255, 255, 0.85) !important;
      border-radius: 0 1px 1px 0 !important;
    }

    .neo-battery-level-bar {
      height: 100% !important;
      border-radius: 1.5px !important;
      transition: width 0.3s ease, background 0.3s ease !important;
    }

    .neo-battery-inner-content {
      position: absolute !important;
      inset: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 1px !important;
      font-size: 7.5px !important;
      font-weight: 800 !important;
      line-height: 1 !important;
      color: #ffffff !important;
      mix-blend-mode: difference !important;
      z-index: 5 !important;
      pointer-events: none !important;
      letter-spacing: -0.3px !important;
      transform: translateY(-0.2px);
    }

    .neo-battery-shell.is-charging .neo-battery-inner-content {
      mix-blend-mode: normal !important;
      color: #ffffff !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
    }

    .neo-battery-inner-bolt {
      display: none;
      width: 6px;
      height: 7px;
      fill: currentColor;
    }
    .neo-battery-inner-bolt.active {
      display: inline-block !important;
    }

    #neo-phone-dead-screen {
      position: absolute;
      inset: 0;
      background: #000000;
      z-index: 50;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 32px;
      animation: fadeInDead 0.3s ease forwards;
    }

    #neo-phone-dead-screen.visible {
      display: flex !important;
    }

    @keyframes fadeInDead {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dead-battery-frame {
      position: relative;
      width: 86px;
      height: 40px;
      border: 3.5px solid #ffffff;
      border-radius: 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 4px;
    }

    .dead-battery-frame::after {
      content: '';
      position: absolute;
      right: -8px;
      top: 10px;
      width: 5px;
      height: 14px;
      background: #ffffff;
      border-radius: 0 3px 3px 0;
    }

    .dead-battery-red-bars {
      display: flex;
      gap: 2px;
      height: 100%;
    }

    .dead-battery-red-bar {
      width: 3.5px;
      height: 100%;
      background: #ef4444;
      border-radius: 1px;
    }

    .dead-cable-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      transition: opacity 0.2s ease;
    }

    .dead-cable-bolt {
      width: 14px;
      height: 18px;
      fill: #ffffff;
    }

    .dead-cable-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .dead-cable-tip {
      width: 18px;
      height: 11px;
      border: 2px solid #ffffff;
      border-radius: 4px 4px 0 0;
      box-sizing: border-box;
    }

    .dead-cable-body {
      width: 22px;
      height: 20px;
      background: #ffffff;
      border-radius: 2px;
    }

    .dead-cable-line {
      width: 4px;
      height: 35px;
      background: #ffffff;
    }
  `;

  const STORAGE_KEY = 'neo_smartphone_status_map';

  function getChatRoomId() {
    const path = window.location.pathname;
    const match = path.match(/prompts\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : 'new_chat';
  }

  function getPhoneStore() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function savePhoneStatus(roomId, data) {
    const store = getPhoneStore();
    store[roomId] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function getRoomPhoneStatus(roomId) {
    return getPhoneStore()[roomId] || null;
  }

  function ensureDeadScreenDOM() {
    const screen = document.querySelector('.neo-phone-screen');
    if (!screen || document.getElementById('neo-phone-dead-screen')) return;

    const deadScreen = document.createElement('div');
    deadScreen.id = 'neo-phone-dead-screen';
    deadScreen.innerHTML = `
      <div class="dead-battery-frame">
        <div class="dead-battery-red-bars">
          <div class="dead-battery-red-bar"></div>
          <div class="dead-battery-red-bar"></div>
          <div class="dead-battery-red-bar"></div>
        </div>
      </div>

      <div class="dead-cable-wrapper" id="neo-dead-cable-group">
        <svg class="dead-cable-bolt" viewBox="0 0 24 24">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>

        <div class="dead-cable-connector" id="neo-dead-cable-plug">
          <div class="dead-cable-tip"></div>
          <div class="dead-cable-body"></div>
          <div class="dead-cable-line"></div>
        </div>
      </div>
    `;

    screen.appendChild(deadScreen);
  }

  
  let lowBtAlertPlayed = false;
  let isCurrentlyCharging = false;

  function applyStatusToPhone(status) {
    if (!status) return;
    ensureDeadScreenDOM();

    
    if (status.hour !== undefined && status.min !== undefined) {
      const h = String(status.hour).padStart(2, '0');
      const m = String(status.min).padStart(2, '0');
      const timeStr = `${h}:${m}`;

      if (window.NeoPhone?.statusBar?.setTime) {
        window.NeoPhone.statusBar.setTime(timeStr);
      } else {
        const clockEl = document.getElementById('neo-phone-clock');
        if (clockEl) clockEl.textContent = timeStr;
      }
    }

    
    let is5G = String(status.cellular) === '1';
    let isWifi = String(status.wifi) === '1';
    if (is5G && isWifi) is5G = false;

    const statusRight = document.querySelector('.neo-phone-status-right');
    const cellIcon = document.getElementById('neo-phone-cellular');
    const wifiIcon = document.getElementById('neo-phone-wifi');
    const battWrap = document.getElementById('neo-phone-battery-wrapper');

    let badge5G = document.getElementById('neo-phone-5g-badge');
    if (!badge5G && statusRight) {
      badge5G = document.createElement('span');
      badge5G.id = 'neo-phone-5g-badge';
      badge5G.textContent = '5G';
    }

    if (statusRight) {
      if (cellIcon) {
        statusRight.appendChild(cellIcon);
        cellIcon.style.display = 'flex';
      }
      if (badge5G) statusRight.appendChild(badge5G);
      if (wifiIcon) statusRight.appendChild(wifiIcon);
      if (battWrap) statusRight.appendChild(battWrap);
    }

    if (badge5G) badge5G.classList.toggle('visible', is5G);
    if (wifiIcon) wifiIcon.style.display = isWifi ? 'flex' : 'none';

    
    if (status.battery !== undefined) {
      const level = Math.max(0, Math.min(100, parseInt(status.battery, 10) || 0));
      const isCharging = String(status.charge) === '1';

      
      
      if (level <= 20) {
        if (!lowBtAlertPlayed) {
          lowBtAlertPlayed = true;
          window.NeoSound?.play('lowbt', 0.85);
        }
      } else {
        lowBtAlertPlayed = false; 
      }

      
      
      if (isCharging) {
        if (!isCurrentlyCharging) {
          isCurrentlyCharging = true;
          window.NeoSound?.play('charge', 0.85);
        }
      } else {
        isCurrentlyCharging = false;
      }

      const shell = document.querySelector('.neo-battery-shell');
      const fill = document.getElementById('neo-battery-fill');
      const deadScreen = document.getElementById('neo-phone-dead-screen');
      const plugGraphic = document.getElementById('neo-dead-cable-plug');

      if (level === 0) {
        if (deadScreen) deadScreen.classList.add('visible');
        if (plugGraphic) plugGraphic.style.display = isCharging ? 'none' : 'flex';
      } else {
        if (deadScreen) deadScreen.classList.remove('visible');
      }

      if (shell && fill) {
        let innerContent = shell.querySelector('.neo-battery-inner-content');
        if (!innerContent) {
          innerContent = document.createElement('div');
          innerContent.className = 'neo-battery-inner-content';
          innerContent.innerHTML = `
            <span class="neo-battery-num"></span>
            <svg class="neo-battery-inner-bolt" viewBox="0 0 24 24">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          `;
          shell.appendChild(innerContent);
        }

        const numEl = innerContent.querySelector('.neo-battery-num');
        const boltEl = innerContent.querySelector('.neo-battery-inner-bolt');

        if (numEl) numEl.textContent = level;
        if (boltEl) boltEl.classList.toggle('active', isCharging);

        fill.style.width = `${level}%`;

        if (isCharging) {
          shell.classList.add('is-charging');
          fill.style.background = '#34c759';
        } else {
          shell.classList.remove('is-charging');
          fill.style.background = level <= 20 ? '#ef4444' : '#ffffff';
        }
      }
    }
  }

  function extractSmartphoneData(plainText) {
    if (!plainText) return null;
    const data = {};

    try {
      const cleanJson = plainText.trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (item && typeof item === 'object') Object.assign(data, item);
        });
      } else if (typeof parsed === 'object') {
        Object.assign(data, parsed);
      }
    } catch (e) {
      
      const hourMatch = plainText.match(/"hour"\s*:\s*"?(\d+)"?/i);
      const minMatch = plainText.match(/"min"\s*:\s*"?(\d+)"?/i);
      const cellMatch = plainText.match(/"cellular"\s*:\s*"?(\w+)"?/i);
      const wifiMatch = plainText.match(/"wifi"\s*:\s*"?(\w+)"?/i);
      const battMatch = plainText.match(/"battery"\s*:\s*"?(\d+)"?/i);
      const chargeMatch = plainText.match(/"charge"\s*:\s*"?(\w+)"?/i);

      if (hourMatch) data.hour = hourMatch[1];
      if (minMatch) data.min = minMatch[1];
      if (cellMatch) data.cellular = cellMatch[1];
      if (wifiMatch) data.wifi = wifiMatch[1];
      if (battMatch) data.battery = battMatch[1];
      if (chargeMatch) data.charge = chargeMatch[1];
    }

    if (Object.keys(data).length === 0) return null;
    return data;
  }

  
  function parseAndTriggerEAS(rawText) {
    if (!rawText) return;
    try {
      let clean = rawText.trim();
      
      clean = clean.replace(/:\s*\}\s*$/i, '}');
      const parsed = JSON.parse(clean);
      if (parsed.type && parsed.content) {
        window.NeoNotification?.showEAS({
          type: parsed.type,
          group: parsed.group || '행정안전부',
          content: parsed.content
        });
        return;
      }
    } catch (e) {
      
      const typeMatch = rawText.match(/"type"\s*:\s*"([^"]+)"/i);
      const groupMatch = rawText.match(/"group"\s*:\s*"([^"]+)"/i);
      const contentMatch = rawText.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*\}|"\s*:\s*\})/i);

      if (typeMatch && contentMatch) {
        window.NeoNotification?.showEAS({
          type: typeMatch[1],
          group: groupMatch ? groupMatch[1] : '행정안전부',
          content: contentMatch[1].replace(/\\n/g, '\n')
        });
      }
    }
  }

  function scanAndProcessTags() {
    const roomId = getChatRoomId();
    const turns = document.querySelectorAll('ms-chat-turn');
    if (!turns.length) return;

    let latestStatus = null;
    const phoneTagRegex = /(?:<smartphone_normal>|&lt;smartphone_normal&gt;)([\s\S]*?)(?:<\/smartphone_normal>|&lt;\/smartphone_normal&gt;)/i;
    const easTagRegex = /(?:<EAS>|&lt;EAS&gt;)([\s\S]*?)(?:<\/EAS>|&lt;\/EAS&gt;)/i;

    turns.forEach((turn) => {
      const turnText = turn.textContent || '';

      
      if (!turn.dataset.easProcessed) {
        const hasEasOpen = turnText.includes('<EAS>') || turnText.includes('&lt;EAS&gt;');
        const hasEasClose = turnText.includes('</EAS>') || turnText.includes('&lt;/EAS&gt;');

        if (hasEasOpen && hasEasClose) {
          const match = turnText.match(easTagRegex);
          if (match && match[1]) {
            parseAndTriggerEAS(match[1]);
            turn.dataset.easProcessed = 'true';

            turn.querySelectorAll('p, pre, ms-code-block, mat-expansion-panel').forEach((block) => {
              if (block.textContent && block.textContent.includes('EAS')) {
                block.classList.add('neo-phone-hidden-block');
                block.style.display = 'none';
              }
            });
          }
        }
      }

      
      if (turn.dataset.phoneProcessed === 'true') return;

      const hasPhoneOpen = turnText.includes('<smartphone_normal>') || turnText.includes('&lt;smartphone_normal&gt;');
      const hasPhoneClose = turnText.includes('</smartphone_normal>') || turnText.includes('&lt;/smartphone_normal&gt;');

      if (!hasPhoneOpen || !hasPhoneClose) return;

      const match = turnText.match(phoneTagRegex);
      if (match && match[1]) {
        const statusData = extractSmartphoneData(match[1]);
        if (statusData) {
          latestStatus = statusData;
        }

        turn.dataset.phoneProcessed = 'true';

        turn.querySelectorAll('p, pre, ms-code-block, mat-expansion-panel').forEach((block) => {
          if (block.textContent && block.textContent.includes('smartphone_normal')) {
            block.classList.add('neo-phone-hidden-block');
            block.style.display = 'none';
          }
        });
      }
    });

    if (latestStatus) {
      savePhoneStatus(roomId, latestStatus);
      applyStatusToPhone(latestStatus);
    }
  }

  let lastRoomId = null;
  let isThrottled = false;

  function handleRoomChange() {
    const currentRoom = getChatRoomId();
    if (currentRoom !== lastRoomId) {
      lastRoomId = currentRoom;
      const savedStatus = getRoomPhoneStatus(currentRoom);
      if (savedStatus) {
        applyStatusToPhone(savedStatus);
      }
    }
  }

  function safeScanExecution() {
    if (isThrottled) return;
    isThrottled = true;

    requestAnimationFrame(() => {
      isThrottled = false;
      phoneObserver.disconnect();
      try {
        scanAndProcessTags();
        handleRoomChange();
      } finally {
        phoneObserver.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    });
  }

  function init() {
    ensureDeadScreenDOM();
    handleRoomChange();
    scanAndProcessTags();
  }

  init();

  const phoneObserver = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      if (m.type === 'characterData') {
        const val = m.target.nodeValue || '';
        if (val.includes('smartphone_normal') || val.includes('EAS')) {
          relevant = true;
          break;
        }
      } else {
        for (const n of m.addedNodes) {
          const tc = n.textContent || '';
          if (tc.includes('smartphone_normal') || tc.includes('EAS')) {
            relevant = true;
            break;
          }
        }
      }
      if (relevant) break;
    }

    if (relevant) {
      safeScanExecution();
    }
  });

  phoneObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();