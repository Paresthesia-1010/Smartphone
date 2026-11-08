
(function () {
  'use strict';

  console.log('[Smartphone System] action-queue.js loaded.');

  const STYLE_ID = 'neo-action-queue-style';
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    
    #neo-action-dock {
      position: absolute;
      right: calc(100% + 14px);
      bottom: 24px;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      gap: 10px;
      z-index: 9999;
      pointer-events: auto;
      user-select: none;
    }

    
    .neo-dock-send-trigger {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #007aff, #00c6ff);
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      box-shadow: 0 6px 18px rgba(0, 122, 255, 0.45);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
    }
    .neo-dock-send-trigger:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 24px rgba(0, 122, 255, 0.65);
    }
    .neo-dock-send-trigger:active {
      transform: scale(0.92);
    }
    .neo-dock-send-trigger svg {
      width: 22px;
      height: 22px;
      stroke: #ffffff;
      fill: none;
      margin-left: 2px;
    }

    
    .neo-dock-count-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ef4444;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      padding: 0 4px;
      display: none;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #000;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.6);
      animation: neo-badge-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes neo-badge-pop {
      0% { transform: scale(0); }
      80% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    
    .neo-dock-items-rail {
      display: flex;
      flex-direction: column-reverse;
      gap: 7px;
      align-items: center;
    }

    .neo-dock-mini-chip {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(0,0,0,0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      animation: neo-chip-slide-up 0.25s ease-out;
    }
    .neo-dock-mini-chip:hover {
      transform: scale(1.15) translateX(-4px);
    }
    @keyframes neo-chip-slide-up {
      from { opacity: 0; transform: translateY(12px) scale(0.6); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .neo-chip-kt { background: #fee500; color: #000000; }
    .neo-chip-msg { background: #007aff; color: #ffffff; }
    .neo-chip-ig-like { background: #ef4444; color: #ffffff; }
    .neo-chip-ig-comment { background: #8b5cf6; color: #ffffff; }
    .neo-chip-ig-follow { background: #10b981; color: #ffffff; }
    .neo-chip-ig-dm { background: linear-gradient(135deg, #a855f7, #ec4899); color: #ffffff; }

    .neo-dock-mini-chip svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.2;
    }

    
    #neo-action-drawer {
      position: absolute;
      right: calc(100% + 20px);
      bottom: 20px;
      width: 320px;
      max-height: 480px;
      background: rgba(18, 18, 20, 0.94);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      box-shadow: -8px 12px 36px rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      z-index: 10000;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", sans-serif;
      box-sizing: border-box;
      overflow: hidden;

      transform: translateX(40px) scale(0.92);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease;
    }

    #neo-action-drawer.open {
      transform: translateX(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .neo-drawer-header {
      padding: 12px 14px;
      border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .neo-drawer-title-row {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
    }
    .neo-drawer-clear-btn {
      background: transparent;
      border: none;
      color: #8e8e93;
      font-size: 11px;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 6px;
      transition: color 0.15s;
    }
    .neo-drawer-clear-btn:hover { color: #ef4444; }

    
    .neo-drawer-action-list {
      max-height: 180px;
      overflow-y: auto;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.25);
    }
    .neo-drawer-action-list::-webkit-scrollbar { display: none; }

    .neo-action-item-card {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 6px 8px;
      font-size: 11.5px;
      position: relative;
    }
    .neo-action-item-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .neo-action-item-badge {
      font-size: 10px;
      font-weight: 700;
      color: #93c5fd;
    }
    .neo-action-item-summary {
      font-size: 11px;
      color: #d1d5db;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .neo-action-item-remove {
      background: transparent;
      border: none;
      color: #71717a;
      cursor: pointer;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;
      line-height: 1;
    }
    .neo-action-item-remove:hover { color: #ef4444; }

    .neo-drawer-empty-hint {
      text-align: center;
      padding: 16px 8px;
      color: #71717a;
      font-size: 11.5px;
    }

    
    .neo-drawer-input-area {
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: #141416;
      border-top: 0.5px solid rgba(255, 255, 255, 0.08);
    }
    .neo-drawer-textarea {
      width: 100%;
      height: 72px;
      background: #1c1c1e;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 8px 10px;
      color: #ffffff;
      font-size: 12px;
      font-family: inherit;
      resize: none;
      outline: none;
      box-sizing: border-box;
      line-height: 1.4;
    }
    .neo-drawer-textarea::placeholder {
      color: #636366;
    }
    .neo-drawer-textarea:focus {
      border-color: #007aff;
    }

    .neo-drawer-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .neo-drawer-hint-text {
      font-size: 10px;
      color: #71717a;
    }
    .neo-drawer-send-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #007aff;
      border: none;
      border-radius: 10px;
      padding: 6px 14px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s;
    }
    .neo-drawer-send-btn:hover { background: #0066d6; }
    .neo-drawer-send-btn:active { transform: scale(0.95); }
    .neo-drawer-send-btn svg { width: 13px; height: 13px; stroke: #fff; fill: none; }
  `;

  
  let actionQueue = [];
  let isDrawerOpen = false;

  const ICONS_MAP = {
    kakaotalk: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.87 1.9 5.38 4.77 6.75l-1.2 4.41c-.1.37.31.68.64.48l5.22-3.46c.19.01.38.02.57.02 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>`,
    message: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
    'ig-like': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    'ig-comment': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    'ig-follow': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
    'ig-dm': `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`
  };

  function getChipStyleClass(action) {
    if (action.app === 'kakaotalk') return 'neo-chip-kt';
    if (action.app === 'message') return 'neo-chip-msg';
    if (action.app === 'instagram') {
      if (action.type === 'like') return 'neo-chip-ig-like';
      if (action.type === 'comment') return 'neo-chip-ig-comment';
      if (action.type === 'follow' || action.type === 'unfollow') return 'neo-chip-ig-follow';
      if (action.type === 'DM') return 'neo-chip-ig-dm';
    }
    return 'neo-chip-msg';
  }

  function getIconSvg(action) {
    if (action.app === 'kakaotalk') return ICONS_MAP.kakaotalk;
    if (action.app === 'message') return ICONS_MAP.message;
    if (action.app === 'instagram') {
      if (action.type === 'like') return ICONS_MAP['ig-like'];
      if (action.type === 'comment') return ICONS_MAP['ig-comment'];
      if (action.type === 'follow' || action.type === 'unfollow') return ICONS_MAP['ig-follow'];
      if (action.type === 'DM') return ICONS_MAP['ig-dm'];
    }
    return ICONS_MAP.message;
  }

  
  function enqueueAction(action) {
    actionQueue.push({
      id: 'act_' + Date.now() + Math.random().toString(36).substring(2, 5),
      ...action
    });
    renderActionDock();
    renderActionDrawer();
    window.NeoSound?.play('pop', 0.7);
  }

  
  function removeAction(id) {
    actionQueue = actionQueue.filter(a => a.id !== id);
    renderActionDock();
    renderActionDrawer();
  }

  
  function clearQueue() {
    actionQueue = [];
    renderActionDock();
    renderActionDrawer();
  }

  
  function dispatchToAIStudio(finalCombinedText) {
    const textarea = document.querySelector('ms-prompt-box textarea') ||
                     document.querySelector('textarea[aria-label*="Prompt"]') ||
                     document.querySelector('ms-prompt-box .ql-editor');

    if (textarea) {
      if (textarea.tagName === 'TEXTAREA') {
        const proto = Object.getPrototypeOf(textarea);
        const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (setter) {
          setter.call(textarea, finalCombinedText);
        } else {
          textarea.value = finalCombinedText;
        }
        textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      } else {
        textarea.innerHTML = `<p>${finalCombinedText.replace(/\n/g, '<br>')}</p>`;
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

  
  function executeSendBundle() {
    const inputEl = document.getElementById('neo-drawer-user-input');
    const userText = inputEl ? inputEl.value.trim() : '';

    if (actionQueue.length === 0 && !userText) {
      return;
    }

    
    const formatInstructions = [

    ].join('\n');

    
    const promptParts = [];

    
    if (userText) {
      promptParts.push(userText);
    }

    
    actionQueue.forEach(item => {
      if (item.rawString) {
        promptParts.push(item.rawString);
      }
    });

    
    promptParts.push(formatInstructions);

    
    const finalPrompt = promptParts.join('\n\n\n');

    
    window.NeoSound?.play('send', 0.9);

    
    dispatchToAIStudio(finalPrompt);

    
    clearQueue();
    if (inputEl) inputEl.value = '';
    closeDrawer();
  }

  function toggleDrawer() {
    if (isDrawerOpen) closeDrawer();
    else openDrawer();
  }

  function openDrawer() {
    isDrawerOpen = true;
    const drawer = document.getElementById('neo-action-drawer');
    if (drawer) {
      drawer.classList.add('open');
      setTimeout(() => {
        document.getElementById('neo-drawer-user-input')?.focus();
      }, 150);
    }
  }

  function closeDrawer() {
    isDrawerOpen = false;
    const drawer = document.getElementById('neo-action-drawer');
    if (drawer) drawer.classList.remove('open');
  }

  function renderActionDock() {
    const badge = document.getElementById('neo-dock-badge');
    const rail = document.getElementById('neo-dock-rail');
    if (!badge || !rail) return;

    if (actionQueue.length > 0) {
      badge.textContent = actionQueue.length > 99 ? '99+' : actionQueue.length;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }

    rail.innerHTML = actionQueue.slice(-4).map(action => `
      <div class="neo-dock-mini-chip ${getChipStyleClass(action)}" data-id="${action.id}" title="${action.label}: ${action.summary}">
        ${getIconSvg(action)}
      </div>
    `).join('');

    rail.querySelectorAll('.neo-dock-mini-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        openDrawer();
      });
    });
  }

  function renderActionDrawer() {
    const listContainer = document.getElementById('neo-drawer-list');
    if (!listContainer) return;

    if (actionQueue.length === 0) {
      listContainer.innerHTML = `<div class="neo-drawer-empty-hint">대기 중인 행동이 없습니다.<br>스마트폰에서 버튼을 누르면 여기에 담깁니다.</div>`;
      return;
    }

    listContainer.innerHTML = actionQueue.map(item => `
      <div class="neo-action-item-card" data-id="${item.id}">
        <div style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          ${getIconSvg(item)}
        </div>
        <div class="neo-action-item-info">
          <span class="neo-action-item-badge">${item.label}</span>
          <span class="neo-action-item-summary">${item.summary || ''}</span>
        </div>
        <button type="button" class="neo-action-item-remove" data-id="${item.id}" title="제거">✕</button>
      </div>
    `).join('');

    listContainer.querySelectorAll('.neo-action-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeAction(btn.dataset.id);
      });
    });
  }

  function injectActionQueueUI() {
    const phoneScreen = document.querySelector('.neo-phone-screen');
    if (!phoneScreen || document.getElementById('neo-action-dock')) return;

    const parentContainer = phoneScreen.parentElement || phoneScreen;

    
    const dock = document.createElement('div');
    dock.id = 'neo-action-dock';
    dock.innerHTML = `
      <button type="button" class="neo-dock-send-trigger" id="neo-dock-toggle-btn" title="대기열 열기 및 전송">
        <span class="neo-dock-count-badge" id="neo-dock-badge"></span>
        <svg viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
      <div class="neo-dock-items-rail" id="neo-dock-rail"></div>
    `;

    
    const drawer = document.createElement('div');
    drawer.id = 'neo-action-drawer';
    drawer.innerHTML = `
      <div class="neo-drawer-header">
        <div class="neo-drawer-title-row">
          <span>발송 대기 서랍</span>
        </div>
        <button type="button" class="neo-drawer-clear-btn" id="neo-drawer-clear-btn">비우기</button>
      </div>

      <div class="neo-drawer-action-list" id="neo-drawer-list"></div>

      <div class="neo-drawer-input-area">
        <textarea class="neo-drawer-textarea" id="neo-drawer-user-input" placeholder="함께 전송할 상황/지문/메시지를 입력하세요 (Enter로 전송, Shift+Enter는 줄바꿈)"></textarea>
        <div class="neo-drawer-footer">
          <span class="neo-drawer-hint-text">Enter : 일괄 발송</span>
          <button type="button" class="neo-drawer-send-btn" id="neo-drawer-send-btn">
            <span>발송하기</span>
            <svg viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
      </div>
    `;

    parentContainer.appendChild(dock);
    parentContainer.appendChild(drawer);

    
    document.getElementById('neo-dock-toggle-btn')?.addEventListener('click', toggleDrawer);
    document.getElementById('neo-drawer-clear-btn')?.addEventListener('click', clearQueue);
    document.getElementById('neo-drawer-send-btn')?.addEventListener('click', executeSendBundle);

    const inputArea = document.getElementById('neo-drawer-user-input');
    inputArea?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        executeSendBundle();
      }
    });

    renderActionDock();
    renderActionDrawer();
  }

  
  const checkScreen = setInterval(() => {
    const screen = document.querySelector('.neo-phone-screen');
    if (screen) {
      clearInterval(checkScreen);
      injectActionQueueUI();
    }
  }, 100);

  
  window.NeoActionQueue = {
    add: enqueueAction,
    remove: removeAction,
    clear: clearQueue,
    open: openDrawer,
    close: closeDrawer,
    toggle: toggleDrawer,
    send: executeSendBundle,
    getQueue: () => [...actionQueue]
  };
})();