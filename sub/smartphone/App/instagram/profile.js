
(function () {
  'use strict';
  window.NeoIG = window.NeoIG || {};

  const React = window.React;
  const h = React.createElement;
  const { useState, useEffect } = React;
  const ICONS = window.NeoIG.Icons;
  const DATA = window.NeoIG.Data;

  function ProfileView() {
    const [editOpen, setEditOpen] = useState(false);
    const [roomData, setRoomData] = useState(() => DATA.getRoomData());

    useEffect(() => {
      const handleUpdate = () => setRoomData(DATA.getRoomData());
      window.addEventListener('neo-ig-data-updated', handleUpdate);
      return () => window.removeEventListener('neo-ig-data-updated', handleUpdate);
    }, []);

    const myId = roomData.myId || 'user_me';
    const myProfile = roomData.users[myId] || {
      id: myId,
      name: '내 프로필',
      bio: '',
      follower: 0,
      following: (roomData.followingList || []).length
    };

    const myPosts = (roomData.posts || []).filter(p => p.owner === myId);

    const [editName, setEditName] = useState(myProfile.name || '');
    const [editBio, setEditBio] = useState(myProfile.bio || '');

    const handleSaveProfile = () => {
      const currentData = DATA.getRoomData();
      if (!currentData.users[myId]) {
        currentData.users[myId] = { id: myId, follower: 0, following: 0 };
      }
      currentData.users[myId].name = editName;
      currentData.users[myId].bio = editBio;
      DATA.saveRoomData(currentData);
      setEditOpen(false);
    };

    return h('div', { className: 'ig-page' },
      h('div', { className: 'ig-top-header' },
        h('div', { className: 'ig-header-title-btn' },
          h('span', null, myProfile.id),
          h('span', { style: { fontSize: 10, color: '#8e8e93' } }, '▼')
        ),
        h('div', { className: 'ig-header-actions' },
          h('button', { type: 'button', className: 'ig-icon-btn' }, h(ICONS.Plus, { size: 22 })),
          h('button', { type: 'button', className: 'ig-icon-btn' }, h(ICONS.More, { size: 22 }))
        )
      ),

      h('div', { className: 'ig-scroll-body' },
        h('div', { className: 'ig-prof-header' },
          h('div', { className: 'ig-prof-stats-row' },
            h('div', { className: 'ig-prof-avatar-wrap' },
              h('div', { className: 'ig-prof-avatar' }, (myProfile.name || myProfile.id).charAt(0))
            ),
            h('div', { className: 'ig-prof-stat-group' },
              h('div', { className: 'ig-stat-col' }, h('span', { className: 'ig-stat-num' }, myPosts.length), h('span', { className: 'ig-stat-label' }, '게시물')),
              h('div', { className: 'ig-stat-col' }, h('span', { className: 'ig-stat-num' }, myProfile.follower || 0), h('span', { className: 'ig-stat-label' }, '팔로워')),
              h('div', { className: 'ig-stat-col' }, h('span', { className: 'ig-stat-num' }, myProfile.following || 0), h('span', { className: 'ig-stat-label' }, '팔로잉'))
            )
          ),

          h('div', { className: 'ig-prof-bio-box' },
            h('span', { className: 'ig-prof-name' }, myProfile.name || myProfile.id),
            myProfile.bio && h('span', { style: { color: '#a1a1aa', fontSize: 12 } }, myProfile.bio)
          ),

          h('div', { className: 'ig-prof-action-buttons' },
            h('button', { type: 'button', className: 'ig-prof-btn', onClick: () => setEditOpen(true) }, '프로필 편집'),
            h('button', { type: 'button', className: 'ig-prof-btn' }, '프로필 공유')
          )
        ),

        myPosts.length === 0
          ? h('div', { className: 'ig-empty-feed-wrap' },
              h('div', { className: 'ig-empty-icon' }, h(ICONS.Camera, { size: 28, color: '#ffffff' })),
              h('span', { className: 'ig-empty-title' }, '게시물이 없습니다'),
              h('span', { className: 'ig-empty-sub' }, '사진이나 글을 공유해보세요.')
            )
          : h('div', { className: 'ig-explore-grid' },
              myPosts.map(p => h('div', { key: p.post_id, className: 'ig-grid-thumb' },
                h('span', { style: { fontSize: 11, color: '#e4e4e7', fontWeight: 600, padding: 4, textAlign: 'center' } }, p.title || '게시물')
              ))
            )
      ),

      editOpen && h('div', { className: 'ig-sub-page' },
        h('div', { className: 'ig-top-header' },
          h('button', { type: 'button', className: 'ig-icon-btn', onClick: () => setEditOpen(false) }, h(ICONS.Close, { size: 22 })),
          h('span', { style: { fontSize: 14, fontWeight: 700 } }, '프로필 편집'),
          h('button', { type: 'button', className: 'ig-icon-btn', style: { color: '#0095f6', fontWeight: 700 }, onClick: handleSaveProfile }, '완료')
        ),
        h('div', { className: 'ig-scroll-body', style: { padding: 14 } },
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
            h('div', { className: 'ig-edit-input-box' },
              h('label', null, '이름'),
              h('input', { type: 'text', value: editName, onChange: (e) => setEditName(e.target.value) })
            ),
            h('div', { className: 'ig-edit-input-box' },
              h('label', null, '소개'),
              h('textarea', { rows: 3, value: editBio, onChange: (e) => setEditBio(e.target.value), placeholder: '소개 작성...' })
            )
          )
        )
      )
    );
  }

  window.NeoIG.Profile = { ProfileView };
})();