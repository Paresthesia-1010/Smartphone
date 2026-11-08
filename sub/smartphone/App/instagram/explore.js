
(function () {
  'use strict';
  window.NeoIG = window.NeoIG || {};

  const React = window.React;
  const h = React.createElement;
  const { useState, useEffect } = React;
  const ICONS = window.NeoIG.Icons;
  const DATA = window.NeoIG.Data;

  function ExploreView() {
    const [subTab, setSubTab] = useState('rec');
    const [searchTerm, setSearchTerm] = useState('');
    const [roomData, setRoomData] = useState(() => DATA.getRoomData());

    useEffect(() => {
      const handleUpdate = () => setRoomData(DATA.getRoomData());
      window.addEventListener('neo-ig-data-updated', handleUpdate);
      return () => window.removeEventListener('neo-ig-data-updated', handleUpdate);
    }, []);

    const myId = roomData.myId || 'user_me';
    const posts = roomData.posts || [];
    const allUsers = Object.values(roomData.users || {}).filter(u => u.id !== myId);
    const followingList = roomData.followingList || [];

    const handleFollowToggle = (targetId) => {
      const currentData = DATA.getRoomData();
      if (!Array.isArray(currentData.followingList)) currentData.followingList = [];
      const idx = currentData.followingList.indexOf(targetId);
      const isUnfollow = idx >= 0;

      if (isUnfollow) {
        currentData.followingList.splice(idx, 1);
        if (currentData.users[targetId] && currentData.users[targetId].follower > 0) {
          currentData.users[targetId].follower -= 1;
        }
      } else {
        currentData.followingList.push(targetId);
        if (currentData.users[targetId]) {
          currentData.users[targetId].follower = (currentData.users[targetId].follower || 0) + 1;
        }
      }
      DATA.saveRoomData(currentData);

      const timeInfo = DATA.getCurrentFormattedTime();
      DATA.sendPromptToAIStudio({
        type: 'update',
        group: isUnfollow ? 'unfollow' : 'follow',
        owner: myId,
        to: targetId,
        year: timeInfo.year,
        month: timeInfo.month,
        day: timeInfo.day,
        hour: timeInfo.hour,
        min: timeInfo.min,
        Period: timeInfo.Period,
        day_week: timeInfo.day_week
      });
    };

    const filteredUsers = allUsers.filter(u =>
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.id && u.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return h('div', { className: 'ig-page' },
      h('div', { className: 'ig-search-box-wrap' },
        h('div', { className: 'ig-search-bar' },
          h(ICONS.Search, { size: 16, color: '#8e8e93' }),
          h('input', {
            type: 'text',
            placeholder: '검색',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            autoComplete: 'off'
          })
        )
      ),

      h('div', { className: 'ig-search-tabs-bar' },
        ['rec', 'prof'].map(key => {
          const labels = { rec: '추천', prof: '프로필' };
          return h('button', {
            key: key,
            type: 'button',
            className: `ig-search-tab ${subTab === key ? 'active' : ''}`,
            onClick: () => setSubTab(key)
          }, labels[key]);
        })
      ),

      h('div', { className: 'ig-scroll-body' },
        subTab === 'rec' && h('div', { className: 'ig-explore-grid' },
          posts.length === 0 && h('div', { style: { gridColumn: 'span 3', padding: '40px 10px', textAlign: 'center', color: '#71717a', fontSize: 12 } }, '게시물이 없습니다.'),
          posts.map(p => h('div', { key: p.post_id, className: 'ig-grid-thumb' },
            h('span', { style: { fontSize: 11, color: '#e4e4e7', fontWeight: 600, padding: 4, textAlign: 'center' } }, p.title || p.owner)
          ))
        ),

        subTab === 'prof' && h('div', { style: { padding: '8px 12px' } },
          filteredUsers.length === 0 && h('div', { style: { padding: '30px 0', textAlign: 'center', color: '#71717a', fontSize: 12 } }, '사용자를 찾을 수 없습니다.'),
          filteredUsers.map(u => {
            const isFollowing = followingList.includes(u.id);
            return h('div', { key: u.id, className: 'ig-search-result-item', style: { padding: '8px 0' } },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                h('div', { className: 'ig-post-avatar-mini', style: { width: 40, height: 40 } }, (u.name || u.id).charAt(0)),
                h('div', { style: { display: 'flex', flexDirection: 'column' } },
                  h('span', { style: { fontSize: 13, fontWeight: 700 } }, u.name || u.id),
                  h('span', { style: { fontSize: 11, color: '#8e8e93' } }, `@${u.id} · 팔로워 ${u.follower || 0}`)
                )
              ),
              h('button', {
                type: 'button',
                className: isFollowing ? 'ig-prof-btn' : 'ig-action-pill-btn',
                style: isFollowing ? { width: 70, height: 28 } : { padding: '5px 12px' },
                onClick: () => handleFollowToggle(u.id)
              }, isFollowing ? '팔로잉' : '팔로우')
            );
          })
        )
      )
    );
  }

  window.NeoIG.Explore = { ExploreView };
})();