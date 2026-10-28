/* Freeze Sim: a prank SIMULATOR. Pure DOM. Does not lock, block, or trap anything. */
(function () {
  "use strict";

  var landing = document.getElementById("landing");
  var freeze = document.getElementById("freeze");
  var startBtn = document.getElementById("start");
  var exitX = document.getElementById("exit-x");
  var reveal = document.getElementById("reveal");
  var revealExit = document.getElementById("reveal-exit");
  var barFill = document.getElementById("bar-fill");
  var pctEl = document.getElementById("pct");
  var clockEl = document.getElementById("clock");
  var fakeWait = document.getElementById("fake-wait");
  var fakeClose = document.getElementById("fake-close");
  var dlgBody = document.getElementById("dlg-body");

  var timers = [];
  var progressTimer = null;
  var tapCount = 0;
  var tapTimer = null;
  var active = false;

  function later(fn, ms) {
    var id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function updateClock() {
    var d = new Date();
    var h = d.getHours();
    var m = String(d.getMinutes()).padStart(2, "0");
    clockEl.textContent = h + ":" + m;
  }

  // Fake progress: climbs, then stalls near 97% (purely cosmetic).
  function runFakeProgress() {
    var pct = 0;
    barFill.style.width = "0%";
    pctEl.textContent = "0";
    progressTimer = setInterval(function () {
      if (pct < 97) {
        pct = Math.min(97, pct + Math.random() * 6);
        barFill.style.width = pct.toFixed(1) + "%";
        pctEl.textContent = Math.floor(pct);
      }
    }, 700);
  }

  function startPrank() {
    if (active) return;
    active = true;
    landing.hidden = true;
    freeze.classList.add("on");
    freeze.setAttribute("aria-hidden", "false");
    updateClock();
    runFakeProgress();

    // Clock-style flavour text that gently admits it is a prank.
    later(function () { dlgBody.textContent = "still busy. this is a simulator, so it's fine."; }, 4000);

    // X button appears after 3 seconds.
    later(function () { exitX.classList.add("show"); }, 3000);

    // Auto-show the reveal after 12 seconds so nobody is stuck guessing.
    later(function () { showReveal(); }, 12000);
  }

  function showReveal() {
    reveal.hidden = false;
    revealExit.focus();
  }

  function exitPrank() {
    if (!active) return;
    active = false;
    timers.forEach(clearTimeout);
    timers = [];
    clearInterval(progressTimer);
    tapCount = 0;
    clearTimeout(tapTimer);
    freeze.classList.remove("on");
    freeze.setAttribute("aria-hidden", "true");
    exitX.classList.remove("show");
    reveal.hidden = true;
    dlgBody.textContent = "the screen is busy. you can wait for it to finish or close the app.";
    landing.hidden = false;
    startBtn.focus();
  }

  // Escape always exits.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && active) exitPrank();
  });

  // Triple tap anywhere reveals the exit (three taps within 600ms gaps).
  freeze.addEventListener("click", function () {
    if (!active) return;
    tapCount += 1;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(function () { tapCount = 0; }, 600);
    if (tapCount >= 3) {
      tapCount = 0;
      exitX.classList.add("show");
      showReveal();
    }
  });

  // Fake dialog buttons do nothing harmful; they just reveal the exit.
  fakeWait.addEventListener("click", function () { showReveal(); });
  fakeClose.addEventListener("click", function () { showReveal(); });

  exitX.addEventListener("click", exitPrank);
  revealExit.addEventListener("click", exitPrank);
  startBtn.addEventListener("click", startPrank);

  updateClock();
  setInterval(updateClock, 30000);
})();
