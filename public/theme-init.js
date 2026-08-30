/* Runs before first paint so there is never a flash of the wrong sky.
   Deliberately external rather than inline: the CSP is script-src 'self',
   and an external file avoids maintaining a hash for every edit (D-018). */
(function () {
  try {
    var stored = localStorage.getItem('hours:theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) { /* private mode, blocked storage: fall through to OS preference */ }
})();
