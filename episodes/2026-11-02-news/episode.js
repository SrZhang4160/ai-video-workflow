// AI 快讯 #1 · DoorDash：一个季度 9.93 亿单，第三方 AI agent 至今一共可能才几百单 (sources in meta.json → sources)
const card = (x, y, w, h, inner, extra = '') =>
  `<div class="r card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">${inner}</div>`;
const big = (text, size = 44, color = 'var(--ink)') => `<div style="font-size:${size}px;font-weight:800;color:${color};line-height:1.2">${text}</div>`;
const small = (text, size = 26) => `<div style="font-size:${size}px;color:var(--quiet);line-height:1.35;margin-top:8px">${text}</div>`;
const arrowDown = (x, y, h, color, cap, delay) =>
  `<svg class="r" data-cap="${cap}" ${delay ? `data-delay="${delay}"` : ''} data-in="drop" style="left:${x}px;top:${y}px" width="40" height="${h}"><path d="M20 2V${h - 14}" stroke="${color}" stroke-width="4" stroke-linecap="round"/><path d="M8 ${h - 22}l12 16 12-16" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

window.EPISODE = {
  n: 1,
  tag: ['AI 快讯', 'AI News'],
  scenes: [
    // 1 · Hook
    { title: ['第三方 AI agent 帮你点外卖？', 'Do third-party AI agents order food?'],
      cap: [{zh: '一个季度，9.93 亿单外卖。', en: 'One quarter: 993 million orders.', say_zh: '一个季度，九亿九千三百万单外卖。', say_en: 'One quarter. Nine hundred ninety-three million orders.'},
            {zh: '第三方 AI agent 至今一共呢？', en: 'Third-party AI agents, in total so far?', say_zh: '第三方 A I agent，到现在一共呢？', say_en: 'Third-party A I agents, in total so far?'},
            ['可能也就几百单。', 'Maybe several hundred orders.']],
      build() {
        H(card(0, 40, 960, 260, `<div class="center" style="flex-direction:column;height:100%;gap:6px">
            <div class="mono" style="font-size:110px;font-weight:900;color:var(--ink)">993,000,000</div>
            ${small(T('DoorDash · 仅第三季度一个季度的订单', 'DoorDash · orders in Q3 alone'), 30)}</div>`)).dataset.cap = 0;
        H(card(160, 350, 640, 240, `<div class="center" style="flex-direction:column;height:100%;gap:6px">
            <div style="font-size:96px;font-weight:900;color:var(--acc)">${T('几百', 'Hundreds')}</div>
            ${small(T('第三方 AI agent · 至今累计', 'third-party AI agents · total so far'), 30)}</div>`, 'border-color:var(--acc)')).dataset.cap = 1;
        H(`<div class="r" data-cap="2" data-delay="0.3" data-in="stamp" style="left:760px;top:330px;transform:rotate(-8deg);border:5px solid var(--red);color:var(--red);border-radius:14px;padding:6px 22px;font-size:46px;font-weight:900">?!</div>`);
        H(`<div class="r" data-cap="2" data-delay="0.6" style="left:0;right:0;top:650px;text-align:center"><span class="chip">${icon('user', 34, 'var(--acc)')} ${T('CEO 亲口说的', 'Said by the CEO')}</span></div>`);
      } },

    // 2 · What happened
    { title: ['发生了什么', 'What happened'],
      cap: [{zh: '上周三 DoorDash 财报会：', en: "Last Wednesday, on DoorDash's earnings call,", say_zh: '上周三，DoorDash 财报会上，'},
            {zh: 'CEO 说，第三方 agent', en: 'CEO Tony Xu said third-party agents', say_zh: 'C E O 说，第三方 agent', say_en: 'C E O Tony Xu said third-party agents'},
            ['到现在一共可能也就几百单。', 'sent maybe several hundred orders in total.'],
            ['别跟引力较劲，但也别自欺欺人。', "Never fight gravity, he said, but don't be delusional."]],
      build() {
        H(card(0, 20, 960, 140, `<div style="display:flex;align-items:center;gap:22px;padding:0 34px;height:100%">${badge('Q3 2026', 'var(--blue)', 30)}
            ${big(T('DoorDash 财报电话会', 'DoorDash earnings call'), 40)}<span class="s" style="margin-left:auto">${T('10 月 29 日', 'Oct 29')}</span></div>`)).dataset.cap = 0;
        H(card(0, 190, 960, 280, `<div style="padding:30px 40px">
            <div style="font-size:30px;color:var(--quiet)">Tony Xu · CEO</div>
            <div style="font-size:38px;font-weight:700;line-height:1.4;margin-top:14px">“we're seeing maybe <span class="acc">several hundred orders in total</span> from some of these third-party agents.”</div></div>`, 'border-color:var(--acc)')).dataset.cap = 1;
        H(card(0, 500, 960, 190, `<div style="padding:24px 40px">
            <div style="font-size:32px;font-weight:700;line-height:1.4">“you never want to fight gravity. But at the same time, you don't want to be delusional”</div>
            ${LANG === 'zh' ? small('别跟引力较劲，但也别自欺欺人', 28) : ''}</div>`, 'border-color:var(--line)')).dataset.cap = 3;
        H(`<div class="r" data-cap="1" data-delay="0.6" style="left:0;top:730px">${src('DoorDash Q3 2026 · TechCrunch')}</div>`);
      } },

    // 3 · Scale: total so far vs one quarter (approximate comparison, not a per-quarter ratio)
    { title: ['不到百万分之一', 'Less than one in a million'],
      cap: [['拿至今总数比一个季度的订单，', "Compare the total so far with one quarter's orders:"],
            ['还不到百万分之一。', "it's under one in a million."]],
      build() {
        // 20×20 grid = 400 cells; each cell ≈ 993M / 400 ≈ 2.5M orders, far more than a few hundred
        const cells = Array.from({length: 400}, () => `<div style="width:30px;height:30px;border-radius:4px;background:#2A3140"></div>`).join('');
        H(`<div class="r" data-cap="0" data-in="fade" style="left:30px;top:20px;width:630px;display:flex;flex-wrap:wrap;gap:1.5px">${cells}</div>`);
        H(card(680, 20, 280, 280, `<div style="padding:24px">${badge(T('Q3 一个季度', 'One quarter'), 'var(--quiet)', 26)}
            ${big('993M', 52)}${small(T('每个格子 ≈ 250 万单', 'each square ≈ 2.5M orders'), 24)}</div>`)).dataset.cap = 0;
        H(`<div class="r" data-cap="0" data-delay="1.0" data-in="pop" style="left:30px;top:20px;width:3px;height:3px;background:var(--acc);box-shadow:0 0 0 6px rgba(255,138,76,.35)"></div>`);
        { const e = H(card(680, 330, 280, 300, `<div style="padding:24px">${badge(T('agent 至今累计', 'So far'), 'var(--acc)', 26)}
            ${big(T('几百', 'Hundreds'), LANG === 'zh' ? 52 : 44, 'var(--acc)')}${small(T('左上角那个小点，还比实际大得多', 'the dot top-left is still far too big'), 24)}</div>`, 'border-color:var(--acc)')); e.dataset.cap = 0; e.dataset.delay = '1.2'; }
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:680px;text-align:center"><span class="chip yel" style="border-color:var(--yel);font-size:30px">${T('至今累计 vs 一个季度：&lt; 百万分之一', 'total so far vs one quarter: &lt; 1 in a million')}</span></div>`);
      } },

    // 4 · How it works: the MCP connector
    { title: ['agent 怎么下单', 'How an agent orders'],
      cap: [{zh: '但 DoorDash 已经铺好了路：', en: 'Still, DoorDash already built the road:', say_zh: '但 DoorDash 已经铺好了路：'},
            {zh: 'MCP 连接器让 agent 找菜、下单，', en: 'an MCP connector lets agents find items and order,', say_zh: 'M C P 连接器，让 agent 能找菜、下单，', say_en: 'an M C P connector lets agents find items and order,'},
            ['前提是员工先登录、同意条款。', 'once employees sign in and agree to the terms.']],
      build() {
        const box = (y, w, ic, t, sub, col, cap, extra = '') => `<div class="r card" data-cap="${cap}" style="left:${(960 - w) / 2}px;top:${y}px;width:${w}px;height:120px;border-color:${col};${extra}">
            <div style="display:flex;align-items:center;gap:20px;padding:0 30px;height:100%">${icon(ic, 54, col)}<div>${big(t, 34)}${sub ? `<div style="font-size:24px;color:var(--quiet)">${sub}</div>` : ''}</div></div></div>`;
        H(box(10, 620, 'user', T('员工登录 + 同意条款', 'Employee signs in + agrees'), T('人先授权', 'a human approves first'), 'var(--acc2)', 2, 'border-width:4px;background:rgba(80,220,170,.10)'));
        H(arrowDown(460, 135, 60, 'var(--acc2)', 2, 0.5));
        H(box(200, 620, 'gear', 'AI agent', T('外部的第三方 agent', 'a third-party agent'), 'var(--blue)', 1));
        H(arrowDown(460, 325, 60, '#4A5160', 1, 0.4));
        H(box(390, 620, 'box', T('DoorDash MCP 连接器', 'DoorDash MCP connector'), 'Model Context Protocol', 'var(--acc)', 1));
        H(`<div class="r" data-cap="1" data-delay="0.8" style="left:0;right:0;top:560px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
            <span class="chip">${T('找菜', 'Find items')}</span><span class="chip">${T('加购物车', 'Build cart')}</span><span class="chip">${T('下单', 'Place order')}</span><span class="chip">${T('查送达', 'Track arrival')}</span></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.2" style="left:0;right:0;top:660px;text-align:center">${small(T('企业订餐 · 小范围测试', 'corporate ordering · limited beta'), 26)}</div>`);
        H(`<div class="r" data-cap="1" data-delay="1.4" style="left:0;top:740px">${src('DoorDash Newsroom · Sep 30')}</div>`);
      } },

    // 5 · Industry split
    { title: ['巨头态度两极', 'The big retailers split'],
      cap: [['亚马逊开始拦 agent 买东西；', 'Amazon began blocking agents from buying.'],
            {zh: '沃尔玛反而开了 MCP 入口，', en: 'Walmart opened an MCP gateway instead.', say_zh: '沃尔玛反而开了一个 M C P 入口，', say_en: 'Walmart opened an M C P gateway instead.'},
            {zh: '11月起，顾客可要求每单审批，', en: 'From November, customers can require per-order approval', say_zh: '十一月起，顾客可以要求每单审批，'},
            ['或者设个花钱上限。', 'or set a spending limit.']],
      build() {
        const nov = `<span style="font-size:22px;font-weight:800;color:var(--bg);background:var(--yel);border-radius:8px;padding:1px 8px;margin-left:6px;white-space:nowrap">${T('11 月起', 'from Nov')}</span>`;
        H(card(0, 20, 400, 470, `<div style="padding:34px">
            ${big('Amazon', 48)}
            <div style="margin:40px 0 30px">${icon('cross', 120, 'var(--red)')}</div>
            ${big(T('拦住 agent 购物', 'Blocks agent purchases'), 34, 'var(--red)')}</div>`, 'border-color:var(--red)')).dataset.cap = 0;
        H(card(430, 20, 530, 470, `<div style="padding:30px">
            ${big('Walmart', 48)}
            <div style="margin:20px 0 14px">${badge('Agent Gateway · MCP', 'var(--acc2)', 28)}</div>
            <div style="font-size:28px;line-height:1.7">${icon('check', 32, 'var(--acc2)')} ${T('搜库存、帮用户买', 'Search and buy for users')}</div>
            <div style="font-size:28px;line-height:1.7">${icon('card', 32, 'var(--acc2)')} ${T('拿不到支付信息', 'No payment info')}</div>
            <div style="font-size:28px;line-height:1.7">${icon('user', 32, 'var(--acc2)')} ${T('每个 agent 一个身份', 'A profile per agent')}${nov}</div>
            <div style="font-size:28px;line-height:1.7">${icon('shield', 32, 'var(--acc2)')} ${T('每单审批 / 花钱上限', 'Approval / limit')}${nov}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        H(`<div class="r" data-cap="0" data-delay="0.6" data-in="stamp" style="left:250px;top:160px">${badge(T('拦', 'NO'), 'var(--red)', 40)}</div>`);
        H(`<div class="r" data-cap="0" style="left:0;top:530px">${src('TechCrunch · Oct 21')}</div>`);
      } },

    // 6 · My take + what to do (opinion)
    { title: ['我的看法', 'My take'],
      cap: [['我的看法：接口有了，缺的是信任。', 'My take: the plumbing exists. Trust is missing.'],
            ['做 agent，先设计“人来批准”', 'If you build agents, design human approval'],
            ['和花钱上限。', 'and spending limits first.'],
            ['再盯一下：agent 订单会进财报吗？', 'And watch: will agent orders become a reported metric?']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:10px">${badge(T('观点 · 非事实', 'Opinion, not fact'), 'var(--yel)', 28)}</div>`);
        H(card(0, 70, 400, 190, `<div style="padding:26px 30px">${icon('check', 46, 'var(--acc2)')}${big(T('接口 / MCP', 'API / MCP'), 36)}${small(T('已经有了', 'already exists'), 26)}</div>`, 'border-color:var(--acc2)')).dataset.cap = 0;
        H(`<svg class="r" data-cap="0" data-delay="0.6" data-in="left" style="left:420px;top:140px" width="120" height="50"><path d="M4 25H100" stroke="#4A5160" stroke-width="4" stroke-linecap="round"/><path d="M90 10l18 15-18 15" fill="none" stroke="#4A5160" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
        { const e = H(card(560, 70, 400, 190, `<div style="padding:26px 30px">${icon('shield', 46, 'var(--acc)')}${big(T('信任', 'Trust'), 36, 'var(--acc)')}${small(T('真正的瓶颈', 'the real bottleneck'), 26)}</div>`, 'border-color:var(--acc);border-width:4px')); e.dataset.cap = 0; e.dataset.delay = '0.9'; }
        H(card(0, 300, 960, 230, `<div style="padding:26px 34px">${big(T('做 agent，先做', 'If you build agents, first build'), 34, 'var(--acc2)')}
            <div style="font-size:32px;line-height:1.7;margin-top:8px">${icon('user', 36, 'var(--acc2)')} ${T('人来批准', 'Human approval')}</div>
            <div style="font-size:32px;line-height:1.7">${icon('card', 36, 'var(--acc2)')} ${T('花钱上限', 'Spending limits')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        H(card(0, 560, 960, 120, `<div style="display:flex;align-items:center;gap:18px;padding:0 34px;height:100%">${icon('clock', 44, 'var(--blue)')}
            <div style="font-size:30px">${T('信号：“几百单”会变成财报里的正式指标吗？', 'Signal: will "hundreds" become a reported metric?')}</div></div>`, 'border-color:var(--blue)')).dataset.cap = 3;
      } },

    // 7 · One-card summary
    { title: ['一张图总结', 'One-card summary'],
      cap: [['总结：路通了，单还没来，', 'In short: the road is built, the orders are not.'],
            ['赢在信任，不在接口。', 'Trust wins, not the API.']],
      build() {
        const row = (y, k, v, c, cap) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:120px;display:grid;grid-template-columns:260px 1fr;align-items:center;padding:0 34px">
            <div style="font-size:32px;font-weight:800;color:${c}">${k}</div><div style="font-size:30px">${v}</div></div>`;
        H(row(10, T('现状', 'Today'), T('agent 至今几百单 · 一季度 9.93 亿单', 'hundreds so far vs 993M in Q3'), 'var(--acc)', 0));
        H(row(145, T('接口', 'Plumbing'), T('MCP：DoorDash、沃尔玛', 'MCP: DoorDash, Walmart'), 'var(--blue)', 0));
        H(row(280, T('分歧', 'Split'), T('亚马逊拦 · 沃尔玛开', 'Amazon blocks · Walmart opens'), 'var(--yel)', 0));
        H(row(415, T('我的看法', 'My take'), T('批准 · 上限 · 信任', 'approval · limits · trust'), 'var(--acc2)', 1));
        H(`<div class="r card center" data-cap="1" data-delay="0.6" data-in="pop" style="left:0;right:0;top:570px;height:130px;border-color:var(--acc);font-size:40px;font-weight:800">${T('赢在信任，不在接口', 'Trust wins, not the API')}</div>`);
      } },

    // 8 · Quiz
    { title: ['考考你', 'Quick quiz'],
      cap: [['考考你：到目前为止，', 'Quick quiz: so far, about how many orders'],
            {zh: '第三方 AI agent 一共下了多少单？', en: 'have third-party AI agents placed on DoorDash?', say_zh: '第三方 A I agent，一共给 DoorDash 下了大约多少单？', say_en: 'have third-party A I agents placed on DoorDash?'},
            ['几百，还是几百万？评论区告诉我。', 'Hundreds or millions? Tell me in the comments.']],
      build() {
        H(card(0, 40, 960, 230, `<div class="center" style="flex-direction:column;height:100%;gap:10px;padding:0 30px;text-align:center">
            ${big(T('到目前为止，第三方 AI agent<br>一共给 DoorDash 下了大约多少单？', 'So far, about how many orders have<br>third-party AI agents placed on DoorDash?'), 38)}</div>`)).dataset.cap = 0;
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:320px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:400px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('几百单', 'Hundreds')}</div>
          <div class="card center h" style="width:400px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('几百万单', 'Millions')}</div></div>`);
        H(`<div class="r h acc" data-cap="2" data-delay="0.6" style="left:0;right:0;top:520px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
