(function () {
  'use strict';

  console.log('[Smartphone Design] sub/smartphone/design.js loaded.');

  
  const STYLE_ID = 'neo-smartphone-design-style';
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    
    :root {
      --neo-active-app-bg: #000000;
    }

    
    .neo-phone-screen {
      transition: background 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    
    .neo-phone-screen.neo-app-active {
      background: var(--neo-active-app-bg) !important;
    }

    
    .neo-phone-screen.neo-app-active .neo-phone-top-dismiss-area {
      background: transparent !important;
      z-index: 50 !important; 
    }

    .neo-phone-screen.neo-app-active .neo-phone-status-bar {
      color: #ffffff !important;
    }

    
    .neo-phone-screen.neo-app-active .neo-phone-app-grid,
    .neo-phone-screen.neo-app-active .neo-phone-dock-wrapper {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    .neo-phone-screen:not(.neo-app-active) .neo-phone-app-grid,
    .neo-phone-screen:not(.neo-app-active) .neo-phone-dock-wrapper {
      opacity: 1;
      pointer-events: auto;
      transition: opacity 0.25s ease 0.1s;
    }
  `;

  
  
  const APP_THEME_COLORS = {
    'kakaotalk': '#000000', 
    'instagram': '#000000', 
    'settings': '#000000',  
    'safari': '#121212',    
    'phone': '#000000',     
    'message': '#000000'    
  };

  function updateAppScreenTheme() {
    const screen = document.querySelector('.neo-phone-screen');
    if (!screen) return;

    
    
    const activeAppView = document.querySelector('[id$="-view"].active, .neo-app-view.active');

    if (activeAppView && !activeAppView.classList.contains('closing')) {
      
      let appId = 'kakaotalk'; 
      const viewId = activeAppView.id || '';
      
      for (const key of Object.keys(APP_THEME_COLORS)) {
        if (viewId.toLowerCase().includes(key)) {
          appId = key;
          break;
        }
      }

      
      const themeColor = APP_THEME_COLORS[appId] || '#000000';
      document.documentElement.style.setProperty('--neo-active-app-bg', themeColor);

      if (!screen.classList.contains('neo-app-active')) {
        screen.classList.add('neo-app-active');
      }
    } else {
      
      if (screen.classList.contains('neo-app-active')) {
        screen.classList.remove('neo-app-active');
      }
    }
  }

  let isThrottled = false;
  function scheduleThemeCheck() {
    if (isThrottled) return;
    isThrottled = true;

    requestAnimationFrame(() => {
      isThrottled = false;
      updateAppScreenTheme();
    });
  }

  
  updateThemeCheckOnce();

  function updateThemeCheckOnce() {
    updateAppScreenTheme();
  }

  const designObserver = new MutationObserver((mutations) => {
    let shouldCheck = false;
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        shouldCheck = true;
        break;
      }
      if (m.addedNodes.length > 0 || m.removedNodes.length > 0) {
        shouldCheck = true;
        break;
      }
    }
    if (shouldCheck) {
      scheduleThemeCheck();
    }
  });

  designObserver.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['class']
  });

  
  window.NeoDesign = {
    
    setThemeColor: function (colorHex) {
      document.documentElement.style.setProperty('--neo-active-app-bg', colorHex);
    },
    
    refresh: updateAppScreenTheme
  };
})();