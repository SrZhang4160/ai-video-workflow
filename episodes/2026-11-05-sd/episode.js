// 系统设计 第 4 课 · 存储估算：一年要多少硬盘 (see runbooks/scenes.md, 系统设计 section)
const sdBig = (text, size = 44, color = 'var(--ink)') => `<div style="font-size:${size}px;font-weight:800;color:${color};line-height:1.2">${text}</div>`;
const sdSmall = (text, size = 26) => `<div style="font-size:${size}px;color:var(--quiet);line-height:1.35;margin-top:8px">${text}</div>`;
const sdEst = (cap, delay = 0, top = 20) => `<div class="r" data-cap="${cap}" data-delay="${delay}" data-in="pop" style="right:0;top:${top}px">${badge(T('估算', 'estimate'), 'var(--yel)', 26)}</div>`;

window.EPISODE = {
  n: 4,
  scenes: [
    { title: ['一年要多少硬盘？', 'How much disk for a year?'],
      cap: [['面试官问：一年要多少硬盘？', 'The interviewer asks: how much disk for a year?'],
            ['别慌，四个数一乘就出来。', "Don't panic. Multiply four numbers and you're done."]],
      build() {
        H(`<div class="r card" data-cap="0" data-in="left" style="left:0;top:40px;width:600px;padding:30px 34px;border-color:var(--blue)">
          <div style="display:flex;align-items:center;gap:18px">${icon('user', 56, 'var(--blue)')}<span class="s">${T('面试官', 'Interviewer')}</span></div>
          ${sdBig(T('“这个系统一年要多少硬盘？”', '“How much storage does this need per year?”'), 36)}</div>`);
        H(`<div class="r center" data-cap="0" data-delay="0.8" data-in="pop" style="left:640px;top:40px;width:320px;height:320px;flex-direction:column;gap:6px">
          ${icon('db', 170, 'var(--quiet)')}<div class="mono acc" style="font-size:60px;font-weight:900">? TB</div></div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:470px;display:flex;justify-content:center;align-items:center;gap:22px">
          ${[['条/天', 'rec/day'], ['大小', 'size'], ['365', '365'], ['副本', 'copies']].map(([z, e], i) => `<div class="card center" style="width:160px;height:160px;flex-direction:column;gap:6px;border-color:var(--acc)"><span class="mono acc" style="font-size:56px;font-weight:900">${i + 1}</span><span class="s" style="font-size:26px">${T(z, e)}</span></div>`).join('<span class="h q" style="font-size:52px">×</span>')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="1.0" style="left:0;right:0;top:680px;text-align:center">${sdBig(T('四个数一乘', 'Four numbers, multiplied'), 44, 'var(--acc)')}</div>`);
      } },

    { title: ['存储估算公式', 'The storage formula'],
      cap: [['公式就这一行：', 'The whole formula is one line:'],
            {zh: '每天新增条数 × 每条大小，', en: 'new records per day × size per record,', say_zh: '每天新增条数，乘每条大小，', say_en: 'new records per day, times size per record,'},
            {zh: '再 × 365 天 × 副本数。', en: 'then × 365 days × number of copies.', say_zh: '再乘三百六十五天，乘副本数。', say_en: 'then times three hundred sixty-five days, times the number of copies.'}],
      build() {
        const box = (cap, delay, x, y, z, e, c) => H(`<div class="r card center" data-cap="${cap}" data-delay="${delay}" data-in="pop" style="left:${x}px;top:${y}px;width:380px;height:160px;border-color:${c};flex-direction:column;text-align:center">
          <div class="h" style="font-size:38px;color:${c}">${T(z, e)}</div>${LANG === 'zh' ? `<div class="s" style="font-size:24px">${e}</div>` : ''}</div>`);
        const x = (cap, delay, l, t) => H(`<div class="r h q" data-cap="${cap}" data-delay="${delay}" style="left:${l}px;top:${t}px;font-size:60px">×</div>`);
        box(1, 0, 70, 60, '每天新增条数', 'new records / day', 'var(--blue)');
        x(1, 0.5, 470, 98);
        box(1, 0.7, 530, 60, '每条大小', 'size / record', 'var(--blue)');
        box(2, 0.2, 70, 270, '365 天', '365 days', 'var(--acc2)');
        x(2, 0.6, 470, 308);
        box(2, 0.8, 530, 270, '副本数', 'copies', 'var(--acc2)');
        H(`<div class="r card center" data-cap="2" data-delay="1.6" data-in="drop" style="left:40px;right:40px;top:500px;height:150px;border-color:var(--acc);gap:24px">
          ${icon('db', 70, 'var(--acc)')}${sdBig(T('= 一年要的硬盘', '= disk needed per year'), 46, 'var(--acc)')}</div>`);
      } },

    { title: ['① 每天新增多少条', '① Records per day'],
      cap: [['举个例子：一个发帖应用。', "Example: an app where people post."],
            {zh: '日活 1000 万，每人每天发 2 条，', en: '10 million daily users, 2 posts each per day,', say_zh: '日活一千万，每人每天发两条，', say_en: 'ten million daily users, two posts each per day,'},
            {zh: '每天就新增 2000 万条。', en: 'so 20 million new posts a day.', say_zh: '每天就新增两千万条。', say_en: 'so twenty million new posts a day.'}],
      build() {
        H(sdEst(0, 0.4));
        H(`<div class="r card" data-cap="0" style="left:0;top:20px;width:520px;height:120px;padding:0 30px;display:flex;align-items:center;gap:18px">${icon('box', 54, 'var(--blue)')}${sdBig(T('发帖应用', 'A posting app'), 40)}</div>`);
        H(`<div class="r card center" data-cap="1" data-in="left" style="left:0;top:200px;width:430px;height:220px;flex-direction:column;gap:10px">
          ${icon('user', 70, 'var(--blue)')}<div class="mono" style="font-size:52px;font-weight:900">${T('1000 万', '10M')}</div><div class="s">${T('日活', 'daily users')}</div></div>`);
        H(`<div class="r h q" data-cap="1" data-delay="0.6" style="left:452px;top:270px;font-size:64px">×</div>`);
        H(`<div class="r card center" data-cap="1" data-delay="0.8" data-in="right" style="left:530px;top:200px;width:430px;height:220px;flex-direction:column;gap:10px">
          ${icon('card', 70, 'var(--blue)')}<div class="mono" style="font-size:52px;font-weight:900">2</div><div class="s">${T('条 / 人 / 天', 'posts / user / day')}</div></div>`);
        H(`<div class="r card center" data-cap="2" data-in="drop" style="left:0;right:0;top:500px;height:170px;border-color:var(--acc);gap:20px">
          <span class="mono acc" style="font-size:72px;font-weight:900">= ${T('2000 万', '20M')}</span><span class="s" style="font-size:32px">${T('条 / 天', 'posts / day')}</span></div>`);
      } },

    { title: ['② 每条多大', '② Size per record'],
      cap: [['一条帖子：正文，加作者、时间。', 'One post: the text, plus author and time.'],
            {zh: '算上索引和余量，约 1 KB。', en: 'Add indexes and headroom: about 1 KB.', say_zh: '算上索引和余量，大约一 K B。', say_en: 'Add indexes and headroom: about one kilobyte.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;top:20px;width:620px;padding:30px 34px;font-size:32px;line-height:1.8">${code(`{
  "id":      ...,  // 8 B
  "user_id": ...,  // 8 B
  "time":    ...,  // 8 B
  "text":    "..." // ${T('约 500 B', '~500 B')}
}`)}</div>`);
        H(`<div class="r card" data-cap="1" data-in="right" style="left:660px;top:20px;width:300px;height:140px;padding:22px 24px;border-color:var(--quiet)">
          ${sdBig(T('+ 索引', '+ indexes'), 34)}${sdSmall(T('+ 余量', '+ headroom'), 30)}</div>`);
        H(`<div class="r card center" data-cap="1" data-delay="0.8" data-in="stamp" style="left:660px;top:200px;width:300px;height:200px;border-color:var(--acc);flex-direction:column">
          <div class="s">${T('取整', 'round up')}</div><div class="mono acc" style="font-size:80px;font-weight:900">≈1 KB</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.6" style="left:0;right:0;top:500px;text-align:center">${sdBig(T('估算只要数量级对，取整就好', 'Estimates only need the right order of magnitude'), 36, 'var(--quiet)')}</div>`);
      } },

    { title: ['单位换算', 'Unit ladder'],
      cap: [{zh: '2000 万条 × 1 KB 是多少？', en: '20 million × 1 KB is how much?', say_zh: '两千万条，乘一 K B，是多少？', say_en: 'Twenty million times one kilobyte. How much is that?'},
            {zh: '单位每升一级，就乘一千。', en: 'Each unit step up is × 1000.', say_en: 'Each unit step up is times one thousand.'},
            {zh: '所以每天大约 20 GB。', en: 'So about 20 GB a day.', say_zh: '所以每天大约二十 G B。', say_en: 'So about twenty gigabytes a day.'},
],
      build() {
        H(`<div class="r card center mono" data-cap="0" style="left:0;right:0;top:20px;height:120px;font-size:44px;font-weight:800">${T('2000 万', '20M')} × 1 KB = <span class="acc">&nbsp;?</span></div>`);
        const U = ['KB', 'MB', 'GB', 'TB', 'PB'];
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:200px;height:180px">
          ${U.map((u, i) => `<div class="r card center mono" style="left:${i * 200}px;top:40px;width:160px;height:110px;font-size:44px;font-weight:900;color:${u === 'GB' ? 'var(--acc)' : 'var(--ink)'};border-color:${u === 'GB' ? 'var(--acc)' : 'var(--line)'}">${u}</div>`).join('')}
          ${[0, 1, 2, 3].map(i => `<div class="r mono q" style="left:${i * 200 + 140}px;top:0;width:80px;text-align:center;font-size:24px">×1000</div>`).join('')}</div>`);
        H(`<div class="r card mono" data-cap="2" data-in="left" style="left:0;right:0;top:430px;padding:26px 34px;font-size:36px;line-height:1.7">
          <div>${T('2000 万 KB', '20,000,000 KB')} <span class="q">=</span> ${T('2 万 MB', '20,000 MB')}</div>
          <div><span class="q">=</span> <span class="acc" style="font-weight:900">20 GB</span> <span class="q">/ ${T('天', 'day')}</span></div></div>`);
        H(`<div class="r" data-cap="2" data-delay="1.0" style="left:0;right:0;top:680px;text-align:center"><span class="chip">${T('二进制单位是 1024', 'Binary units use 1024')}</span><span class="chip ok" style="border-color:var(--acc2)">${T('估算用 1000', 'estimates use 1000')}</span></div>`);
      } },

    { title: ['③ 乘一年，乘副本', '③ × a year, × copies'],
      cap: [{zh: '每天 20 GB，乘 365 天，', en: '20 GB a day, × 365 days,', say_zh: '每天二十 G B，乘三百六十五天，', say_en: 'Twenty gigabytes a day, times three hundred sixty-five days,'},
            {zh: '一年大约 7.3 TB。', en: 'is about 7.3 TB a year.', say_zh: '一年大约七点三 T B。', say_en: 'is about seven point three terabytes a year.'},
            {zh: '数据通常存 3 份，防机器坏。', en: 'Data is commonly kept in 3 copies, in case a machine dies.', say_zh: '数据通常存三份，防止机器坏了丢数据。', say_en: 'Data is commonly kept in three copies, in case a machine dies.'},
            {zh: '再乘 3：一年约 22 TB。', en: '× 3: about 22 TB a year.', say_zh: '再乘三，一年大约二十二 T B。', say_en: 'Times three: about twenty-two terabytes a year.'}],
      build() {
        H(sdEst(0, 0.3));
        const row = (cap, y, l, r, c) => H(`<div class="r card" data-cap="${cap}" data-in="left" style="left:0;width:820px;top:${y}px;height:120px;padding:0 34px;display:flex;align-items:center;justify-content:space-between;border-color:${c}">
          <span class="mono q" style="font-size:36px">${l}</span><span class="mono" style="font-size:52px;font-weight:900;color:${c}">${r}</span></div>`);
        row(0, 80, `20 GB × 365`, '', 'var(--line)');
        row(1, 230, `= 7300 GB`, '≈ 7.3 TB', 'var(--blue)');
        H(`<div class="r" data-cap="2" style="left:0;top:390px;display:flex;align-items:center;gap:26px">
          ${[0, 1, 2].map(() => icon('db', 90, 'var(--acc2)')).join('')}<span class="s" style="font-size:32px">${T('3 份副本：贵 3 倍，坏一台不丢', '3 copies: 3× the disk, survive a dead machine')}</span></div>`);
        row(3, 540, `7.3 TB × 3`, '', 'var(--line)');
        H(`<div class="r card center" data-cap="3" data-delay="0.6" data-in="stamp" style="left:0;width:820px;top:690px;height:130px;border-color:var(--acc);gap:24px">
          <span class="s" style="font-size:32px">${T('一年', 'per year')}</span><span class="mono acc" style="font-size:72px;font-weight:900">≈ 22 TB</span></div>`);
      } },

    { title: ['先找大头', 'Find the big item first'],
      cap: [{zh: '要是每条再带一张 200 KB 的图？', en: 'What if each post also has a 200 KB image?', say_zh: '要是每条再带一张两百 K B 的图呢？', say_en: 'What if each post also has a two hundred kilobyte image?'},
            {zh: '每天 4 TB，一年约 1.5 PB。', en: 'That is 4 TB a day, about 1.5 PB a year.', say_zh: '每天四 T B，一年大约一点五 P B。', say_en: 'That is four terabytes a day, about one point five petabytes a year.'},
            ['图片才是大头，文字几乎可以忽略。', 'Images dominate. The text barely matters.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:24px 34px;font-size:34px;line-height:1.7">
          <div>${T('2000 万', '20M')} × 200 KB <span class="q">=</span> <span class="acc">4 TB / ${T('天', 'day')}</span></div>
          <div><span class="q">×</span> 365 <span class="q">≈</span> <span class="acc">1460 TB ≈ 1.5 PB</span></div></div>`);
        const bar = (cap, delay, y, z, e, w, val, c) => H(`<div class="r" data-cap="${cap}" data-delay="${delay}" data-in="left" style="left:0;top:${y}px;width:960px">
          <div class="s" style="font-size:28px">${T(z, e)}</div>
          <div style="display:flex;align-items:center;gap:20px;margin-top:10px"><div style="width:${w}px;height:70px;border-radius:10px;background:${c}"></div><span class="mono" style="font-size:40px;font-weight:900;color:${c}">${val}</span></div></div>`);
        bar(1, 0, 260, '文字 · 一年', 'Text · per year', 10, '7.3 TB', 'var(--blue)');
        bar(1, 0.8, 420, '图片 · 一年', 'Images · per year', 640, '1.5 PB', 'var(--acc)');
        H(`<div class="r" data-cap="1" data-delay="1.4" style="left:0;top:600px">${sdSmall(T('都还没乘副本', 'both before copies'), 26)}</div>`);
        H(`<div class="r card center" data-cap="2" data-in="pop" style="left:0;right:0;top:680px;height:120px;border-color:var(--acc)">${sdBig(T('先算最大的那一项', 'Estimate the biggest item first'), 42, 'var(--acc)')}</div>`);
      } },

    { title: ['一张图总结', 'One-picture summary'],
      cap: [{zh: '条数 × 大小 × 365 × 副本。', en: 'Records × size × 365 × copies.', say_zh: '条数，乘大小，乘三百六十五，乘副本。', say_en: 'Records, times size, times three sixty-five, times copies.'},
            {zh: '单位每级乘一千，先算大头。', en: 'Each unit is × 1000. Do the biggest item first.', say_en: 'Each unit is times one thousand. Do the biggest item first.'}],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:20px;padding:30px 36px;border-color:var(--acc)">
          <div class="s">${T('存储估算 · 公式', 'Storage estimate · formula')}</div>
          <div class="mono" style="font-size:${T('38px', '34px')};font-weight:800;margin-top:14px;line-height:1.5">${T('条/天', 'records/day')} <span class="acc">×</span> ${T('每条大小', 'size')} <span class="acc">×</span> 365 <span class="acc">×</span> ${T('副本', 'copies')}</div></div>`);
        H(`<div class="r card mono" data-cap="0" data-delay="0.8" style="left:0;right:0;top:240px;padding:26px 36px;font-size:32px;line-height:1.7">
          <div class="s" style="font-family:'Noto Sans SC'">${T('例：发帖应用（估算）', 'Example: posting app (estimate)')}</div>
          <div>${T('2000 万', '20M')} × 1 KB <span class="q">=</span> 20 GB/${T('天', 'day')}</div>
          <div>× 365 × 3 <span class="q">≈</span> <span class="acc" style="font-weight:900">22 TB/${T('年', 'yr')}</span></div></div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:560px;display:flex;justify-content:center;gap:10px;align-items:center">
          ${['KB', 'MB', 'GB', 'TB', 'PB'].map(u => `<span class="card mono" style="padding:12px 20px;font-size:34px;font-weight:900">${u}</span>`).join('<span class="mono q" style="font-size:24px">×1000</span>')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.8" style="left:0;right:0;top:700px;text-align:center"><span class="chip acc" style="border-color:var(--acc)">${T('图片、视频通常是大头', 'Images and video usually dominate')}</span></div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期：内存、SSD、网络、跨洲，', en: 'Next: memory, SSD, network, across continents.', say_zh: '下期：内存、固态硬盘、网络、跨洲，', say_en: 'Next: memory, S S D, network, across continents.'},
            {zh: '延迟差几个数量级？关注我！', en: 'How many orders of magnitude apart? Follow along!'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:160px;height:480px;border-color:var(--acc);text-align:center;padding-top:60px">
          <div class="s" style="font-size:34px">${T('第 5 课 · Lesson 5', 'Lesson 5')}</div>
          <div class="h" style="font-size:${T('80px', '68px')};margin-top:30px">${T('延迟数字', 'Latency numbers')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:40px;margin-top:10px">Latency numbers</div>' : ''}
          <div class="mono acc" style="font-size:30px;margin-top:40px">${T('内存 · SSD · 网络 · 跨洲', 'RAM · SSD · network · cross-continent')}</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：每天 100 万条，每条 2 KB，', en: 'Quick quiz: 1 million records a day, 2 KB each,', say_zh: '考考你：每天一百万条，每条两 K B，', say_en: 'Quick quiz: one million records a day, two kilobytes each,'},
            {zh: '存三份，一年大约要多少硬盘？', en: '3 copies. About how much disk per year?', say_en: 'three copies. About how much disk per year?'},
            ['A 还是 B？评论区告诉我。', 'A or B? Tell me in the comments.']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:30px 40px;font-size:36px;line-height:1.8">
          <div>${T('每天新增', 'New records / day')}：<span class="mono acc">${T('100 万条', '1 million')}</span></div>
          <div>${T('每条大小', 'Size / record')}：<span class="mono acc">2 KB</span></div>
          <div>${T('副本数', 'Copies')}：<span class="mono acc">3</span></div>
          <div class="s" style="margin-top:8px">${T('一年大约多少？（1 TB 按 1000 GB 算）', 'Per year? (1 TB = 1000 GB)')}</div></div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:420px;display:flex;gap:48px;justify-content:center">
          <div class="card center h mono" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · 2.2 TB</div>
          <div class="card center h mono" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · 22 TB</div></div>`);
        H(`<div class="r h acc" data-cap="2" data-delay="0.6" style="left:0;right:0;top:620px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
