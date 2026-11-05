// 系统设计短剧《逆袭架构师》第 1 集 · 一千万人涌进来 (课程第 3 课：估算入门，QPS 怎么算)
const box = (x, y, w, h, inner, color = 'var(--line)', attrs = '') =>
  `<div class="card center" ${attrs} style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;flex-direction:column;gap:6px;border-color:${color};text-align:center;line-height:1.2">${inner}</div>`;
const srv = (color = 'var(--acc2)') => `<div style="width:44px;height:56px;border:3px solid ${color};border-radius:8px;display:inline-block;margin:4px;background:linear-gradient(${color} 0 0) 8px 12px/26px 4px no-repeat,linear-gradient(${color} 0 0) 8px 24px/26px 4px no-repeat"></div>`;

window.EPISODE = {
  n: 1,
  theme: 'drama',
  scenes: [
    { title: ['《逆袭架构师》', 'The Comeback Architect'],
      cap: [['一千万人，一台服务器够吗？', 'Ten million people. Is one server enough?'],
            ['技术总监说：够。', 'The tech director said yes.'],
            ['入职三天的实习生铁柱说：不够。', 'Tiezhu, an intern on day three, said no.'],
            ['他用一道算术题，当众推翻了他。', 'With arithmetic, the intern proved him wrong in front of everyone.']],
      build() {
        H(actor('man', 60, 140, 300, 'calm', 'data-cap="2" data-in="left"'));
        H(actor('kai', 600, 140, 300, 'smug', 'data-cap="1" data-in="right"'));
        H(`<div class="r" data-cap="3" data-in="stamp" style="left:0;right:0;top:470px;text-align:center"><span style="display:inline-block;border:8px solid var(--red);color:var(--red);font-size:${T(84, 56)}px;font-weight:900;padding:4px 26px;border-radius:12px;transform:rotate(-8deg)">${T('推翻', 'OVERRULED')}</span></div>`);
        H(box(180, 650, 600, 150, `<span class="h" style="font-size:${T(54, 46)}px">${T('1000 万人 → 1 台？', '10M people → 1 server?')}</span>`, 'var(--acc)', 'data-cap="0" data-in="pop"'));
      } },

    { title: ['昨晚，公司群', 'Last night, the team chat'],
      cap: [['事情要从昨晚说起。', 'It started last night.'],
            {zh: "王总在群里宣布：", en: "CEO Wang posted in the team chat:", say_en: "C E O Wang posted in the team chat."},
            {zh: "明晚八点，顶流主播给咱们带货，", en: "Tomorrow 8 PM, a top streamer sells our products live.", say_en: "Tomorrow at eight PM, a top streamer sells our products live."},
            ['预计一千万人来看！', 'Ten million people expected to watch!'],
            ['技术总监周凯秒回：', 'Tech director Zhou Kai replied in a second:'],
            ['放心，一台服务器，稳得很。', 'Relax. One server can handle it.']],
      build() {
        H(phone(T('技术群 (12)', 'Tech team (12)'), [
          ['wang', '明晚八点，顶流主播带货！', 'Tomorrow 8 PM: top streamer, live sale!'],
          ['wang', '预计 1000 万人来看 🔥', '10 million viewers expected 🔥'],
          ['kai', '放心，一台服务器稳得很 👌', 'Relax. One server is plenty 👌'],
        ], {x: 40, y: 20, w: 480, h: 640, attrs: 'data-cap="1"'}));
        H(actor('wang', 600, 30, 240, 'happy', 'data-cap="2" data-in="right"'));
        H(`<div class="r card center" data-cap="3" data-in="pop" style="left:560px;top:340px;width:360px;height:120px;border-color:var(--acc)"><span class="h acc" style="font-size:${T(52, 44)}px">${T('1000 万人', '10M viewers')}</span></div>`);
        H(actor('kai', 600, 510, 240, 'smug', 'data-cap="4" data-in="right"'));
      } },

    { title: ['他皱起了眉', 'He frowned'],
      cap: [['群里全是点赞，', 'The chat filled with thumbs-ups.'],
            ['只有铁柱皱起了眉。', 'Only Tiezhu frowned.'],
            ['他心里只有一个问题：', 'He had one question:'],
            ['一千万人，每秒到底多少个请求？', 'Ten million people. How many requests per second?']],
      build() {
        H(`<div class="r" data-cap="0" style="left:40px;top:40px;font-size:64px;letter-spacing:10px">👍👍👍👍👍👍👍</div>`);
        H(actor('man', 300, 230, 300, 'think', 'data-cap="1" data-in="zoom"'));
        H(say(null, '每秒多少请求？', 'Requests per second?', {x: 560, y: 170, w: 380, side: 'n', size: T(38, 30), attrs: 'data-cap="3" data-in="pop"'}));
        H(`<div class="r card center" data-cap="3" data-delay="0.6" data-in="stamp" style="left:270px;top:700px;width:360px;height:120px;border-color:var(--acc)"><span class="h acc mono" style="font-size:60px">QPS = ?</span></div>`);
      } },

    { title: ['QPS：每秒请求数', 'QPS: queries per second'],
      cap: [{zh: "这个数，叫 QPS，每秒请求数。", en: "That number is QPS: queries per second.", say_zh: "这个数，叫 Q P S，每秒请求数。", say_en: "That number is Q P S: queries per second."},
            ['估算它，只要三个数：', 'To estimate it, you need three numbers:'],
            ['多少人来，', 'how many people come,'],
            ['每人发几次请求，', 'how many requests each person sends,'],
            ['这些请求挤在多少秒里。', 'and how many seconds those requests squeeze into.']],
      build() {
        H(`<div class="r card center" data-cap="0" style="left:0;right:0;top:20px;height:150px;gap:24px"><span class="h mono acc" style="font-size:64px">QPS</span><span class="h" style="font-size:${T(44, 36)}px">${T('= 每秒请求数', '= requests / second')}</span></div>`);
        [['user', '多少人', 'People', 2], ['retry', '每人几次', 'Requests each', 3], ['clock', '多少秒', 'Seconds', 4]].forEach(([ic, z, e, k], i) =>
          H(`<div class="r card center" data-cap="${k}" data-in="pop" style="left:${i * 330}px;top:240px;width:300px;height:280px;flex-direction:column;gap:20px;border-color:var(--acc)">${icon(ic, 100, 'var(--acc)')}<div class="h" style="font-size:${T(40, 30)}px">${T(z, e)}</div></div>`));
        H(`<div class="r card center mono" data-cap="4" data-delay="0.8" style="left:0;right:0;top:600px;height:150px;font-size:${T(40, 32)}px;font-weight:800">${T('人数 × 次数 ÷ 秒数', 'people × requests ÷ seconds')}</div>`);
      } },

    { title: ['周凯的算法', "Zhou Kai's math"],
      cap: [['第二天开会，周凯一脸不屑：', 'Next morning, Zhou Kai scoffed:'],
            ['实习生也配谈架构？', 'An intern talking architecture?'],
            {zh: "一千万人，每人十次，一亿次请求。", en: "Ten million people, 10 requests each: 100 million requests.", say_en: "Ten million people, ten requests each: a hundred million requests."},
            {zh: "除以一天八万六千四百秒，", en: "Divide by the 86,400 seconds in a day:", say_en: "Divide by the eighty-six thousand four hundred seconds in a day."},
            {zh: "才一千多 QPS。", en: "Just over 1,000 QPS.", say_zh: "才一千多 Q P S。", say_en: "Just over a thousand Q P S."},
            ['一台服务器，绰绰有余。', 'One server is more than enough.']],
      build() {
        H(actor('kai', 30, 40, 280, 'smug', 'data-cap="0" data-in="left"'));
        H(say('kai', '实习生也配谈架构？', 'An intern talking architecture?', {x: 350, y: 90, w: 570, attrs: 'data-cap="1" data-in="pop"'}));
        H(`<div class="r card center mono" data-cap="2" style="left:0;right:0;top:420px;height:170px;font-size:${T(50, 42)}px;font-weight:800">100,000,000 ÷ 86,400</div>`);
        H(`<div class="r card center mono" data-cap="4" data-in="pop" style="left:200px;right:200px;top:630px;height:150px;font-size:60px;font-weight:800;border-color:var(--acc2)">≈&nbsp;<span class="ok">1,157</span>&nbsp;QPS</div>`);
      } },

    { title: ['反转', 'The twist'],
      cap: [['铁柱站了起来：', 'Tiezhu stood up.'],
            ['周总，您这个算法，错了。', 'Mr. Zhou, your math is wrong.'],
            ['直播带货，人不是一整天慢慢来的。', "Live sales don't spread people over a whole day."],
            {zh: "八点一开播，所有人同时涌进来。", en: "At 8 PM sharp, everyone rushes in at once.", say_en: "At eight PM sharp, everyone rushes in at once."},
            ['平均值，会骗人。', 'Averages lie.']],
      build() {
        H(actor('man', 30, 20, 260, 'angry', 'data-cap="0" data-in="zoom"'));
        H(say('man', '周总，您这个算法，错了。', 'Mr. Zhou, your math is wrong.', {x: 320, y: 70, w: 600, attrs: 'data-cap="1" data-in="pop" data-shake="1"'}));
        H(`<div class="r card" data-cap="2" style="left:0;right:0;top:380px;height:430px;padding:20px 30px">
          <svg width="900" height="390" viewBox="0 0 900 390">
            <path d="M40 340H870M40 340V20" stroke="#5A4E66" stroke-width="4"/>
            <path d="M40 300H870" stroke="#5BE7C4" stroke-width="6" stroke-dasharray="14 10"/>
            <text x="60" y="280" font-family="Noto Sans SC" font-size="28" fill="#5BE7C4">${T('平均：一整天慢慢来', 'Average: spread over the day')}</text>
            <path d="M40 330C380 330 420 330 470 320C490 40 520 30 560 40C600 300 640 325 870 330" stroke="#FF5A5F" stroke-width="7" fill="none"/>
            <text x="${T(590, 70)}" y="${T(90, 60)}" font-family="Noto Sans SC" font-size="30" font-weight="800" fill="#FF5A5F">${T('8 点：同时涌进来', '8 PM: everyone at once')}</text>
            <text x="440" y="378" font-family="Noto Sans SC" font-size="26" fill="#A79BB4">20:00</text>
          </svg></div>`);
        H(`<div class="r" data-cap="4" data-in="stamp" style="left:560px;top:250px"><span style="display:inline-block;background:var(--red);color:#fff;font-size:${T(44, 34)}px;font-weight:900;padding:8px 22px;border-radius:12px">${T('平均值会骗人', 'Averages lie')}</span></div>`);
      } },

    { title: ['按高峰算', 'Do the math for the peak'],
      cap: [['铁柱走到白板前：', 'Tiezhu walked to the whiteboard.'],
            {zh: "假设一千万人，在开播十分钟内进来，", en: "Say 10 million people arrive in the first 10 minutes,", say_en: "Say ten million people arrive in the first ten minutes,"},
            {zh: "看商品、刷新、下单，每人约十次请求。", en: "each viewing, refreshing, ordering: about 10 requests.", say_en: "each viewing, refreshing, ordering: about ten requests."},
            {zh: "一千万乘十，是一亿次请求。", en: "10 million times 10 is 100 million requests.", say_en: "Ten million times ten is a hundred million requests."},
            {zh: "十分钟，是六百秒。", en: "Ten minutes is 600 seconds.", say_en: "Ten minutes is six hundred seconds."},
            {zh: "一亿除以六百，大约十七万 QPS。", en: "100 million divided by 600: about 170,000 QPS.", say_zh: "一亿除以六百，大约十七万 Q P S。", say_en: "A hundred million divided by six hundred: about one hundred seventy thousand Q P S."},
            {zh: "这还只是十分钟的平均。", en: "And that's still a 10-minute average. The busiest second is higher.", say_en: "And that's still a ten-minute average. The busiest second is higher."}],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:0;height:840px;background:#F4F1EA;border-color:#D8D2C4"></div>`);
        const row = (y, k, zh, en) => H(`<div class="r mono" data-cap="${k}" data-in="left" style="left:50px;right:30px;top:${y}px;font-size:${T(44, 38)}px;font-weight:800;color:#1D1A22">${T(zh, en)}</div>`);
        row(60, 1, '人数：1000 万（10 分钟内）', 'People: 10M (within 10 min)');
        row(170, 2, '每人：10 次请求', 'Each: 10 requests');
        row(300, 3, '1000 万 × 10 = 1 亿', '10,000,000 × 10 = 100M');
        row(410, 4, '10 分钟 = 600 秒', '10 min = 600 s');
        H(`<div class="r mono" data-cap="5" data-in="pop" style="left:50px;top:560px;font-size:${T(52, 44)}px;font-weight:900;color:#C2413B">${T('1 亿 ÷ 600 ≈ 17 万 QPS', '100M ÷ 600 ≈ 170,000 QPS')}</div>`);
        H(`<div class="r" data-cap="6" data-in="pop" style="left:50px;top:680px;font-size:${T(34, 28)}px;color:#1D1A22;font-weight:800">${T('↑ 10 分钟的平均，最忙那一秒更高', '↑ a 10-minute average; the busiest second is higher')}</div>`);
        H(`<div class="r" data-cap="0" style="left:50px;right:30px;top:770px;text-align:right;font-size:26px;color:#6B6378;font-weight:700">${T('* 人数、次数都是假设', '* people and requests are assumptions')}</div>`);
      } },

    { title: ['差了一百多倍', 'Off by 100×'],
      cap: [{zh: "十七万，对一千一百多。", en: "170,000 versus 1,157.", say_en: "One hundred seventy thousand, versus about one thousand one hundred."},
            ['整整差了一百多倍。', 'Off by more than a hundred times.'],
            ['全是因为，他用了一整天的平均。', 'All because he used the whole-day average.'],
            ['会议室，一下子安静了。', 'The room went silent.']],
      build() {
        H(box(0, 40, 440, 220, `<span class="q" style="font-size:30px">${T('周凯', 'Zhou Kai')}</span><span class="h mono" style="font-size:70px">1,157</span>`, 'var(--line)', 'data-cap="0" data-in="left"'));
        H(box(520, 40, 440, 220, `<span class="q" style="font-size:30px">${T('铁柱', 'Tiezhu')}</span><span class="h mono red" style="font-size:70px">170,000</span>`, 'var(--red)', 'data-cap="0" data-in="right"'));
        H(`<div class="r center" data-cap="1" data-in="stamp" style="left:0;right:0;top:300px;height:200px"><span class="mono" style="font-size:150px;font-weight:900;color:var(--acc)">×100+</span></div>`);
        H(actor('kai', 150, 540, 220, 'shock', 'data-cap="3" data-in="fade"'));
        H(actor('wang', 590, 540, 220, 'shock', 'data-cap="3" data-in="fade"'));
      } },

    { title: ['要几台服务器？', 'How many servers?'],
      cap: [['那要几台服务器？', 'So how many servers?'],
            {zh: "假设压测下来，一台能扛两千 QPS。", en: "Say load tests show one server handles 2,000 QPS.", say_zh: "假设压测下来，一台能扛两千 Q P S。", say_en: "Say load tests show one server handles two thousand Q P S."},
            {zh: "十七万除以两千，要八十五台。", en: "170,000 ÷ 2,000: 85 servers.", say_en: "One hundred seventy thousand divided by two thousand: eighty-five servers."},
            ['而周凯的方案，只有一台。', "Zhou Kai's plan had one."],
            ['单机能扛多少，要靠压测，别拍脑袋。', 'And per-server capacity comes from load tests, not gut feeling.']],
      build() {
        H(`<div class="r card center" data-cap="1" style="left:0;right:0;top:0;height:130px;gap:20px">${srv()}<span class="h" style="font-size:${T(38, 30)}px">${T('1 台 ≈ 2,000 QPS（假设，以压测为准）', '1 server ≈ 2,000 QPS (assumed; load-test it)')}</span></div>`);
        H(`<div class="r card" data-cap="2" style="left:0;width:600px;top:170px;height:620px;padding:16px;line-height:0">${Array.from({length: 85}, () => srv()).join('')}</div>`);
        H(`<div class="r center mono" data-cap="2" data-delay="0.8" data-in="pop" style="left:620px;width:340px;top:280px;height:160px;font-size:${T(64, 54)}px;font-weight:900;color:var(--acc2)">≈ 85</div>`);
        H(`<div class="r card center" data-cap="3" data-in="drop" data-shake="1" style="left:640px;width:300px;top:520px;height:200px;flex-direction:column;gap:10px;border-color:var(--red)">${srv('var(--red)')}<span class="h red" style="font-size:${T(34, 28)}px">${T('周凯：1 台', 'Zhou Kai: 1')}</span></div>`);
      } },

    { title: ['“全是假设！”', '"Those are guesses!"'],
      cap: [['周凯脸都绿了：你这些数，全是假设！', 'Zhou Kai went pale: those numbers are all guesses!'],
            ['铁柱说：对，估算就是先把假设摆上桌。', 'Tiezhu: yes. Estimating means putting assumptions on the table.'],
            ['假设错了，可以改。', 'A wrong assumption can be fixed.'],
            ['但不算，就是在赌。', 'Not doing the math is gambling.']],
      build() {
        H(actor('kai', 20, 20, 240, 'angry', 'data-cap="0" data-in="left"'));
        H(say('kai', '你这些数，全是假设！', 'Those numbers are all guesses!', {x: 290, y: 50, w: 640, attrs: 'data-cap="0" data-delay="0.4" data-in="pop"'}));
        H(actor('man', 700, 340, 240, 'calm', 'data-cap="1" data-in="right"'));
        H(say('man', '假设错了能改，不算就是在赌。', 'Wrong guesses can be fixed. No math is gambling.', {x: 20, y: 380, w: 640, side: 'r', attrs: 'data-cap="1" data-delay="0.4" data-in="pop"'}));
        H(`<div class="r" data-cap="3" data-in="stamp" style="left:120px;top:660px"><span style="display:inline-block;background:var(--acc);color:#1D1A22;font-size:${T(44, 34)}px;font-weight:900;padding:8px 22px;border-radius:12px">${T('不算 = 赌', 'No math = gambling')}</span></div>`);
      } },

    { title: ['一张图总结：估算 QPS', 'Cheat sheet: estimating QPS'],
      cap: [['铁柱的三步，记下来：', "Tiezhu's three steps. Save this:"],
            {zh: "第一，总请求等于人数乘每人次数。", en: "One: total requests = people × requests each.", say_en: "One: total requests equals people times requests each."},
            ['第二，除以高峰的秒数，别除一整天。', 'Two: divide by the peak window, not the whole day.'],
            {zh: "第三，除以单机 QPS，再多留余量。", en: "Three: divide by one server's QPS, then add headroom.", say_zh: "第三，除以单机 Q P S，再多留余量。", say_en: "Three: divide by one server's Q P S, then add headroom."},
            {zh: "常见做法，多留三到五成。", en: "A common practice: 30 to 50 percent extra.", say_en: "A common practice: thirty to fifty percent extra."}],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:0;height:840px;border-color:var(--acc);border-width:3px"></div>`);
        [[1, '总请求 = 人数 × 每人次数', 'Total = people × requests each'],
         [2, '峰值 QPS = 总请求 ÷ 高峰秒数', 'Peak QPS = total ÷ peak seconds'],
         [3, '机器数 = 峰值 ÷ 单机 QPS，再多留 30–50%', 'Servers = peak ÷ per-server QPS, +30–50%']].forEach(([n, z, e], i) =>
          H(`<div class="r" data-cap="${i + 1}" data-in="left" style="left:40px;right:40px;top:${60 + i * 190}px;display:flex;align-items:center;gap:26px">${num(n)}<span class="h" style="font-size:${T(40, 32)}px">${T(z, e)}</span></div>`));
        H(`<div class="r card center" data-cap="2" data-delay="0.8" style="left:60px;right:60px;top:650px;height:120px;border-color:var(--red)"><span class="h red" style="font-size:${T(40, 32)}px">${T('别用一整天的平均值', "Don't use the all-day average")}</span></div>`);
      } },

    { title: ['开播第三分钟', 'Three minutes in'],
      cap: [['王总拍板：听铁柱的，今晚加机器！', 'Wang decided: "We go with Tiezhu. Add servers tonight!"'],
            ['八十五台服务器，全部到位。', 'Eighty-five servers, all in place.'],
            {zh: '八点开播，服务器稳稳扛住。', en: 'At 8 PM the stream starts. The servers hold.', say_en: 'At eight PM the stream starts. The servers hold.'},
            ['可开播才三分钟，', 'But three minutes in,'],
            ['监控，突然全红了。', 'every monitor turned red.'],
            ['这一次，扛不住的不是服务器……', "This time, it wasn't the servers that broke..."]],
      build() {
        H(actor('wang', 30, 0, 240, 'happy', 'data-cap="0" data-in="left"'));
        H(say('wang', '听铁柱的，加机器！', 'We go with Tiezhu!', {x: 300, y: 30, w: 620, attrs: 'data-cap="0" data-delay="0.4" data-in="pop"'}));
        H(`<div class="r card center" data-cap="1" style="left:300px;width:620px;top:170px;height:100px;gap:8px">${srv()}${srv()}${srv()}${srv()}${srv()}<span class="h ok" style="font-size:36px">×85 ✓</span></div>`);
        H(alarm('20:03 · 数据库磁盘 99%', '20:03 · Database disk at 99%', {y: 340, attrs: 'data-cap="4" data-in="drop" data-shake="1"'}));
        H(alarm('20:03 · 写入失败 · 订单存不进去', '20:03 · Writes failing · orders not saved', {y: 440, attrs: 'data-cap="4" data-delay="0.5" data-in="drop" data-shake="1"'}));
        H(actor('man', 360, 560, 240, 'shock', 'data-cap="5" data-in="zoom"'));
      } },

    { title: ['下集预告', 'Next episode'],
      cap: [['下集：《磁盘满了》。', 'Next: "The Disk Is Full."'],
            ['八十五台服务器都没事，', 'Eighty-five servers were fine.'],
            ['为什么数据库先倒下了？', 'So why did the database fall first?'],
            ['铁柱要算第二笔账：存储。', 'Tiezhu has a second number to estimate: storage.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="zoom" style="left:0;right:0;top:40px;height:200px;flex-direction:column;gap:6px;border-color:var(--red);border-width:3px"><span class="q" style="font-size:30px">${T('下集预告', 'Next episode')}</span><span class="h" style="font-size:${T(64, 52)}px">${T('《磁盘满了》', '"The Disk Is Full"')}</span></div>`);
        H(`<div class="r center" data-cap="2" data-in="pop" style="left:0;right:0;top:300px;height:260px">${icon('db', 220, 'var(--red)')}</div>`);
        H(`<div class="r card center" data-cap="3" style="left:120px;right:120px;top:620px;height:140px;border-color:var(--acc)"><span class="h acc" style="font-size:${T(46, 38)}px">${T('第二笔账：存储估算', 'Estimate #2: storage')}</span></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],
      cap: [['考考你：一百万人一分钟内涌进来，', 'Quick quiz: a million people arrive within one minute,'],
            {zh: "每人六次，峰值 QPS 约多少？", en: "six requests each. Roughly what is the peak QPS?", say_zh: "每人六次，峰值 Q P S 约多少？", say_en: "six requests each. Roughly what is the peak Q P S?"},
            {zh: "A 一万，B 十万？评论区告诉我。", en: "A: 10,000, or B: 100,000? Tell me in the comments.", say_zh: "A，一万；B，十万？评论区告诉我。", say_en: "A, ten thousand, or B, a hundred thousand? Tell me in the comments."}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;height:330px;padding:40px;font-size:${T(42, 36)}px;font-weight:800;line-height:1.8">
          <div>${T('人数：100 万', 'People: 1,000,000')}</div><div>${T('时间：1 分钟内', 'Window: 1 minute')}</div><div>${T('每人：6 次请求', 'Each: 6 requests')}</div></div>`);
        H(`<div class="r card center" data-cap="1" data-in="pop" style="left:0;right:0;top:390px;height:120px"><span class="h acc mono" style="font-size:56px">${T('峰值 QPS ≈ ?', 'Peak QPS ≈ ?')}</span></div>`);
        H(`<div class="r card center" data-cap="2" data-in="pop" style="left:60px;width:390px;top:560px;height:150px;border-color:var(--blue)"><span class="h mono" style="font-size:52px">A · ${T('1 万', '10,000')}</span></div>`);
        H(`<div class="r card center" data-cap="2" data-delay="0.3" data-in="pop" style="left:510px;width:390px;top:560px;height:150px;border-color:var(--blue)"><span class="h mono" style="font-size:52px">B · ${T('10 万', '100,000')}</span></div>`);
        H(`<div class="r center" data-cap="2" data-delay="0.8" style="left:0;right:0;top:750px;height:80px;font-size:34px;font-weight:800;color:var(--quiet)">${T('答案评论区见 👇', 'Answer in the comments 👇')}</div>`);
      } },
  ],
};
