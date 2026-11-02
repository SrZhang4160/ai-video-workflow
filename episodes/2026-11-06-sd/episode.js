// 系统设计 第 5 课 · 延迟数字：内存、SSD、网络、跨洲，差几个数量级
const box = (x, y, w, h, inner, color = 'var(--line)', extra = '') =>
  `<div class="r card center" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-color:${color};flex-direction:column;text-align:center;${extra}">${inner}</div>`;
const big = (t, size = 44, color = 'var(--ink)') => `<div style="font-size:${size}px;font-weight:800;color:${color};line-height:1.2">${t}</div>`;
const quiet = (t, size = 26) => `<div style="font-size:${size}px;color:var(--quiet);line-height:1.35;margin-top:8px">${t}</div>`;

window.EPISODE = {
  n: 5,
  scenes: [
    { title: ['延迟数字：差几个数量级？', 'Latency numbers: how far apart?'],
      cap: [['读一次内存，和跨洲请求一次，', 'One memory read vs. one request across continents:'],
            ['你猜，差了多少倍？', 'how many times slower is the second one?']],
      build() {
        H(box(0, 60, 400, 320, `${icon('box', 100, 'var(--acc2)')}${big(T('读内存', 'Memory read'), 44)}${quiet(T('同一台机器', 'same machine'))}`, 'var(--acc2)')).dataset.cap = 0;
        H(box(560, 60, 400, 320, `${icon('rocket', 100, 'var(--blue)')}${big(T('跨洲请求', 'Cross-continent'), 44)}${quiet(T('比如美洲 ⇄ 欧洲', 'e.g. America ⇄ Europe'))}`, 'var(--blue)')).dataset.cap = 0;
        H(`<div class="r mono acc" data-cap="0" data-delay="0.5" data-in="left" style="left:410px;top:180px;font-size:60px;font-weight:800">⟷</div>`);
        H(`<div class="r center" data-cap="1" data-in="stamp" style="left:0;right:0;top:440px"><div style="border:5px solid var(--acc);color:var(--acc);border-radius:20px;padding:10px 40px;font-size:96px;font-weight:900;font-family:JBM">× ?</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.0" style="left:0;right:0;top:680px;text-align:center">${big(T('答案决定你把数据放哪', 'The answer decides where your data lives'), 38, 'var(--ink)')}</div>`);
      } },

    { title: ['先认三个单位', 'Three units first'],
      cap: [{zh: '先认三个单位：纳秒、微秒、毫秒。', en: 'First, three units: ns, µs and ms.', say_en: 'First, three units: nanoseconds, microseconds and milliseconds.'},
            ['每往上一级，就差一千倍。', 'Each step up is a thousand times longer.']],
      build() {
        const U = [['纳秒', 'nanosecond', 'ns', 'var(--acc2)'], ['微秒', 'microsecond', 'µs', 'var(--yel)'], ['毫秒', 'millisecond', 'ms', 'var(--blue)'], ['秒', 'second', 's', 'var(--quiet)']];
        U.forEach(([z, e, s, c], i) => {
          const h = 160 + i * 110;
          H(`<div class="r card" data-cap="0" data-delay="${i * 0.4}" style="left:${i * 245}px;top:${600 - h}px;width:225px;height:${h}px;border-color:${c};${i === 3 ? 'border-style:dashed;opacity:.55;' : ''}text-align:center;padding-top:26px">
            <div class="mono" style="font-size:56px;font-weight:800;color:${c}">${s}</div>
            <div style="font-size:${LANG === 'zh' ? 36 : 26}px;font-weight:800;margin-top:6px">${T(z, e)}</div></div>`);
        });
        [0, 1, 2].forEach(i => H(`<div class="r mono acc" data-cap="1" data-delay="${i * 0.4}" data-in="pop" style="left:${i * 245 + 150}px;top:${370 - i * 110}px;font-size:30px;font-weight:800;background:var(--bg);border:2px solid var(--acc);border-radius:999px;padding:4px 16px">×1000</div>`));
        H(`<div class="r card center" data-cap="1" data-delay="1.4" style="left:0;right:0;top:660px;height:110px;border-color:var(--yel)"><span style="font-size:32px;font-weight:800" class="yel">${T('数量级 · 看硬件会变', 'Orders of magnitude · hardware-dependent')}</span></div>`);
      } },

    { title: ['内存 vs SSD', 'Memory vs. SSD'],
      cap: [{zh: '读一次内存，约 100 纳秒。', en: 'One memory read: about 100 ns.', say_zh: '读一次内存，约一百纳秒。', say_en: 'One memory read: about 100 nanoseconds.'},
            {zh: 'SSD 随机读，约 100 微秒，', en: 'One SSD random read: about 100 µs.', say_zh: 'S S D 随机读，约一百微秒，', say_en: 'One SSD random read: about 100 microseconds.'},
            ['差约三个数量级，慢约一千倍。', 'About three orders of magnitude: 1,000 times slower.']],
      build() {
        H(box(0, 40, 450, 380, `${icon('box', 90, 'var(--acc2)')}${big(T('内存', 'Memory'), 46)}<div class="mono acc2" style="font-size:52px;font-weight:800;margin-top:20px;color:var(--acc2)">~100 ns</div>`, 'var(--acc2)')).dataset.cap = 0;
        H(box(510, 40, 450, 380, `${icon('db', 90, 'var(--yel)')}${big(T('SSD 随机读', 'SSD random read'), 46)}<div class="mono yel" style="font-size:52px;font-weight:800;margin-top:20px">~100 µs</div>`, 'var(--yel)')).dataset.cap = 1;
        H(`<div class="r" data-cap="2" style="left:0;top:500px;width:960px;height:60px">
          <div style="position:absolute;left:0;top:18px;width:6px;height:24px;background:var(--acc2);border-radius:3px"></div>
          <div style="position:absolute;left:0;top:26px;width:960px;height:8px;background:var(--yel);border-radius:4px;opacity:.7"></div></div>`);
        H(`<div class="r" data-cap="2" data-delay="0.3" style="left:0;top:570px;width:960px;display:flex;justify-content:space-between">${quiet(T('内存：一小格', 'memory: a sliver'), 26)}${quiet(T('SSD：一整条', 'SSD: the whole bar'), 26)}</div>`);
        H(`<div class="r center" data-cap="2" data-delay="0.8" data-in="stamp" style="left:0;right:0;top:660px"><div style="border:5px solid var(--acc);color:var(--acc);border-radius:16px;padding:6px 30px;font-size:72px;font-weight:900;font-family:JBM">×1000</div></div>`);
      } },

    { title: ['网络：同机房 vs 跨洲', 'Network: same datacenter vs. across continents'],
      cap: [{zh: '同一个机房里来回一趟，约 0.5 毫秒。', en: 'A round trip inside one datacenter: about 0.5 ms.', say_zh: '同一个机房里来回一趟，约零点五毫秒。', say_en: 'A round trip inside one datacenter: about half a millisecond.'},
            {zh: '跨洲来回一趟，约 100 毫秒级。', en: 'Across continents and back: on the order of 100 ms.', say_zh: '跨洲来回一趟，约一百毫秒级。', say_en: 'Across continents and back: on the order of 100 milliseconds.'},
            ['这是光速限制，加机器也没用。', "That's the speed of light. More servers won't help."]],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;top:20px;width:360px;height:300px;border:3px dashed #4A5160;border-radius:24px">
          <div style="position:absolute;left:0;right:0;top:14px;text-align:center;font-size:26px;color:var(--quiet)">${T('同一个机房', 'one datacenter')}</div>
          <div style="position:absolute;left:30px;top:90px">${icon('gear', 80, 'var(--acc2)')}</div>
          <div style="position:absolute;right:30px;top:90px">${icon('db', 80, 'var(--acc2)')}</div>
          <div class="mono" style="position:absolute;left:0;right:0;top:110px;text-align:center;font-size:40px;color:var(--acc2)">⇄</div>
          <div class="mono" style="position:absolute;left:0;right:0;top:220px;text-align:center;font-size:38px;font-weight:800;color:var(--acc2)">~0.5 ms</div></div>`);
        H(`<svg class="r" data-cap="1" data-in="fade" style="left:390px;top:20px" width="570" height="300" viewBox="0 0 570 300">
          <rect x="4" y="170" width="140" height="90" rx="16" fill="#1F232C" stroke="#5B9BFF" stroke-width="3"/>
          <text x="74" y="225" fill="#ECEEF3" font-size="28" font-weight="800" text-anchor="middle" font-family="Noto Sans SC">${T('美洲', 'America')}</text>
          <rect x="426" y="170" width="140" height="90" rx="16" fill="#1F232C" stroke="#5B9BFF" stroke-width="3"/>
          <text x="496" y="225" fill="#ECEEF3" font-size="28" font-weight="800" text-anchor="middle" font-family="Noto Sans SC">${T('欧洲', 'Europe')}</text>
          <path d="M80 165 Q285 -20 490 165" fill="none" stroke="#5B9BFF" stroke-width="4" stroke-dasharray="12 10"/>
          <text x="285" y="150" fill="#5B9BFF" font-size="36" font-weight="800" text-anchor="middle" font-family="JBM">~100 ms</text></svg>`);
        H(`<div class="r card" data-cap="2" style="left:0;right:0;top:370px;height:200px;padding:28px 34px;border-color:var(--yel)">
          <div style="display:flex;align-items:center;gap:24px">${icon('clock', 70, 'var(--yel)')}<div>
          ${big(T('光纤里光速 ≈ 20 万公里/秒', 'Light in fiber ≈ 200,000 km/s'), 36)}</div></div>
</div>`);
        H(`<div class="r mono" data-cap="2" data-delay="1.0" style="left:34px;top:490px;font-size:30px;color:var(--yel)">${T('1 万公里 ≈ 50 ms 单程 · ×2 ≈ 100 ms 往返', '10,000 km ≈ 50 ms one way · ×2 ≈ 100 ms round trip')}</div>`);
        H(`<div class="r center" data-cap="2" data-delay="2.0" style="left:0;right:0;top:640px;gap:22px">${icon('cross', 60, 'var(--red)')}${big(T('加机器 ≠ 缩短距离', 'More servers ≠ shorter distance'), 40, 'var(--red)')}</div>`);
      } },

    { title: ['换成人类时间', 'Scaled to human time'],
      cap: [{zh: '假如读一次内存要 1 秒，', en: 'If one memory read took 1 second,', say_zh: '假如读一次内存要一秒，', say_en: 'If one memory read took one second,'},
            {zh: 'SSD 要等十几分钟，', en: 'an SSD read would take about 17 minutes,', say_zh: 'S S D 要等十几分钟，', say_en: 'an SSD read would take about seventeen minutes,'},
            ['同机房一个多小时，跨洲十几天。', 'a datacenter trip over an hour, a cross-continent one 10+ days.']],
      build() {
        const R = [['读内存', 'Memory read', '1 秒', '1 second', 'var(--acc2)', 0],
                   ['SSD 随机读', 'SSD random read', '约 17 分钟', '~17 minutes', 'var(--yel)', 1],
                   ['同机房往返', 'Datacenter round trip', '1 个多小时', '1+ hour', 'var(--blue)', 2.0],
                   ['跨洲往返', 'Cross-continent trip', '十几天', '10+ days', 'var(--red)', 2.1]];
        R.forEach(([z, e, tz, te, c, k], i) => H(`<div class="r card" data-cap="${Math.floor(k)}" data-delay="${k === 2.1 ? 1.4 : 0}" data-in="left" style="left:0;right:0;top:${30 + i * 150}px;height:125px;display:flex;align-items:center;justify-content:space-between;padding:0 36px;border-color:${c}">
          <span style="font-size:36px;font-weight:800">${T(z, e)}</span><span style="font-size:44px;font-weight:900;color:${c}">${T(tz, te)}</span></div>`));
        H(`<div class="r" data-cap="2" data-delay="2.2" style="left:0;right:0;top:660px;text-align:center">${quiet(T('按 100 纳秒 → 1 秒 等比放大', 'scaled so 100 ns becomes 1 s'), 28)}</div>`);
      } },

    { title: ['对设计意味着什么', 'What it means for design'],
      cap: [['所以热数据放内存，服务靠近用户；', 'So: hot data in memory, servers close to users;'],
            ['跨洲调用，别在循环里一次次等。', "don't wait on cross-continent calls one by one in a loop."],
            ['代价是：内存贵，多地部署更复杂。', 'The cost: memory is pricey, and multi-region is complex.']],
      build() {
        H(box(0, 230, 200, 160, `${icon('user', 60, 'var(--ink)')}${big(T('用户', 'User'), 30)}`)).dataset.cap = 0;
        H(`<div class="r mono q" data-cap="0" data-delay="0.3" style="left:215px;top:280px;font-size:44px">→</div>`);
        H(box(270, 230, 200, 160, `${icon('gear', 60, 'var(--ink)')}${big(T('服务', 'App'), 30)}`)).dataset.cap = 0;
        H(`<div class="r" data-cap="0" data-delay="0.8" data-in="right" style="left:500px;top:20px;width:460px;height:170px;display:flex;align-items:center;gap:20px" ><div class="card" style="flex:1;height:100%;border-color:var(--acc2);padding:22px 26px">
          <div style="display:flex;align-items:center;gap:14px">${icon('check', 44, 'var(--acc2)')}${big(T('内存缓存', 'Memory cache'), 32, 'var(--acc2)')}</div>${quiet(T('热数据，纳秒到亚毫秒', 'hot data: ns to sub-ms'), 26)}</div></div>`);
        H(`<div class="r" data-cap="1" data-in="right" style="left:500px;top:220px;width:460px;height:170px"><div class="card" style="height:100%;border-color:var(--red);padding:22px 26px">
          <div style="display:flex;align-items:center;gap:14px">${icon('cross', 44, 'var(--red)')}${big(T('循环里跨洲调用', 'Cross-continent loop'), 32, 'var(--red)')}</div>${quiet(T('一次次等，越叠越慢', 'each call waits, delays add up'), 26)}</div></div>`);
        H(`<div class="r" data-cap="0" data-delay="1.6" data-in="right" style="left:500px;top:420px;width:460px;height:170px"><div class="card" style="height:100%;border-color:var(--blue);padding:22px 26px">
          <div style="display:flex;align-items:center;gap:14px">${icon('rocket', 44, 'var(--blue)')}${big(T('就近部署', 'Deploy near users'), 32, 'var(--blue)')}</div>${quiet(T('少跨洲，少等光走路', 'less distance, less waiting'), 26)}</div></div>`);
        H(`<div class="r card center" data-cap="2" style="left:0;right:0;top:650px;height:120px;border-color:var(--yel);gap:20px">${icon('key', 50, 'var(--yel)')}<span style="font-size:32px;font-weight:800" class="yel">${T('代价：内存贵 · 多地部署更复杂', 'Cost: pricey memory · complex multi-region')}</span></div>`);
      } },

    { title: ['一张图总结', 'One-picture summary'],
      cap: [{zh: '内存纳秒，SSD 微秒，网络毫秒，', en: 'Memory in ns, SSD in µs, network in ms,', say_zh: '内存是纳秒，S S D 是微秒，网络是毫秒，', say_en: 'Memory in nanoseconds, SSD in microseconds, network in milliseconds,'},
            ['跨洲比内存慢约百万倍。截图存好！', 'Cross-continent: about a million times slower. Save this!']],
      build() {
        const R = [['内存', 'Memory', '~100 ns', 2, 'var(--acc2)'], ['SSD 随机读', 'SSD read', '~100 µs', 5, 'var(--yel)'],
                   ['同机房往返', 'Datacenter RTT', '~0.5 ms', 5.7, 'var(--blue)'], ['跨洲往返', 'Cross-continent', '~100 ms', 8, 'var(--red)']];
        R.forEach(([z, e, v, lg, c], i) => H(`<div class="r" data-cap="0" data-delay="${i * 0.6}" style="left:0;top:${40 + i * 140}px;width:960px;height:120px">
          <div style="position:absolute;left:0;top:0;font-size:30px;font-weight:800">${T(z, e)}</div>
          <div style="position:absolute;left:0;top:50px;height:50px;width:${Math.round(lg * 80)}px;background:${c};border-radius:10px;opacity:.85"></div>
          <div class="mono" style="position:absolute;left:${Math.round(lg * 80) + 18}px;top:52px;font-size:38px;font-weight:800;color:${c}">${v}</div></div>`));
        H(`<div class="r" data-cap="0" data-delay="2.4" style="left:0;top:600px">${quiet(T('条长按数量级（对数刻度）', 'bar length = order of magnitude (log scale)'), 24)}</div>`);
        H(`<div class="r card center" data-cap="1" data-in="pop" style="left:0;right:0;top:660px;height:140px;border-color:var(--acc);gap:24px">
          <span style="font-size:36px;font-weight:800">${T('跨洲 ÷ 内存 ≈', 'Cross-continent ÷ memory ≈')}</span><span class="mono acc" style="font-size:60px;font-weight:900">10⁶</span></div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期讲延迟和吞吐量：不是一回事。', 'Next: latency and throughput. Not the same thing.']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 6 课 · Lesson 6', 'Lesson 6')}</div>
          <div class="h" style="font-size:72px;margin-top:30px">${T('延迟 ≠ 吞吐量', 'Latency ≠ throughput')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:36px;margin-top:10px">Latency vs. Throughput</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">${T('多快 · 多少', 'how fast · how much')}</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // answer in meta.json quiz
      cap: [{zh: '考考你：顺序调 10 次跨洲服务，', en: 'Quick quiz: 10 cross-continent calls, one after another,', say_zh: '考考你：顺序调十次跨洲服务，', say_en: 'Quick quiz: ten cross-continent calls, one after another,'},
            {zh: '每次约 100 毫秒，光网络等多久？', en: 'about 100 ms each. How long is the network wait?', say_zh: '每次约一百毫秒，光网络等多久？', say_en: 'about 100 milliseconds each. How long is the network wait?'},
            ['A 还是 B？评论区告诉我。', 'A or B? Tell me in the comments.']],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:30px;padding:30px 40px;font-size:34px;line-height:1.8">${code(
`for i in range(10):
    call_other_continent()  # ${T('每次约 100 ms', '~100 ms each')}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:330px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('约 0.1 秒', '~0.1 s')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('约 1 秒', '~1 s')}</div></div>`);
        H(`<div class="r h acc" data-cap="2" data-delay="0.4" style="left:0;right:0;top:560px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
