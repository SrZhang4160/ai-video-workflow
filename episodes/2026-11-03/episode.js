// 第 11 课 · enum + match：穷尽所有情况
window.EPISODE = {
  n: 11,
  scenes: [
    { title: ['漏掉一种情况会怎样？', 'What if you miss a case?'],
      cap: [['漏掉一种情况，程序会怎样？', 'What if your code forgets one case?'],
            ['在 Rust 里，根本编译不过。', "In Rust, it won't even compile."],
            {zh: '这就是 enum 加 match。', en: "That's enum plus match.", say_zh: '这就是枚举，加模式匹配。'}],
      build() {
        const lamp = (i, c, z, e, mark) => `<div class="r card center" style="left:${i * 330}px;top:0;width:300px;height:300px;flex-direction:column;gap:18px">
          <div style="width:110px;height:110px;border-radius:50%;background:${c}"></div>
          <div class="h" style="font-size:34px">${T(z, e)} ${mark}</div></div>`;
        H(`<div class="r" data-cap="0" style="left:0;right:0;top:40px;height:300px">
          ${lamp(0, '#FF5D5D', '红灯', 'Red', icon('check', 34, 'var(--acc2)'))}
          ${lamp(1, '#F5C84C', '黄灯', 'Yellow', '<span class="yel" style="font-size:40px">?</span>')}
          ${lamp(2, '#4CD6A0', '绿灯', 'Green', icon('check', 34, 'var(--acc2)'))}</div>`);
        H(`<div class="r card mono" data-cap="1" data-in="stamp" data-shake="1" style="left:0;right:0;top:400px;padding:26px 34px;font-size:${T('28px', '27px')};border-color:var(--red);color:var(--red);font-weight:800">error[E0004]: non-exhaustive patterns:<br>\`Light::Yellow\` not covered</div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:640px;text-align:center"><span class="chip">enum</span><span class="chip acc" style="border-color:var(--acc)">+</span><span class="chip">match</span></div>`);
      } },

    { title: ['enum：几种里选一种', 'enum: one of several'],
      cap: [{zh: '上期 struct 是几样都有，', en: "Last time's struct has all its fields;", say_zh: '上期的结构体，是几样都有；'},
            {zh: 'enum 枚举是几种里只能选一种，', en: 'an enum is one of several variants,', say_zh: '枚举，是几种里只能选一种，'},
            ['比如红绿灯：红、黄、绿。', 'like a traffic light: red, yellow, or green.']],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:20px;height:150px;padding:24px 34px;display:flex;align-items:center;gap:30px">
          <div class="mono" style="font-size:36px;font-weight:800;white-space:nowrap"><span class="kw">struct</span> <span class="ty">Rect</span></div>
          <div style="font-size:32px">${T('宽 w <b>和</b> 高 h <b>都有</b>', 'width <b>and</b> height, <b>all at once</b>')}</div></div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;width:550px;top:210px;padding:30px 36px;font-size:34px;line-height:1.75;border-color:var(--acc)">${code(`enum Light {
    Red,
    Yellow,
    Green,
}
let now = Light::Red;`)}</div>`);
        H(`<div class="r s" data-cap="1" data-delay="0.6" style="left:580px;right:0;top:220px;text-align:center">${T('同一时刻只能是一种', 'Only one at a time')}</div>`);
        [['#FF5D5D', 'Red', 1], ['#F5C84C', 'Yellow', 0.3], ['#4CD6A0', 'Green', 0.3]].forEach(([c, n, o], i) => H(`<div class="r center" data-cap="2" data-delay="${i * 0.35}" data-in="pop" style="left:620px;top:${290 + i * 150}px;width:320px;height:120px;gap:26px;justify-content:flex-start">
          <div style="width:100px;height:100px;border-radius:50%;background:${c};opacity:${o};${o === 1 ? 'box-shadow:0 0 0 10px rgba(255,93,93,.25)' : ''}"></div>
          <div class="mono" style="font-size:34px;opacity:${o === 1 ? 1 : 0.5}">${n}</div></div>`));
      } },

    { title: ['match：每种情况一个分支', 'match: one arm per case'],
      cap: [{zh: '用 match 按情况分别处理。', en: 'Use match to handle each case.', say_zh: '用模式匹配，按情况分别处理。'},
            {zh: 'match 也是表达式，能直接赋值。', en: 'match is an expression, so it gives a value.', say_zh: '模式匹配也是表达式，能直接赋值。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:38px;line-height:1.75">${code(`let secs = match now {
    Light::Red    => 30,
    Light::Yellow => 3,
    Light::Green  => 25,
};`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.5" style="left:0;right:0;top:430px;display:flex;gap:24px;justify-content:center;align-items:center">
          <div class="card center h" style="width:300px;height:110px;font-size:34px;border-color:var(--blue);color:var(--blue)">${T('模式', 'pattern')}</div>
          <div class="mono acc" style="font-size:50px;font-weight:800">=&gt;</div>
          <div class="card center h" style="width:300px;height:110px;font-size:34px;border-color:var(--acc2);color:var(--acc2)">${T('结果', 'result')}</div></div>`);
        H(`<div class="r card mono center" data-cap="1" data-in="pop" style="left:160px;right:160px;top:600px;height:120px;font-size:36px;border-color:var(--acc)">now = Red → secs =&nbsp;<span class="nu">30</span></div>`);
      } },

    { title: ['漏一个，编译不过', 'Miss one, no build'],
      cap: [['要是漏写了黄灯，编译直接报错。', 'Leave out Yellow, and the build fails.'],
            ['这就叫穷尽：每种情况都得管到。', 'That is exhaustiveness: every case must be handled.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:36px;line-height:1.75">${code(`let secs = match now {
    Light::Red   => 30,
    Light::Green => 25,
};`)}</div>`);
        H(`<div class="r mono" data-cap="0" data-delay="0.8" data-in="pop" style="left:700px;top:120px;font-size:40px;font-weight:800;color:var(--yel)">Yellow ?</div>`);
        H(`<div class="r card mono" data-cap="0" data-delay="1.0" data-in="stamp" data-shake="1" style="left:0;right:0;top:340px;padding:24px 34px;font-size:${T('28px', '27px')};border-color:var(--red);color:var(--red);font-weight:800">${icon('cross', 30, 'var(--red)')} error[E0004]: non-exhaustive patterns:<br>\`Light::Yellow\` not covered</div>`);
        H(`<div class="r center" data-cap="1" data-in="stamp" style="left:0;right:0;top:560px;flex-direction:column;gap:8px">
          <div class="h" style="font-size:56px">${T('<span class="acc">穷尽</span>：每种都要管', 'Every case, <span class="acc">no gaps</span>')}</div>
          ${LANG === 'zh' ? '<div class="s">exhaustive matching</div>' : ''}</div>`);
      } },

    { title: ['好处：改一处，全找到', 'The payoff: nothing slips'],
      cap: [['以后给枚举加一种新情况，', 'Add a new case to the enum later,'],
            {zh: '每个漏了它的 match 都会报错。', en: 'and every match that misses it becomes an error.', say_zh: '每个漏了它的模式匹配，都会报错。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;width:420px;top:20px;padding:28px 34px;font-size:34px;line-height:1.7">${code(`enum Light {
    Red,
    Yellow,
    Green,`)}<div class="ok" style="font-weight:800">&nbsp;&nbsp;&nbsp;&nbsp;Off, <span class="q" style="font-weight:400;font-size:26px">// ${T('新加', 'new')}</span></div>${code(`}`)}</div>`);
        ['timer.rs', 'display.rs', 'sensor.rs'].forEach((f, i) => H(`<div class="r card" data-cap="1" data-delay="${i * 0.4}" style="left:470px;right:0;top:${20 + i * 140}px;height:115px;display:flex;align-items:center;justify-content:space-between;padding:0 30px;border-color:var(--red)">
          <div class="mono" style="font-size:30px">${f} <span class="q" style="font-size:26px">match</span></div>${icon('cross', 44, 'var(--red)')}</div>`));
        H(`<div class="r card center" data-cap="1" data-delay="1.6" data-in="pop" style="left:0;right:0;top:500px;height:150px;gap:24px;border-color:var(--acc2)">
          ${icon('check', 50, 'var(--acc2)')}<span class="h" style="font-size:40px">${T('一个都漏不掉', 'Nothing slips through')}</span></div>`);
      } },

    { title: ['_ 兜底：小心使用', '_ catch-all: use with care'],
      cap: [{zh: '不想一个个写？用 _ 兜住剩下的。', en: "Don't want to list them all? _ catches the rest.", say_zh: '不想一个个写？用下划线兜住剩下的。', say_en: "Don't want to list them all? An underscore catches the rest."},
            ['但小心：新加的情况也会被它吞掉。', 'But careful: it also swallows any case you add later.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:38px;line-height:1.75">${code(`match now {
    Light::Red => println!("stop"),
    _          => println!("not red"),
}`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.2" style="left:0;right:0;top:340px;display:flex;gap:16px;justify-content:center;align-items:center">
          <div class="card mono center" style="width:130px;height:110px;font-size:56px;font-weight:800;border-color:var(--acc);color:var(--acc)">_</div>
          <div class="mono acc" style="font-size:44px">→</div>
          <span class="chip">Yellow</span><span class="chip">Green</span></div>`);
        H(`<div class="r card center" data-cap="1" data-in="drop" style="left:0;right:0;top:520px;height:150px;gap:20px;border-color:var(--yel)">
          <span class="chip ok" style="border-color:var(--acc2)">+ Off</span><span class="mono yel" style="font-size:40px">→ _</span>
          <span class="h yel" style="font-size:34px">${T('不报错，悄悄吞掉', 'no error, silently caught')}</span></div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [{zh: '总结：enum 列出所有可能，', en: 'To sum up: an enum lists every possibility,', say_zh: '总结：枚举列出所有可能，'},
            {zh: 'match 每种都得管，漏了就报错。', en: "match must handle each one, or it won't compile.", say_zh: '模式匹配每种都得管，漏了就报错。'}],
      build() {
        const row = (y, k, z, e, c, cap, d) => `<div class="r card" data-cap="${cap}" data-delay="${d || 0}" style="left:0;right:0;top:${y}px;height:140px;display:grid;grid-template-columns:200px 1fr;align-items:center;padding:0 34px;gap:16px;border-color:${c}">
          <div class="mono" style="font-size:40px;font-weight:800;color:${c}">${k}</div><div style="font-size:32px">${T(z, e)}</div></div>`;
        H(row(20, 'enum', '列出所有可能，一次只取一种', 'Lists every option; a value is one of them', 'var(--blue)', 0));
        H(row(185, 'match', '每种情况一个分支，能直接出值', 'One arm per case; it gives a value', 'var(--acc2)', 1));
        H(row(350, T('漏写', 'miss one'), '<span class="red">编译不过</span>（E0004）', '<span class="red">won\'t compile</span> (E0004)', 'var(--red)', 1, 0.8));
        H(row(515, '_', '兜底，但会吞掉新情况', 'Catch-all, but hides new cases', 'var(--yel)', 1, 1.6));
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期：超常用的枚举 Option，', en: 'Next time, a very common enum: Option,', say_zh: '下期讲一个超常用的枚举：可选类型，'},
            {zh: 'Rust 为啥没 null？关注我！', en: 'and why Rust has no null. Follow along!', say_zh: 'Rust 为什么没有空值？关注我！'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 12 课 · Lesson 12', 'Lesson 12')}</div>
          <div class="h" style="font-size:80px;margin-top:30px">Option</div>
          <div class="s" style="font-size:40px;margin-top:10px">${T('Rust 为什么没有 null', 'Why Rust has no null')}</div>
          <div class="mono acc" style="font-size:32px;margin-top:40px">Some(v) · None</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：这段代码能编译吗？', en: 'Quick quiz: does this code compile?'},
            {zh: '能，还是不能？评论区告诉我。', en: 'Yes or no? Tell me in the comments.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:30px;padding:28px 40px;font-size:34px;line-height:1.7">${code(`enum Dir { Up, Down, Left }

let d = Dir::Up;
match d {
    Dir::Up => println!("up"),
    _ => println!("other"),
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:470px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('能', 'Yes')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('不能', 'No')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:660px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
