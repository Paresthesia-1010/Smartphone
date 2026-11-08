(function () {
  'use strict';
  window.NeoIG = window.NeoIG || {};

  const React = window.React;
  const h = React.createElement;
  const { useState, useEffect } = React;
  const ICONS = window.NeoIG.Icons;
  const DATA = window.NeoIG.Data;

  const QUICK_EMOJIS = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

  // ==========================================
  // [1] 피드 게시물 카드 컴포넌트
  // ==========================================
  function FeedPost({ post, onOpenComments, onOpenLikes, onOpenShare }) {
    const roomData = DATA.getRoomData();
    const myId = roomData.myId || 'user_me';
    const isLiked = (post.likes || []).includes(myId);

    const handleLikeToggle = () => {
      const currentData = DATA.getRoomData();
      const targetPost = currentData.posts.find(p => p.post_id === post.post_id);
      if (!targetPost) return;

      if (!Array.isArray(targetPost.likes)) targetPost.likes = [];
      const idx = targetPost.likes.indexOf(myId);
      if (idx >= 0) {
        targetPost.likes.splice(idx, 1);
      } else {
        targetPost.likes.push(myId);
        window.NeoSound?.play('pop', 0.8);
      }
      DATA.saveRoomData(currentData);

      const timeInfo = DATA.getCurrentFormattedTime();
      DATA.sendPromptToAIStudio({
        type: 'update',
        group: 'like',
        owner: myId,
        to_post: post.post_id,
        year: timeInfo.year,
        month: timeInfo.month,
        day: timeInfo.day,
        hour: timeInfo.hour,
        min: timeInfo.min,
        Period: timeInfo.Period,
        day_week: timeInfo.day_week
      });
    };

    const likesCount = (post.likes || []).length;
    const commentsCount = (post.comments || []).length;

    return h('div', { className: 'ig-post-card' },
      h('div', { className: 'ig-post-header' },
        h('div', { className: 'ig-post-user-info' },
          h('div', { className: 'ig-post-avatar-mini' }, (post.owner || '?').charAt(0)),
          h('span', { className: 'ig-post-username' }, post.owner)
        ),
        h('button', { type: 'button', className: 'ig-icon-btn' }, h(ICONS.More, { size: 18 }))
      ),

      h('div', { className: 'ig-post-media-box' },
        post.image_but_text && post.image_but_text.toLowerCase() !== 'none'
          ? h('div', { className: 'ig-photo-placeholder-box', style: { padding: '20px 14px', textAlign: 'center' } },
              h(ICONS.Camera, { size: 36, color: '#52525b' }),
              h('span', { style: { marginTop: 8, color: '#a1a1aa', fontSize: 12, lineHeight: 1.4 } }, post.image_but_text)
            )
          : h('div', { className: 'ig-photo-placeholder-box', style: { padding: '30px 14px', textAlign: 'center' } },
              h('span', { style: { fontSize: 14, fontWeight: 700, color: '#ffffff' } }, post.title || '새 게시물')
            )
      ),

      h('div', { className: 'ig-post-actions-bar' },
        h('div', { className: 'ig-post-actions-left' },
          h('button', {
            type: 'button',
            className: 'ig-post-action-btn',
            onClick: handleLikeToggle
          }, isLiked ? h(ICONS.HeartFilled, { size: 24 }) : h(ICONS.Heart, { size: 24 })),
          h('button', { type: 'button', className: 'ig-post-action-btn', onClick: () => onOpenComments(post) }, h(ICONS.Comment, { size: 23 })),
          h('button', { type: 'button', className: 'ig-post-action-btn', onClick: () => onOpenShare(post) }, h(ICONS.Share, { size: 23 }))
        ),
        h('button', { type: 'button', className: 'ig-post-action-btn' }, h(ICONS.Bookmark, { size: 23 }))
      ),

      h('div', { className: 'ig-post-details' },
        likesCount > 0 && h('span', { className: 'ig-post-likes', onClick: () => onOpenLikes(post) }, `좋아요 ${likesCount}개`),
        h('div', { className: 'ig-post-caption' },
          h('span', { className: 'ig-post-caption-user' }, post.owner),
          post.content || post.title || ''
        ),
        commentsCount > 0 && h('div', { className: 'ig-post-comments-view', onClick: () => onOpenComments(post) }, `댓글 ${commentsCount}개 모두 보기`),
        h('span', { className: 'ig-post-date' }, post.timeStr || '방금 전')
      )
    );
  }

  // ==========================================
  // [2] 댓글 및 완벽한 답글 시트 (스레드 계층화)
  // ==========================================
  function CommentsSheet({ isOpen, post, onClose }) {
    const [commentText, setCommentText] = useState('');
    const [replyParent, setReplyParent] = useState(null);

    if (!isOpen || !post) return null;

    const roomData = DATA.getRoomData();
    const myId = roomData.myId || 'user_me';
    const rawComments = post.comments || [];

    // [핵심] 댓글과 답글을 트리 구조로 정렬 (부모 댓글 바로 아래에 답글들이 모이도록)
    const commentMap = {};
    rawComments.forEach(c => {
      if (c.comment_id) commentMap[c.comment_id] = c;
    });

    const rootComments = [];
    const replyList = [];

    rawComments.forEach(c => {
      const isReply = c.parent && c.parent.toLowerCase() !== 'none' && c.parent.trim() !== '';
      if (isReply) {
        replyList.push(c);
      } else {
        rootComments.push(c);
      }
    });

    // 부모 댓글 바로 뒤에 딸린 답글들을 순서대로 배치
    const threadOrderedComments = [];
    const processedReplies = new Set();

    rootComments.forEach(root => {
      threadOrderedComments.push({ ...root, isReply: false, targetUser: null });

      // 이 부모(comment_id 또는 owner)를 가리키는 답글들 수집
      replyList.forEach(rep => {
        if (rep.parent === root.comment_id || rep.parent === root.owner) {
          threadOrderedComments.push({
            ...rep,
            isReply: true,
            targetUser: root.owner
          });
          processedReplies.add(rep.comment_id);
        }
      });
    });

    // 부모를 찾지 못한 기타 답글들도 누락 없이 하단에 추가
    replyList.forEach(rep => {
      if (!processedReplies.has(rep.comment_id)) {
        const parentObj = commentMap[rep.parent];
        threadOrderedComments.push({
          ...rep,
          isReply: true,
          targetUser: parentObj ? parentObj.owner : rep.parent
        });
      }
    });

    // 댓글/답글 전송 핸들러
    const handleSendComment = () => {
      if (!commentText.trim()) return;
      const text = commentText.trim();
      setCommentText('');

      const timeInfo = DATA.getCurrentFormattedTime();
      const newCommentId = 'ct_' + Date.now().toString(36);
      
      // 답글이면 부모의 comment_id 전달, 없으면 'none'
      const parentId = replyParent ? (replyParent.comment_id || replyParent.owner) : 'none';

      const currentData = DATA.getRoomData();
      const targetPost = currentData.posts.find(p => p.post_id === post.post_id);
      if (targetPost) {
        if (!Array.isArray(targetPost.comments)) targetPost.comments = [];
        targetPost.comments.push({
          comment_id: newCommentId,
          owner: myId,
          parent: parentId,
          content: text,
          timeStr: timeInfo.displayTime
        });
        DATA.saveRoomData(currentData);
      }
      setReplyParent(null);

      DATA.sendPromptToAIStudio({
        type: 'update',
        group: 'comment',
        owner: myId,
        to_post: post.post_id,
        parent: parentId,
        content: text,
        comment_id: newCommentId
      });
    };

    return h('div', { className: 'ig-bottom-sheet-wrapper' },
      h('div', { className: 'ig-bottom-sheet-backdrop open', onClick: onClose }),
      h('div', { className: 'ig-bottom-sheet open' },
        h('div', { className: 'ig-sheet-handle-bar', onClick: onClose }, h('div', { className: 'ig-sheet-handle' })),
        h('div', { className: 'ig-sheet-header' },
          h('div', { style: { width: 24 } }),
          h('span', { className: 'ig-sheet-title' }, '댓글'),
          h('div', { style: { width: 24 } })
        ),

        h('div', { className: 'ig-scroll-body', style: { padding: '10px 14px' } },
          threadOrderedComments.length === 0 && h('div', { style: { textAlign: 'center', padding: '30px 0', color: '#71717a', fontSize: 12 } }, '첫 번째 댓글을 남겨보세요.'),
          
          threadOrderedComments.map(c => {
            const isReply = c.isReply;

            return h('div', {
              key: c.comment_id,
              className: `ig-comment-row ${isReply ? 'is-reply' : ''}`,
              style: isReply ? {
                marginLeft: 38,
                paddingLeft: 8,
                borderLeft: '1.5px solid rgba(255, 255, 255, 0.12)',
                marginBottom: 10
              } : {
                marginBottom: 14
              }
            },
              // 아바타 (답글은 24px 크기, 일반 댓글은 30px 크기)
              h('div', {
                className: 'ig-post-avatar-mini',
                style: isReply ? { width: 24, height: 24, fontSize: 11, background: '#27272a' } : {}
              }, (c.owner || '?').charAt(0)),

              h('div', { className: 'ig-comment-content' },
                h('div', { className: 'ig-comment-bubble-meta' },
                  isReply && h('span', { style: { color: '#f97316', fontWeight: 800, fontSize: 11, marginRight: 2 } }, '↳'),
                  h('span', { className: 'ig-comment-author' }, c.owner),
                  h('span', { className: 'ig-comment-time' }, c.timeStr || '')
                ),

                // 댓글 본문 (답글일 경우 @상대방 멘션 파란색 태그 렌더링)
                h('div', { className: 'ig-comment-text', style: { fontSize: isReply ? 12 : 12.5 } },
                  isReply && c.targetUser && h('span', {
                    style: { color: '#0095f6', fontWeight: 600, marginRight: 5, userSelect: 'none' }
                  }, `@${c.targetUser}`),
                  c.content
                ),

                h('button', {
                  type: 'button',
                  className: 'ig-comment-reply-btn',
                  onClick: () => setReplyParent(c)
                }, '답글 달기')
              )
            );
          })
        ),

        h('div', { className: 'ig-emoji-quick-bar' },
          QUICK_EMOJIS.map(em => h('span', {
            key: em,
            onClick: () => setCommentText(prev => prev + em)
          }, em))
        ),

        // 답글 작성 중 알림 배너
        replyParent && h('div', { className: 'ig-replying-banner' },
          h('span', null, `${replyParent.owner}님에게 답글 남기는 중`),
          h('button', { type: 'button', className: 'ig-icon-btn', onClick: () => setReplyParent(null) }, h(ICONS.Close, { size: 16 }))
        ),

        // 하단 댓글 입력창
        h('div', { className: 'ig-comment-input-bar' },
          h('div', { className: 'ig-post-avatar-mini' }, myId.charAt(0)),
          h('div', { className: 'ig-comment-input-capsule' },
            h('input', {
              type: 'text',
              value: commentText,
              onChange: (e) => setCommentText(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Enter') handleSendComment(); },
              placeholder: replyParent ? `${replyParent.owner}님에게 답글 달기...` : '댓글 달기...',
              autoComplete: 'off'
            })
          )
        )
      )
    );
  }

  // ==========================================
  // [3] 좋아요 시트
  // ==========================================
  function LikesSheet({ isOpen, post, onClose }) {
    if (!isOpen || !post) return null;
    const likes = post.likes || [];

    return h('div', { className: 'ig-bottom-sheet-wrapper' },
      h('div', { className: 'ig-bottom-sheet-backdrop open', onClick: onClose }),
      h('div', { className: 'ig-bottom-sheet open' },
        h('div', { className: 'ig-sheet-handle-bar', onClick: onClose }, h('div', { className: 'ig-sheet-handle' })),
        h('div', { className: 'ig-sheet-header' },
          h('div', { style: { width: 24 } }),
          h('span', { className: 'ig-sheet-title' }, '좋아요'),
          h('div', { style: { width: 24 } })
        ),
        h('div', { className: 'ig-scroll-body', style: { padding: '6px 14px' } },
          likes.length === 0 && h('div', { style: { textAlign: 'center', padding: '30px 0', color: '#71717a', fontSize: 12 } }, '좋아요가 없습니다.'),
          likes.map(uId => h('div', { key: uId, className: 'ig-search-result-item', style: { padding: '7px 0' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
              h('div', { className: 'ig-post-avatar-mini', style: { width: 38, height: 38 } }, uId.charAt(0)),
              h('span', { style: { fontSize: 13, fontWeight: 700 } }, uId)
            )
          ))
        )
      )
    );
  }

  // ==========================================
  // [4] 홈 피드 메인 뷰
  // ==========================================
  function HomeView({ onOpenDM }) {
    const [commentsPost, setCommentsPost] = useState(null);
    const [likesPost, setLikesPost] = useState(null);
    const [roomData, setRoomData] = useState(() => DATA.getRoomData());

    useEffect(() => {
      const handleUpdate = () => setRoomData(DATA.getRoomData());
      window.addEventListener('neo-ig-data-updated', handleUpdate);
      return () => window.removeEventListener('neo-ig-data-updated', handleUpdate);
    }, []);

    const posts = roomData.posts || [];

    return h('div', { className: 'ig-page' },
      h('div', { className: 'ig-top-header' },
        h('span', { className: 'ig-header-logo' }, 'Instagram'),
        h('div', { className: 'ig-header-actions' },
          h('button', { type: 'button', className: 'ig-icon-btn' }, h(ICONS.Heart, { size: 22 })),
          h('button', { type: 'button', className: 'ig-icon-btn', onClick: onOpenDM }, h(ICONS.DM, { size: 22 }))
        )
      ),
      h('div', { className: 'ig-scroll-body' },
        posts.length === 0 && h('div', { style: { textAlign: 'center', padding: '60px 20px', color: '#71717a', fontSize: 13 } },
          '새로운 게시물이 없습니다.'
        ),
        posts.map(p => h(FeedPost, {
          key: p.post_id,
          post: p,
          onOpenComments: (post) => setCommentsPost(post),
          onOpenLikes: (post) => setLikesPost(post),
          onOpenShare: () => {}
        }))
      ),

      h(CommentsSheet, {
        isOpen: !!commentsPost,
        post: commentsPost,
        onClose: () => setCommentsPost(null)
      }),
      h(LikesSheet, {
        isOpen: !!likesPost,
        post: likesPost,
        onClose: () => setLikesPost(null)
      })
    );
  }

  window.NeoIG.Feed = { HomeView };
})();