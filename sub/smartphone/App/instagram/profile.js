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
    const [createOpen, setCreateOpen] = useState(false); // 새 게시글 작성 창 열림 여부
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

    // 1. 프로필 편집용 상태
    const [editName, setEditName] = useState(myProfile.name || '');
    const [editBio, setEditBio] = useState(myProfile.bio || '');

    // 2. 새 게시물 작성용 상태 (이미지 설명 & 게시글 내용)
    const [postImageDesc, setPostImageDesc] = useState('');
    const [postContent, setPostContent] = useState('');

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

    // 새 게시글 공유(등록) 핸들러
    const handleCreatePost = () => {
      if (!postContent.trim() && !postImageDesc.trim()) return;

      const newPostId = 'post_' + Date.now().toString(36);
      const content = postContent.trim();
      const imageDesc = postImageDesc.trim() || 'none';

      const currentData = DATA.getRoomData();
      if (!Array.isArray(currentData.posts)) currentData.posts = [];

      const newPost = {
        post_id: newPostId,
        owner: myId,
        title: 'none',
        content: content,
        image_but_text: imageDesc,
        likes: [],
        comments: [],
        timeStr: '방금 전'
      };

      // 내 피드 맨 앞에 추가
      currentData.posts.unshift(newPost);
      DATA.saveRoomData(currentData);

      // AI Studio로 새 게시글 프롬프트 전송
      DATA.sendPromptToAIStudio({
        type: 'create',
        group: 'post',
        owner: myId,
        title: 'none',
        content: content,
        image_but_text: imageDesc,
        post_id: newPostId
      });

      window.NeoSound?.play('send', 0.85);

      // 폼 초기화 및 닫기
      setPostImageDesc('');
      setPostContent('');
      setCreateOpen(false);
    };

    return h('div', { className: 'ig-page' },
      // 상단 헤더
      h('div', { className: 'ig-top-header' },
        h('div', { className: 'ig-header-title-btn' },
          h('span', null, myProfile.id),
          h('span', { style: { fontSize: 10, color: '#8e8e93' } }, '▼')
        ),
        h('div', { className: 'ig-header-actions' },
          // + 버튼을 누르면 새 게시글 작성 화면 열림
          h('button', {
            type: 'button',
            className: 'ig-icon-btn',
            title: '새 게시물 작성',
            onClick: () => setCreateOpen(true)
          }, h(ICONS.Plus, { size: 22 })),
          h('button', { type: 'button', className: 'ig-icon-btn' }, h(ICONS.More, { size: 22 }))
        )
      ),

      // 프로필 스크롤 본문
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
          ? h('div', {
              className: 'ig-empty-feed-wrap',
              style: { cursor: 'pointer' },
              onClick: () => setCreateOpen(true)
            },
              h('div', { className: 'ig-empty-icon' }, h(ICONS.Camera, { size: 28, color: '#ffffff' })),
              h('span', { className: 'ig-empty-title' }, '게시물이 없습니다'),
              h('span', { className: 'ig-empty-sub' }, '여기를 눌러 첫 사진이나 글을 공유해보세요.')
            )
          : h('div', { className: 'ig-explore-grid' },
              myPosts.map(p => h('div', { key: p.post_id, className: 'ig-grid-thumb' },
                h('span', { style: { fontSize: 11, color: '#e4e4e7', fontWeight: 600, padding: 4, textAlign: 'center' } },
                  (p.image_but_text && p.image_but_text !== 'none') ? `📷 ${p.image_but_text}` : (p.content || p.title || '게시물')
                )
              ))
            )
      ),

      // [1] 프로필 편집 창
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
      ),

      // [2] 새 게시물 작성 창 (사진 설명 + 내용)
      createOpen && h('div', { className: 'ig-sub-page' },
        h('div', { className: 'ig-top-header' },
          h('button', {
            type: 'button',
            className: 'ig-icon-btn',
            onClick: () => {
              setPostImageDesc('');
              setPostContent('');
              setCreateOpen(false);
            }
          }, h(ICONS.Close, { size: 22 })),
          h('span', { style: { fontSize: 14, fontWeight: 700 } }, '새 게시물'),
          h('button', {
            type: 'button',
            className: 'ig-icon-btn',
            style: { color: '#0095f6', fontWeight: 700, fontSize: 13 },
            onClick: handleCreatePost
          }, '공유')
        ),
        h('div', { className: 'ig-scroll-body', style: { padding: 14 } },
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
            // 이미지 설명 입력 영역 (URL/이미지 파일 금지)
            h('div', { className: 'ig-edit-input-box' },
              h('label', null, '사진 묘사 / 설명 (이미지 파일·URL 업로드 불가)'),
              h('textarea', {
                rows: 3,
                value: postImageDesc,
                onChange: (e) => setPostImageDesc(e.target.value),
                placeholder: '예: 학교 옥상에서 찍은 맑은 하늘과 구름 사진...'
              })
            ),

            // 게시글 본문 입력 영역
            h('div', { className: 'ig-edit-input-box' },
              h('label', null, '문구 입력 (게시글 내용)'),
              h('textarea', {
                rows: 6,
                value: postContent,
                onChange: (e) => setPostContent(e.target.value),
                placeholder: '문구를 입력하세요...'
              })
            ),

            h('div', { style: { color: '#71717a', fontSize: 11.5, lineHeight: 1.4, padding: '0 4px' } },
              '※ 이미지는 텍스트 묘사로 렌더링되며, 등록 시 다른 캐릭터들에게 인스타그램 데이터가 전달됩니다.'
            )
          )
        )
      )
    );
  }

  window.NeoIG.Profile = { ProfileView };
})();