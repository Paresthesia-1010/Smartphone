(function () {
  'use strict';

  console.log('[AI Studio Tool] sub/tool.js loaded with Infinite Loop Protection.');

  
  const toolStyleId = 'neo-chat-tool-style';
  if (!document.getElementById(toolStyleId)) {
    const style = document.createElement('style');
    style.id = toolStyleId;
    style.textContent = `
      
      .actions.hover-or-edit,
      .hover-or-edit,
      ms-chat-turn-options,
      .chunk-editor-action-buttons {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      
      ms-chat-turn.neo-turn-hidden {
        display: none !important;
      }

      
      #neo-load-more-turns-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 14px 0 22px 0;
      }

      #neo-load-more-turns-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 14px;
        padding: 7px 16px;
        font-size: 12px;
        font-weight: 600;
        color: #d4d4d4;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        transition: all 0.2s ease;
      }

      #neo-load-more-turns-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
        color: #ffffff;
        transform: translateY(-1px);
      }

      #neo-load-more-turns-btn svg {
        width: 14px;
        height: 14px;
      }

      
      .neo-turn-action-bar {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 6px !important;
        margin-top: 10px !important;
        padding-top: 8px !important;
        width: 100% !important;
      }

      
      .neo-turn-action-bar .default-group {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .neo-turn-action-bar .edit-group {
        display: none !important;
        align-items: center !important;
        gap: 6px !important;
      }

      .neo-turn-action-bar.in-edit-mode .default-group { display: none !important; }
      .neo-turn-action-bar.in-edit-mode .edit-group { display: flex !important; }

      
      .neo-tool-btn {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        padding: 0 !important;
        border-radius: 9px !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        background: rgba(255, 255, 255, 0.04) !important;
        color: #a3a3a3 !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.2s ease !important;
      }

      .neo-tool-btn:hover {
        background: rgba(255, 255, 255, 0.12) !important;
        color: #ffffff !important;
        border-color: rgba(255, 255, 255, 0.25) !important;
        transform: translateY(-1px);
      }

      .neo-tool-btn svg {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
      }

      .neo-tool-btn.btn-delete:hover {
        background: rgba(239, 68, 68, 0.18) !important;
        border-color: rgba(239, 68, 68, 0.45) !important;
        color: #f87171 !important;
      }

      .neo-tool-btn.btn-confirm-edit:hover {
        background: rgba(34, 197, 94, 0.18) !important;
        border-color: rgba(34, 197, 94, 0.45) !important;
        color: #4ade80 !important;
      }

      .neo-tool-btn.btn-cancel-edit:hover {
        background: rgba(239, 68, 68, 0.18) !important;
        border-color: rgba(239, 68, 68, 0.45) !important;
        color: #f87171 !important;
      }

      
      #neo-delete-confirm-backdrop {
        position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(12px); z-index: 9999;
        display: flex; align-items: center; justify-content: center;
      }

      .neo-delete-card {
        width: 320px; background: rgba(18, 18, 18, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 18px;
        padding: 22px 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
        display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px;
      }

      .neo-delete-actions { display: flex; gap: 8px; width: 100%; margin-top: 6px; }
      .neo-delete-btn-action { flex: 1; height: 36px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s ease; }
      .neo-delete-btn-cancel { background: rgba(255, 255, 255, 0.08); color: #a3a3a3; }
      .neo-delete-btn-cancel:hover { background: rgba(255, 255, 255, 0.14); color: #ffffff; }
      .neo-delete-btn-confirm { background: #ef4444; color: #ffffff; }
      .neo-delete-btn-confirm:hover { background: #dc2626; }
    `;
    document.head.appendChild(style);
  }

  
  function fireNativeClick(element) {
    if (!element) return;
    ['mousedown', 'mouseup', 'click'].forEach(evt => {
      element.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
    });
  }

  function openDeleteConfirmModal(onConfirm) {
    const prev = document.getElementById('neo-delete-confirm-backdrop');
    if (prev) prev.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'neo-delete-confirm-backdrop';
    backdrop.innerHTML = `
      <div class="neo-delete-card">
        <div style="font-size: 22px; color: #f87171;">🗑</div>
        <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0;">대화 턴 삭제</h3>
        <p style="font-size: 12.5px; color: #a3a3a3; margin: 0; line-height: 1.5;">
          이 메시지를 삭제하시겠습니까?<br>삭제 후에는 되돌릴 수 없습니다.
        </p>
        <div class="neo-delete-actions">
          <button class="neo-delete-btn-action neo-delete-btn-cancel" id="neo-del-cancel">취소</button>
          <button class="neo-delete-btn-action neo-delete-btn-confirm" id="neo-del-ok">삭제</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    const closeModal = () => backdrop.remove();
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
    backdrop.querySelector('#neo-del-cancel').addEventListener('click', closeModal);
    backdrop.querySelector('#neo-del-ok').addEventListener('click', () => {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    });
  }

  
  const PAGE_SIZE = 5;
  let visibleCount = PAGE_SIZE;
  let cachedHiddenCount = -1;

  function manageTurnVisibility() {
    const turns = Array.from(document.querySelectorAll('ms-chat-turn'));
    const totalTurns = turns.length;
    if (totalTurns === 0) return;

    const startIndex = Math.max(0, totalTurns - visibleCount);
    const hiddenCount = startIndex;

    
    turns.forEach((turn, index) => {
      const shouldHide = index < startIndex;
      if (shouldHide && !turn.classList.contains('neo-turn-hidden')) {
        turn.classList.add('neo-turn-hidden');
      } else if (!shouldHide && turn.classList.contains('neo-turn-hidden')) {
        turn.classList.remove('neo-turn-hidden');
      }
    });

    let wrapper = document.getElementById('neo-load-more-turns-wrapper');
    const firstVisibleTurn = turns[startIndex];

    if (hiddenCount > 0 && firstVisibleTurn && firstVisibleTurn.parentElement) {
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'neo-load-more-turns-wrapper';
        wrapper.innerHTML = `
          <button type="button" id="neo-load-more-turns-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <span id="neo-load-more-text"></span>
          </button>
        `;

        wrapper.querySelector('#neo-load-more-turns-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          visibleCount += PAGE_SIZE;
          scheduleUpdate();
        });
      }

      
      if (cachedHiddenCount !== hiddenCount) {
        cachedHiddenCount = hiddenCount;
        const textSpan = wrapper.querySelector('#neo-load-more-text');
        if (textSpan) {
          textSpan.textContent = `이전 기록 ${hiddenCount}개 확인하기 (+${Math.min(PAGE_SIZE, hiddenCount)})`;
        }
      }

      if (wrapper.nextSibling !== firstVisibleTurn) {
        firstVisibleTurn.parentElement.insertBefore(wrapper, firstVisibleTurn);
      }
    } else {
      cachedHiddenCount = -1;
      if (wrapper) wrapper.remove();
    }
  }

  
  function enterEditMode(turn, bar) {
    const editBtn = turn.querySelector('.toggle-edit-button, button[aria-label*="Edit"]');
    if (editBtn) {
      fireNativeClick(editBtn);
      bar.classList.add('in-edit-mode');
    }
  }

  function confirmEdit(turn, bar) {
    const saveBtn = turn.querySelector('button[aria-label*="Save"], button[aria-label*="Done"], .save-button, .confirm-button') ||
                    turn.querySelector('.chunk-editor-action-buttons button:last-child') ||
                    turn.querySelector('.toggle-edit-button');
    if (saveBtn) fireNativeClick(saveBtn);
    bar.classList.remove('in-edit-mode');
  }

  function cancelEdit(turn, bar) {
    const cancelBtn = turn.querySelector('button[aria-label*="Cancel"], button[aria-label*="Close"], .cancel-button') ||
                      turn.querySelector('.toggle-edit-button');
    if (cancelBtn) fireNativeClick(cancelBtn);
    bar.classList.remove('in-edit-mode');
  }

  function triggerRerun(turn) {
    const rerunBtn = turn.querySelector('.rerun-button, button[name="rerun-button"], button[aria-label*="Rerun"]');
    if (rerunBtn) fireNativeClick(rerunBtn);
  }

  function triggerCopy(turn) {
    const content = turn.querySelector('.turn-content') || turn.querySelector('.cmark-node') || turn;
    const textToCopy = content ? content.innerText : '';
    if (navigator.clipboard && textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        if (typeof window.showNeoToast === 'function') {
          window.showNeoToast('✓ 클립보드에 복사되었습니다.');
        }
      });
    }
  }

  async function triggerNativeDelete(turn) {
    const moreBtn = turn.querySelector('ms-chat-turn-options button, button[aria-label*="options"]');
    if (!moreBtn) return;

    fireNativeClick(moreBtn);

    let deleteMenuItem = null;
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 60));
      const menuItems = document.querySelectorAll('.mat-mdc-menu-item, [role="menuitem"]');
      for (const item of menuItems) {
        if (item.innerText && item.innerText.toLowerCase().includes('delete')) {
          deleteMenuItem = item;
          break;
        }
      }
      if (deleteMenuItem) break;
    }

    if (deleteMenuItem) {
      fireNativeClick(deleteMenuItem);
    } else {
      fireNativeClick(moreBtn);
    }
  }

  
  function updateTurnActionBar() {
    const turns = document.querySelectorAll('ms-chat-turn');
    if (!turns.length) return;

    const lastTurn = turns[turns.length - 1];

    
    turns.forEach((t, idx) => {
      if (idx !== turns.length - 1) {
        const oldBar = t.querySelector('.neo-turn-action-bar');
        if (oldBar) oldBar.remove();
      }
    });

    const existingBar = lastTurn.querySelector('.neo-turn-action-bar');
    if (existingBar) {
      const isEditing = !!lastTurn.querySelector('textarea, ms-chunk-editor, .chunk-editor');
      if (!isEditing && existingBar.classList.contains('in-edit-mode')) {
        existingBar.classList.remove('in-edit-mode');
      }
      return;
    }

    const turnContainer = lastTurn.querySelector('.chat-turn-container') || lastTurn;
    const bar = document.createElement('div');
    bar.className = 'neo-turn-action-bar';
    bar.innerHTML = `
      <div class="default-group">
        <button class="neo-tool-btn btn-copy" title="복사" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button class="neo-tool-btn btn-edit" title="수정" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="neo-tool-btn btn-rerun" title="재생성" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
        </button>
        <button class="neo-tool-btn btn-delete" title="삭제" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <div class="edit-group">
        <button class="neo-tool-btn btn-confirm-edit" title="수정 완료" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
        <button class="neo-tool-btn btn-cancel-edit" title="수정 취소" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    bar.querySelector('.btn-copy').addEventListener('click', (e) => { e.stopPropagation(); triggerCopy(lastTurn); });
    bar.querySelector('.btn-edit').addEventListener('click', (e) => { e.stopPropagation(); enterEditMode(lastTurn, bar); });
    bar.querySelector('.btn-rerun').addEventListener('click', (e) => { e.stopPropagation(); triggerRerun(lastTurn); });
    bar.querySelector('.btn-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      openDeleteConfirmModal(() => { triggerNativeDelete(lastTurn); });
    });

    bar.querySelector('.btn-confirm-edit').addEventListener('click', (e) => { e.stopPropagation(); confirmEdit(lastTurn, bar); });
    bar.querySelector('.btn-cancel-edit').addEventListener('click', (e) => { e.stopPropagation(); cancelEdit(lastTurn, bar); });

    turnContainer.appendChild(bar);
  }

  
  let isScheduled = false;

  function scheduleUpdate() {
    if (isScheduled) return;
    isScheduled = true;

    
    requestAnimationFrame(() => {
      isScheduled = false;

      
      toolObserver.disconnect();
      try {
        manageTurnVisibility();
        updateTurnActionBar();
      } finally {
        
        toolObserver.observe(document.body, { childList: true, subtree: true });
      }
    });
  }

  
  scheduleUpdate();

  
  const toolObserver = new MutationObserver((mutations) => {
    
    let hasRelevantMutation = false;
    for (const m of mutations) {
      if (m.addedNodes.length > 0 || m.removedNodes.length > 0) {
        hasRelevantMutation = true;
        break;
      }
    }
    if (hasRelevantMutation) {
      scheduleUpdate();
    }
  });

  toolObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();