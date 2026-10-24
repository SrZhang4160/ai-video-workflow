// 第 1 课 · Rust 知识全景 — reference episode. Copy this shape for new episodes (see runbooks/scenes.md).
window.EPISODE = {
  n: 1,
  scenes: [
    { title: ['Rust 知识全景', 'The big picture of Rust'],
      cap: [['想学 Rust，但不知道从哪下手？', 'Want to learn Rust but not sure where to start?'],
            ['别急，咱们先看一眼全貌。', "Let's look at the big picture first."],
            ['其实就五块，一层一层往上搭。', "It's really just five blocks, stacked one on another."]],
      build() { tower(null, false); H(`<div class="r s" style="left:0;right:0;top:880px;text-align:center">${T('五块知识，一层层往上搭', '5 blocks, built bottom-up')}</div>`); } },

    { title: ['① 基础语法', '① Basics'],
      cap: [['最底层是基础语法：', 'At the bottom: the basics.'],
            ['变量、函数、条件、循环，', 'Variables, functions, conditions, loops —'],
            ['学过 Python 的话，很快就能上手。', 'if you know Python, this part goes fast.']],
      build() {
        H(`<div class="r card mono" style="left:0;right:0;top:20px;padding:34px 40px;font-size:34px;line-height:1.75">${code(
`let x = 5;          // ${T('变量', 'variable')}
let mut y = 1;      // ${T('可变', 'mutable')}
fn add(a: i32, b: i32) -> i32 {
    a + b
}
if x > 3 { ... }
for i in 0..3 { ... }`)}</div>`);
        H(`<div class="r" style="left:0;right:0;top:560px;text-align:center"><span class="chip">${T('和 Python / C++ 很像', 'Feels like Python / C++')}</span><span class="chip ok" style="border-color:var(--acc2)">${T('上手快', 'Quick start')}</span></div>`);
      } },

    { title: ['② 所有权', '② Ownership'],
      cap: [['第二层是所有权，Rust 的灵魂。', 'Layer two is ownership — the soul of Rust.'],
            ['一个值只有一个主人，想用就借。', 'Each value has one owner. To use it, borrow it.'],
            ['这样不用垃圾回收，内存也安全。', 'No garbage collector, and memory stays safe.']],
      build() {
        const box = (x, y, t, c, dash) => `<div class="r card mono center" style="left:${x}px;top:${y}px;width:170px;height:90px;font-size:36px;border-color:${c};color:${c};${dash ? 'border-style:dashed' : ''}">${t}</div>`;
        H(`<div class="r card" style="left:0;width:465px;top:20px;height:560px;padding:28px">
          <div class="h" style="font-size:34px">${B('移动', 'Move')}</div>
          ${box(30, 120, 's1', 'var(--quiet)', 1)}<div class="r mono acc" style="left:215px;top:140px;font-size:40px">→</div>${box(265, 120, 's2', 'var(--acc2)')}
          ${box(150, 300, '"hi"', 'var(--yel)')}
          <div class="r s" style="left:30px;right:30px;top:430px;text-align:center">${T('一个值只有一个主人', 'One owner per value')}</div></div>`);
        H(`<div class="r card" style="left:495px;width:465px;top:20px;height:560px;padding:28px">
          <div class="h" style="font-size:34px">${B('借用', 'Borrow')}</div>
          ${box(30, 120, 's1', 'var(--acc2)')}<div class="r mono blue" style="left:220px;top:136px;font-size:40px">⇠</div>${box(265, 120, '&amp;s1', 'var(--blue)')}
          <div class="r s" style="left:30px;right:30px;top:300px;text-align:center">${T('借来用，主人不变', 'Use it, owner stays the same')}</div>
          <div class="r s" style="left:30px;right:30px;top:430px;text-align:center">${T('用完归还', 'Give it back when done')}</div></div>`);
        H(`<div class="r card center" style="left:0;right:0;top:620px;height:150px;gap:40px;border-color:var(--acc)">
          <span class="h" style="font-size:36px">${T('不用垃圾回收', 'No garbage collector')}</span><span class="h acc" style="font-size:44px">+</span><span class="h" style="font-size:36px">${T('内存安全', 'Memory-safe')}</span></div>`);
      } },

    { title: ['③ 数据建模', '③ Data modeling'],
      cap: [['第三层是数据建模：', 'Layer three: modeling your data.'],
            ['struct 描述数据，enum 表示几种可能，', 'Structs describe data, enums list the possibilities,'],
            ['trait 定义共同的行为。', 'and traits define shared behavior.']],
      build() {
        H(`<div class="r card mono" style="left:0;width:450px;top:20px;padding:26px 30px;font-size:30px;line-height:1.7">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:6px">struct · ${T('描述数据', 'describes data')}</div>${code(`struct User {
    name: String,
    age: u32,
}`)}</div>`);
        H(`<div class="r card" style="left:490px;width:470px;top:20px;height:330px;padding:26px 30px">
          <div class="s" style="margin-bottom:10px">enum · ${T('多种可能', 'one of several')}</div>
          <div class="mono ty" style="text-align:center;font-size:36px;font-weight:800">Option</div>
          <div class="r mono" style="left:60px;top:170px;font-size:30px;border:2px solid var(--acc2);border-radius:14px;padding:12px 22px;color:var(--acc2)">Some(v)</div>
          <div class="r mono" style="left:270px;top:170px;font-size:30px;border:2px solid var(--quiet);border-radius:14px;padding:12px 22px;color:var(--quiet)">None</div></div>`);
        H(`<div class="r card" style="left:0;right:0;top:400px;height:340px;padding:28px 32px">
          <div class="s" style="margin-bottom:12px">trait · ${T('共同行为', 'shared behavior')}</div>
          <div class="mono" style="font-size:32px;text-align:center">${code('trait Speak { fn speak(&self); }')}</div>
          <div style="display:flex;gap:30px;justify-content:center;margin-top:34px">
            <div class="card mono" style="padding:16px 30px;font-size:30px;border-color:var(--blue)">Dog → "Woof"</div>
            <div class="card mono" style="padding:16px 30px;font-size:30px;border-color:var(--blue)">Cat → "Meow"</div></div></div>`);
      } },

    { title: ['④ 工程化', '④ Engineering'],
      cap: [['第四层是工程化：', 'Layer four: real projects.'],
            ['Cargo 管项目，Result 处理错误，', 'Cargo runs the project, Result handles errors,'],
            ['cargo test 一键跑测试。', 'and cargo test runs your tests.']],
      build() {
        H(`<div class="r card mono" style="left:0;width:440px;top:20px;padding:28px 30px;font-size:30px;line-height:1.8">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:6px">Cargo · ${T('项目和依赖', 'project + deps')}</div>
          <div>📁 my_app/</div><div>&nbsp;├ <span class="yel">Cargo.toml</span></div><div>&nbsp;├ src/main.rs</div><div>&nbsp;└ tests/</div>
          <div class="ok" style="margin-top:8px">$ cargo run</div></div>`);
        H(`<div class="r card" style="left:480px;width:480px;top:20px;height:370px;padding:28px 30px">
          <div class="s" style="margin-bottom:14px">Result · ${T('处理错误', 'error handling')}</div>
          <div class="mono ty" style="text-align:center;font-size:34px;font-weight:800">Result</div>
          <svg class="r" style="left:0;top:150px" width="480" height="80"><path d="M240 0 L120 70 M240 0 L360 70" stroke="#4A5160" stroke-width="3" fill="none"/></svg>
          <div class="r mono" style="left:50px;top:240px;font-size:30px;border:2px solid var(--acc2);border-radius:14px;padding:12px 22px;color:var(--acc2)">Ok(${T('值', 'v')})</div>
          <div class="r mono" style="left:270px;top:240px;font-size:30px;border:2px solid var(--red);border-radius:14px;padding:12px 22px;color:var(--red)">Err(${T('错误', 'e')})</div></div>`);
        H(`<div class="r card" style="left:0;right:0;top:450px;height:290px;padding:30px 36px">
          <div class="s" style="margin-bottom:18px">${B('测试', 'Tests')}</div>
          <div class="mono" style="font-size:30px;line-height:1.8"><span class="cm">$ cargo test</span><br><span class="ok">test add_works ... ok</span><br><span class="ok">test result: ok. 3 passed</span></div></div>`);
      } },

    { title: ['⑤ 进阶', '⑤ Advanced'],
      cap: [['最上面是进阶：', 'At the top: advanced topics.'],
            ['迭代器、闭包、智能指针，还有并发和异步。', 'Iterators, closures, smart pointers, concurrency and async.']],
      build() {
        [['迭代器', 'Iterators', 'v.iter().map(..)'], ['闭包', 'Closures', '|x| x + 1'], ['智能指针', 'Smart pointers', 'Box<T> · Rc<T>'], ['并发 · 异步', 'Concurrency · async', 'thread · async']]
          .forEach(([z, e, c], i) => H(`<div class="r card" style="left:${(i % 2) * 490}px;top:${20 + Math.floor(i / 2) * 370}px;width:470px;height:340px;padding:34px 30px;text-align:center">
            <div class="h">${T(z, e)}</div>${LANG === 'zh' ? `<div class="s" style="margin-top:4px">${e}</div>` : ''}
            <div class="mono acc" style="font-size:32px;margin-top:60px">${esc(c)}</div></div>`));
      } },

    { title: ['难度 vs 重要性', 'Difficulty vs importance'],
      cap: [['如果只能挑一块使劲，', 'If you can only go deep on one block,'],
            ['选所有权：它最难，也最重要。', 'pick ownership. It is the hardest and the most important.']],
      build() {
        H(`<div class="r card" style="left:0;right:0;top:10px;height:820px"></div>`);
        H(`<svg class="r" style="left:0;top:10px" width="960" height="820">
          <line x1="110" y1="740" x2="910" y2="740" stroke="#4A5160" stroke-width="3"/><line x1="110" y1="740" x2="110" y2="60" stroke="#4A5160" stroke-width="3"/>
          <line x1="510" y1="70" x2="510" y2="740" stroke="#2A2F3A" stroke-width="2" stroke-dasharray="8 8"/><line x1="110" y1="400" x2="910" y2="400" stroke="#2A2F3A" stroke-width="2" stroke-dasharray="8 8"/>
          <text x="510" y="795" fill="#8B93A3" font-size="28" text-anchor="middle" font-family="Noto Sans SC">${T('难度 Difficulty →', 'Difficulty →')}</text>
          <text x="60" y="400" fill="#8B93A3" font-size="28" text-anchor="middle" font-family="Noto Sans SC" transform="rotate(-90 60 400)">${T('重要性 Importance →', 'Importance →')}</text></svg>`);
        [['基础语法', 'Basics', 230, 170, '#ECEEF3'], ['所有权', 'Ownership', 660, 110, '#FF8A4C'], ['数据建模', 'Data modeling', 500, 230, '#ECEEF3'], ['工程化', 'Engineering', 450, 430, '#ECEEF3'], ['进阶', 'Advanced', 700, 560, '#8B93A3']]
          .forEach(([z, e, x, y, c]) => H(`<div class="r" style="left:${x - 14}px;top:${y - 4}px"><div style="width:28px;height:28px;border-radius:50%;background:${c};${z === '所有权' ? 'box-shadow:0 0 0 10px rgba(255,138,76,.25)' : ''}"></div>
            <div style="position:absolute;left:40px;top:-8px;white-space:nowrap;font-size:32px;font-weight:800;color:${c}">${T(z, e)}${z === '所有权' ? ' ★' : ''}</div></div>`));
      } },

    { title: ['学习重点', 'What to focus on'],
      cap: [['总结一下：', 'To sum up:'],
            ['基础快速过，所有权一定要吃透。', 'move fast on the basics, and really master ownership.']],
      build() { tower(null, true, true); H(`<div class="r" style="left:0;right:0;top:880px;text-align:center;font-size:34px;font-weight:800">${T('基础快速过 · <span class="acc">所有权吃透</span>', 'Basics fast · <span class="acc">master ownership</span>')}</div>`); } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期，咱们就从最底下那层开始，', "Next time, we'll start from the bottom layer:"],
            ['聊聊 Rust 的基础语法。关注我，一起学！', 'Rust basics. Follow along and learn with me!']],
      build() {
        H(`<div class="r card" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 2 课 · Lesson 2', 'Lesson 2')}</div>
          <div class="h" style="font-size:84px;margin-top:30px">${T('基础语法', 'Rust basics')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:40px;margin-top:10px">Rust Basics</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">let · fn · if · loop</div></div>`);
      } },
  ],
};

