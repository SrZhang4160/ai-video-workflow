// 每日 AI 快讯 #1 · DoorDash：第三方 AI agent 至今只下了几百单 (sources in meta.json → sources)
const card = (x, y, w, h, inner, extra = '') =>
  `<div class="r card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">${inner}</div>`;
const big = (text, size = 44, color = 'var(--ink)') => `<div style="font-size:${size}px;font-weight:800;color:${color};line-height:1.2">${text}</div>`;
const small = (text, size = 26) => `<div style="font-size:${size}px;color:var(--quiet);line-height:1.35;margin-top:8px">${text}</div>`;
const arrowRight = (x, y, w, cap, delay) =>
  `<svg class="r" data-cap="${cap}" data-delay="${delay}" data-in="left" style="left:${x}px;top:${y}px" width="${w}" height="40"><path d="M4 20H${w - 14}" stroke="#4A5570" stroke-width="4" stroke-linecap="round"/><path d="M${w - 24} 6l16 14-16 14" fill="none" stroke="#4A5570" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

window.EPISODE = {
  n: 1,
  theme: 'news',
  tag: ['AI 快讯', 'AI News'],
  scenes: [
    // 1 · Hook: the two numbers, stated plainly
    { tag: ['头条', 'TOP STORY'], title: ['AI 帮人点外卖，至今才几百单', 'AI agents: a few hundred orders, ever'],
      cap: [{zh: '第三方 AI agent 替人点外卖，', en: 'Third-party AI agents ordering food for people', say_zh: '第三方 A I agent，替人点外卖，', say_en: 'Third-party A I agents ordering food for people'},
            {zh: '在 DoorDash 至今一共才几百单。', en: 'have placed maybe several hundred DoorDash orders. In total.', say_zh: '在 DoorDash，到现在一共才几百单。'},
            {zh: '而 DoorDash 上个季度：9.93 亿单。', en: 'DoorDash handled 993 million orders last quarter alone.', say_zh: '而 DoorDash 上个季度，有九亿九千三百万单。', say_en: 'DoorDash handled nine hundred ninety-three million orders last quarter alone.'}],
      build() {
        H(card(0, 30, 960, 300, `<div class="center" style="flex-direction:column;height:100%;gap:8px">
            ${small(T('第三方 AI agent 下的单 · 至今累计', 'Orders from third-party AI agents · all time'), 30)}
            <div style="font-size:150px;font-weight:900;color:var(--acc);line-height:1.1">${T('几百', 'Hundreds')}</div></div>`, 'border-color:var(--acc);border-width:4px')).dataset.cap = 1;
        H(card(0, 370, 960, 260, `<div class="center" style="flex-direction:column;height:100%;gap:8px">
            ${small(T('DoorDash 全部订单 · 仅第三季度', 'All DoorDash orders · Q3 alone'), 30)}
            <div class="mono" style="font-size:104px;font-weight:900;color:var(--ink)">993,000,000</div></div>`)).dataset.cap = 2;
        H(`<div class="r" data-cap="2" data-delay="0.8" style="left:0;top:670px">${src('DoorDash Q3 2026 · TechCrunch')}</div>`);
      } },

    // 2 · What happened: who said it, where, the exact words
    { tag: ['新闻', 'NEWS'], title: ['CEO 在财报会上亲口说的', 'Said by the CEO on the earnings call'],
      cap: [{zh: '这是 DoorDash CEO 上周三在财报会上说的。', en: "That's from DoorDash's CEO, on last Wednesday's earnings call.", say_zh: '这是 DoorDash 的 C E O，上周三在财报会上说的。', say_en: "That's from DoorDash's C E O, on last Wednesday's earnings call."},
            ['他还说：别跟大势较劲，', '"You never want to fight gravity,"'],
            ['但也别自欺欺人。', '"but you don\'t want to be delusional."']],
      build() {
        H(card(0, 20, 960, 110, `<div style="display:flex;align-items:center;gap:20px;padding:0 34px;height:100%">${badge('Q3 2026', 'var(--blue)', 28)}
            ${big(T('DoorDash 财报电话会', 'DoorDash earnings call'), 36)}<span class="s" style="margin-left:auto">${T('10 月 29 日', 'Oct 29')}</span></div>`)).dataset.cap = 0;
        H(card(0, 160, 960, 250, `<div style="padding:28px 40px">
            <div style="font-size:30px;color:var(--quiet)">Tony Xu · CEO</div>
            <div style="font-size:38px;font-weight:700;line-height:1.4;margin-top:12px">“we're seeing maybe <span class="acc">several hundred orders in total</span> from some of these third-party agents.”</div></div>`, 'border-left:10px solid var(--acc)')).dataset.cap = 0;
        H(card(0, 440, 960, 220, `<div style="padding:28px 40px">
            <div style="font-size:34px;font-weight:700;line-height:1.4">“you never want to fight gravity. But at the same time, you don't want to be delusional”</div>
            ${LANG === 'zh' ? small('别跟大势较劲，但也别自欺欺人', 28) : ''}</div>`, 'border-left:10px solid var(--line)')).dataset.cap = 1;
        H(`<div class="r" data-cap="0" data-delay="0.8" style="left:0;top:700px">${src('TechCrunch · Oct 30')}</div>`);
      } },

    // 3 · Analysis: the plumbing already exists
    { tag: ['分析', 'ANALYSIS'], title: ['路铺好了，车还没来', 'The road is built. No traffic yet.'],
      cap: [['奇怪的是，路已经铺好了。', "The odd part: the road is already built."],
            {zh: 'DoorDash 9 月推出 MCP 下单连接器，', en: 'In September DoorDash launched an MCP ordering connector,', say_zh: 'DoorDash 九月，推出了 M C P 下单连接器，', say_en: 'In September DoorDash launched an M C P ordering connector,'},
            ['agent 能找菜、下单，目前小范围测试。', 'so agents can find items and order. Still a limited beta.'],
            ['沃尔玛也开了入口，亚马逊却在拦。', 'Walmart opened a gateway too. Amazon is blocking agents.']],
      build() {
        const node = (x, w, ic, t, sub, col, cap, delay) => `<div class="r card" data-cap="${cap}" data-delay="${delay}" style="left:${x}px;top:40px;width:${w}px;height:200px;border-color:${col}">
            <div class="center" style="flex-direction:column;height:100%;gap:8px">${icon(ic, 56, col)}${big(t, 32)}<div style="font-size:22px;color:var(--quiet)">${sub}</div></div></div>`;
        H(node(0, 260, 'gear', 'AI agent', T('第三方', 'third-party'), 'var(--blue)', 1, 0));
        H(arrowRight(270, 120, 80, 1, 0.3));
        H(node(350, 260, 'box', 'MCP', T('下单连接器', 'ordering connector'), 'var(--acc)', 1, 0.5));
        H(arrowRight(620, 120, 80, 1, 0.8));
        H(node(700, 260, 'card', 'DoorDash', T('找菜 · 下单', 'find · order'), 'var(--acc2)', 2, 0));
        H(`<div class="r" data-cap="2" data-delay="0.5" style="left:0;right:0;top:270px;text-align:center"><span class="chip">${T('企业订餐 · 小范围测试', 'corporate ordering · limited beta')}</span></div>`);
        H(card(0, 380, 470, 200, `<div style="padding:28px">${big('Walmart', 40)}<div style="margin-top:16px;font-size:30px">${icon('check', 36, 'var(--acc2)')} ${T('开放 agent 入口', 'Opens an agent gateway')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 3;
        { const e = H(card(490, 380, 470, 200, `<div style="padding:28px">${big('Amazon', 40)}<div style="margin-top:16px;font-size:30px">${icon('cross', 36, 'var(--red)')} ${T('拦住 agent 购物', 'Blocks agent shopping')}</div></div>`, 'border-color:var(--red)')); e.dataset.cap = 3; e.dataset.delay = '0.9'; }
        H(`<div class="r" data-cap="1" data-delay="0.8" style="left:0;top:620px">${src('DoorDash Newsroom · Sep 30 · TechCrunch · Oct 21')}</div>`);
      } },

    // 4 · Opinion: trust is the bottleneck (marked as opinion)
    { tag: ['观点', 'MY TAKE'], title: ['卡住的不是接口，是信任', "It's not the API. It's trust."],
      cap: [['我的看法：缺的不是接口，是信任。', "My take: what's missing isn't the API. It's trust."],
            ['敢让 agent 直接花你的钱吗？', 'Would you let an agent spend your money, unchecked?'],
            {zh: '沃尔玛的做法：每单审批、设上限。', en: "Walmart's answer: per-order approval and spending limits.", say_zh: '沃尔玛的做法是：每一单都审批，再设个上限。'}],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:10px">${badge(T('观点 · 非事实', 'Opinion, not fact'), 'var(--yel)', 26)}</div>`);
        H(card(0, 70, 440, 200, `<div style="padding:28px">${icon('check', 46, 'var(--acc2)')}${big(T('接口 / MCP', 'API / MCP'), 36)}${small(T('已经有了', 'already there'), 26)}</div>`, 'border-color:var(--acc2)')).dataset.cap = 0;
        { const e = H(card(520, 70, 440, 200, `<div style="padding:28px">${icon('shield', 46, 'var(--acc)')}${big(T('信任', 'Trust'), 36, 'var(--acc)')}${small(T('真正的瓶颈', 'the real bottleneck'), 26)}</div>`, 'border-color:var(--acc);border-width:4px')); e.dataset.cap = 0; e.dataset.delay = '0.8'; }
        H(`<div class="r center" data-cap="1" data-in="pop" style="left:0;right:0;top:320px;height:120px;font-size:44px;font-weight:800">${icon('card', 54, 'var(--yel)')}&nbsp;${T('agent 直接花你的钱？', 'An agent spending your money?')}</div>`);
        H(card(0, 480, 960, 200, `<div style="padding:26px 34px">${big(T('沃尔玛 · 11 月起', 'Walmart · from November'), 32, 'var(--acc2)')}
            <div style="font-size:32px;line-height:1.7;margin-top:6px">${icon('user', 36, 'var(--acc2)')} ${T('每单审批', 'Per-order approval')} &nbsp; ${icon('shield', 36, 'var(--acc2)')} ${T('花钱上限', 'Spending limit')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 2;
      } },

    // 5 · One-card summary + what to do
    { tag: ['总结', 'SUMMARY'], title: ['一张图看懂', 'One-card summary'],
      cap: [['总结：路通了，单还没来。', "In short: the road is built; the orders aren't here."],
            ['做 agent，先做人工审批和花钱上限。', 'Building agents? Ship approval and spending limits first.']],
      build() {
        const row = (y, k, v, c, cap) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:120px;display:grid;grid-template-columns:230px 1fr;align-items:center;padding:0 34px;border-left:8px solid ${c}">
            <div style="font-size:32px;font-weight:800;color:${c}">${k}</div><div style="font-size:30px">${v}</div></div>`;
        H(row(10, T('数字', 'Numbers'), T('agent 至今几百单 · 上季度 9.93 亿单', 'agents: hundreds ever · Q3: 993M'), 'var(--acc)', 0));
        H(row(145, T('接口', 'Plumbing'), T('MCP 入口：DoorDash（测试中）、沃尔玛', 'MCP: DoorDash (beta), Walmart'), 'var(--blue)', 0));
        H(row(280, T('分歧', 'Split'), T('沃尔玛开放 · 亚马逊拦截', 'Walmart opens · Amazon blocks'), 'var(--yel)', 0));
        H(row(415, T('该做', 'Do this'), T('人工审批 + 花钱上限', 'approval + spending limits'), 'var(--acc2)', 1));
        H(`<div class="r card center" data-cap="1" data-delay="0.6" data-in="pop" style="left:0;right:0;top:570px;height:120px;border-color:var(--acc);font-size:40px;font-weight:800">${T('赢在信任，不在接口', 'Trust wins, not the API')}</div>`);
      } },

    // 6 · Quiz (answer stated in scene 3)
    { tag: ['考考你', 'QUIZ'], title: ['考考你', 'Quick quiz'],
      cap: [{zh: '考考你：谁在拦 AI agent 购物？', en: 'Quick quiz: who is blocking AI agents from shopping?', say_zh: '考考你：谁在拦 A I agent 购物？', say_en: 'Quick quiz: who is blocking A I agents from shopping?'},
            ['亚马逊，还是沃尔玛？评论区告诉我。', 'Amazon or Walmart? Comment below.']],
      build() {
        H(card(0, 40, 960, 220, `<div class="center" style="height:100%;padding:0 30px;text-align:center">
            ${big(T('谁在拦 AI agent 购物？', 'Who is blocking AI agents from shopping?'), 46)}</div>`)).dataset.cap = 0;
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:310px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:400px;height:130px;font-size:46px;border-color:var(--blue)">A · Amazon</div>
          <div class="card center h" style="width:400px;height:130px;font-size:46px;border-color:var(--acc2)">B · Walmart</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:510px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
