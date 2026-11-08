
const NEO_CSS = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

ms-callout,
ms-paid-api-key-callout,
.api-callout-container,
ms-navbar-v2,
.nav-content,
ms-global-banner,
ms-omnibar,
.navbar-header,
.disclaimer-container,
.makersuite-layout.docs-top-bar,
.chat-hallucinations-disclaimer,
ms-drive-permission-nudge,
.token-container,
ms-navbar-promo-card,
.toggles-container,
.toggles-container,
ms-playground-toolbar ms-header {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  pointer-events: none !important;
  opacity: 0 !important;
}


ms-run-settings,
ms-right-side-panel {
  position: fixed !important;
  left: -9999px !important;
  top: 0 !important;
  width: 320px !important;
  height: 100vh !important;
  opacity: 0 !important;
  z-index: -999 !important;
  pointer-events: auto !important;
}


.author-label,
.turn-separator,
.timestamp,
.turn-footer,
.response-feedback-button,
ms-prompt-feedback,
.model-run-time-pill,
ms-chat-bottom-overlay,
.bottom-overlay,
ms-header::after,
[_nghost-ng-c1838694964]::after,
[_nghost-ng-c1883963135]::before,
[_nghost-ng-c1883963135]::after {
  display: none !important;
  background: none !important;
  background-image: none !important;
  height: 0 !important;
  opacity: 0 !important;
  pointer-events: none !important;
}


ms-thought-chunk mat-expansion-panel-header {
  position: absolute !important;
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
  width: 0 !important;
}
ms-thought-chunk mat-expansion-panel[disabled],
ms-thought-chunk .thought-panel-footer,
ms-thought-chunk mat-accordion,
ms-thought-chunk mat-expansion-panel {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}


.neo-gemini-logo-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 14px !important;
  padding: 6px 12px 6px 8px !important;
  cursor: pointer !important;
  margin-bottom: 8px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.neo-gemini-logo-btn:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
  transform: translateY(-1px) scale(1.02) !important;
}
.neo-gemini-logo-btn.active {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: #ffffff !important;
}
.gemini-official-icon {
  width: 20px !important;
  height: 20px !important;
  object-fit: contain !important;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
}
.gemini-btn-text { font-size: 11.5px !important; font-weight: 600 !important; color: #e5e5e5 !important; }
.gemini-arrow-icon { font-size: 10px !important; color: #a3a3a3 !important; transition: transform 0.3s ease !important; }
ms-thought-chunk.open .gemini-arrow-icon { transform: rotate(180deg) !important; }


ms-thought-chunk .mat-expansion-panel-content,
ms-thought-chunk .mat-expansion-panel-body,
ms-thought-chunk ms-text-chunk,
ms-thought-chunk ms-cmark-node {
  visibility: visible !important;
  display: block !important;
  opacity: 1 !important;
}
ms-thought-chunk .mat-expansion-panel-content-wrapper {
  display: none !important;
  max-height: 0 !important;
  opacity: 0 !important;
  overflow: hidden !important;
  transition: max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
}
ms-thought-chunk.open .mat-expansion-panel-content-wrapper {
  display: block !important;
  max-height: 6000px !important;
  opacity: 1 !important;
  margin-top: 10px !important;
  overflow: visible !important;
}
ms-thought-chunk .mat-expansion-panel-body {
  background: rgba(18, 18, 18, 0.92) !important;
  border: 1px dashed rgba(255, 255, 255, 0.2) !important;
  border-radius: 14px !important;
  padding: 16px 20px !important;
  font-size: 13.5px !important;
  line-height: 1.7 !important;
  color: #d4d4d4 !important;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6) !important;
}
ms-thought-chunk strong { color: #ffffff !important; font-weight: 700 !important; }


body, .banner-and-app-container, .chunk-editor-main, .layout-main, .layout-wrapper {
  background: radial-gradient(circle at 50% 10%, #171717 0%, #0a0a0a 60%, #000000 100%) !important;
  font-family: 'Pretendard', sans-serif !important;
  color: #f5f5f5 !important;
  width: 100% !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden !important;
}

.chat-session-content {
  max-width: 920px !important;
  margin: 30px auto 0 auto !important;
  padding-bottom: 160px !important;
  width: 92% !important;
}


ms-chat-turn {
  display: block !important;
  position: relative !important;
  width: 100% !important;
  padding-bottom: 24px !important;
  margin-bottom: 24px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
}


.model-turn-styled .chat-turn-container,
.user-turn-styled .chat-turn-container {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 6px 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}

.user-turn-styled { display: block !important; }

.turn-content, .cmark-node {
  font-size: 15px !important;
  line-height: 1.8 !important;
  color: #f1f5f9 !important;
  letter-spacing: -0.2px !important;
}



ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) {
  background: #141414 !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  margin: 16px 0 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45) !important;
}


ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) mat-expansion-panel-header {
  background: #202020 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  height: 38px !important;
  min-height: 38px !important;
  max-height: 38px !important;
  padding: 0 14px !important;
  cursor: default !important;
}


ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) .title-icon,
ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) button[aria-label*="Download"],
ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) button[data-test-id="expand-icon-button"],
ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) .mat-expansion-indicator {
  display: none !important;
}


ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) .title-text {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #a3a3a3 !important;
  font-family: inherit !important;
  letter-spacing: 0.3px !important;
}


ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) button[aria-label*="Copy"] {
  opacity: 0.7 !important;
  transition: opacity 0.2s ease, transform 0.2s ease !important;
}
ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) button[aria-label*="Copy"]:hover {
  opacity: 1 !important;
  transform: scale(1.08) !important;
}
ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) button[aria-label*="Copy"] .material-symbols-outlined {
  font-size: 16px !important;
  color: #d4d4d4 !important;
}