// shared drawing for this episode: the 5-layer tower
function tower(active, all, star) {
  const L = [['基础语法', 'Basics', '变量 · 函数 · 条件 · 循环', 'variables · functions · if · loops'],
             ['所有权', 'Ownership', '所有权 · 借用 · 生命周期', 'ownership · borrowing · lifetimes'],
             ['数据建模', 'Data modeling', '结构体 · 枚举 · 模式匹配 · trait', 'structs · enums · match · traits'],
             ['工程化', 'Engineering', 'Cargo · 错误处理 · 测试', 'Cargo · errors · tests'],
             ['进阶', 'Advanced', '迭代器 · 闭包 · 智能指针 · 并发', 'iterators · closures · concurrency']];
  for (let i = 0; i <= 4; i++) {   // bottom layer first, so it builds upward
    const [z, e, kz, ke] = L[i], w = 960 - i * 60, on = all || active === i, core = i === 1;
    const bc = (active === i || core) ? 'var(--acc)' : (on ? '#4A5160' : 'var(--line)');
    const bg = (active === i || (all && core)) ? 'rgba(255,138,76,.16)' : (on ? '#1F232C' : '#14171D');
    H(`<div class="r card" style="left:${(960 - w) / 2}px;top:${(4 - i) * 172 + 20}px;width:${w}px;height:150px;border-color:${bc};border-width:${(active === i || core) ? 4 : 2}px;background:${bg}">
      <div class="r mono" style="left:24px;top:16px;font-size:28px;font-weight:800;color:${bc}">${i + 1}</div>
      <div style="text-align:center;padding-top:22px"><span class="h">${B(z, e)}</span></div>
      <div class="s" style="text-align:center;margin-top:8px">${T(kz, ke)}</div>
      ${core ? `<div class="r" style="right:18px;top:16px;background:var(--acc);color:var(--bg);font-weight:800;font-size:24px;border-radius:999px;padding:2px 14px">${T('核心', 'Core')}${star ? ' ★' : ''}</div>` : ''}</div>`);
  }
}
