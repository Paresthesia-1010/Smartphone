// sub/bgm/play.js
(function () {
  'use strict';

  console.log('[Neo BGM] sub/bgm/play.js loaded (Bulletproof Next-Track & Track Info Mode).');

  // 스타일 주입
  const STYLE_ID = 'neo-bgm-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* 유튜브 컨테이너: 화면 뒤로 완전 은폐 (z-index: -9999) */
      #neo-bgm-container {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 300px !important;
        height: 200px !important;
        z-index: -9999 !important;
        pointer-events: none !important;
        overflow: hidden !important;
      }
      #neo-bgm-container iframe {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        border: none !important;
      }

      /* 사운드 트리거 버튼 (뉴스 아이콘 바로 아래 top: 116px) */
      #neo-volume-trigger {
        position: fixed;
        top: 116px;
        right: 24px;
        z-index: 1000;
        background: rgba(26, 26, 26, 0.85);
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
      #neo-volume-trigger:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: #22c55e;
        transform: scale(1.05);
      }
      #neo-volume-trigger.playing {
        border-color: #22c55e;
        color: #22c55e;
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.4);
      }
      #neo-volume-trigger svg { width: 19px; height: 19px; stroke: currentColor; }

      /* 볼륨 슬라이더 및 곡 정보 팝오버 */
      #neo-volume-popover {
        position: fixed;
        top: 116px;
        right: 74px;
        z-index: 1001;
        background: rgba(18, 18, 18, 0.96);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 14px;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 210px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.85);
        opacity: 0;
        pointer-events: none;
        transform: translateX(10px);
        transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
      }
      #neo-volume-popover.open {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(0);
      }

      /* 현재 재생 중인 곡 정보 표시 영역 */
      .neo-track-info-box {
        display: flex;
        flex-direction: column;
        gap: 3px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 8px;
      }
      .neo-track-badge {
        font-size: 9.5px;
        font-weight: 700;
        color: #22c55e;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .neo-track-badge::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
      }
      .neo-track-title {
        font-size: 12px;
        font-weight: 600;
        color: #f3f4f6;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.4;
      }

      /* 슬라이더 바 */
      .neo-slider-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      #neo-volume-slider {
        -webkit-appearance: none;
        appearance: none;
        flex: 1;
        height: 5px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        outline: none;
        cursor: pointer;
      }
      #neo-volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 0 6px rgba(0,0,0,0.5);
        cursor: pointer;
      }
      #neo-volume-val {
        font-size: 11.5px;
        font-weight: 700;
        color: #e5e5e5;
        min-width: 32px;
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
    `;
    document.head.appendChild(style);
  }

  let masterVolume = parseInt(localStorage.getItem('neo_bgm_volume') || '50', 10);
  if (isNaN(masterVolume)) masterVolume = 50;

  let currentVideoId = null;
  let currentTitle = '재생 대기 중';
  let activeFrame = null;
  let oldFadeTimer = null;

  // 유튜브 URL에서 순수 11자리 Video ID만 안전하게 추출
  function extractVideoId(input) {
    if (!input) return null;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : input;
  }

  function ensureContainer() {
    let container = document.getElementById('neo-bgm-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'neo-bgm-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function postToIframe(iframe, func, args = []) {
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    } catch (e) {}
  }

  function updateTrackUI(title, isPlaying = true) {
    currentTitle = title;
    const titleEl = document.getElementById('neo-current-track-title');
    if (titleEl) {
      titleEl.textContent = title;
      titleEl.title = title;
    }
    const triggerBtn = document.getElementById('neo-volume-trigger');
    if (triggerBtn) {
      if (isPlaying) triggerBtn.classList.add('playing');
      else triggerBtn.classList.remove('playing');
    }
  }

  // BGM 재생 함수
  window.playBGM = function (rawId, title = '배경음악') {
    const videoId = extractVideoId(rawId);
    if (!videoId) return;

    // 이미 같은 곡이 재생 중이면 중복 방지
    if (currentVideoId === videoId) return;
    currentVideoId = videoId;

    updateTrackUI(title, true);
    const container = ensureContainer();

    // 1. 이전 곡이 있다면 1초 만에 깔끔하게 페이드아웃 후 완전 삭제 (충돌 방지)
    const oldIframe = activeFrame;
    if (oldIframe) {
      if (oldFadeTimer) clearInterval(oldFadeTimer);
      let fadeStep = 0;
      const totalSteps = 5; // 200ms * 5 = 1초
      const startVol = masterVolume;

      oldFadeTimer = setInterval(() => {
        fadeStep++;
        const vol = Math.max(0, Math.round(startVol * (1 - fadeStep / totalSteps)));
        postToIframe(oldIframe, 'setVolume', [vol]);

        if (fadeStep >= totalSteps) {
          clearInterval(oldFadeTimer);
          oldFadeTimer = null;
          postToIframe(oldIframe, 'stopVideo');
          oldIframe.remove();
        }
      }, 200);
    }

    // 2. 새 곡 iframe 생성 및 즉각 주입
    const newIframe = document.createElement('iframe');
    newIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0`;
    newIframe.allow = 'autoplay; encrypted-media';
    newIframe.tabIndex = -1;
    newIframe.setAttribute('aria-hidden', 'true');

    container.appendChild(newIframe);
    activeFrame = newIframe;

    // 3. 로딩 타이밍에 맞춰 확실하게 마스터 볼륨 주입 (소리 0 굳음 방지)
    [300, 700, 1200].forEach((delay) => {
      setTimeout(() => {
        if (activeFrame === newIframe) {
          postToIframe(newIframe, 'unMute');
          postToIframe(newIframe, 'setVolume', [masterVolume]);
          postToIframe(newIframe, 'playVideo');
        }
      }, delay);
    });

    console.log(`%c[Neo BGM] 🎵 다음 곡 재생: [${videoId}] "${title}"`, 'color: #22c55e; font-weight: bold;');
  };

  // 정지 함수
  window.stopBGM = function () {
    if (oldFadeTimer) {
      clearInterval(oldFadeTimer);
      oldFadeTimer = null;
    }
    const container = document.getElementById('neo-bgm-container');
    if (container) {
      container.innerHTML = '';
    }
    activeFrame = null;
    currentVideoId = null;
    updateTrackUI('재생 중인 곡 없음', false);
    console.log('[Neo BGM] ⏹️ BGM 정지됨');
  };

  // 슬라이더 볼륨 조절
  window.setBGMVolume = function (vol) {
    masterVolume = Math.max(0, Math.min(100, parseInt(vol, 10)));
    localStorage.setItem('neo_bgm_volume', masterVolume.toString());

    if (activeFrame) {
      postToIframe(activeFrame, 'unMute');
      postToIframe(activeFrame, 'setVolume', [masterVolume]);
    }

    const valText = document.getElementById('neo-volume-val');
    if (valText) valText.textContent = `${masterVolume}%`;
  };

  // 사운드 슬라이더 및 트랙 정보 UI 주입
  function injectSoundUI() {
    if (document.getElementById('neo-volume-trigger')) return;

    const btn = document.createElement('button');
    btn.id = 'neo-volume-trigger';
    btn.type = 'button';
    btn.title = 'BGM 볼륨 조절';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
    `;

    const popover = document.createElement('div');
    popover.id = 'neo-volume-popover';
    popover.innerHTML = `
      <div class="neo-track-info-box">
        <div class="neo-track-badge">NOW PLAYING</div>
        <div id="neo-current-track-title" class="neo-track-title">${currentTitle}</div>
      </div>
      <div class="neo-slider-row">
        <input type="range" id="neo-volume-slider" min="0" max="100" value="${masterVolume}">
        <span id="neo-volume-val">${masterVolume}%</span>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(popover);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('open');
    });

    const slider = popover.querySelector('#neo-volume-slider');
    slider.addEventListener('input', (e) => {
      window.setBGMVolume(e.target.value);
    });

    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && !btn.contains(e.target)) {
        popover.classList.remove('open');
      }
    });
  }

  window.addEventListener('neo-bgb-updated', (e) => {
    if (!e.detail.enabled) {
      window.stopBGM();
    }
  });

  injectSoundUI();
  const observer = new MutationObserver(() => injectSoundUI());
  observer.observe(document.body, { childList: true, subtree: true });
})();