ms-chat-turn mat-expansion-panel:not(ms-thought-chunk mat-expansion-panel) .mat-expansion-panel-body {
  padding: 14px 16px !important;
  background: #141414 !important;
}

ms-chat-turn pre {
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  font-family: 'Pretendard', monospace, sans-serif !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  color: #e5e5e5 !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
}



.neo-quote-orange,
pre .neo-quote-orange,
code .neo-quote-orange {
  color: #f97316 !important; 
  font-style: normal !important;
  font-weight: 500 !important;
}


.neo-quote-gray,
.neo-ast-gray,
pre .neo-quote-gray,
code .neo-quote-gray,
pre .neo-ast-gray,
code .neo-ast-gray,
ms-chat-turn em,
ms-chat-turn i,
ms-chat-turn [style*="italic"] {
  color: #8c8c8c !important; 
  font-style: normal !important;
}


footer { background: transparent !important; padding: 0 16px 24px 16px !important; }
ms-prompt-box { max-width: 920px !important; width: 92% !important; margin: 0 auto !important; }
.prompt-box-container {
  background: rgba(18, 18, 18, 0.88) !important;
  backdrop-filter: blur(28px) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: 28px !important;
  padding: 16px 20px 12px 20px !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75) !important;
}
.prompt-box-container textarea { color: #ffffff !important; font-size: 15px !important; line-height: 1.6 !important; }
ms-run-button button {
  background: #ffffff !important;
  color: #000000 !important;
  border: none !important; border-radius: 16px !important; height: 36px !important; padding: 0 16px !important;
  box-shadow: 0 4px 18px rgba(255, 255, 255, 0.2) !important;
  font-weight: 600 !important;
}
ms-run-button button:hover { background: #e5e5e5 !important; }
ms-run-button .secondary-key { display: none !important; }


#neo-settings-trigger {
  position: fixed; top: 16px; right: 24px; z-index: 1000;
  background: rgba(26, 26, 26, 0.75); backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff;
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5); transition: all 0.2s ease;
}
#neo-settings-trigger:hover { background: rgba(255, 255, 255, 0.15); border-color: #ffffff; transform: scale(1.05); }


