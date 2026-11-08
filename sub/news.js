
(function () {
  'use strict';

  console.log('[AI Studio News] Lag-Free, Safe-Stream news.js loaded.');

  
  const newsStyleId = 'neo-news-style';
  if (!document.getElementById(newsStyleId)) {
    const style = document.createElement('style');
    style.id = newsStyleId;
    style.textContent = `
      
      news_gui,
      ms-chat-turn news_gui,
      .neo-news-hidden-block {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      
      #neo-news-trigger {
        position: fixed;
        top: 66px;
        right: 24px;
        z-index: 1000;
        background: rgba(26, 26, 26, 0.75);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        transition: all 0.2s ease;
        padding: 0;
        outline: none;
      }

      #neo-news-trigger:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: #ffffff;
        transform: scale(1.05);
      }

      #neo-news-trigger:active {
        transform: scale(0.96);
      }

      #neo-news-trigger svg {
        width: 20px;
        height: 20px;
        stroke: currentColor;
      }

      .neo-news-unread-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ef4444;
        color: #ffffff;
        font-size: 10.5px;
        font-weight: 700;
        min-width: 18px;
        height: 18px;
        padding: 0 4px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.6);
        pointer-events: none;
        line-height: 1;
        animation: badgePop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes badgePop {
        from { transform: scale(0.5); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      #neo-news-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 1999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      #neo-news-backdrop.open {
        opacity: 1;
        pointer-events: auto;
      }

      #neo-news-panel {
        position: fixed;
        top: 14px;
        right: 14px;
        bottom: 14px;
        width: 440px;
        max-width: calc(100vw - 28px);
        height: calc(100vh - 28px);
        background: rgba(14, 14, 14, 0.96);
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
        z-index: 2000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateX(calc(100% + 28px));
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      #neo-news-panel.open {
        transform: translateX(0);
      }

      .neo-news-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
      }

      .neo-news-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
      }

      .neo-news-header-title svg {
        width: 17px;
        height: 17px;
        color: #a3a3a3;
      }

      .neo-news-close-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #a3a3a3;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;
      }

      .neo-news-close-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateX(3px);
      }

      .neo-news-close-btn svg { width: 17px; height: 17px; }

      .neo-news-category-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 18px;
        overflow-x: auto;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(0, 0, 0, 0.2);
      }

      .neo-news-category-bar::-webkit-scrollbar { height: 3px; }
      .neo-news-category-bar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 3px; }

      .neo-news-cat-chip {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 5px 11px;
        font-size: 11.5px;
        font-weight: 600;
        color: #8c8c8c;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
      }

      .neo-news-cat-chip:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      .neo-news-cat-chip.active {
        background: #ffffff;
        color: #000000;
        border-color: #ffffff;
      }

      .neo-news-body {
        flex: 1;
        padding: 16px 18px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .neo-news-body::-webkit-scrollbar { width: 4px; }
      .neo-news-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }

      .neo-news-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 14px 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .neo-news-card:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .neo-news-card.unread {
        border-left: 3px solid #ef4444;
        background: rgba(239, 68, 68, 0.03);
      }

      .neo-news-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }

      .neo-news-header-left {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        flex: 1;
      }

      .neo-news-platform-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
        letter-spacing: -0.2px;
        flex-shrink: 0;
      }

      .neo-news-card-title {
        font-size: 13.5px;
        font-weight: 700;
        color: #f5f5f5;
        line-height: 1.4;
      }

      .neo-news-accordion-icon {
        color: #737373;
        transition: transform 0.25s ease;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .neo-news-accordion-icon svg { width: 15px; height: 15px; }

      .neo-news-card.expanded .neo-news-accordion-icon {
        transform: rotate(180deg);
        color: #ffffff;
      }

      .neo-news-card-body {
        display: none;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 13px;
        line-height: 1.65;
        color: #d4d4d4;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .neo-news-card.expanded .neo-news-card-body {
        display: block;
        animation: fadeInBody 0.2s ease forwards;
      }

      @keyframes fadeInBody {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .neo-news-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2px;
      }

      .neo-news-date {
        font-size: 11px;
        color: #737373;
        font-weight: 500;
      }

      .neo-news-status {
        font-size: 10.5px;
        font-weight: 600;
        color: #a3a3a3;
        background: rgba(255, 255, 255, 0.05);
        padding: 2px 7px;
        border-radius: 6px;
      }

      
      .neo-comments-section {
        margin-top: 6px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .neo-comments-toggle-btn {
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 4px 9px;
        font-size: 11px;
        font-weight: 600;
        color: #a3a3a3;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .neo-comments-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.09);
        color: #ffffff;
      }

      .neo-comments-toggle-btn svg {
        width: 12px;
        height: 12px;
        transition: transform 0.2s ease;
      }

      .neo-comments-toggle-btn.open svg {
        transform: rotate(180deg);
      }

      .neo-comments-list {
        display: none;
        flex-direction: column;
        gap: 6px;
      }

      .neo-comments-list.open {
        display: flex;
        animation: fadeInBody 0.2s ease forwards;
      }

      .neo-comment-item {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 9px;
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .neo-comment-item.is-reply {
        margin-left: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-left: 2px solid rgba(249, 115, 22, 0.45);
      }

      .neo-comment-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11.5px;
      }

      .neo-comment-reply-arrow {
        color: #f97316;
        font-weight: 700;
        font-size: 12px;
        line-height: 1;
      }

      .neo-comment-owner {
        font-weight: 700;
        color: #ffffff;
      }

      .neo-comment-parent-badge {
        font-size: 10px;
        font-weight: 600;
        color: #f97316;
        background: rgba(249, 115, 22, 0.12);
        padding: 1px 5px;
        border-radius: 4px;
      }

      .neo-comment-date {
        font-size: 10px;
        color: #737373;
        margin-left: auto;
      }

      .neo-comment-body {
        font-size: 12px;
        color: #d4d4d4;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .neo-news-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        text-align: center;
        margin: auto;
      }

      .neo-news-empty-icon { font-size: 32px; opacity: 0.6; filter: grayscale(1); }
      .neo-news-empty-text { font-size: 13.5px; font-weight: 500; color: #737373; margin: 0; }
    `;
    document.head.appendChild(style);
  }

  
  const STORAGE_KEY = 'neo_news_items_data';
  let activeCategory = 'ALL';

  function getChatRoomId() {
    const path = window.location.pathname;
    const match = path.match(/prompts\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : 'new_chat';
  }

  function getNewsStore() {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      let changed = false;

      
      Object.keys(store).forEach(rId => {
        if (Array.isArray(store[rId])) {
          const beforeLen = store[rId].length;
          store[rId] = store[rId].filter(item => {
            const isCorrupted = item.title.includes('{"content"') || 
                                item.title.includes('news_gui') || 
                                item.title.includes('{"status"');
            return !isCorrupted;
          });
          if (store[rId].length !== beforeLen) changed = true;
        }
      });

      if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      return store;
    } catch (e) {
      return {};
    }
  }

  function saveNewsStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function getRoomNews(roomId) {
    const store = getNewsStore();
    return store[roomId] || [];
  }

  function addOrUpdateNewsAndComments(roomId, newsData, comments) {
    const store = getNewsStore();
    if (!store[roomId]) store[roomId] = [];

    let targetPost = null;

    if (newsData && (newsData.title || newsData.content)) {
      if (newsData.id) {
        targetPost = store[roomId].find(item => item.id === newsData.id);
      }
      if (!targetPost && newsData.title) {
        targetPost = store[roomId].find(item => item.title === newsData.title && item.platform === newsData.platform);
      }

      if (!targetPost) {
        targetPost = {
          id: newsData.id || ('news_' + Date.now()),
          platform: newsData.platform || '소식',
          title: newsData.title || '제목 없음',
          content: newsData.content || '',
          status: newsData.status || '게시글',
          dateStr: newsData.dateStr || '방금 전',
          vist: 0,
          timestamp: Date.now(),
          comments: []
        };
        store[roomId].unshift(targetPost);
      } else {
        if (newsData.id) targetPost.id = newsData.id;
        if (newsData.content) targetPost.content = newsData.content;
        if (newsData.dateStr) targetPost.dateStr = newsData.dateStr;
      }
    }

    if (comments && comments.length > 0) {
      comments.forEach(cmt => {
        let post = null;
        if (cmt.id) {
          post = store[roomId].find(item => item.id === cmt.id);
        }
        if (!post && targetPost) {
          post = targetPost;
          if (!post.id) post.id = cmt.id;
        }
        if (!post && store[roomId].length > 0) {
          post = store[roomId][0];
          if (cmt.id && !post.id) post.id = cmt.id;
        }

        if (post) {
          if (!Array.isArray(post.comments)) post.comments = [];
          const exists = post.comments.some(existing => 
            existing.owner === cmt.owner &&
            existing.comment === cmt.comment &&
            existing.dateStr === cmt.dateStr
          );
          if (!exists) {
            post.comments.push(cmt);
          }
        }
      });
    }

    saveNewsStore(store);
    return true;
  }

  function setNewsVisited(roomId, newsId) {
    const store = getNewsStore();
    const list = store[roomId];
    if (!list) return;

    const target = list.find(item => item.id === newsId);
    if (target && target.vist === 0) {
      target.vist = 1;
      saveNewsStore(store);
      updateNewsBadge();
    }
  }

  
  function extractCommentsFromText(plainText) {
    const comments = [];
    const regex = /\{[^{}]*?"comment"[\s\S]*?\}/g;
    let match;

    while ((match = regex.exec(plainText)) !== null) {
      const chunk = match[0];
      try {
        const idMatch = chunk.match(/"id"\s*:\s*"([^"]+)"/i);
        const ownerMatch = chunk.match(/"owner"\s*:\s*"([^"]+)"/i);
        const parentMatch = chunk.match(/"parent"\s*:\s*"([^"]+)"/i);
        const cmtMatch = chunk.match(/"comment"\s*:\s*"((?:\\.|[^"\\])*?)"/i) ||
                         chunk.match(/"comment"\s*:\s*"?([^"}\r\n]+)"?/i);

        const y = (chunk.match(/"year"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
        const m = (chunk.match(/"month"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
        const d = (chunk.match(/"day"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
        const h = (chunk.match(/"hour"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
        const min = (chunk.match(/"min"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
        const period = (chunk.match(/"Period"\s*:\s*"([^"]+)"/i) || [])[1] || '';
        const dayWeek = (chunk.match(/"day_week"\s*:\s*"([^"]+)"/i) || [])[1] || '';

        let dateStr = '';
        if (y && m && d) {
          const paddedMin = min ? (min.length === 1 ? '0' + min : min) : '00';
          const timePart = h ? ` ${period ? period + ' ' : ''}${h}:${paddedMin}` : '';
          const weekPart = dayWeek ? ` (${dayWeek})` : '';
          dateStr = `${y}.${m}.${d}${weekPart}${timePart}`.trim();
        }

        if (cmtMatch) {
          let commentText = cmtMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
          comments.push({
            id: idMatch ? idMatch[1] : '',
            owner: ownerMatch ? ownerMatch[1] : '익명',
            parent: parentMatch ? parentMatch[1] : 'none',
            comment: commentText,
            dateStr: dateStr || '방금 전'
          });
        }
      } catch (e) {}
    }
    return comments;
  }

  function extractNewsDataFromText(plainText) {
    if (!plainText) return null;
    try {
      const idMatch = plainText.match(/"id"\s*:\s*"([^"]+)"/i);
      const id = idMatch ? idMatch[1].trim() : '';

      
      let platform = '소식';
      const pMatch = plainText.match(/"platform"\s*:\s*"([^"\\{}\[\]\r\n]+)"/i) ||
                     plainText.match(/"platform"\s*:\s*([a-zA-Z0-9가-힣_]+)/i);
      if (pMatch) {
        platform = pMatch[1].replace(/[\[\{\}\]"'\\]+/g, '').trim();
      }
      if (!platform) platform = '소식';

      
      let status = '게시글';
      const sMatch = plainText.match(/"status"\s*:\s*"([^"\\{}\[\]\r\n]+)"/i) ||
                     plainText.match(/"status"\s*:\s*([a-zA-Z0-9가-힣_]+)/i);
      if (sMatch) {
        status = sMatch[1].replace(/[\[\{\}\]"'\\]+/g, '').trim();
      }
      if (!status) status = '게시글';

      
      let title = '';
      const tMatch = plainText.match(/"title"\s*:\s*"((?:\\.|[^"\\])*?)"/i);
      if (tMatch) {
        title = tMatch[1].trim();
      } else {
        const tFallback = plainText.match(/"title"\s*:\s*"?([\s\S]*?)(?=(?:"?\s*\}?\s*\{"content"|\r?\n|$))/i);
        if (tFallback) title = tFallback[1].replace(/["}\s]+$/, '').trim();
      }

      
      let content = '';
      const cMatch = plainText.match(/"content"\s*:\s*"((?:\\.|[\s\S])*?)"\s*}/i);
      if (cMatch) {
        content = cMatch[1].trim();
      } else {
        const cFallback = plainText.match(/"content"\s*:\s*"?([\s\S]*?)(?=(?:"?\s*\}?\s*\{"status"|\[\s*\{"id"|$))/i);
        if (cFallback) content = cFallback[1].replace(/["{\s]+$/, '').trim();
      }

      if (content) content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      if (title) title = title.replace(/\\n/g, ' ').replace(/\\"/g, '"');

      
      const year = (plainText.match(/"year"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
      const month = (plainText.match(/"month"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
      const day = (plainText.match(/"day"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
      const hour = (plainText.match(/"hour"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
      const min = (plainText.match(/"min"\s*:\s*"?(\d+)"?/i) || [])[1] || '';
      const period = (plainText.match(/"Period"\s*:\s*"([^"]+)"/i) || [])[1] || '';
      const dayWeek = (plainText.match(/"day_week"\s*:\s*"([^"]+)"/i) || [])[1] || '';

      let dateStr = '';
      if (year && month && day) {
        const paddedMin = min ? (min.length === 1 ? '0' + min : min) : '00';
        const timePart = hour ? ` ${period ? period + ' ' : ''}${hour}:${paddedMin}` : '';
        const weekPart = dayWeek ? ` (${dayWeek})` : '';
        dateStr = `${year}.${month}.${day}${weekPart}${timePart}`.trim();
      }

      if (!title && !content) return null;

      return {
        id,
        platform,
        title: title || '제목 없음',
        content: content || '',
        status,
        dateStr: dateStr || '방금 전'
      };
    } catch (e) {
      return null;
    }
  }

  
  function scanAndProcessCompletedNewsGui() {
    const roomId = getChatRoomId();
    
    const turns = document.querySelectorAll('ms-chat-turn');
    if (!turns.length) return;

    let hasNewData = false;

    
    const completeTagRegex = /(?:<news_gui>|&lt;news_gui&gt;)([\s\S]*?)(?:<\/news_gui>|&lt;\/news_gui&gt;)/i;

    turns.forEach(turn => {
      
      if (turn.dataset.newsProcessed === 'true') return;

      const turnText = turn.textContent || '';
      const hasOpen = turnText.includes('<news_gui>') || turnText.includes('&lt;news_gui&gt;');
      const hasClose = turnText.includes('</news_gui>') || turnText.includes('&lt;/news_gui&gt;');

      
      if (!hasOpen || !hasClose) return; 

      const match = turnText.match(completeTagRegex);
      if (match && match[1]) {
        const innerContent = match[1];

        
        const newsData = extractNewsDataFromText(innerContent);
        const comments = extractCommentsFromText(innerContent);

        if (addOrUpdateNewsAndComments(roomId, newsData, comments)) {
          hasNewData = true;
        }

        
        turn.dataset.newsProcessed = 'true';

        
        turn.querySelectorAll('p, pre, ms-code-block, mat-expansion-panel').forEach(block => {
          const bText = block.textContent || '';
          if (bText.includes('news_gui')) {
            block.classList.add('neo-news-hidden-block');
            block.style.display = 'none';
          }
        });
      }
    });

    if (hasNewData) {
      updateNewsBadge();
      const panel = document.getElementById('neo-news-panel');
      if (panel && panel.classList.contains('open')) {
        renderNewsContent();
      }
    }
  }

  
  function updateNewsBadge() {
    const roomId = getChatRoomId();
    const list = getRoomNews(roomId);
    const unreadCount = list.filter(item => item.vist === 0).length;

    const trigger = document.getElementById('neo-news-trigger');
    if (!trigger) return;

    let badge = trigger.querySelector('.neo-news-unread-badge');
    if (unreadCount > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'neo-news-unread-badge';
        trigger.appendChild(badge);
      }
      badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      badge.style.display = 'flex';
    } else if (badge) {
      badge.remove();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderNewsContent() {
    const roomId = getChatRoomId();
    const list = getRoomNews(roomId);
    const categoryContainer = document.getElementById('neo-news-category-bar');
    const bodyContainer = document.getElementById('neo-news-body');

    if (!categoryContainer || !bodyContainer) return;

    if (list.length === 0) {
      categoryContainer.innerHTML = '';
      bodyContainer.innerHTML = `
        <div class="neo-news-empty">
          <div class="neo-news-empty-icon">📰</div>
          <p class="neo-news-empty-text">불러올 정보가 없습니다.</p>
        </div>
      `;
      return;
    }

    const platforms = ['ALL', ...new Set(list.map(i => i.platform))];
    categoryContainer.innerHTML = platforms.map(plat => {
      const count = plat === 'ALL' ? list.length : list.filter(i => i.platform === plat).length;
      const label = plat === 'ALL' ? `전체 (${count})` : `${plat} (${count})`;
      const isActive = activeCategory === plat ? 'active' : '';
      return `<button type="button" class="neo-news-cat-chip ${isActive}" data-category="${plat}">${escapeHtml(label)}</button>`;
    }).join('');

    categoryContainer.querySelectorAll('.neo-news-cat-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        activeCategory = chip.dataset.category;
        renderNewsContent();
      });
    });

    const filteredList = activeCategory === 'ALL' ? list : list.filter(i => i.platform === activeCategory);

    bodyContainer.innerHTML = filteredList.map(item => {
      const comments = Array.isArray(item.comments) ? item.comments : [];
      const hasComments = comments.length > 0;

      const commentsHtml = comments.map(c => {
        const isReply = c.parent && c.parent.toLowerCase() !== 'none';
        return `
          <div class="neo-comment-item ${isReply ? 'is-reply' : ''}">
            <div class="neo-comment-header">
              ${isReply ? '<span class="neo-comment-reply-arrow">↳</span>' : ''}
              <span class="neo-comment-owner">${escapeHtml(c.owner)}</span>
              ${isReply ? `<span class="neo-comment-parent-badge">@${escapeHtml(c.parent)}</span>` : ''}
              <span class="neo-comment-date">${escapeHtml(c.dateStr)}</span>
            </div>
            <div class="neo-comment-body">${escapeHtml(c.comment)}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="neo-news-card ${item.vist === 0 ? 'unread' : ''}" data-id="${item.id}">
          <div class="neo-news-card-header">
            <div class="neo-news-header-left">
              <span class="neo-news-platform-badge">${escapeHtml(item.platform)}</span>
              <span class="neo-news-card-title">${escapeHtml(item.title)}</span>
            </div>
            <span class="neo-news-accordion-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>

          <div class="neo-news-card-body">${escapeHtml(item.content).replace(/\n/g, '<br>')}</div>

          <div class="neo-news-card-footer">
            <span class="neo-news-date">${escapeHtml(item.dateStr)}</span>
            <span class="neo-news-status">${escapeHtml(item.status)}</span>
          </div>

          ${hasComments ? `
            <div class="neo-comments-section">
              <button type="button" class="neo-comments-toggle-btn" data-target="cmt-${item.id}">
                <span>💬 댓글 ${comments.length}개</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="neo-comments-list" id="cmt-${item.id}">
                ${commentsHtml}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    bodyContainer.querySelectorAll('.neo-news-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const isExpanded = card.classList.toggle('expanded');
        if (isExpanded) {
          setNewsVisited(roomId, id);
          card.classList.remove('unread');
        }
      });
    });

    bodyContainer.querySelectorAll('.neo-comments-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.dataset.target;
        const listEl = document.getElementById(targetId);
        if (listEl) {
          const isOpen = listEl.classList.toggle('open');
          btn.classList.toggle('open', isOpen);
        }
      });
    });
  }

  
  function openNewsModal() {
    const panel = document.getElementById('neo-news-panel');
    const backdrop = document.getElementById('neo-news-backdrop');
    if (panel && backdrop) {
      renderNewsContent();
      panel.classList.add('open');
      backdrop.classList.add('open');
    }
  }

  function closeNewsModal() {
    const panel = document.getElementById('neo-news-panel');
    const backdrop = document.getElementById('neo-news-backdrop');
    if (panel && backdrop) {
      panel.classList.remove('open');
      backdrop.classList.remove('open');
    }
  }

  function toggleNewsModal() {
    const panel = document.getElementById('neo-news-panel');
    if (panel && panel.classList.contains('open')) {
      closeNewsModal();
    } else {
      openNewsModal();
    }
  }

  function injectNewsModal() {
    if (document.getElementById('neo-news-panel')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'neo-news-backdrop';

    const panel = document.createElement('aside');
    panel.id = 'neo-news-panel';
    panel.innerHTML = `
      <div class="neo-news-header">
        <div class="neo-news-header-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
            <path d="M18 14h-8"/>
            <path d="M15 18h-5"/>
            <path d="M10 6h8v4h-8V6Z"/>
          </svg>
          <span>소식 및 업데이트</span>
        </div>
        <button type="button" class="neo-news-close-btn" id="neo-news-close-btn" title="접기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
      <div class="neo-news-category-bar" id="neo-news-category-bar"></div>
      <div class="neo-news-body" id="neo-news-body"></div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    panel.querySelector('#neo-news-close-btn').addEventListener('click', closeNewsModal);
    backdrop.addEventListener('click', closeNewsModal);
  }

  function injectNewsButton() {
    if (document.getElementById('neo-news-trigger')) return;

    const newsBtn = document.createElement('button');
    newsBtn.id = 'neo-news-trigger';
    newsBtn.type = 'button';
    newsBtn.title = 'AI Studio 뉴스 (N)';
    newsBtn.innerHTML = `
      <svg xmlns="http:
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
        <path d="M18 14h-8"/>
        <path d="M15 18h-5"/>
        <path d="M10 6h8v4h-8V6Z"/>
      </svg>
    `;

    newsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNewsModal();
    });

    document.body.appendChild(newsBtn);
    updateNewsBadge();
  }

  function initShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const panel = document.getElementById('neo-news-panel');
        if (panel && panel.classList.contains('open')) {
          closeNewsModal();
          return;
        }
      }

      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const active = document.activeElement;
        const isTyping = active && (
          active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          active.isContentEditable ||
          active.getAttribute('role') === 'textbox'
        );

        if (!isTyping) {
          e.preventDefault();
          toggleNewsModal();
        }
      }
    });
  }

  
  let lastRoomId = null;
  let isThrottled = false;

  function handleRoomChange() {
    const currentRoom = getChatRoomId();
    if (currentRoom !== lastRoomId) {
      lastRoomId = currentRoom;
      activeCategory = 'ALL';
      updateNewsBadge();
      const panel = document.getElementById('neo-news-panel');
      if (panel && panel.classList.contains('open')) {
        renderNewsContent();
      }
    }
  }

  function safeScanExecution() {
    if (isThrottled) return;
    isThrottled = true;

    
    requestAnimationFrame(() => {
      isThrottled = false;

      
      newsObserver.disconnect();
      try {
        scanAndProcessCompletedNewsGui();
        injectNewsModal();
        injectNewsButton();
        handleRoomChange();
      } finally {
        
        newsObserver.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    });
  }

  function init() {
    injectNewsModal();
    injectNewsButton();
    initShortcuts();
    scanAndProcessCompletedNewsGui();
    handleRoomChange();
  }

  init();

  const newsObserver = new MutationObserver((mutations) => {
    
    let relevant = false;
    for (const m of mutations) {
      if (m.type === 'characterData') {
        if (m.target.nodeValue && m.target.nodeValue.includes('news_gui')) {
          relevant = true;
          break;
        }
      } else {
        for (const n of m.addedNodes) {
          if (n.textContent && n.textContent.includes('news_gui')) {
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

  newsObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();