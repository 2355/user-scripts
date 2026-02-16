// ==UserScript==
// @name         Slack Auto Open in Browser
// @namespace    http://tampermonkey.net/
// @version      2026-02-16
// @description  Automatically open Slack archive links in the browser instead of the desktop app
// @author       2355
// @match        https://app.slack.com/*
// @match        https://*.slack.com/archives/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @updateURL    https://raw.githubusercontent.com/2355/user-scripts/main/slack-auto-browser.user.js
// @downloadURL  https://raw.githubusercontent.com/2355/user-scripts/main/slack-auto-browser.user.js
// ==/UserScript==

(function () {
  'use strict';

  // Slack のリダイレクトページにある「use Slack in your browser」リンクを自動クリック
  const tryClick = () => {
    // "open this link in your browser" や "use Slack in your browser" 系のリンクを探す
    const links = document.querySelectorAll('a');
    for (const link of links) {
      const text = link.textContent.toLowerCase();
      if (
        text.includes('use slack in your browser') ||
        text.includes('open this link in your browser') ||
        text.includes('continue in browser') ||
        text.includes('ブラウザ')
      ) {
        link.click();
        return true;
      }
    }
    return false;
  };

  // ページ読み込み直後に試行、見つからなければ MutationObserver で監視
  if (!tryClick()) {
    const observer = new MutationObserver(() => {
      if (tryClick()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 安全のため10秒後に監視停止
    setTimeout(() => observer.disconnect(), 10000);
  }
})();
