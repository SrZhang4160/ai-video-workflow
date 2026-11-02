// 系统设计 第 1 课 · 系统设计到底在考什么：从一台机器到百万用户
const box = (x, y, w, h, ic, zh, en, color = 'var(--line)', extra = '') =>
  `<div class="r card center" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;flex-direction:column;gap:10px;border-color:${color};${extra}">
    ${ic ? icon(ic, 56, color === 'var(--line)' ? 'var(--ink)' : color) : ''}
    <div style="font-size:32px;font-weight:800;line-height:1.15;text-align:center">${T(zh, en)}</div>
    ${LANG === 'zh' && en ? `<div class="s" style="font-size:24px;line-height:1">${en}</div>` : ''}</div>`;
const arrow = (x, y, w, color = '#4A5160', cap, delay) =>
  `<svg class="r" ${cap !== undefined ? `data-cap="${cap}"` : ''} ${delay ? `data-delay="${delay}"` : ''} data-in="left" style="left:${x}px;top:${y}px" width="${w}" height="40"><path d="M2 20H${w - 14}" stroke="${color}" stroke-width="4" stroke-linecap="round"/><path d="M${w - 22} 8l16 12-16 12" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cost = (top, zh, en, cap, delay) =>
  `<div class="r" data-cap="${cap}" ${delay ? `data-delay="${delay}"` : ''} data-in="pop" style="left:0;right:0;top:${top}px;text-align:center">
    <span style="display:inline-block;border:3px solid var(--yel);color:var(--yel);border-radius:18px;padding:14px 30px;font-size:32px;font-weight:800">${T('代价：', 'Cost: ')}${T(zh, en)}</span></div>`;
const dot = (x, y, dx, dy, cap, delay, color = 'var(--acc)') =>
  `<div class="r" data-cap="${cap}" data-delay="${delay}" data-in="pop" data-move="${dx},${dy},0.9" style="left:${x}px;top:${y}px;width:30px;height:30px;border-radius:50%;background:${color};box-shadow:0 0 0 8px rgba(255,138,76,.2)"></div>`;

window.EPISODE = {
  n: 1,
  scenes: [
    { title: ['系统设计到底在考什么', 'What system design really tests'],
      cap: [['面试官说：设计一个百万用户的系统。', 'The interviewer says: design a system for a million users.'],
            ['你第一笔，画什么？', "What's the first thing you draw?"],
            ['其实，就从一台机器开始。', 'Start with just one machine.']],
      build() {
        H(`<div class="r card center" data-cap="0" style="left:0;right:0;top:20px;height:200px;gap:36px">${icon('user', 90, 'var(--blue)')}
          <div class="mono" style="font-size:64px;font-weight:800"><span class="q">1</span> <span class="acc">→</span> 1,000,000</div></div>`);
        H(`<div class="r card center" data-cap="1" data-in="zoom" style="left:120px;right:120px;top:270px;height:330px;border-style:dashed;border-color:#4A5160">
          <div class="acc" style="font-size:200px;font-weight:900;line-height:1">?</div></div>`);
        H(`<div class="r" data-cap="2" data-in="pop" style="left:330px;top:650px">${box(0, 0, 300, 160, 'gear', '一台机器', 'One machine', 'var(--acc2)')}</div>`);
      } },

    { title: ['① 一台机器', '① One machine'],
      cap: [['刚上线，程序和数据库放一台机器。', 'At launch, the app and the database share one machine.'],
            ['简单，但它一挂，全站就没了。', 'Simple. But if it dies, the whole site is down.']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:220px">${box(0, 0, 220, 220, 'user', '用户', 'Users', 'var(--blue)')}</div>`);
        H(arrow(240, 310, 160, '#4A5160', 0, 0.4));
        H(`<div class="r card" data-cap="0" data-delay="0.6" style="left:420px;top:60px;width:540px;height:540px;border-color:var(--acc2)">
          <div class="r s" style="left:0;right:0;top:22px;text-align:center">${T('一台机器', 'One machine')}</div>
          ${box(70, 100, 400, 170, 'gear', '程序', 'App')}
          ${box(70, 320, 400, 170, 'db', '数据库', 'Database')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.4" data-in="stamp" data-shake="1" style="left:850px;top:80px">${icon('cross', 90, 'var(--red)')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.9" data-in="pop" style="left:0;right:0;top:660px;text-align:center">
          <span style="display:inline-block;border:3px solid var(--red);color:var(--red);border-radius:18px;padding:14px 30px;font-size:34px;font-weight:800">${B('单点故障', 'Single point of failure')}</span></div>`);
      } },

    { title: ['② 拆出数据库', '② Split out the database'],
      cap: [['用户多了，先把数据库拆出去。', 'More users? First, give the database its own machine.'],
            ['程序和数据各用一台，可以分开升级。', 'Each gets its own machine, so you can upgrade them separately.'],
            ['代价：每次查询，多一跳网络。', 'The cost: every query now crosses the network.']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:160px">${box(0, 0, 220, 220, 'user', '用户', 'Users', 'var(--blue)')}</div>`);
        H(arrow(230, 250, 100, '#4A5160', 0, 0.3));
        H(`<div class="r" data-cap="1" style="left:340px;top:140px">${box(0, 0, 260, 260, 'gear', '程序服务器', 'App server', 'var(--acc2)')}</div>`);
        H(arrow(610, 250, 100, 'var(--acc)', 1, 0.5));
        H(`<div class="r" data-cap="1" data-delay="0.8" data-in="right" style="left:720px;top:140px">${box(0, 0, 240, 260, 'db', '数据库', 'Database', 'var(--blue)')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="1.4" data-in="pop" style="left:0;right:0;top:470px;text-align:center"><span class="chip ok" style="border-color:var(--acc2);font-size:30px">${T('各自升级 CPU / 内存', 'Upgrade CPU / memory separately')}</span></div>`);
        H(cost(600, '多一跳网络', 'one more network hop', 2));
      } },

    { title: ['③ 负载均衡', '③ Load balancer'],
      cap: [['扛不住就多加几台，前面放负载均衡。', "Can't keep up? Add servers, with a load balancer in front."],
            ['一台挂了，别的照样干活。', 'If one dies, the others keep working.'],
            ['代价：服务器得是无状态的。', 'The cost: servers must be stateless.']],
      build() {
        const ys = [40, 260, 480];
        ys.forEach((y, i) => H(`<div class="r" data-cap="0" data-delay="${i * 0.3}" data-in="pop" style="left:640px;top:${y}px">${box(0, 0, 320, 180, 'gear', `服务器 ${i + 1}`, `Server ${i + 1}`, 'var(--acc2)')}</div>`));
        H(`<div class="r" data-cap="0" data-delay="1.0" data-in="left" style="left:0;top:220px">${box(0, 0, 300, 260, 'shield', '负载均衡', 'Load balancer', 'var(--acc)')}</div>`);
        H(`<svg class="r" data-cap="0" data-delay="1.4" style="left:300px;top:0" width="340" height="700">
          <path d="M10 350 L330 130 M10 350 L330 350 M10 350 L330 570" stroke="#4A5160" stroke-width="4" fill="none" stroke-dasharray="10 8"/></svg>`);
        ys.forEach((y, i) => H(dot(300, 335, 310, y + 75 - 335, 0, 1.8 + i * 0.4)));
        H(`<div class="r" data-cap="1" data-in="stamp" data-shake="1" style="left:880px;top:270px">${icon('cross', 70, 'var(--red)')}</div>`);
        H(dot(300, 335, 310, 40 + 75 - 335, 1, 0.6));
        H(cost(720, '状态放到共享存储里', 'keep state in shared storage', 2));
      } },

    { title: ['④ 缓存', '④ Cache'],
      cap: [['数据库慢了？很多系统其实读多写少。', 'The database slows down. Most apps read far more than they write.'],
            {zh: '热门数据放进内存缓存，读起来快得多。', en: 'Put hot data in an in-memory cache like Redis. Reads get much faster.', say_en: 'Put hot data in an in-memory cache like Reddis. Reads get much faster.'},
            ['代价：缓存里的数据可能是旧的。', 'The cost: cached data can be out of date.']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:200px">${box(0, 0, 260, 240, 'gear', '服务器', 'Servers', 'var(--acc2)')}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.3" style="left:700px;top:420px">${box(0, 0, 260, 220, 'db', '数据库', 'Database', 'var(--red)')}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.6" data-in="pop" style="left:690px;top:660px;width:280px;text-align:center"><span class="chip red" style="border-color:var(--red)">${T('慢', 'slow')} · ${T('压力大', 'overloaded')}</span></div>`);
        H(`<div class="r" data-cap="1" data-in="drop" style="left:700px;top:20px">${box(0, 0, 260, 220, 'clock', '缓存', 'Cache · Redis', 'var(--blue)')}</div>`);
        H(`<svg class="r" data-cap="1" data-delay="0.5" style="left:260px;top:0" width="440" height="700">
          <path d="M10 300 L420 130" stroke="var(--blue)" stroke-width="5" fill="none"/>
          <path d="M10 340 L420 530" stroke="#4A5160" stroke-width="4" fill="none" stroke-dasharray="10 8"/></svg>`);
        H(`<div class="r" data-cap="1" data-delay="1.2" data-in="pop" style="left:300px;top:60px"><span class="chip ok" style="border-color:var(--acc2);font-size:30px">${T('命中：快', 'Hit: fast')} ✓</span></div>`);
        H(cost(760, '可能读到旧数据', 'data may be stale', 2));
      } },

    { title: ['其实就考三个问题', 'It comes down to three questions'],
      cap: [['每一步都在回答三个问题：', 'Notice: every step answers three questions.'],
            ['瓶颈在哪？加什么？代价是什么？', "Where's the bottleneck? What do we add? What does it cost?"],
            ['系统设计考的，就是讲清楚取舍。', 'System design tests whether you can explain the trade-offs.']],
      build() {
        [['瓶颈在哪？', 'Bottleneck?', 'var(--red)'], ['加什么？', 'What to add?', 'var(--acc2)'], ['代价是什么？', 'What it costs?', 'var(--yel)']]
          .forEach(([z, e, c], i) => H(`<div class="r card" data-cap="1" data-delay="${i * 0.6}" data-in="pop" style="left:${i * 325}px;top:40px;width:310px;height:300px;border-color:${c};text-align:center;padding-top:40px">
            ${num(i + 1)}<div class="h" style="margin-top:30px;color:${c}">${T(z, e)}</div>${LANG === 'zh' ? `<div class="s" style="margin-top:6px">${e}</div>` : ''}</div>`));
        H(`<div class="r card center" data-cap="2" data-in="zoom" style="left:80px;right:80px;top:420px;height:200px;border-color:var(--acc)">
          <div class="h" style="font-size:44px">${T('没有标准答案，只有<span class="acc">取舍</span>', 'No perfect answer, only <span class="acc">trade-offs</span>')}</div></div>`);
        H(`<div class="r" data-cap="2" data-delay="1.0" data-in="stamp" style="left:0;right:0;top:680px;text-align:center"><span class="chip" style="font-size:32px">${T('不是背组件名，是讲清楚为什么', 'Not naming parts: explaining why')}</span></div>`);
      } },

    { title: ['一张图总结', 'One-picture summary'],
      cap: [['一张图总结：每加一块，解一个瓶颈，', 'The whole picture: each piece fixes one bottleneck'],
            ['也都有代价。存下来！', 'and each one has a cost. Save this one!']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:20px">${box(0, 0, 170, 170, 'user', '用户', 'Users', 'var(--blue)')}</div>`);
        H(arrow(175, 85, 60, '#4A5160', 0, 0.2));
        H(`<div class="r" data-cap="0" style="left:240px;top:20px">${box(0, 0, 220, 170, 'shield', '负载均衡', 'Load balancer', 'var(--acc)')}</div>`);
        H(arrow(465, 85, 60, '#4A5160', 0, 0.5));
        H(`<div class="r" data-cap="0" data-delay="0.3" style="left:530px;top:20px">${box(0, 0, 180, 170, 'gear', '服务器 ×N', 'Servers ×N', 'var(--acc2)')}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.6" style="left:760px;top:0"><div class="card center" style="width:200px;height:100px;border-color:var(--blue);font-size:30px;font-weight:800">${T('缓存', 'Cache')}</div></div>`);
        H(`<div class="r" data-cap="0" data-delay="0.8" style="left:760px;top:120px"><div class="card center" style="width:200px;height:100px;border-color:var(--blue);font-size:30px;font-weight:800">${T('数据库', 'Database')}</div></div>`);
        H(`<svg class="r" data-cap="0" data-delay="0.6" style="left:710px;top:0" width="50" height="230"><path d="M4 105 L46 50 M4 105 L46 170" stroke="#4A5160" stroke-width="4" fill="none"/></svg>`);
        const rows = [['拆数据库', 'Split the DB', '各自扩展', 'Scale each part', '多一跳网络', 'Extra network hop'],
                      ['负载均衡', 'Load balancer', '扛流量、能容错', 'More traffic, survives a crash', '服务器要无状态', 'Must be stateless'],
                      ['缓存', 'Cache', '读得快', 'Fast reads', '可能读到旧数据', 'May be stale']];
        H(`<div class="r card" data-cap="1" style="left:0;right:0;top:270px;padding:16px 26px">
          <div style="display:grid;grid-template-columns:230px 1fr 1fr;gap:0;font-size:30px">
            <div class="q" style="padding:14px 0">${T('加了', 'Added')}</div><div class="ok" style="padding:14px 0">${T('解决', 'Fixes')}</div><div class="yel" style="padding:14px 0">${T('代价', 'Costs')}</div>
            ${rows.map(([a, ae, b, be, c, ce]) => `<div style="padding:22px 0;border-top:2px solid var(--line);font-weight:800">${T(a, ae)}</div><div style="padding:22px 10px 22px 0;border-top:2px solid var(--line)">${T(b, be)}</div><div style="padding:22px 0;border-top:2px solid var(--line)">${T(c, ce)}</div>`).join('')}
          </div></div>`);
        H(`<div class="r" data-cap="1" data-delay="0.8" style="left:0;right:0;top:790px;text-align:center;font-size:34px;font-weight:800">${T('瓶颈 → 加组件 → <span class="acc">说出代价</span>', 'Bottleneck → add a part → <span class="acc">name the cost</span>')}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['不过真到面试，先别急着画图。', "But in a real interview, don't start drawing yet."],
            ['下期聊：功能需求和非功能需求。', 'Next time: functional and non-functional requirements.']],
      build() {
        H(`<div class="r card" style="left:80px;right:80px;top:160px;height:480px;border-color:var(--acc);text-align:center;padding-top:60px">
          <div class="s" style="font-size:34px">${T('第 2 课 · Lesson 2', 'Lesson 2')}</div>
          <div class="h" style="font-size:64px;margin-top:30px;line-height:1.25">${T('功能需求<br>和非功能需求', 'Functional vs<br>non-functional')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:32px;margin-top:14px">Functional vs non-functional requirements</div>' : '<div class="s" style="font-size:32px;margin-top:14px">requirements</div>'}
          <div class="acc" style="font-size:34px;margin-top:34px;font-weight:800">${T('先问清楚，再画图', 'Ask first, then draw')}</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],
      cap: [['考考你：只有一台服务器，挂了怎么办？', 'Quick quiz: one server, and it just died. What fixes that?'],
            {zh: 'A 缓存，B 负载均衡加多台服务器？', en: 'A: a cache. B: a load balancer plus more servers?',
             say_zh: 'A，加缓存。B，负载均衡加多台服务器？', say_en: 'A: a cache. B: a load balancer plus more servers?'},
            ['评论区告诉我。', 'Tell me in the comments.']],
      build() {
        H(`<div class="r card center" data-cap="0" style="left:200px;right:200px;top:30px;height:260px;flex-direction:column;gap:14px;border-color:var(--red)">
          ${icon('gear', 80, 'var(--red)')}<div class="h">${T('只有 1 台服务器', 'Only 1 server')}</div></div>`);
        H(`<div class="r" data-cap="0" data-delay="0.8" data-in="stamp" data-shake="1" style="left:640px;top:40px">${icon('cross', 90, 'var(--red)')}</div>`);
        H(`<div class="r card" data-cap="1" data-in="left" style="left:0;width:460px;top:350px;height:230px;padding:30px;text-align:center">
          <div class="h acc" style="font-size:60px">A</div><div class="h" style="margin-top:16px">${T('加缓存', 'Add a cache')}</div></div>`);
        H(`<div class="r card" data-cap="1" data-delay="0.6" data-in="right" style="left:500px;width:460px;top:350px;height:230px;padding:30px;text-align:center">
          <div class="h acc" style="font-size:60px">B</div><div class="h" style="margin-top:16px;font-size:36px">${T('负载均衡 + 多台服务器', 'Load balancer + more servers')}</div></div>`);
        H(`<div class="r" data-cap="2" data-in="pop" style="left:0;right:0;top:650px;text-align:center;font-size:40px;font-weight:800">${T('答案评论区见 👇', 'Answer in the comments 👇')}</div>`);
      } },
  ],
};
