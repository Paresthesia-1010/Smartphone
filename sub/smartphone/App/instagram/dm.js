
(function () {
  'use strict';
  window.NeoIG = window.NeoIG || {};

  const React = window.React;
  const h = React.createElement;
  const { useState, useRef, useEffect } = React;
  const ICONS = window.NeoIG.Icons;
  const DATA = window.NeoIG.Data;

  
  function DMListPage({ isOpen, onClose, onSelectChat, onOpenNewMsg }) {
    const [roomData, setRoomData] = useState(() => DATA.getRoomData());

    useEffect(() => {
      const handleUpdate = () => setRoomData(DATA.getRoomData());
      window.addEventListener('neo-ig-data-updated', handleUpdate);
      return () => window.removeEventListener('neo-ig-data-updated', handleUpdate);
    }, []);

    if (!isOpen) return null;

    const myId = roomData.myId || 'user_me';
    const dmChats = roomData.dmChats || {};
    const chatKeys = Object.keys(dmChats);

    return h('div', { className: 'ig-sub-page' },
      h('div', { className: 'ig-top-header' },
        h('button', { type: 'button', className: 'ig-icon-btn', onClick: onClose }, h(ICONS.Back, { size: 22 })),
        h('span', { style: { fontSize: 15, fontWeight: 700 } }, myId),
        h('button', { type: 'button', className: 'ig-icon-btn', onClick: onOpenNewMsg }, h(ICONS.Edit, { size: 22 }))
      ),

      h('div', { className: 'ig-scroll-body' },
        h('div', { className: 'ig-dm-list' },
          h('div', { style: { padding: '12px 14px 6px 14px', fontSize: 13, fontWeight: 700, color: '#ffffff' } }, '메시지'),

          chatKeys.length === 0 && h('div', { style: { textAlign: 'center', padding: '40px 14px', color: '#71717a', fontSize: 12 } },
            '주고받은 메시지가 없습니다.'
          ),

          chatKeys.map(otherId => {
            const chat = dmChats[otherId];
            const targetUser = roomData.users[otherId] || { name: otherId, id: otherId };
            const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

            return h('div', {
              key: otherId,
              className: 'ig-dm-row',
              onClick: () => onSelectChat(otherId)
            },
              h('div', { className: 'ig-dm-avatar-wrap' },
                h('div', { className: 'ig-dm-avatar' },
                  targetUser.name ? targetUser.name.charAt(0) : h(ICONS.AvatarPlaceholder, { size: 22 })
                )
              ),
              h('div', { className: 'ig-dm-info' },
                h('div', { className: 'ig-dm-name-row' },
                  h('span', null, targetUser.name || otherId)
                ),
                h('span', { className: 'ig-dm-sub-row' }, lastMsg ? lastMsg.content : '대화를 시작해보세요.')
              )
            );
          })
        )
      )
    );
  }

  
  function DMChatRoomPage({ isOpen, targetId, onClose }) {
    const [inputText, setInputText] = useState('');
    const [roomData, setRoomData] = useState(() => DATA.getRoomData());
    const boxRef = useRef(null);

    useEffect(() => {
      const handleUpdate = () => setRoomData(DATA.getRoomData());
      window.addEventListener('neo-ig-data-updated', handleUpdate);
      return () => window.removeEventListener('neo-ig-data-updated', handleUpdate);
    }, []);

    useEffect(() => {
      if (boxRef.current) {
        boxRef.current.scrollTop = boxRef.current.scrollHeight;
      }
    }, [isOpen, roomData, targetId]);

    if (!isOpen || !targetId) return null;

    const myId = roomData.myId || 'user_me';
    const targetUser = roomData.users[targetId] || { id: targetId, name: targetId, bio: '' };
    const chat = (roomData.dmChats && roomData.dmChats[targetId]) || { messages: [] };
    const messages = chat.messages || [];

    const handleSend = (e) => {
      if (e.key === 'Enter' && inputText.trim()) {
        const text = inputText.trim();
        setInputText('');

        const timeInfo = DATA.getCurrentFormattedTime();
        const newMsg = {
          owner: myId,
          to: targetId,
          content: text,
          year: timeInfo.year,
          month: timeInfo.month,
          day: timeInfo.day,
          hour: timeInfo.hour,
          min: timeInfo.min,
          Period: timeInfo.Period,
          day_week: timeInfo.day_week,
          user: '1',
          see: '0'
        };

        const currentData = DATA.getRoomData();
        if (!currentData.dmChats[targetId]) {
          currentData.dmChats[targetId] = { with: targetId, messages: [] };
        }
        currentData.dmChats[targetId].messages.push(newMsg);
        DATA.saveRoomData(currentData);
        window.NeoSound?.play('send', 0.85);

        
        DATA.sendPromptToAIStudio({
          type: 'send',
          group: 'DM',
          owner: myId,
          to: targetId,
          content: text,
          year: timeInfo.year,
          month: timeInfo.month,
          day: timeInfo.day,
          hour: timeInfo.hour,
          min: timeInfo.min,
          Period: timeInfo.Period,
          day_week: timeInfo.day_week,
          user: '1'
        });
      }
    };

    return h('div', { className: 'ig-sub-page' },
      h('div', { className: 'ig-top-header' },
        h('button', { type: 'button', className: 'ig-icon-btn', onClick: onClose }, h(ICONS.Back, { size: 22 })),
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
          h('span', { style: { fontSize: 13, fontWeight: 700 } }, targetUser.name || targetId),
          h('span', { style: { fontSize: 9.5, color: '#8e8e93' } }, targetId)
        ),
        h('div', { style: { display: 'flex', gap: 10 } },
          h('button', { type: 'button', className: 'ig-icon-btn' }, h(ICONS.Call, { size: 20 }))
        )
      ),

      h('div', { className: 'ig-chat-messages-container', ref: boxRef },
        h('div', { className: 'ig-chat-user-header' },
          h('div', { className: 'ig-chat-lg-avatar' }, (targetUser.name || targetId).charAt(0)),
          h('span', { className: 'ig-chat-lg-name' }, targetUser.name || targetId),
          h('span', { className: 'ig-chat-lg-sub' }, `${targetId} ${targetUser.bio ? '· ' + targetUser.bio : ''}`),
          h('div', { className: 'ig-chat-actions-mini' },
            h('button', { type: 'button', className: 'ig-chat-action-pill' }, h(ICONS.AvatarPlaceholder, { size: 18 }), h('span', null, '프로필')),
            h('button', { type: 'button', className: 'ig-chat-action-pill' }, h(ICONS.Bookmark, { size: 18 }), h('span', null, '안전 팁'))
          )
        ),

        messages.map((m, idx) => {
          const isMe = String(m.user) === '1' || m.owner === myId;
          return h('div', { key: idx, className: `ig-msg-bubble-row ${isMe ? 'from-me' : 'from-other'}` },
            h('div', { className: 'ig-msg-bubble' }, m.content)
          );
        })
      ),

      h('div', { className: 'ig-chat-input-bar' },
        h('div', { className: 'ig-chat-input-capsule' },
          h('span', { style: { color: '#a1a1aa', display: 'flex' } }, h(ICONS.Camera, { size: 18 })),
          h('input', {
            type: 'text',
            value: inputText,
            onChange: (e) => setInputText(e.target.value),
            onKeyDown: handleSend,
            placeholder: '메시지 보내기...',
            autoComplete: 'off'
          })
        ),
        h('button', { type: 'button', className: 'ig-icon-btn' }, h(ICONS.Heart, { size: 22 }))
      )
    );
  }

  
  function NewMessagePage({ isOpen, onClose, onSelectUser }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roomData, setRoomData] = useState(() => DATA.getRoomData());

    useEffect(() => {
      const handleUpdate = () => setRoomData(DATA.getRoomData());
      window.addEventListener('neo-ig-data-updated', handleUpdate);
      return () => window.removeEventListener('neo-ig-data-updated', handleUpdate);
    }, []);

    if (!isOpen) return null;

    const myId = roomData.myId || 'user_me';
    const allUsers = Object.values(roomData.users || {}).filter(u => u.id !== myId);
    const filteredUsers = allUsers.filter(u =>
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.id && u.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return h('div', { className: 'ig-sub-page' },
      h('div', { className: 'ig-top-header' },
        h('button', { type: 'button', className: 'ig-icon-btn', onClick: onClose }, h(ICONS.Back, { size: 22 })),
        h('span', { style: { fontSize: 14, fontWeight: 700 } }, '새 메시지'),
        h('div', { style: { width: 24 } })
      ),
      h('div', {
        style: {
          padding: '10px 14px',
          borderBottom: '0.5px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'nowrap',
          width: '100%',
          boxSizing: 'border-box'
        }
      },
        h('span', { style: { fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 } }, '받는이:'),
        h('input', {
          type: 'text',
          placeholder: '검색',
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          style: {
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: 13,
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap'
          }
        })
      ),
      h('div', { className: 'ig-scroll-body', style: { padding: '10px 14px' } },
        h('div', { style: { fontSize: 12, fontWeight: 700, color: '#8e8e93', margin: '4px 0 10px 0' } }, '추천 계정'),
        filteredUsers.length === 0 && h('div', { style: { color: '#71717a', fontSize: 12, textAlign: 'center', padding: '20px 0' } }, '계정이 없습니다.'),
        filteredUsers.map(u => h('div', {
          key: u.id,
          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', cursor: 'pointer' },
          onClick: () => {
            onSelectUser(u.id);
            onClose();
          }
        },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
            h('div', { className: 'ig-post-avatar-mini', style: { width: 40, height: 40 } }, (u.name || u.id).charAt(0)),
            h('div', { style: { display: 'flex', flexDirection: 'column' } },
              h('span', { style: { fontSize: 13, fontWeight: 700 } }, u.name || u.id),
              h('span', { style: { fontSize: 11, color: '#8e8e93' } }, `@${u.id}`)
            )
          )
        ))
      )
    );
  }

  window.NeoIG.DM = {
    DMListPage,
    DMChatRoomPage,
    NewMessagePage
  };
})();