// 第 2 课 · 变量：let、mut 和 shadowing
window.EPISODE = {
  n: 2,
  scenes: [
    { title: ['变量：let 和 mut', 'Variables: let and mut'],
      cap: [['在 Rust 里，变量默认不能改。', "In Rust, variables can't change by default."],
            ['这是故意设计的。', "That's on purpose."]],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:36px 44px;font-size:42px;line-height:1.8">${code(`let x = 5;
x = 6;`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.2" data-in="stamp" style="left:560px;top:150px">${icon('cross', 110, 'var(--red)')}</div>`);
        H(`<div class="r center" data-cap="1" data-in="pop" style="left:0;right:0;top:420px;flex-direction:column;gap:10px">
          <div class="h" style="font-size:56px">${T('默认不可变', 'Immutable by default')}</div>
          ${LANG === 'zh' ? '<div class="s">immutable by default</div>' : ''}</div>`);
      } },

    { title: ['编译器直接拦住', 'The compiler stops you'],
      cap: [['改一个不可变的变量，', 'Try to change an immutable variable,'],
            ['代码还没运行，编译器就报错了。', 'and the compiler errors before the code even runs.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:34px;line-height:1.7">${code(`let x = 5;
x = 6;   // ${T('想改成 6', 'try to change it')}`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:290px;padding:30px 40px;font-size:30px;line-height:1.7;border-color:var(--red)">
          <div class="q">$ cargo run</div>
          <div class="red" style="font-weight:800">error[E0384]: cannot assign twice</div>
          <div class="red" style="font-weight:800">to immutable variable \`x\`</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.6" style="left:0;right:0;top:640px;text-align:center"><span class="chip ok" style="border-color:var(--acc2)">${T('bug 在编译时就被发现', 'caught at compile time')}</span></div>`);
      } },

    { title: ['想改？加 mut', 'Need to change it? Add mut'],
      cap: [['想改，就加 mut。', 'Want to change it? Add mut.'],
            ['一眼就能看出，哪些值会变。', 'Now anyone reading the code sees which values change.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:36px 44px;font-size:42px;line-height:1.8">${code(`let mut y = 5;
y = 6;`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.0" data-in="stamp" style="left:560px;top:150px">${icon('check', 110, 'var(--acc2)')}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:420px;display:flex;gap:30px;justify-content:center">
          <div class="card center" style="width:420px;height:200px;flex-direction:column;gap:8px"><div class="mono" style="font-size:40px">let</div><div class="s">${T('不会变', "won't change")}</div></div>
          <div class="card center" style="width:420px;height:200px;flex-direction:column;gap:8px;border-color:var(--acc)"><div class="mono acc" style="font-size:40px">let mut</div><div class="s">${T('会变', 'will change')}</div></div></div>`);
      } },

    { title: ['Shadowing：同名再声明', 'Shadowing: declare it again'],
      cap: [['还有一招，叫 shadowing：', 'Another trick is called shadowing:'],
            ['用 let 再声明一次同名变量，', 'declare the same name again with let,'],
            ['新的会遮住旧的。', 'and the new one hides the old one.']],
      build() {
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:20px;padding:30px 40px;font-size:38px;line-height:1.8">${code(`let x = 5;
let x = x + 1;   // ${T('新的 x', 'a new x')}
println!("{x}"); // 6`)}</div>`);
        H(`<div class="r card mono center" data-cap="2" data-in="left" style="left:80px;top:400px;width:330px;height:150px;font-size:40px;color:var(--quiet);border-style:dashed">x = 5</div>`);
        H(`<div class="r card mono center" data-cap="2" data-delay="0.5" data-in="right" style="left:550px;top:400px;width:330px;height:150px;font-size:40px;color:var(--acc2);border-color:var(--acc2)">x = 6</div>`);
        H(`<div class="r mono" data-cap="2" data-delay="0.9" data-in="pop" style="left:440px;top:440px;font-size:56px;color:var(--acc)">→</div>`);
        H(`<div class="r s" data-cap="2" data-delay="1.3" style="left:0;right:0;top:590px;text-align:center">${T('旧的 x 被遮住了，不是被修改了', 'the old x is hidden, not modified')}</div>`);
      } },

    { title: ['Shadowing 能换类型', 'Shadowing can change the type'],
      cap: [['而且，它还能换类型：', 'And it can even change the type:'],
            ['字符串变成数字，没问题。', 'a string becomes a number, no problem.'],
            ['用 mut 就不行，类型必须一样。', 'With mut, the type has to stay the same.']],
      build() {
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:20px;padding:26px 36px;font-size:32px;line-height:1.7;border-color:var(--acc2)">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:4px">shadowing ${icon('check', 34, 'var(--acc2)')}</div>${code(`let spaces = "   ";
let spaces = spaces.len();   // 3`)}</div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:300px;padding:26px 36px;font-size:32px;line-height:1.7;border-color:var(--red)">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:4px">mut ${icon('cross', 34, 'var(--red)')}</div>${code(`let mut spaces = "   ";
spaces = spaces.len();`)}
          <div class="red" style="font-size:28px;font-weight:800;margin-top:6px">error[E0308]: mismatched types</div></div>`);
      } },

    { title: ['一张表记住', 'Remember it in one table'],
      cap: [['总结一下：默认不可变，', 'To recap: immutable by default,'],
            ['要改值，加 mut；', 'add mut to change the value,'],
            ['要换类型，用 shadowing。', 'and use shadowing to change the type.']],
      build() {
        const row = (y, k, a, b, c, cap) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:150px;display:grid;grid-template-columns:300px 1fr 1fr;align-items:center;padding:0 34px;gap:10px">
          <div class="mono" style="font-size:36px;${c ? 'color:var(--acc)' : ''}">${k}</div><div style="font-size:32px">${a}</div><div style="font-size:32px">${b}</div></div>`;
        H(`<div class="r s" data-cap="0" style="left:34px;right:0;top:20px;display:grid;grid-template-columns:300px 1fr 1fr;padding:0 34px"><span></span><span>${T('能改值？', 'Change value?')}</span><span>${T('能换类型？', 'Change type?')}</span></div>`);
        H(row(70, 'let', `<span class="red">✗</span>`, `<span class="red">✗</span>`, false, 0));
        H(row(240, 'let mut', `<span class="ok">✓</span>`, `<span class="red">✗</span>`, true, 1));
        H(row(410, 'let x = …', `<span class="ok">✓</span> ${T('新变量', 'new variable')}`, `<span class="ok">✓</span>`, true, 2));
        H(`<div class="r s" data-cap="2" data-delay="0.6" style="left:34px;top:575px">${T('第三行 = shadowing', 'row 3 = shadowing')}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期，聊聊 Rust 的基本类型。', "Next time: Rust's basic types."],
            ['关注我，一起学！', 'Follow along and learn with me!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 3 课 · Lesson 3', 'Lesson 3')}</div>
          <div class="h" style="font-size:84px;margin-top:30px">${T('基本类型', 'Basic types')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:40px;margin-top:10px">Basic types</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">i32 · f64 · bool · char</div></div>`);
      } },
  ],
};
