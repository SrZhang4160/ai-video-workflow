// 系统设计 第 2 课 · 功能需求和非功能需求：先问清楚再画图
const box = (x, y, w, h, inner, color = '#4A5160', extra = '') =>
  `<div class="card center" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;flex-direction:column;gap:6px;border-color:${color};text-align:center;line-height:1.15;${extra}">${inner}</div>`;
const arr = (x, y, w, color = '#4A5160') =>
  `<svg style="position:absolute;left:${x}px;top:${y}px" width="${w}" height="30"><path d="M2 15H${w - 10}" stroke="${color}" stroke-width="4" stroke-linecap="round"/><path d="M${w - 16} 5l12 10-12 10" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const lbl = (z, e, size = 26) => `<div style="font-size:${size}px;font-weight:800">${T(z, e)}</div>`;

window.EPISODE = {
  n: 2,
  scenes: [
    { title: ['拿到题就开画？', 'Start drawing right away?'],
      cap: [['面试官：设计一个短链接服务。', 'Interviewer: design a URL shortener.'],
            {zh: '你拿起笔就开始画框框？', en: 'Do you grab the pen and start drawing boxes?', say_zh: '你拿起笔，就直接开始画图？'},
            ['先别急，第一步是问清需求。', 'Wait. Step one is asking about requirements.']],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:20px;height:170px;display:flex;align-items:center;gap:30px;padding:0 40px">
          ${icon('user', 90, 'var(--blue)')}<div class="h" style="font-size:${T('46px', '40px')}">“${T('设计一个短链接服务', 'Design a URL shortener')}”</div></div>`);
        H(`<div class="r card" data-cap="1" style="left:0;right:0;top:230px;height:300px;border-style:dashed">
          ${box(50, 95, 180, 100, lbl('服务器', 'Server', 30))}${arr(245, 130, 80)}${box(340, 95, 180, 100, lbl('数据库', 'Database', 30))}${arr(535, 130, 80)}${box(630, 95, 220, 100, '<div style="font-size:40px;font-weight:800">?</div>')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="1.0" data-in="stamp" data-shake="1" style="left:690px;top:230px">${icon('cross', 120, 'var(--red)')}</div>`);
        H(`<div class="r card center" data-cap="2" data-in="pop" style="left:120px;right:120px;top:600px;height:150px;gap:24px;border-color:var(--acc)">
          ${num(1)}<span class="h" style="font-size:48px">${T('先问<span class="acc">需求</span>', 'Ask the <span class="acc">requirements</span>')}</span></div>`);
      } },

    { title: ['需求分两种', 'Two kinds of requirements'],
      cap: [['功能需求：系统要做什么。', 'Functional: what the system does.'],
            ['非功能需求：要做得多好。', 'Non-functional: how well it does it.'],
            ['多快、多稳、能扛多少人。', 'How fast, how reliable, how many users.']],
      build() {
        const side = (x, c, z, e, bigZ, bigE) => `<div class="r card" style="left:${x}px;top:20px;width:460px;height:430px;padding:36px 24px;text-align:center;border-color:${c}">
          <div class="h" style="font-size:40px;color:${c}">${T(z, e)}</div>${LANG === 'zh' ? `<div class="s" style="margin-top:4px">${e}</div>` : ''}
          <div class="h" style="font-size:${T('76px', '64px')};margin-top:70px">${T(bigZ, bigE)}</div></div>`;
        H(side(0, 'var(--blue)', '功能需求', 'Functional', '做什么', 'What')).dataset.cap = 0;
        H(side(500, 'var(--acc)', '非功能需求', 'Non-functional', '做得多好', 'How well')).dataset.cap = 1;
        [['clock', '多快', 'Fast'], ['shield', '多稳', 'Reliable'], ['user', '多大', 'Big']].forEach(([ic, z, e], i) =>
          H(`<div class="r card center" data-cap="2" data-delay="${i * 0.4}" data-in="pop" style="left:${500 + i * 160}px;top:490px;width:140px;height:170px;flex-direction:column;gap:12px;border-color:var(--acc)">
            ${icon(ic, 60, 'var(--acc)')}<div style="font-size:${T('30px', '24px')};font-weight:800">${T(z, e)}</div></div>`));
        [['生成短链', 'Create link'], ['点开跳转', 'Redirect']].forEach(([z, e], i) =>
          H(`<div class="r card center" data-cap="0" data-delay="${0.8 + i * 0.4}" data-in="pop" style="left:${i * 240}px;top:490px;width:220px;height:170px;font-size:${T('32px', '28px')};font-weight:800;border-color:var(--blue)">${T(z, e)}</div>`));
      } },

    { title: ['功能需求：能做什么', 'Functional: what it does'],
      cap: [['短链接的功能需求就两条：', 'A URL shortener needs two things:'],
            ['长链接进去，短链接出来；', 'a long URL goes in, a short one comes out;'],
            {zh: '点开短链接，跳回原网址。', en: 'open the short link, land on the original.', say_zh: '点开这个短链接，就跳回原网址。'},
            ['要不要统计点击？范围也要问。', 'Click stats too? Ask. Scope matters.']],
      build() {
        H(`<div class="r" data-cap="1" style="left:0;top:20px;width:960px;height:180px">
          ${box(0, 30, 340, 120, `<div class="mono" style="font-size:24px">example.com/blog/<br>2026/a-very-long-path</div>`, 'var(--quiet)')}
          ${arr(350, 75, 70, 'var(--blue)')}${box(430, 30, 190, 120, lbl('短链服务', 'Shortener', 28), 'var(--blue)')}
          ${arr(630, 75, 70, 'var(--blue)')}${box(710, 30, 250, 120, '<div class="mono acc" style="font-size:34px;font-weight:800">sho.rt/x7K</div>', 'var(--acc)')}</div>`);
        H(`<div class="r s" data-cap="1" data-delay="0.4" style="left:0;top:10px">① ${T('创建', 'Create')}</div>`);
        H(`<div class="r" data-cap="2" style="left:0;top:250px;width:960px;height:180px">
          ${box(0, 30, 250, 120, `${icon('user', 40, 'var(--acc)')}<div class="mono acc" style="font-size:28px">sho.rt/x7K</div>`, 'var(--acc)')}
          ${arr(260, 75, 70, 'var(--acc2)')}${box(340, 30, 190, 120, lbl('短链服务', 'Shortener', 28), 'var(--blue)')}
          ${arr(540, 75, 70, 'var(--acc2)')}${box(620, 30, 340, 120, `<div class="mono ok" style="font-size:24px">example.com/blog/<br>2026/a-very-long-path</div>`, 'var(--acc2)')}</div>`);
        H(`<div class="r s" data-cap="2" data-delay="0.4" style="left:0;top:240px">② ${T('跳转', 'Redirect')}</div>`);
        H(`<div class="r card center" data-cap="3" data-in="drop" style="left:0;right:0;top:520px;height:150px;gap:24px;border-style:dashed;border-color:var(--yel)">
          <span class="h yel" style="font-size:38px">${T('点击统计？自定义短链？', 'Click stats? Custom links?')}</span><span class="chip" style="border-color:var(--yel)">${T('先问要不要', 'Ask first')}</span></div>`);
      } },

    { title: ['非功能需求：做得多好', 'Non-functional: how well'],
      cap: [{zh: '多快：比如跳转 100 毫秒内；', en: 'How fast? Say, redirect within 100 ms.', say_zh: '多快：比如跳转要在一百毫秒内；', say_en: 'How fast? Say, redirect within a hundred milliseconds.'},
            ['多稳：服务不能随便挂；', "How reliable? It shouldn't just go down."],
            ['多大：多少用户，读多还是写多？', 'How big? How many users? More reads or writes?']],
      build() {
        const row = (y, ic, c, z, e, dz, de, cap) => `<div class="r card" data-cap="${cap}" data-in="left" style="left:0;right:0;top:${y}px;height:170px;display:flex;align-items:center;gap:30px;padding:0 36px;border-color:${c}">
          ${icon(ic, 80, c)}<div class="h" style="font-size:44px;color:${c};width:${T('170px', '220px')}">${T(z, e)}</div>
          <div style="font-size:${T('34px', '30px')}">${T(dz, de)}</div></div>`;
        H(row(20, 'clock', 'var(--blue)', '多快', 'Fast', '跳转 &lt; 100 毫秒（举例）', 'redirect &lt; 100 ms (example)', 0));
        H(row(220, 'shield', 'var(--acc2)', '多稳', 'Reliable', '一台机器挂了，服务照常', 'one machine dies, service stays up', 1));
        H(row(420, 'user', 'var(--acc)', '多大', 'Big', '多少用户？读多写少？', 'How many users? Reads vs writes?', 2));
        H(`<div class="r s" data-cap="2" data-delay="1.5" style="left:0;right:0;top:640px;text-align:center">${T('功能都一样，这几条决定架构', 'Same features; these decide the architecture')}</div>`);
      } },

    { title: ['答案决定怎么画', 'The answers shape the diagram'],
      cap: [['为什么先问？因为答案决定图。', 'Why ask first? The answers shape the diagram.'],
            ['点击远多于创建，就加缓存；', 'Far more clicks than creates? Add a cache.'],
            ['要求不能挂，就多放几台服务器。', 'Must stay up? Run several servers.'],
            ['但每加一块，都多一份成本。', 'But every box you add has a cost.']],
      build() {
        const B5 = (x, y, z, e, c, ic) => box(x, y, 160, 120, `${icon(ic, 40, c)}<div style="font-size:${T('26px', '24px')};font-weight:800">${T(z, e)}</div>`, c);
        H(`<div class="r" data-cap="0" style="left:0;top:20px;width:960px;height:200px">
          <div class="s" style="font-size:26px">${T('只知道功能', 'Features only')}</div>
          ${B5(0, 50, '用户', 'User', 'var(--quiet)', 'user')}${arr(170, 95, 60)}${B5(240, 50, '服务器', 'Server', 'var(--quiet)', 'gear')}${arr(410, 95, 60)}${B5(480, 50, '数据库', 'Database', 'var(--quiet)', 'db')}</div>`);
        H(`<div class="r s" data-cap="1" style="left:0;top:270px;font-size:26px">${T('问清非功能之后', 'After asking non-functional')}</div>`);
        const Bx = (x, y, w, z, e, c, ic, extra = '') => box(x, y, w, 120, `${icon(ic, 40, c)}<div style="font-size:${T('26px', '22px')};font-weight:800">${T(z, e)}</div>`, c, extra);
        H(`<div class="r" data-cap="1" style="left:0;top:320px;width:960px;height:300px">
          ${Bx(0, 80, 120, '用户', 'User', 'var(--quiet)', 'user')}
          ${arr(515, 125, 45, 'var(--blue)')}
          <div style="position:absolute;left:565px;top:28px;width:160px;text-align:center;font-size:24px;font-weight:700;color:var(--blue)">${T('读多写少 →', 'Read-heavy →')}</div>
          ${Bx(565, 80, 160, '缓存', 'Cache', 'var(--blue)', 'box', 'border-width:4px')}
          ${arr(730, 125, 45)}${Bx(780, 80, 150, '数据库', 'Database', 'var(--quiet)', 'db')}</div>`);
        H(`<div class="r" data-cap="2" data-in="pop" style="left:0;top:320px;width:520px;height:300px">
          ${arr(125, 125, 45, 'var(--acc2)')}
          ${Bx(175, 80, 140, '负载均衡', 'Load<br>balancer', 'var(--acc2)', 'shield')}
          <svg style="position:absolute;left:315px;top:0" width="55" height="300"><path d="M2 140L48 60M2 140L48 220" stroke="var(--acc2)" stroke-width="4" stroke-linecap="round" fill="none"/></svg>
          ${Bx(370, 0, 140, '服务器 1', 'Server 1', 'var(--acc2)', 'gear')}
          ${Bx(370, 160, 140, '服务器 2', 'Server 2', 'var(--acc2)', 'gear')}</div>`);
        H(`<div class="r card center" data-cap="3" data-in="stamp" style="left:0;right:0;top:680px;height:120px;gap:20px;border-color:var(--red)">
          <span class="h red" style="font-size:36px">${T('代价：更多机器、更复杂', 'Cost: more machines, more moving parts')}</span></div>`);
      } },

    { title: ['一句话分清', 'Tell them apart'],
      cap: [['说“能做什么”，是功能需求；', 'What it can do: functional.'],
            ['说“多快多稳多大”，是非功能。', 'How fast, reliable or big: non-functional.']],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;width:460px;top:20px;height:110px;text-align:center;padding-top:26px;border-color:var(--blue)"><span class="h blue" style="font-size:40px">${T('功能需求', 'Functional')}</span></div>`);
        H(`<div class="r card" data-cap="0" style="left:500px;width:460px;top:20px;height:110px;text-align:center;padding-top:26px;border-color:var(--acc)"><span class="h acc" style="font-size:40px">${T('非功能需求', 'Non-functional')}</span></div>`);
        const chip = (x, y, z, e, c, cap, d) => `<div class="r card center" data-cap="${cap}" data-delay="${d}" data-in="drop" style="left:${x}px;top:${y}px;width:460px;height:110px;font-size:${T('34px', '30px')};font-weight:700;border-color:${c}">${T(z, e)}</div>`;
        H(chip(0, 170, '用户能发消息', 'Users can send messages', 'var(--blue)', 0, 0.6));
        H(chip(0, 310, '能按关键词搜索', 'Search by keyword', 'var(--blue)', 0, 1.1));
        H(chip(500, 170, '消息 1 秒内送达', 'Delivered within 1 second', 'var(--acc)', 1, 0));
        H(chip(500, 310, '支持一千万用户', 'Supports 10 million users', 'var(--acc)', 1, 0.5));
        H(`<div class="r" data-cap="1" data-delay="1.2" style="left:0;right:0;top:500px;display:flex;justify-content:space-around">
          <span class="h blue" style="font-size:44px">${T('动词：能…', 'Verb: can…')}</span><span class="h acc" style="font-size:44px">${T('程度：多…', 'Degree: how…')}</span></div>`);
      } },

    { title: ['一张图总结', 'One picture to remember'],
      cap: [['总结：先问做什么，再问做多好，', 'To sum up: ask what it does, then how well.'],
            ['都问清楚了，再开始画图。', 'Once both are clear, start drawing.']],
      build() {
        const step = (y, n, c, z, e, dz, de, cap, d) => `<div class="r card" data-cap="${cap}" data-delay="${d}" style="left:0;right:0;top:${y}px;height:170px;display:flex;align-items:center;gap:30px;padding:0 36px;border-color:${c}">
          ${num(n, c)}<div><div class="h" style="font-size:42px">${T(z, e)}</div><div class="s" style="margin-top:6px">${T(dz, de)}</div></div></div>`;
        H(step(20, 1, 'var(--blue)', '功能需求：做什么', 'Functional: what', '核心功能 + 问清范围', 'core features + agree on scope', 0, 0));
        H(step(240, 2, 'var(--acc)', '非功能需求：做多好', 'Non-functional: how well', '多快 · 多稳 · 多大', 'fast · reliable · big', 0, 0.8));
        H(step(460, 3, 'var(--acc2)', '再画图', 'Then draw', '每个框都对应一条需求', 'every box answers a requirement', 1, 0));
        [200, 420].forEach((y, i) => H(`<div class="r mono q" data-cap="${i}" data-delay="${i ? 0 : 0.6}" style="left:470px;top:${y - 8}px;font-size:40px">↓</div>`));
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期：“多大”到底怎么算？', 'Next time: how do you put a number on "big"?'],
            {zh: '日活×次数÷86400，关注我！', en: 'Daily users × requests ÷ 86,400. Follow along!', say_zh: '日活乘以次数，再除以八万六千四百。记得关注我！', say_en: 'Daily users, times requests, divided by eighty-six thousand four hundred. Follow along!'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 3 课 · Lesson 3', 'Lesson 3')}</div>
          <div class="h" style="font-size:${T('80px', '68px')};margin-top:30px">${T('估算入门：QPS', 'Estimating QPS')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:36px;margin-top:10px">Back-of-the-envelope QPS</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">${T('日活 × 次数 ÷ 86400', 'DAU × requests ÷ 86,400')}</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz; answer in meta.json quiz
      cap: [['考考你：这条是哪种需求？', 'Quick quiz: which kind of requirement is this?'],
            ['功能，还是非功能？评论区告诉我。', 'Functional or non-functional? Tell me in the comments.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;height:260px;padding:0 50px;border-color:var(--yel)">
          <div class="h" style="font-size:${T('48px', '42px')};text-align:center;line-height:1.4">“${T('用户可以给短链接<br>设置过期时间', 'Users can set an<br>expiry time on a short link')}”</div></div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:380px;display:flex;gap:40px;justify-content:center">
          <div class="card center h" style="width:420px;height:130px;font-size:${T('44px', '38px')};border-color:var(--blue)">A · ${T('功能需求', 'Functional')}</div>
          <div class="card center h" style="width:420px;height:130px;font-size:${T('44px', '38px')};border-color:var(--acc)">B · ${T('非功能需求', 'Non-functional')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:600px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
