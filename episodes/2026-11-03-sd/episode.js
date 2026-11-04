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
      cap: [['系统设计面试，一上来就画图？', 'System design interview: start drawing right away?'],
            ['其实很容易丢分。', "That's an easy way to lose points."],
            ['比如面试官说：设计一个短链接服务。', 'Say the interviewer asks: "Design a URL shortener."'],
            ['很多人听完，马上拿笔画图：', 'Many people grab the pen right away'],
            ['一台服务器，后面接一个数据库。', 'and draw a server with a database behind it.'],
            ['问题是，你还不知道系统要做什么，', "The problem: you don't know yet what it must do,"],
            ['也不知道要做到什么程度。', 'or how well it has to do it.'],
            ['所以第一步不是画图，是问需求。', "So step one isn't drawing. It's asking about requirements."]],
      build() {
        H(`<div class="r card" data-cap="2" style="left:0;right:0;top:20px;height:170px;display:flex;align-items:center;gap:30px;padding:0 40px">
          ${icon('user', 90, 'var(--blue)')}<div class="h" style="font-size:${T('46px', '40px')}">“${T('设计一个短链接服务', 'Design a URL shortener')}”</div></div>`);
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:220px;height:290px;border-style:dashed">
          ${box(120, 90, 200, 100, lbl('服务器', 'Server', 30))}${arr(340, 125, 100)}${box(460, 90, 200, 100, lbl('数据库', 'Database', 30))}</div>`);
        H(`<div class="r" data-cap="1" data-in="stamp" data-shake="1" style="left:740px;top:300px">${icon('cross', 140, 'var(--red)')}</div>`);
        H(`<div class="r card center" data-cap="5" data-in="pop" style="left:0;width:450px;top:545px;height:120px;border-style:dashed;border-color:var(--yel)"><span class="h yel" style="font-size:${T('40px', '34px')}">${T('做什么？', 'Does what?')}</span></div>`);
        H(`<div class="r card center" data-cap="6" data-in="pop" style="left:510px;width:450px;top:545px;height:120px;border-style:dashed;border-color:var(--yel)"><span class="h yel" style="font-size:${T('40px', '34px')}">${T('做多好？', 'How well?')}</span></div>`);
        H(`<div class="r card center" data-cap="7" data-in="pop" style="left:120px;right:120px;top:700px;height:150px;gap:24px;border-color:var(--acc)">
          ${num(1)}<span class="h" style="font-size:48px">${T('先问<span class="acc">需求</span>', 'Ask the <span class="acc">requirements</span>')}</span></div>`);
      } },

    { title: ['需求分两种', 'Two kinds of requirements'],
      cap: [['需求，就是你和面试官约定好，', 'Requirements are what you and the interviewer agree'],
            ['这个系统最后要交付什么。', 'the system has to deliver.'],
            ['需求分成两种。', 'They come in two kinds.'],
            ['第一种叫功能需求，', 'The first kind: functional requirements.'],
            ['回答的是：系统要做什么。', 'They answer: what does the system do?'],
            ['第二种叫非功能需求，', 'The second kind: non-functional requirements.'],
            ['回答的是：这些事要做得多好。', 'They answer: how well does it do those things?'],
            ['比如多快、多稳、能扛多少人。', 'How fast, how reliable, how many users it can handle.']],
      build() {
        H(`<div class="r card center" data-cap="0" style="left:0;right:0;top:10px;height:100px;gap:20px">${icon('user', 50, 'var(--blue)')}<span style="font-size:${T('34px', '28px')};font-weight:700">${T('需求 = 约定好要交付什么', 'Requirements = what you agree to deliver')}</span>${icon('check', 50, 'var(--acc2)')}</div>`);
        const side = (x, c, z, e, bigZ, bigE, cap) => `<div class="r card" data-cap="${cap}" style="left:${x}px;top:140px;width:460px;height:380px;padding:36px 24px;text-align:center;border-color:${c}">
          <div class="h" style="font-size:40px;color:${c}">${T(z, e)}</div>${LANG === 'zh' ? `<div class="s" style="margin-top:4px">${e}</div>` : ''}
          <div class="h" style="font-size:${T('76px', '64px')};margin-top:60px">${T(bigZ, bigE)}</div></div>`;
        H(side(0, 'var(--blue)', '功能需求', 'Functional', '做什么', 'What', 3));
        H(side(500, 'var(--acc)', '非功能需求', 'Non-functional', '做得多好', 'How well', 5));
        [['功能 A', 'Feature A'], ['功能 B', 'Feature B']].forEach(([z, e], i) =>
          H(`<div class="r card center" data-cap="4" data-delay="${0.6 + i * 0.4}" data-in="pop" style="left:${i * 240}px;top:560px;width:220px;height:170px;font-size:${T('32px', '28px')};font-weight:800;border-color:var(--blue)">${T(z, e)}</div>`));
        [['clock', '多快', 'Fast'], ['shield', '多稳', 'Reliable'], ['user', '多大', 'Big']].forEach(([ic, z, e], i) =>
          H(`<div class="r card center" data-cap="7" data-delay="${i * 0.4}" data-in="pop" style="left:${500 + i * 160}px;top:560px;width:140px;height:170px;flex-direction:column;gap:12px;border-color:var(--acc)">
            ${icon(ic, 60, 'var(--acc)')}<div style="font-size:${T('30px', '24px')};font-weight:800">${T(z, e)}</div></div>`));
      } },

    { title: ['功能需求：要做什么', 'Functional: what it does'],
      cap: [['先拿短链接来看功能需求。', "Let's start with a URL shortener's features."],
            ['短链接服务，就是把很长的网址，', 'A URL shortener takes a very long web address'],
            ['变成一个很短的网址，方便分享。', "and turns it into a short one that's easy to share."],
            ['所以它最核心的功能有两个。', 'So it has two core features.'],
            ['第一个：你交给它一个长网址，', 'First: you give it a long URL,'],
            ['它还给你一个短网址。', 'and it gives you back a short one.'],
            ['第二个：别人点开这个短网址，', 'Second: when someone opens the short link,'],
            ['浏览器就跳转到原来的长网址。', 'the browser is sent on to the original long URL.'],
            ['那要不要统计点击次数？', 'What about counting clicks?'],
            ['能不能自己定短链的名字？', 'Or letting users pick their own short name?'],
            ['这些可做可不做，要当面问清楚。', 'Those are optional, so ask before you add them.'],
            ['范围先定下来，后面才不会乱。', 'Settle the scope first, so the design stays focused.']],
      build() {
        H(`<div class="r" data-cap="1" style="left:0;top:20px;width:960px;height:180px">
          ${box(0, 30, 340, 120, `<div class="mono" style="font-size:24px">example.com/blog/<br>2026/a-very-long-path</div>`, 'var(--quiet)')}
          ${arr(350, 75, 70, 'var(--blue)')}${box(430, 30, 190, 120, lbl('短链服务', 'Shortener', 28), 'var(--blue)')}
          ${arr(630, 75, 70, 'var(--blue)')}${box(710, 30, 250, 120, '<div class="mono acc" style="font-size:34px;font-weight:800">sho.rt/x7K</div>', 'var(--acc)')}</div>`);
        H(`<div class="r s" data-cap="4" data-in="pop" style="left:0;top:10px">① ${T('创建', 'Create')}</div>`);
        H(`<div class="r" data-cap="6" style="left:0;top:250px;width:960px;height:180px">
          ${box(0, 30, 250, 120, `${icon('user', 40, 'var(--acc)')}<div class="mono acc" style="font-size:28px">sho.rt/x7K</div>`, 'var(--acc)')}
          ${arr(260, 75, 70, 'var(--acc2)')}${box(340, 30, 190, 120, lbl('短链服务', 'Shortener', 28), 'var(--blue)')}
          ${arr(540, 75, 70, 'var(--acc2)')}${box(620, 30, 340, 120, `<div class="mono ok" style="font-size:24px">example.com/blog/<br>2026/a-very-long-path</div>`, 'var(--acc2)')}</div>`);
        H(`<div class="r s" data-cap="6" data-delay="0.4" style="left:0;top:240px">② ${T('跳转', 'Redirect')}</div>`);
        H(`<div class="r card center" data-cap="8" data-in="drop" style="left:0;right:0;top:500px;height:150px;gap:24px;border-style:dashed;border-color:var(--yel)">
          <span class="h yel" style="font-size:38px">${T('点击统计？自定义短链？', 'Click stats? Custom links?')}</span><span class="chip" style="border-color:var(--yel)">${T('先问要不要', 'Ask first')}</span></div>`);
        H(`<div class="r card center" data-cap="11" data-in="pop" style="left:120px;right:120px;top:690px;height:120px;border-color:var(--acc)"><span class="h" style="font-size:${T('40px', '34px')}">${T('先定<span class="acc">范围</span>，再往下走', 'Agree on <span class="acc">scope</span> first')}</span></div>`);
      } },

    { title: ['光有功能还不够', "Features aren't enough"],
      cap: [['但光知道功能，还画不出图。', "But knowing the features isn't enough to draw it."],
            ['同样是这两个功能，', 'Take the same two features.'],
            ['给十个人用，和给一亿人用，', 'Built for ten users, or for a hundred million,'],
            ['做出来是完全不同的两个系统。', 'they become two completely different systems.'],
            ['差别就在非功能需求上。', 'The difference is the non-functional requirements.']],
      build() {
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:10px;display:flex;gap:30px;justify-content:center">
          <div class="card center" style="width:260px;height:100px;font-size:${T('32px', '28px')};font-weight:800;border-color:var(--blue)">${T('生成短链', 'Create link')}</div>
          <div class="card center" style="width:260px;height:100px;font-size:${T('32px', '28px')};font-weight:800;border-color:var(--blue)">${T('点开跳转', 'Redirect')}</div></div>`);
        const sm = (x, y, w, z, e, c) => box(x, y, w, 80, `<div style="font-size:24px;font-weight:800">${T(z, e)}</div>`, c);
        H(`<div class="r card" data-cap="2" style="left:0;top:150px;width:420px;height:460px;text-align:center;padding-top:24px">
          <div class="h" style="font-size:40px">${T('十个人用', '10 users')}</div>
          ${sm(110, 150, 200, '服务器', 'Server', 'var(--quiet)')}
          <div class="mono q" style="position:absolute;left:0;right:0;top:238px;font-size:40px">↓</div>
          ${sm(110, 300, 200, '数据库', 'Database', 'var(--quiet)')}</div>`);
        H(`<div class="r card" data-cap="2" data-delay="0.8" style="left:540px;top:150px;width:420px;height:460px;text-align:center;padding-top:24px;border-color:var(--acc)">
          <div class="h acc" style="font-size:40px">${T('一亿人用', '100 million users')}</div>
          ${sm(40, 110, 340, '负载均衡', 'Load balancer', 'var(--acc2)')}
          ${sm(20, 215, 120, '服务器', 'Server', 'var(--acc2)')}${sm(150, 215, 120, '服务器', 'Server', 'var(--acc2)')}${sm(280, 215, 120, '服务器', 'Server', 'var(--acc2)')}
          ${sm(20, 320, 180, '缓存', 'Cache', 'var(--blue)')}${sm(220, 320, 180, '数据库', 'Database', 'var(--quiet)')}</div>`);
        H(`<div class="r h center" data-cap="3" data-in="stamp" style="left:420px;width:120px;top:330px;height:100px;font-size:90px;color:var(--red)">≠</div>`);
        H(`<div class="r card center" data-cap="4" data-in="pop" style="left:60px;right:60px;top:660px;height:140px;border-color:var(--acc)"><span class="h" style="font-size:${T('44px', '36px')}">${T('差别在：<span class="acc">非功能需求</span>', 'The difference: <span class="acc">non-functional</span>')}</span></div>`);
      } },

    { title: ['非功能需求：做得多好', 'Non-functional: how well'],
      cap: [['非功能需求，最常问三件事。', 'For non-functional, the three most common questions:'],
            ['第一，多快：比如点开短链，', 'One, how fast? For example, after a click,'],
            {zh: '100 毫秒以内就要跳过去。', en: 'the redirect should happen within 100 ms.', say_zh: '一百毫秒以内就要跳过去。', say_en: 'the redirect should happen within a hundred milliseconds.'},
            ['第二，多稳：就算一台机器坏了，', 'Two, how reliable? Even if one machine dies,'],
            ['用户也照样能打开链接。', 'users can still open their links.'],
            ['第三，多大：有多少用户在用？', 'Three, how big? How many users are there?'],
            ['是读得多，还是写得多？', 'And are there more reads or more writes?'],
            ['短链接一般是创建一次，', 'A short link is usually created once'],
            ['之后会被点开很多次，', 'and then opened many times,'],
            ['所以它是典型的读多写少。', "so it's a classic read-heavy system."]],
      build() {
        const row = (y, ic, c, z, e, dz, de, cap) => `<div class="r card" data-cap="${cap}" data-in="left" style="left:0;right:0;top:${y}px;height:170px;display:flex;align-items:center;gap:30px;padding:0 36px;border-color:${c}">
          ${icon(ic, 80, c)}<div class="h" style="font-size:44px;color:${c};width:${T('170px', '220px')}">${T(z, e)}</div>
          <div style="font-size:${T('34px', '30px')}">${T(dz, de)}</div></div>`;
        H(row(20, 'clock', 'var(--blue)', '多快', 'Fast', '跳转 &lt; 100 毫秒（举例）', 'redirect &lt; 100 ms (example)', 1));
        H(row(220, 'shield', 'var(--acc2)', '多稳', 'Reliable', '一台机器挂了，服务照常', 'one machine dies, service stays up', 3));
        H(row(420, 'user', 'var(--acc)', '多大', 'Big', '多少用户？读多写少？', 'How many users? Reads vs writes?', 5));
        H(`<div class="r card center" data-cap="7" data-in="pop" style="left:0;right:0;top:630px;height:140px;gap:28px">
          <span style="font-size:${T('34px', '30px')};font-weight:700">${T('创建 1 次', 'Created once')}</span><span class="mono q" style="font-size:36px">·</span>
          <span style="font-size:${T('34px', '30px')};font-weight:700">${T('点开很多次', 'Opened many times')}</span></div>`);
        H(`<div class="r chip center" data-cap="9" data-in="stamp" style="left:340px;width:280px;top:795px;height:70px;border-color:var(--blue);font-size:30px;font-weight:800">${T('读多写少', 'Read-heavy')}</div>`);
      } },

    { title: ['答案决定怎么画', 'The answers shape the diagram'],
      cap: [['为什么一定要先问这些？', 'Why ask all this first?'],
            ['因为答案直接决定你画什么。', 'Because the answers decide what you draw.'],
            ['只知道功能的话，一台服务器', 'If you only know the features, one server'],
            ['加一个数据库，好像就够了。', 'and one database seem like enough.'],
            ['但你问到了读多写少、量又大，', "But you learned it's read-heavy and huge,"],
            ['就在数据库前面加一层缓存，', 'so you put a cache in front of the database.'],
            ['热门短链直接从内存里读，', 'Popular links are read straight from memory:'],
            ['又快，又减轻数据库的压力。', 'faster, and less load on the database.'],
            ['你又问到了服务不能挂，', 'You also learned it must not go down,'],
            ['就多放几台服务器，前面加负载均衡。', 'so you run several servers behind a load balancer.'],
            ['一台坏了，请求就转给别的机器。', 'If one dies, requests go to the others.'],
            ['不过，每加一个组件都有代价：', 'But every component you add has a cost:'],
            ['机器更多，钱更多，系统也更复杂。', 'more machines, more money, more complexity.'],
            ['所以没被要求的，就别往上加。', "So don't add what the requirements don't ask for."]],
      build() {
        const B5 = (x, y, z, e, c, ic) => box(x, y, 160, 120, `${icon(ic, 40, c)}<div style="font-size:${T('26px', '24px')};font-weight:800">${T(z, e)}</div>`, c);
        H(`<div class="r" data-cap="2" style="left:0;top:10px;width:960px;height:200px">
          <div class="s" style="font-size:26px">${T('只知道功能', 'Features only')}</div>
          ${B5(0, 50, '用户', 'User', 'var(--quiet)', 'user')}${arr(170, 95, 60)}${B5(240, 50, '服务器', 'Server', 'var(--quiet)', 'gear')}${arr(410, 95, 60)}${B5(480, 50, '数据库', 'Database', 'var(--quiet)', 'db')}</div>`);
        H(`<div class="r s" data-cap="4" style="left:0;top:250px;font-size:26px">${T('问清非功能之后', 'After asking non-functional')}</div>`);
        const Bx = (x, y, w, z, e, c, ic, extra = '') => box(x, y, w, 120, `${icon(ic, 40, c)}<div style="font-size:${T('26px', '22px')};font-weight:800">${T(z, e)}</div>`, c, extra);
        H(`<div class="r" data-cap="5" style="left:0;top:300px;width:960px;height:300px">
          ${Bx(0, 80, 120, '用户', 'User', 'var(--quiet)', 'user')}${arr(125, 125, 45)}
          ${Bx(175, 80, 140, '服务器', 'Server', 'var(--quiet)', 'gear')}${arr(320, 125, 240, 'var(--blue)')}
          <div style="position:absolute;left:565px;top:28px;width:160px;text-align:center;font-size:24px;font-weight:700;color:var(--blue)">${T('读多写少 →', 'Read-heavy →')}</div>
          ${Bx(565, 80, 160, '缓存', 'Cache', 'var(--blue)', 'box', 'border-width:4px')}
          ${arr(730, 125, 45)}${Bx(780, 80, 150, '数据库', 'Database', 'var(--quiet)', 'db')}</div>`);
        H(`<div class="r" data-cap="9" data-in="pop" style="left:125px;top:300px;width:390px;height:300px;background:var(--bg)">
          ${arr(0, 125, 45, 'var(--acc2)')}
          ${Bx(50, 80, 140, '负载均衡', 'Load<br>balancer', 'var(--acc2)', 'shield')}
          <svg style="position:absolute;left:190px;top:0" width="55" height="300"><path d="M2 140L48 60M2 140L48 220" stroke="var(--acc2)" stroke-width="4" stroke-linecap="round" fill="none"/></svg>
          ${Bx(245, 0, 140, '服务器 1', 'Server 1', 'var(--acc2)', 'gear')}
          ${Bx(245, 160, 140, '服务器 2', 'Server 2', 'var(--acc2)', 'gear')}</div>`);
        H(`<div class="r card" data-cap="11" data-in="stamp" style="left:0;right:0;top:650px;height:110px;text-align:center;padding-top:30px;border-color:var(--red)">
          <div class="h red" style="font-size:36px">${T('代价：更多机器、更多钱、更复杂', 'Cost: more machines, money, complexity')}</div></div>`);
        H(`<div class="r s" data-cap="13" style="left:0;right:0;top:790px;text-align:center;font-size:32px">${T('没要求的，就别加', "Not required? Don't add it")}</div>`);
      } },

    { title: ['一句话分清', 'Tell them apart'],
      cap: [['那怎么快速分清这两种需求？', 'How do you tell the two kinds apart quickly?'],
            ['看它说的是能做什么，还是做得多好。', 'Ask: is it about what it can do, or how well?'],
            ['换个例子，比如一个聊天软件。', 'Take another example: a chat app.'],
            ['“用户能发消息”“能按关键词搜”，', '"Users can send messages." "Search by keyword."'],
            ['说的是能做什么，是功能需求。', 'Those say what it can do: functional.'],
            ['“消息一秒内送达”，', '"Messages arrive within one second."'],
            ['“支持一千万用户”，', '"Supports ten million users."'],
            ['说的是做得多好，是非功能需求。', 'Those say how well: non-functional.']],
      build() {
        H(`<div class="r card" data-cap="2" style="left:0;width:460px;top:20px;height:110px;text-align:center;padding-top:26px;border-color:var(--blue)"><span class="h blue" style="font-size:40px">${T('功能需求', 'Functional')}</span></div>`);
        H(`<div class="r card" data-cap="2" style="left:500px;width:460px;top:20px;height:110px;text-align:center;padding-top:26px;border-color:var(--acc)"><span class="h acc" style="font-size:40px">${T('非功能需求', 'Non-functional')}</span></div>`);
        const chip = (x, y, z, e, c, cap, d) => `<div class="r card center" data-cap="${cap}" data-delay="${d}" data-in="drop" style="left:${x}px;top:${y}px;width:460px;height:110px;font-size:${T('34px', '30px')};font-weight:700;border-color:${c}">${T(z, e)}</div>`;
        H(chip(0, 170, '用户能发消息', 'Users can send messages', 'var(--blue)', 3, 0));
        H(chip(0, 310, '能按关键词搜索', 'Search by keyword', 'var(--blue)', 3, 0.8));
        H(chip(500, 170, '消息 1 秒内送达', 'Delivered within 1 second', 'var(--acc)', 5, 0));
        H(chip(500, 310, '支持一千万用户', 'Supports 10 million users', 'var(--acc)', 6, 0));
        H(`<div class="r h blue" data-cap="4" data-in="pop" style="left:0;width:460px;top:500px;text-align:center;font-size:44px">${T('能做什么', 'What it can do')}</div>`);
        H(`<div class="r h acc" data-cap="7" data-in="pop" style="left:500px;width:460px;top:500px;text-align:center;font-size:44px">${T('做得多好', 'How well')}</div>`);
      } },

    { title: ['一张图总结', 'One picture to remember'],
      cap: [['最后，把整个顺序总结一下。', "To wrap up, here's the whole order."],
            ['第一步，问功能：系统要做什么。', 'Step one, ask about features: what does it do?'],
            ['第二步，问非功能：多快多稳多大。', 'Step two, ask how well: how fast, reliable, big.'],
            ['第三步，再开始画图，', 'Step three, then start drawing,'],
            ['而且每个框都要对应一条需求。', 'and make every box answer a requirement.']],
      build() {
        const step = (y, n, c, z, e, dz, de, cap) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:170px;display:flex;align-items:center;gap:30px;padding:0 36px;border-color:${c}">
          ${num(n, c)}<div><div class="h" style="font-size:42px">${T(z, e)}</div><div class="s" style="margin-top:6px">${T(dz, de)}</div></div></div>`;
        H(step(20, 1, 'var(--blue)', '功能需求：做什么', 'Functional: what', '核心功能 + 问清范围', 'core features + agree on scope', 1));
        H(step(240, 2, 'var(--acc)', '非功能需求：做多好', 'Non-functional: how well', '多快 · 多稳 · 多大', 'fast · reliable · big', 2));
        H(step(460, 3, 'var(--acc2)', '再画图', 'Then draw', '每个框都对应一条需求', 'every box answers a requirement', 3));
        [200, 420].forEach((y, i) => H(`<div class="r mono q" data-cap="${i + 2}" style="left:470px;top:${y - 8}px;font-size:40px">↓</div>`));
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['刚才说的“多大”，怎么变成数字？', 'That "how big": how do you turn it into a number?'],
            ['下期咱们就学估算。', "Next time, we'll learn to estimate it."],
            ['日活乘以每人每天的请求次数，', "Daily users times each user's requests per day,"],
            {zh: '再除以一天的秒数：86400，', en: 'divided by the seconds in a day: 86,400,', say_zh: '再除以一天的秒数，八万六千四百，', say_en: 'divided by the seconds in a day: eighty-six thousand four hundred,'},
            ['就能算出每秒大概有多少请求。', 'and you get roughly how many requests per second.'],
            ['下期见。', 'See you next time.']],
      build() {
        H(`<div class="r card" data-cap="1" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 3 课 · Lesson 3', 'Lesson 3')}</div>
          <div class="h" style="font-size:${T('80px', '68px')};margin-top:30px">${T('估算入门：QPS', 'Estimating QPS')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:36px;margin-top:10px">Back-of-the-envelope QPS</div>' : ''}
          </div>`);
        H(`<div class="r mono acc" data-cap="2" data-in="pop" style="left:80px;right:80px;top:520px;text-align:center;font-size:36px">${T('日活 × 次数 ÷ 86400', 'DAU × requests ÷ 86,400')}</div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz; answer in meta.json quiz
      cap: [['考考你：用户可以给短链接', 'Quick quiz: "Users can set an expiry time'],
            ['设置一个过期时间。', 'on a short link."'],
            ['这是功能需求，还是非功能需求？', 'Is that functional or non-functional?'],
            ['评论区告诉我你的答案。', 'Tell me your answer in the comments.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;height:260px;padding:0 50px;border-color:var(--yel)">
          <div class="h" style="font-size:${T('48px', '42px')};text-align:center;line-height:1.4">“${T('用户可以给短链接<br>设置过期时间', 'Users can set an<br>expiry time on a short link')}”</div></div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:380px;display:flex;gap:40px;justify-content:center">
          <div class="card center h" style="width:420px;height:130px;font-size:${T('44px', '38px')};border-color:var(--blue)">A · ${T('功能需求', 'Functional')}</div>
          <div class="card center h" style="width:420px;height:130px;font-size:${T('44px', '38px')};border-color:var(--acc)">B · ${T('非功能需求', 'Non-functional')}</div></div>`);
        H(`<div class="r h acc" data-cap="3" style="left:0;right:0;top:600px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
