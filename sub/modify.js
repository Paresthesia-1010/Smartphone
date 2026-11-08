(function () {
  'use strict';

  console.log('[AI Studio Modify] Relocating & Centering native Account Switcher...');

  
  const styleId = 'neo-native-account-relocate-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      
      ms-account-switcher.neo-relocated {
        position: fixed !important;
        top: 16px !important;
        left: 20px !important;
        z-index: 1000 !important;
        display: inline-flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: auto !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        pointer-events: auto !important;
      }

      
      mat-tooltip-component,
      .mat-mdc-tooltip-panel,
      .mat-mdc-tooltip {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      
      ms-account-switcher .account-switcher-text,
      ms-account-switcher span[class*="account-switcher-text"] {
        display: none !important;
      }

      
      ms-account-switcher #account-switcher-button,
      ms-account-switcher .container {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
        padding: 0 !important;
        width: auto !important;
        height: auto !important;
      }

      
      ms-account-switcher button.account-switcher-button {
        padding: 0 !important;
        margin: 0 !important;
        min-width: 40px !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 12px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: rgba(26, 26, 26, 0.75) !important;
        backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        overflow: hidden !important;
      }

      ms-account-switcher button.account-switcher-button:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        border-color: #ffffff !important;
        transform: scale(1.05);
      }

      
      ms-account-switcher .avatar-ring-wrapper,
      ms-account-switcher connect-avatar {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }

      
      ms-account-switcher connect-avatar img.avatar {
        width: 26px !important;
        height: 26px !important;
        border-radius: 50% !important;
        object-fit: cover !important;
        display: block !important;
        margin: 0 auto !important;
      }

      
      .cdk-overlay-container {
        z-index: 2500 !important;
      }
    `;
    document.head.appendChild(style);
  }

  
  function relocateNativeAccountSwitcher() {
    const switcher = document.querySelector('ms-account-switcher');
    
    if (switcher) {
      
      if (switcher.parentElement !== document.body) {
        document.body.appendChild(switcher);
        switcher.classList.add('neo-relocated');
      }

      
      const btn = switcher.querySelector('button');
      if (btn) {
        if (btn.hasAttribute('aria-label')) btn.removeAttribute('aria-label');
        if (btn.hasAttribute('title')) btn.removeAttribute('title');
        if (btn.hasAttribute('mattooltip')) btn.removeAttribute('mattooltip');
      }
    }
  }

  
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const settingsTrigger = document.getElementById('neo-settings-trigger');
        if (settingsTrigger) settingsTrigger.click();
      }
    });
  }

  function optimizePromptBox() {
    const textarea = document.querySelector('ms-prompt-box textarea') || document.querySelector('textarea[aria-label*="Prompt"]');
    if (textarea && !textarea.dataset.modified) {
      textarea.dataset.modified = 'true';
      if (textarea.placeholder.includes('Type something')) {
        textarea.placeholder = '메시지를 입력하세요... (Enter 줄바꿈)';
      }
    }
  }

  
  relocateNativeAccountSwitcher();
  initKeyboardShortcuts();
  optimizePromptBox();

  
  const observer = new MutationObserver(() => {
    relocateNativeAccountSwitcher();
    optimizePromptBox();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();