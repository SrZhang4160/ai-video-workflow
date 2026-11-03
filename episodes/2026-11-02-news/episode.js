// 每日 AI 快讯 #1 · DoorDash：第三方 AI agent 至今只下了几百单 (sources in meta.json → sources)
// Voice: the user records this episode (engine/own_voice.py cuts the take into voice/<lang>/sNN.wav); captions are written to be read aloud.
const card = (x, y, w, h, inner, extra = '') =>
  `<div class="r card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">${inner}</div>`;
const big = (text, size = 44, color = 'var(--ink)') => `<div style="font-size:${size}px;font-weight:800;color:${color};line-height:1.2">${text}</div>`;
const small = (text, size = 26) => `<div style="font-size:${size}px;color:var(--quiet);line-height:1.35;margin-top:8px">${text}</div>`;
const arrowRight = (x, y, w, cap, delay) =>
  `<svg class="r" data-cap="${cap}" data-delay="${delay}" data-in="left" style="left:${x}px;top:${y}px" width="${w}" height="40"><path d="M4 20H${w - 14}" stroke="#5A73A0" stroke-width="4" stroke-linecap="round"/><path d="M${w - 24} 6l16 14-16 14" fill="none" stroke="#5A73A0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const row = (y, ic, col, text, cap, delay = 0) => `<div class="r card" data-cap="${cap}" ${delay ? `data-delay="${delay}"` : ''} style="left:0;right:0;top:${y}px;height:104px;display:flex;align-items:center;gap:22px;padding:0 30px;border-left:8px solid ${col}">
    ${icon(ic, 44, col)}<div style="font-size:31px;font-weight:700">${text}</div></div>`;

window.EPISODE = {
  n: 1,
  theme: 'news',
  tag: ['AI 快讯', 'AI News'],
  scenes: [
    // 1 · Hook: the two numbers, each with what it counts
    { tag: ['头条', 'TOP STORY'], title: ['AI 帮人点外卖，至今才几百单', 'AI agents: a few hundred orders, ever'],
      cap: [['第三方 AI agent 帮人在 DoorDash 点外卖，', 'Third-party AI agents ordering food on DoorDash'],
            ['到现在一共才几百单。', 'have placed maybe several hundred orders. In total.'],
            ['而 DoorDash 上个季度：9.93 亿单。', 'DoorDash handled 993 million orders last quarter alone.']],
      build() {
        H(card(0, 30, 960, 300, `<div class="center" style="flex-direction:column;height:100%;gap:8px">
            ${small(T('第三方 AI agent 下的单 · 至今累计', 'Orders from third-party AI agents · all time'), 30)}
            <div style="font-size:150px;font-weight:900;color:var(--acc);line-height:1.1">${T('几百', 'Hundreds')}</div></div>`, 'border-color:var(--acc);border-width:4px')).dataset.cap = 1;
        H(card(0, 370, 960, 260, `<div class="center" style="flex-direction:column;height:100%;gap:8px">
            ${small(T('DoorDash 全部订单 · 仅第三季度', 'All DoorDash orders · Q3 alone'), 30)}
            <div class="mono" style="font-size:104px;font-weight:900;color:var(--ink)">993,000,000</div></div>`)).dataset.cap = 2;
        H(`<div class="r" data-cap="2" data-delay="0.8" style="left:0;top:670px">${src('DoorDash Q3 2026 · TechCrunch')}</div>`);
      } },

    // 2 · News: who said it, which agents, the exact words
    { tag: ['新闻', 'NEWS'], title: ['CEO 在财报会上亲口说的', 'Said by the CEO on the earnings call'],
      cap: [['这是 CEO 在 10 月 29 日财报会上说的，', 'The CEO said it on the October 29 earnings call,'],
            ['提到的 agent 有 Meta 的 Muse、Instinct、Fo。', "naming agents like Meta's Muse, Instinct and Fo."],
            ['他说：别跟大势较劲，但也别自欺欺人。', '"Never fight gravity," he said, "but don\'t be delusional."']],
      build() {
        H(card(0, 20, 960, 110, `<div style="display:flex;align-items:center;gap:20px;padding:0 34px;height:100%">${badge('Q3 2026', 'var(--blue)', 28)}
            ${big(T('DoorDash 财报电话会', 'DoorDash earnings call'), 36)}<span class="s" style="margin-left:auto">${T('10 月 29 日', 'Oct 29')}</span></div>`)).dataset.cap = 0;
        H(card(0, 160, 960, 230, `<div style="padding:26px 40px">
            <div style="font-size:30px;color:var(--quiet)">Tony Xu · CEO</div>
            <div style="font-size:36px;font-weight:700;line-height:1.4;margin-top:10px">“we're seeing maybe <span class="acc">several hundred orders in total</span> from some of these third-party agents.”</div></div>`, 'border-left:10px solid var(--acc)')).dataset.cap = 0;
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:420px;display:flex;gap:18px;justify-content:center">
            ${['Muse · Meta', 'Instinct', 'Fo'].map(a => `<span class="chip" style="font-size:32px;padding:10px 26px">${icon('gear', 32, 'var(--blue)')} ${a}</span>`).join('')}</div>`);
        H(card(0, 530, 960, 180, `<div style="padding:24px 40px">
            <div style="font-size:32px;font-weight:700;line-height:1.4">“you never want to fight gravity. But at the same time, you don't want to be delusional”</div></div>`, 'border-left:10px solid var(--line)')).dataset.cap = 2;
        H(`<div class="r" data-cap="0" data-delay="0.8" style="left:0;top:740px">${src('TechCrunch · Oct 30')}</div>`);
      } },

    // 3 · News: DoorDash's own strategy (atoms first; its own agents; ads someday)
    { tag: ['新闻', 'NEWS'], title: ['DoorDash 押注的是「原子」', 'DoorDash is betting on atoms'],
      cap: [['DoorDash 在财报里说，它要赢的是「原子之战」：', 'In its Q3 letter, DoorDash says it wants to win "the battle for atoms":'],
            ['仓储、无人配送，把东西真正送到门口。', 'warehousing and autonomous delivery. Real things, to your door.'],
            ['AI 这边，它先做自己的 agent：', 'On AI, it built its own agents first:'],
            ['Ask DoorDash、短信下单、命令行下单。', 'Ask DoorDash, Text DoorDash, and a command-line agent.'],
            ['CEO 还说，以后可能在外部 agent 里卖广告。', 'And the CEO floated selling ads inside third-party agents someday.']],
      build() {
        H(card(0, 10, 960, 220, `<div style="display:flex;align-items:center;gap:30px;padding:0 40px;height:100%">${icon('box', 110, 'var(--acc)')}
            <div>${big(T('「原子之战」', '"The battle for atoms"'), 46, 'var(--acc)')}${small(T('仓储 · 无人配送 · 送到门口', 'warehousing · autonomous delivery · to your door'), 28)}</div></div>`, 'border-color:var(--acc);border-width:3px')).dataset.cap = 0;
        H(`<div class="r" data-cap="2" style="left:0;top:262px">${badge(T('自家 AI agent', 'Its own AI agents'), 'var(--blue)', 26)}</div>`);
        const own = [['Ask DoorDash', T('聊天找餐厅', 'chat to find food'), T('6 月', 'Jun')], ['Text DoorDash', T('发短信下单', 'order by text'), T('9 月', 'Sep')], ['CLI agent', T('命令行下单', 'order from the terminal'), T('7 月', 'Jul')]];
        own.forEach(([n, d, m], k) => { const e = H(card(k * 330, 310, 300, 180, `<div style="padding:22px 24px">${big(n, 30)}${small(d, 24)}<div style="font-family:JBM;font-size:22px;color:var(--blue);margin-top:10px">${m}</div></div>`, 'border-color:var(--blue)')); e.dataset.cap = 3; e.dataset.delay = String(k * 0.4); });
        H(card(0, 530, 960, 130, `<div style="display:flex;align-items:center;gap:22px;padding:0 34px;height:100%">${icon('card', 50, 'var(--yel)')}
            <div style="font-size:32px;font-weight:700">${T('下一步？在外部 agent 里做广告', 'Next? Ads inside third-party agents')}</div></div>`, 'border-color:var(--yel)')).dataset.cap = 4;
        H(`<div class="r" data-cap="0" data-delay="0.8" style="left:0;top:690px">${src('DoorDash Q3 2026 results · TechCrunch')}</div>`);
      } },

    // 4 · Analysis: why so few (the company gave no reason; two facts that explain it)
    { tag: ['分析', 'ANALYSIS'], title: ['为什么这么少？', 'Why so few?'],
      cap: [['为什么这么少？官方没解释，但有两个事实：', "Why so few? DoorDash didn't say. Two facts help:"],
            ['一，大部分人还是在 App 里自己点；', 'One: most people still order in the DoorDash app.'],
            ['二，给外部 agent 的门还很窄：', 'Two: the door for outside agents is narrow.'],
            ['MCP 连接器只面向企业订餐，还在小范围测试，', 'The MCP connector is for corporate ordering, in a limited beta,'],
            ['而且要员工先登录、同意条款。', 'and employees must sign in and accept the terms first.']],
      build() {
        H(card(0, 10, 960, 150, `<div style="display:flex;align-items:center;gap:24px;padding:0 34px;height:100%">${num(1, 'var(--blue)')}
            <div style="font-size:34px;font-weight:700">${T('大部分人还在 App 里自己点', 'Most people still order in the app')}</div></div>`, 'border-color:var(--blue)')).dataset.cap = 1;
        H(card(0, 190, 960, 150, `<div style="display:flex;align-items:center;gap:24px;padding:0 34px;height:100%">${num(2, 'var(--acc)')}
            <div style="font-size:34px;font-weight:700">${T('外部 agent 的门很窄', 'A narrow door for outside agents')}</div></div>`, 'border-color:var(--acc)')).dataset.cap = 2;
        const node = (x, ic, t, sub, col, delay) => `<div class="r card" data-cap="3" data-delay="${delay}" style="left:${x}px;top:390px;width:260px;height:180px;border-color:${col}">
            <div class="center" style="flex-direction:column;height:100%;gap:6px">${icon(ic, 50, col)}${big(t, 30)}<div style="font-size:22px;color:var(--quiet)">${sub}</div></div></div>`;
        H(node(0, 'gear', 'AI agent', T('第三方', 'third-party'), 'var(--blue)', 0));
        H(arrowRight(270, 460, 80, 3, 0.3));
        H(node(350, 'box', 'MCP', T('企业订餐 · 测试', 'corporate · beta'), 'var(--acc)', 0.5));
        H(arrowRight(620, 460, 80, 3, 0.8));
        H(node(700, 'card', 'DoorDash', T('找菜 · 下单 · 配送', 'find · order · track'), 'var(--acc2)', 1.0));
        H(`<div class="r" data-cap="4" style="left:0;right:0;top:600px;display:flex;gap:16px;justify-content:center">
            <span class="chip">${icon('user', 30, 'var(--yel)')} ${T('员工先登录', 'Employee signs in')}</span><span class="chip">${icon('check', 30, 'var(--yel)')} ${T('同意条款', 'Accepts the terms')}</span></div>`);
        H(`<div class="r" data-cap="3" data-delay="1.2" style="left:0;top:710px">${src('DoorDash Newsroom · Sep 30')}</div>`);
      } },

    // 5 · News: Amazon blocks, Walmart opens with rules
    { tag: ['新闻', 'NEWS'], title: ['亚马逊拦，沃尔玛开门', 'Amazon blocks. Walmart opens up.'],
      cap: [['别家也分成两派：亚马逊开始拦 agent 替人下单。', 'Retailers are split. Amazon started blocking agents from buying for shoppers.'],
            ['沃尔玛反而开了 MCP 入口，但规矩很细：', 'Walmart opened an MCP gateway instead, with tight rules:'],
            ['agent 拿不到你的支付信息；', "agents can't see your payment info;"],
            ['每个 agent 有单独身份，像信用卡附属卡；', 'each agent gets its own profile, like an authorized card user;'],
            ['每单可以审批，也能设花钱上限。', 'and you can approve every order or set a spending limit.']],
      build() {
        H(card(0, 10, 300, 640, `<div style="padding:30px 26px">${big('Amazon', 42)}
            <div style="margin:60px 0 40px;text-align:center">${icon('cross', 140, 'var(--red)')}</div>
            ${big(T('拦住 agent 替人下单', 'Blocks agent purchases'), 32, 'var(--red)')}</div>`, 'border-color:var(--red)')).dataset.cap = 0;
        H(card(330, 10, 630, 640, `<div style="padding:30px">
            ${big('Walmart', 42)}<div style="margin:14px 0 22px">${badge('Agent Gateway · MCP', 'var(--acc2)', 26)}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        const rule = (y, ic, t, cap) => `<div class="r" data-cap="${cap}" style="left:360px;width:580px;top:${y}px;font-size:31px;font-weight:700;line-height:1.35;display:flex;gap:16px;align-items:flex-start">${icon(ic, 40, 'var(--acc2)')}<span>${t}</span></div>`;
        H(rule(200, 'key', T('拿不到支付信息', 'No access to payment info'), 2));
        H(rule(310, 'user', T('每个 agent 单独身份<br><span style="font-size:24px;color:var(--quiet);font-weight:500">像信用卡附属卡 · 11 月上线</span>', 'A profile per agent<br><span style="font-size:24px;color:var(--quiet);font-weight:500">like an authorized card user · from Nov</span>'), 3));
        H(rule(450, 'shield', T('每单审批 / 花钱上限', 'Per-order approval / spending limit'), 4));
        H(`<div class="r" data-cap="0" data-delay="0.8" style="left:0;top:690px">${src('TechCrunch · Oct 21')}</div>`);
      } },

    // 6 · Opinion (labelled)
    { tag: ['观点', 'MY TAKE'], title: ['卡住的不是接口，是信任', "It's not the API. It's trust."],
      cap: [['我的看法：接口已经有了，缺的是信任。', 'My take: the plumbing is there. Trust is not.'],
            ['平台愿意放 agent 进来，但要按它的规矩。', "Platforms will let agents in, but on the platform's terms."],
            ['做 agent 的话，先把审批和花钱上限做好。', 'If you build agents, ship approval and spending limits first.']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:10px">${badge(T('观点 · 非事实', 'Opinion, not fact'), 'var(--yel)', 26)}</div>`);
        H(card(0, 70, 440, 200, `<div style="padding:28px">${icon('check', 46, 'var(--acc2)')}${big(T('接口 / MCP', 'API / MCP'), 36)}${small(T('已经有了', 'already there'), 26)}</div>`, 'border-color:var(--acc2)')).dataset.cap = 0;
        { const e = H(card(520, 70, 440, 200, `<div style="padding:28px">${icon('shield', 46, 'var(--acc)')}${big(T('信任', 'Trust'), 36, 'var(--acc)')}${small(T('真正的瓶颈', 'the real bottleneck'), 26)}</div>`, 'border-color:var(--acc);border-width:4px')); e.dataset.cap = 0; e.dataset.delay = '0.8'; }
        H(`<div class="r center" data-cap="1" data-in="pop" style="left:0;right:0;top:310px;height:110px;font-size:40px;font-weight:800">${T('平台的门 · 平台的规矩', "The platform's door, the platform's rules")}</div>`);
        H(card(0, 450, 960, 220, `<div style="padding:26px 34px">${big(T('做 agent，先做', 'Building agents? Ship these first'), 34, 'var(--acc2)')}
            <div style="font-size:32px;line-height:1.7;margin-top:8px">${icon('user', 36, 'var(--acc2)')} ${T('人来审批', 'Human approval')} &nbsp;&nbsp; ${icon('card', 36, 'var(--acc2)')} ${T('花钱上限', 'Spending limits')} &nbsp;&nbsp; ${icon('key', 36, 'var(--acc2)')} ${T('不碰支付信息', 'No payment data')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 2;
      } },

    // 7 · Summary + what to watch (no quiz in this series)
    { tag: ['总结', 'SUMMARY'], title: ['一句话 + 接下来看什么', 'In one line, and what to watch'],
      cap: [['一句话：路通了，单还没来。', "In one line: the road is built; the orders aren't here."],
            ['接下来看：沃尔玛 agent 身份上线，', "Watch for Walmart's agent profiles rolling out,"],
            ['和 DoorDash 会不会公布 agent 订单数。', 'and whether DoorDash starts reporting agent orders.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;right:0;top:20px;height:150px;border-color:var(--acc);border-width:4px;font-size:48px;font-weight:900">${T('路通了，单还没来', "Road built. Orders aren't here.")}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;top:210px">${badge(T('接下来看', 'What to watch'), 'var(--blue)', 28)}</div>`);
        H(row(270, 'clock', 'var(--blue)', T('沃尔玛 agent 身份 · 11 月上线', 'Walmart agent profiles · rolling out in Nov'), 1));
        H(row(394, 'clock', 'var(--blue)', T('DoorDash 会公布 agent 订单数吗？', 'Will DoorDash report agent orders?'), 2));
      } },
  ],
};
