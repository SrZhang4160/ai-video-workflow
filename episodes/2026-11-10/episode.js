// 第 18 课 · 迭代器和闭包
window.EPISODE = {
  n: 18,
  scenes: [
    { title: ['一行代替一个循环', 'One line instead of a loop'],
      cap: [['把每个数翻一倍，还在写循环？', 'Doubling every number with a loop?'],
            {zh: '用迭代器加闭包，一句就够了。', en: 'With an iterator and a closure, one line does it.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="left" style="left:0;right:0;top:20px;padding:26px 40px;font-size:32px;line-height:1.7;border-style:dashed">${code(`let mut out = Vec::new();
for x in &v {
    out.push(x * 2);
}`)}</div>`);
        H(`<div class="r mono red" data-cap="0" data-delay="1.0" data-in="stamp" style="left:760px;top:300px;font-size:44px;font-weight:800">${T('4 行', '4 lines')}</div>`);
        H(`<div class="r card mono" data-cap="1" data-in="pop" style="left:0;right:0;top:420px;padding:30px 40px;font-size:30px;line-height:1.7;border-color:var(--acc)">${code(`let out: Vec<i32> =
    v.iter().map(|x| x * 2).collect();`)}</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.8" style="left:0;right:0;top:640px;text-align:center"><span class="chip" style="font-size:30px;border-color:var(--acc2)">[1, 2, 3] → [2, 4, 6]</span></div>`);
      } },

    { title: ['闭包：没名字的小函数', 'Closures: tiny nameless functions'],
      cap: [['先看闭包：它是个没名字的小函数。', 'First, closures: a tiny function with no name.'],
            {zh: '两条竖线里放参数，后面是结果。', en: 'Parameters go between the bars, the result after.', say_en: 'Parameters go between the two bars, the result comes after.'},
            ['存进变量，就能像函数一样调用。', 'Store it in a variable and call it like a function.']],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="left" style="left:0;right:0;top:20px;padding:26px 40px;font-size:32px;line-height:1.7">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:6px">${T('普通函数', 'a plain function')}</div>${code(`fn double(x: i32) -> i32 { x * 2 }`)}</div>`);
        H(`<div class="r card mono" data-cap="0" data-delay="0.8" data-in="right" style="left:0;right:0;top:230px;padding:26px 40px;font-size:40px;line-height:1.7;border-color:var(--acc)">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:6px">${T('闭包', 'a closure')}</div>${code(`let double = |x: i32| x * 2;`)}</div>`);
        H(`<div class="r" data-cap="1" data-in="pop" style="left:0;right:0;top:470px;display:flex;gap:40px;justify-content:center">
          <span class="chip" style="font-size:30px;border-color:var(--blue)"><span class="mono blue">|x: i32|</span> ${T('参数', 'parameters')}</span>
          <span class="chip" style="font-size:30px;border-color:var(--acc2)"><span class="mono ok">x * 2</span> ${T('结果', 'result')}</span></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:600px;padding:26px 40px;font-size:36px;line-height:1.7;border-color:var(--acc2)">${code(`double(5)   // 10`)}</div>`);
      } },

    { title: ['闭包能用外面的变量', 'Closures capture variables'],
      cap: [['闭包还有个本事：能用外面的变量。', 'Closures can also use variables from outside.'],
            {zh: '这里的 k，闭包直接拿来用。', en: 'This k: the closure just uses it.', say_zh: '这里的 K，闭包直接拿来用。'},
            ['换成普通函数，就编译不过。', "Try that with a plain fn and it won't compile."]],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:36px;line-height:1.8;border-color:var(--acc2)">${code(`let k = 3;
let times = |x| x * k;
times(2)   // 6`)}</div>`);
        H(`<div class="r" data-cap="1" data-in="stamp" style="left:560px;top:120px">${badge(T('捕获了 k', 'captures k'), 'var(--acc2)')}</div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:360px;padding:24px 40px;font-size:30px;line-height:1.7;border-style:dashed">${code(`let k = 3;
fn times(x: i32) -> i32 { x * k }`)}</div>`);
        H(`<div class="r card" data-cap="2" data-delay="0.8" data-shake="1" style="left:0;right:0;top:560px;padding:24px 40px;border-color:var(--red)">
          <div class="mono red" style="font-size:30px;font-weight:800">error[E0434]</div>
          <div class="s" style="margin-top:8px">${T('fn 不能捕获外面的变量', "a fn can't capture outside variables")}</div></div>`);
      } },

    { title: ['迭代器：一条流水线', 'Iterators: a pipeline'],
      cap: [['迭代器把元素一个一个递出来，', 'An iterator hands out items one at a time.'],
            {zh: 'map 负责加工，filter 负责筛选，', en: 'map transforms them, filter picks some,', say_zh: '映射负责加工，过滤负责筛选，'},
            ['每一步，都传一个闭包进去，', 'and each step takes a closure.'],
            {zh: '最后用 sum 收尾，算出结果。', en: 'Then sum finishes it off with the result.', say_zh: '最后用求和收尾，算出结果。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:10px;padding:22px 30px;font-size:25px;line-height:1.6">${code(`let v = vec![1, 2, 3, 4, 5, 6];
let total: i32 = v.iter()
    .map(|x| x * x)          // ${T('平方', 'square')}
    .filter(|x| x % 2 == 0)  // ${T('留偶数', 'keep evens')}
    .sum();                  // 56`)}</div>`);
        const row = (y, k, val, c, cap, d) => H(`<div class="r" data-cap="${cap}" data-delay="${d}" data-in="left" style="left:0;right:0;top:${y}px;display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:center">
          <div class="card mono center" style="height:90px;font-size:30px;font-weight:800;color:${c};border-color:${c}">${k}</div>
          <div class="mono" style="font-size:32px">${val}</div></div>`);
        row(330, 'iter()', '1 2 3 4 5 6', 'var(--quiet)', 0, 0.6);
        row(450, 'map', '1 4 9 16 25 36', 'var(--blue)', 1, 0);
        row(570, 'filter', '4 16 36', 'var(--yel)', 1, 0.8);
        H(`<div class="r" data-cap="2" data-in="pop" style="left:0;right:0;top:690px;text-align:center"><span class="chip" style="font-size:28px;border-color:var(--acc)"><span class="mono acc">|x| ...</span> ${T('每一步一个闭包', 'one closure per step')}</span></div>`);
        row(780, 'sum', '<span class="acc" style="font-size:44px;font-weight:800">56</span>', 'var(--acc2)', 3, 0);
      } },

    { title: ['迭代器是懒的', 'Iterators are lazy'],
      cap: [['不过注意，迭代器是懒的。', 'But careful: iterators are lazy.'],
            {zh: '只写 map 不收尾，什么都不会做，', en: 'A map with nothing at the end does nothing at all.', say_zh: '只写映射不收尾，什么都不会做，'},
            ['编译器还会专门提醒你。', 'The compiler even warns you about it.'],
            {zh: '加上 collect 或 sum，它才开始干活。', en: 'Add collect or sum, and only then does it run.', say_zh: '加上收集或者求和，它才开始干活。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:36px;line-height:1.8;border-style:dashed">${code(`v.iter().map(|x| x * 2);`)}</div>`);
        H(`<div class="r mono q" data-cap="1" data-in="pop" style="left:780px;top:150px;font-size:48px;font-weight:800">zzz</div>`);
        H(`<div class="r card mono" data-cap="2" data-shake="1" style="left:0;right:0;top:250px;padding:22px 40px;font-size:26px;line-height:1.6;border-color:var(--yel)">
          <div class="yel" style="font-weight:800">warning: unused \`Map\` that must be used</div>
          <div class="q">note: iterators are lazy and do nothing</div>
          <div class="q">unless consumed</div></div>`);
        H(`<div class="r card mono" data-cap="3" style="left:0;right:0;top:480px;padding:28px 40px;font-size:30px;line-height:1.7;border-color:var(--acc2)">${code(`let w: Vec<i32> =
    v.iter().map(|x| x * 2).collect();`)}</div>`);
        H(`<div class="r" data-cap="3" data-delay="1.0" style="left:0;right:0;top:700px;display:flex;gap:30px;justify-content:center">
          <span class="chip ok" style="border-color:var(--acc2)">.collect()</span><span class="chip ok" style="border-color:var(--acc2)">.sum()</span><span class="chip">${T('收尾 = 开工', 'consume = run')}</span></div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [['总结：闭包是没名字的小函数，', 'To sum up: a closure is a tiny nameless function,'],
            ['迭代器把元素一个个递出来，', 'an iterator hands out items one by one,'],
            ['中间一步步加工，收尾才执行。', 'steps in between shape them, and the end makes it run.']],
      build() {
        const row = (y, k, z, e, c, cap) => H(`<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:170px;display:grid;grid-template-columns:400px 1fr;align-items:center;padding:0 36px;gap:16px;border-color:${c}">
          <div class="mono" style="font-size:34px;font-weight:800;color:${c}">${k}</div><div class="h" style="font-size:32px">${T(z, e)}</div></div>`);
        row(30, '|x| x * k', '闭包：小函数，能用外面变量', 'closure: tiny fn, sees outside vars', 'var(--acc)', 0);
        row(240, 'v.iter()', '迭代器：一个个递元素', 'iterator: one item at a time', 'var(--blue)', 1);
        row(450, '.map .filter', '加工、筛选（懒）', 'transform, filter (lazy)', 'var(--yel)', 2);
        row(660, '.sum .collect', '收尾：这时才执行', 'consume: now it runs', 'var(--acc2)', 2);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '学会这些，下期动手做个命令行工具。', en: "Next time, let's build a command-line tool.", say_zh: '学会这些，下期动手，写一个终端里的小工具。'},
            {zh: '用 clap 库来写，关注我，下期见！', en: 'With the clap crate. Follow along, see you then!', say_zh: '用一个现成的库来写，关注我，下期见！'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:460px;border-color:var(--acc);text-align:center;padding-top:60px">
          <div class="s" style="font-size:34px">${T('第 19 课 · Lesson 19', 'Lesson 19')}</div>
          <div class="h" style="font-size:64px;margin-top:30px">${T('用 clap 写命令行工具', 'A CLI tool with clap')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:36px;margin-top:10px">A CLI tool with clap</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">$ mytool --name Rust</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：这段代码运行会打印什么？', en: 'Quick quiz: what does this code print?'},
            {zh: 'A 还是 B？评论区告诉我。', en: 'A or B? Tell me in the comments.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:30px;padding:30px 40px;font-size:32px;line-height:1.8">${code(`let v = vec![1, 2, 3];
v.iter().map(|x| println!("{}", x));`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:300px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:400px;height:150px;font-size:42px;border-color:var(--blue)">A · <span class="mono">1 2 3</span></div>
          <div class="card center h" style="width:400px;height:150px;font-size:42px;border-color:var(--acc)">B · ${T('什么都不打印', 'Nothing')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:530px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
