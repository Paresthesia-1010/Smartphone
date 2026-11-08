(function () {
  'use strict';

  console.log('[Smartphone App] toss.js (Toss Banking Full System) loaded.');

  // 이미지 경로 유틸리티
  function getLocalImagePath(fileName) {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
        return chrome.runtime.getURL(`sub/smartphone/${fileName}`);
      }
    } catch (e) {}

    const extId = document.querySelector('meta[name="extension-id"]')?.content;
    if (extId) {
      return `chrome-extension://${extId}/sub/smartphone/${fileName}`;
    }

    return `sub/smartphone/${fileName}`;
  }

  const TOSS_ICON_PATH = getLocalImagePath('toss.png');
  const STORAGE_KEY = 'neo_toss_bank_map';

  // 지원 은행 목록 (규정 명세 기반)
  const SUPPORTED_BANKS = [
    { name: '토스뱅크', color: '#3182f6', code: 'TOSS' },
    { name: '카카오뱅크', color: '#fee500', code: 'KAKAO' },
    { name: 'KB국민', color: '#ffbc00', code: 'KB' },
    { name: '신한', color: '#0046ff', code: 'SHINHAN' },
    { name: '우리', color: '#0083ca', code: 'WOORI' },
    { name: '하나', color: '#00907f', code: 'HANA' },
    { name: 'NH농협', color: '#1a9a44', code: 'NH' },
    { name: 'IBK기업', color: '#18499a', code: 'IBK' },
    { name: '케이뱅크', color: '#0033a0', code: 'KBANK' },
    { name: '새마을', color: '#005baa', code: 'MG' },
    { name: '부산', color: '#d6001c', code: 'BUSAN' },
    { name: 'iM뱅크(대구)', color: '#009d94', code: 'IM' },
    { name: '신협', color: '#003e7e', code: 'CU' },
    { name: '우체국', color: '#e60012', code: 'POST' },
    { name: 'SC제일', color: '#00a546', code: 'SC' },
    { name: '경남은행', color: '#b91c1c', code: 'KN' },
    { name: '광주은행', color: '#ea580c', code: 'GJ' },
    { name: '전북은행', color: '#1d4ed8', code: 'JB' },
    { name: '제주은행', color: '#0284c7', code: 'JJ' },
    { name: '수협은행', color: '#0284c7', code: 'SH' },
    { name: '시티뱅크', color: '#002d72', code: 'CITI' }
  ];

  // 스타일 주입
  const STYLE_ID = 'neo-toss-app-style';
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    bank,
    ms-chat-turn bank,
    .neo-bank-hidden-block {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #neo-toss-view {
      position: absolute;
      top: 28px;
      left: 0;
      right: 0;
      bottom: 0;
      background: #101013;
      z-index: 8;
      display: none;
      flex-direction: column;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 0 0 36px 36px;
      transform: scale(0.15);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.36s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
    }

    #neo-toss-view.active {
      display: flex !important;
      transform: scale(1) !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    #neo-toss-view.closing {
      display: flex !important;
      transform: scale(0.15) !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .toss-safe-top-spacer { height: 8px; flex-shrink: 0; }

    /* 화면 페이지 공통 */
    .toss-page {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #101013;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      overflow: hidden;
      z-index: 10;
      transition: transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    }
    .toss-page.hidden-page {
      transform: translateX(100%);
      pointer-events: none;
      opacity: 0;
    }

    /* 토스 상단 앱 헤더 */
    .toss-header-row {
      height: 44px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      z-index: 20;
    }
    .toss-header-title-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
    }
    .toss-header-icons {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #a1a1aa;
    }
    .toss-header-icons svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
    .toss-back-btn {
      background: transparent;
      border: none;
      color: #ffffff;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
    }
    .toss-back-btn svg {
      width: 20px;
      height: 20px;
      stroke-width: 2.5;
      stroke: currentColor;
      fill: none;
    }

    /* 스크롤 본문 */
    .toss-body {
      flex: 1;
      overflow-y: auto;
      padding: 6px 14px 14px 14px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .toss-body::-webkit-scrollbar { display: none; }

    /* 메인 주거래 카드 */
    .toss-account-card {
      background: #1b1b1e;
      border-radius: 20px;
      padding: 18px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .toss-account-card:active {
      background: #242429;
    }
    .toss-card-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .toss-symbol-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3182f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      flex-shrink: 0;
    }
    .toss-card-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .toss-card-balance {
      font-size: 19px;
      font-weight: 700;
      color: #ffffff;
    }
    .toss-card-sub {
      font-size: 12px;
      color: #8b8b93;
    }
    .toss-btn-send-mini {
      background: #2a2a2e;
      border: none;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .toss-btn-send-mini:hover {
      background: #323238;
    }

    /* 하단 단일 [홈] 탭 네비게이션 */
    .toss-single-nav {
      height: 46px;
      background: #101013;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .toss-home-tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      color: #ffffff;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
    }
    .toss-home-tab-item svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    /* 홈 인디케이터 바 */
    .toss-home-bar-touch {
      padding: 4px 0 4px 0;
      cursor: pointer;
      display: flex;
      justify-content: center;
      background: #101013;
      flex-shrink: 0;
    }
    .toss-home-bar {
      width: 70px;
      height: 3px;
      background: #ffffff;
      border-radius: 2px;
      opacity: 0.85;
      transition: width 0.2s, opacity 0.2s;
    }
    .toss-home-bar-touch:hover .toss-home-bar {
      opacity: 1;
      width: 78px;
    }

    /* ---------------- 송금 스텝 스타일 ---------------- */
    .toss-page-title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 10px 0 14px 0;
      letter-spacing: -0.4px;
    }
    .toss-tab-pills {
      display: flex;
      gap: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 8px;
      margin-bottom: 14px;
    }
    .toss-tab-pill {
      font-size: 14px;
      font-weight: 700;
      color: #71717a;
      cursor: pointer;
      position: relative;
    }
    .toss-tab-pill.active {
      color: #ffffff;
    }
    .toss-tab-pill.active::after {
      content: '';
      position: absolute;
      bottom: -9px;
      left: 0;
      right: 0;
      height: 2px;
      background: #ffffff;
      border-radius: 1px;
    }

    .toss-input-box-fake {
      background: #1a1a1e;
      border-radius: 14px;
      padding: 13px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #71717a;
      font-size: 13.5px;
      cursor: pointer;
      margin-bottom: 16px;
    }

    .toss-list-section-header {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      margin: 8px 0 8px 0;
    }

    .toss-recipient-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      cursor: pointer;
    }
    .toss-recip-left {
      display: flex;
      align-items: center;
      gap: 11px;
      min-width: 0;
    }
    .toss-bank-icon-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #3182f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
      flex-shrink: 0;
    }
    .toss-recip-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .toss-recip-name {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .toss-recip-sub {
      font-size: 11.5px;
      color: #8b8b93;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .toss-star-btn {
      background: transparent;
      border: none;
      color: #3f3f46;
      font-size: 16px;
      cursor: pointer;
      padding: 6px;
    }
    .toss-star-btn.fav {
      color: #3182f6;
    }

    /* 직접 입력 폼 */
    .toss-under-input-wrap {
      border-bottom: 2px solid #3182f6;
      padding-bottom: 6px;
      margin-top: 14px;
    }
    .toss-under-label {
      font-size: 11.5px;
      color: #3182f6;
      font-weight: 600;
    }
    .toss-under-value {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      min-height: 28px;
      display: flex;
      align-items: center;
    }
    .toss-under-value.cursor::after {
      content: '|';
      color: #3182f6;
      font-weight: 300;
      animation: blink 1s infinite;
      margin-left: 2px;
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    .toss-select-bank-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding: 14px 0 10px 0;
      cursor: pointer;
      margin-top: 10px;
    }
    .toss-select-bank-text {
      font-size: 16px;
      font-weight: 700;
      color: #71717a;
    }
    .toss-select-bank-text.selected {
      color: #ffffff;
    }
    .toss-bank-hint {
      font-size: 11.5px;
      color: #52525b;
      margin-top: 6px;
    }
    .toss-match-err {
      font-size: 11.5px;
      color: #ef4444;
      margin-top: 6px;
      display: none;
    }

    /* 숫자 키패드 */
    .toss-keypad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      padding: 8px 10px 10px 10px;
      background: #17171c;
      border-radius: 20px 20px 0 0;
      margin-top: auto;
      flex-shrink: 0;
    }
    .toss-key {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: background 0.1s;
    }
    .toss-key:active {
      background: rgba(255, 255, 255, 0.1);
    }
    .toss-key svg {
      width: 20px;
      height: 20px;
      stroke-width: 2.2;
      stroke: currentColor;
      fill: none;
    }

    /* 파란색 풀 버튼 */
    .toss-bottom-btn {
      width: 100%;
      height: 48px;
      background: #3182f6;
      border: none;
      border-radius: 14px;
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s, opacity 0.15s;
      margin-top: auto;
      flex-shrink: 0;
    }
    .toss-bottom-btn:disabled {
      background: #252830;
      color: #71717a;
      cursor: not-allowed;
    }

    /* 은행 선택 바텀시트 모달 */
    .toss-sheet-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: 50;
      display: none;
      flex-direction: column;
      justify-content: flex-end;
    }
    .toss-sheet-backdrop.open {
      display: flex;
    }
    .toss-bottom-sheet {
      background: #1b1b1e;
      border-radius: 24px 24px 0 0;
      padding: 14px 14px 20px 14px;
      display: flex;
      flex-direction: column;
      max-height: 80%;
      animation: sheetUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes sheetUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    .toss-sheet-title {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 12px;
      padding-left: 2px;
    }
    .toss-bank-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 7px;
      overflow-y: auto;
      max-height: 280px;
      padding-bottom: 10px;
    }
    .toss-bank-grid::-webkit-scrollbar { display: none; }
    .toss-bank-pill {
      background: #242429;
      border: none;
      border-radius: 12px;
      padding: 10px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      transition: background 0.15s;
    }
    .toss-bank-pill:active { background: #32323a; }
    .toss-bank-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 800;
      color: #fff;
    }

    /* Face ID 모달 오버레이 */
    .toss-faceid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(16, 16, 19, 0.96);
      z-index: 100;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    .toss-faceid-overlay.active { display: flex; }
    .toss-faceid-icon-box {
      width: 76px;
      height: 76px;
      border-radius: 20px;
      background: #000000;
      border: 2px solid #22c55e;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      animation: faceIdPulse 1.2s infinite ease-in-out;
    }
    @keyframes faceIdPulse {
      0% { transform: scale(0.96); box-shadow: 0 0 0 rgba(34, 197, 94, 0.4); }
      50% { transform: scale(1.04); box-shadow: 0 0 16px rgba(34, 197, 94, 0.8); }
      100% { transform: scale(0.96); box-shadow: 0 0 0 rgba(34, 197, 94, 0.4); }
    }
    .toss-faceid-icon-box svg {
      width: 44px;
      height: 44px;
      stroke: #22c55e;
      fill: none;
      stroke-width: 1.8;
    }

    /* 송금 완료 화면 */
    .toss-success-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 12px;
      padding: 0 20px;
    }
    .toss-emblem-3d {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #70aaff, #3182f6 60%, #1e56b3);
      box-shadow: 0 10px 24px rgba(49, 130, 246, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-bottom: 6px;
      animation: emblemPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes emblemPop {
      from { transform: scale(0.4); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .toss-success-title {
      font-size: 19px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.35;
    }
    .toss-memo-btn {
      background: #242429;
      border: none;
      color: #8b8b93;
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 10px;
      cursor: pointer;
    }
    .toss-success-actions {
      display: flex;
      gap: 8px;
      width: 100%;
      margin-top: auto;
      padding: 10px 14px;
      box-sizing: border-box;
    }
    .toss-btn-share {
      flex: 1;
      height: 46px;
      background: #242429;
      border: none;
      border-radius: 12px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .toss-btn-confirm {
      flex: 1;
      height: 46px;
      background: #3182f6;
      border: none;
      border-radius: 12px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    /* 통장 상세 내역 페이지 */
    .toss-detail-top {
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .toss-detail-acc {
      font-size: 12px;
      color: #8b8b93;
      text-decoration: underline;
    }
    .toss-detail-balance {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
    }
    .toss-detail-tx-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding: 6px 14px;
      gap: 12px;
    }
    .toss-tx-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .toss-tx-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .toss-tx-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #242429;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #3182f6;
    }
    .toss-tx-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .toss-tx-name {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
    }
    .toss-tx-time {
      font-size: 11px;
      color: #71717a;
    }
    .toss-tx-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }
    .toss-tx-amount {
      font-size: 13.5px;
      font-weight: 700;
    }
    .toss-tx-amount.minus { color: #ffffff; }
    .toss-tx-amount.plus { color: #3182f6; }
    .toss-tx-after {
      font-size: 11px;
      color: #71717a;
    }
    .toss-detail-bottom-btns {
      display: flex;
      gap: 8px;
      padding: 8px 14px 12px 14px;
    }
    .toss-btn-fill {
      flex: 1;
      height: 44px;
      background: #242429;
      border: none;
      border-radius: 12px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .toss-btn-detail-send {
      flex: 1;
      height: 44px;
      background: #3182f6;
      border: none;
      border-radius: 12px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
  `;

  // 데이터 스토리지 헬퍼
  function getChatRoomId() {
    const path = window.location.pathname;
    const match = path.match(/prompts\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : 'new_chat';
  }

  function getStore() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function getRoomData(roomId) {
    const store = getStore();
    if (!store[roomId]) {
      // 초기 기본 사용자 계좌
      store[roomId] = {
        userAccount: {
          account: '1002-2048-9088',
          group: '토스뱅크',
          owner: '나',
          amount: 500000,
          user: '1'
        },
        accounts: [
          { account: '718202-01-277342', group: 'KB국민', owner: '박동우', user: '0', fav: true },
          { account: '85082380280577', group: '우체국', owner: '쿠팡', user: '0', fav: false },
          { account: '395-152038-01-023', group: 'IBK기업', owner: '박성원', user: '0', fav: false },
          { account: '1908-9421-2670', group: '토스뱅크', owner: '토스김태수', user: '0', fav: false }
        ],
        transactions: []
      };
      saveStore(store);
    }
    if (!store[roomId].accounts) store[roomId].accounts = [];
    if (!store[roomId].transactions) store[roomId].transactions = [];
    return store[roomId];
  }

  function saveRoomData(roomId, data) {
    const store = getStore();
    store[roomId] = data;
    saveStore(store);
  }

  function getCurrentFormattedTime() {
    const roomId = getChatRoomId();
    let phoneStore = {};
    try {
      phoneStore = JSON.parse(localStorage.getItem('neo_smartphone_status_map') || '{}');
    } catch (e) {}

    const status = phoneStore[roomId] || {};
    let rawHour = status.hour !== undefined ? parseInt(status.hour, 10) : new Date().getHours();
    let rawMin = status.min !== undefined ? parseInt(status.min, 10) : new Date().getMinutes();

    if (isNaN(rawHour)) rawHour = new Date().getHours();
    if (isNaN(rawMin)) rawMin = new Date().getMinutes();

    let period = rawHour < 12 ? 'AM' : 'PM';
    let hour12 = rawHour % 12;
    if (hour12 === 0) hour12 = 12;

    const minStr = String(rawMin).padStart(2, '0');
    const hourStr = String(hour12);
    const now = new Date();

    return {
      year: String(now.getFullYear()),
      month: String(now.getMonth() + 1),
      day: String(now.getDate()),
      hour: hourStr,
      min: minStr,
      Period: period,
      displayTime: `${now.getMonth() + 1}월 ${now.getDate()}일 ${period === 'AM' ? '오전' : '오후'} ${hourStr}:${minStr}`
    };
  }

  // AI Studio 프롬프트 주입 및 ActionQueue 전송
  function sendPromptToAIStudio(payloadObj) {
    const jsonStr = JSON.stringify(payloadObj);
    const textarea = document.querySelector('ms-prompt-box textarea') ||
                     document.querySelector('textarea[aria-label*="Prompt"]') ||
                     document.querySelector('ms-prompt-box .ql-editor');

    if (textarea) {
      if (textarea.tagName === 'TEXTAREA') {
        const proto = Object.getPrototypeOf(textarea);
        const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (setter) setter.call(textarea, jsonStr);
        else textarea.value = jsonStr;
        textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      } else {
        textarea.innerHTML = `<p>${jsonStr}</p>`;
        textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      }

      setTimeout(() => {
        const runBtn = document.querySelector('ms-run-button button') ||
                       document.querySelector('button[aria-label*="Run"]') ||
                       document.querySelector('button.run-button');
        if (runBtn) {
          ['mousedown', 'mouseup', 'click'].forEach(evt => {
            runBtn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
          });
        }
      }, 120);
    }
  }

  // 송금 진행 임시 상태
  let sendSession = {
    targetAccount: '',
    targetGroup: '',
    targetOwner: '',
    amount: 0,
    inputBuffer: ''
  };

  // 홈 화면 그리드에 아이콘 자동 삽입
  function ensureHomeIconExists() {
    const grid = document.querySelector('.neo-phone-app-grid');
    if (!grid) return;

    if (!grid.querySelector('.neo-phone-app-item[data-app-id="toss"]')) {
      const tossItem = document.createElement('div');
      tossItem.className = 'neo-phone-app-item';
      tossItem.dataset.appId = 'toss';
      tossItem.innerHTML = `
        <div class="neo-phone-app-icon">
          <span class="neo-phone-badge" data-badge-for="toss"></span>
          <img src="${TOSS_ICON_PATH}" alt="토스">
        </div>
        <span class="neo-phone-app-label">토스</span>
      `;

      tossItem.addEventListener('click', (e) => {
        e.stopPropagation();
        openToss();
      });

      grid.appendChild(tossItem);
    }
  }

  // 메인 토스 뷰 DOM 생성
  function injectTossView() {
    const screen = document.querySelector('.neo-phone-screen');
    if (!screen || document.getElementById('neo-toss-view')) return;

    const tossView = document.createElement('div');
    tossView.id = 'neo-toss-view';
    tossView.innerHTML = `
      <div class="toss-safe-top-spacer"></div>

      <!-- 1. 메인 홈 화면 -->
      <div class="toss-page" id="toss-page-main">
        <div class="toss-header-row">
          <button type="button" class="toss-header-title-btn" id="toss-hdr-to-detail">
            <span>토스뱅크</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
          <div class="toss-header-icons">
            <span style="font-size: 13px; font-weight: 700; border: 1.5px solid #a1a1aa; border-radius: 6px; padding: 1px 4px; line-height: 1;">Pay</span>
            <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          </div>
        </div>

        <div class="toss-body">
          <!-- 단일 주거래 계좌 카드 (토스머니/주거래) -->
          <div class="toss-account-card" id="toss-main-account-card">
            <div class="toss-card-left">
              <div class="toss-symbol-circle">₩</div>
              <div class="toss-card-info">
                <span class="toss-card-balance" id="toss-home-balance">0원</span>
                <span class="toss-card-sub" id="toss-home-acc-name">토스머니 · 주거래통장</span>
              </div>
            </div>
            <button type="button" class="toss-btn-send-mini" id="toss-home-send-btn">송금</button>
          </div>
        </div>

        <!-- 하단 단일 [홈] 탭 -->
        <div class="toss-single-nav">
          <div class="toss-home-tab-item">
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span>홈</span>
          </div>
        </div>

        <div class="toss-home-bar-touch" id="toss-home-bar-main">
          <div class="toss-home-bar"></div>
        </div>
      </div>

      <!-- 2. 송금 수취인 선택 화면 (어디로 보낼까요?) -->
      <div class="toss-page hidden-page" id="toss-page-step1">
        <div class="toss-header-row">
          <button type="button" class="toss-back-btn" id="toss-s1-back">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div style="width: 24px;"></div>
        </div>

        <div class="toss-body">
          <div class="toss-page-title">어디로 보낼까요?</div>

          <div class="toss-tab-pills">
            <div class="toss-tab-pill active">계좌</div>
            <div class="toss-tab-pill">연락처</div>
          </div>

          <div class="toss-input-box-fake" id="toss-trigger-input-acc">
            <span>계좌번호 입력</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </div>

          <div class="toss-list-section-header">최근 보낸 내역</div>
          <div id="toss-recent-list-container" style="display:flex; flex-direction:column; gap:2px;"></div>
        </div>

        <div class="toss-home-bar-touch" id="toss-home-bar-s1">
          <div class="toss-home-bar"></div>
        </div>
      </div>

      <!-- 3. 계좌번호 및 은행 직접 입력 화면 (어떤 계좌로 보낼까요?) -->
      <div class="toss-page hidden-page" id="toss-page-step2">
        <div class="toss-header-row">
          <button type="button" class="toss-back-btn" id="toss-s2-back">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div style="width: 24px;"></div>
        </div>

        <div class="toss-body" style="padding-bottom: 0;">
          <div class="toss-page-title">어떤 계좌로 보낼까요?</div>

          <div class="toss-under-input-wrap">
            <div class="toss-under-label">계좌번호 입력</div>
            <div class="toss-under-value cursor" id="toss-s2-acc-display"></div>
          </div>

          <div class="toss-select-bank-trigger" id="toss-s2-bank-trigger">
            <span class="toss-select-bank-text" id="toss-s2-bank-label">은행 선택</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div class="toss-bank-hint" id="toss-s2-bank-hint">계좌번호를 입력하면 은행을 찾아드릴게요.</div>
          <div class="toss-match-err" id="toss-s2-match-err">일치하는 등록 계좌를 찾을 수 없습니다.</div>
        </div>

        <!-- 하단 키패드 -->
        <div class="toss-keypad" id="toss-s2-keypad">
          <button type="button" class="toss-key" data-k="1">1</button>
          <button type="button" class="toss-key" data-k="2">2</button>
          <button type="button" class="toss-key" data-k="3">3</button>
          <button type="button" class="toss-key" data-k="4">4</button>
          <button type="button" class="toss-key" data-k="5">5</button>
          <button type="button" class="toss-key" data-k="6">6</button>
          <button type="button" class="toss-key" data-k="7">7</button>
          <button type="button" class="toss-key" data-k="8">8</button>
          <button type="button" class="toss-key" data-k="9">9</button>
          <button type="button" class="toss-key" data-k="clean" style="font-size:12px; font-weight:700;">취소</button>
          <button type="button" class="toss-key" data-k="0">0</button>
          <button type="button" class="toss-key" data-k="del">
            <svg viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
          </button>
        </div>

        <div class="toss-home-bar-touch" id="toss-home-bar-s2">
          <div class="toss-home-bar"></div>
        </div>
      </div>

      <!-- 4. 송금 금액 입력 화면 (얼마나 보낼까요?) -->
      <div class="toss-page hidden-page" id="toss-page-step3">
        <div class="toss-header-row">
          <button type="button" class="toss-back-btn" id="toss-s3-back">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div style="width: 24px;"></div>
        </div>

        <div class="toss-body" style="padding-bottom: 0;">
          <div style="font-size: 15px; font-weight: 700; color: #ffffff;">내 통장에서</div>
          <div style="font-size: 12px; color: #8b8b93; margin-bottom: 12px;" id="toss-s3-my-balance">잔액 0원</div>

          <div style="font-size: 15px; font-weight: 700; color: #ffffff;" id="toss-s3-target-owner">상대방님에게</div>
          <div style="font-size: 12px; color: #3182f6; display: flex; align-items: center; gap: 4px; margin-bottom: 18px;" id="toss-s3-target-acc-info">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="#3182f6"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 11 15 16 9" stroke="#fff" stroke-width="2" fill="none"></polyline></svg>
            <span>계좌정보</span>
          </div>

          <div style="font-size: 26px; font-weight: 800; min-height: 38px; color: #ffffff; display: flex; align-items: baseline;" id="toss-s3-amount-display">
            <span style="color: #52525b;">얼마나 보낼까요?</span>
          </div>
        </div>

        <button type="button" class="toss-bottom-btn" id="toss-s3-next-btn" style="border-radius: 0; height: 44px; display: none;">다음</button>

        <!-- 금액 키패드 -->
        <div class="toss-keypad" id="toss-s3-keypad">
          <button type="button" class="toss-key" data-k="1">1</button>
          <button type="button" class="toss-key" data-k="2">2</button>
          <button type="button" class="toss-key" data-k="3">3</button>
          <button type="button" class="toss-key" data-k="4">4</button>
          <button type="button" class="toss-key" data-k="5">5</button>
          <button type="button" class="toss-key" data-k="6">6</button>
          <button type="button" class="toss-key" data-k="7">7</button>
          <button type="button" class="toss-key" data-k="8">8</button>
          <button type="button" class="toss-key" data-k="9">9</button>
          <button type="button" class="toss-key" data-k="00">00</button>
          <button type="button" class="toss-key" data-k="0">0</button>
          <button type="button" class="toss-key" data-k="del">
            <svg viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
          </button>
        </div>

        <div class="toss-home-bar-touch" id="toss-home-bar-s3">
          <div class="toss-home-bar"></div>
        </div>
      </div>

      <!-- 5. 최종 송금 확인 화면 (보낼까요?) -->
      <div class="toss-page hidden-page" id="toss-page-step4">
        <div class="toss-header-row">
          <button type="button" class="toss-back-btn" id="toss-s4-back">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div style="width: 24px;"></div>
        </div>

        <div class="toss-body" style="justify-content: center; align-items: center; text-align: center;">
          <div style="font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.4;">
            <span style="color: #3182f6;" id="toss-s4-owner-title">상대방</span>님에게<br>
            <span id="toss-s4-amount-title">0원</span>을<br>
            보낼까요?
          </div>

          <div style="width: 100%; margin-top: auto; display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #8b8b93; padding: 0 4px 14px 4px;">
            <div style="display:flex; justify-content:space-between;">
              <span>받는 분에게 표시</span>
              <span style="color:#ffffff;" id="toss-s4-summary-owner">상대방 ›</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>출금 계좌</span>
              <span style="color:#ffffff;">내 통장 ›</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>입금 계좌</span>
              <span style="color:#ffffff;" id="toss-s4-summary-acc">토스뱅크 ›</span>
            </div>
          </div>

          <button type="button" class="toss-bottom-btn" id="toss-s4-execute-btn" style="margin-top: 0;">보내기</button>
          <span style="font-size: 11px; color: #71717a; margin-top: 6px;">평생 수수료 무료</span>
        </div>

        <div class="toss-home-bar-touch" id="toss-home-bar-s4">
          <div class="toss-home-bar"></div>
        </div>
      </div>

      <!-- 6. 송금 완료 화면 (보냈어요) -->
      <div class="toss-page hidden-page" id="toss-page-success">
        <div class="toss-header-row">
          <span style="font-size: 14px; font-weight: 700; color: #ffffff; margin: 0 auto;">토스뱅크 송금</span>
        </div>

        <div class="toss-success-body">
          <div class="toss-emblem-3d">✓</div>
          <div class="toss-success-title" id="toss-success-desc">
            상대방님에게<br>1원을<br>보냈어요
          </div>
          <button type="button" class="toss-memo-btn">메모 남기기</button>
        </div>

        <div class="toss-success-actions">
          <button type="button" class="toss-btn-share" id="toss-btn-share">공유하기</button>
          <button type="button" class="toss-btn-confirm" id="toss-btn-confirm">확인</button>
        </div>

        <div class="toss-home-bar-touch" id="toss-home-bar-succ">
          <div class="toss-home-bar"></div>
        </div>
      </div>

      <!-- 7. 통장 상세 내역 페이지 -->
      <div class="toss-page hidden-page" id="toss-page-detail">
        <div class="toss-header-row">
          <button type="button" class="toss-back-btn" id="toss-detail-back">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span style="font-size: 13px; color: #a1a1aa;">토스뱅크</span>
          <div style="width: 24px;"></div>
        </div>

        <div class="toss-detail-top">
          <span class="toss-detail-acc" id="toss-dt-acc-no">토스뱅크 1002-2048-9088</span>
          <span class="toss-detail-balance" id="toss-dt-balance">0원</span>
        </div>

        <div class="toss-detail-tx-list" id="toss-detail-tx-container"></div>

        <div class="toss-detail-bottom-btns">
          <button type="button" class="toss-btn-fill" id="toss-btn-fill-charge">채우기</button>
          <button type="button" class="toss-btn-detail-send" id="toss-btn-detail-send">보내기</button>
        </div>

        <div class="toss-home-bar-touch" id="toss-home-bar-detail">
          <div class="toss-home-bar"></div>
        </div>
      </div>

      <!-- 바텀시트: 은행 선택 모달 -->
      <div class="toss-sheet-backdrop" id="toss-bank-sheet">
        <div class="toss-bottom-sheet">
          <div class="toss-sheet-title">은행을 선택해주세요</div>
          <div class="toss-bank-grid" id="toss-bank-grid-container"></div>
        </div>
      </div>

      <!-- Face ID 인증 오버레이 -->
      <div class="toss-faceid-overlay" id="toss-faceid-box">
        <div class="toss-faceid-icon-box">
          <svg viewBox="0 0 24 24">
            <path d="M7 3H5a2 2 0 0 0-2 2v2M17 3h2a2 2 0 0 1 2 2v2M7 21H5a2 2 0 0 1-2-2v-2M17 21h2a2 2 0 0 0 2-2v-2M9 9h.01M15 9h.01M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5"></path>
          </svg>
        </div>
        <span style="font-size: 14px; font-weight: 700; color: #22c55e;">Face ID 인증 중...</span>
      </div>
    `;

    screen.appendChild(tossView);
    renderBankGrid();
    renderMainHome();
    bindEvents(tossView);
  }

  // 홈 화면 렌더링
  function renderMainHome() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const userAcc = roomData.userAccount;

    const balanceEl = document.getElementById('toss-home-balance');
    const accNameEl = document.getElementById('toss-home-acc-name');
    if (balanceEl) balanceEl.textContent = `${Number(userAcc.amount || 0).toLocaleString()}원`;
    if (accNameEl) accNameEl.textContent = `${userAcc.group} · ${userAcc.account}`;
  }

  // 은행 선택 그리드 렌더링
  function renderBankGrid() {
    const container = document.getElementById('toss-bank-grid-container');
    if (!container) return;

    container.innerHTML = SUPPORTED_BANKS.map(b => `
      <button type="button" class="toss-bank-pill" data-bank="${b.name}">
        <div class="toss-bank-badge" style="background: ${b.color};">${b.name.charAt(0)}</div>
        <span>${b.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.toss-bank-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const bankName = btn.dataset.bank;
        selectBank(bankName);
        document.getElementById('toss-bank-sheet').classList.remove('open');
      });
    });
  }

  // 최근 보낸 목록 렌더링
  function renderRecentRecipients() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const container = document.getElementById('toss-recent-list-container');
    if (!container) return;

    const accs = roomData.accounts || [];
    if (accs.length === 0) {
      container.innerHTML = `<div style="font-size:12px; color:#71717a; text-align:center; padding:20px 0;">등록된 계좌가 없습니다.</div>`;
      return;
    }

    // 즐겨찾기 우선 정렬
    const sorted = [...accs].sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0));

    container.innerHTML = sorted.map(a => `
      <div class="toss-recipient-item" data-acc="${a.account}" data-group="${a.group}" data-owner="${a.owner}">
        <div class="toss-recip-left">
          <div class="toss-bank-icon-circle">${(a.owner || '?').charAt(0)}</div>
          <div class="toss-recip-meta">
            <span class="toss-recip-name">${a.owner}</span>
            <span class="toss-recip-sub">${a.group} ${a.account}</span>
          </div>
        </div>
        <button type="button" class="toss-star-btn ${a.fav ? 'fav' : ''}" data-acc="${a.account}" title="즐겨찾기">★</button>
      </div>
    `).join('');

    container.querySelectorAll('.toss-recipient-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.toss-star-btn')) return;
        const acc = item.dataset.acc;
        const group = item.dataset.group;
        const owner = item.dataset.owner;
        startSendToTarget(acc, group, owner);
      });
    });

    container.querySelectorAll('.toss-star-btn').forEach(starBtn => {
      starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const accNo = starBtn.dataset.acc;
        const target = roomData.accounts.find(x => x.account === accNo);
        if (target) {
          target.fav = !target.fav;
          saveRoomData(roomId, roomData);
          renderRecentRecipients();
        }
      });
    });
  }

  // 통장 상세 거래 내역 렌더링
  function renderDetailHistory() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const userAcc = roomData.userAccount;

    const accNoEl = document.getElementById('toss-dt-acc-no');
    const balEl = document.getElementById('toss-dt-balance');
    const listEl = document.getElementById('toss-detail-tx-container');

    if (accNoEl) accNoEl.textContent = `${userAcc.group} ${userAcc.account}`;
    if (balEl) balEl.textContent = `${Number(userAcc.amount || 0).toLocaleString()}원`;

    if (!listEl) return;
    const txs = roomData.transactions || [];
    if (txs.length === 0) {
      listEl.innerHTML = `<div style="font-size:12px; color:#71717a; text-align:center; padding:30px 0;">거래 내역이 없습니다.</div>`;
      return;
    }

    listEl.innerHTML = txs.map(t => {
      const isMinus = t.type === 'send';
      return `
        <div class="toss-tx-item">
          <div class="toss-tx-left">
            <div class="toss-tx-circle">₩</div>
            <div class="toss-tx-meta">
              <span class="toss-tx-name">${t.targetName || t.owner}</span>
              <span class="toss-tx-time">${t.displayTime || ''}</span>
            </div>
          </div>
          <div class="toss-tx-right">
            <span class="toss-tx-amount ${isMinus ? 'minus' : 'plus'}">${isMinus ? '-' : '+'}${Number(t.amount).toLocaleString()}원</span>
            <span class="toss-tx-after">${Number(t.balanceAfter || 0).toLocaleString()}원</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // 은행 선택 처리
  function selectBank(bankName) {
    sendSession.targetGroup = bankName;
    const label = document.getElementById('toss-s2-bank-label');
    if (label) {
      label.textContent = bankName;
      label.classList.add('selected');
    }
    validateStep2Match();
  }

  // 계좌번호 + 은행 실시간 검증 (존재하는 실제 계좌인지 확인)
  function validateStep2Match() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const errEl = document.getElementById('toss-s2-match-err');

    const cleanInput = sendSession.inputBuffer.replace(/[^0-9-]/g, '');
    if (!cleanInput || !sendSession.targetGroup) {
      if (errEl) errEl.style.display = 'none';
      return null;
    }

    // 하이픈 제거 후 비교 지원
    const strippedInput = cleanInput.replace(/-/g, '');
    const matched = (roomData.accounts || []).find(a =>
      a.group.includes(sendSession.targetGroup) || sendSession.targetGroup.includes(a.group)
    );

    const exactMatch = (roomData.accounts || []).find(a => {
      const accClean = a.account.replace(/-/g, '');
      const groupMatch = a.group.includes(sendSession.targetGroup) || sendSession.targetGroup.includes(a.group);
      return accClean === strippedInput && groupMatch;
    });

    if (exactMatch) {
      if (errEl) errEl.style.display = 'none';
      setTimeout(() => {
        startSendToTarget(exactMatch.account, exactMatch.group, exactMatch.owner);
      }, 200);
      return exactMatch;
    } else {
      if (errEl) errEl.style.display = 'block';
      return null;
    }
  }

  // 특정 대상에게 송금 시작 (금액 입력 페이지 전환)
  function startSendToTarget(account, group, owner) {
    sendSession.targetAccount = account;
    sendSession.targetGroup = group;
    sendSession.targetOwner = owner;
    sendSession.amount = 0;
    sendSession.inputBuffer = '';

    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const userAcc = roomData.userAccount;

    document.getElementById('toss-s3-my-balance').textContent = `잔액 ${Number(userAcc.amount || 0).toLocaleString()}원`;
    document.getElementById('toss-s3-target-owner').textContent = `${owner}님에게`;
    document.getElementById('toss-s3-target-acc-info').innerHTML = `
      <svg viewBox="0 0 24 24" width="12" height="12" fill="#3182f6"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 11 15 16 9" stroke="#fff" stroke-width="2" fill="none"></polyline></svg>
      <span>${group} ${account}</span>
    `;

    updateAmountDisplay();
    showPage('toss-page-step3');
  }

  function updateAmountDisplay() {
    const disp = document.getElementById('toss-s3-amount-display');
    const nextBtn = document.getElementById('toss-s3-next-btn');
    if (!disp || !nextBtn) return;

    if (sendSession.amount <= 0) {
      disp.innerHTML = `<span style="color: #52525b;">얼마나 보낼까요?</span>`;
      nextBtn.style.display = 'none';
    } else {
      disp.innerHTML = `<span style="color: #ffffff;">${Number(sendSession.amount).toLocaleString()}원</span>`;
      nextBtn.style.display = 'block';
    }
  }

  // 화면 전환 헬퍼
  function showPage(pageId) {
    document.querySelectorAll('.toss-page').forEach(p => {
      if (p.id === pageId) {
        p.classList.remove('hidden-page');
      } else {
        p.classList.add('hidden-page');
      }
    });
  }

  // 최종 송금 실행 (Face ID -> 처리 -> AI 전송)
  function executeTransfer() {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    const userAcc = roomData.userAccount;
    const sendAmt = Number(sendSession.amount);

    if (userAcc.amount < sendAmt) {
      alert('잔액이 부족합니다.');
      return;
    }

    const faceOverlay = document.getElementById('toss-faceid-box');
    faceOverlay.classList.add('active');

    // Face ID 사운드 재생
    if (window.NeoSound?.play) {
      window.NeoSound.play('face-id', 1.0);
    }

    setTimeout(() => {
      faceOverlay.classList.remove('active');

      // 잔액 차감 및 내역 기록
      userAcc.amount = Number(userAcc.amount) - sendAmt;
      const timeInfo = getCurrentFormattedTime();

      const newTx = {
        type: 'send',
        amount: sendAmt,
        targetName: sendSession.targetOwner,
        targetAccount: sendSession.targetAccount,
        targetGroup: sendSession.targetGroup,
        balanceAfter: userAcc.amount,
        displayTime: timeInfo.displayTime
      };

      roomData.transactions.unshift(newTx);
      saveRoomData(roomId, roomData);

      // 성공 화면 표시
      document.getElementById('toss-success-desc').innerHTML = `
        ${sendSession.targetOwner}님에게<br>
        ${Number(sendAmt).toLocaleString()}원을<br>
        보냈어요
      `;
      showPage('toss-page-success');

      // AI Studio 연동 페이로드 생성
      const sendPayload = {
        type: 'send',
        owner_account: userAcc.account,
        to_account: sendSession.targetAccount,
        to_acoount: sendSession.targetAccount,
        amount: String(sendAmt),
        country: 'KR',
        owner_group: userAcc.group,
        to_group: sendSession.targetGroup,
        card: 'none',
        year: timeInfo.year,
        month: timeInfo.month,
        day: timeInfo.day,
        hour: timeInfo.hour,
        min: timeInfo.min,
        Period: timeInfo.Period
      };

      if (window.NeoActionQueue) {
        window.NeoActionQueue.add({
          app: 'bank',
          type: 'send',
          label: `토스 송금: ${sendSession.targetOwner}`,
          summary: `${Number(sendAmt).toLocaleString()}원`,
          payload: sendPayload,
          rawString: `<bank>\n${JSON.stringify(sendPayload)}\n</bank>`
        });
      } else {
        sendPromptToAIStudio(sendPayload);
      }
    }, 1250);
  }

  // <bank> 태그 수신 및 상태 처리
  function processIncomingBankBlock(innerContent) {
    const roomId = getChatRoomId();
    const roomData = getRoomData(roomId);
    let changed = false;

    const objRegex = /\{[^{}]*?\}/g;
    let match;

    while ((match = objRegex.exec(innerContent)) !== null) {
      try {
        const item = JSON.parse(match[0]);

        // 1. 계좌 생성
        if (item.type === 'create') {
          if (String(item.user) === '1') {
            roomData.userAccount.account = item.account || roomData.userAccount.account;
            roomData.userAccount.group = item.group || roomData.userAccount.group;
            roomData.userAccount.owner = item.owner || roomData.userAccount.owner;
            changed = true;
          } else {
            const exists = roomData.accounts.some(a => a.account === item.account);
            if (!exists) {
              roomData.accounts.push({
                account: item.account,
                group: item.group || '토스뱅크',
                owner: item.owner || '등장인물',
                user: '0',
                fav: false
              });
              changed = true;
            }
          }
        }

        // 2. 잔액 업데이트
        if (item.type === 'update') {
          if (item.account === roomData.userAccount.account || !item.account) {
            roomData.userAccount.amount = parseInt(item.amount, 10) || 0;
            changed = true;
          }
        }

        // 3. 외부 송금 / 입금 수신
        if (item.type === 'send') {
          const sendAmt = parseInt(item.amount, 10) || 0;
          const toAcc = item.to_account || item.to_acoount;

          // 사용자가 입금받는 경우
          if (toAcc === roomData.userAccount.account) {
            roomData.userAccount.amount = Number(roomData.userAccount.amount) + sendAmt;
            const timeInfo = getCurrentFormattedTime();
            roomData.transactions.unshift({
              type: 'receive',
              amount: sendAmt,
              targetName: item.owner_group || '타인',
              targetAccount: item.owner_account,
              balanceAfter: roomData.userAccount.amount,
              displayTime: timeInfo.displayTime
            });
            changed = true;
          }
        }
      } catch (e) {}
    }

    if (changed) {
      saveRoomData(roomId, roomData);
      renderMainHome();
      renderRecentRecipients();
      renderDetailHistory();
    }
  }

  // DOM 태그 감시 및 숨김 처리
  function scanAndProcessCompletedBankTags() {
    const turns = document.querySelectorAll('ms-chat-turn');
    if (!turns.length) return;

    const completeTagRegex = /(?:<bank>|&lt;bank&gt;)([\s\S]*?)(?:<\/bank>|&lt;\/bank&gt;)/i;

    turns.forEach((turn) => {
      const turnText = turn.textContent || '';
      if (turn.dataset.bankProcessed === 'true') return;

      const hasOpen = turnText.includes('<bank>') || turnText.includes('&lt;bank&gt;');
      const hasClose = turnText.includes('</bank>') || turnText.includes('&lt;/bank&gt;');

      if (!hasOpen || !hasClose) return;

      const match = turnText.match(completeTagRegex);
      if (match && match[1]) {
        processIncomingBankBlock(match[1]);
        turn.dataset.bankProcessed = 'true';

        turn.querySelectorAll('p, pre, ms-code-block, mat-expansion-panel').forEach((block) => {
          if (block.textContent && block.textContent.includes('bank')) {
            block.classList.add('neo-bank-hidden-block');
            block.style.display = 'none';
          }
        });
      }
    });
  }

  // 확대/축소 애니메이션 좌표 계산
  function updateTransformOriginToAppIcon(view) {
    const screen = document.querySelector('.neo-phone-screen');
    const icon = document.querySelector('.neo-phone-app-item[data-app-id="toss"] .neo-phone-app-icon') ||
                 document.querySelector('.neo-phone-app-item[data-app-id="toss"]');
    if (!screen || !icon || !view) return;

    const sRect = screen.getBoundingClientRect();
    const iRect = icon.getBoundingClientRect();
    const cx = (iRect.left + iRect.width / 2) - sRect.left;
    const cy = (iRect.top + iRect.height / 2) - sRect.top;
    view.style.transformOrigin = `${cx}px ${cy}px`;
  }

  function openToss() {
    let tossView = document.getElementById('neo-toss-view');
    if (!tossView) {
      injectTossView();
      tossView = document.getElementById('neo-toss-view');
    }
    if (!tossView) return;

    updateTransformOriginToAppIcon(tossView);
    tossView.style.display = 'flex';
    tossView.classList.remove('closing');
    void tossView.offsetWidth;
    tossView.classList.add('active');

    renderMainHome();
    showPage('toss-page-main');
  }

  function closeToss() {
    const tossView = document.getElementById('neo-toss-view');
    if (tossView && tossView.classList.contains('active')) {
      updateTransformOriginToAppIcon(tossView);
      tossView.classList.remove('active');
      tossView.classList.add('closing');
      setTimeout(() => {
        tossView.classList.remove('closing');
        tossView.style.display = 'none';
        showPage('toss-page-main');
      }, 340);
    }
  }

  // 전체 이벤트 바인딩
  function bindEvents(view) {
    // 홈 인디케이터 바 클릭 시 앱 닫기
    view.querySelectorAll('.toss-home-bar-touch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeToss();
      });
    });

    // 메인 홈 -> 송금 1단계 열기
    view.querySelector('#toss-home-send-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      renderRecentRecipients();
      showPage('toss-page-step1');
    });

    // 메인 카드/헤더 -> 통장 상세 내역 페이지
    view.querySelector('#toss-main-account-card')?.addEventListener('click', () => {
      renderDetailHistory();
      showPage('toss-page-detail');
    });
    view.querySelector('#toss-hdr-to-detail')?.addEventListener('click', () => {
      renderDetailHistory();
      showPage('toss-page-detail');
    });

    // 뒤로가기 버튼들
    view.querySelector('#toss-s1-back')?.addEventListener('click', () => showPage('toss-page-main'));
    view.querySelector('#toss-s2-back')?.addEventListener('click', () => showPage('toss-page-step1'));
    view.querySelector('#toss-s3-back')?.addEventListener('click', () => showPage('toss-page-step1'));
    view.querySelector('#toss-s4-back')?.addEventListener('click', () => showPage('toss-page-step3'));
    view.querySelector('#toss-detail-back')?.addEventListener('click', () => showPage('toss-page-main'));

    // Step 1: 직접 계좌번호 입력 인풋 터치 시 Step 2 전환
    view.querySelector('#toss-trigger-input-acc')?.addEventListener('click', () => {
      sendSession.inputBuffer = '';
      sendSession.targetGroup = '';
      document.getElementById('toss-s2-acc-display').textContent = '';
      document.getElementById('toss-s2-bank-label').textContent = '은행 선택';
      document.getElementById('toss-s2-bank-label').classList.remove('selected');
      document.getElementById('toss-s2-match-err').style.display = 'none';
      showPage('toss-page-step2');
    });

    // Step 2: 은행 선택 바텀시트 열기
    view.querySelector('#toss-s2-bank-trigger')?.addEventListener('click', () => {
      document.getElementById('toss-bank-sheet').classList.add('open');
    });
    view.querySelector('#toss-bank-sheet')?.addEventListener('click', (e) => {
      if (e.target.id === 'toss-bank-sheet') {
        document.getElementById('toss-bank-sheet').classList.remove('open');
      }
    });

    // Step 2: 숫자 키패드 입력 핸들러
    view.querySelectorAll('#toss-s2-keypad .toss-key').forEach(k => {
      k.addEventListener('click', () => {
        const val = k.dataset.k;
        if (window.NeoSound?.play) window.NeoSound.play('type', 0.4);

        if (val === 'del') {
          sendSession.inputBuffer = sendSession.inputBuffer.slice(0, -1);
        } else if (val === 'clean') {
          sendSession.inputBuffer = '';
        } else {
          if (sendSession.inputBuffer.length < 18) {
            sendSession.inputBuffer += val;
          }
        }
        document.getElementById('toss-s2-acc-display').textContent = sendSession.inputBuffer;
        validateStep2Match();
      });
    });

    // Step 3: 금액 키패드 핸들러
    view.querySelectorAll('#toss-s3-keypad .toss-key').forEach(k => {
      k.addEventListener('click', () => {
        const val = k.dataset.k;
        if (window.NeoSound?.play) window.NeoSound.play('type', 0.4);

        let curStr = String(sendSession.amount || '');
        if (curStr === '0') curStr = '';

        if (val === 'del') {
          curStr = curStr.slice(0, -1);
        } else {
          if (curStr.length < 10) curStr += val;
        }

        sendSession.amount = parseInt(curStr, 10) || 0;
        updateAmountDisplay();
      });
    });

    // Step 3: [다음] 버튼 -> Step 4 확인 화면 전환
    view.querySelector('#toss-s3-next-btn')?.addEventListener('click', () => {
      if (sendSession.amount <= 0) return;

      document.getElementById('toss-s4-owner-title').textContent = sendSession.targetOwner;
      document.getElementById('toss-s4-amount-title').textContent = `${Number(sendSession.amount).toLocaleString()}원`;
      document.getElementById('toss-s4-summary-owner').textContent = `${sendSession.targetOwner} ›`;
      document.getElementById('toss-s4-summary-acc').textContent = `${sendSession.targetGroup} ${sendSession.targetAccount} ›`;

      showPage('toss-page-step4');
    });

    // Step 4: [보내기] 실행 -> Face ID 인증 트리거
    view.querySelector('#toss-s4-execute-btn')?.addEventListener('click', () => {
      executeTransfer();
    });

    // 완료 화면 [확인] 및 [공유하기] -> 메인으로 복귀
    view.querySelector('#toss-btn-confirm')?.addEventListener('click', () => {
      renderMainHome();
      showPage('toss-page-main');
    });
    view.querySelector('#toss-btn-share')?.addEventListener('click', () => {
      renderMainHome();
      showPage('toss-page-main');
    });

    // 통장 상세에서 [보내기]
    view.querySelector('#toss-btn-detail-send')?.addEventListener('click', () => {
      renderRecentRecipients();
      showPage('toss-page-step1');
    });

    // 통장 상세에서 [채우기] (가상 충전 지원)
    view.querySelector('#toss-btn-fill-charge')?.addEventListener('click', () => {
      const roomId = getChatRoomId();
      const roomData = getRoomData(roomId);
      roomData.userAccount.amount += 100000;
      saveRoomData(roomId, roomData);
      renderDetailHistory();
      renderMainHome();
    });
  }

  // 앱 실행 런처 바인딩
  function setupLaunch() {
    if (window.NeoPhone?.onAppClick) {
      window.NeoPhone.onAppClick((appId) => {
        if (appId === 'toss') openToss();
      });
    }

    window.addEventListener('neo-phone-app-click', (e) => {
      if (e.detail?.appId === 'toss') openToss();
    });
  }

  // 초기화 루프
  function init() {
    const timer = setInterval(() => {
      const screen = document.querySelector('.neo-phone-screen');
      if (screen) {
        clearInterval(timer);
        ensureHomeIconExists();
        injectTossView();
        setupLaunch();
        scanAndProcessCompletedBankTags();
      }
    }, 100);
  }
  init();

  // MutationObserver를 통한 실시간 태그 파싱
  const bankObserver = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      if (m.type === 'characterData') {
        const val = m.target.nodeValue || '';
        if (val.includes('bank')) { relevant = true; break; }
      } else {
        for (const n of m.addedNodes) {
          const tc = n.textContent || '';
          if (tc.includes('bank')) { relevant = true; break; }
        }
      }
      if (relevant) break;
    }

    if (relevant) {
      scanAndProcessCompletedBankTags();
    }
    ensureHomeIconExists();
  });

  bankObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 전역 인스턴스 등록
  window.NeoToss = {
    open: openToss,
    close: closeToss,
    refresh: () => {
      renderMainHome();
      renderRecentRecipients();
    }
  };
})();