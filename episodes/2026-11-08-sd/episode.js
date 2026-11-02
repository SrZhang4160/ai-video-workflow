// 系统设计 第 7 课 · 可用性的几个 9：99.9% 一年能挂多久
const NINES = [
  ['99%', '3.65 天', '3.65 days', 'var(--red)'],
  ['99.9%', '8.76 小时', '8.76 hours', 'var(--yel)'],
  ['99.99%', '52.6 分钟', '52.6 min', 'var(--blue)'],
  ['99.999%', '5.26 分钟', '5.26 min', 'var(--acc2)'],
];
const sbox = (x, y, w, h, inner, color, cap, extra = '') =>
  `<div class="r card center" data-cap="${cap}" data-in="pop" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-color:${color};flex-direction:column;gap:6px;${extra}">${inner}</div>`;
const arr = (x, y, w, cap, delay = 0) =>
  `<svg class="r" data-cap="${cap}" data-delay="${delay}" data-in="left" style="left:${x}px;top:${y}px" width="${w}" height="40"><path d="M2 20H${w - 14}" stroke="#4A5160" stroke-width="4" stroke-linecap="round"/><path d="M${w - 22} 8l16 12-16 12" fill="none" stroke="#4A5160" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

window.EPISODE = {
  n: 7,
  scenes: [
    { title: ['99.9% 很稳吗？', 'Is 99.9% reliable?'],
      cap: [{zh: '服务可用性 99.9%，听着很稳？', en: 'Your service is up 99.9% of the time. Sounds solid?',
             say_zh: '服务可用性百分之九十九点九，听着很稳？', say_en: 'Your service is up ninety-nine point nine percent of the time. Sounds solid?'},
            {zh: '其实一年能挂将近九个小时。', en: 'It can still be down almost nine hours a year.'}],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="zoom" style="left:130px;right:130px;top:60px;height:300px;flex-direction:column;border-color:var(--acc2)">
          <div class="mono ok" style="font-size:130px;font-weight:800">99.9%</div>
          <div class="s">${T('可用性', 'availability')}</div></div>`);
        H(`<div class="r center" data-cap="1" style="left:0;right:0;top:420px;gap:24px">${icon('clock', 90, 'var(--red)')}
          <span class="h red" style="font-size:72px">${T('8.76 小时 / 年', '8.76 hours / year')}</span></div>`);
        H(`<div class="r" data-cap="1" data-delay="0.8" data-in="stamp" style="left:0;right:0;top:580px;text-align:center"><span style="display:inline-block;transform:rotate(-4deg);border:5px solid var(--red);color:var(--red);border-radius:14px;padding:8px 30px;font-size:48px;font-weight:900">${T('允许宕机', 'allowed downtime')}</span></div>`);
      } },

    { title: ['可用性怎么算', 'What availability means'],
      cap: [['可用性，就是能用时间占的比例。', 'Availability is the share of time the service works.'],
            ['剩下的，就是允许挂的时间。', 'The rest is your allowed downtime.']],
      build() {
        H(`<div class="r card center" data-cap="0" style="left:0;right:0;top:40px;height:170px;font-size:44px;font-weight:800;gap:20px">
          <span>${T('可用性', 'Availability')}</span><span class="acc">=</span>
          <span style="display:inline-flex;flex-direction:column;align-items:center"><span class="ok">${T('能用的时间', 'time up')}</span><span style="width:100%;border-top:4px solid var(--ink);margin:6px 0"></span><span>${T('总时间', 'total time')}</span></span></div>`);
        H(`<div class="r s" data-cap="0" data-delay="0.6" style="left:0;top:270px">${T('一年 365 天（示意）', 'One year · 365 days (illustrative)')}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.8" data-in="left" style="left:0;right:0;top:320px;height:110px;border-radius:16px;background:rgba(120,220,180,.25);border:3px solid var(--acc2)">
          ${[120, 410, 700].map(x => `<div style="position:absolute;left:${x}px;top:0;width:5px;height:104px;background:var(--red)"></div>`).join('')}</div>`);
        H(`<div class="r" data-cap="1" data-in="drop" style="left:390px;top:450px;width:540px">
          <div style="font-size:40px;color:var(--red)">↑ ${T('红色 = 挂掉的时间', 'red = downtime')}</div>
          <div class="s" style="margin-top:10px">${T('99.9% 时，红色只占千分之一', 'at 99.9%, red is one part in a thousand')}</div></div>`);
        H(`<div class="r card" data-cap="1" data-delay="0.5" style="left:0;top:640px;width:960px;padding:26px 34px;font-size:34px;text-align:center;border-color:var(--red)">
          ${T('允许宕机 = (1 − 可用性) × 总时间', 'Downtime = (1 − availability) × total time')}</div>`);
      } },

    { title: ['算一算 99.9%', 'Doing the math for 99.9%'],
      cap: [{zh: '一年是 365 × 24 = 8760 小时。', en: 'A year is 365 × 24 = 8,760 hours.',
             say_zh: '一年是八千七百六十小时。', say_en: 'A year is three sixty-five times twenty-four: eight thousand seven hundred sixty hours.'},
            {zh: '乘上 0.1%，就是 8.76 小时。', en: 'Take 0.1% of that: 8.76 hours.',
             say_zh: '乘上千分之一，就是八点七六小时。', say_en: 'Take zero point one percent of that: eight point seven six hours.'},
            {zh: '摊到每个月，大约 43.8 分钟。', en: 'Per month, that is about 43.8 minutes.',
             say_zh: '摊到每个月，大约四十三点八分钟。', say_en: 'Per month, that is about forty-three point eight minutes.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:34px 44px;font-size:44px;line-height:1.6">
          <span class="nu">365</span> × <span class="nu">24</span> = <span class="nu">8760</span> <span class="cm">${T('小时', 'h')}</span></div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:230px;padding:34px 44px;font-size:44px;line-height:1.6">
          <span class="nu">8760</span> × <span class="nu">0.1%</span> = <span class="yel" style="font-weight:800">8.76</span> <span class="cm">${T('小时 / 年', 'h / year')}</span></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:420px;padding:34px 44px;font-size:44px;line-height:1.6">
          <span class="nu">8.76</span> × <span class="nu">60</span> ÷ <span class="nu">12</span> ≈ <span class="yel" style="font-weight:800">43.8</span> <span class="cm">${T('分钟 / 月', 'min / month')}</span></div>`);
        H(`<div class="r s" data-cap="2" data-delay="0.8" style="left:0;right:0;top:640px;text-align:center">${T('按 365 天估算', 'estimate, 365-day year')}</div>`);
      } },

    { title: ['几个 9 对照表', 'The nines, side by side'],
      cap: [{zh: '每多一个 9，停机就缩到十分之一。', en: 'Each extra nine cuts downtime by ten times.', say_zh: '每多一个九，停机就缩到十分之一。'},
            {zh: '四个 9 约 53 分钟，五个 9 约 5 分钟。', en: 'Four nines: about 53 minutes. Five nines: about 5 minutes.',
             say_zh: '四个九约五十三分钟，五个九约五分钟。', say_en: 'Four nines: about fifty-three minutes. Five nines: about five minutes.'}],
      build() {
        const capOf = [0, 0, 1, 1];
        NINES.forEach(([p, z, e, c], i) => H(`<div class="r card" data-cap="${capOf[i]}" data-delay="${[0, 0.6, 0, 1.6][i]}" data-in="left" style="left:0;right:0;top:${30 + i * 165}px;height:140px;border-color:${c};display:flex;align-items:center;padding:0 40px">
          <span class="mono" style="font-size:54px;font-weight:800;color:${c};width:340px">${p}</span>
          <span class="s" style="width:200px">${T(['两个 9', '三个 9', '四个 9', '五个 9'][i], ['two nines', 'three nines', 'four nines', 'five nines'][i])}</span>
          <span class="h" style="font-size:48px;margin-left:auto">${T(z, e)}</span></div>`));
        H(`<div class="r s" data-cap="1" data-delay="2.4" style="left:0;right:0;top:700px;text-align:center">${T('每年允许宕机（估算）', 'allowed downtime per year (estimate)')}</div>`);
      } },

    { title: ['代价：每个 9 都很贵', 'The cost of each nine'],
      cap: [{zh: '但每多一个 9，代价都高得多。', en: 'But every extra nine costs far more.', say_zh: '但每多一个九，代价都高得多。'},
            ['常见做法：多副本、多机房、自动切换。', 'Common fixes: replicas, more data centers, auto failover.'],
            ['五分钟内，靠人修来不及。', "Five minutes is too fast for a human fix."]],
      build() {
        const hs = [120, 220, 360, 540], labels = [['单机', 'one server'], ['多副本', 'replicas'], ['多机房', 'multi-DC'], ['自动切换', 'auto failover']];
        hs.forEach((h, i) => H(`<div class="r" data-cap="${i === 0 ? 0 : 1}" data-delay="${i === 0 ? 0 : (i - 1) * 0.5}" data-in="drop" style="left:${40 + i * 230}px;top:${640 - h}px;width:190px;height:${h}px;border-radius:14px 14px 0 0;background:rgba(255,138,76,${0.18 + i * 0.18});border:3px solid var(--acc)">
          <div class="mono" style="position:absolute;top:-56px;left:0;right:0;text-align:center;font-size:34px;font-weight:800;color:${NINES[i][3]}">${NINES[i][0]}</div>
          <div style="position:absolute;bottom:14px;left:0;right:0;text-align:center;font-size:26px;font-weight:800">${T(labels[i][0], labels[i][1])}</div></div>`));
        H(`<div class="r s" data-cap="0" style="left:0;right:0;top:660px;text-align:center">${T('示意 · 成本 / 复杂度 ↑', 'illustrative · cost / complexity ↑')}</div>`);
        H(`<div class="r card center" data-cap="2" style="left:0;right:0;top:730px;height:120px;gap:20px;border-color:var(--red)">${icon('user', 54, 'var(--red)')}<span style="font-size:34px;font-weight:800">${T('5 分钟内：靠人来不及', 'Under 5 min: too fast for humans')}</span></div>`);
      } },

    { title: ['串联：可用性相乘', 'In series, availability multiplies'],
      cap: [['还有个坑：串联的依赖要相乘。', 'One more trap: dependencies in a chain multiply.'],
            {zh: '两个 99.9% 串联，只剩 99.8%。', en: 'Two 99.9% parts in a row give only 99.8%.',
             say_zh: '两个百分之九十九点九串联，只剩百分之九十九点八。', say_en: 'Two ninety-nine point nine percent parts in a row give only ninety-nine point eight percent.'},
            ['停机差不多翻了一倍。', 'Downtime nearly doubles.']],
      build() {
        H(sbox(0, 60, 220, 160, `${icon('user', 60, 'var(--quiet)')}<span style="font-size:28px">${T('用户', 'User')}</span>`, 'var(--line)', 0));
        H(arr(225, 120, 80, 0, 0.3));
        H(sbox(310, 60, 280, 160, `${icon('gear', 60, 'var(--blue)')}<span style="font-size:28px">${T('服务', 'App')}</span><span class="mono yel" style="font-size:30px">99.9%</span>`, 'var(--blue)', 0, '').replace('data-in="pop"', 'data-in="pop" data-delay="0.5"'));
        H(arr(595, 120, 80, 0, 0.8));
        H(sbox(680, 60, 280, 160, `${icon('db', 60, 'var(--blue)')}<span style="font-size:28px">${T('数据库', 'Database')}</span><span class="mono yel" style="font-size:30px">99.9%</span>`, 'var(--blue)', 0).replace('data-in="pop"', 'data-in="pop" data-delay="1.0"'));
        H(`<div class="r card mono center" data-cap="1" style="left:0;right:0;top:290px;height:150px;font-size:44px;gap:18px">
          <span class="nu">99.9%</span>×<span class="nu">99.9%</span>≈<span class="red" style="font-weight:800">99.8%</span></div>`);
        H(`<div class="r card" data-cap="2" style="left:0;right:0;top:500px;padding:30px 40px;font-size:36px;line-height:1.7">
          <div>${T('一个：', 'One: ')}<span class="yel" style="font-weight:800">${T('8.76 小时 / 年', '8.76 h / year')}</span></div>
          <div>${T('串两个：', 'Two in a row: ')}<span class="red" style="font-weight:800">${T('约 17.5 小时 / 年', '≈ 17.5 h / year')}</span></div></div>`);
        H(`<div class="r" data-cap="2" data-delay="0.8" data-in="stamp" style="left:770px;top:540px"><span style="display:inline-block;transform:rotate(-8deg);border:5px solid var(--red);color:var(--red);border-radius:14px;padding:4px 20px;font-size:48px;font-weight:900;font-family:JBM">×2</span></div>`);
      } },

    { title: ['一张图总结', 'One-picture summary'],
      cap: [{zh: '停机时间等于一减可用性，乘全年。', en: 'Downtime = (1 − availability) × one year.', say_en: 'Downtime is one minus availability, times one year.'},
            {zh: '多一个 9 少十倍，串个依赖打个折。', say_zh: '多一个九少十倍，串个依赖打个折。', en: 'One more nine: ten times less. Each chained dependency cuts it.'}],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:20px;padding:26px 36px;border-color:var(--acc)">
          <div style="font-size:32px;font-weight:800;text-align:center">${T('停机 = (1 − 可用性) × 8760 小时', 'Downtime = (1 − A) × 8,760 h')}</div>
          ${NINES.map(([p, z, e, c]) => `<div style="display:flex;justify-content:space-between;align-items:center;border-top:2px solid var(--line);margin-top:14px;padding-top:12px">
            <span class="mono" style="font-size:40px;font-weight:800;color:${c}">${p}</span><span style="font-size:38px;font-weight:800">${T(z, e)}</span></div>`).join('')}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:560px;display:flex;gap:30px">
          <div class="card center" style="flex:1;height:160px;flex-direction:column;gap:6px;border-color:var(--acc2)"><span class="h ok" style="font-size:36px">${T('+1 个 9', '+1 nine')}</span><span class="s">${T('停机 ÷ 10，成本 ↑↑', 'downtime ÷ 10, cost ↑↑')}</span></div>
          <div class="card center" style="flex:1;height:160px;flex-direction:column;gap:6px;border-color:var(--red)"><span class="h red" style="font-size:36px">${T('串联依赖', 'Chained deps')}</span><span class="s">${T('可用性相乘', 'availability multiplies')}</span></div></div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期：输入网址后，到底发生了什么？', 'Next: what happens after you type a URL?']],
      build() {
        H(`<div class="r card" style="left:60px;right:60px;top:160px;height:460px;border-color:var(--acc);text-align:center;padding-top:60px">
          <div class="s" style="font-size:34px">${T('第 8 课 · Lesson 8', 'Lesson 8')}</div>
          <div class="h" style="font-size:60px;margin-top:30px;line-height:1.3">${T('输入网址到看到页面', 'From URL to page')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:34px;margin-top:10px">From URL to page</div>' : ''}
          <div class="mono acc" style="font-size:40px;margin-top:40px">DNS → TCP → HTTP</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz; answer in meta.json quiz
      cap: [{zh: '考考你：99.95% 一年能挂多久？', en: 'Quick quiz: how much downtime does 99.95% allow a year?',
             say_zh: '考考你：百分之九十九点九五，一年能挂多久？', say_en: 'Quick quiz: how much downtime does ninety-nine point nine five percent allow a year?'},
            ['A 还是 B？评论区告诉我。', 'A or B? Tell me in the comments.']],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:34px 44px;font-size:42px;line-height:1.7">
          <div>${T('可用性', 'availability')} = <span class="nu">99.95%</span></div>
          <div>${T('一年', 'one year')} = <span class="nu">8760</span> ${T('小时', 'h')}</div>
          <div class="cm">${T('允许宕机 = ？', 'downtime = ?')}</div></div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:390px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:400px;height:130px;font-size:44px;border-color:var(--blue)">A · ${T('约 4.4 小时', '≈ 4.4 hours')}</div>
          <div class="card center h" style="width:400px;height:130px;font-size:44px;border-color:var(--acc)">B · ${T('约 44 分钟', '≈ 44 min')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:590px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
