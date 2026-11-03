// 系统设计 第 3 课 · 估算入门：QPS 怎么算（日活 × 次数 ÷ 86400）
const box3 = (x, y, w, h, inner, color = 'var(--line)', extra = '') =>
  `<div class="r card center" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;flex-direction:column;border-color:${color};${extra}">${inner}</div>`;
const lbl = (zh, en, size = 24) => `<div class="s" style="font-size:${size}px;margin-top:6px;text-align:center">${T(zh, en)}</div>`;
const est = () => `<span style="display:inline-block;font-size:24px;font-weight:800;color:var(--yel);border:2px solid var(--yel);border-radius:10px;padding:2px 12px">${T('估算', 'estimate')}</span>`;

window.EPISODE = {
  n: 3,
  scenes: [
    { title: ['一亿日活，QPS 多少？', '100M daily users: what QPS?'],
      cap: [{zh: '面试官问：一亿日活，QPS 多少？', en: 'Interviewer: 100 million daily users. What QPS?',
             say_zh: '面试官问：一亿日活，Q P S 多少？', say_en: 'The interviewer asks: one hundred million daily users. What is the Q P S?'},
            {zh: 'QPS 就是每秒请求数。', en: 'QPS means queries per second.',
             say_zh: 'Q P S，就是每秒的请求数。', say_en: 'Q P S means queries per second.'},
            {zh: '其实就一个公式，半分钟算完。', en: "It's one formula. Done in 30 seconds.",
             say_en: "It's one formula. Done in thirty seconds."}],
      build() {
        H(box3(0, 60, 400, 320, `<div style="display:flex;gap:6px">${icon('user', 70, 'var(--blue)')}${icon('user', 70, 'var(--blue)')}${icon('user', 70, 'var(--blue)')}</div>
          <div class="h" style="font-size:56px;margin-top:18px">${T('1 亿', '100M')}</div>${lbl('日活用户 DAU', 'daily active users', 28)}`, 'var(--blue)')).dataset.cap = 0;
        const a = H(`<svg class="r" data-cap="0" data-delay="0.6" data-in="left" style="left:420px;top:200px" width="120" height="40"><path d="M2 20H104" stroke="#4A5160" stroke-width="5" stroke-linecap="round"/><path d="M96 6l18 14-18 14" fill="none" stroke="#4A5160" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
        const q = H(box3(560, 60, 400, 320, `<div class="h acc" style="font-size:150px;line-height:1">?</div><div class="h mono" style="font-size:44px;margin-top:10px">QPS</div>`, 'var(--acc)'));
        q.dataset.cap = 0; q.dataset.delay = '1.0'; q.dataset.in = 'pop';
        H(`<div class="r card center" data-cap="1" style="left:0;right:0;top:440px;height:130px;gap:20px">
          <span class="h mono acc" style="font-size:44px">QPS</span><span class="h" style="font-size:40px">=</span>
          <span class="h" style="font-size:38px">${T('每秒请求数', 'queries per second')}</span></div>`);
        H(`<div class="r center" data-cap="2" data-in="stamp" style="left:0;right:0;top:640px;gap:20px">${icon('clock', 80, 'var(--acc2)')}
          <span class="h ok" style="font-size:48px">${T('一个公式 · 30 秒', '1 formula · 30 seconds')}</span></div>`);
      } },

    { title: ['公式：日活 × 次数 ÷ 86400', 'The formula'],
      cap: [{zh: '先算一天总请求：日活×每人次数。', en: 'First, requests per day: daily users × requests each.',
             say_zh: '先算一天总请求：日活乘每人次数。', say_en: 'First, requests per day: daily users times requests per user.'},
            {zh: '再除以一天的秒数：86400。', en: 'Then divide by the seconds in a day: 86,400.',
             say_zh: '然后，除以一天的秒数：八万六千四百。', say_en: 'Then divide by the seconds in a day: eighty-six thousand four hundred.'}],
      build() {
        const term = (x, w, big, zh, en, c, cap, d) => {
          const e = H(box3(x, 40, w, 200, `<div class="h mono" style="font-size:40px;color:${c}">${big}</div>${lbl(zh, en, 24)}`, c));
          e.dataset.cap = cap; if (d) e.dataset.delay = d;
        };
        const op = (x, s, cap, d) => H(`<div class="r h acc" data-cap="${cap}" ${d ? `data-delay="${d}"` : ''} data-in="pop" style="left:${x}px;top:105px;width:40px;text-align:center;font-size:52px">${s}</div>`);
        term(0, 200, T('日活', 'DAU'), '每天活跃用户', 'daily users', 'var(--blue)', 0);
        op(205, '×', 0, 0.5);
        term(250, 200, T('次数', 'req'), '每人每天', 'per user / day', 'var(--blue)', 0, 0.8);
        op(455, '÷', 1);
        term(500, 200, '86400', '一天的秒数', 'sec / day', 'var(--yel)', 1, 0.4);
        op(705, '=', 1, 1.0);
        term(750, 210, T('平均', 'avg'), '平均 QPS', 'average QPS', 'var(--acc)', 1, 1.3);
        H(`<div class="r" data-cap="0" data-delay="1.4" style="left:0;width:450px;top:270px;height:16px;border:4px solid var(--blue);border-top:none;border-radius:0 0 14px 14px"></div>`);
        H(`<div class="r s" data-cap="0" data-delay="1.4" style="left:0;width:450px;top:300px;text-align:center">${T('= 一天的总请求数', '= requests per day')}</div>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="1.8" style="left:60px;right:60px;top:440px;height:220px;flex-direction:column;gap:14px;border-color:var(--yel)">
          <div style="font-size:44px"><span class="nu">24</span> <span class="q">h</span> × <span class="nu">60</span> <span class="q">min</span> × <span class="nu">60</span> <span class="q">s</span></div>
          <div style="font-size:56px;font-weight:800">= <span class="yel">86400</span> <span class="q" style="font-size:32px">${T('秒/天', 's/day')}</span></div></div>`);
      } },

    { title: ['代入算一遍', 'Plug in the numbers'],
      cap: [{zh: '一亿日活，每人十次，一天十亿次。', en: '100M users × 10 requests = 1 billion a day.',
             say_en: 'Say one hundred million users, ten requests each: one billion a day.'},
            {zh: '除以86400，约1.2万QPS。', en: 'Divide by 86,400: about 12,000 QPS.',
             say_zh: '除以八万六千四百，约一万二 Q P S。', say_en: 'Divide by eighty-six thousand four hundred: about twelve thousand Q P S.'},
            {zh: '这是估算，不求精确。', en: "It's an estimate, not an exact number."}],
      build() {
        const row = (y, cap, l, r, c = 'var(--ink)') => H(`<div class="r mono" data-cap="${cap}" data-in="left" style="left:40px;right:40px;top:${y}px;font-size:44px;display:flex;justify-content:space-between;align-items:baseline"><span>${l}</span><span style="color:${c};font-weight:800">${r}</span></div>`);
        H(`<div class="r card" style="left:0;right:0;top:20px;height:600px"></div>`);
        row(60, 0, T('日活', 'DAU'), T('1 亿', '100M'), 'var(--blue)');
        row(140, 0, T('× 每人次数', '× req / user'), '10', 'var(--blue)');
        H(`<div class="r" data-cap="0" data-delay="1.2" style="left:40px;right:40px;top:225px;border-top:3px dashed var(--line)"></div>`);
        row(250, 0, T('= 每天请求', '= req / day'), T('10 亿', '1B'));
        row(340, 1, '÷ 86400', '≈ 11574', 'var(--yel)');
        H(`<div class="r card center" data-cap="1" data-delay="1.2" data-in="pop" style="left:120px;right:120px;top:450px;height:130px;gap:24px;border-color:var(--acc);border-width:4px">
          <span class="h acc" style="font-size:60px">≈ ${T('1.2 万', '12K')}</span><span class="h mono" style="font-size:40px">QPS</span></div>`);
        H(`<div class="r center" data-cap="2" data-in="stamp" style="left:0;right:0;top:680px;gap:16px">${est()}<span class="s">${T('数量级对就行，不求精确', 'Right order of magnitude, not exact')}</span></div>`);
      } },

    { title: ['心算技巧：一天约 10 万秒', 'Shortcut: a day ≈ 100K seconds'],
      cap: [{zh: '心算时，把86400当成10万。', en: 'For mental math, round 86,400 up to 100,000.',
             say_zh: '心算时，把八万六千四百当成十万。', say_en: 'For mental math, round eighty-six thousand four hundred up to one hundred thousand.'},
            {zh: '十亿除以十万是一万，略低但量级对。', en: '1B ÷ 100K = 10K. A bit low, but the right order.', say_zh: '十亿除以十万，是一万。偏低一点，但量级对。',
             say_en: 'One billion divided by one hundred thousand is ten thousand. A bit low, but the right order of magnitude.'}],
      build() {
        H(`<div class="r card mono center" data-cap="0" style="left:0;right:0;top:30px;height:170px;gap:30px">
          <span style="font-size:60px;font-weight:800" class="yel">86400</span><span class="acc" style="font-size:60px;font-weight:800">≈</span>
          <span style="font-size:60px;font-weight:800">${T('10 万', '100,000')}</span></div>`);
        H(`<div class="r card mono center" data-cap="1" style="left:0;right:0;top:240px;height:150px;font-size:46px;font-weight:800">${T('10 亿 ÷ 10 万 = <span class="acc">&nbsp;1 万</span>', '1B ÷ 100K = <span class="acc">&nbsp;10K</span>')}</div>`);
        const bar = (y, w, c, zh, en, val, cap, d) => H(`<div class="r" data-cap="${cap}" ${d ? `data-delay="${d}"` : ''} data-in="left" style="left:0;right:0;top:${y}px;height:80px">
          <div class="s" style="position:absolute;left:0;top:18px;width:210px">${T(zh, en)}</div>
          <div style="position:absolute;left:220px;top:10px;width:${w}px;height:60px;border-radius:12px;background:${c}"></div>
          <div class="mono" style="position:absolute;left:${236 + w}px;top:14px;font-size:36px;font-weight:800">${val}</div></div>`);
        bar(450, 520, 'var(--blue)', '精确', 'Exact', T('1.16 万', '11.6K'), 1, 1.0);
        bar(550, 450, 'var(--acc)', '心算', 'Shortcut', T('1 万', '10K'), 1, 1.4);
        H(`<div class="r center" data-cap="1" data-delay="2.6" data-in="stamp" style="left:0;right:0;top:680px;gap:16px">${icon('check', 60, 'var(--acc2)')}<span class="h ok" style="font-size:40px">${T('量级对了', 'Same order of magnitude')}</span></div>`);
      } },

    { title: ['平均 vs 峰值', 'Average vs peak'],
      cap: [{zh: '流量不是平的：半夜少，晚上多。', en: 'But traffic is not flat: quiet at night, busy in the evening.'},
            {zh: '常用的经验法则：峰值≈平均2~3倍。', en: 'Rule of thumb: peak ≈ 2–3× the average.',
             say_zh: '常用的经验法则：峰值约是平均的两到三倍。', say_en: 'A common rule of thumb: peak is about two to three times the average.'},
            {zh: '所以峰值约2.4万到3.6万。', en: 'So peak is about 24K to 36K QPS.',
             say_zh: '所以峰值大约两万四，到三万六。', say_en: 'So the peak is about twenty-four to thirty-six thousand Q P S.'}],
      build() {
        // 24h curve, x: 90..900 (0h..24h), y: 560 (0) .. 80 (high). avg line at y=400.
        H(`<div class="r card" style="left:0;right:0;top:10px;height:640px"></div>`);
        H(`<svg class="r" data-cap="0" style="left:0;top:10px" width="960" height="640">
          <line x1="90" y1="560" x2="910" y2="560" stroke="#4A5160" stroke-width="3"/>
          <text x="90" y="605" fill="#8B93A3" font-size="26" text-anchor="middle" font-family="Noto Sans SC">0${T('点', 'h')}</text>
          <text x="292" y="605" fill="#8B93A3" font-size="26" text-anchor="middle" font-family="Noto Sans SC">6</text>
          <text x="495" y="605" fill="#8B93A3" font-size="26" text-anchor="middle" font-family="Noto Sans SC">12</text>
          <text x="697" y="605" fill="#8B93A3" font-size="26" text-anchor="middle" font-family="Noto Sans SC">18</text>
          <text x="900" y="605" fill="#8B93A3" font-size="26" text-anchor="middle" font-family="Noto Sans SC">24</text>
          <path d="M90 470 C150 520 220 545 292 540 C360 535 400 420 495 380 C570 350 620 360 697 300 C750 250 780 150 810 150 C850 150 870 400 910 450" fill="none" stroke="#5AA9FF" stroke-width="6" stroke-linecap="round"/></svg>`);
        H(`<div class="r center" data-cap="0" data-delay="1.0" data-in="pop" style="left:180px;top:470px;gap:8px;font-size:26px;color:var(--quiet)">${T('🌙 半夜低', '🌙 low at night')}</div>`);
        H(`<svg class="r" data-cap="1" data-in="left" style="left:90px;top:385px" width="820" height="10"><line x1="0" y1="5" x2="820" y2="5" stroke="#8B93A3" stroke-width="3" stroke-dasharray="12 10"/></svg>`);
        H(`<div class="r s" data-cap="1" style="left:100px;top:330px">${T('平均 1.2 万', 'avg 12K')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.8" data-in="pop" style="left:790px;top:148px;width:40px;height:40px;border-radius:50%;background:var(--acc);box-shadow:0 0 0 12px rgba(255,138,76,.25)"></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="1.0" style="left:470px;top:80px;width:300px;text-align:right;font-size:40px">${T('峰值 ≈ 2~3×', 'peak ≈ 2–3×')}</div>`);
        H(`<div class="r card center" data-cap="2" style="left:0;right:0;top:690px;height:130px;gap:20px;border-color:var(--acc)">
          <span class="h mono" style="font-size:40px">${T('1.2 万 × 2~3', '12K × 2–3')} ≈</span><span class="h acc mono" style="font-size:46px">${T('2.4~3.6 万', '24K–36K')}</span>${est()}</div>`);
      } },

    { title: ['机器按峰值准备', 'Plan capacity for the peak'],
      cap: [{zh: '只按平均备机器，高峰就扛不住。', en: 'Size for the average, and the peak takes you down.', say_zh: '如果只按平均来准备机器，高峰就扛不住。'},
            {zh: '按峰值备，代价是平时机器闲着。', en: 'Size for the peak. The cost: idle servers off-peak.', say_zh: '按峰值来准备，代价是平时机器闲着。'}],
      build() {
        const side = (x, c, ic, zh, en, n, zh2, en2, cap) => {
          const e = H(`<div class="r card" style="left:${x}px;top:30px;width:460px;height:470px;padding:30px;text-align:center;border-color:${c}">
            <div class="h" style="font-size:36px">${T(zh, en)}</div>
            <div class="mono" style="font-size:54px;font-weight:800;color:${c};margin-top:30px">${n}</div><div class="s">QPS</div>
            <div style="margin-top:30px">${icon(ic, 90, c)}</div>
            <div class="s" style="margin-top:14px;color:${c}">${T(zh2, en2)}</div></div>`);
          e.dataset.cap = cap;
          return e;
        };
        side(0, 'var(--red)', 'boom', '按平均准备', 'Sized for average', T('1.2 万', '12K'), '高峰被打挂', 'Falls over at peak', 0).dataset.shake = '1';
        side(500, 'var(--acc2)', 'shield', '按峰值准备', 'Sized for peak', T('3.6 万', '36K'), '高峰也扛得住', 'Survives the peak', 1);
        H(`<div class="r card center" data-cap="1" data-delay="1.2" style="left:0;right:0;top:560px;height:150px;gap:24px;border-color:var(--yel)">
          ${icon('gear', 70, 'var(--quiet)')}<div><div class="h yel" style="font-size:36px">${T('代价：平时机器闲着', 'Trade-off: idle servers off-peak')}</div>
          <div class="s">${T('多花钱，换高峰不挂', 'Pay more to stay up at peak')}</div></div></div>`);
      } },

    { title: ['一张图总结', 'One-picture summary'],
      cap: [{zh: '日活×次数÷86400，得平均。', en: 'Daily users × requests ÷ 86,400 = average QPS.',
             say_zh: '日活乘次数，除以八万六千四百，得平均。',
             say_en: 'To sum up: daily users times requests, divided by eighty-six thousand four hundred, is the average Q P S.'},
            {zh: '再乘二到三是峰值。截图存好！', en: 'Multiply by 2 to 3 for the peak. Save this one!',
             say_en: 'Multiply by two to three for the peak. Save this one!'}],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:20px;height:200px;padding:28px 36px;border-color:var(--acc)">
          <div class="s">${T('① 平均 QPS', '① Average QPS')}</div>
          <div class="h mono" style="font-size:42px;margin-top:16px">${T('日活 × 次数 ÷ <span class="yel">86400</span>', 'DAU × req ÷ <span class="yel">86400</span>')}</div></div>`);
        H(`<div class="r card" data-cap="0" data-delay="1.2" style="left:0;width:460px;top:250px;height:170px;padding:26px 30px">
          <div class="s">${T('心算', 'Shortcut')}</div><div class="h mono" style="font-size:40px;margin-top:14px">86400 ≈ ${T('10 万', '100K')}</div></div>`);
        H(`<div class="r card" data-cap="1" style="left:500px;width:460px;top:250px;height:170px;padding:26px 30px;border-color:var(--acc)">
          <div class="s">${T('② 峰值 QPS', '② Peak QPS')}</div><div class="h mono" style="font-size:40px;margin-top:14px">${T('平均', 'avg')} × <span class="acc">2~3</span></div></div>`);
        H(`<div class="r card mono" data-cap="1" data-delay="0.8" style="left:0;right:0;top:450px;height:200px;padding:28px 36px;font-size:34px;line-height:1.7">
          <div class="s" style="font-family:'Noto Sans SC'">${T('例', 'Example')}</div>
          <div>${T('1 亿 × 10 ÷ 86400 ≈ <span class="acc">1.2 万</span>', '100M × 10 ÷ 86400 ≈ <span class="acc">12K</span>')}</div>
          <div>${T('峰值 ≈ <span class="acc">2.4~3.6 万</span>', 'peak ≈ <span class="acc">24K–36K</span>')}</div></div>`);
        H(`<div class="r center" data-cap="1" data-delay="1.8" style="left:0;right:0;top:690px;gap:16px">${est()}<span class="s">${T('峰值倍数是经验法则，按业务调整', 'The peak factor is a rule of thumb')}</span></div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期算存储：一年要多少硬盘？', en: 'Next: storage. How much disk for one year?'},
            {zh: '关注我，一起学系统设计。', en: 'Follow along to learn system design.'}],
      build() {
        H(`<div class="r card" style="left:80px;right:80px;top:160px;height:460px;border-color:var(--acc);text-align:center;padding-top:60px">
          <div class="s" style="font-size:34px">${T('第 4 课', 'Lesson 4')}</div>
          <div class="h" style="font-size:72px;margin-top:30px">${T('存储估算', 'Storage estimates')}</div>
          <div class="s" style="font-size:36px;margin-top:14px">${T('一年要多少硬盘？', 'How much disk for a year?')}</div>
          <div style="margin-top:36px">${icon('db', 90, 'var(--acc)')}</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],
      cap: [{zh: '考考你：一千万日活，每人二十次，', en: 'Quiz: 10 million daily users, 20 requests each.',
             say_en: 'Quick quiz: ten million daily users, twenty requests each per day.'},
            {zh: '平均QPS约2300还是2.3万？', en: 'Average QPS: about 2,300 or 23,000?',
             say_zh: '平均 Q P S 约两千三，还是两万三？', say_en: 'Is the average Q P S about two thousand three hundred, or twenty-three thousand?'},
            {zh: '评论区告诉我答案！', en: 'Tell me in the comments!'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:30px;padding:36px 44px;font-size:40px;line-height:1.8">
          <div>${T('日活', 'DAU')} = <span class="nu">${T('1000 万', '10M')}</span></div>
          <div>${T('每人每天', 'req / user / day')} = <span class="nu">20</span></div>
          <div>${T('平均', 'avg')} QPS ≈ <span class="acc">?</span></div></div>`);
        H(`<div class="r center" data-cap="1" style="left:0;right:0;top:400px;gap:40px">
          <div class="card center h mono" style="width:380px;height:130px;font-size:44px;border-color:var(--blue)">A · ${T('约 2300', '~2,300')}</div>
          <div class="card center h mono" style="width:380px;height:130px;font-size:44px;border-color:var(--blue)">B · ${T('约 2.3 万', '~23,000')}</div></div>`);
        H(`<div class="r" data-cap="2" data-in="pop" style="left:0;right:0;top:640px;text-align:center"><span class="h acc" style="font-size:44px">${T('答案评论区见 👇', 'Answer in the comments 👇')}</span></div>`);
      } },
  ],
};
