'use strict';

chrome.runtime.sendMessage({
  url: location.href,
  date: new Date(),
  random: Math.random()
}, function(response) {
  if (response) {
    response.forEach((item) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.innerHTML = `
        try {
          ${item.script}
        } catch (e) {
          console.error("${item.url} 脚本出错");
        }
      `;
      document.head.appendChild(script);
    });
  }
});