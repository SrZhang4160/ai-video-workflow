// 每日 AI 快讯 #2 · Claude API 消息线程公测：像客服建档案，长对话只发新消息 (sources in meta.json → sources)
// Voice: the user records this episode (engine/own_voice.py); captions are written to be read aloud.
const card = (x, y, w, h, inner, extra = '') =>
  `<div class="r card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">${inner}</div>`;
const big = (text, size = 44, color = 'var(--ink)') => `<div style="font-size:${size}px;font-weight:800;color:${color};line-height:1.2">${text}</div>`;
const small = (text, size = 26) => `<div style="font-size:${size}px;color:var(--quiet);line-height:1.35;margin-top:8px">${text}</div>`;
const row = (y, ic, col, text, cap, delay = 0) => `<div class="r card" data-cap="${cap}" ${delay ? `data-delay="${delay}"` : ''} style="left:0;right:0;top:${y}px;height:100px;display:flex;align-items:center;gap:22px;padding:0 30px;border-left:8px solid ${col}">
    ${icon(ic, 42, col)}<div style="font-size:30px;font-weight:700">${text}</div></div>`;
// one request as a stack of message bars; n = how many old turns, fresh = how many new
const req = (x, y, label, n, fresh, col, cap, delay = 0) => {
  const bars = Array.from({length: n}, (_, k) => `<div style="height:14px;border-radius:5px;margin-top:5px;background:${k < n - fresh ? '#3A5588' : col}"></div>`).join('');
  return `<div class="r card" data-cap="${cap}" data-delay="${delay}" style="left:${x}px;top:${y}px;width:430px;padding:18px 22px;border-color:${col}">
    <div style="font-size:26px;font-weight:800;color:${col}">${label}</div>${bars}</div>`;
};

