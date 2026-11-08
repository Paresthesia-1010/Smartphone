
(function () {
  'use strict';
  window.NeoIG = window.NeoIG || {};

  const STORAGE_KEY = 'neo_instagram_data_map';

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
    const rId = roomId || getChatRoomId();
    const store = getStore();
    if (!store[rId]) {
      store[rId] = {
        myId: 'user_me',
        users: {},
        posts: [],
        dmChats: {},
        followingList: []
      };
      saveStore(store);
    }
    const rd = store[rId];
    if (!rd.users) rd.users = {};
    if (!Array.isArray(rd.posts)) rd.posts = [];
    if (!rd.dmChats) rd.dmChats = {};
    if (!Array.isArray(rd.followingList)) rd.followingList = [];
    return rd;
  }

  function saveRoomData(roomData, roomId) {
    const rId = roomId || getChatRoomId();
    const store = getStore();
    store[rId] = roomData;
    saveStore(store);
    window.dispatchEvent(new CustomEvent('neo-ig-data-updated'));
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

    const now = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day_week = days[now.getDay()];

    let period = rawHour < 12 ? 'AM' : 'PM';
    let hour12 = rawHour % 12;
    if (hour12 === 0) hour12 = 12;

    const minStr = String(rawMin).padStart(2, '0');
    const hourStr = String(hour12);

    return {
      year: String(now.getFullYear()),
      month: String(now.getMonth() + 1),
      day: String(now.getDate()),
      hour: hourStr,
      min: minStr,
      Period: period,
      day_week: day_week,
      displayTime: `${period === 'AM' ? '오전' : '오후'} ${hourStr}:${minStr}`
    };
  }

  
  function sendPromptToAIStudio(payloadObj) {
    const jsonStr = `<insta>\n${JSON.stringify(payloadObj)}\n</insta>`;

    if (window.NeoActionQueue) {
      let label = '인스타그램';
      let summary = '';

      if (payloadObj.group === 'like') {
        label = '인스타 좋아요';
        summary = `게시물 ID: ${payloadObj.to_post}`;
      } else if (payloadObj.group === 'comment') {
        label = '인스타 댓글';
        summary = payloadObj.content;
      } else if (payloadObj.group === 'follow') {
        label = '인스타 팔로우';
        summary = `@${payloadObj.to}`;
      } else if (payloadObj.group === 'unfollow') {
        label = '인스타 언팔로우';
        summary = `@${payloadObj.to}`;
      } else if (payloadObj.group === 'DM') {
        label = `인스타 DM: ${payloadObj.to}`;
        summary = payloadObj.content;
      }

      window.NeoActionQueue.add({
        app: 'instagram',
        type: payloadObj.group,
        label: label,
        summary: summary,
        payload: payloadObj,
        rawString: jsonStr
      });
      return;
    }

        const textarea = document.querySelector('ms-prompt-box textarea') ||
                     document.querySelector('textarea[aria-label*="Prompt"]') ||
                     document.querySelector('ms-prompt-box .ql-editor');

    if (textarea) {
      if (textarea.tagName === 'TEXTAREA') {
        const proto = Object.getPrototypeOf(textarea);
        const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (setter) setter.call(textarea, jsonStr);
        else textarea.value = jsonStr;
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

  window.NeoIG.Data = {
    getChatRoomId,
    getRoomData,
    saveRoomData,
    getCurrentFormattedTime,
    sendPromptToAIStudio
  };
})();