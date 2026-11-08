// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SEARCH_YOUTUBE') {
    console.log('[Background Service Worker] 📥 유튜브 검색 요청 수신:', message.keyword);
    
    searchYouTubeViaInvidious(message.keyword)
      .then((result) => {
        console.log('[Background Service Worker] 📤 최상단 영상 찾기 성공:', result);
        sendResponse({ success: true, data: result });
      })
      .catch((err) => {
        console.error('[Background Service Worker] ❌ 검색 실패:', err.message);
        sendResponse({ success: false, error: err.message });
      });
      
    return true; // 비동기 응답 유지
  }
});

async function searchYouTubeViaInvidious(keyword) {
  // 전 세계에서 가장 안정적으로 살아있는 공공 Invidious API 서버 중 하나
  const apiUrl = `https://invidious.no-pun.me/api/v1/search?q=${encodeURIComponent(keyword)}&type=video`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API HTTP error! status: ${response.status}`);
  }

  const items = await response.json();
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('검색 결과가 없습니다.');
  }

  // 검색 결과 중 가장 최상단(1위) 영상 정보 추출
  const topVideo = items[0];
  const title = topVideo.title;
  const videoId = topVideo.videoId;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return { title, videoId, videoUrl };
}