
(function () {
  'use strict';
  console.log('[Smartphone App] instagram/main.js (Dynamic Mutation & App.mp3 Notification) loaded.');

  function ensureReactLoaded(callback) {
    if (window.React && window.ReactDOM) {
      callback();
      return;
    }
    const s1 = document.createElement('script');
    s1.src = 'https:
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https:
      s2.onload = callback;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }

  
  function processIncomingInstaBlock(innerContent) {
    const DATA = window.NeoIG.Data;
    if (!DATA) return;

    const roomId = DATA.getChatRoomId();
    const roomData = DATA.getRoomData(roomId);
    let changed = false;

    const items = [];
    const arrayRegex = /\[[\s\S]*?\]/g;
    let arrMatch;
    let contentToScan = innerContent;

    while ((arrMatch = arrayRegex.exec(innerContent)) !== null) {
      try {
        const parsedArr = JSON.parse(arrMatch[0]);
        if (Array.isArray(parsedArr)) {
          items.push(...parsedArr);
        }
      } catch (e) {}
    }

    contentToScan = contentToScan.replace(arrayRegex, ' ');
    const objRegex = /\{[^{}]*?\}/g;
    let objMatch;

    while ((objMatch = objRegex.exec(contentToScan)) !== null) {
      try {
        const parsedObj = JSON.parse(objMatch[0]);
        if (parsedObj && typeof parsedObj === 'object') {
          items.push(parsedObj);
        }
      } catch (e) {}
    }

    items.forEach(item => {
      if (!item || !item.type || !item.group) return;

      
      if (item.group === 'user' && item.type === 'create' && item.id) {
        const isUserMe = String(item.user) === '1';
        if (isUserMe) {
          roomData.myId = item.id;
        }
        roomData.users[item.id] = {
          id: item.id,
          name: item.name || item.id,
          follower: parseInt(item.follower, 10) || 0,
          following: parseInt(item.following, 10) || 0,
          bio: item.bio || '',
          user: String(item.user || '0'),
          owner_realname: item.owner_realname || ''
        };
        changed = true;
      }

      
      if (item.group === 'post' && item.type === 'create' && item.post_id) {
        const exists = roomData.posts.some(p => p.post_id === item.post_id);
        if (!exists) {
          roomData.posts.unshift({
            post_id: item.post_id,
            owner: item.owner || 'user',
            title: item.title || '',
            content: (item.content || '').replace(/\\n/g, '\n'),
            image_but_text: item.image_but_text || 'none',
            likes: [],
            comments: [],
            timeStr: '방금 전'
          });
          changed = true;
        }
      }

      
      if (item.group === 'comment' && item.type === 'update' && item.to_post) {
        const targetPost = roomData.posts.find(p => p.post_id === item.to_post);
        if (targetPost) {
          if (!Array.isArray(targetPost.comments)) targetPost.comments = [];
          const exists = targetPost.comments.some(c => c.comment_id === item.comment_id);
          if (!exists) {
            targetPost.comments.push({
              comment_id: item.comment_id || ('ct_' + Date.now().toString(36)),
              owner: item.owner,
              parent: item.parent || 'none',
              content: item.content || '',
              timeStr: '방금 전'
            });

            
            if (targetPost.owner === roomData.myId && item.owner !== roomData.myId) {
              window.NeoNotification?.showInstagram?.({
                name: item.owner,
                text: `회원님의 게시물에 댓글을 남겼습니다: "${item.content}"`,
                onClick: () => {
                  if (window.NeoPhone?.open) window.NeoPhone.open();
                  if (window.NeoIG?.Main?.open) window.NeoIG.Main.open();
                }
              });
            }
            changed = true;
          }
        }
      }

      
      if (item.group === 'like' && item.type === 'update' && item.to_post) {
        const targetPost = roomData.posts.find(p => p.post_id === item.to_post);
        if (targetPost) {
          if (!Array.isArray(targetPost.likes)) targetPost.likes = [];
          if (!targetPost.likes.includes(item.owner)) {
            targetPost.likes.push(item.owner);

            
            if (targetPost.owner === roomData.myId && item.owner !== roomData.myId) {
              window.NeoNotification?.showInstagram?.({
                name: item.owner,
                text: '회원님의 게시물을 좋아합니다.',
                onClick: () => {
                  if (window.NeoPhone?.open) window.NeoPhone.open();
                  if (window.NeoIG?.Main?.open) window.NeoIG.Main.open();
                }
              });
            }
            changed = true;
          }
        }
      }

      
      if (item.group === 'follow' && item.type === 'update' && item.to) {
        if (item.owner === roomData.myId) {
          if (!roomData.followingList.includes(item.to)) {
            roomData.followingList.push(item.to);
            changed = true;
          }
        }
        if (roomData.users[item.to]) {
          roomData.users[item.to].follower = (roomData.users[item.to].follower || 0) + 1;
          changed = true;
        }

        
        if (item.to === roomData.myId && item.owner !== roomData.myId) {
          window.NeoNotification?.showInstagram?.({
            name: item.owner,
            text: '회원님을 팔로우하기 시작했습니다.',
            onClick: () => {
              if (window.NeoPhone?.open) window.NeoPhone.open();
              if (window.NeoIG?.Main?.open) window.NeoIG.Main.open();
            }
          });
        }
      }

      if (item.group === 'unfollow' && item.type === 'update' && item.to) {
        if (item.owner === roomData.myId) {
          const idx = roomData.followingList.indexOf(item.to);
          if (idx >= 0) {
            roomData.followingList.splice(idx, 1);
            changed = true;
          }
        }
        if (roomData.users[item.to] && roomData.users[item.to].follower > 0) {
          roomData.users[item.to].follower -= 1;
          changed = true;
        }
      }

      
      if (item.group === 'profile' && item.type === 'update' && item.owner) {
        if (roomData.users[item.owner]) {
          if (item.follower !== undefined) roomData.users[item.owner].follower = parseInt(item.follower, 10) || 0;
          if (item.following !== undefined) roomData.users[item.owner].following = parseInt(item.following, 10) || 0;
          changed = true;
        }
      }

      
      if (item.group === 'DM' && item.type === 'send' && item.owner && item.to) {
        const isUserMe = String(item.user) === '1' || item.owner === roomData.myId;
        const otherId = isUserMe ? item.to : item.owner;

        if (!roomData.dmChats[otherId]) {
          roomData.dmChats[otherId] = { with: otherId, messages: [] };
        }

        const cleanContent = (item.content || '').replace(/\\n/g, '\n');
        const isDuplicated = roomData.dmChats[otherId].messages.some(m =>
          m.owner === item.owner &&
          m.content === cleanContent &&
          m.hour === item.hour &&
          m.min === item.min
        );

        if (!isDuplicated) {
          roomData.dmChats[otherId].messages.push({
            owner: item.owner,
            to: item.to,
            content: cleanContent,
            year: item.year,
            month: item.month,
            day: item.day,
            hour: item.hour,
            min: item.min,
            Period: item.Period,
            day_week: item.day_week,
            user: isUserMe ? '1' : '0',
            see: isUserMe ? '1' : '0'
          });

          
          if (!isUserMe) {
            window.NeoNotification?.showInstagram?.({
              name: item.owner,
              text: cleanContent,
              onClick: () => {
                if (window.NeoPhone?.open) window.NeoPhone.open();
                if (window.NeoIG?.Main?.open) window.NeoIG.Main.open();
              }
            });
          }
          changed = true;
        }
      }
    });

    if (changed) {
      DATA.saveRoomData(roomData, roomId);
      syncAppBadge();
    }
  }

  function syncAppBadge() {
    const DATA = window.NeoIG.Data;
    if (!DATA) return;
    const roomData = DATA.getRoomData();
    let totalUnread = 0;
    const myId = roomData.myId || 'user_me';

    Object.values(roomData.dmChats || {}).forEach(chat => {
      (chat.messages || []).forEach(m => {
        if (m.owner !== myId && String(m.see) === '0') {
          totalUnread += 1;
        }
      });
    });

    if (window.NeoPhone?.badge?.set) {
      window.NeoPhone.badge.set('instagram', totalUnread > 0 ? (totalUnread > 99 ? '99+' : totalUnread) : null);
    }
  }

  function scanAndProcessCompletedInstaTags() {
    const turns = document.querySelectorAll('ms-chat-turn');
    if (!turns.length) return;

    const completeTagRegex = /(?:<insta>|&lt;insta&gt;)([\s\S]*?)(?:<\/insta>|&lt;\/insta&gt;)/i;

    turns.forEach(turn => {
      const text = turn.textContent || '';
      if (turn.dataset.igProcessed === 'true') return;

      const hasOpen = text.includes('<insta>') || text.includes('&lt;insta&gt;');
      const hasClose = text.includes('</insta>') || text.includes('&lt;/insta&gt;');
      if (!hasOpen || !hasClose) return;

      const match = text.match(completeTagRegex);
      if (match && match[1]) {
        processIncomingInstaBlock(match[1]);
        turn.dataset.igProcessed = 'true';

        turn.querySelectorAll('p, pre, ms-code-block, mat-expansion-panel').forEach(block => {
          if (block.textContent && block.textContent.includes('insta')) {
            block.style.display = 'none';
          }
        });
      }
    });
  }

  ensureReactLoaded(() => {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const h = React.createElement;
    const { useState } = React;

    const ICONS = window.NeoIG.Icons;
    const { HomeView } = window.NeoIG.Feed;
    const { DMListPage, DMChatRoomPage, NewMessagePage } = window.NeoIG.DM;
    const { ExploreView } = window.NeoIG.Explore;
    const { ProfileView } = window.NeoIG.Profile;

    function InstagramApp({ onCloseApp }) {
      const [currentTab, setCurrentTab] = useState('home');
      const [dmOpen, setDmOpen] = useState(false);
      const [activeChatId, setActiveChatId] = useState(null);
      const [newMsgOpen, setNewMsgOpen] = useState(false);

      return h('div', { className: 'ig-app-root' },
        h('div', { className: 'ig-safe-top-spacer' }),

        currentTab === 'home' && h(HomeView, { onOpenDM: () => setDmOpen(true) }),
        currentTab === 'search' && h(ExploreView, null),
        currentTab === 'profile' && h(ProfileView, null),

        h(DMListPage, {
          isOpen: dmOpen,
          onClose: () => setDmOpen(false),
          onSelectChat: (id) => setActiveChatId(id),
          onOpenNewMsg: () => setNewMsgOpen(true)
        }),
        h(DMChatRoomPage, {
          isOpen: !!activeChatId,
          targetId: activeChatId,
          onClose: () => setActiveChatId(null)
        }),
        h(NewMessagePage, {
          isOpen: newMsgOpen,
          onClose: () => setNewMsgOpen(false),
          onSelectUser: (id) => {
            setActiveChatId(id);
            setDmOpen(true);
          }
        }),

        h('div', { className: 'ig-bottom-nav-wrap' },
          h('div', { className: 'ig-nav-bar' },
            h('button', {
              type: 'button',
              className: `ig-nav-btn ${currentTab === 'home' ? 'active' : ''}`,
              onClick: () => setCurrentTab('home')
            }, h(ICONS.Home, { size: 22 })),

            h('button', {
              type: 'button',
              className: `ig-nav-btn ${currentTab === 'search' ? 'active' : ''}`,
              onClick: () => setCurrentTab('search')
            }, h(ICONS.Search, { size: 22 })),

            h('button', {
              type: 'button',
              className: 'ig-nav-btn',
              onClick: () => setDmOpen(true)
            }, h(ICONS.DM, { size: 22 })),

            h('button', {
              type: 'button',
              className: `ig-nav-btn ${currentTab === 'profile' ? 'active' : ''}`,
              onClick: () => setCurrentTab('profile')
            }, h('div', { className: 'ig-nav-avatar' }, h(ICONS.AvatarPlaceholder, { size: 14 })))
          ),
          h('div', { className: 'ig-home-bar-touch', onClick: onCloseApp },
            h('div', { className: 'ig-home-bar' })
          )
        )
      );
    }

    const STYLE_ID = 'neo-instagram-app-style';
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        insta, ms-chat-turn insta, .neo-instagram-hidden-block {
          display: none !important; visibility: hidden !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
        }
        #neo-instagram-view {
          position: absolute; top: 28px; left: 0; right: 0; bottom: 0;
          background: #000000; z-index: 8; display: none; flex-direction: column;
          color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Pretendard, sans-serif;
          box-sizing: border-box; overflow: hidden; border-radius: 0 0 36px 36px;
          transform: scale(0.15); opacity: 0; pointer-events: none;
          transition: transform 0.36s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
        }
        #neo-instagram-view.active { display: flex !important; transform: scale(1) !important; opacity: 1 !important; pointer-events: auto !important; }
        #neo-instagram-view.closing { display: flex !important; transform: scale(0.15) !important; opacity: 0 !important; pointer-events: none !important; }

        .ig-app-root { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
        .ig-safe-top-spacer { height: 6px; flex-shrink: 0; }
        .ig-page { position: absolute; inset: 0 0 44px 0; background: #000; display: flex; flex-direction: column; z-index: 5; }
        .ig-sub-page { position: absolute; inset: 0; background: #000; display: flex; flex-direction: column; z-index: 30; }
        .ig-scroll-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .ig-scroll-body::-webkit-scrollbar { display: none; }

        .ig-top-header { height: 42px; padding: 0 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 0.5px solid rgba(255, 255, 255, 0.08); flex-shrink: 0; }
        .ig-header-logo { font-size: 20px; font-weight: 800; letter-spacing: -0.8px; }
        .ig-header-actions { display: flex; align-items: center; gap: 14px; }
        .ig-icon-btn { background: transparent; border: none; color: #fff; cursor: pointer; padding: 2px; display: flex; align-items: center; justify-content: center; }

        .ig-post-card { display: flex; flex-direction: column; border-bottom: 0.5px solid rgba(255, 255, 255, 0.1); padding-bottom: 14px; }
        .ig-post-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; }
        .ig-post-user-info { display: flex; align-items: center; gap: 8px; }
        .ig-post-avatar-mini { width: 30px; height: 30px; border-radius: 50%; background: #334155; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 13px; font-weight: 700; color: #fff; }
        .ig-post-username { font-size: 12.5px; font-weight: 700; color: #fff; }
        .ig-post-media-box { width: 100%; background: #121212; display: flex; align-items: center; justify-content: center; min-height: 200px; }
        .ig-photo-placeholder-box { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #71717a; font-size: 12px; }
        .ig-post-actions-bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; }
        .ig-post-actions-left { display: flex; align-items: center; gap: 12px; }
        .ig-post-action-btn { background: transparent; border: none; color: #fff; cursor: pointer; padding: 0; display: flex; align-items: center; }
        .ig-post-details { padding: 0 12px; display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; }
        .ig-post-likes { font-weight: 700; color: #fff; cursor: pointer; }
        .ig-post-caption-user { font-weight: 700; margin-right: 6px; }
        .ig-post-comments-view { font-size: 12px; color: #71717a; cursor: pointer; }
        .ig-post-date { font-size: 10px; color: #71717a; }

        .ig-bottom-sheet-wrapper { position: absolute; inset: 0; z-index: 50; }
        .ig-bottom-sheet-backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.7); }
        .ig-bottom-sheet { position: absolute; left: 0; right: 0; bottom: 0; height: 75%; background: #121212; border-radius: 20px 20px 0 0; display: flex; flex-direction: column; border-top: 1px solid #262626; }
        .ig-sheet-handle-bar { height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .ig-sheet-handle { width: 36px; height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; }
        .ig-sheet-header { height: 38px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; border-bottom: 0.5px solid #262626; }
        .ig-sheet-title { font-size: 14px; font-weight: 700; color: #fff; }

        .ig-comment-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .ig-comment-content { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ig-comment-bubble-meta { display: flex; align-items: baseline; gap: 6px; font-size: 11px; flex-wrap: nowrap; white-space: nowrap; }
        .ig-comment-author { font-weight: 700; color: #fff; flex-shrink: 0; }
        .ig-comment-time { color: #8e8e93; font-size: 10.5px; flex-shrink: 0; white-space: nowrap; }
        .ig-comment-text { font-size: 12.5px; color: #f4f4f5; line-height: 1.35; word-break: break-word; }
        .ig-comment-reply-btn { background: transparent; border: none; font-size: 11px; color: #8e8e93; cursor: pointer; padding: 0; align-self: flex-start; margin-top: 2px; }

        .ig-emoji-quick-bar { display: flex; justify-content: space-around; padding: 8px 10px; border-top: 0.5px solid #262626; font-size: 18px; cursor: pointer; background: #121212; }
        .ig-replying-banner { display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: #1c1c1e; font-size: 11px; color: #a1a1aa; border-top: 0.5px solid #262626; }
        .ig-comment-input-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px 14px 12px; background: #121212; border-top: 0.5px solid #262626; }
        .ig-comment-input-capsule { flex: 1; height: 36px; background: #1c1c1e; border: 1px solid #262626; border-radius: 18px; padding: 0 14px; display: flex; align-items: center; }
        .ig-comment-input-capsule input { width: 100%; background: transparent; border: none; outline: none; color: #fff; font-size: 12.5px; }

        .ig-dm-row { display: flex; align-items: center; padding: 10px 14px; gap: 12px; cursor: pointer; }
        .ig-dm-avatar-wrap { width: 44px; height: 44px; flex-shrink: 0; }
        .ig-dm-avatar { width: 100%; height: 100%; border-radius: 50%; background: #262629; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #fff; }
        .ig-dm-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .ig-dm-name-row { display: flex; align-items: center; gap: 4px; font-size: 13.5px; font-weight: 600; color: #fff; }
        .ig-dm-sub-row { font-size: 11.5px; color: #8e8e93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .ig-chat-messages-container { flex: 1; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .ig-chat-messages-container::-webkit-scrollbar { display: none; }
        .ig-chat-user-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; padding: 16px 0; }
        .ig-chat-lg-avatar { width: 64px; height: 64px; border-radius: 50%; background: #334155; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; font-size: 24px; font-weight: 700; color: #fff; }
        .ig-chat-lg-name { font-size: 16px; font-weight: 700; color: #fff; }
        .ig-chat-lg-sub { font-size: 11px; color: #8e8e93; }
        .ig-chat-actions-mini { display: flex; gap: 16px; margin-top: 8px; }
        .ig-chat-action-pill { display: flex; flex-direction: column; align-items: center; gap: 4px; background: transparent; border: none; color: #fff; font-size: 10.5px; cursor: pointer; }
        .ig-msg-bubble-row { display: flex; flex-direction: column; width: 100%; }
        .ig-msg-bubble-row.from-other { align-items: flex-start; }
        .ig-msg-bubble-row.from-me { align-items: flex-end; }
        .ig-msg-bubble { max-width: 74%; padding: 8px 12px; border-radius: 18px; font-size: 13px; line-height: 1.4; word-break: break-word; white-space: pre-wrap; }
        .ig-msg-bubble-row.from-other .ig-msg-bubble { background: #262629; color: #fff; border-bottom-left-radius: 4px; }
        .ig-msg-bubble-row.from-me .ig-msg-bubble { background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; border-bottom-right-radius: 4px; }

        .ig-chat-input-bar { height: 44px; padding: 4px 8px; display: flex; align-items: center; gap: 6px; border-top: 0.5px solid rgba(255, 255, 255, 0.1); background: #000; flex-shrink: 0; }
        .ig-chat-input-capsule { flex: 1; height: 34px; background: #1c1c1e; border-radius: 17px; padding: 0 10px; display: flex; align-items: center; gap: 6px; }
        .ig-chat-input-capsule input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 12.5px; }

        .ig-search-box-wrap { padding: 6px 10px; flex-shrink: 0; }
        .ig-search-bar { display: flex; align-items: center; gap: 6px; background: #1c1c1e; border-radius: 10px; padding: 6px 10px; border: 0.5px solid #262626; }
        .ig-search-bar input { background: transparent; border: none; outline: none; color: #fff; font-size: 13px; width: 100%; }
        .ig-search-tabs-bar { display: flex; border-bottom: 0.5px solid rgba(255, 255, 255, 0.12); flex-shrink: 0; }
        .ig-search-tab { flex: 1; padding: 8px 0; background: transparent; border: none; border-bottom: 2px solid transparent; color: #8e8e93; font-size: 12.5px; font-weight: 600; cursor: pointer; text-align: center; }
        .ig-search-tab.active { color: #fff; border-bottom-color: #fff; }
        .ig-explore-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; padding-bottom: 10px; }
        .ig-grid-thumb { aspect-ratio: 1; background: #18181b; position: relative; cursor: pointer; overflow: hidden; display: flex; align-items: center; justify-content: center; }

        .ig-prof-header { padding: 10px 14px; display: flex; flex-direction: column; gap: 10px; }
        .ig-prof-stats-row { display: flex; align-items: center; justify-content: space-between; }
        .ig-prof-avatar-wrap { position: relative; width: 64px; height: 64px; }
        .ig-prof-avatar { width: 100%; height: 100%; border-radius: 50%; background: #262626; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #fff; }
        .ig-prof-stat-group { display: flex; gap: 18px; text-align: center; }
        .ig-stat-col { display: flex; flex-direction: column; cursor: pointer; }
        .ig-stat-num { font-size: 15px; font-weight: 700; color: #fff; }
        .ig-stat-label { font-size: 11px; color: #a1a1aa; }
        .ig-prof-bio-box { display: flex; flex-direction: column; gap: 2px; font-size: 12.5px; }
        .ig-prof-name { font-weight: 700; color: #fff; }
        .ig-prof-action-buttons { display: flex; gap: 6px; }
        .ig-prof-btn { flex: 1; height: 30px; border-radius: 8px; background: #262629; border: none; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; }
        .ig-empty-feed-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 40px 20px; }
        .ig-empty-icon { width: 52px; height: 52px; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; }
        .ig-empty-title { font-size: 15px; font-weight: 700; color: #fff; }
        .ig-empty-sub { font-size: 12px; color: #8e8e93; }
        .ig-action-pill-btn { border-radius: 8px; background: #0095f6; color: #fff; border: none; font-size: 12px; font-weight: 600; cursor: pointer; }
        .ig-search-result-item { display: flex; align-items: center; justify-content: space-between; }

        .ig-bottom-nav-wrap { position: absolute; bottom: 0; left: 0; right: 0; height: 44px; background: #000; border-top: 0.5px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; z-index: 25; }
        .ig-nav-bar { flex: 1; display: flex; align-items: center; justify-content: space-around; padding: 0 12px; }
        .ig-nav-btn { background: transparent; border: none; color: #71717a; cursor: pointer; padding: 6px 14px; display: flex; align-items: center; justify-content: center; }
        .ig-nav-btn.active { color: #fff; }
        .ig-nav-avatar { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid transparent; display: flex; align-items: center; justify-content: center; background: #334155; }
        .ig-nav-btn.active .ig-nav-avatar { border-color: #fff; }

        .ig-home-bar-touch { height: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: #000; }
        .ig-home-bar { width: 70px; height: 3px; background: #fff; border-radius: 2px; opacity: 0.85; }
        .ig-edit-input-box { display: flex; flex-direction: column; gap: 4px; background: #1c1c1e; border-radius: 10px; padding: 8px 12px; }
        .ig-edit-input-box label { font-size: 11px; color: #8e8e93; }
        .ig-edit-input-box input, .ig-edit-input-box textarea { background: transparent; border: none; outline: none; color: #fff; font-size: 13px; font-family: inherit; }
      `;
      document.head.appendChild(style);
    }

    let rootInstance = null;

    function mountInstagram() {
      const screen = document.querySelector('.neo-phone-screen');
      if (!screen || document.getElementById('neo-instagram-view')) return;

      const container = document.createElement('div');
      container.id = 'neo-instagram-view';
      screen.appendChild(container);

      rootInstance = ReactDOM.createRoot(container);
      rootInstance.render(h(InstagramApp, { onCloseApp: closeInstagram }));
    }

    function openInstagram() {
      let view = document.getElementById('neo-instagram-view');
      if (!view) {
        mountInstagram();
        view = document.getElementById('neo-instagram-view');
      }
      if (!view) return;

      view.style.display = 'flex';
      view.classList.remove('closing');
      void view.offsetWidth;
      view.classList.add('active');
    }

    function closeInstagram() {
      const view = document.getElementById('neo-instagram-view');
      if (view && view.classList.contains('active')) {
        view.classList.remove('active');
        view.classList.add('closing');
        setTimeout(() => {
          view.classList.remove('closing');
          view.style.display = 'none';
        }, 340);
      }
    }

    function setupLauncher() {
      if (window.NeoPhone?.onAppClick) {
        window.NeoPhone.onAppClick((appId) => {
          if (appId === 'instagram') openInstagram();
        });
      }
      window.addEventListener('neo-phone-app-click', (e) => {
        if (e.detail?.appId === 'instagram') openInstagram();
      });
    }

    const checkReady = setInterval(() => {
      const screen = document.querySelector('.neo-phone-screen');
      if (screen) {
        clearInterval(checkReady);
        mountInstagram();
        setupLauncher();
        scanAndProcessCompletedInstaTags();
      }
    }, 100);

    const igObserver = new MutationObserver((mutations) => {
      let relevant = false;
      for (const m of mutations) {
        if (m.type === 'characterData') {
          const val = m.target.nodeValue || '';
          if (val.includes('insta')) { relevant = true; break; }
        } else {
          for (const n of m.addedNodes) {
            const tc = n.textContent || '';
            if (tc.includes('insta')) { relevant = true; break; }
          }
        }
        if (relevant) break;
      }
      if (relevant) {
        scanAndProcessCompletedInstaTags();
      }
    });

    igObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    window.NeoIG.Main = {
      open: openInstagram,
      close: closeInstagram
    };
  });
})();