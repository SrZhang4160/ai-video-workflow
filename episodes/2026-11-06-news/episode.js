// 每日 AI 快讯 #3 · LoCo（腾讯微信 AI + 西安交大）：推理模型少想 45%，准确率没掉 (sources in meta.json → sources)
// Voice: the user records this episode (engine/own_voice.py); captions are written to be read aloud.
// All numbers are the authors' own (arXiv 2611.04814, Table 1/2); said as 「论文报告 / 作者称」.
const card = (x, y, w, h, inner, extra = '') =>
  `<div class="r card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">${inner}</div>`;
const big = (text, size = 44, color = 'var(--ink)') => `<div style="font-size:${size}px;font-weight:800;color:${color};line-height:1.2">${text}</div>`;
const small = (text, size = 26) => `<div style="font-size:${size}px;color:var(--quiet);line-height:1.35;margin-top:8px">${text}</div>`;
const row = (y, ic, col, text, cap, delay = 0) => `<div class="r card" data-cap="${cap}" ${delay ? `data-delay="${delay}"` : ''} style="left:0;right:0;top:${y}px;height:100px;display:flex;align-items:center;gap:22px;padding:0 30px;border-left:8px solid ${col}">
    ${icon(ic, 42, col)}<div style="font-size:30px;font-weight:700">${text}</div></div>`;
// crop of a real screenshot: show source region (sx, sy, sw wide) scaled into a w × h box, so text stays phone-readable
const crop = (file, o) => {
  const k = o.w / o.sw, base = window.EP_DIR || '';
  return `<div class="r card" ${o.attrs || ''} style="left:${o.x ?? 0}px;top:${o.y ?? 0}px;width:${o.w}px;height:${o.h}px;overflow:hidden;padding:0;${o.border ? `border-color:${o.border};` : ''}">
    <img src="${base}assets/${file}" style="position:absolute;left:${-o.sx * k}px;top:${-o.sy * k}px;width:${o.iw * k}px;max-width:none;display:block"></div>`;
};
// one reasoning step box (s0, s1, …) in the chain diagram
const step = (label, col, fill) => `<div style="width:100px;height:84px;border-radius:12px;border:3px solid ${col};background:${fill};display:flex;align-items:center;justify-content:center;font-family:JBM;font-size:28px;font-weight:800;color:${col}">${label}</div>`;

