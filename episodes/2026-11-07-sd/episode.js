// 系统设计 第 6 课 · 延迟和吞吐量：不是一回事
const box = (x, y, w, h, inner, extra = '') =>
  `<div class="r card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">${inner}</div>`;
const car = (c = 'var(--yel)') => `<div style="width:64px;height:34px;border-radius:10px;background:${c}"></div>`;
// a road strip with n lanes; returns svg
const road = (w, lanes, laneH = 46) => {
  const h = lanes * laneH;
  let lines = '';
  for (let i = 1; i < lanes; i++) lines += `<line x1="0" y1="${i * laneH}" x2="${w}" y2="${i * laneH}" stroke="#8B93A3" stroke-width="3" stroke-dasharray="18 14"/>`;
  return `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" fill="#2A2F3A"/>${lines}
    <line x1="0" y1="1" x2="${w}" y2="1" stroke="#ECEEF3" stroke-width="3"/><line x1="0" y1="${h - 1}" x2="${w}" y2="${h - 1}" stroke="#ECEEF3" stroke-width="3"/></svg>`;
};

window.EPISODE = {
  n: 6,
  scenes: [
    { title: ['延迟和吞吐量', 'Latency vs throughput'],
      cap: [['说一个系统"快"，到底指什么？', 'When we say a system is "fast", what do we mean?'],
            ['一个请求更快，还是一秒处理更多？', 'One request done sooner, or more requests per second?']],
      build() {
        H(`<div class="r h center" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;font-size:88px;color:var(--acc)">${T('"快"？', '"Fast"?')}</div>`);
        H(box(0, 230, 420, 360, `<div class="center" style="flex-direction:column;height:100%;gap:22px;padding:0 24px;text-align:center">${icon('clock', 100, 'var(--blue)')}
          <div class="h" style="font-size:40px">${T('一个请求等多久', 'How long one request waits')}</div><div class="mono blue" style="font-size:34px">ms</div></div>`, 'border-color:var(--blue)')).dataset.cap = 1;
        H(box(540, 230, 420, 360, `<div class="center" style="flex-direction:column;height:100%;gap:22px;padding:0 24px;text-align:center">${icon('box', 100, 'var(--acc2)')}
          <div class="h" style="font-size:40px">${T('一秒处理多少个', 'How many per second')}</div><div class="mono ok" style="font-size:34px">${T('个/秒', 'req/s')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        H(`<div class="r h center" data-cap="1" data-delay="1.2" data-in="stamp" style="left:430px;width:100px;top:355px;height:100px;font-size:90px;color:var(--acc)">≠</div>`);
        H(`<div class="r center" data-cap="1" data-delay="1.8" style="left:0;right:0;top:650px;gap:40px"><span class="h blue" style="font-size:46px">${T('延迟', 'Latency')}</span><span class="h q" style="font-size:40px">vs</span><span class="h ok" style="font-size:46px">${T('吞吐量', 'Throughput')}</span></div>`);
      } },

    { title: ['两个定义', 'Two definitions'],
      cap: [['延迟：一个请求等多久，单位毫秒。', 'Latency: how long one request waits, in milliseconds.'],
            {zh: '吞吐量：每秒完成多少请求，叫 QPS。', en: 'Throughput: requests finished per second, or QPS.', say_zh: '吞吐量：每秒完成多少个请求，也叫 Q P S。', say_en: 'Throughput: requests finished per second, or Q P S.'}],
      build() {
        H(box(0, 20, 960, 380, `<div class="h blue" style="position:absolute;left:30px;top:22px;font-size:36px">${B('延迟', 'Latency')}</div>
          <div class="r card center" style="left:40px;top:120px;width:200px;height:100px;font-size:32px;font-weight:800">${icon('user', 40, 'var(--ink)')}&nbsp;${T('客户端', 'Client')}</div>
          <div class="r card center" style="left:720px;top:120px;width:200px;height:100px;font-size:32px;font-weight:800">${icon('gear', 40, 'var(--ink)')}&nbsp;${T('服务器', 'Server')}</div>
          <svg class="r" style="left:240px;top:120px" width="480" height="100"><path d="M10 30H460" stroke="#ECEEF3" stroke-width="4"/><path d="M448 20l14 10-14 10" fill="none" stroke="#ECEEF3" stroke-width="4"/>
            <path d="M470 70H20" stroke="#8B93A3" stroke-width="4"/><path d="M32 60l-14 10 14 10" fill="none" stroke="#8B93A3" stroke-width="4"/></svg>`, 'border-color:var(--blue)')).dataset.cap = 0;
        H(`<div class="r" data-cap="0" data-delay="0.8" data-in="pop" style="left:40px;top:270px;width:880px;height:100px">
          <svg width="880" height="40"><path d="M2 4V30H878V4" fill="none" stroke="#5AA9FF" stroke-width="4"/></svg>
          <div class="mono blue" style="text-align:center;font-size:40px;font-weight:800;margin-top:2px">${T('≈ 50 毫秒', '≈ 50 ms')}</div></div>`);
        H(box(0, 440, 960, 380, `<div class="h ok" style="position:absolute;left:30px;top:22px;font-size:36px">${B('吞吐量', 'Throughput')}</div>
          <div class="r" style="left:40px;top:130px;display:flex;gap:14px">${Array.from({length: 8}, () => `<div style="width:56px;height:56px;border-radius:12px;background:var(--acc2)"></div>`).join('')}</div>
          <div class="r q" style="left:610px;top:140px;font-size:36px">…</div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        H(`<div class="r center" data-cap="1" data-delay="0.8" data-in="pop" style="left:0;right:0;top:680px;gap:20px"><span class="mono ok" style="font-size:56px;font-weight:800">${T('100 个/秒', '100 req/s')}</span><span class="chip">QPS</span></div>`);
      } },

    { title: ['打个比方：高速公路', 'Think of a highway'],
      cap: [['把系统想成一条高速公路：', 'Picture the system as a highway.'],
            {zh: '延迟，是一辆车从 A 开到 B 要 1 小时；', en: 'Latency: one car takes 1 hour from A to B.', say_zh: '延迟，是一辆车从 A 开到 B，要一个小时；', say_en: 'Latency: one car takes one hour from A to B.'},
            ['吞吐量，是每小时开过多少辆。', 'Throughput: how many cars get through each hour.']],
      build() {
        H(`<div class="r" data-cap="0" data-in="left" style="left:80px;top:200px">${road(800, 2, 60)}</div>`);
        H(`<div class="r h center" data-cap="0" style="left:0;width:70px;top:200px;height:120px;font-size:52px">A</div>`);
        H(`<div class="r h center" data-cap="0" style="left:890px;width:70px;top:200px;height:120px;font-size:52px">B</div>`);
        H(`<div class="r" data-cap="1" data-in="fade" data-move="660,0,2.2" style="left:90px;top:213px">${car('var(--blue)')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.4" style="left:80px;top:360px;width:800px">
          <svg width="800" height="36"><path d="M2 2V20H798V2" fill="none" stroke="#5AA9FF" stroke-width="4"/></svg>
          <div class="h blue" style="text-align:center;font-size:40px;margin-top:6px">${T('延迟 = 这一趟 1 小时', 'Latency = the trip takes 1 hour')}</div></div>`);
        H(`<div class="r" data-cap="2" style="left:740px;top:140px;width:6px;height:240px;background:var(--acc2)"></div>`);
        H(box(130, 560, 700, 170, `<div class="center" style="height:100%;gap:26px">${icon('box', 64, 'var(--acc2)')}<div class="h ok" style="font-size:40px">${T('吞吐量 = 每小时过几辆', 'Throughput = cars per hour')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 2;
      } },

    { title: ['加车道：吞吐涨了，延迟没变', 'More lanes: more cars, same trip'],
      cap: [{zh: '一条车道，每小时约 2000 辆。', en: 'One lane: about 2,000 cars an hour.', say_zh: '一条车道，每小时约两千辆。', say_en: 'One lane: about two thousand cars an hour.'},
            {zh: '扩成 4 条，约 8000 辆，是 4 倍。', en: 'Four lanes: about 8,000. Four times the throughput.', say_zh: '扩成四条，约八千辆，是四倍。', say_en: 'Four lanes: about eight thousand. Four times the throughput.'},
            {zh: '不堵车时，每辆车还是开 1 小时。', en: 'With no traffic jam, each car still takes one hour.', say_zh: '不堵车的时候，每辆车还是要开一小时。'}],
      build() {
        H(`<div class="r s" data-cap="0" style="left:0;top:20px">${T('1 条车道', '1 lane')}</div>`);
        H(`<div class="r" data-cap="0" data-in="left" style="left:0;top:70px">${road(620, 1, 60)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.3" data-move="480,0,2" style="left:20px;top:83px">${car()}</div>`);
        H(`<div class="r mono center" data-cap="0" data-delay="0.5" style="left:640px;width:320px;top:60px;height:80px;font-size:36px;font-weight:800">${T('≈ 2000 辆/小时', '≈ 2,000 cars/h')}</div>`);
        H(`<div class="r s" data-cap="1" style="left:0;top:190px">${T('4 条车道', '4 lanes')}</div>`);
        H(`<div class="r" data-cap="1" data-in="left" style="left:0;top:240px">${road(620, 4, 60)}
          ${[0, 1, 2, 3].map(i => `<div style="position:absolute;left:${40 + i * 30}px;top:${13 + i * 60}px">${car()}</div>`).join('')}</div>`);
        H(`<div class="r mono center ok" data-cap="1" data-delay="0.5" style="left:640px;width:320px;top:320px;height:80px;font-size:36px;font-weight:800">${T('≈ 8000 辆/小时', '≈ 8,000 cars/h')}</div>`);
        H(box(0, 560, 460, 200, `<div class="center" style="flex-direction:column;height:100%;gap:10px"><div class="s">${T('吞吐量', 'Throughput')}</div><div class="mono ok" style="font-size:72px;font-weight:900">×4 ✓</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        H(box(500, 560, 460, 200, `<div class="center" style="flex-direction:column;height:100%;gap:10px"><div class="s">${T('每辆车的延迟', 'Latency per car')}</div><div class="mono blue" style="font-size:46px;font-weight:900;white-space:nowrap">${T('1 小时 → 1 小时', '1 h → 1 h')}</div></div>`, 'border-color:var(--blue)')).dataset.cap = 2;
        H(`<div class="r s" data-cap="2" data-delay="0.8" style="left:0;right:0;top:800px;text-align:center">${T('车道容量为估算值', 'Lane capacity is a rough estimate')}</div>`);
      } },

    { title: ['系统里的例子：批量写入', 'In a real system: batching'],
      cap: [{zh: '假设写一次盘约 10 毫秒，几条都一样。', en: 'Say one disk write takes about 10 ms, for 1 record or 10.', say_zh: '假设写一次盘大约十毫秒，写一条和写十条都一样。', say_en: 'Say one disk write takes about ten milliseconds, for one record or ten.'},
            {zh: '一次写一条：一秒 100 条。', en: 'One record per write: 100 records a second.', say_zh: '一次写一条，一秒一百条。', say_en: 'One record per write: one hundred records a second.'},
            {zh: '攒 10 条一起写：一秒 1000 条。', en: 'Ten records per write: 1,000 a second.', say_zh: '攒十条一起写，一秒一千条。', say_en: 'Ten records per write: one thousand a second.'},
            {zh: '可每条照样至少等 10 毫秒。', en: 'But each record still waits at least 10 ms.', say_zh: '可每一条，照样至少等十毫秒。', say_en: 'But each record still waits at least ten milliseconds.'}],
      build() {
        H(`<div class="r center" data-cap="0" style="left:0;right:0;top:10px;height:90px;gap:18px">${icon('db', 56, 'var(--quiet)')}<span class="h" style="font-size:38px">${T('写一次盘 ≈ 10 毫秒，1 条或 10 条（假设）', 'One disk write ≈ 10 ms, 1 or 10 records (assumed)')}</span></div>`);
        H(box(0, 130, 960, 230, `<div class="s" style="position:absolute;left:28px;top:20px">${T('一次 1 条', '1 record per write')}</div>
          <div class="r" style="left:28px;top:84px;display:flex;gap:8px">${Array.from({length: 10}, () => `<div class="center mono" style="width:48px;height:48px;border-radius:10px;border:3px solid var(--quiet);font-size:26px">1</div>`).join('')}</div>
          <div class="r mono" style="left:28px;top:166px;font-size:28px;color:var(--quiet)">1000 ÷ 10 = 100 ${T('次/秒', 'writes/s')}</div>
          <div class="r mono" style="right:28px;top:84px;font-size:44px;font-weight:800">${T('100 条/秒', '100/s')}</div>`)).dataset.cap = 1;
        H(box(0, 390, 960, 230, `<div class="s" style="position:absolute;left:28px;top:20px">${T('一次 10 条', '10 records per write')}</div>
          <div class="r center mono" style="left:28px;top:84px;width:200px;height:58px;border-radius:10px;border:3px solid var(--acc2);font-size:28px;color:var(--acc2);font-weight:800">10 ${T('条', 'rec')}</div>
          <div class="r mono" style="left:28px;top:166px;font-size:28px;color:var(--quiet)">100 × 10 = 1000 ${T('条/秒', 'records/s')}</div>
          <div class="r mono ok" style="right:28px;top:84px;font-size:44px;font-weight:800">${T('1000 条/秒', '1,000/s')}</div>`, 'border-color:var(--acc2)')).dataset.cap = 2;
        H(`<div class="r" data-cap="2" data-delay="0.8" data-in="stamp" style="left:270px;top:474px"><span class="chip ok" style="border-color:var(--acc2);font-size:32px">${T('吞吐 ×10', 'Throughput ×10')}</span></div>`);
        H(box(0, 660, 960, 170, `<div class="center" style="height:100%;gap:24px;padding:0 30px">${icon('clock', 60, 'var(--red)')}<div><div class="h" style="font-size:36px">${T('延迟：≥ 10 毫秒，没变短', 'Latency: still ≥ 10 ms')}</div>
          <div class="s" style="margin-top:6px">${T('还要加上等凑批的时间', 'plus the wait for the batch to fill')}</div></div></div>`, 'border-color:var(--red)')).dataset.cap = 3;
      } },

    { title: ['想变快，先问是哪种快', 'Which "fast" do you need?'],
      cap: [['降延迟：加缓存、离用户近、少一跳。', 'Cut latency: cache, move closer, skip a hop.'],
            ['提吞吐：加机器、多个请求并行、批量。', 'Raise throughput: more servers, parallel requests, batching.']],
      build() {
        const col = (x, cap, color, ic, head, items) => {
          const el = H(box(x, 20, 460, 780, `<div style="padding:34px 30px">${icon(ic, 76, color)}<div class="h" style="font-size:42px;margin-top:18px;color:${color}">${head}</div></div>`, `border-color:${color}`));
          el.dataset.cap = cap;
          items.forEach(([z, e], i) => H(`<div class="r card" data-cap="${cap}" data-delay="${0.6 + i * 0.4}" style="left:${x + 30}px;top:${290 + i * 150}px;width:400px;height:120px;display:flex;align-items:center;padding:0 26px;font-size:34px;font-weight:700">${T(z, e)}</div>`));
        };
        col(0, 0, 'var(--blue)', 'clock', T('降延迟<br>缩短这一趟', 'Lower latency<br>shorter trip'), [['加缓存', 'Add a cache'], ['离用户近一点', 'Move closer to users'], ['少走一跳', 'Skip a hop']]);
        col(500, 1, 'var(--acc2)', 'box', T('提吞吐<br>多开车道', 'More throughput<br>more lanes'), [['加机器', 'More servers'], ['多个请求并行', 'Parallel requests'], ['批量处理', 'Batching']]);
      } },

    { title: ['一张图总结', 'One-picture summary'],
      cap: [['一张图总结：延迟问一个要多久，', 'Sum up: latency asks how long one takes,'],
            ['吞吐问一秒做多少。别混为一谈。', 'throughput asks how many per second. Not the same.']],
      build() {
        const rows = [['问的是', 'Asks', '一个要多久', 'How long for one', '一秒做多少', 'How many per second'],
                      ['单位', 'Unit', '毫秒', 'ms', '个/秒 · QPS', 'req/s · QPS'],
                      ['高速公路', 'Highway', '开一趟的时间', 'Trip time', '每小时车数', 'Cars per hour'],
                      ['怎么提升', 'Improve by', '缓存 · 就近 · 少一跳', 'Cache · closer · fewer hops', '加机器 · 并行 · 批量', 'Servers · parallel · batch']];
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:20px;height:110px;display:flex;align-items:center;font-size:40px;font-weight:800">
          <div style="width:220px"></div><div class="blue" style="width:370px;text-align:center">${T('延迟', 'Latency')}</div><div class="ok" style="width:370px;text-align:center">${T('吞吐量', 'Throughput')}</div></div>`);
        rows.forEach(([kz, ke, az, ae, bz, be], i) => H(`<div class="r card" data-cap="0" data-delay="${0.4 + i * 0.5}" style="left:0;right:0;top:${150 + i * 150}px;height:130px;display:flex;align-items:center;font-size:32px">
          <div class="s" style="width:220px;padding-left:26px">${T(kz, ke)}</div><div style="width:370px;text-align:center;font-weight:700;padding:0 10px">${T(az, ae)}</div><div style="width:370px;text-align:center;font-weight:700;padding:0 10px">${T(bz, be)}</div></div>`));
        H(`<div class="r h acc center" data-cap="1" data-delay="0.8" data-in="pop" style="left:0;right:0;top:770px;height:100px;font-size:44px">${T('吞吐高 ≠ 延迟低', 'High throughput ≠ low latency')}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期聊可用性的几个 9：', 'Next time: the nines of availability.'],
            {zh: '99.9% 一年能挂多久？关注我！', en: 'How long can 99.9% be down in a year? Follow along!', say_zh: '百分之九十九点九，一年能挂多久？关注我！', say_en: 'How long can ninety-nine point nine percent be down in a year? Follow along!'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:460px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 7 课 · Lesson 7', 'Lesson 7')}</div>
          <div class="h" style="font-size:76px;margin-top:30px">${T('可用性的几个 9', 'The nines of availability')}</div>
          <div class="mono acc" style="font-size:44px;margin-top:50px">99.9% → ? ${T('小时/年', 'hours/year')}</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：加到 4 台，延迟是多少？', en: 'Quick quiz: with 4 servers, what is the latency?', say_zh: '考考你：加到四台服务器，每个请求延迟是多少？', say_en: 'Quick quiz: with four servers, what is the latency of each request?'},
            {zh: 'A 还是 B？评论区告诉我。', en: 'A or B? Tell me in the comments.', say_zh: 'A，五十毫秒，还是 B，十二点五毫秒？评论区告诉我。', say_en: 'A, fifty milliseconds, or B, twelve point five? Tell me in the comments.'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:0;right:0;top:20px;padding:30px 40px;font-size:34px;line-height:1.7">
          <div>${T('1 台服务器：每个请求 <b class="blue">50 毫秒</b>，每秒 <b class="ok">100 个</b>', '1 server: <b class="blue">50 ms</b> per request, <b class="ok">100 req/s</b>')}</div>
          <div>${T('再加 3 台一样的，请求平均分，不排队', 'Add 3 identical servers, split evenly, no queueing')}</div>
          <div class="acc" style="font-weight:800;margin-top:10px">${T('每个请求的延迟是多少？', 'What is the latency of each request?')}</div></div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:400px;display:flex;gap:48px;justify-content:center">
          <div class="card center h mono" style="width:380px;height:130px;font-size:42px;border-color:var(--blue)">A · 50 ms</div>
          <div class="card center h mono" style="width:380px;height:130px;font-size:42px;border-color:var(--acc)">B · 12.5 ms</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:600px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