window.EPISODE = {
  n: 2,
  theme: 'news',
  tag: ['AI 快讯', 'AI News'],
  scenes: [
    // 1 · Hook: tell it as a story. The model remembers nothing, so the app retells the whole chat every turn
    { tag: ['头条', 'TOP STORY'], title: ['AI 每次都要你从头讲一遍', 'The AI makes you retell everything'],
      cap: [['你跟 AI 聊天，它其实不记得上一句。', "When you chat with an AI, it doesn't remember the last line."],
            ['每说一句，程序都要把聊天记录，从头再发一遍。', 'Each time you speak, the app resends the whole chat from the top.'],
            ['就像打客服电话，每次都要从头讲一遍。', 'Like calling support and retelling your story every single time.'],
            ['对话越久，要讲的越多，它开口就越慢。', 'The longer the chat, the more to retell, the slower the reply starts.']],
      build() {
        H(card(0, 10, 960, 110, `<div style="display:flex;align-items:center;gap:22px;padding:0 30px;height:100%">${icon('cross', 48, 'var(--red)')}
            <div style="font-size:32px;font-weight:800">${T('模型不记得上一句', 'The model forgets the last line')}</div></div>`, 'border-color:var(--red)')).dataset.cap = 0;
        H(req(0, 150, T('第 1 句', 'Line 1'), 2, 1, 'var(--blue)', 1));
        H(req(0, 285, T('第 5 句', 'Line 5'), 6, 1, 'var(--blue)', 1, 0.5));
        H(req(0, 500, T('第 20 句', 'Line 20'), 12, 1, 'var(--red)', 1, 1.0));
        H(card(470, 150, 490, 290, `<div style="padding:26px 28px">${icon('user', 54, 'var(--yel)')}
            ${big(T('像打客服电话', 'Like calling support'), 36, 'var(--yel)')}${small(T('每次都从头讲：<br>“我上周买了…”', 'Every call starts over:<br>"Last week I bought…"'), 28)}</div>`, 'border-color:var(--yel)')).dataset.cap = 2;
        H(`<div class="r center" data-cap="3" style="left:470px;top:470px;width:490px;height:290px;flex-direction:column;gap:10px">
            ${icon('clock', 90, 'var(--red)')}${big(T('越长 → 开口越慢', 'Longer → slower start'), 38, 'var(--red)')}</div>`);
      } },

    // 2 · News: what launched, told with the same case-file story
    { tag: ['新闻', 'NEWS'], title: ['消息线程：给对话建个档案', 'Message threads: a case file for the chat'],
      cap: [['昨天，Claude 的 API 上线了一个新功能，', "Yesterday, Anthropic's Claude API added a new feature,"],
            ['叫消息线程，相当于客服给你建了个档案。', "message threads. It's like support opening a case file for you."],
            ['第一次，你把来龙去脉全讲一遍；', 'The first time, you tell the whole story once.'],
            ['之后只说新的那一句，再报上档案号。', 'After that, you say only the new part and give the case number.'],
            ['这个档案号，就是上一条回复的编号。', 'That case number is the ID of the previous reply.']],
      build() {
        H(card(0, 10, 960, 120, `<div style="display:flex;align-items:center;gap:20px;padding:0 30px;height:100%">${badge('Message threads', 'var(--acc2)', 28)}
            <div style="font-size:30px;font-weight:800">${T('公测 · 11 月 2 日', 'Public beta · Nov 2')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 0;
        H(`<div class="r" data-cap="0" data-delay="0.6" style="left:0;top:145px">${src('Anthropic · Nov 2')}</div>`);
        H(card(0, 210, 960, 110, `<div style="display:flex;align-items:center;gap:22px;padding:0 30px;height:100%">${icon('box', 50, 'var(--yel)')}
            <div style="font-size:32px;font-weight:800">${T('= 服务器替你存着对话', '= the server keeps the chat for you')}</div></div>`, 'border-color:var(--yel)')).dataset.cap = 1;
        H(card(0, 345, 960, 130, `<div style="padding:20px 30px" class="mono">
            <div style="font-size:26px;line-height:1.6"><span class="q">// ${T('第 1 次：全讲一遍', 'request 1: tell it all')}</span><br>"thread": { "type": <span class="st">"create"</span> }  <span class="q">+ ${T('完整对话', 'full chat')}</span></div></div>`)).dataset.cap = 2;
        H(card(0, 500, 960, 170, `<div style="padding:20px 30px" class="mono">
            <div style="font-size:26px;line-height:1.6"><span class="q">// ${T('之后：只说新的 + 档案号', 'later: only the new part + case number')}</span><br>"thread": { "type": <span class="st">"continue"</span>,<br>&nbsp;&nbsp;"previous_message_id": <span class="nu">"msg_…"</span> }</div></div>`)).dataset.cap = 3;
        H(`<div class="r" data-cap="4" style="left:0;top:700px;display:flex;align-items:center;gap:16px">${icon('key', 44, 'var(--acc2)')}
            <span style="font-size:30px;font-weight:800">${T('档案号 = 上一条回复的 ID', 'Case number = previous reply ID')}</span></div>`);
      } },

    // 3 · News: the number, and where it comes from
    { tag: ['新闻', 'NEWS'], title: ['官方数据：快了多少？', 'Official numbers: how much faster?'],
      cap: [['官方称：50 万到 100 万 token 的超长请求，', 'Anthropic says: on very long requests of 500K to 1M tokens,'],
            ['等第一个字的时间，中位数少了约 35%。', 'the median wait for the first token dropped about 35%.'],
            ['这是 Claude Code 里测的，大部分用户已默认开启。', "That's measured in Claude Code, where it's on for most users."]],
      build() {
        H(card(0, 10, 960, 300, `<div class="center" style="flex-direction:column;height:100%;gap:4px">
            ${small(T('50 万–100 万 token 的请求 · 首字等待中位数', '500K–1M-token requests · median time to first token'), 28)}
            <div style="font-size:130px;font-weight:900;color:var(--acc2);line-height:1.1">−35%</div>
            <div style="font-size:24px;color:var(--yel)">${T('官方称', 'Anthropic says')}</div></div>`, 'border-color:var(--acc2);border-width:4px')).dataset.cap = 0;
        H(card(0, 340, 960, 110, `<div style="display:flex;align-items:center;gap:22px;padding:0 30px;height:100%">${icon('rocket', 46, 'var(--blue)')}
            <div style="font-size:30px;font-weight:800">${T('数据来自 Claude Code · 多数用户已默认开启', 'From Claude Code · on by default for most users')}</div></div>`, 'border-color:var(--blue)')).dataset.cap = 2;
        H(`<div class="r" data-cap="2" data-delay="0.6" style="left:0;right:0;top:480px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
            ${['Claude API', 'Claude Platform on AWS', T('Google Cloud（Anthropic 托管）', 'Google Cloud (Anthropic-managed)'), 'Microsoft Foundry'].map(p => `<span class="chip">${p}</span>`).join('')}</div>`);
      } },

    // 4 · How it works: why faster, and what it does NOT change
    { tag: ['原理', 'HOW IT WORKS'], title: ['快在哪？钱省了吗？', 'Faster how? Cheaper?'],
      cap: [['快在哪？以前每次整段对话都要再传、再处理；', 'Why faster? Before, each turn re-uploaded and re-processed it all.'],
            ['现在对话留在服务器上，主要只处理新的一句。', 'Now the chat stays on the server; mainly the new part gets processed.'],
            ['但模型每一次，还是要把整段对话读一遍，', 'But the model still reads the whole conversation each time,'],
            ['所以计费的用量、价格和限额都不变。', 'so billed tokens, prices and rate limits stay the same.']],
      build() {
        H(req(0, 10, T('以前 · 每次整段重发', 'Before · resend it all'), 10, 10, 'var(--red)', 0));
        H(req(530, 10, T('现在 · 只发新的', 'Now · only the new part'), 10, 1, 'var(--acc2)', 1));
        H(`<div class="r" data-cap="1" data-delay="0.6" style="left:530px;top:285px;font-size:24px;color:var(--quiet)">${T('灰色 = 已存在服务器上', 'grey = already on the server')}</div>`);
        H(card(0, 420, 960, 260, `<div style="padding:26px 34px">${big(T('不变的', 'What does not change'), 34, 'var(--yel)')}
            <div style="display:flex;gap:40px;margin-top:22px;font-size:32px;font-weight:700">
              <span>${icon('box', 38, 'var(--yel)')} ${T('token 用量', 'Tokens')}</span><span>${icon('card', 38, 'var(--yel)')} ${T('价格', 'Price')}</span><span>${icon('gear', 38, 'var(--yel)')} ${T('限额', 'Rate limits')}</span></div>
            ${small(T('模型每次仍读完整对话', 'the model still reads the full conversation each turn'), 26)}</div>`, 'border-color:var(--yel)')).dataset.cap = 2;
      } },

    // 5 · News: the rules
    { tag: ['新闻', 'NEWS'], title: ['用之前要知道的规矩', 'Rules to know first'],
      cap: [['规矩有几条：线程五分钟没请求就过期，', 'The rules: a thread expires 5 minutes after its last request,'],
            ['过期再接会返回 404，只能从头再发一遍。', 'and continuing then returns a 404, so you resend it all.'],
            ['只能往后加，每个回复编号只能接一次；', "It's append-only, and each reply ID can be continued once."],
            ['流式输出时，要等回复完全结束再接下一轮。', 'When streaming, wait until the reply fully ends before the next turn.'],
            ['而且没有接口能列出、读取或删除线程。', "And there's no API to list, read or delete a thread."]],
      build() {
        H(row(10, 'clock', 'var(--red)', T('5 分钟没请求 → 过期 → 404 → 整段重发', '5 min idle → expires → 404 → resend all'), 0));
        H(row(130, 'retry', 'var(--blue)', T('只能往后加 · 每个回复 ID 只能接一次', 'Append-only · each response ID continues once'), 2));
        H(row(250, 'rocket', 'var(--blue)', T('流式：等回复结束（message_stop）', 'Streaming: wait for message_stop'), 3));
        H(row(370, 'cross', 'var(--yel)', T('没有列出 / 读取 / 删除线程的接口', 'No API to list / read / delete threads'), 4));
        H(`<div class="r" data-cap="0" data-delay="0.8" style="left:0;top:500px">${src('Claude API docs · message threads')}</div>`);
      } },

    // 6 · News: data and what it does not work with
    { tag: ['新闻', 'NEWS'], title: ['数据存哪？哪些不能用？', 'Where is the data? What is excluded?'],
      cap: [['数据方面：线程加密放内存里，不写进硬盘，', 'Data: threads are encrypted in memory, never written to disk,'],
            ['最晚 1 小时删除，但不支持零数据保留和 HIPAA。', 'deleted within an hour; not eligible for ZDR or HIPAA.'],
            ['批量处理、token 计数、压缩等，都不能一起用。', "And it doesn't work with batches, token counting, compaction and more."]],
      build() {
        H(card(0, 10, 960, 220, `<div style="display:flex;align-items:center;gap:30px;padding:0 36px;height:100%">${icon('shield', 100, 'var(--acc2)')}
            <div>${big(T('内存 · 加密 · 不落盘', 'In memory · encrypted · not on disk'), 36)}${small(T('最晚 1 小时后删除', 'deleted within 1 hour of last use'), 28)}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 0;
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:270px;display:flex;gap:18px;justify-content:center">
            ${[T('零数据保留 ZDR', 'Zero data retention'), 'HIPAA'].map(t => `<span class="chip" style="border-color:var(--red);font-size:30px">${icon('cross', 30, 'var(--red)')} ${t}</span>`).join('')}</div>`);
        H(card(0, 380, 960, 260, `<div style="padding:26px 34px">${big(T('不支持', 'Not supported'), 32, 'var(--red)')}
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:18px">${[T('批处理 Batches', 'Message Batches'), T('token 计数', 'Token counting'), T('压缩 compaction', 'Compaction'), T('多数上下文编辑', 'Most context editing')].map(t => `<span class="chip" style="font-size:28px">${t}</span>`).join('')}</div></div>`, 'border-color:var(--red)')).dataset.cap = 2;
      } },

    // 7 · Opinion (labelled)
    { tag: ['观点', 'MY TAKE'], title: ['谁该用？', 'Who should use it?'],
      cap: [['我的看法：这是给要跑很久的 agent 准备的。', 'My take: this is built for long-running agents.'],
            ['短对话省不了多少；超长的编程 agent 最划算。', 'Short chats save little; very long coding agents gain the most.'],
            ['聊天记录你自己也要存一份，过期了好从头再发。', 'Keep your own copy of the chat, so you can resend it when it expires.']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:10px">${badge(T('观点 · 非事实', 'Opinion, not fact'), 'var(--yel)', 26)}</div>`);
        H(card(0, 70, 440, 220, `<div style="padding:28px">${icon('user', 46, 'var(--quiet)')}${big(T('聊几句', 'Short chats'), 36)}${small(T('收益不大', 'little gain'), 26)}</div>`)).dataset.cap = 1;
        { const e = H(card(520, 70, 440, 220, `<div style="padding:28px">${icon('rocket', 46, 'var(--acc2)')}${big(T('长上下文 agent', 'Long-context agents'), 36, 'var(--acc2)')}${small(T('编码 · 电脑操作 · 大文档', 'coding · computer use · big docs'), 26)}</div>`, 'border-color:var(--acc2);border-width:4px')); e.dataset.cap = 1; e.dataset.delay = '0.6'; }
        H(card(0, 330, 960, 200, `<div style="display:flex;align-items:center;gap:26px;padding:0 34px;height:100%">${icon('db', 70, 'var(--blue)')}
            <div>${big(T('自己留一份底稿', 'Keep your own copy'), 34, 'var(--blue)')}${small(T('档案过期 → 整段重发', 'thread expires → resend it all'), 26)}</div></div>`, 'border-color:var(--blue)')).dataset.cap = 2;
      } },

    // 8 · Summary + what to watch (no quiz in this series)
    { tag: ['总结', 'SUMMARY'], title: ['一句话 + 接下来看什么', 'In one line, and what to watch'],
      cap: [['一句话：档案留在服务器上，你只说新的；', 'In one line: the chat stays on the server, you send only the new part.'],
            ['超长对话回复更快，价格不变。', 'Long chats reply sooner, at the same price.'],
            ['接下来看：什么时候结束公测，', 'Watch for when it leaves beta,'],
            ['以及会不会补上查看、删除线程的接口。', 'and whether an API to view and delete threads arrives.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;right:0;top:20px;height:130px;border-color:var(--acc);border-width:4px;font-size:42px;font-weight:900">${T('对话存服务器 · 只发新的', 'Chat stays on server · send only new')}</div>`);
        H(`<div class="r card center" data-cap="1" data-in="pop" style="left:0;right:0;top:170px;height:110px;border-color:var(--acc2);font-size:36px;font-weight:800">${T('长对话更快出字 · 价格不变', 'Long chats: first token sooner · same price')}</div>`);
        H(`<div class="r" data-cap="2" style="left:0;top:320px">${badge(T('接下来看', 'What to watch'), 'var(--blue)', 28)}</div>`);
        H(row(380, 'clock', 'var(--blue)', T('什么时候结束公测？', 'When does it leave beta?'), 2));
        H(row(500, 'clock', 'var(--blue)', T('会有查看 / 删除线程的接口吗？', 'An API to view / delete threads?'), 3));
      } },
  ],
};
