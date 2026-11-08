(function () {
  'use strict';

  console.log('[Smartphone App] kakaotalk.js (Sound & Top Banner Enabled) loaded.');

  const STYLE_ID = 'neo-kakaotalk-app-style';
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    kakaotalk,
    ms-chat-turn kakaotalk,
    .neo-kakaotalk-hidden-block {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #neo-kakaotalk-view {
      position: absolute;
      top: 28px;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000000;
      z-index: 8;
      display: none;
      flex-direction: column;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 0 0 36px 36px;
      transform: scale(0.15);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.36s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
    }

    #neo-kakaotalk-view.active {
      display: flex !important;
      transform: scale(1) !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    #neo-kakaotalk-view.closing {
      display: flex !important;
      transform: scale(0.15) !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .kt-safe-top-spacer { height: 6px; flex-shrink: 0; }

    .kt-screen-page {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000000;
      display: flex;
      flex-direction: column;
      z-index: 10;
      box-sizing: border-box;
      overflow: hidden;
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    }

    .kt-screen-page.hidden-page {
      transform: translateX(100%);
      pointer-events: none;
      opacity: 0;
    }

    .kt-main-body {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding: 4px 10px 8px 10px;
      box-sizing: border-box;
    }
    .kt-main-body::-webkit-scrollbar { display: none; }

    .kt-tab-panel { display: none; flex-direction: column; gap: 8px; }
    .kt-tab-panel.active { display: flex; }

    .kt-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 2px 6px 2px;
    }
    .kt-header-title { font-size: 17px; font-weight: 700; color: #ffffff; }

    .kt-my-profile-mini { display: flex; align-items: center; gap: 7px; }
    .kt-my-avatar {
      width: 28px;
      height: 28px;
      border-radius: 10px;
      background: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .kt-my-avatar svg { width: 16px; height: 16px; fill: #ffffff; }
    .kt-my-name { font-size: 14px; font-weight: 600; color: #ffffff; }

    .kt-header-action-btn { background: transparent; border: none; color: #ffffff; cursor: pointer; padding: 3px; }
    .kt-header-action-btn svg { width: 17px; height: 17px; stroke: currentColor; }

    .kt-search-bar-wrap { display: none; margin-bottom: 4px; }
    .kt-search-bar-wrap.open { display: block; }
    .kt-search-input-box {
      display: flex;
      align-items: center;
      gap: 5px;
      background: #1c1c1e;
      border-radius: 9px;
      padding: 5px 8px;
    }
    .kt-search-input-box svg { width: 13px; height: 13px; stroke: #8e8e93; }
    .kt-search-input-box input {
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 11.5px;
      width: 100%;
    }

    .kt-filter-bar { display: flex; gap: 5px; margin-bottom: 2px; }
    .kt-chip-pill {
      background: #ffffff;
      color: #000000;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      border: none;
    }

    .kt-section-label { font-size: 10.5px; font-weight: 600; color: #8e8e93; }

    .kt-list-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
      border-radius: 10px;
      cursor: pointer;
    }
    .kt-list-item:hover { background: rgba(255, 255, 255, 0.05); }

    .kt-avatar-circle {
      width: 34px;
      height: 34px;
      border-radius: 13px;
      background: #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      flex-shrink: 0;
    }
    .kt-avatar-circle.official { background: #003366; }

    .kt-item-info { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
    .kt-item-title-row { display: flex; align-items: center; justify-content: space-between; }
    .kt-item-name { font-size: 12.5px; font-weight: 600; color: #ffffff; }

    .kt-item-bottom-row { display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-top: 1px; }
    .kt-item-sub {
      font-size: 10.5px;
      color: #8e8e93;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .kt-chat-badge {
      background: #ef4444;
      color: #ffffff;
      font-size: 9px;
      font-weight: 700;
      min-width: 15px;
      height: 15px;
      border-radius: 8px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.5);
      flex-shrink: 0;
      line-height: 1;
    }

    #kt-profile-page {
      background: #000000;
      justify-content: space-between;
      padding: 12px 16px 20px 16px;
      box-sizing: border-box;
      z-index: 20;
    }
    .kt-profile-top-bar { display: flex; justify-content: flex-start; }
    .kt-profile-close-btn { background: transparent; border: none; color: #ffffff; font-size: 18px; cursor: pointer; padding: 2px; }

    .kt-profile-center-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      margin-top: auto;
      margin-bottom: 24px;
    }
    .kt-profile-large-avatar {
      width: 64px;
      height: 64px;
      border-radius: 24px;
      background: #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    }
    .kt-profile-name { font-size: 16px; font-weight: 700; color: #ffffff; }
    .kt-profile-bio { font-size: 11.5px; color: #a1a1aa; max-width: 180px; line-height: 1.4; word-break: break-word; }

    .kt-profile-bottom-actions {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 14px;
      display: flex;
      justify-content: center;
    }
    .kt-profile-action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
    }
    .kt-profile-action-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; }

    #kt-chat-room-page {
      background: #000000;
      z-index: 30;
      justify-content: space-between;
    }

    .kt-chat-room-header {
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-shrink: 0;
    }

    .kt-chat-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 10px;
      padding: 3px 6px;
      color: #ffffff;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .kt-chat-back-btn svg { width: 14px; height: 14px; stroke: currentColor; }

    .kt-chat-room-title-box { display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .kt-chat-room-title { font-size: 13.5px; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 3px; }
    .kt-verified-badge { width: 13px; height: 13px; fill: #38bdf8; }

    .kt-chat-messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-sizing: border-box;
    }
    .kt-chat-messages-container::-webkit-scrollbar { display: none; }

    .kt-msg-row { display: flex; gap: 6px; align-items: flex-end; width: 100%; }
    .kt-msg-row.from-other { justify-content: flex-start; }
    .kt-msg-row.from-user { justify-content: flex-end; }

    .kt-msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 10px;
      background: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
      align-self: flex-start;
    }

    .kt-msg-bubble-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-width: 78%;
    }
    .kt-msg-sender-name { font-size: 10px; color: #a1a1aa; margin-left: 2px; }

    .kt-bubble-and-meta { display: flex; align-items: flex-end; gap: 4px; }
    .kt-msg-row.from-user .kt-bubble-and-meta { flex-direction: row-reverse; }

    .kt-bubble {
      padding: 6px 10px;
      border-radius: 12px;
      font-size: 12px;
      line-height: 1.45;
      word-break: break-word;
      white-space: pre-wrap;
    }
    .kt-msg-row.from-other .kt-bubble {
      background: #262626;
      color: #ffffff;
      border-top-left-radius: 3px;
    }
    .kt-msg-row.from-user .kt-bubble {
      background: #fee500;
      color: #000000;
      border-top-right-radius: 3px;
      font-weight: 500;
    }

    .kt-msg-meta {
      display: flex;
      flex-direction: column;
      font-size: 9px;
      color: #71717a;
      line-height: 1.1;
      flex-shrink: 0;
    }
    .kt-msg-row.from-user .kt-msg-meta { align-items: flex-end; }

    .kt-unread-one {
      color: #fee500;
      font-size: 9.5px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 2px;
    }

    .kt-chat-input-bar {
      padding: 6px 8px;
      background: #000000;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .kt-input-capsule {
      flex: 1;
      height: 32px;
      background: #1c1c1e;
      border-radius: 16px;
      padding: 0 12px;
      display: flex;
      align-items: center;
    }
    .kt-input-capsule input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 12px;
      font-family: inherit;
    }
    .kt-input-capsule input::placeholder {
      color: #71717a;
    }

    .kt-send-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #fee500;
      border: none;
      color: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
      flex-shrink: 0;
      padding: 0;
    }
    .kt-send-btn:hover { transform: scale(1.08); }
    .kt-send-btn:active { transform: scale(0.92); }
    .kt-send-btn svg { width: 15px; height: 15px; fill: currentColor; }

    .kt-bottom-nav-wrap {
      background: #000000;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      padding-top: 2px;
      padding-bottom: 2px;
      flex-shrink: 0;
    }
    .kt-nav-bar {
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .kt-nav-item {
      position: relative;
      background: transparent;
      border: none;
      color: #545458;
      cursor: pointer;
      padding: 6px 20px;
      transition: color 0.2s, transform 0.15s;
    }
    .kt-nav-item.active { color: #ffffff; }
    .kt-nav-item svg { width: 19px; height: 19px; fill: currentColor; }

    .kt-nav-badge {
      position: absolute;
      top: 3px;
      right: 14px;
      background: #ef4444;
      color: #ffffff;
      font-size: 8px;
      font-weight: 700;
      min-width: 14px;
      height: 14px;
      border-radius: 7px;
      padding: 0 3px;
      display: none;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .kt-home-bar-touch {
      padding: 4px 0 3px 0;
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
    .kt-home-bar {
      width: 70px;
      height: 3px;
      background: #ffffff;
      border-radius: 2px;
      opacity: 0.85;
      transition: opacity 0.2s, width 0.2s;
    }
    .kt-home-bar-touch:hover .kt-home-bar { opacity: 1; width: 78px; }
  `;

  const STORAGE_KEY = 'neo_kakaotalk_data_map';
  let currentActiveChatId = null;

  function getChatRoomId() {
    const path = window.location.pathname;
    const match = path.match(/prompts\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : 'new_chat';
  }

  function getStore() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function getRoomData(roomId) {
    const store = getStore();
    if (!store[roomId]) {
      store[roomId] = { friends: [], chats: [] };
      saveStore(store);
    }
    if (!Array.isArray(store[roomId].friends)) store[roomId].friends = [];
    if (!Array.isArray(store[roomId].chats)) store[roomId].chats = [];
    return store[roomId];
  }

  function saveRoomData(roomId, roomData) {
    const store = getStore();
    store[roomId] = roomData;
    saveStore(store);
  }

  function getCurrentFormattedTime() {
    const roomId = getChatRoomId();
    let phoneStore = {};
    try {
      phoneStore = JSON.parse(localStorage.getItem('neo_smartphone_status_map') || '{}');
    } catch (e) {}

    const status = phoneStore[roomId] || {};
    let rawHour = status.hour !== undefined ? parseInt(status.hour, 10) : new Date().getHours();
    let rawMin = status.min !== undefined ? parseInt(status.min, 10) : new Date().getMinutes();

    if (isNaN(rawHour)) rawHour = new Date().getHours();
    if (isNaN(rawMin)) rawMin = new Date().getMinutes();

    let period = rawHour < 12 ? 'AM' : 'PM';
    let hour12 = rawHour % 12;
    if (hour12 === 0) hour12 = 12;

    const minStr = String(rawMin).padStart(2, '0');
    const hourStr = String(hour12);

    return {
      hour: hourStr,
      min: minStr,
      Period: period,
      displayTime: `${period === 'AM' ? '오전' : '오후'} ${hourStr}:${minStr}`
    };
  }

  function getRoomUnreadCount(chat) {
    if (!chat || !Array.isArray(chat.messages)) return 0;
    return chat.messages.filter(m => m.type === 'msg' && String(m.user) === '0' && String(m.see) === '0').length;
  }

  function getTotalUnreadCount() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    return (roomData.chats || []).reduce((acc, c) => acc + getRoomUnreadCount(c), 0);
  }

  function syncAppIconAndTabBadge() {
    const total = getTotalUnreadCount();

    if (window.NeoPhone?.badge?.set) {
      window.NeoPhone.badge.set('kakaotalk', total > 0 ? (total > 99 ? '99+' : total) : null);
    }

    const navBadge = document.getElementById('kt-nav-chat-badge');
    if (navBadge) {
      if (total > 0) {
        navBadge.textContent = total > 99 ? '99+' : total;
        navBadge.style.display = 'flex';
      } else {
        navBadge.style.display = 'none';
      }
    }
  }

  function sendPromptToAIStudio(payloadObj) {
    const jsonStr = JSON.stringify(payloadObj);
    const textarea = document.querySelector('ms-prompt-box textarea') ||
                     document.querySelector('textarea[aria-label*="Prompt"]') ||
                     document.querySelector('ms-prompt-box .ql-editor');

    if (textarea) {
      if (textarea.tagName === 'TEXTAREA') {
        const proto = Object.getPrototypeOf(textarea);
        const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (setter) {
          setter.call(textarea, jsonStr);
        } else {
          textarea.value = jsonStr;
        }
        textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      } else {
        textarea.innerHTML = `<p>${jsonStr}</p>`;
        textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      }

      setTimeout(() => {
        const runBtn = document.querySelector('ms-run-button button') ||
                       document.querySelector('button[aria-label*="Run"]') ||
                       document.querySelector('button.run-button');
        if (runBtn) {
          ['mousedown', 'mouseup', 'click'].forEach(evt => {
            runBtn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
          });
        }
      }, 120);
    }
  }

  function injectKakaoTalkView() {
    const screen = document.querySelector('.neo-phone-screen');
    if (!screen || document.getElementById('neo-kakaotalk-view')) return;

    const kakaoView = document.createElement('div');
    kakaoView.id = 'neo-kakaotalk-view';
    kakaoView.innerHTML = `
      <div class="kt-safe-top-spacer"></div>

      <div class="kt-screen-page" id="kt-page-main">
        <div class="kt-main-body">
          <div class="kt-tab-panel active" id="kt-panel-friends">
            <div class="kt-header-row">
              <div class="kt-my-profile-mini">
                <div class="kt-my-avatar">
                  <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <span class="kt-my-name">카카오톡</span>
              </div>
              <button type="button" class="kt-header-action-btn" id="kt-btn-search" title="검색">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            <div class="kt-search-bar-wrap" id="kt-search-wrap">
              <div class="kt-search-input-box">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="kt-search-input" placeholder="이름으로 검색">
              </div>
            </div>

            <div class="kt-filter-bar">
              <button type="button" class="kt-chip-pill">친구</button>
            </div>

            <div class="kt-section-label" id="kt-friends-count-label">친구 0</div>
            <div id="kt-friends-list-container" style="display: flex; flex-direction: column; gap: 3px;"></div>
          </div>

          <div class="kt-tab-panel" id="kt-panel-chats">
            <div class="kt-header-row">
              <span class="kt-header-title">채팅</span>
            </div>
            <div class="kt-filter-bar">
              <button type="button" class="kt-chip-pill">전체</button>
            </div>
            <div id="kt-chats-list-container" style="display: flex; flex-direction: column; gap: 3px;"></div>
          </div>
        </div>

        <div class="kt-bottom-nav-wrap">
          <div class="kt-nav-bar">
            <button type="button" class="kt-nav-item active" id="kt-nav-friends" title="친구">
              <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </button>
            <button type="button" class="kt-nav-item" id="kt-nav-chats" title="채팅">
              <span class="kt-nav-badge" id="kt-nav-chat-badge"></span>
              <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            </button>
          </div>
          <div class="kt-home-bar-touch" id="kt-home-btn-main">
            <div class="kt-home-bar"></div>
          </div>
        </div>
      </div>

      <div class="kt-screen-page hidden-page" id="kt-profile-page">
        <div class="kt-profile-top-bar">
          <button type="button" class="kt-profile-close-btn" id="kt-profile-close-btn">✕</button>
        </div>
        <div class="kt-profile-center-body">
          <div class="kt-profile-large-avatar" id="kt-prof-avatar">?</div>
          <div class="kt-profile-name" id="kt-prof-name">이름</div>
          <div class="kt-profile-bio" id="kt-prof-bio"></div>
        </div>
        <div class="kt-profile-bottom-actions">
          <button type="button" class="kt-profile-action-btn" id="kt-btn-start-chat">
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>1:1 채팅</span>
          </button>
        </div>
        <div class="kt-home-bar-touch" id="kt-home-btn-prof">
          <div class="kt-home-bar"></div>
        </div>
      </div>

      <div class="kt-screen-page hidden-page" id="kt-chat-room-page">
        <div class="kt-chat-room-header">
          <button type="button" class="kt-chat-back-btn" id="kt-chat-back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span id="kt-chat-back-count"></span>
          </button>
          <div class="kt-chat-room-title-box">
            <div class="kt-chat-room-title">
              <span id="kt-room-title-text">채팅방</span>
              <svg class="kt-verified-badge" id="kt-room-verified-icon" style="display:none;" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div style="width: 32px;"></div>
        </div>

        <div class="kt-chat-messages-container" id="kt-chat-messages-box"></div>

        <div class="kt-chat-input-bar">
          <div class="kt-input-capsule">
            <input type="text" id="kt-message-input" placeholder="메시지 입력" autocomplete="off">
          </div>
          <button type="button" class="kt-send-btn" id="kt-send-btn" title="전송">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>

        <div class="kt-home-bar-touch" id="kt-home-btn-chat">
          <div class="kt-home-bar"></div>
        </div>
      </div>
    `;

    screen.appendChild(kakaoView);
    renderFriendsList();
    renderChatsList();
    syncAppIconAndTabBadge();
    bindEvents(kakaoView);
  }

  function renderFriendsList(filterText = '') {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const container = document.getElementById('kt-friends-list-container');
    const label = document.getElementById('kt-friends-count-label');
    if (!container) return;

    const friends = roomData.friends || [];
    if (label) label.textContent = `친구 ${friends.length}`;

    const filtered = friends.filter(f => (f.name || '').toLowerCase().includes(filterText.toLowerCase()));
    if (filtered.length === 0) {
      container.innerHTML = `<div style="font-size: 11px; color: #71717a; text-align: center; padding: 20px 0;">친구가 없습니다.</div>`;
      return;
    }

    container.innerHTML = filtered.map(f => {
      const cleanBio = (f.bio && f.bio.trim().toLowerCase() !== 'none') ? f.bio : '';
      return `
        <div class="kt-list-item kt-friend-item" data-id="${f.id}">
          <div class="kt-avatar-circle ${f.official ? 'official' : ''}">${(f.name || '?').charAt(0)}</div>
          <div class="kt-item-info">
            <div class="kt-item-name">${f.name}</div>
            <div class="kt-item-sub">${cleanBio}</div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.kt-friend-item').forEach(item => {
      item.addEventListener('click', () => {
        const friend = friends.find(f => f.id === item.dataset.id);
        if (friend) openProfileModal(friend);
      });
    });
  }

  function renderChatsList() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const container = document.getElementById('kt-chats-list-container');
    if (!container) return;

    const chats = roomData.chats || [];
    if (chats.length === 0) {
      container.innerHTML = `<div style="font-size: 11px; color: #71717a; text-align: center; padding: 20px 0;">대화가 없습니다.</div>`;
      syncAppIconAndTabBadge();
      return;
    }

    container.innerHTML = chats.map(c => {
      const unreadCount = getRoomUnreadCount(c);
      return `
        <div class="kt-list-item kt-chat-item" data-id="${c.id}">
          <div class="kt-avatar-circle ${c.official ? 'official' : ''}">${(c.name || '?').charAt(0)}</div>
          <div class="kt-item-info">
            <div class="kt-item-title-row">
              <span class="kt-item-name">${c.name}</span>
              <span style="font-size: 9.5px; color: #71717a;">${c.time || ''}</span>
            </div>
            <div class="kt-item-bottom-row">
              <div class="kt-item-sub">${c.lastMsg || ''}</div>
              ${unreadCount > 0 ? `<span class="kt-chat-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.kt-chat-item').forEach(item => {
      item.addEventListener('click', () => {
        openChatRoom(item.dataset.id);
      });
    });

    syncAppIconAndTabBadge();
  }

  function openProfileModal(friend) {
    const page = document.getElementById('kt-profile-page');
    if (!page) return;

    document.getElementById('kt-prof-avatar').textContent = (friend.name || '?').charAt(0);
    document.getElementById('kt-prof-name').textContent = friend.name;
    const cleanBio = (friend.bio && friend.bio.trim().toLowerCase() !== 'none') ? friend.bio : '';
    document.getElementById('kt-prof-bio').textContent = cleanBio;

    const startChatBtn = document.getElementById('kt-btn-start-chat');
    startChatBtn.onclick = () => {
      page.classList.add('hidden-page');
      const roomId = getChatRoomId();
      const roomData = getRoomData(roomId);
      let chat = (roomData.chats || []).find(c => c.name === friend.name);
      if (!chat) {
        chat = {
          id: 'c_' + Date.now(),
          name: friend.name,
          official: !!friend.official,
          lastMsg: '대화를 시작해보세요.',
          time: '방금',
          messages: []
        };
        roomData.chats.unshift(chat);
        saveRoomData(roomId, roomData);
        renderChatsList();
      }
      openChatRoom(chat.id);
    };

    page.classList.remove('hidden-page');
  }

  function openChatRoom(chatId) {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const chat = (roomData.chats || []).find(c => c.id === chatId);
    if (!chat) return;

    currentActiveChatId = chatId;
    const roomPage = document.getElementById('kt-chat-room-page');
    const msgBox = document.getElementById('kt-chat-messages-box');
    const titleText = document.getElementById('kt-room-title-text');
    const verifiedIcon = document.getElementById('kt-room-verified-icon');
    const backCountEl = document.getElementById('kt-chat-back-count');

    titleText.textContent = chat.name;
    verifiedIcon.style.display = chat.official ? 'inline-block' : 'none';

    let changed = false;
    chat.messages.forEach(m => {
      if (m.type === 'msg' && String(m.user) === '0' && String(m.see) === '0') {
        m.see = '1';
        changed = true;
      }
    });

    if (changed) {
      saveRoomData(roomId, roomData);
    }

    const remainUnread = getTotalUnreadCount();
    backCountEl.textContent = remainUnread > 0 ? (remainUnread > 99 ? '99+' : remainUnread) : '';
    syncAppIconAndTabBadge();

    msgBox.innerHTML = chat.messages.map(m => {
      const isUser = String(m.user) === '1';
      const showOne = isUser && String(m.see) === '0';
      return `
        <div class="kt-msg-row ${isUser ? 'from-user' : 'from-other'}">
          ${!isUser ? `<div class="kt-msg-avatar">${(m.owner || chat.name).charAt(0)}</div>` : ''}
          <div class="kt-msg-bubble-group">
            ${!isUser ? `<span class="kt-msg-sender-name">${m.owner || chat.name}</span>` : ''}
            <div class="kt-bubble-and-meta">
              <div class="kt-bubble">${m.content}</div>
              <div class="kt-msg-meta">
                ${showOne ? '<span class="kt-unread-one">1</span>' : ''}
                <span>${m.timeStr || ''}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    roomPage.classList.remove('hidden-page');
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
      document.getElementById('kt-message-input')?.focus();
    }, 150);
  }


  function handleSendMessage() {
    const input = document.getElementById('kt-message-input');
    if (!input || !input.value.trim() || !currentActiveChatId) return;

    const text = input.value.trim();
    input.value = '';

    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const chat = (roomData.chats || []).find(c => c.id === currentActiveChatId);
    if (!chat) return;

    const timeInfo = getCurrentFormattedTime();

    const newMsg = {
      type: 'msg',
      owner: 'User',
      content: text,
      hour: timeInfo.hour,
      min: timeInfo.min,
      Period: timeInfo.Period,
      see: '0',
      user: '1',
      official: '0',
      timeStr: timeInfo.displayTime
    };

    
    chat.messages.push(newMsg);
    chat.lastMsg = text;
    chat.time = timeInfo.displayTime;
    saveRoomData(roomId, roomData);
    openChatRoom(currentActiveChatId);

    const sendPayload = {
      type: 'kakaotalk_send',
      to: chat.name,
      content: text,
      hour: timeInfo.hour,
      min: timeInfo.min,
      Period: timeInfo.Period,
      see: '0',
      user: '1'
    };

    
    if (window.NeoActionQueue) {
      window.NeoActionQueue.add({
        app: 'kakaotalk',
        type: 'send',
        label: `카톡: ${chat.name}`,
        summary: text,
        payload: sendPayload,
        rawString: `<kakaotalk>\n${JSON.stringify(sendPayload)}\n</kakaotalk>`
      });
    } else {
      sendPromptToAIStudio(sendPayload);
    }
  }

  
  function processIncomingKakaotalkBlock(innerContent) {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    let changed = false;

    const objRegex = /\{[^{}]*?\}/g;
    let match;

    while ((match = objRegex.exec(innerContent)) !== null) {
      try {
        const item = JSON.parse(match[0]);

        if (item.line && item.line.toLowerCase() === 'down') continue;

        if (item.type === 'new_friend' && item.name) {
          const exists = (roomData.friends || []).some(f => f.name === item.name);
          if (!exists) {
            roomData.friends.push({
              id: 'f_' + Date.now() + Math.random().toString(36).substring(2, 5),
              name: item.name,
              bio: (item.bio && item.bio.trim().toLowerCase() !== 'none') ? item.bio : ''
            });
            changed = true;
          }
        }

        if (item.type === 'message' && item.content) {
          const cleanText = (item.content || '').replace(/\\n/g, '\n').trim();
          if (!cleanText) continue;

          const targetName = item.owner || '상대방';
          let chat = (roomData.chats || []).find(c => c.name === targetName);

          if (!chat) {
            chat = {
              id: 'c_' + Date.now() + Math.random().toString(36).substring(2, 5),
              name: targetName,
              official: String(item.official) === '1',
              lastMsg: '',
              time: '',
              messages: []
            };
            roomData.chats.unshift(chat);
          }

          const p = item.Period || 'AM';
          const h = item.hour || '12';
          const m = String(item.min || '00').padStart(2, '0');
          const displayTime = `${p === 'AM' ? '오전' : '오후'} ${h}:${m}`;

          const isDuplicated = chat.messages.some(existing =>
            existing.content === cleanText &&
            existing.hour === item.hour &&
            existing.min === item.min &&
            existing.Period === item.Period
          );

          if (!isDuplicated) {
            const isUser = String(item.user) === '1';
            const isOfficial = String(item.official) === '1';

            if (!isUser) {
              chat.messages.forEach(m => {
                if (String(m.user) === '1' && String(m.see) === '0') {
                  m.see = '1';
                }
              });

              
              window.NeoNotification?.showKakao({
                name: targetName,
                text: cleanText
              });
            }

            chat.messages.push({
              type: 'msg',
              owner: targetName,
              content: cleanText,
              hour: String(h),
              min: String(m),
              Period: p,
              see: isOfficial ? '0' : (isUser ? '1' : String(item.see || '0')),
              user: isOfficial ? '0' : (isUser ? '1' : '0'),
              official: isOfficial ? '1' : '0',
              timeStr: displayTime
            });

            chat.lastMsg = cleanText.split('\n')[0];
            chat.time = displayTime;
            changed = true;
          }
        }
      } catch (e) {}
    }

    if (changed) {
      saveRoomData(roomId, roomData);
      renderFriendsList();
      renderChatsList();
      syncAppIconAndTabBadge();

      if (currentActiveChatId) {
        openChatRoom(currentActiveChatId);
      }
    }
  }

  function scanAndProcessCompletedKakaotalkTags() {
    const turns = document.querySelectorAll('ms-chat-turn');
    if (!turns.length) return;

    const completeTagRegex = /(?:<kakaotalk>|&lt;kakaotalk&gt;)([\s\S]*?)(?:<\/kakaotalk>|&lt;\/kakaotalk&gt;)/i;

    turns.forEach((turn) => {
      const turnText = turn.textContent || '';

      if (turnText.includes('kakaotalk_send')) {
        turn.classList.add('neo-kakaotalk-hidden-block');
        turn.style.display = 'none';
        return;
      }

      if (turn.dataset.ktProcessed === 'true') return;

      const hasOpen = turnText.includes('<kakaotalk>') || turnText.includes('&lt;kakaotalk&gt;');
      const hasClose = turnText.includes('</kakaotalk>') || turnText.includes('&lt;/kakaotalk&gt;');

      if (!hasOpen || !hasClose) return;

      const match = turnText.match(completeTagRegex);
      if (match && match[1]) {
        processIncomingKakaotalkBlock(match[1]);
        turn.dataset.ktProcessed = 'true';

        turn.querySelectorAll('p, pre, ms-code-block, mat-expansion-panel').forEach((block) => {
          if (block.textContent && block.textContent.includes('kakaotalk')) {
            block.classList.add('neo-kakaotalk-hidden-block');
            block.style.display = 'none';
          }
        });
      }
    });
  }

  function updateTransformOriginToAppIcon(view) {
    const screen = document.querySelector('.neo-phone-screen');
    const icon = document.querySelector('.neo-phone-app-item[data-app-id="kakaotalk"] .neo-phone-app-icon') ||
                 document.querySelector('.neo-phone-app-item[data-app-id="kakaotalk"]');
    if (!screen || !icon || !view) return;
    const sRect = screen.getBoundingClientRect();
    const iRect = icon.getBoundingClientRect();
    const cx = (iRect.left + iRect.width / 2) - sRect.left;
    const cy = (iRect.top + iRect.height / 2) - sRect.top;
    view.style.transformOrigin = `${cx}px ${cy}px`;
  }

  function openKakaoTalk() {
    let kakaoView = document.getElementById('neo-kakaotalk-view');
    if (!kakaoView) {
      injectKakaoTalkView();
      kakaoView = document.getElementById('neo-kakaotalk-view');
    }
    if (!kakaoView) return;

    updateTransformOriginToAppIcon(kakaoView);
    kakaoView.style.display = 'flex';
    kakaoView.classList.remove('closing');
    void kakaoView.offsetWidth;
    kakaoView.classList.add('active');

    renderFriendsList();
    renderChatsList();
    syncAppIconAndTabBadge();
  }

  function closeKakaoTalk() {
    const kakaoView = document.getElementById('neo-kakaotalk-view');
    if (kakaoView && kakaoView.classList.contains('active')) {
      updateTransformOriginToAppIcon(kakaoView);
      kakaoView.classList.remove('active');
      kakaoView.classList.add('closing');
      setTimeout(() => {
        kakaoView.classList.remove('closing');
        kakaoView.style.display = 'none';
        document.getElementById('kt-profile-page')?.classList.add('hidden-page');
        document.getElementById('kt-chat-room-page')?.classList.add('hidden-page');
        currentActiveChatId = null;
      }, 340);
    }
  }

  function bindEvents(view) {
    view.querySelectorAll('.kt-home-bar-touch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeKakaoTalk();
      });
    });

    const btnFriends = view.querySelector('#kt-nav-friends');
    const btnChats = view.querySelector('#kt-nav-chats');
    const panelFriends = view.querySelector('#kt-panel-friends');
    const panelChats = view.querySelector('#kt-panel-chats');

    btnFriends?.addEventListener('click', () => {
      btnFriends.classList.add('active');
      btnChats.classList.remove('active');
      panelFriends.classList.add('active');
      panelChats.classList.remove('active');
      renderFriendsList();
    });

    btnChats?.addEventListener('click', () => {
      btnChats.classList.add('active');
      btnFriends.classList.remove('active');
      panelChats.classList.add('active');
      panelFriends.classList.remove('active');
      renderChatsList();
    });

    const searchBtn = view.querySelector('#kt-btn-search');
    const searchWrap = view.querySelector('#kt-search-wrap');
    const searchInput = view.querySelector('#kt-search-input');

    searchBtn?.addEventListener('click', () => {
      const isOpen = searchWrap.classList.toggle('open');
      if (isOpen) searchInput.focus();
      else {
        searchInput.value = '';
        renderFriendsList();
      }
    });

    searchInput?.addEventListener('input', (e) => {
      renderFriendsList(e.target.value.trim());
    });

    view.querySelector('#kt-profile-close-btn')?.addEventListener('click', () => {
      document.getElementById('kt-profile-page').classList.add('hidden-page');
    });

    view.querySelector('#kt-chat-back-btn')?.addEventListener('click', () => {
      document.getElementById('kt-chat-room-page').classList.add('hidden-page');
      currentActiveChatId = null;
      renderChatsList();
      syncAppIconAndTabBadge();
    });

    const sendBtn = view.querySelector('#kt-send-btn');
    const msgInput = view.querySelector('#kt-message-input');

    sendBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleSendMessage();
    });

    msgInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }

  let lastRoomId = null;
  let isThrottled = false;

  function handleRoomChange() {
    const currentRoom = getChatRoomId();
    if (currentRoom !== lastRoomId) {
      lastRoomId = currentRoom;
      renderFriendsList();
      renderChatsList();
      syncAppIconAndTabBadge();
    }
  }

  function safeScanExecution() {
    if (isThrottled) return;
    isThrottled = true;

    requestAnimationFrame(() => {
      isThrottled = false;
      ktObserver.disconnect();
      try {
        scanAndProcessCompletedKakaotalkTags();
        handleRoomChange();
      } finally {
        ktObserver.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    });
  }

  function setupLaunch() {
    if (window.NeoPhone?.onAppClick) {
      window.NeoPhone.onAppClick((appId) => {
        if (appId === 'kakaotalk') openKakaoTalk();
      });
    }

    window.addEventListener('neo-phone-app-click', (e) => {
      if (e.detail?.appId === 'kakaotalk') openKakaoTalk();
    });
  }

  function waitScreenReady() {
    const check = setInterval(() => {
      const screen = document.querySelector('.neo-phone-screen');
      if (screen) {
        clearInterval(check);
        injectKakaoTalkView();
        setupLaunch();
        scanAndProcessCompletedKakaotalkTags();
        syncAppIconAndTabBadge();
      }
    }, 100);
  }
  waitScreenReady();

  const ktObserver = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      if (m.type === 'characterData') {
        const val = m.target.nodeValue || '';
        if (val.includes('kakaotalk') || val.includes('kakaotalk_send')) {
          relevant = true;
          break;
        }
      } else {
        for (const n of m.addedNodes) {
          const tc = n.textContent || '';
          if (tc.includes('kakaotalk') || tc.includes('kakaotalk_send')) {
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

  ktObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.NeoKakao = {
    open: openKakaoTalk,
    close: closeKakaoTalk,
    syncBadges: syncAppIconAndTabBadge
  };
})();