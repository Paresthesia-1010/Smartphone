
(function () {
  'use strict';

  console.log('[Smartphone App] message.js (iOS iMessage Full System) loaded.');

  const STYLE_ID = 'neo-message-app-style';
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    message,
    ms-chat-turn message,
    .neo-message-hidden-block {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #neo-message-view {
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
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 0 0 36px 36px;
      transform: scale(0.15);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.36s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
    }

    #neo-message-view.active {
      display: flex !important;
      transform: scale(1) !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    #neo-message-view.closing {
      display: flex !important;
      transform: scale(0.15) !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .msg-safe-top-spacer { height: 6px; flex-shrink: 0; }

    .msg-screen-page {
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

    .msg-screen-page.hidden-page {
      transform: translateX(100%);
      pointer-events: none;
      opacity: 0;
    }

    .msg-list-header {
      padding: 10px 14px 6px 14px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-shrink: 0;
    }

    .msg-large-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.6px;
      color: #ffffff;
      margin: 0;
    }

    .msg-list-body {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding: 4px 0 10px 0;
      box-sizing: border-box;
    }
    .msg-list-body::-webkit-scrollbar { display: none; }

    .msg-thread-item {
      display: flex;
      align-items: center;
      padding: 9px 14px;
      cursor: pointer;
      position: relative;
      transition: background 0.15s ease;
    }
    .msg-thread-item:active {
      background: rgba(255, 255, 255, 0.08);
    }

    .msg-unread-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #007aff;
      margin-right: 8px;
      flex-shrink: 0;
      visibility: hidden;
    }
    .msg-thread-item.unread .msg-unread-dot {
      visibility: visible;
    }

    .msg-avatar-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #3a3a3c;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      font-weight: 700;
      color: #ffffff;
      flex-shrink: 0;
      margin-right: 11px;
    }

    .msg-thread-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      border-bottom: 0.5px solid rgba(255, 255, 255, 0.12);
      padding-bottom: 9px;
    }

    .msg-thread-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .msg-sender-name {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .msg-thread-date-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .msg-date-text {
      font-size: 12px;
      color: #8e8e93;
    }

    .msg-chevron {
      width: 12px;
      height: 12px;
      color: #3a3a3c;
      stroke-width: 2.5;
    }

    .msg-snippet {
      font-size: 13px;
      color: #8e8e93;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.35;
    }
    .msg-thread-item.unread .msg-snippet {
      color: #d1d1d6;
      font-weight: 500;
    }

    .msg-chat-header {
      height: 46px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.5px solid rgba(255, 255, 255, 0.12);
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(20px);
      flex-shrink: 0;
      z-index: 20;
    }

    .msg-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      background: transparent;
      border: none;
      color: #007aff;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      padding: 4px 6px;
    }
    .msg-back-btn svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.8;
      stroke: currentColor;
    }

    .msg-chat-header-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    .msg-chat-header-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #3a3a3c;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1px;
    }

    .msg-chat-header-name-row {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 11px;
      color: #8e8e93;
      font-weight: 600;
    }
    .msg-chat-header-name {
      color: #ffffff;
    }

    .msg-call-btn {
      background: transparent;
      border: none;
      color: #007aff;
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .msg-call-btn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    .msg-chat-messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      box-sizing: border-box;
    }
    .msg-chat-messages-container::-webkit-scrollbar { display: none; }

    .msg-encryption-notice {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2px;
      margin: 12px 0 16px 0;
      color: #8e8e93;
      font-size: 10.5px;
    }
    .msg-encryption-title {
      font-size: 11.5px;
      font-weight: 600;
      color: #a1a1aa;
    }

    .msg-date-separator {
      text-align: center;
      font-size: 10.5px;
      color: #8e8e93;
      margin: 14px 0 6px 0;
      font-weight: 500;
    }

    .msg-row {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .msg-row.from-other { align-items: flex-start; }
    .msg-row.from-user { align-items: flex-end; }

    .msg-bubble {
      max-width: 76%;
      padding: 8px 12px;
      border-radius: 18px;
      font-size: 13.5px;
      line-height: 1.42;
      word-break: break-word;
      white-space: pre-wrap;
    }

    .msg-row.from-other .msg-bubble {
      background: #262629;
      color: #ffffff;
      border-bottom-left-radius: 5px;
    }

    .msg-row.from-user .msg-bubble {
      background: #007aff;
      color: #ffffff;
      border-bottom-right-radius: 5px;
    }

    .msg-read-status {
      font-size: 9.5px;
      color: #8e8e93;
      margin-top: 3px;
      margin-right: 4px;
      align-self: flex-end;
    }

    .msg-input-bar {
      padding: 6px 10px;
      background: #000000;
      border-top: 0.5px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .msg-input-capsule {
      flex: 1;
      min-height: 32px;
      background: #1c1c1e;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 17px;
      padding: 0 12px;
      display: flex;
      align-items: center;
    }
    .msg-input-capsule input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 13px;
      font-family: inherit;
    }
    .msg-input-capsule input::placeholder {
      color: #636366;
    }

    .msg-send-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #007aff;
      border: none;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
      flex-shrink: 0;
      padding: 0;
    }
    .msg-send-btn:hover { transform: scale(1.08); }
    .msg-send-btn:active { transform: scale(0.92); }
    .msg-send-btn svg { width: 14px; height: 14px; stroke-width: 2.8; stroke: #ffffff; fill: none; }

    .msg-home-bar-touch {
      padding: 6px 0 4px 0;
      cursor: pointer;
      display: flex;
      justify-content: center;
      background: #000000;
      flex-shrink: 0;
    }
    .msg-home-bar {
      width: 70px;
      height: 3px;
      background: #ffffff;
      border-radius: 2px;
      opacity: 0.85;
      transition: width 0.2s, opacity 0.2s;
    }
    .msg-home-bar-touch:hover .msg-home-bar { opacity: 1; width: 78px; }
  `;

  const STORAGE_KEY = 'neo_message_data_map';
  let currentActiveChatId = null;

  const INITIAL_CONTACTS = [
    { id: 'addr_mom', name: '엄마', number: '+82 010-5555-1234' },
    { id: 'addr_dad', name: '아빠', number: '+82 010-5555-5678' }
  ];

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
      store[roomId] = {
        contacts: [...INITIAL_CONTACTS],
        chats: []
      };
      saveStore(store);
    }
    if (!Array.isArray(store[roomId].contacts)) store[roomId].contacts = [...INITIAL_CONTACTS];
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
    const now = new Date();
    const dateKey = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;

    return {
      hour: hourStr,
      min: minStr,
      Period: period,
      dateKey: dateKey,
      timeText: `${period === 'AM' ? '오전' : '오후'} ${hourStr}:${minStr}`,
      fullSeparator: `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${period === 'AM' ? '오전' : '오후'} ${hourStr}:${minStr}`
    };
  }

  function formatDisplayDate(dateKey, timeText) {
    if (!dateKey) return timeText || '';
    const now = new Date();
    const todayKey = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;

    if (dateKey === todayKey) return timeText;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestKey = `${yesterday.getFullYear()}.${yesterday.getMonth() + 1}.${yesterday.getDate()}`;

    if (dateKey === yestKey) return '어제';
    return dateKey;
  }

  function getRoomUnreadCount(chat) {
    if (!chat || !Array.isArray(chat.messages)) return 0;
    return chat.messages.filter(m => String(m.user) === '0' && String(m.see) === '0').length;
  }

  function getTotalUnreadCount() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    return (roomData.chats || []).reduce((acc, c) => acc + getRoomUnreadCount(c), 0);
  }

  function syncAppIconBadge() {
    const total = getTotalUnreadCount();
    if (window.NeoPhone?.badge?.set) {
      window.NeoPhone.badge.set('message', total > 0 ? (total > 99 ? '99+' : total) : null);
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

  function injectMessageView() {
    const screen = document.querySelector('.neo-phone-screen');
    if (!screen || document.getElementById('neo-message-view')) return;

    const msgView = document.createElement('div');
    msgView.id = 'neo-message-view';
    msgView.innerHTML = `
      <div class="msg-safe-top-spacer"></div>

      <div class="msg-screen-page" id="msg-page-list">
        <div class="msg-list-header">
          <h1 class="msg-large-title">메시지</h1>
        </div>
        <div class="msg-list-body" id="msg-threads-container"></div>
        <div class="msg-home-bar-touch" id="msg-home-btn-list">
          <div class="msg-home-bar"></div>
        </div>
      </div>

      <div class="msg-screen-page hidden-page" id="msg-page-chat">
        <div class="msg-chat-header">
          <button type="button" class="msg-back-btn" id="msg-chat-back-btn">
            <svg viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span id="msg-chat-back-count"></span>
          </button>

          <div class="msg-chat-header-center">
            <div class="msg-chat-header-avatar" id="msg-header-avatar">?</div>
            <div class="msg-chat-header-name-row">
              <span class="msg-chat-header-name" id="msg-header-name">상대방</span>
              <span>›</span>
            </div>
          </div>

          <button type="button" class="msg-call-btn" id="msg-header-call-btn" title="전화">
            <svg viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
            </svg>
          </button>
        </div>

        <div class="msg-chat-messages-container" id="msg-chat-messages-box"></div>

        <div class="msg-input-bar">
          <div class="msg-input-capsule">
            <input type="text" id="msg-chat-input" placeholder="iMessage" autocomplete="off">
          </div>
          <button type="button" class="msg-send-btn" id="msg-send-btn" title="전송">
            <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </button>
        </div>

        <div class="msg-home-bar-touch" id="msg-home-btn-chat">
          <div class="msg-home-bar"></div>
        </div>
      </div>
    `;

    screen.appendChild(msgView);
    renderThreadsList();
    syncAppIconBadge();
    bindEvents(msgView);
  }

  function renderThreadsList() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const container = document.getElementById('msg-threads-container');
    if (!container) return;

    const chats = roomData.chats || [];
    if (chats.length === 0) {
      container.innerHTML = `<div style="font-size: 13px; color: #8e8e93; text-align: center; padding: 40px 0;">메시지가 없습니다.</div>`;
      syncAppIconBadge();
      return;
    }

    container.innerHTML = chats.map(c => {
      const unreadCount = getRoomUnreadCount(c);
      const isUnread = unreadCount > 0;
      const displayDate = formatDisplayDate(c.lastDateKey, c.lastTimeText);

      return `
        <div class="msg-thread-item ${isUnread ? 'unread' : ''}" data-id="${c.id}">
          <div class="msg-unread-dot"></div>
          <div class="msg-avatar-circle">${(c.name || '?').charAt(0)}</div>
          <div class="msg-thread-content">
            <div class="msg-thread-top">
              <span class="msg-sender-name">${c.name}</span>
              <div class="msg-thread-date-wrap">
                <span class="msg-date-text">${displayDate}</span>
                <svg class="msg-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
            <div class="msg-snippet">${c.lastSnippet || ''}</div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.msg-thread-item').forEach(item => {
      item.addEventListener('click', () => {
        openChatRoom(item.dataset.id);
      });
    });

    syncAppIconBadge();
  }

  function openChatRoom(chatId) {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const chat = (roomData.chats || []).find(c => c.id === chatId);
    if (!chat) return;

    currentActiveChatId = chatId;
    const roomPage = document.getElementById('msg-page-chat');
    const msgBox = document.getElementById('msg-chat-messages-box');
    const headerName = document.getElementById('msg-header-name');
    const headerAvatar = document.getElementById('msg-header-avatar');
    const backCountEl = document.getElementById('msg-chat-back-count');

    headerName.textContent = chat.name;
    headerAvatar.textContent = (chat.name || '?').charAt(0);

    let changed = false;
    chat.messages.forEach(m => {
      if (String(m.user) === '0' && String(m.see) === '0') {
        m.see = '1';
        changed = true;
      }
    });

    if (changed) {
      saveRoomData(roomId, roomData);
    }

    const remainUnread = getTotalUnreadCount();
    backCountEl.textContent = remainUnread > 0 ? (remainUnread > 99 ? '99+' : remainUnread) : '';
    syncAppIconBadge();

    let html = `
      <div class="msg-encryption-notice">
        <span class="msg-encryption-title">iMessage</span>
        <span>🔒 종단간 암호화됨</span>
      </div>
    `;

    let lastPrintedDate = '';
    const totalMsgs = chat.messages.length;

    chat.messages.forEach((m, idx) => {
      if (m.fullSeparator && m.fullSeparator !== lastPrintedDate) {
        html += `<div class="msg-date-separator">${m.fullSeparator}</div>`;
        lastPrintedDate = m.fullSeparator;
      }

      const isUser = String(m.user) === '1';
      const isLastUserMsg = isUser && (idx === totalMsgs - 1 || chat.messages.slice(idx + 1).every(next => String(next.user) !== '1'));

      html += `
        <div class="msg-row ${isUser ? 'from-user' : 'from-other'}">
          <div class="msg-bubble">${m.content}</div>
          ${(isLastUserMsg && String(m.see) === '1') ? `<span class="msg-read-status">읽음</span>` : ''}
        </div>
      `;
    });

    msgBox.innerHTML = html;
    roomPage.classList.remove('hidden-page');
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
      document.getElementById('msg-chat-input')?.focus();
    }, 150);
  }

  

  function handleSendMessage() {
    const input = document.getElementById('msg-chat-input');
    if (!input || !input.value.trim() || !currentActiveChatId) return;

    const text = input.value.trim();
    input.value = '';

    
    window.NeoSound?.play('send', 0.85);

    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const chat = (roomData.chats || []).find(c => c.id === currentActiveChatId);
    if (!chat) return;

    const timeInfo = getCurrentFormattedTime();

    const newMsg = {
      owner: 'User',
      content: text,
      hour: timeInfo.hour,
      min: timeInfo.min,
      Period: timeInfo.Period,
      user: '1',
      see: '0',
      dateKey: timeInfo.dateKey,
      timeText: timeInfo.timeText,
      fullSeparator: timeInfo.fullSeparator
    };

    
    chat.messages.push(newMsg);
    chat.lastSnippet = text;
    chat.lastDateKey = timeInfo.dateKey;
    chat.lastTimeText = timeInfo.timeText;
    saveRoomData(roomId, roomData);
    openChatRoom(currentActiveChatId);

    const sendPayload = {
      type: 'message_send',
      to: chat.name,
      content: text,
      hour: timeInfo.hour,
      min: timeInfo.min,
      Period: timeInfo.Period,
      user: '1'
    };

    
    if (window.NeoActionQueue) {
      window.NeoActionQueue.add({
        app: 'message',
        type: 'send',
        label: `메시지: ${chat.name}`,
        summary: text,
        payload: sendPayload,
        rawString: `<message>\n${JSON.stringify(sendPayload)}\n</message>`
      });
    } else {
      sendPromptToAIStudio(sendPayload);
    }
  }

  
  function processIncomingMessageBlock(innerContent) {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    let changed = false;

    const objRegex = /\{[^{}]*?\}/g;
    let match;

    while ((match = objRegex.exec(innerContent)) !== null) {
      try {
        const item = JSON.parse(match[0]);

        if (item.line && item.line.toLowerCase() === 'down') continue;

        if (item.type === 'new_adress' && item.name) {
          const exists = (roomData.contacts || []).some(c => c.name === item.name);
          if (!exists) {
            roomData.contacts.push({
              id: 'addr_' + Date.now() + Math.random().toString(36).substring(2, 5),
              name: item.name,
              number: item.number || ''
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
              id: 'mc_' + Date.now() + Math.random().toString(36).substring(2, 5),
              name: targetName,
              lastSnippet: '',
              lastDateKey: '',
              lastTimeText: '',
              messages: []
            };
            roomData.chats.unshift(chat);
          }

          const p = item.Period || 'AM';
          const h = item.hour || '12';
          const m = String(item.min || '00').padStart(2, '0');
          const timeText = `${p === 'AM' ? '오전' : '오후'} ${h}:${m}`;

          const now = new Date();
          const dateKey = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
          const fullSeparator = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${timeText}`;

          const isDuplicated = chat.messages.some(existing =>
            existing.content === cleanText &&
            existing.hour === item.hour &&
            existing.min === item.min &&
            existing.Period === item.Period
          );

          if (!isDuplicated) {
            const isUser = String(item.user) === '1';

            if (!isUser) {
              chat.messages.forEach(msg => {
                if (String(msg.user) === '1' && String(msg.see) === '0') {
                  msg.see = '1';
                }
              });

              
              window.NeoNotification?.showMessage({
                name: targetName,
                text: cleanText
              });
            }

            chat.messages.push({
              owner: targetName,
              content: cleanText,
              hour: String(h),
              min: String(m),
              Period: p,
              user: isUser ? '1' : '0',
              see: isUser ? '1' : '0',
              dateKey: dateKey,
              timeText: timeText,
              fullSeparator: fullSeparator
            });

            chat.lastSnippet = cleanText.split('\n')[0];
            chat.lastDateKey = dateKey;
            chat.lastTimeText = timeText;
            changed = true;
          }
        }
      } catch (e) {}
    }

    if (changed) {
      saveRoomData(roomId, roomData);
      renderThreadsList();
      syncAppIconBadge();

      if (currentActiveChatId) {
        openChatRoom(currentActiveChatId);
      }
    }
  }

  function scanAndProcessCompletedMessageTags() {
    const turns = document.querySelectorAll('ms-chat-turn');
    if (!turns.length) return;

    const completeTagRegex = /(?:<message>|&lt;message&gt;)([\s\S]*?)(?:<\/message>|&lt;\/message&gt;)/i;

    turns.forEach((turn) => {
      const turnText = turn.textContent || '';

      if (turnText.includes('message_send')) {
        turn.classList.add('neo-message-hidden-block');
        turn.style.display = 'none';
        return;
      }

      if (turn.dataset.msgProcessed === 'true') return;

      const hasOpen = turnText.includes('<message>') || turnText.includes('&lt;message&gt;');
      const hasClose = turnText.includes('</message>') || turnText.includes('&lt;/message&gt;');

      if (!hasOpen || !hasClose) return;

      const match = turnText.match(completeTagRegex);
      if (match && match[1]) {
        processIncomingMessageBlock(match[1]);
        turn.dataset.msgProcessed = 'true';

        turn.querySelectorAll('p, pre, ms-code-block, mat-expansion-panel').forEach((block) => {
          if (block.textContent && block.textContent.includes('message')) {
            block.classList.add('neo-message-hidden-block');
            block.style.display = 'none';
          }
        });
      }
    });
  }

  function updateTransformOriginToAppIcon(view) {
    const screen = document.querySelector('.neo-phone-screen');
    const icon = document.querySelector('.neo-phone-app-item[data-app-id="message"] .neo-phone-app-icon') ||
                 document.querySelector('.neo-phone-app-item[data-app-id="message"]');
    if (!screen || !icon || !view) return;
    const sRect = screen.getBoundingClientRect();
    const iRect = icon.getBoundingClientRect();
    const cx = (iRect.left + iRect.width / 2) - sRect.left;
    const cy = (iRect.top + iRect.height / 2) - sRect.top;
    view.style.transformOrigin = `${cx}px ${cy}px`;
  }

  function openMessage() {
    let msgView = document.getElementById('neo-message-view');
    if (!msgView) {
      injectMessageView();
      msgView = document.getElementById('neo-message-view');
    }
    if (!msgView) return;

    updateTransformOriginToAppIcon(msgView);
    msgView.style.display = 'flex';
    msgView.classList.remove('closing');
    void msgView.offsetWidth;
    msgView.classList.add('active');

    renderThreadsList();
    syncAppIconBadge();
  }

  function closeMessage() {
    const msgView = document.getElementById('neo-message-view');
    if (msgView && msgView.classList.contains('active')) {
      updateTransformOriginToAppIcon(msgView);
      msgView.classList.remove('active');
      msgView.classList.add('closing');
      setTimeout(() => {
        msgView.classList.remove('closing');
        msgView.style.display = 'none';
        document.getElementById('msg-page-chat')?.classList.add('hidden-page');
        currentActiveChatId = null;
      }, 340);
    }
  }

  function bindEvents(view) {
    view.querySelectorAll('.msg-home-bar-touch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMessage();
      });
    });

    view.querySelector('#msg-chat-back-btn')?.addEventListener('click', () => {
      document.getElementById('msg-page-chat').classList.add('hidden-page');
      currentActiveChatId = null;
      renderThreadsList();
      syncAppIconBadge();
    });

    const sendBtn = view.querySelector('#msg-send-btn');
    const msgInput = view.querySelector('#msg-chat-input');

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
      renderThreadsList();
      syncAppIconBadge();
    }
  }

  function safeScanExecution() {
    if (isThrottled) return;
    isThrottled = true;

    requestAnimationFrame(() => {
      isThrottled = false;
      msgObserver.disconnect();
      try {
        scanAndProcessCompletedMessageTags();
        handleRoomChange();
      } finally {
        msgObserver.observe(document.body, {
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
        if (appId === 'message') openMessage();
      });
    }

    window.addEventListener('neo-phone-app-click', (e) => {
      if (e.detail?.appId === 'message') openMessage();
    });
  }

  
  function waitScreenReady() {
    const check = setInterval(() => {
      const screen = document.querySelector('.neo-phone-screen');
      if (screen) {
        clearInterval(check);
        injectMessageView();
        setupLaunch();
        scanAndProcessCompletedMessageTags();
        syncAppIconBadge();
      }
    }, 100);
  }
  waitScreenReady();

  const msgObserver = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      if (m.type === 'characterData') {
        const val = m.target.nodeValue || '';
        if (val.includes('message') || val.includes('message_send')) {
          relevant = true;
          break;
        }
      } else {
        for (const n of m.addedNodes) {
          const tc = n.textContent || '';
          if (tc.includes('message') || tc.includes('message_send')) {
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

  msgObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.NeoMessage = {
    open: openMessage,
    close: closeMessage,
    syncBadges: syncAppIconBadge
  };
})();