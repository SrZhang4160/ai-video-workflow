// Drama v2 (series/system-design/PIPELINE.md): builds window.EPISODE from window.STORYBOARD (written by engine/storyboard.py).
// Live shots play their clip (picture + the shot's own dialogue/SFX audio); dialogue subtitles carry the speaker's name;
// overlays (calc, diagrams, alarms) are drawn here so every number is exact. Cards (time, cheat sheet, next episode, quiz)
// are engine-only; time cards and the quiz are narrated in the user's cloned voice.
(() => {
  const SB = window.STORYBOARD, QUIZ = window.QUIZ || {};
  const NAME = {man: ['小满', 'Xiaoman'], kai: ['铁柱', 'Tiezhu'], wang: ['王总', 'Wang'], oncall: ['值班工程师', 'On-call']};
  const cjk = (s) => /[一-鿿]/.test(s || '');
  const L = (o) => o == null ? '' : typeof o === 'string' ? o : T(o.zh, o.en);
  const panel = (inner, y = 500, h = 340, border = 'var(--acc)') =>
    `<div class="r card" data-live="1" data-in="pop" style="left:20px;right:20px;top:${y}px;height:${h}px;padding:22px 30px;background:rgba(14,10,18,.84);border-color:${border};display:flex;flex-direction:column;justify-content:center;gap:12px">${inner}</div>`;
  const line = (t, size, color = 'var(--ink)') => `<div class="mono" style="font-size:${size}px;font-weight:800;color:${color};line-height:1.25">${esc(t)}</div>`;
  const tag = (t, color = 'var(--acc)') => `<div style="font-size:26px;font-weight:800;color:${color}">${esc(t)}</div>`;

  function overlay(sh) {
    const o = sh.overlay; if (!o) return;
    const c = o.content || {}, live = sh.gen.mode === 'live';
    if (o.kind === 'calc') {
      let h = '';
      if (c.tag) h += tag(L(c.tag), 'var(--quiet)');
      if (c.title) h += tag(L(c.title));
      if (c.dashboard) h += `<div style="display:flex;align-items:center;gap:14px"><svg width="220" height="40"><path d="M4 30H216" stroke="#5BE7C4" stroke-width="5" stroke-dasharray="12 8"/></svg><span style="font-size:24px;color:var(--quiet)">${esc(L(c.dashboard))}</span></div>`;
      (c.lines || []).forEach((l, i) => { h += line(L(l), T(40, 32), i === (c.lines.length - 1) ? 'var(--acc)' : 'var(--ink)'); });
      if (c.compare) h += line(L(c.compare), T(34, 28), 'var(--red)');
      if (c.assumption) h += `<div style="font-size:24px;color:var(--yel);font-weight:700">${esc(L(c.assumption))}</div>`;
      const n = (c.lines || []).length + !!c.compare + !!c.assumption + !!c.tag + !!c.title + !!c.dashboard;
      H(panel(h, 860 - Math.min(380, 70 + n * 58), Math.min(380, 70 + n * 58)));
      st.lastElementChild.dataset.delay = '0.4';
    } else if (o.kind === 'diagram' && c.type === 'traffic_curve') {
      H(panel(`<svg width="880" height="250" viewBox="0 0 880 250">
        <path d="M30 220H860M30 220V10" stroke="#8B7B99" stroke-width="3"/>
        <path d="M30 190H860" stroke="#5BE7C4" stroke-width="5" stroke-dasharray="12 8"/>
        <text x="40" y="176" font-family="Noto Sans SC" font-size="26" font-weight="700" fill="#5BE7C4">${esc(L(c.flat_line))}</text>
        <path d="M30 212C380 212 420 212 460 200C480 30 510 22 545 30C580 190 620 208 860 212" stroke="#FF5A5F" stroke-width="7" fill="none"/>
        <text x="${T(570, 570)}" y="60" font-family="Noto Sans SC" font-size="28" font-weight="800" fill="#FF5A5F">${esc(L(c.spike))}</text>
      </svg>`, 540, 300));
      st.lastElementChild.dataset.delay = '0.6';
    } else if (o.kind === 'diagram' && c.type === 'cost_compare') {
      H(panel(`<div style="font-size:22px;color:var(--quiet)">${esc(L(c.label))}</div>
        <div style="display:flex;gap:16px">
          <div class="card" style="flex:1;padding:14px;border-color:var(--acc2);font-size:${T(28, 22)}px;font-weight:800">${esc(L(c.left))}</div>
          <div class="card" style="flex:1;padding:14px;border-color:var(--red);font-size:${T(28, 22)}px;font-weight:800">${esc(L(c.right))}</div></div>
        <div style="font-size:${T(32, 26)}px;font-weight:900;color:var(--acc)">${esc(L(c.verdict))}</div>`, 470, 370));
      st.lastElementChild.dataset.delay = '0.6';
    } else if (o.kind === 'card' && c.style === 'alarm') {
      (c.lines || []).forEach((l, i) => { H(alarm(l.zh, l.en, {x: 0, y: 20 + i * 96, w: 960, size: T(30, 24), attrs: `data-live="1" data-in="drop" data-shake="1" data-delay="${0.3 + i * 0.6}"`})); });
    } else if (o.kind === 'card' && c.style === 'quiz') {
      H(`<div class="r card center" style="left:0;right:0;top:10px;height:110px"><span class="h acc" style="font-size:52px">${T('考考你', 'Quick quiz')}</span></div>`);
      H(`<div class="r card" style="left:0;right:0;top:150px;height:330px;padding:34px;font-size:${T(40, 34)}px;font-weight:800;line-height:1.6">${esc(T(c.q_zh, c.q_en)).replace(/[？?]\s*(A)/, '？<br>$1')}</div>`);
      H(`<div class="r card center" data-cap="2" data-in="pop" style="left:60px;width:390px;top:530px;height:150px;border-color:var(--blue)"><span class="h mono" style="font-size:52px">A · ${T('1 万', '10,000')}</span></div>`);
      H(`<div class="r card center" data-cap="2" data-delay="0.3" data-in="pop" style="left:510px;width:390px;top:530px;height:150px;border-color:var(--blue)"><span class="h mono" style="font-size:52px">B · ${T('10 万', '100,000')}</span></div>`);
      H(`<div class="r center" data-cap="2" data-delay="0.8" style="left:0;right:0;top:730px;height:80px;font-size:34px;font-weight:800;color:var(--quiet)">${T('答案评论区见 👇', 'Answer in the comments 👇')}</div>`);
    } else if (o.kind === 'card' && c.steps) {
      H(`<div class="r card" style="left:0;right:0;top:0;height:880px;border-color:var(--acc);border-width:3px"></div>`);
      H(`<div class="r" style="left:40px;right:40px;top:30px;font-size:${T(44, 36)}px;font-weight:900;color:var(--acc)">${esc(L(c.title))}</div>`);
      c.steps.forEach((s, i) => H(`<div class="r" data-in="left" data-delay="${0.4 + i * 0.7}" style="left:40px;right:40px;top:${130 + i * 150}px;font-size:${T(34, 28)}px;font-weight:800;line-height:1.35">${esc(L(s))}</div>`));
      (c.notes || []).forEach((s, i) => H(`<div class="r" data-delay="${2.6 + i * 0.5}" style="left:40px;right:40px;top:${590 + i * 80}px;font-size:${T(30, 24)}px;font-weight:700;color:var(--red)">${esc(L(s))}</div>`));
      if (c.footnote) H(`<div class="r" style="left:40px;right:40px;top:800px;font-size:22px;color:var(--quiet)">${esc(L(c.footnote))}</div>`);
    } else if (o.kind === 'card' && (c.zh || c.en)) {   // time card / next-episode card
      H(`<div class="r center" data-in="zoom" style="left:0;right:0;top:300px;height:200px;flex-direction:column;gap:18px"><span style="font-size:${T(72, 60)}px;font-weight:900;letter-spacing:4px">${esc(L(c))}</span>${c.sub ? `<span style="font-size:34px;color:var(--acc);font-weight:800">${esc(L(c.sub))}</span>` : ''}</div>`);
    }
  }

  // caption start times inside a live shot: lines spread by length, the first starting at 0.25 s
  const capAt = (sh) => {
    const ls = sh.dialogue || []; if (!ls.length) return [];
    const total = ls.reduce((a, d) => a + d.zh.length, 0), span = Math.max(0.5, sh.seconds - 0.6);
    let t = 0.25; return ls.map(d => { const at = t; t += span * d.zh.length / total; return +at.toFixed(2); });
  };

  window.EPISODE = {
    n: SB.episode, theme: 'drama',
    scenes: SB.shots.map(sh => {
      const live = sh.gen.mode === 'live', o = sh.overlay || {}, c = o.content || {};
      const scene = {title: ['', ''], build() { overlay(sh); }};
      if (live) {
        Object.assign(scene, {clip: `clips/shot${String(sh.id).padStart(2, '0')}.mp4`, audio: 'clip', seconds: sh.seconds, cap_at: capAt(sh),
          grade: c.style === 'flashback_grade' ? 'flashback' : null,
          cap: (sh.dialogue || []).map(d => ({zh: `${NAME[d.who][0]}：${d.zh}`, en: `${NAME[d.who][1]}: ${d.en}`, say_zh: '', say_en: ''}))});
      } else if (c.style === 'quiz') {
        scene.cap = [{zh: '考考你：一百万人一分钟内涌进来，', en: 'Quick quiz: a million people arrive in one minute,'},
                     {zh: '每人六次，峰值 QPS 约多少？', en: 'six requests each. Roughly what is the peak QPS?', say_zh: '每人六次，峰值 Q P S 约多少？', say_en: 'six requests each. Roughly what is the peak Q P S?'},
                     {zh: 'A 一万，B 十万？评论区告诉我。', en: 'A: 10,000, or B: 100,000? Tell me in the comments.', say_zh: 'A，一万；B，十万？评论区告诉我。', say_en: 'A, ten thousand, or B, a hundred thousand? Tell me in the comments.'}];
      } else if (sh.narration) {
        const n = sh.narration;
        scene.cap = [{zh: n.zh, en: n.en, say_en: n.say_en || n.en.replace(/\b12\b/, 'Twelve')}];
      } else {
        Object.assign(scene, {cap: [], seconds: sh.seconds});
      }
      return scene;
    }),
  };
})();
