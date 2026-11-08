(function () {
  'use strict';

  
  function removeContainerClass() {
    const panels = document.querySelectorAll('mat-expansion-panel');
    
    panels.forEach(panel => {
      let currentElement = panel.parentElement;
      
      while (currentElement && currentElement !== document.body) {
        
        if (currentElement.classList && currentElement.classList.contains('container')) {
          
          
          currentElement.classList.remove('container');
          console.log('[AI Studio Cleaner] Cleaned class from element:', currentElement);
          
          break; 
        }
        currentElement = currentElement.parentElement;
      }
    });
  }

  
  removeContainerClass();

  
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldRun = true;
        break;
      }
    }
    if (shouldRun) {
      removeContainerClass();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