#neo-radix-modal {
  position: fixed; top: 66px; right: 24px; width: 440px; max-height: calc(100vh - 90px);
  background: rgba(14, 14, 14, 0.96); backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85); z-index: 1001;
  display: flex; flex-direction: column; overflow: hidden;
  animation: modalEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes modalEnter {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
#neo-radix-modal.hidden { display: none !important; }

.modal-tabs {
  display: flex; gap: 4px; padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.02);
}
.modal-tab {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 8px 0; border-radius: 12px; font-size: 12.5px; color: #737373;
  background: transparent; border: none; cursor: pointer; transition: all 0.15s ease;
}
.modal-tab.active { background: rgba(255, 255, 255, 0.12); color: #ffffff; font-weight: 600; }
.modal-body { padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
.tab-content { display: flex; flex-direction: column; gap: 14px; }
.tab-content.hidden { display: none !important; }

.section-title { font-size: 12px; font-weight: 600; color: #a3a3a3; margin-bottom: 6px; }


.model-list-wrapper {
  display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; padding-right: 4px;
}
.model-list-wrapper::-webkit-scrollbar { width: 4px; }
.model-list-wrapper::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
.neo-model-item {
  width: 100%; display: flex; align-items: flex-start; gap: 10px; border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.03);
  padding: 10px 12px; text-align: left; cursor: pointer; transition: all 0.2s ease; color: #ffffff;
}
.neo-model-item:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.3); transform: translateX(2px); }
.neo-model-item.current-selected { background: rgba(255, 255, 255, 0.12); border-color: #ffffff; box-shadow: 0 0 15px rgba(255, 255, 255, 0.1); }
.model-meta-badges { display: flex; gap: 4px; margin-bottom: 2px; }
.badge-new { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 6px; background: rgba(255, 255, 255, 0.15); color: #ffffff; }
.badge-paid { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 6px; background: rgba(255, 255, 255, 0.08); color: #a3a3a3; border: 1px solid rgba(255, 255, 255, 0.1); }
.model-pricing { font-size: 10.5px; color: #a3a3a3; margin-top: 4px; }


.neo-persona-trigger-btn {
  width: 100%; display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 10px 14px; cursor: pointer; color: #fff;
}
.persona-avatar-circle {
  width: 24px; height: 24px; border-radius: 50%; background: rgba(255, 255, 255, 0.12); color: #ffffff;
  display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.persona-badge-default { font-size: 10.5px; padding: 2px 7px; border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: #a3a3a3; }
.persona-chevron-icon { width: 16px; height: 16px; color: #737373; margin-left: auto; transition: transform 0.2s ease; }
.persona-chevron-icon.open { transform: rotate(180deg); }

.neo-persona-dropdown-panel {
  margin-top: 8px; background: rgba(18, 18, 18, 0.98); border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px; padding: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}
.neo-persona-dropdown-panel.hidden { display: none !important; }
.persona-search-wrapper {
  display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 8px 12px;
}
.persona-search-wrapper input { background: transparent; border: none; outline: none; font-size: 13px; color: #fff; width: 100%; }
.persona-add-action-btn {
  display: flex; align-items: center; gap: 8px; background: transparent; border: none; color: #ffffff; font-size: 13px; font-weight: 600; cursor: pointer; padding: 4px 6px;
}
.persona-group-label { font-size: 11px; font-weight: 600; color: #737373; margin-top: 6px; }

.persona-dropdown-item {
  display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; border-radius: 12px;
  background: transparent; border: 1px solid transparent; cursor: pointer; width: 100%; text-align: left;
}
.persona-dropdown-item:hover { background: rgba(255, 255, 255, 0.05); }
.persona-dropdown-item.active { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.25); }
.persona-item-name { font-size: 13px; font-weight: 700; color: #ffffff; }
.persona-item-desc { font-size: 11px; color: #a3a3a3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px; margin-top: 2px; }

.neo-form-box {
  background: rgba(255, 255, 255, 0.035); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px; padding: 10px 14px; display: flex; align-items: center;
}
.neo-form-box:focus-within { border-color: #ffffff; box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3); }
.neo-form-box input, .neo-form-box textarea { width: 100%; background: transparent; border: none; outline: none; font-size: 13px; color: #ffffff; font-family: inherit; }
.neo-form-box textarea { resize: none; line-height: 1.6; }

.neo-action-btn-primary {
  width: 100%; height: 38px; border-radius: 12px; font-size: 13px; font-weight: 600; border: none;
  background: #ffffff; color: #000000; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
}
.neo-action-btn-primary:hover { background: #e5e5e5; transform: translateY(-1px); }


#neo-confirm-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(12px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.neo-confirm-card { width: 340px; background: rgba(18, 18, 18, 0.98); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 22px 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; }
.confirm-actions { display: flex; gap: 8px; width: 100%; margin-top: 8px; }
.confirm-btn { flex: 1; height: 38px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; }
.confirm-btn-cancel { background: rgba(255, 255, 255, 0.08); color: #a3a3a3; }
.confirm-btn-cancel:hover { background: rgba(255, 255, 255, 0.12); color: #ffffff; }
.confirm-btn-ok { background: #ffffff; color: #000000; }
.confirm-btn-ok:hover { background: #e5e5e5; }

#neo-toast {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-20px);
  background: rgba(18, 18, 18, 0.96); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  color: #ffffff; padding: 10px 20px; border-radius: 16px; font-size: 13.5px; font-weight: 600; z-index: 3000;
  opacity: 0; pointer-events: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
#neo-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }


.toggle-item { display: flex; flex-direction: column; gap: 3px; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.toggle-item:last-child { border-bottom: none; }
.toggle-header { display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #f5f5f5; }
.toggle-desc { font-size: 11.5px; color: #737373; margin: 0; }
.custom-switch { width: 36px; height: 20px; background: rgba(255, 255, 255, 0.15); border-radius: 20px; position: relative; cursor: pointer; transition: all 0.2s ease; }
.custom-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #ffffff; transition: all 0.2s ease; }
.custom-switch.on { background: #ffffff; }
.custom-switch.on::after { left: 18px; background: #000000; }
`;

const styleEl = document.createElement('style');
styleEl.id = 'neo-integrated-style';
styleEl.textContent = NEO_CSS;
document.head.appendChild(styleEl);


const GEMINI_MODELS = [
  { id: 'models/gemini-4-argon', name: 'Gemini 4 Argon', badges: ['New', 'Paid'], desc: 'Our most capable model for complex software engineering & reasoning.', pricing: 'Input: $2.00 / Output: $10.00' },
  { id: 'models/gemini-3.8-flash', name: 'Gemini 3.8 Flash', badges: ['New'], desc: 'Our most intelligent Flash model for agents & coding.', pricing: 'Input: $0.75 / Output: $3.75' },
  { id: 'models/gemini-3.8-flash-tts', name: 'Gemini 3.8 Flash TTS', badges: ['New'], desc: 'Flagship TTS model for Voice Design and dual-speaker screenplay.', pricing: 'Input: $0.50 / Output: $9.00' },
  { id: 'models/gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', badges: [], desc: 'Our fastest, most cost-effective 3.5 model.', pricing: 'Input: $0.30 / Output: $2.50' },
  { id: 'models/gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', badges: [], desc: 'Previous-gen Pro model for reasoning and general coding tasks.', pricing: 'Input: $2.00 / Output: $12.00' },
  { id: 'models/gemini-3.5-live-translate-preview', name: 'Gemini 3.5 Live Translate', badges: [], desc: 'Real-time speech-to-speech translation model for 70+ languages.', pricing: 'Input: $3.50 / Output: $21.00' },
  { id: 'models/gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', badges: [], desc: 'Cost-efficient model optimized for high-volume tasks.', pricing: 'Input: $0.25 / Output: $1.50' },
  { id: 'models/gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', badges: ['Paid'], desc: 'Legacy Flash model, providing baseline speed.', pricing: 'Input: $0.50 / Output: $3.00' },
  { id: 'models/gemini-nano-banana-2.1', name: 'Nano Banana 2.1', badges: ['New', 'Paid'], desc: 'High-quality image generation and editing model.', pricing: 'Text: $1.50 / Image: $0.0336' },
  { id: 'models/gemini-3.1-flash-lite-image', name: 'Nano Banana 2 Lite', badges: [], desc: 'Cost effective image generation and editing model.', pricing: 'Text: $0.25 / Image: $0.0336' },
  { id: 'models/gemini-3-pro-image', name: 'Nano Banana Pro', badges: ['Paid'], desc: 'State-of-the-art image generation and editing model.', pricing: 'Text: $2.00 / Image: $0.134' },
  { id: 'models/gemini-3.5-transcribe', name: 'Gemini 3.5 Transcribe', badges: ['New'], desc: 'High-accuracy speech-to-text model for pre-recorded files.', pricing: 'Input: $2.00 / Output: $12.00' },
  { id: 'models/gemini-pro-latest', name: 'Gemini Pro Latest', badges: [], desc: 'Alias to our latest Pro model (Points to 3.1 Pro).', pricing: 'Input: $2.00 / Output: $12.00' },
  { id: 'models/gemini-flash-latest', name: 'Gemini Flash Latest', badges: ['New'], desc: 'Alias to our latest Flash model (Points to 3.8 Flash).', pricing: 'Input: $0.75 / Output: $3.75' },
  { id: 'models/gemini-flash-lite-latest', name: 'Gemini Flash-Lite Latest', badges: [], desc: 'Alias to our latest Flash-Lite model (Points to 3.5 Flash-Lite).', pricing: 'Input: $0.30 / Output: $2.50' },
  { id: 'models/gemini-robotics-er-2-preview', name: 'Gemini Robotics-ER 2', badges: [], desc: 'Embodied reasoning model for video & spatial robotics tasks.', pricing: 'Input: $2.00 / Output: $10.00' },
  { id: 'models/gemini-3.5-transcribe-live', name: 'Gemini 3.5 Transcribe Live', badges: ['New'], desc: 'Real-time streaming speech-to-text model.', pricing: 'Input: $3.50 / Output: $21.00' },
  { id: 'models/gemini-omni-1.1-flash', name: 'Gemini Omni 1.1 Flash', badges: ['New', 'Paid'], desc: 'Generative video with keyframe control up to 4K.', pricing: 'Text: $1.50 / Video: $17.50' }
];

let selectedModelId = 'models/gemini-3.8-flash';


const INITIAL_PERSONAS = [
  { id: 'p_1', name: 'ㅇㅇ', desc: '', isDefault: true },
  { id: 'p_2', name: '아이리', desc: '## 성별: 여성 ## 나이 19세 ## 종족: 구울 ## 카구네: 키메라 카...', isDefault: false },
  { id: 'p_3', name: '박성준', desc: '스펙: SM 엔터테인먼트 작곡 및 매니지먼트 경력 5년', isDefault: false }
];

let personaList = JSON.parse(localStorage.getItem('neo_persona_list') || JSON.stringify(INITIAL_PERSONAS));
let activePersonaId = localStorage.getItem('neo_active_persona_id') || 'p_1';
let chatNotesMap = JSON.parse(localStorage.getItem('neo_chat_notes_map') || '{}');
let toggleSettings = JSON.parse(localStorage.getItem('neo_toggle_settings') || '{"impersonation": true, "awkward": true}');
let isBgBEnabled = localStorage.getItem('BG_B') === 'true'; // boolean으로 로드
let chatBasePromptMap = JSON.parse(localStorage.getItem('neo_chat_base_prompts') || '{}');

function saveToggleSettings() {
  localStorage.setItem('neo_toggle_settings', JSON.stringify(toggleSettings));
}

function getChatRoomId() {
  const path = window.location.pathname;
  const match = path.match(/prompts\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : 'new_chat';
}

function getNoteForCurrentRoom() {
  const id = getChatRoomId();
  return chatNotesMap[id] || '';
}

function setNoteForCurrentRoom(text) {
  const id = getChatRoomId();
  chatNotesMap[id] = text;
  localStorage.setItem('neo_chat_notes_map', JSON.stringify(chatNotesMap));
}

function savePersonaData() {
  localStorage.setItem('neo_persona_list', JSON.stringify(personaList));
  localStorage.setItem('neo_active_persona_id', activePersonaId);
}

function showNeoToast(message) {
  let toast = document.getElementById('neo-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'neo-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function simulateNativeClick(element) {
  if (!element) return;
  ['mousedown', 'mouseup', 'click'].forEach(eventType => {
    element.dispatchEvent(new MouseEvent(eventType, { bubbles: true, cancelable: true, view: window }));
  });
}

function forceAngularValue(el, val) {
  const proto = Object.getPrototypeOf(el);
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (setter) {
    setter.call(el, val);
  } else {
    el.value = val;
  }
  el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  el.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
}


function extractPureBasePrompt(raw) {
  if (!raw) return '';
  let text = raw;
  text = text.replace(/##\s*Top Setting[\s\S]*?(?=\n\s*\n|##|#|$)/i, '').trim();
  text = text.replace(/##\s*Dialogue setting[\s\S]*?(?=\n\s*\n|##|#|$)/i, '').trim();
  text = text.replace(/#\s*User Note[\s\S]*?(?=\n\s*\n|##|#\s*(Presona|Persona)|$)/i, '').trim();
  text = text.replace(/#\s*(Presona|Persona)[\s\S]*?(?=\n\s*\n|##|#|$)/i, '').trim();
  return text.trim();
}

async function syncToSystemInstructions() {
  let sysTextarea = document.querySelector('ms-system-instructions textarea') ||
                    document.querySelector('textarea[aria-label="System instructions"]') ||
                    document.querySelector('textarea[placeholder*="Optional tone and style"]');

  if (!sysTextarea) {
    const cardTrigger = document.querySelector('.system-instructions-card') ||
                        document.querySelector('button[aria-label*="System instructions"]');
    if (cardTrigger) {
      simulateNativeClick(cardTrigger);
      await new Promise(r => setTimeout(r, 150));
      sysTextarea = document.querySelector('ms-system-instructions textarea') ||
                    document.querySelector('textarea[aria-label="System instructions"]');
    }
  }

  if (!sysTextarea) return;

  const roomId = getChatRoomId();
  let raw = sysTextarea.value || '';
  let extractedBase = extractPureBasePrompt(raw);

  if (extractedBase) {
    chatBasePromptMap[roomId] = extractedBase;
    localStorage.setItem('neo_chat_base_prompts', JSON.stringify(chatBasePromptMap));
  } else if (chatBasePromptMap[roomId]) {
    extractedBase = chatBasePromptMap[roomId];
  }

  const activeObj = personaList.find(p => p.id === activePersonaId);
  const roomNote = getNoteForCurrentRoom().trim();
  const userName = (activeObj && activeObj.name) ? activeObj.name : 'User';

  let blocks = [];

  if (toggleSettings.impersonation) {
    blocks.push(`## Top Setting \ndon't input ${userName}'s Dialogue, inner thoughts, monologues, and everything else related`);
  }

  if (toggleSettings.awkward) {
    blocks.push(`## Dialogue setting\nIf possible, please Google the speech patterns of people in their teens and twenties and output the dialogue.`);
  }

  if (extractedBase) {
    blocks.push(extractedBase);
  }

  if (roomNote) {
    blocks.push(`# User Note\n${roomNote}`);
  }

  if (activeObj && (activeObj.name || activeObj.desc)) {
    blocks.push(`# Presona\nName: ${activeObj.name || ''}\nDes: ${activeObj.desc || ''}`);
  }

  const finalVal = blocks.join('\n\n').trim();
  forceAngularValue(sysTextarea, finalVal);
}


async function applyModelToAIStudio(modelId) {
  let targetBtn = document.getElementById('model-carousel-row-' + modelId) ||
                  document.querySelector(`button[id*="${modelId}"]`);
  
  if (targetBtn) {
    simulateNativeClick(targetBtn);
    showNeoToast(`✓ ${modelId.replace('models/', '')} 모델이 적용되었습니다.`);
    return true;
  }

  const nativeModelTrigger = document.querySelector('.model-selector-card') ||
                             document.querySelector('.model-selector-trigger') ||
                             document.querySelector('.settings-model-selector button') ||
                             document.querySelector('button[data-test-id="model-selector"]') ||
                             document.querySelector('ms-model-selector-collapsible button') ||
                             document.querySelector('ms-model-selector-two-column button');

  if (nativeModelTrigger) {
    simulateNativeClick(nativeModelTrigger);
    await new Promise(r => setTimeout(r, 180));
  }

  targetBtn = document.getElementById('model-carousel-row-' + modelId) ||
              document.querySelector(`button[id*="${modelId}"]`);

  if (targetBtn) {
    simulateNativeClick(targetBtn);
    showNeoToast(`✓ ${modelId.replace('models/', '')} 모델이 적용되었습니다.`);
    setTimeout(() => {
      const backBtn = document.querySelector('.panel-header .back-button') || 
                      document.querySelector('button[aria-label="Back"]');
      if (backBtn) simulateNativeClick(backBtn);
    }, 100);
    return true;
  }

  showNeoToast(`⚠️ 모델 선택 버튼을 찾는 중입니다... 잠시 후 다시 시도해주세요.`);
  return false;
}

function showConfirmDialog(model) {
  const existing = document.getElementById('neo-confirm-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'neo-confirm-backdrop';
  backdrop.innerHTML = `
    <div class="neo-confirm-card">
      <div style="font-size: 20px; color: #ffffff;">❖</div>
      <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0;">모델 변경 확인</h3>
      <p style="font-size: 13px; color: #d4d4d4; margin: 0;">
        <span style="font-weight: 700; color: #ffffff;">${model.name}</span><br>모델로 변경하시겠습니까?
      </p>
      <div style="font-size: 11px; color: #737373; line-height: 1.4;">${model.desc}</div>
      <div class="confirm-actions">
        <button class="confirm-btn confirm-btn-cancel" id="neo-confirm-cancel">취소</button>
        <button class="confirm-btn confirm-btn-ok" id="neo-confirm-ok">선택하기</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  document.getElementById('neo-confirm-cancel').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });

  document.getElementById('neo-confirm-ok').addEventListener('click', async () => {
    selectedModelId = model.id;
    await applyModelToAIStudio(model.id);
    document.querySelectorAll('.neo-model-item').forEach(el => {
      el.classList.toggle('current-selected', el.dataset.modelId === model.id);
    });
    backdrop.remove();
  });
}


function injectRadixModal() {
  if (document.getElementById('neo-radix-modal')) return;

  const triggerBtn = document.createElement('button');
  triggerBtn.id = 'neo-settings-trigger';
  triggerBtn.title = '출력 및 모델 설정';
  triggerBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `;    
  document.body.appendChild(triggerBtn);

  const modelItemsHtml = GEMINI_MODELS.map(m => `
    <button class="neo-model-item ${m.id === selectedModelId ? 'current-selected' : ''}" data-model-id="${m.id}">
      <div style="flex: 1; min-width: 0;">
        <div class="model-meta-badges">
          ${m.badges.includes('New') ? '<span class="badge-new">NEW</span>' : ''}
          ${m.badges.includes('Paid') ? '<span class="badge-paid">PAID</span>' : ''}
        </div>
        <div style="font-size: 13px; font-weight: 700; color: #fff;">${m.name}</div>
        <div style="font-size: 11px; color: #737373; line-height: 1.35; margin-top: 2px;">${m.desc}</div>
        <div class="model-pricing">${m.pricing}</div>
      </div>
      <span style="font-size: 14px; color: #ffffff; align-self: center;">›</span>
    </button>
  `).join('');

  const modal = document.createElement('div');
  modal.id = 'neo-radix-modal';
  modal.classList.add('hidden');
  modal.innerHTML = `
    <div class="modal-tabs">
      <button class="modal-tab active" data-tab="output">출력</button>
      <button class="modal-tab" data-tab="persona">페르소나</button>
      <button class="modal-tab" data-tab="notes">노트</button>
    </div>

    <div class="modal-body">
      <!-- 1. [출력] 탭 -->
      <div class="tab-content" id="tab-content-output">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="section-title" style="margin: 0;">채팅 모델 선택 (18종)</span>
            <span style="font-size: 11px; color: #ffffff; font-weight: 600;">실시간 동기화</span>
          </div>
          <div class="model-list-wrapper">${modelItemsHtml}</div>
        </div>

        <div>
          <span class="section-title">응답 설정</span>
          <div style="background: rgba(255, 255, 255, 0.025); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px;">
            <div class="toggle-item">
              <div class="toggle-header">
                <span>사칭 방지</span>
                <div class="custom-switch ${toggleSettings.impersonation ? 'on' : ''}" id="switch-impersonation"></div>
              </div>
              <p class="toggle-desc">모델이 사용자의 대사 및 독백을 출력하지 못하도록 최상단에 제한합니다.</p>
            </div>
            <!-- BGM, 배경화면 토글 (기존 검색 채팅 대체) -->
            <div class="toggle-item">
              <div class="toggle-header">
                <span>BGM, 배경화면</span>
                <div class="custom-switch ${isBgBEnabled ? 'on' : ''}" id="switch-bgb"></div>
              </div>
              <p class="toggle-desc">BGM 및 배경화면 기능을 활성화하거나 해제합니다.</p>
            </div>
            <div class="toggle-item">
              <div class="toggle-header">
                <span>어색한 출력 교정</span>
                <div class="custom-switch ${toggleSettings.awkward ? 'on' : ''}" id="switch-awkward"></div>
              </div>
              <p class="toggle-desc">10~20대 말투를 학습하여 어색한 대화 표현을 교정하도록 지시합니다.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. [페르소나] 탭 -->
      <div class="tab-content hidden" id="tab-content-persona">
        <div>
          <span class="section-title">페르소나</span>
          <button type="button" class="neo-persona-trigger-btn" id="neo-persona-trigger-btn">
            <div class="persona-avatar-circle" id="neo-trigger-avatar">ㅇ</div>
            <span style="font-size: 13px; font-weight: 600;" id="neo-trigger-name">ㅇㅇ</span>
            <span class="persona-badge-default" id="neo-trigger-badge">기본</span>
            <svg class="persona-chevron-icon" id="neo-trigger-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          <div class="neo-persona-dropdown-panel hidden" id="neo-persona-dropdown-panel">
            <div class="persona-search-wrapper">
              <input type="text" placeholder="페르소나 검색" id="neo-persona-search-input">
            </div>
            <button type="button" class="persona-add-action-btn" id="neo-btn-new-persona">+ 새로운 페르소나</button>
            <div class="persona-group-label">이 캐릭터에서 사용한 페르소나</div>
            <div id="neo-used-persona-box"></div>
            <div class="persona-group-label" id="neo-other-group-label">다른 페르소나</div>
            <div id="neo-other-persona-list" style="display: flex; flex-direction: column; gap: 4px; max-height: 180px; overflow-y: auto;"></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 6px;">
          <div>
            <span class="section-title">페르소나 이름</span>
            <div class="neo-form-box">
              <input type="text" placeholder="이름 입력..." id="neo-persona-name-input" maxlength="50">
            </div>
          </div>
          <div>
            <span class="section-title">캐릭터 정보</span>
            <div class="neo-form-box" style="padding: 12px 14px;">
              <textarea placeholder="캐릭터 정보 입력..." id="neo-persona-desc-input" rows="4"></textarea>
            </div>
          </div>
          <button type="button" class="neo-action-btn-primary" id="neo-persona-save-btn">저장 및 프롬프트 동기화</button>
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 4px;">
            <button type="button" style="background: none; border: none; font-size: 12px; color: #a3a3a3; cursor: pointer;" id="neo-persona-set-main">★ 메인 페르소나로 설정</button>
            <span style="width: 1px; height: 12px; background: rgba(255, 255, 255, 0.15);"></span>
            <button type="button" style="background: none; border: none; font-size: 12px; color: #737373; cursor: pointer; text-decoration: underline;" id="neo-persona-delete-btn">삭제</button>
          </div>
        </div>
      </div>

      <!-- 3. [노트] 탭 -->
      <div class="tab-content hidden" id="tab-content-notes">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="section-title" style="margin: 0;">채팅방 유저 노트</span>
            <span style="font-size: 10.5px; color: #ffffff; font-weight: 600;" id="neo-room-indicator">방: 자동 감지됨</span>
          </div>
          <div class="neo-form-box" style="padding: 12px 14px;">
            <textarea placeholder="이 채팅방에 적용할 유저 노트를 작성해 주세요." id="neo-single-note-textarea" rows="8"></textarea>
          </div>
        </div>
        <button type="button" class="neo-action-btn-primary" id="neo-note-save-btn">노트 저장 및 프롬프트 동기화</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.classList.toggle('hidden');
    const noteEl = document.getElementById('neo-single-note-textarea');
    if (noteEl) noteEl.value = getNoteForCurrentRoom();
    const roomInd = document.getElementById('neo-room-indicator');
    if (roomInd) roomInd.textContent = `방: ${getChatRoomId().substring(0, 8)}...`;
  });

  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !triggerBtn.contains(e.target) && !document.getElementById('neo-confirm-backdrop')) {
      modal.classList.add('hidden');
    }
  });

  modal.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      modal.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      modal.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      tab.classList.add('active');
      const targetId = `tab-content-${tab.dataset.tab}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.remove('hidden');
    });
  });

  modal.querySelectorAll('.neo-model-item[data-model-id]').forEach(itemBtn => {
    itemBtn.addEventListener('click', () => {
      const modelId = itemBtn.dataset.modelId;
      const modelObj = GEMINI_MODELS.find(m => m.id === modelId);
      if (modelObj) showConfirmDialog(modelObj);
    });
  });

  document.getElementById('switch-impersonation')?.addEventListener('click', async (e) => {
    toggleSettings.impersonation = !toggleSettings.impersonation;
    e.currentTarget.classList.toggle('on', toggleSettings.impersonation);
    saveToggleSettings();
    await syncToSystemInstructions();
    showNeoToast(`✓ 사칭 방지가 ${toggleSettings.impersonation ? '활성화' : '해제'}되었습니다.`);
  });

  document.getElementById('switch-awkward')?.addEventListener('click', async (e) => {
    toggleSettings.awkward = !toggleSettings.awkward;
    e.currentTarget.classList.toggle('on', toggleSettings.awkward);
    saveToggleSettings();
    await syncToSystemInstructions();
    showNeoToast(`✓ 어색한 출력 교정이 ${toggleSettings.awkward ? '활성화' : '해제'}되었습니다.`);
  });

  // 기존 switch-search 이벤트 리스너를 제거하고 아래 코드로 교체
  document.getElementById('switch-bgb')?.addEventListener('click', (e) => {
    isBgBEnabled = !isBgBEnabled;
    localStorage.setItem('BG_B', JSON.stringify(isBgBEnabled)); // bool(true/false) 방식으로 저장
    e.currentTarget.classList.toggle('on', isBgBEnabled);
    
    // (선택 사항) 다른 스크립트에서 실시간 감지할 수 있도록 커스텀 이벤트 발송
    window.dispatchEvent(new CustomEvent('neo-bgb-updated', { detail: { enabled: isBgBEnabled } }));
    
    showNeoToast(`✓ BGM/배경화면 기능이 ${isBgBEnabled ? '활성화' : '해제'}되었습니다.`);
  });

  
  const triggerDropdownBtn = document.getElementById('neo-persona-trigger-btn');
  const dropdownPanel = document.getElementById('neo-persona-dropdown-panel');
  const chevronIcon = document.getElementById('neo-trigger-chevron');
  const searchInput = document.getElementById('neo-persona-search-input');
  const nameInput = document.getElementById('neo-persona-name-input');
  const descInput = document.getElementById('neo-persona-desc-input');

  function updateActivePersonaView() {
    const current = personaList.find(p => p.id === activePersonaId) || personaList[0];
    if (!current) return;
    document.getElementById('neo-trigger-avatar').textContent = current.name ? current.name.charAt(0) : 'ㅇ';
    document.getElementById('neo-trigger-name').textContent = current.name || '이름 없음';
    document.getElementById('neo-trigger-badge').style.display = current.isDefault ? 'inline-block' : 'none';
    nameInput.value = current.name || '';
    descInput.value = current.desc || '';
  }

  function renderPersonaDropdown(query = '') {
    const usedBox = document.getElementById('neo-used-persona-box');
    const otherBox = document.getElementById('neo-other-persona-list');
    const otherLabel = document.getElementById('neo-other-group-label');
    const activeObj = personaList.find(p => p.id === activePersonaId);

    if (activeObj) {
      usedBox.innerHTML = `
        <button type="button" class="persona-dropdown-item active" data-id="${activeObj.id}">
          <div class="persona-avatar-circle">${activeObj.name ? activeObj.name.charAt(0) : 'ㅇ'}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="persona-item-name">${activeObj.name}</span>
              ${activeObj.isDefault ? '<span class="persona-badge-default">기본</span>' : ''}
            </div>
            ${activeObj.desc ? `<div class="persona-item-desc">${activeObj.desc}</div>` : ''}
          </div>
        </button>
      `;
    }

    const others = personaList.filter(p => p.id !== activePersonaId && (p.name.includes(query) || p.desc.includes(query)));
    if (others.length === 0) {
      otherLabel.style.display = query ? 'none' : 'block';
      otherBox.innerHTML = query ? '<div style="font-size: 11px; color: #737373; padding: 6px;">검색 결과가 없습니다.</div>' : '';
    } else {
      otherLabel.style.display = 'block';
      otherBox.innerHTML = others.map(p => `
        <button type="button" class="persona-dropdown-item" data-id="${p.id}">
          <div class="persona-avatar-circle" style="background: rgba(255,255,255,0.06); color: #d4d4d4;">${p.name ? p.name.charAt(0) : 'ㅇ'}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="persona-item-name">${p.name}</span>
              ${p.isDefault ? '<span class="persona-badge-default">기본</span>' : ''}
            </div>
            ${p.desc ? `<div class="persona-item-desc">${p.desc}</div>` : ''}
          </div>
        </button>
      `).join('');
    }

    dropdownPanel.querySelectorAll('.persona-dropdown-item').forEach(item => {
      item.addEventListener('click', async () => {
        activePersonaId = item.dataset.id;
        savePersonaData();
        updateActivePersonaView();
        await syncToSystemInstructions();
        dropdownPanel.classList.add('hidden');
        chevronIcon.classList.remove('open');
        showNeoToast(`✓ '${nameInput.value}' 페르소나 적용 완료.`);
      });
    });
  }

  triggerDropdownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isClosed = dropdownPanel.classList.toggle('hidden');
    chevronIcon.classList.toggle('open', !isClosed);
    if (!isClosed) {
      searchInput.value = '';
      renderPersonaDropdown();
    }
  });

  searchInput?.addEventListener('input', (e) => renderPersonaDropdown(e.target.value.trim()));

  document.getElementById('neo-btn-new-persona')?.addEventListener('click', async () => {
    const newId = 'p_' + Date.now();
    personaList.push({ id: newId, name: '새 페르소나', desc: '', isDefault: false });
    activePersonaId = newId;
    savePersonaData();
    updateActivePersonaView();
    await syncToSystemInstructions();
    dropdownPanel.classList.add('hidden');
    chevronIcon.classList.remove('open');
    nameInput.focus();
    showNeoToast('✓ 새 페르소나가 생성되었습니다.');
  });

  document.getElementById('neo-persona-save-btn')?.addEventListener('click', async () => {
    const cur = personaList.find(p => p.id === activePersonaId);
    if (cur) {
      cur.name = nameInput.value.trim() || '이름 없음';
      cur.desc = descInput.value.trim();
      savePersonaData();
      updateActivePersonaView();
      await syncToSystemInstructions();
      showNeoToast('✓ 페르소나 저장 및 프롬프트 반영 완료');
    }
  });

  document.getElementById('neo-persona-set-main')?.addEventListener('click', async () => {
    personaList.forEach(p => p.isDefault = (p.id === activePersonaId));
    savePersonaData();
    updateActivePersonaView();
    await syncToSystemInstructions();
    showNeoToast('★ 메인 페르소나로 설정되었습니다.');
  });

  document.getElementById('neo-persona-delete-btn')?.addEventListener('click', async () => {
    if (personaList.length <= 1) {
      showNeoToast('⚠️ 최소 1개의 페르소나는 유지되어야 합니다.');
      return;
    }
    personaList = personaList.filter(p => p.id !== activePersonaId);
    activePersonaId = personaList[0].id;
    savePersonaData();
    updateActivePersonaView();
    await syncToSystemInstructions();
    showNeoToast('✓ 페르소나가 삭제되었습니다.');
  });

  updateActivePersonaView();

  document.getElementById('neo-note-save-btn')?.addEventListener('click', async () => {
    const noteEl = document.getElementById('neo-single-note-textarea');
    setNoteForCurrentRoom(noteEl ? noteEl.value : '');
    await syncToSystemInstructions();
    showNeoToast(`✓ [방 ID: ${getChatRoomId().substring(0, 6)}] 유저노트 저장 완료`);
  });
}


let lastRoomId = null;

function checkChatRoomChange() {
  const currentRoom = getChatRoomId();

  if (currentRoom !== lastRoomId) {
    lastRoomId = currentRoom;
    const noteEl = document.getElementById('neo-single-note-textarea');
    if (noteEl) noteEl.value = getNoteForCurrentRoom();
    const roomInd = document.getElementById('neo-room-indicator');
    if (roomInd) roomInd.textContent = `방: ${currentRoom.substring(0, 8)}...`;
  }

  const sysTextarea = document.querySelector('ms-system-instructions textarea') ||
                      document.querySelector('textarea[aria-label="System instructions"]');
  if (sysTextarea && sysTextarea.value) {
    const pureBase = extractPureBasePrompt(sysTextarea.value);
    if (pureBase && pureBase !== chatBasePromptMap[currentRoom]) {
      chatBasePromptMap[currentRoom] = pureBase;
      localStorage.setItem('neo_chat_base_prompts', JSON.stringify(chatBasePromptMap));
    }
  }
}


function applyCustomTextFormatting(container) {
  if (!container) return;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
                  if (node.parentElement?.closest('.neo-quote-orange, .neo-quote-gray, .neo-ast-gray')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodesToProcess = [];
  while (walker.nextNode()) {
    nodesToProcess.push(walker.currentNode);
  }

    const pattern = /('[^'\n]+?')|(\*[^*\n]+?\*)/g;

  for (const textNode of nodesToProcess) {
    const text = textNode.nodeValue;
    if (!text || !pattern.test(text)) continue;

    pattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
      }

      const span = document.createElement('span');
      
            if (match[1]) {
                span.className = 'neo-quote-gray';
        span.textContent = match[1];
      } else if (match[2]) {
                span.className = 'neo-ast-gray';
        span.textContent = match[2].slice(1, -1);
      }

      fragment.appendChild(span);
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  }
}


function polishMessages() {
  document.querySelectorAll('ms-callout, ms-paid-api-key-callout, .turn-footer, .response-feedback-button, ms-prompt-feedback, .author-label, .turn-separator, .timestamp').forEach(el => el.remove());

    document.querySelectorAll('ms-thought-chunk:not(.neo-thought-styled)').forEach(thoughtChunk => {
    thoughtChunk.classList.add('neo-thought-styled');
    const originHeader = thoughtChunk.querySelector('mat-expansion-panel-header');

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'neo-gemini-logo-btn';
    toggleBtn.type = 'button';
    toggleBtn.title = '사고 과정 확인';
    toggleBtn.innerHTML = `
      <svg class="gemini-official-icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 28C14 20.268 7.732 14 0 14C7.732 14 14 7.732 14 0C14 7.732 20.268 14 28 14C20.268 14 14 20.268 14 28Z" fill="url(#gemini-mono-gradient)"/>
        <defs>
          <linearGradient id="gemini-mono-gradient" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="50%" stop-color="#a3a3a3"/>
            <stop offset="100%" stop-color="#525252"/>
          </linearGradient>
        </defs>
      </svg>
      <span class="gemini-btn-text">생각 과정</span>
      <span class="gemini-arrow-icon">▼</span>
    `;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (originHeader) originHeader.click();
      const isOpen = thoughtChunk.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
    });

    thoughtChunk.prepend(toggleBtn);
  });

    document.querySelectorAll('ms-chat-turn').forEach(turn => {
    const isModel = turn.querySelector('.model-prompt-container');
    const author = turn.querySelector('.author-label');
    if (author) author.style.display = 'none';

    if (!turn.classList.contains('hud-injected')) {
      turn.classList.add('hud-injected');
      if (isModel) {
        turn.classList.add('model-turn-styled');
      } else {
        turn.classList.add('user-turn-styled');
      }
    }

        const turnContent = turn.querySelector('.turn-content') || turn;
    applyCustomTextFormatting(turnContent);
  });
}

injectRadixModal();
polishMessages();
checkChatRoomChange();

const observer = new MutationObserver(() => {
  injectRadixModal();
  polishMessages();
  checkChatRoomChange();
});
observer.observe(document.body, { childList: true, subtree: true });
setInterval(checkChatRoomChange, 1000);