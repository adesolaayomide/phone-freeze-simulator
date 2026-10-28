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
  var dialogEl = document.querySelector("#freeze .dialog");
  var ransomEl = document.getElementById("ransom");
  var ransomDemand = document.getElementById("ransom-demand");
  var ransomFill = document.getElementById("ransom-fill");
  var ransomPct = document.getElementById("ransom-pct");
  var ransomJk = document.getElementById("ransom-jk");
  var ransomExit = document.getElementById("ransom-exit");
  var ransomTimer = null;

  // Silly food-only demands. No money, no amounts of currency, no payment.
  var RANSOMS = [
    "2 wraps of jollof rice",
    "3 puff-puffs",
    "1 indivisible gala",
    "a plate of moi moi, no pepper",
    "1 bottle of chilled zobo"
  ];

  function showRansom() {
    if (!active) return;
    dialogEl.hidden = true;
    ransomEl.hidden = false;
    ransomDemand.textContent = RANSOMS[Math.floor(Math.random() * RANSOMS.length)];
    var pct = 0;
    ransomFill.style.width = "0%";
    ransomPct.textContent = "0";
    ransomJk.hidden = true;
    ransomExit.hidden = true;
    clearInterval(ransomTimer);
    ransomTimer = setInterval(function () {
      pct = Math.min(100, pct + 4 + Math.random() * 6);
      ransomFill.style.width = pct.toFixed(1) + "%";
      ransomPct.textContent = Math.floor(pct);
      if (pct >= 100) {
        clearInterval(ransomTimer);
        ransomJk.hidden = false;
        ransomExit.hidden = false;
      }
    }, 500);
  }

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

    // Joke ransom screen after a few seconds (food only, always ends in "JK").
    later(function () { showRansom(); }, 7000);

    // X button appears after 3 seconds.
    later(function () { exitX.classList.add("show"); }, 3000);

    // Auto-show the reveal after 12 seconds so nobody is stuck guessing.
    later(function () { showReveal(); }, 12000);
  }

  function showReveal() {
    clearInterval(ransomTimer);
    ransomEl.hidden = true;
    dialogEl.hidden = false;
    reveal.hidden = false;
    revealExit.focus();
  }

  function exitPrank() {
    if (!active) return;
    active = false;
    timers.forEach(clearTimeout);
    timers = [];
    clearInterval(progressTimer);
    clearInterval(ransomTimer);
    ransomEl.hidden = true;
    dialogEl.hidden = false;
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
  ransomExit.addEventListener("click", exitPrank);
  revealExit.addEventListener("click", exitPrank);
  startBtn.addEventListener("click", startPrank);

  updateClock();
  setInterval(updateClock, 30000);
})();
