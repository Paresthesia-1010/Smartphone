/**
 * [AI Studio Clean Script] clean.js
 * Angular <div class="ng-star-inserted"> 완벽 대응 버전
 */
(function () {
  'use strict';

  console.log('[Clean Script] Angular div.ng-star-inserted targeted clean.js loaded.');

  // 숨김용 CSS
  const CLEAN_STYLE_ID = 'neo-clean-tags-style';
  if (!document.getElementById(CLEAN_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = CLEAN_STYLE_ID;
    style.textContent = `
      kakaotalk, message, insta, news_gui, smartphone_normal,
      .neo-clean-hidden-block {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  const CLEAN_TARGETS = [
    'kakaotalk',
    'message',
    'insta',
    'smartphone_normal',
    'news_gui',
    'backgroundmusic',
    'bank',
  ];

  function scanAndCleanCompletedBlocks() {
    const turns = document.querySelectorAll('ms-chat-turn');
    if (!turns.length) return;

    turns.forEach(turn => {
      const turnText = turn.textContent || '';

      CLEAN_TARGETS.forEach(tag => {
        // 1. 열림/닫힘 태그 완결 검사 (타이핑 중일 땐 절대 건드리지 않음)
        const hasOpen = turnText.includes(`<${tag}`) || turnText.includes(`&lt;${tag}`);
        const hasClose = turnText.includes(`</${tag}>`) || turnText.includes(`&lt;/${tag}&gt;`);

        if (!hasOpen || !hasClose) return;

        // 2. 완성된 태그 감지 정규식
        const tagRegex = new RegExp(`(?:<${tag}[^>]*>|&lt;${tag}[^&]*&gt;)[\\s\\S]*?(?:<\\/${tag}>|&lt;\\/${tag}&gt;)`, 'gi');

        // 3. 실제 DOM 요소로 살아있는 경우 즉시 숨김
        turn.querySelectorAll(tag).forEach(el => {
          el.classList.add('neo-clean-hidden-block');
          el.style.display = 'none';
        });

        // 4. [핵심] div.ng-star-inserted 및 모든 렌더링 블록 정밀 탐색!
        const candidateBlocks = turn.querySelectorAll('div.ng-star-inserted, div, p, pre, ms-code-block, mat-expansion-panel');
        
        candidateBlocks.forEach(block => {
          if (block.classList.contains('neo-clean-hidden-block')) return;

          const bText = block.textContent || '';
          if (!bText.includes(tag)) return;

          // 자식 중에 태그를 가진 더 구체적인 블록이 있다면 부모(턴 전체 등)는 패스 (일반 대사 보호)
          const hasChildWithTag = Array.from(block.children).some(child => (child.textContent || '').includes(tag));
          if (hasChildWithTag && block.tagName.toLowerCase() !== 'pre') return;

          // 태그를 지우고 남은 순수 텍스트 확인
          const stripped = bText.replace(tagRegex, '').trim();

          // 1) 블록에 태그 데이터만 있었던 경우 -> 통째로 display: none
          if (stripped === '') {
            block.classList.add('neo-clean-hidden-block');
            block.style.display = 'none';
          } 
          // 2) 일반 대사와 한 블록에 섞여 있는 경우 -> 태그 문자열만 텍스트에서 삭제
          else {
            block.innerHTML = block.innerHTML.replace(tagRegex, '');
          }
        });
      });
    });
  }

  // 안전 쓰로틀링 루프
  let isThrottled = false;
  function safeCleanExecution() {
    if (isThrottled) return;
    isThrottled = true;

    requestAnimationFrame(() => {
      isThrottled = false;
      cleanObserver.disconnect();
      try {
        scanAndCleanCompletedBlocks();
      } finally {
        cleanObserver.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    });
  }

  // 초기 1회 실행
  scanAndCleanCompletedBlocks();

  // 변동 감지 옵저버
  const cleanObserver = new MutationObserver(() => {
    safeCleanExecution();
  });

  cleanObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 스트리밍 종료 직후 찰나의 순간도 놓치지 않도록 250ms 주기적 안전 검사
  setInterval(scanAndCleanCompletedBlocks, 250);
})();