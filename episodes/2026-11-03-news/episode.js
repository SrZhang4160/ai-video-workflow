// 每日 AI 快讯 #2 · Claude API 消息线程公测：长对话只发新消息 (sources in meta.json → sources)
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
    // 1 · Hook: the pain every agent builder knows
    { tag: ['头条', 'TOP STORY'], title: ['agent 不用每轮重发整段对话了', 'Agents stop resending the whole chat'],
      cap: [['做 AI agent，每一轮都要把整段对话重新发一遍。', 'Building an AI agent? Every turn, you resend the whole conversation.'],
            ['对话越长，等第一个字就越久。', 'The longer it gets, the longer you wait for the first token.'],
            ['昨天 Anthropic 推出「消息线程」：只发新的。', 'Yesterday Anthropic launched message threads: send only what is new.']],
      build() {
        H(req(0, 10, T('第 1 轮', 'Turn 1'), 2, 1, 'var(--blue)', 0));
        H(req(0, 135, T('第 5 轮', 'Turn 5'), 6, 1, 'var(--blue)', 0, 0.5));
        H(req(0, 335, T('第 20 轮', 'Turn 20'), 12, 1, 'var(--red)', 1));
        H(`<div class="r center" data-cap="1" data-delay="0.4" style="left:470px;top:140px;width:490px;height:300px;flex-direction:column;gap:6px">
            ${icon('clock', 90, 'var(--red)')}${big(T('首字等待 ↑', 'Wait for first token ↑'), 40, 'var(--red)')}</div>`);
        H(card(0, 690, 960, 110, `<div style="display:flex;align-items:center;gap:20px;padding:0 30px;height:100%">${badge('Message threads', 'var(--acc2)', 28)}
            <div style="font-size:32px;font-weight:800">${T('只发新消息', 'Send only the new messages')}</div><span class="s" style="margin-left:auto">${T('11 月 2 日 · 公测', 'Nov 2 · public beta')}</span></div>`, 'border-color:var(--acc2)')).dataset.cap = 2;
      } },

    // 2 · News: what launched, the number, where
    { tag: ['新闻', 'NEWS'], title: ['Claude API 消息线程公测', 'Message threads, public beta'],
      cap: [['第一次发完整对话，开一个线程；', 'The first request sends the full conversation and opens a thread.'],
            ['之后只发新消息，再带上上一条回复的 ID。', 'After that, only the new messages and the previous response ID.'],
            ['官方称：50 万到 100 万 token 的请求，', 'Anthropic says: on requests of 500K to 1M tokens,'],
            ['首字等待的中位数降了大约 35%。', 'median time to first token fell by about 35%.'],
            ['这是 Claude Code 的数据，大部分用户已默认开启。', "That's from Claude Code, where it's already on for most users."]],
      build() {
        H(card(0, 10, 960, 260, `<div style="padding:24px 30px">
            <div class="mono" style="font-size:26px;line-height:1.6"><span class="q">// ${T('第 1 次', 'request 1')}</span><br>"thread": { "type": <span class="st">"create"</span> }  <span class="q">+ ${T('完整对话', 'full conversation')}</span></div>
            <div class="mono" style="font-size:26px;line-height:1.6;margin-top:12px"><span class="q">// ${T('之后每次', 'every later request')}</span><br>"thread": { "type": <span class="st">"continue"</span>,<br>&nbsp;&nbsp;"previous_message_id": <span class="nu">"msg_…"</span> }  <span class="q">+ ${T('新消息', 'new messages')}</span></div></div>`)).dataset.cap = 0;
        H(card(0, 300, 960, 230, `<div class="center" style="flex-direction:column;height:100%;gap:4px">
            ${small(T('500K–1M token 请求 · 首字等待中位数', '500K–1M-token requests · median time to first token'), 28)}
            <div style="font-size:120px;font-weight:900;color:var(--acc2);line-height:1.1">−35%</div>
            <div style="font-size:24px;color:var(--yel)">${T('官方称 · Claude Code 数据', 'Anthropic says · Claude Code data')}</div></div>`, 'border-color:var(--acc2);border-width:4px')).dataset.cap = 2;
        H(`<div class="r" data-cap="4" style="left:0;right:0;top:560px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
            ${['Claude API', 'Claude Platform on AWS', T('Google Cloud（Anthropic 托管）', 'Google Cloud (Anthropic-managed)'), 'Microsoft Foundry'].map(p => `<span class="chip">${p}</span>`).join('')}</div>`);
        H(`<div class="r" data-cap="2" data-delay="0.8" style="left:0;top:680px">${src('Anthropic · Nov 2')}</div>`);
      } },

    // 3 · Analysis: why it is faster, and what it does NOT change
    { tag: ['原理', 'HOW IT WORKS'], title: ['快在哪？钱省了吗？', 'Faster how? Cheaper?'],
      cap: [['以前每轮都要重传、校验、分词整段对话；', 'Before, every turn re-sent and re-tokenized the whole chat.'],
            ['现在对话留在服务器上，主要只处理新的一轮。', 'Now the chat stays on the server; mostly just the new turn is processed.'],
            ['但模型还是要读完整段对话，', 'But the model still reads the whole conversation,'],
            ['所以 token 用量、价格、限额都不变。', 'so tokens, prices and rate limits stay the same.']],
      build() {
        H(req(0, 10, T('以前 · 每轮整段重发', 'Before · resend it all'), 10, 10, 'var(--red)', 0));
        H(req(530, 10, T('现在 · 只发新的', 'Now · only the new turn'), 10, 1, 'var(--acc2)', 1));
        H(`<div class="r" data-cap="1" data-delay="0.6" style="left:530px;top:285px;font-size:24px;color:var(--quiet)">${T('灰色 = 已存在服务器上', 'grey = already on the server')}</div>`);
        H(card(0, 420, 960, 260, `<div style="padding:26px 34px">${big(T('不变的', 'What does not change'), 34, 'var(--yel)')}
            <div style="display:flex;gap:40px;margin-top:22px;font-size:32px;font-weight:700">
              <span>${icon('box', 38, 'var(--yel)')} ${T('token 用量', 'Tokens')}</span><span>${icon('card', 38, 'var(--yel)')} ${T('价格', 'Price')}</span><span>${icon('gear', 38, 'var(--yel)')} ${T('限额', 'Rate limits')}</span></div>
            ${small(T('模型每轮仍读完整对话', 'the model still reads the full conversation each turn'), 26)}</div>`, 'border-color:var(--yel)')).dataset.cap = 2;
      } },

    // 4 · News: the rules
    { tag: ['新闻', 'NEWS'], title: ['用之前要知道的规矩', 'Rules to know first'],
      cap: [['规矩有几条：线程 5 分钟没请求就过期，', 'The rules: a thread expires 5 minutes after its last request,'],
            ['过期再接会返回 404，要整段重发。', 'and continuing then returns a 404, so you resend it all.'],
            ['只能往后加，每个回复 ID 只能接一次；', "It's append-only, and each response ID can be continued once."],
            ['流式输出要等 message_stop 再接下一轮。', 'When streaming, wait for message_stop before the next turn.'],
            ['而且没有接口能列出、读取或删除线程。', "And there's no API to list, read or delete a thread."]],
      build() {
        H(row(10, 'clock', 'var(--red)', T('5 分钟没请求 → 过期 → 404 → 整段重发', '5 min idle → expires → 404 → resend all'), 0));
        H(row(130, 'retry', 'var(--blue)', T('只能往后加 · 每个回复 ID 只能接一次', 'Append-only · each response ID continues once'), 2));
        H(row(250, 'rocket', 'var(--blue)', T('流式：等 message_stop 再继续', 'Streaming: wait for message_stop'), 3));
        H(row(370, 'cross', 'var(--yel)', T('没有列出 / 读取 / 删除线程的接口', 'No API to list / read / delete threads'), 4));
        H(`<div class="r" data-cap="0" data-delay="0.8" style="left:0;top:500px">${src('Claude API docs · message threads')}</div>`);
      } },

    // 5 · News: data and what it does not work with
    { tag: ['新闻', 'NEWS'], title: ['数据存哪？哪些不能用？', 'Where is the data? What is excluded?'],
      cap: [['数据方面：线程加密放在内存里，不写磁盘，', 'Data: threads are encrypted in memory, never written to disk,'],
            ['最晚 1 小时删除，但不支持零数据保留和 HIPAA。', 'deleted within an hour; not eligible for ZDR or HIPAA.'],
            ['也不能和批处理、token 计数、压缩等一起用。', "And it doesn't work with batches, token counting, compaction and more."]],
      build() {
        H(card(0, 10, 960, 220, `<div style="display:flex;align-items:center;gap:30px;padding:0 36px;height:100%">${icon('shield', 100, 'var(--acc2)')}
            <div>${big(T('内存 · 加密 · 不落盘', 'In memory · encrypted · not on disk'), 36)}${small(T('最晚 1 小时后删除', 'deleted within 1 hour of last use'), 28)}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 0;
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:270px;display:flex;gap:18px;justify-content:center">
            ${[T('零数据保留 ZDR', 'Zero data retention'), 'HIPAA'].map(t => `<span class="chip" style="border-color:var(--red);font-size:30px">${icon('cross', 30, 'var(--red)')} ${t}</span>`).join('')}</div>`);
        H(card(0, 380, 960, 220, `<div style="padding:26px 34px">${big(T('不支持', 'Not supported'), 32, 'var(--red)')}
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:18px">${[T('批处理 Batches', 'Message Batches'), T('token 计数', 'Token counting'), T('压缩 compaction', 'Compaction'), T('多数上下文编辑', 'Most context editing')].map(t => `<span class="chip" style="font-size:28px">${t}</span>`).join('')}</div></div>`, 'border-color:var(--red)')).dataset.cap = 2;
      } },

    // 6 · Opinion (labelled)
    { tag: ['观点', 'MY TAKE'], title: ['谁该用？', 'Who should use it?'],
      cap: [['我的看法：这是给长时间跑的 agent 准备的。', 'My take: this is built for long-running agents.'],
            ['聊几句收益不大，长上下文编码 agent 最划算。', 'Short chats gain little; long-context coding agents gain the most.'],
            ['历史还得自己存，过期了要能整段重发。', 'But keep your own history, ready to replay when it expires.']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:10px">${badge(T('观点 · 非事实', 'Opinion, not fact'), 'var(--yel)', 26)}</div>`);
        H(card(0, 70, 440, 220, `<div style="padding:28px">${icon('user', 46, 'var(--quiet)')}${big(T('聊几句', 'Short chats'), 36)}${small(T('收益不大', 'little gain'), 26)}</div>`)).dataset.cap = 1;
        { const e = H(card(520, 70, 440, 220, `<div style="padding:28px">${icon('rocket', 46, 'var(--acc2)')}${big(T('长上下文 agent', 'Long-context agents'), 36, 'var(--acc2)')}${small(T('编码 · 电脑操作 · 大文档', 'coding · computer use · big docs'), 26)}</div>`, 'border-color:var(--acc2);border-width:4px')); e.dataset.cap = 1; e.dataset.delay = '0.6'; }
        H(card(0, 330, 960, 200, `<div style="display:flex;align-items:center;gap:26px;padding:0 34px;height:100%">${icon('db', 70, 'var(--blue)')}
            <div>${big(T('你的应用才是“真相”', 'Your app is the source of truth'), 34, 'var(--blue)')}${small(T('自己存历史 · 准备好整段重发', 'keep history · build the replay path'), 26)}</div></div>`, 'border-color:var(--blue)')).dataset.cap = 2;
      } },

    // 7 · Summary + what to watch (no quiz in this series)
    { tag: ['总结', 'SUMMARY'], title: ['一句话 + 接下来看什么', 'In one line, and what to watch'],
      cap: [['一句话：少传数据，更快出字，价格不变。', 'In one line: send less, get the first token sooner, same price.'],
            ['接下来看：什么时候结束公测，', 'Watch for when it leaves beta,'],
            ['以及会不会补上查看、删除线程的接口。', 'and whether an API to view and delete threads arrives.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;right:0;top:20px;height:150px;border-color:var(--acc);border-width:4px;font-size:44px;font-weight:900">${T('少传数据 · 更快出字 · 价格不变', 'Send less · first token sooner · same price')}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;top:210px">${badge(T('接下来看', 'What to watch'), 'var(--blue)', 28)}</div>`);
        H(row(270, 'clock', 'var(--blue)', T('什么时候结束公测？', 'When does it leave beta?'), 1));
        H(row(390, 'clock', 'var(--blue)', T('会有查看 / 删除线程的接口吗？', 'An API to view / delete threads?'), 2));
      } },
  ],
};
