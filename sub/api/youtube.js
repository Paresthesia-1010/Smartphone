// youtube.js
(function () {
  'use strict';

  console.log('%c[Neo BGM] 🟢 youtube.js 로드 완료', 'color: #38bdf8; font-weight: bold;');

  // HTML 엔티티 복원 (&quot; -> ", &lt; -> < 등)
  function unescapeHTML(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  // 텍스트 속에서 JSON 형태만 안전하게 발라내기
  function extractJSON(str) {
    const cleaned = unescapeHTML(str).trim();
    // 마크다운 코드블록 기호 제거 (```json ... ``` 등)
    const noCodeBlock = cleaned.replace(/```(?:json)?([\s\S]*?)```/gi, '$1').trim();
    
    // { ... } 블록 추출
    const firstBrace = noCodeBlock.indexOf('{');
    const lastBrace = noCodeBlock.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return noCodeBlock.substring(firstBrace, lastBrace + 1);
    }
    return noCodeBlock;
  }

  function processBackgroundMusicBlock(innerContent) {
    // localStorage의 BG_B 안전 검사 (true, "true", "\"true\"" 모두 허용)
    const rawBgB = localStorage.getItem('BG_B');
    const isBgEnabled = rawBgB === 'true' || rawBgB === '"true"' || rawBgB === true;
    
    console.log('[Neo BGM] 📥 태그 발견됨! 원본 내용:', innerContent);
    console.log('[Neo BGM] ⚙️ BG_B 토글 상태:', isBgEnabled, `(localStorage 원본: ${rawBgB})`);

    if (!isBgEnabled) {
      console.warn('[Neo BGM] ⚠️ BG_B 토글이 꺼져 있어(false/null) BGM을 재생하지 않습니다. (출력 탭 설정 확인)');
      return;
    }

    try {
      const jsonText = extractJSON(innerContent);
      console.log('[Neo BGM] 🔍 정제된 JSON 후보:', jsonText);

      const parsed = JSON.parse(jsonText);
      const query = parsed.search || parsed.serach || parsed.query || '';
      const title = parsed.title || query || '배경음악';
      const videoId = parsed.videoId || parsed.videoid || parsed.id || '';

      console.log(`[Neo BGM] 🎯 파싱 결과 => Title: "${title}", VideoId: "${videoId}", Query: "${query}"`);

      // 1. VideoId가 바로 들어있는 경우
      if (videoId) {
        console.log(`%c[Neo BGM] 🎵 즉시 재생 대상: [${videoId}] "${title}"`, 'color: #22c55e; font-weight: bold;');
        if (typeof window.playBGM === 'function') {
          window.playBGM(videoId, title);
        } else {
          console.error('[Neo BGM] ❌ window.playBGM 함수가 정의되지 않았습니다. sub/bgm/play.js가 먼저 로드되었는지 확인하세요.');
        }
        return;
      }

      // 2. 검색어만 있는 경우 -> background.js 통신
      if (query) {
        console.log(`[Neo BGM] 🔎 백그라운드 Invidious 검색 요청 전송: "${query}"`);
        if (!chrome?.runtime?.sendMessage) {
          console.error('[Neo BGM] ❌ chrome.runtime 컨텍스트가 만료되었습니다. AI Studio 탭을 새로고침(F5)하세요.');
          return;
        }

        chrome.runtime.sendMessage({ type: 'SEARCH_YOUTUBE', keyword: query }, (res) => {
          if (chrome.runtime.lastError) {
            console.error('[Neo BGM] ❌ Background 통신 에러:', chrome.runtime.lastError.message);
            return;
          }

          if (res && res.success && res.data) {
            const fetchedId = res.data.videoId;
            const fetchedTitle = res.data.title || title;
            console.log(`%c[Neo BGM] 🎵 검색 성공 최상단 영상: [${fetchedId}] "${fetchedTitle}"`, 'color: #22c55e; font-weight: bold;');
            if (typeof window.playBGM === 'function') {
              window.playBGM(fetchedId, fetchedTitle);
            }
          } else {
            console.warn('[Neo BGM] ⚠️ 검색 실패 또는 결과 없음:', res?.error);
          }
        });
      }
    } catch (e) {
      console.error('[Neo BGM] ❌ 태그 내부 JSON 파싱 에러:', e, '원본 텍스트:', innerContent);
    }
  }

  function scanAndProcessBgmTags() {
    // AI Studio의 턴 컨테이너 탐색
    const turns = document.querySelectorAll('ms-chat-turn, .chat-turn-container');
    if (!turns.length) return;

    // 대소문자 무시, 엔티티(&lt; &gt;) 및 역슬래시 이스케이프 포용 정규식
    const bgmTagRegex = /(?:<backgroundmusic>|&lt;backgroundmusic&gt;)([\s\S]*?)(?:<\/backgroundmusic>|&lt;\/backgroundmusic&gt;)/i;

    turns.forEach((turn) => {
      // 이미 성공적으로 처리된 요소는 스킵
      if (turn.dataset.bgmProcessed === 'true') return;

      const html = turn.innerHTML || '';
      const text = turn.textContent || '';
      
      const hasTag = html.includes('backgroundmusic') || text.includes('backgroundmusic');
      if (!hasTag) return;

      // 닫는 태그가 완성되었는지 확인 (스트리밍 중 조기 판정 방지)
      const hasClose = /<\/backgroundmusic>|&lt;\/backgroundmusic&gt;/i.test(html) || 
                       /<\/backgroundmusic>|&lt;\/backgroundmusic&gt;/i.test(text);

      if (!hasClose) {
        // 아직 모델이 출력 중이므로 대기
        return;
      }

      // 텍스트 또는 HTML에서 매칭 시도
      const match = text.match(bgmTagRegex) || html.match(bgmTagRegex);
      if (match && match[1]) {
        processBackgroundMusicBlock(match[1]);
        turn.dataset.bgmProcessed = 'true';

        // 사용자 화면에서 지저분한 태그 숨기기
        turn.querySelectorAll('p, pre, code, ms-code-block, mat-expansion-panel').forEach((block) => {
          if (block.textContent && block.textContent.includes('backgroundmusic')) {
            block.style.display = 'none';
          }
        });
      }
    });
  }

  // DOM 변화 실시간 감지
  const bgmObserver = new MutationObserver(() => {
    scanAndProcessBgmTags();
  });

  bgmObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 초기 1회 실행
  scanAndProcessBgmTags();
})();