window.EPISODE = {
  n: 3,
  theme: 'news',
  tag: ['AI 快讯', 'AI News'],
  scenes: [
    // 1 · Hook: thinking tokens 13,493 → 7,364 on AIME24, accuracy did not drop (authors' result)
    { tag: ['头条', 'TOP STORY'], title: ['少想近一半，答案照样对', 'Think almost half as much, still right'],
      cap: [['让推理模型少想近一半，答案还一样对。', 'Make a reasoning model think almost half as much, and still get it right.'],
            ['AIME24 数学题，思考从 13493 降到 7364 个 token，', 'On AIME24 math, thinking drops from 13,493 to 7,364 tokens.'],
            ['准确率没掉，还略升了一点。', "Accuracy didn't drop. It even went up a little."],
            ['这个结果，来自腾讯和西安交大的新论文。', 'That is what a new Tencent and Xi\'an Jiaotong paper reports.']],
      build() {
        hook({label: ['AIME24 · 每题平均思考 token', 'AIME24 · avg thinking tokens per problem'], a: ['13,493', '13,493'], b: ['7,364', '7,364'], top: 30, capB: 1});
        H(`<div class="r" data-cap="1" data-delay="1.1" data-in="stamp" style="left:730px;top:330px;transform:rotate(-8deg);border:5px solid var(--acc2);color:var(--acc2);border-radius:14px;padding:4px 18px;font-size:50px;font-weight:900;font-family:JBM">−45%</div>`);
        H(card(0, 590, 960, 110, `<div style="display:flex;align-items:center;gap:22px;padding:0 30px;height:100%">${icon('check', 50, 'var(--acc2)')}
            <div style="font-size:32px;font-weight:800">${T('准确率', 'Accuracy')} <span class="mono q">50.8%</span> → <span class="mono" style="color:var(--acc2)">54.2%</span></div>
            <div style="margin-left:auto;font-size:26px;color:var(--quiet)">${T('没掉，略升', 'held, up a little')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 2;
        H(`<div class="r" data-cap="3" style="left:0;top:722px">${src(T('arXiv 2611.04814 · 作者报告', 'arXiv 2611.04814 · authors\' results'))}</div>`);
      } },

    // 2 · News: what it is (real HF Daily Papers page)
    { tag: ['新闻', 'NEWS'], title: ['LoCo：上了 HF 每日论文', 'LoCo: on HF Daily Papers'],
      cap: [['论文叫 LoCo，全名 Think Less, Locally。', 'The paper is called LoCo: "Think Less, Locally."'],
            ['上了 Hugging Face 每日论文，截图时 56 个赞。', 'It made Hugging Face Daily Papers, with 56 upvotes when we looked.']],
      build() {
        H(crop('hf-paper.png', {x: 0, y: 0, w: 960, h: 560, sx: 150, sy: 405, sw: 900, iw: 1800}));
        H(`<div class="r" data-cap="0" data-delay="0.6" style="left:0;top:575px">${src('Hugging Face Papers · arXiv 2611.04814')}</div>`);
        H(card(0, 625, 960, 100, `<div style="display:flex;align-items:center;gap:22px;padding:0 30px;height:100%">
            <svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 4l9 15H3z" fill="var(--acc)"/></svg>
            <div style="font-size:34px;font-weight:800">Upvote <span class="mono acc" data-count="1.0">56</span></div>
            <div style="margin-left:auto;font-size:26px;color:var(--quiet)">${T('Hugging Face 每日论文', 'HF Daily Papers')}</div></div>`, 'border-color:var(--acc)')).dataset.cap = 1;
      } },

    // 3 · How it works: the idea as a diagram (find the overthink step → freeze → regenerate ×8 → keep shortest correct → DPO)
    { tag: ['原理', 'HOW IT WORKS'], title: ['怎么做到的？', 'How does it work?'],
      cap: [['推理模型常想太多：答案有了还在想，白花钱。', 'Reasoning models overthink: they have the answer and keep paying to think.'],
            ['LoCo 先找到，开始想太多的那一步，', 'LoCo first finds the step where overthinking starts.'],
            ['前面不动，从这儿让模型重写 8 次，', 'It keeps everything before it, and regenerates 8 times from there,'],
            ['留下最短、而且答对的那一个。', 'keeping the shortest one that is still correct.'],
            ['再用 DPO 训练，教它从这一步起走更短的路。', 'Then DPO training teaches it to take the shorter path from that step.']],
      build() {
        const G = ['var(--quiet)', '#22396A'], O = ['var(--yel)', '#4A4226'], R = ['var(--red)', '#4A2638'];
        const chain = [['s0', G], ['s1', G], ['s2', G], ['s3', G], ['si', O], ['…', R], ['…', R], ['sn', R]];
        H(`<div class="r" data-cap="0" data-in="left" style="left:0;top:60px;display:flex;gap:15px">${chain.map(([l, c]) => step(l, c[0], c[1])).join('')}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.0" style="left:575px;top:165px;width:385px;text-align:center;font-size:28px;font-weight:800;color:var(--red)">${icon('card', 34, 'var(--red)')} ${T('多想 = 花钱 + 多等', 'extra = cost + wait')}</div>`);
        H(`<div class="r" data-cap="1" data-in="drop" style="left:380px;top:0;width:260px;text-align:center;font-size:28px;font-weight:800;color:var(--yel)">${T('↓ 从这步开始想多', '↓ overthinking starts')}</div>`);
        H(`<div class="r" data-cap="2" data-in="left" style="left:0;top:165px;width:560px;height:46px;border-radius:12px;background:#244A80;border:2px solid var(--blue);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:var(--blue)">${T('前缀冻结 · 不动', 'prefix frozen')}</div>`);
        const lens = [[620, 0], [380, 1], [700, 1], [240, 0], [450, 1], [300, 1], [560, 0], [820, 1]];
        H(`<div class="r" data-cap="2" data-delay="0.5" style="left:0;top:250px;width:960px">
            <div style="position:absolute;left:0;top:110px;font-size:36px;font-weight:900;color:var(--acc2);font-family:JBM">×8</div>
            ${lens.map(([w, ok], k) => `<div style="position:absolute;left:90px;top:${k * 36}px;display:flex;align-items:center;gap:12px">
              <div style="width:${w}px;height:22px;border-radius:8px;background:${ok ? 'var(--acc2)' : '#3A5588'};opacity:${ok ? 0.85 : 0.6}"></div>${icon(ok ? 'check' : 'cross', 28, ok ? 'var(--acc2)' : 'var(--red)')}</div>`).join('')}</div>`);
        H(`<div class="r" data-cap="3" data-in="stamp" style="left:78px;top:${250 + 5 * 36 - 10}px;width:${300 + 64}px;height:44px;border:4px solid var(--yel);border-radius:12px"></div>`);
        H(`<div class="r" data-cap="3" data-delay="0.3" style="left:470px;top:${250 + 5 * 36 - 8}px;font-size:28px;font-weight:800;color:var(--yel)">${T('← 最短且答对', '← shortest correct')}</div>`);
        H(card(0, 560, 960, 130, `<div style="display:flex;align-items:center;gap:20px;padding:0 30px;height:100%">${badge('DPO', 'var(--acc2)', 30)}
            <div style="font-size:29px;font-weight:700;line-height:1.35">${T('同一前缀：<span style="color:var(--acc2)">短而对 ✓</span> 胜过 <span style="color:var(--red)">原来冗长的 ✗</span>', 'same prefix: <span style="color:var(--acc2)">short &amp; correct ✓</span> beats <span style="color:var(--red)">the original long one ✗</span>')}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 4;
      } },

    // 4 · How it works: the paper's Figure 1, detection panel (confidence + judge model)
    { tag: ['原理', 'HOW IT WORKS'], title: ['论文原图：怎么找到那一步？', "Figure 1: finding that step"],
      cap: [['怎么找？看模型自己每一步有多确定：', 'How? It looks at how confident the model is at each step.'],
            ['信心低、又忽高忽低的，再让裁判模型确认。', 'Steps with low, jumpy confidence go to a judge model to confirm.']],
      build() {
        H(crop('arxiv-fig1.png', {x: 0, y: 0, w: 960, h: 390, sx: 0, sy: 240, sw: 725, iw: 1600, attrs: 'data-hl="1"'}));
        H(`<div class="r" data-cap="0" data-delay="0.6" style="left:0;top:405px">${src(T('Yuan 等 2026 · 论文图 1', 'Yuan et al. 2026 · Figure 1'))}</div>`);
        H(card(0, 470, 465, 150, `<div style="padding:22px 26px">${big(T('信心低', 'Low confidence'), 34, 'var(--acc)')}${small(T('+ 忽高忽低', '+ jumpy'), 28)}</div>`, 'border-color:var(--acc)')).dataset.cap = 1;
        { const e = H(card(495, 470, 465, 150, `<div style="padding:22px 26px">${big(T('裁判模型确认', 'Judge model confirms'), 34, 'var(--blue)')}${small('Qwen3-30B-A3B-Instruct', 24)}</div>`, 'border-color:var(--blue)')); e.dataset.cap = 1; e.dataset.delay = '0.7'; }
      } },

    // 5 · Analysis: the real table + the other benchmarks (authors' numbers)
    { tag: ['分析', 'ANALYSIS'], title: ['成绩：作者自己的数字', "Results: the authors' own numbers"],
      cap: [['别的压缩法也变短了，但准确率掉了；', 'In the table, another method also gets shorter, but loses accuracy.'],
            ['作者称：数学省四成多，代码题省两到三成多。', 'Authors say: 40%+ fewer tokens on math, 23–36% fewer on code.']],
      build() {
        H(crop('arxiv-aime.png', {x: 0, y: 0, w: 960, h: 500, sx: 0, sy: 0, sw: 770, iw: 1320}));
        // TokenSqueeze row (shorter, accuracy −2.08) and LoCo row (−45.4%, accuracy +3.34)
        H(`<div class="r" data-cap="0" data-in="stamp" style="left:2px;top:276px;width:956px;height:96px;border:4px solid var(--red);border-radius:12px"></div>`);
        H(`<div class="r" data-cap="0" data-delay="1.2" data-in="stamp" style="left:2px;top:374px;width:956px;height:120px;border:4px solid var(--acc2);border-radius:12px"></div>`);
        H(`<div class="r" data-cap="0" data-delay="0.4" style="left:0;top:512px">${src('arXiv 2611.04814 · Table 1')}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:560px;display:flex;flex-wrap:wrap;gap:4px">
            ${[['MATH-500', '44'], ['AMC23', '42'], ['Olympiad', '45'], ['AIME24', '45'], ['AIME25', '45']].map(([n, p]) => `<span class="chip" style="font-size:24px;margin:3px;padding:5px 14px;border-color:var(--acc2)">${n} <b style="color:var(--acc2)">−${p}%</b></span>`).join('')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="1.4" style="left:0;top:680px"><span class="chip" style="font-size:28px;margin:0;border-color:var(--blue)">${icon('gear', 30, 'var(--blue)')} ${T('代码题（只用数学训练）', 'Code (trained on math only)')} <b style="color:var(--blue)">−23% ~ −36%</b></span></div>`);
      } },

    // 6 · News: try it — weights on Hugging Face (MIT, 8B, vLLM), command types on
    { tag: ['新闻', 'NEWS'], title: ['想试？权重已经开源', 'Want to try it? Weights are open'],
      cap: [['想试？LoCo-7B 权重已在 Hugging Face，', 'Want to try it? The LoCo-7B weights are on Hugging Face,'],
            ['MIT 协议，代码在 GitHub，用 vLLM 就能跑。', 'MIT licensed, code on GitHub, and it runs with vLLM.'],
            ['最低要什么显卡，作者没写；他们用的是 H20。', "The minimum GPU isn't stated; the authors used NVIDIA H20s."]],
      build() {
        H(crop('hf-model.png', {x: 0, y: 0, w: 960, h: 300, sx: 150, sy: 195, sw: 900, iw: 1800}));
        H(`<div class="r" data-cap="0" data-delay="0.6" style="left:0;top:312px">${src('Hugging Face · MuyaoYuan/LoCo-7B')}</div>`);
        H(`<div class="r card mono" data-cap="1" data-type="2.2" style="left:0;top:365px;width:960px;padding:22px 26px;font-size:24px;line-height:1.75;background:#0A1530">
            ${code('$ pip install vllm\n$ vllm serve "MuyaoYuan/LoCo-7B"')}</div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:560px;display:flex;flex-wrap:wrap;gap:4px">
            <span class="chip" style="margin:4px">${T('8B 参数 · BF16', '8B params · BF16')}</span><span class="chip" style="margin:4px">MIT</span>
            <span class="chip" style="margin:4px;border-color:var(--yel)">${icon('gear', 28, 'var(--yel)')} ${T('显卡下限：未写明', 'Min GPU: not stated')}</span>
            <span class="chip" style="margin:4px">${T('作者用 NVIDIA H20', 'Authors used NVIDIA H20')}</span></div>`);
      } },

    // 7 · My take (labelled) + one-line summary + what to watch
    { tag: ['观点', 'MY TAKE'], title: ['我的看法 + 一句话', 'My take, in one line'],
      cap: [['我的看法：只测了一个 7B 模型，', 'My take: only one 7B model was tested,'],
            ['数字是作者自报，AIME 波动也大，', "the numbers are the authors' own, and AIME scores swing a lot,"],
            ['而且要改权重才能用，闭源 API 模型用不上。', "and it works by changing the weights, so closed API models can't use it."],
            ['一句话：不是全都少想，只改想多的那一步。', "In one line: don't cut thinking everywhere. Fix the step where it overthinks."],
            ['接下来看：有没有人在别的模型上复现。', 'What to watch: whether others reproduce it on other models.']],
      build() {
        const lim = (y, ic, text, cap) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:80px;display:flex;align-items:center;gap:20px;padding:0 28px;border-left:8px solid var(--yel)">
            ${icon(ic, 38, 'var(--yel)')}<div style="font-size:29px;font-weight:700">${text}</div></div>`;
        H(`<div class="r" data-cap="0" style="left:0;top:14px">${badge(T('观点 · 非事实', 'Opinion, not fact'), 'var(--yel)', 26)}</div>`);
        H(lim(62, 'box', T('只测了 1 个 7B 模型', 'Only one 7B model tested'), 0));
        H(lim(152, 'user', T('作者自己的数字 · AIME 波动 ±4–7', "Authors' own numbers · AIME ±4–7"), 1));
        H(lim(242, 'cross', T('要改权重 · 闭源 API 模型用不上', 'Needs weight changes · not for closed API models'), 2));
        H(card(0, 345, 960, 100, `<div style="display:flex;align-items:center;gap:20px;padding:0 28px;height:100%">
            <div style="font-size:26px;color:var(--quiet)">AIME24 · token</div>
            <div class="mono" style="font-size:40px;font-weight:900"><span class="q" style="text-decoration:line-through;text-decoration-color:var(--red)">13,493</span> → <span style="color:var(--acc2)">7,364</span></div>
            <div style="margin-left:auto;font-size:24px;color:var(--yel)">${T('作者报告', "authors' result")}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 3;
        { const e = H(`<div class="r card center" data-in="pop" style="left:0;right:0;top:465px;height:140px;border-color:var(--acc);border-width:4px;flex-direction:column;gap:6px">
            <div style="font-size:28px;color:var(--quiet)">${T('不是一刀切地少想', 'Not "think less everywhere"')}</div>
            <div style="font-size:44px;font-weight:900">${T('只改<span class="acc">想多的那一步</span>', 'Fix <span class="acc">the overthink step</span>')}</div></div>`); e.dataset.cap = 3; e.dataset.delay = '0.6'; }
        H(`<div class="r card" data-cap="4" style="left:0;right:0;top:625px;height:80px;display:flex;align-items:center;gap:18px;padding:0 28px;border-left:8px solid var(--blue)">
            ${badge(T('接下来看', 'Watch'), 'var(--blue)', 24)}<div style="font-size:28px;font-weight:700">${T('有没有人在别的模型上复现？', 'Independent reproductions on other models?')}</div></div>`);
      } },
  ],
};
