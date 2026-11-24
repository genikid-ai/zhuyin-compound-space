(function () {
  "use strict";

  const DATA = window.COMPOUND_RHYME_DATA;
  if (!DATA || !DATA.ITEMS || !DATA.GROUPS) {
    console.error("找不到結合韻題庫資料（data.js）");
    return;
  }

  /* ==================== 1. 模式與文字設定 ==================== */
  const MODE_CONFIG = {
    learn: {
      key: "learn",
      label: "🌱 學習模式",
      plainLabel: "學習模式",
      choiceCount: 1,
      guideText: "看圖片，認識這個結合韻的語詞吧！",
      matchBubble: "原來是這個語詞呀！🌟"
    },
    practice: {
      key: "practice",
      label: "🚀 練習模式",
      plainLabel: "練習模式",
      choiceCount: 2,
      guideText: "從兩張圖片中，找出正確答案！",
      matchBubble: "哪一張才對呢？找找看！🚀"
    },
    challenge: {
      key: "challenge",
      label: "🌟 挑戰模式",
      plainLabel: "挑戰模式",
      choiceCount: 3,
      guideText: "從三張圖片中，挑戰找出正確圖案！",
      matchBubble: "睜大眼睛找找看喔！✨"
    }
  };

  const READ_BUBBLES_LEFT = ["大聲唸唸看！🚀", "這是什麼音呢？✨", "太空小偵探加油！🌟", "唸給大家聽吧！🪐"];
  const READ_BUBBLES_RIGHT = ["準備好就點卡片！✨", "唸得好大聲喔！⭐", "一起去星球看看！🚀", "你一定會唸！💛"];
  const CHEER_BUBBLES = ["答對了！超級棒！🎉", "太厲害了！得星星！⭐", "太空小天才！🌟", "耶！完全正確！🚀"];
  const RETRY_BUBBLES = ["沒關係，再找找看！✨", "再看仔細一點喔！🪐", "加油！換另一張試試！💛", "差一點點喔！🚀"];

  /* ==================== 2. 溫暖繪本風太空夥伴插畫 ==================== */
  const MASCOT_ART = {
    astroBear:  { src: "assets/mascot-bear.png",  alt: "太空小熊" },
    astroBunny: { src: "assets/mascot-bunny.png", alt: "太空小兔" },
    astroCat:   { src: "assets/mascot-cat.png",   alt: "太空橘貓" },
    spaceAlien: { src: "assets/mascot-alien.png", alt: "微笑小綠星人" }
  };

  function renderMascot(key) {
    const m = MASCOT_ART[key] || MASCOT_ART.astroBear;
    return `<img class="mascot-img" src="${m.src}" alt="${m.alt}" decoding="async" />`;
  }

  const MASCOT_PAIRS = [
    ["astroBear", "astroBunny"],
    ["astroCat", "spaceAlien"],
    ["astroBunny", "astroCat"],
    ["spaceAlien", "astroBear"]
  ];

  /* ==================== 3. 純合成太空童趣音效（無注音語音） ==================== */
  const SoundFX = {
    ctx: null,
    enabled: true,

    ensureContext() {
      if (!this.enabled) return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    },

    playTone(freq, startTime, duration, type = "sine", peakGain = 0.14) {
      const ctx = this.ctx;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.016);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    },

    playClick() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      this.playTone(580, t, 0.07, "triangle", 0.11);
    },

    playReveal() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      this.playTone(440, t, 0.11, "sine", 0.12);
      this.playTone(587.33, t + 0.07, 0.12, "sine", 0.13);
      this.playTone(783.99, t + 0.14, 0.18, "triangle", 0.13);
    },

    playCorrect() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => {
        this.playTone(n, t + i * 0.075, 0.22, "triangle", 0.14);
      });
    },

    playStarLand() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      this.playTone(1174.66, t, 0.14, "sine", 0.12);
      this.playTone(1567.98, t + 0.06, 0.2, "sine", 0.1);
    },

    playWrong() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      // 柔和不刺耳的彈性提醒音
      this.playTone(310, t, 0.13, "sine", 0.12);
      this.playTone(255, t + 0.11, 0.16, "sine", 0.11);
    },

    playSwap() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      this.playTone(480, t, 0.08, "sine", 0.1);
      this.playTone(620, t + 0.06, 0.1, "sine", 0.1);
    },

    playVictory() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const melody = [
        [523.25, 0.00, 0.14],
        [659.25, 0.12, 0.14],
        [783.99, 0.24, 0.14],
        [1046.5, 0.36, 0.28],
        [783.99, 0.56, 0.12],
        [1046.5, 0.68, 0.44]
      ];
      melody.forEach(([freq, offset, dur]) => {
        this.playTone(freq, t + offset, dur, "triangle", 0.15);
      });
    }
  };

  /* ==================== 4. 狀態管理 ==================== */
  const state = {
    screen: "home",         // "home" | "game" | "victory"
    mode: "learn",          // "learn" | "practice" | "challenge"
    scope: "yi",            // "yi" | "wu" | "yu" | "all"
    countChoice: "5",       // "5" | "10" | "15" | "all"
    fontMode: "sans",       // "sans" | "kai"

    phase: "read",          // "read" | "match"
    queue: [],
    reservePool: [],
    currentIndex: 0,
    currentItem: null,
    currentChoices: [],
    totalTarget: 5,
    earnedStars: 0,
    completedItems: [],
    isSolved: false,
    isTransitioning: false,
    pairIdx: 0
  };

  const preloadedSet = new Set();

  /* ==================== 5. DOM 參照 ==================== */
  const el = {
    stage: document.getElementById("stage"),
    confettiCanvas: document.getElementById("confetti-canvas"),
    fxLayer: document.getElementById("fx-layer"),

    screenHome: document.getElementById("screen-home"),
    screenGame: document.getElementById("screen-game"),
    screenVictory: document.getElementById("screen-victory"),

    // 首頁控制
    modeBtns: document.querySelectorAll("#mode-options .mode-card"),
    scopeBtns: document.querySelectorAll("#scope-options .scope-btn"),
    countBtns: document.querySelectorAll("#count-options .pill-btn"),
    btnCount15: document.getElementById("btn-count-15"),
    btnCountAll: document.getElementById("btn-count-all"),
    btnStart: document.getElementById("btn-start"),
    homeMascotLeft: document.getElementById("home-mascot-left"),
    homeMascotRight: document.getElementById("home-mascot-right"),

    // 共用工具列
    soundBtns: document.querySelectorAll(".sound-toggle-btn"),
    fullscreenBtns: document.querySelectorAll(".fullscreen-btn"),
    btnFontHome: document.getElementById("btn-font-home"),
    btnFontGame: document.getElementById("btn-font-game"),
    fontLabels: document.querySelectorAll(".font-toggle-label"),
    fontShorts: document.querySelectorAll(".font-toggle-short"),

    // 遊戲頂部列
    btnBackHome: document.getElementById("btn-back-home"),
    gameModeBadge: document.getElementById("game-mode-badge"),
    gameScopeBadge: document.getElementById("game-scope-badge"),
    starProgressWrap: document.getElementById("star-progress-wrap"),
    progressPill: document.getElementById("progress-pill"),

    // 遊戲主舞台
    gameArena: document.getElementById("game-arena"),
    phaseRead: document.getElementById("phase-read"),
    phaseMatch: document.getElementById("phase-match"),

    // 階段一（唸結合韻）
    mascotLeft: document.getElementById("mascot-left"),
    mascotRight: document.getElementById("mascot-right"),
    mascotLeftSvg: document.getElementById("mascot-left-svg"),
    mascotRightSvg: document.getElementById("mascot-right-svg"),
    bubbleLeft: document.getElementById("bubble-left"),
    bubbleRight: document.getElementById("bubble-right"),
    rhymeCardBig: document.getElementById("rhyme-card-big"),
    rhymeImgBig: document.getElementById("rhyme-img-big"),
    btnSwapQuestion: document.getElementById("btn-swap-question"),
    btnRevealPics: document.getElementById("btn-reveal-pics"),

    // 階段二（看圖選答案）
    matchMascotMini: document.getElementById("match-mascot-mini"),
    matchMascotSvg: document.getElementById("match-mascot-svg"),
    matchBubble: document.getElementById("match-bubble"),
    rhymeRefCard: document.getElementById("rhyme-ref-card"),
    rhymeImgRef: document.getElementById("rhyme-img-ref"),
    matchGuideText: document.getElementById("match-guide-text"),
    choicesGrid: document.getElementById("choices-grid"),
    matchStatusHint: document.getElementById("match-status-hint"),
    btnNextQuestion: document.getElementById("btn-next-question"),
    btnNextLabel: document.getElementById("btn-next-label"),

    // 過關畫面
    victoryTitle: document.getElementById("victory-title"),
    victorySubtitle: document.getElementById("victory-subtitle"),
    victoryMascots: document.getElementById("victory-mascots"),
    reviewGrid: document.getElementById("review-grid"),
    btnPlayAgain: document.getElementById("btn-play-again"),
    btnVictoryHome: document.getElementById("btn-victory-home"),

    // 彈窗
    modalConfirm: document.getElementById("modal-confirm"),
    btnModalCancel: document.getElementById("btn-modal-cancel"),
    btnModalOk: document.getElementById("btn-modal-ok"),

    modalZoom: document.getElementById("modal-zoom"),
    btnZoomClose: document.getElementById("btn-zoom-close"),
    zoomContent: document.getElementById("zoom-content")
  };

  /* ==================== 6. 工具函式 ==================== */
  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function preloadUrls(urls) {
    urls.forEach((url) => {
      if (!url || preloadedSet.has(url)) return;
      preloadedSet.add(url);
      const img = new Image();
      img.decoding = "async";
      img.src = url;
    });
  }

  function setImageWithLoader(imgEl, url, altText) {
    const frame = imgEl.parentElement;
    imgEl.alt = altText || "";

    if (imgEl.dataset.loadedUrl === url && imgEl.complete && imgEl.naturalWidth > 0) {
      if (frame) frame.classList.remove("is-loading");
      return;
    }

    if (frame) frame.classList.add("is-loading");
    imgEl.onload = () => {
      imgEl.dataset.loadedUrl = url;
      if (frame) frame.classList.remove("is-loading");
    };
    imgEl.onerror = () => {
      if (frame) frame.classList.remove("is-loading");
    };
    imgEl.src = url;

    if (imgEl.complete && imgEl.naturalWidth > 0) {
      imgEl.dataset.loadedUrl = url;
      if (frame) frame.classList.remove("is-loading");
    }
  }

  /* ==================== 7. 16:9 舞台等比縮放 ==================== */
  function updateStageScale() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 1280, vh / 720);
    el.stage.style.transform = `scale(${scale})`;

    const ratioDiff = Math.abs(vw / vh - 16 / 9);
    el.stage.classList.toggle("is-exact-fit", ratioDiff < 0.02 || !!document.fullscreenElement);
  }

  window.addEventListener("resize", updateStageScale);
  document.addEventListener("fullscreenchange", updateStageScale);

  /* ==================== 8. 共用工具按鈕（字體 / 音效 / 全螢幕） ==================== */
  function toggleFont() {
    SoundFX.playClick();
    state.fontMode = state.fontMode === "sans" ? "kai" : "sans";
    document.body.classList.toggle("font-kai", state.fontMode === "kai");
    el.fontLabels.forEach((n) => (n.textContent = state.fontMode === "kai" ? "標楷" : "黑體"));
    el.fontShorts.forEach((n) => (n.textContent = state.fontMode === "kai" ? "楷" : "黑"));
  }

  function toggleSound() {
    state.soundEnabled = !SoundFX.enabled;
    SoundFX.enabled = !SoundFX.enabled;
    el.soundBtns.forEach((btn) => {
      btn.classList.toggle("is-muted", !SoundFX.enabled);
      const icon = btn.querySelector(".sound-icon");
      const label = btn.querySelector(".sound-label");
      if (icon) icon.textContent = SoundFX.enabled ? "🔊" : "🔇";
      if (label) label.textContent = SoundFX.enabled ? "音效開" : "靜音";
    });
    if (SoundFX.enabled) SoundFX.playClick();
  }

  function toggleFullscreen() {
    SoundFX.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  /* ==================== 9. 首頁設定互動 ==================== */
  function updateCountOptions() {
    const poolSize = DATA.GROUPS[state.scope].items.length;
    el.btnCountAll.textContent = `全部（${poolSize} 題）`;

    // 若範圍只有 10 題（如 ㄩ 組），隱藏 15 題避免困惑
    const hide15 = poolSize <= 15;
    el.btnCount15.hidden = hide15;

    if (hide15 && state.countChoice === "15") {
      selectCount("all");
    }
  }

  function selectMode(modeKey) {
    state.mode = modeKey;
    el.modeBtns.forEach((btn) => {
      const active = btn.dataset.mode === modeKey;
      btn.classList.toggle("selected", active);
      btn.setAttribute("aria-checked", String(active));
    });
  }

  function selectScope(scopeKey) {
    state.scope = scopeKey;
    el.scopeBtns.forEach((btn) => {
      const active = btn.dataset.scope === scopeKey;
      btn.classList.toggle("selected", active);
      btn.setAttribute("aria-checked", String(active));
    });
    updateCountOptions();
  }

  function selectCount(countVal) {
    state.countChoice = countVal;
    el.countBtns.forEach((btn) => {
      const active = btn.dataset.count === countVal;
      btn.classList.toggle("selected", active);
      btn.setAttribute("aria-checked", String(active));
    });
  }

  el.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      SoundFX.playClick();
      selectMode(btn.dataset.mode);
    });
  });

  el.scopeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      SoundFX.playClick();
      selectScope(btn.dataset.scope);
    });
  });

  el.countBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      SoundFX.playClick();
      selectCount(btn.dataset.count);
    });
  });

  /* ==================== 10. 畫面切換 ==================== */
  function showScreen(name) {
    state.screen = name;
    el.screenHome.classList.toggle("active", name === "home");
    el.screenGame.classList.toggle("active", name === "game");
    el.screenVictory.classList.toggle("active", name === "victory");
    if (name !== "victory") {
      stopConfetti();
    }
  }

  /* ==================== 11. 智慧干擾項挑選 ==================== */
  function isConflicting(itemA, itemB) {
    if (itemA.id === itemB.id) return true;
    if (itemA.base === itemB.base) return true;
    if (itemA.exclude && itemA.exclude.includes(itemB.id)) return true;
    if (itemB.exclude && itemB.exclude.includes(itemA.id)) return true;
    return false;
  }

  function buildChoices(targetItem, modeKey) {
    const needed = MODE_CONFIG[modeKey].choiceCount;
    if (needed <= 1) return [targetItem];

    const scopePool = DATA.GROUPS[state.scope].items;
    const picked = [targetItem];
    const usedBases = new Set([targetItem.base]);

    // 優先從同範圍挑不同韻母組的圖片；若不足再從全部題庫補足
    const candidatePools = [shuffle(scopePool), shuffle(DATA.ITEMS)];

    for (const pool of candidatePools) {
      for (const candidate of pool) {
        if (picked.length >= needed) break;
        if (usedBases.has(candidate.base)) continue;
        if (picked.some((p) => isConflicting(p, candidate))) continue;

        picked.push(candidate);
        usedBases.add(candidate.base);
      }
      if (picked.length >= needed) break;
    }

    return shuffle(picked);
  }

  /* ==================== 12. 進度星星列 ==================== */
  function renderStarProgress() {
    el.progressPill.textContent = `${state.earnedStars} / ${state.totalTarget} 顆星`;

    if (state.totalTarget <= 10) {
      const slots = [];
      for (let i = 0; i < state.totalTarget; i++) {
        const filled = i < state.earnedStars ? " filled" : "";
        slots.push(`<span class="star-slot${filled}" data-slot="${i}">★</span>`);
      }
      el.starProgressWrap.innerHTML = `<div class="star-slots">${slots.join("")}</div>`;
    } else {
      const pct = Math.round((state.earnedStars / state.totalTarget) * 100);
      el.starProgressWrap.innerHTML = `
        <div class="star-bar-box">
          <span>🚀</span>
          <div class="star-bar-track">
            <div class="star-bar-fill" style="width:${pct}%"></div>
          </div>
          <span>⭐</span>
        </div>
      `;
    }
  }

  function popLatestStarSlot() {
    const slotIdx = state.earnedStars - 1;
    const slot = el.starProgressWrap.querySelector(`.star-slot[data-slot="${slotIdx}"]`);
    if (slot) {
      slot.classList.add("filled", "pop");
      setTimeout(() => slot.classList.remove("pop"), 600);
    }
  }

  /* ==================== 13. 遊戲核心流程 ==================== */
  function startGame() {
    SoundFX.playReveal();

    const pool = shuffle(DATA.GROUPS[state.scope].items);
    const targetCount = state.countChoice === "all"
      ? pool.length
      : Math.min(Number(state.countChoice), pool.length);

    state.queue = pool.slice(0, targetCount);
    state.reservePool = pool.slice(targetCount);
    state.currentIndex = 0;
    state.totalTarget = targetCount;
    state.earnedStars = 0;
    state.completedItems = [];
    state.isSolved = false;
    state.isTransitioning = false;
    state.pairIdx = Math.floor(Math.random() * MASCOT_PAIRS.length);

    el.gameModeBadge.textContent = MODE_CONFIG[state.mode].label;
    el.gameScopeBadge.textContent = DATA.GROUPS[state.scope].shortLabel;
    el.gameArena.dataset.mode = state.mode;

    renderStarProgress();
    showScreen("game");
    loadCurrentQuestion();
  }

  function loadCurrentQuestion() {
    state.currentItem = state.queue[state.currentIndex];
    state.currentChoices = buildChoices(state.currentItem, state.mode);
    state.isSolved = false;
    state.isTransitioning = false;

    // 輪替太空夥伴
    const pair = MASCOT_PAIRS[state.pairIdx % MASCOT_PAIRS.length];
    state.pairIdx++;
    el.mascotLeftSvg.innerHTML = renderMascot(pair[0]);
    el.mascotRightSvg.innerHTML = renderMascot(pair[1]);
    el.matchMascotSvg.innerHTML = renderMascot(pair[0]);

    el.bubbleLeft.textContent = pickRandom(READ_BUBBLES_LEFT);
    el.bubbleRight.textContent = pickRandom(READ_BUBBLES_RIGHT);

    // 切換到階段一（先看結合韻卡片唸讀）
    setPhase("read");

    // 顯示大張結合韻卡片
    el.rhymeCardBig.classList.remove("card-pop");
    void el.rhymeCardBig.offsetWidth;
    el.rhymeCardBig.classList.add("card-pop");

    setImageWithLoader(el.rhymeImgBig, state.currentItem.rhymeImg, "結合韻卡片");
    el.rhymeImgRef.src = state.currentItem.rhymeImg;

    // 趁孩子唸結合韻時，背景預載本題所有選項圖片與下一題結合韻卡片
    const urlsToPreload = state.currentChoices.map((c) => c.wordImg);
    const nextItem = state.queue[state.currentIndex + 1];
    if (nextItem) urlsToPreload.push(nextItem.rhymeImg);
    preloadUrls(urlsToPreload);
  }

  function setPhase(phaseName) {
    state.phase = phaseName;
    el.gameArena.dataset.phase = phaseName;
    el.phaseRead.classList.toggle("active", phaseName === "read");
    el.phaseMatch.classList.toggle("active", phaseName === "match");
  }

  /* 階段一 -> 階段二：展開圖片選項 */
  function revealPictures() {
    if (state.phase !== "read" || state.isTransitioning) return;
    SoundFX.playReveal();

    const modeCfg = MODE_CONFIG[state.mode];
    el.matchGuideText.textContent = modeCfg.guideText;
    el.matchBubble.textContent = modeCfg.matchBubble;
    el.matchMascotMini.classList.remove("cheer");

    renderChoices();
    setPhase("match");

    if (state.mode === "learn") {
      // 學習模式：只有 1 張圖，直接顯示「我認識了！得星星」按鈕
      el.matchStatusHint.hidden = true;
      el.btnNextQuestion.hidden = false;
      const isLast = state.currentIndex >= state.totalTarget - 1;
      el.btnNextLabel.textContent = isLast ? "我認識了！看太空獎盃" : "我認識了！得星星";
    } else {
      // 練習 / 挑戰模式：先讓孩子點圖選答案
      el.matchStatusHint.textContent = "✨ 仔細看圖案，點選和結合韻一樣的答案喔！";
      el.matchStatusHint.hidden = false;
      el.btnNextQuestion.hidden = true;
    }
  }

  function renderChoices() {
    const choices = state.currentChoices;
    el.choicesGrid.innerHTML = "";
    el.choicesGrid.className = `choices-grid count-${choices.length}`;

    choices.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-card";
      btn.dataset.itemId = item.id;
      btn.setAttribute("aria-label", "語詞圖片選項");

      const wrap = document.createElement("span");
      wrap.className = "choice-img-wrap is-loading";

      const loader = document.createElement("span");
      loader.className = "img-loader";
      loader.setAttribute("aria-hidden", "true");

      const img = document.createElement("img");
      img.className = "choice-img";
      img.decoding = "async";

      wrap.appendChild(loader);
      wrap.appendChild(img);
      btn.appendChild(wrap);

      // 狀態印章（答對 / 再試試）
      if (state.mode !== "learn") {
        const badgeOk = document.createElement("span");
        badgeOk.className = "choice-badge badge-correct";
        badgeOk.textContent = "⭐ 答對了";
        btn.appendChild(badgeOk);

        const badgeRetry = document.createElement("span");
        badgeRetry.className = "choice-badge badge-retry";
        badgeRetry.textContent = "再找找看";
        btn.appendChild(badgeRetry);
      }

      setImageWithLoader(img, item.wordImg, item.alt);

      btn.addEventListener("click", () => handleChoiceClick(btn, item));
      el.choicesGrid.appendChild(btn);
    });
  }

  /* 階段一：換一題（不扣星） */
  function swapQuestion() {
    if (state.phase !== "read" || state.isTransitioning) return;
    SoundFX.playSwap();

    const current = state.currentItem;
    let replacement = null;

    if (state.reservePool.length > 0) {
      replacement = state.reservePool.shift();
      state.reservePool.push(current);
    } else if (state.queue.length - state.currentIndex > 1) {
      // 沒有備用題時，將目前題目移到最後
      state.queue.splice(state.currentIndex, 1);
      state.queue.push(current);
      replacement = state.queue[state.currentIndex];
    }

    if (replacement) {
      state.queue[state.currentIndex] = replacement;
      loadCurrentQuestion();
    }
  }

  /* 階段二：點選圖片選項 */
  function handleChoiceClick(cardBtn, item) {
    if (state.phase !== "match" || state.isTransitioning) return;

    // 學習模式點擊圖片：溫柔互動加分感（閃光＋輕快音效）
    if (state.mode === "learn") {
      SoundFX.playClick();
      spawnSparkleBurst(cardBtn);
      el.matchMascotMini.classList.remove("cheer");
      void el.matchMascotMini.offsetWidth;
      el.matchMascotMini.classList.add("cheer");
      return;
    }

    // 已答對則鎖定選項
    if (state.isSolved) return;

    if (item.id === state.currentItem.id) {
      // 答對！
      state.isSolved = true;
      SoundFX.playCorrect();

      const allCards = el.choicesGrid.querySelectorAll(".choice-card");
      allCards.forEach((c) => {
        c.classList.add("is-locked");
        if (c === cardBtn) {
          c.classList.remove("is-wrong");
          c.classList.add("is-correct");
        } else {
          c.classList.add("is-dimmed");
        }
      });

      el.matchBubble.textContent = pickRandom(CHEER_BUBBLES);
      el.matchMascotMini.classList.remove("cheer");
      void el.matchMascotMini.offsetWidth;
      el.matchMascotMini.classList.add("cheer");

      spawnSparkleBurst(cardBtn);
      awardStarFromElement(cardBtn);

      // 顯示「下一題 / 看太空獎盃」，讓老師有充足時間帶孩子一起唸圖卡上的語詞
      const isLast = state.currentIndex >= state.totalTarget - 1;
      el.matchStatusHint.hidden = true;
      el.btnNextLabel.textContent = isLast ? "太棒了！看太空獎盃" : "太棒了！下一題";
      el.btnNextQuestion.hidden = false;
    } else {
      // 溫和鼓勵再試一次（不扣星）
      SoundFX.playWrong();
      cardBtn.classList.remove("is-wrong");
      void cardBtn.offsetWidth;
      cardBtn.classList.add("is-wrong");
      el.matchBubble.textContent = pickRandom(RETRY_BUBBLES);
    }
  }

  /* 給予一顆星星並執行飛星動畫 */
  function awardStarFromElement(sourceEl, onComplete) {
    state.earnedStars = Math.min(state.earnedStars + 1, state.totalTarget);
    state.completedItems.push(state.currentItem);

    launchFlyingStar(sourceEl, () => {
      renderStarProgress();
      popLatestStarSlot();
      SoundFX.playStarLand();
      if (onComplete) onComplete();
    });
  }

  /* 階段二底部「下一題 / 我認識了」按鈕 */
  function handleNextQuestion() {
    if (state.phase !== "match" || state.isTransitioning) return;

    if (state.mode === "learn") {
      // 學習模式點擊後先飛星星慶祝，再進入下一題
      state.isTransitioning = true;
      SoundFX.playCorrect();
      const learnCard = el.choicesGrid.querySelector(".choice-card");
      if (learnCard) {
        learnCard.classList.add("is-correct");
        spawnSparkleBurst(learnCard);
      }
      el.btnNextQuestion.hidden = true;

      awardStarFromElement(learnCard || el.btnNextQuestion, () => {
        setTimeout(() => {
          advanceOrFinish();
        }, 260);
      });
      return;
    }

    if (!state.isSolved) return;
    SoundFX.playClick();
    advanceOrFinish();
  }

  function advanceOrFinish() {
    state.currentIndex += 1;
    if (state.currentIndex >= state.totalTarget) {
      showVictoryScreen();
    } else {
      loadCurrentQuestion();
    }
  }

  /* ==================== 14. 飛星與星光粒子特效 ==================== */
  function getStageCoords(element) {
    const stageRect = el.stage.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const scaleX = 1280 / stageRect.width;
    const scaleY = 720 / stageRect.height;
    return {
      x: (rect.left - stageRect.left + rect.width / 2) * scaleX,
      y: (rect.top - stageRect.top + rect.height / 2) * scaleY
    };
  }

  function launchFlyingStar(sourceEl, onLand) {
    const start = sourceEl ? getStageCoords(sourceEl) : { x: 640, y: 420 };

    const targetSlot = el.starProgressWrap.querySelector(`.star-slot[data-slot="${state.earnedStars - 1}"]`)
      || el.starProgressWrap;
    const end = getStageCoords(targetSlot);

    const star = document.createElement("div");
    star.className = "flying-star";
    star.textContent = "⭐";
    star.style.left = `${start.x - 23}px`;
    star.style.top = `${start.y - 23}px`;
    el.fxLayer.appendChild(star);

    requestAnimationFrame(() => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      star.style.transform = `translate(${dx}px, ${dy}px) scale(0.55) rotate(220deg)`;
      star.style.opacity = "0.2";
    });

    setTimeout(() => {
      star.remove();
      if (onLand) onLand();
    }, 660);
  }

  function spawnSparkleBurst(sourceEl) {
    const center = getStageCoords(sourceEl);
    const icons = ["✦", "⭐", "✨", "🌟"];
    for (let i = 0; i < 10; i++) {
      const sp = document.createElement("div");
      sp.className = "sparkle-burst";
      sp.textContent = icons[i % icons.length];
      const angle = (Math.PI * 2 * i) / 10 + (Math.random() - 0.5) * 0.35;
      const dist = 70 + Math.random() * 85;
      sp.style.left = `${center.x - 12}px`;
      sp.style.top = `${center.y - 12}px`;
      sp.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      sp.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      el.fxLayer.appendChild(sp);
      setTimeout(() => sp.remove(), 750);
    }
  }

  /* ==================== 15. 過關頒獎與太空彩帶 ==================== */
  function showVictoryScreen() {
    state.isTransitioning = false;
    SoundFX.playVictory();

    const modeName = MODE_CONFIG[state.mode].plainLabel;
    const scopeName = DATA.GROUPS[state.scope].label;
    el.victoryTitle.textContent = `太棒了！集滿 ${state.totalTarget} 顆太空星星！`;
    el.victorySubtitle.textContent = `${modeName}・${scopeName} 探險成功，太空夥伴都為你拍拍手！`;

    // 四位太空夥伴大集合
    el.victoryMascots.innerHTML = ["astroBear", "astroBunny", "astroCat", "spaceAlien"]
      .map((key) => `<div class="victory-mascot-item">${renderMascot(key)}</div>`)
      .join("");

    // 本回合複習小圖卡總覽（點擊可放大）
    el.reviewGrid.innerHTML = "";
    state.completedItems.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "review-pair-btn";
      btn.title = "點一下放大複習";
      btn.innerHTML = `
        <img class="review-thumb" src="${item.rhymeImg}" alt="結合韻" decoding="async" />
        <span class="review-arrow">➜</span>
        <img class="review-thumb" src="${item.wordImg}" alt="${item.alt}" decoding="async" />
      `;
      btn.addEventListener("click", () => {
        SoundFX.playClick();
        openZoomPair(item);
      });
      el.reviewGrid.appendChild(btn);
    });

    showScreen("victory");
    startConfetti();
  }

  let confettiReqId = null;
  let confettiPieces = [];

  function startConfetti() {
    stopConfetti();
    const ctx = el.confettiCanvas.getContext("2d");
    const colors = ["#FFD84D", "#5AE2FF", "#4CE095", "#FF876F", "#C29BFF", "#FFF4B8"];
    confettiPieces = Array.from({ length: 90 }, () => ({
      x: Math.random() * 1280,
      y: -20 - Math.random() * 420,
      w: 9 + Math.random() * 9,
      h: 6 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 2.2,
      vy: 2.0 + Math.random() * 2.7,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.14,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    function draw() {
      ctx.clearRect(0, 0, 1280, 720);
      for (const p of confettiPieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        if (p.y > 740) {
          p.y = -20;
          p.x = Math.random() * 1280;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      confettiReqId = requestAnimationFrame(draw);
    }

    confettiReqId = requestAnimationFrame(draw);
  }

  function stopConfetti() {
    if (confettiReqId) {
      cancelAnimationFrame(confettiReqId);
      confettiReqId = null;
    }
    const ctx = el.confettiCanvas.getContext("2d");
    ctx.clearRect(0, 0, 1280, 720);
  }

  /* ==================== 16. 彈窗（返回確認 & 圖卡放大） ==================== */
  function openConfirmModal() {
    SoundFX.playClick();
    if (state.earnedStars === 0) {
      showScreen("home");
      return;
    }
    el.modalConfirm.hidden = false;
  }

  function closeConfirmModal() {
    SoundFX.playClick();
    el.modalConfirm.hidden = true;
  }

  function openZoomSingle(imgUrl) {
    el.zoomContent.innerHTML = `<img class="zoom-img-single" src="${imgUrl}" alt="結合韻放大圖卡" />`;
    el.modalZoom.hidden = false;
  }

  function openZoomPair(item) {
    el.zoomContent.innerHTML = `
      <img class="zoom-img-pair" src="${item.rhymeImg}" alt="結合韻卡片" />
      <span class="zoom-pair-arrow">➜</span>
      <img class="zoom-img-pair" src="${item.wordImg}" alt="${item.alt}" />
    `;
    el.modalZoom.hidden = false;
  }

  function closeZoomModal() {
    SoundFX.playClick();
    el.modalZoom.hidden = true;
  }

  /* ==================== 17. 事件綁定與鍵盤快捷鍵 ==================== */
  el.btnStart.addEventListener("click", startGame);
  el.rhymeCardBig.addEventListener("click", revealPictures);
  el.btnRevealPics.addEventListener("click", revealPictures);
  el.btnSwapQuestion.addEventListener("click", swapQuestion);
  el.btnNextQuestion.addEventListener("click", handleNextQuestion);

  el.rhymeRefCard.addEventListener("click", () => {
    if (!state.currentItem) return;
    SoundFX.playClick();
    openZoomSingle(state.currentItem.rhymeImg);
  });

  el.btnBackHome.addEventListener("click", openConfirmModal);
  el.btnModalCancel.addEventListener("click", closeConfirmModal);
  el.btnModalOk.addEventListener("click", () => {
    SoundFX.playClick();
    el.modalConfirm.hidden = true;
    showScreen("home");
  });

  el.btnZoomClose.addEventListener("click", closeZoomModal);
  el.modalZoom.addEventListener("click", (e) => {
    if (e.target === el.modalZoom) closeZoomModal();
  });

  el.btnPlayAgain.addEventListener("click", startGame);
  el.btnVictoryHome.addEventListener("click", () => {
    SoundFX.playClick();
    showScreen("home");
  });

  el.soundBtns.forEach((b) => b.addEventListener("click", toggleSound));
  el.fullscreenBtns.forEach((b) => b.addEventListener("click", toggleFullscreen));
  el.btnFontHome.addEventListener("click", toggleFont);
  el.btnFontGame.addEventListener("click", toggleFont);

  // 鍵盤與白板簡報筆快捷鍵
  document.addEventListener("keydown", (e) => {
    if (!el.modalZoom.hidden) {
      if (e.code === "Escape" || e.code === "Space") {
        e.preventDefault();
        closeZoomModal();
      }
      return;
    }

    if (!el.modalConfirm.hidden) {
      if (e.code === "Escape") closeConfirmModal();
      return;
    }

    if (e.code === "KeyM") {
      toggleSound();
      return;
    }
    if (e.code === "KeyF") {
      toggleFullscreen();
      return;
    }

    if (state.screen === "game") {
      if (state.phase === "read") {
        if (e.code === "Space" || e.code === "Enter" || e.code === "ArrowRight") {
          e.preventDefault();
          revealPictures();
        } else if (e.code === "ArrowLeft" || e.code === "KeyR") {
          e.preventDefault();
          swapQuestion();
        }
      } else if (state.phase === "match") {
        if ((e.code === "Space" || e.code === "Enter" || e.code === "ArrowRight") && !el.btnNextQuestion.hidden) {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    } else if (state.screen === "victory") {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        startGame();
      }
    }
  });

  /* ==================== 18. 初始啟動 ==================== */
  el.homeMascotLeft.innerHTML = renderMascot("astroBear");
  el.homeMascotRight.innerHTML = renderMascot("astroBunny");
  updateCountOptions();
  updateStageScale();
})();
