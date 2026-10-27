// 第 5 课 · 控制流：if 是表达式，loop / while / for
window.EPISODE = {
  n: 5,
  scenes: [
    { title: ['if 也能有值？', 'Can an if have a value?'],
      cap: [['if 能直接给变量赋值？', 'Can an if give a value to a variable?'],
            ['能，因为 if 是表达式。', 'Yes, because if is an expression.'],
            ['一分钟把控制流讲清楚。', "Let's clear up control flow in one minute."]],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:60px;padding:40px 44px;font-size:40px;line-height:1.8">${code(`let x = if ok { 1 } else { 0 };`)}</div>`);
        H(`<div class="r mono" data-cap="0" data-delay="1.0" data-in="pop" style="left:420px;top:250px;font-size:110px;font-weight:800;color:var(--yel)">?</div>`);
        H(`<div class="r center" data-cap="1" data-in="stamp" style="left:0;right:0;top:470px;flex-direction:column;gap:10px">
          <div class="h" style="font-size:60px"><span class="acc">if</span> ${T('是表达式', 'is an expression')}</div>
          ${LANG === 'zh' ? '<div class="s">if is an expression</div>' : ''}</div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:700px;text-align:center"><span class="chip">if</span><span class="chip">loop</span><span class="chip">while</span><span class="chip">for</span></div>`);
      } },

    { title: ['if 的值 = 执行的分支', 'if takes the branch\'s value'],
      cap: [['上期说过，表达式会产生值。', 'Last time: expressions produce a value.'],
            ['if 也一样：哪个分支执行，', 'if works the same way: whichever branch runs,'],
            ['整个 if 就等于那个分支的值。', 'the whole if takes that branch\'s value.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;width:590px;top:20px;padding:30px 30px;font-size:30px;line-height:1.75">${code(`let n = 7;
let kind = if n % 2 == 0 {
    "even"
} else {
    "odd"
};`)}</div>`);
        H(`<div class="r card mono center" data-cap="1" style="left:620px;width:340px;top:20px;height:110px;font-size:30px;border-color:var(--blue);color:var(--blue)">n % 2 == 0 ?</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.5" style="left:620px;width:340px;top:150px;display:flex;justify-content:space-between">
          <div class="card mono center" style="width:158px;height:100px;font-size:30px;color:var(--quiet);border-style:dashed">"even"</div>
          <div class="card mono center" style="width:158px;height:100px;font-size:30px;color:var(--acc2);border-color:var(--acc2)">"odd" ${icon('check', 30, 'var(--acc2)')}</div></div>`);
        H(`<div class="r card mono center" data-cap="2" data-in="pop" style="left:620px;width:340px;top:290px;height:110px;font-size:34px;border-color:var(--acc)">kind = <span class="st">&nbsp;"odd"</span></div>`);
        H(`<div class="r" data-cap="2" data-delay="0.8" style="left:0;right:0;top:500px;text-align:center"><span class="chip">${T('n = 7 是奇数 → 走 else', 'n = 7 is odd → else runs')}</span></div>`);
      } },

    { title: ['两个分支，类型要一样', 'Both branches: same type'],
      cap: [['注意：两个分支类型必须一样。', 'Careful: both branches must have the same type.'],
            ['一个数字，一个字符串？编译不过。', 'A number and a string? It won\'t compile.'],
            ['if 本身有值，不需要三元运算符。', 'Since if has a value, Rust needs no ternary operator.']],
      build() {
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:20px;padding:28px 38px;font-size:32px;line-height:1.7;border-color:var(--red)">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:4px">${T('类型不一致', 'Types differ')} ${icon('cross', 34, 'var(--red)')}</div>${code(`let x = if ok { 5 } else { "five" };`)}
          <div class="red" style="font-size:25px;font-weight:800;margin-top:8px">error[E0308]: \`if\` and \`else\` have incompatible types</div></div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:340px;display:flex;gap:30px;justify-content:center">
          <div class="card center" style="width:440px;height:220px;flex-direction:column;gap:12px"><div class="s">${T('其他语言', 'Other languages')}</div><div class="mono q" style="font-size:36px">ok ? 1 : 0</div></div>
          <div class="card center" style="width:440px;height:220px;flex-direction:column;gap:12px;border-color:var(--acc2)"><div class="s">Rust</div><div class="mono ok" style="font-size:30px">if ok { 1 } else { 0 }</div></div></div>`);
      } },

    { title: ['loop：一直转，break 带值出来', 'loop: spin until break'],
      cap: [['再看循环。loop 会一直转，', 'Now loops. loop runs forever,'],
            ['直到你用 break 跳出来。', 'until you break out of it.'],
            ['而且 break 后面还能带一个值。', 'And break can even carry a value out.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 40px;font-size:${T('32px', '28px')};line-height:1.6">${code(`let mut count = 0;
let result = loop {
    count += 1;
    if count == 3 {
        break count * 10;  // ${T('带值跳出', 'leave with a value')}
    }
};
println!("{result}");    // 30`)}</div>`);
        ['1', '2', '3'].forEach((v, i) => H(`<div class="r card mono center" data-cap="1" data-delay="${i * 0.4}" data-in="pop" style="left:${i * 170}px;top:530px;width:140px;height:120px;font-size:44px;${i === 2 ? 'border-color:var(--acc);color:var(--acc)' : ''}">${v}</div>`));
        H(`<div class="r card mono center" data-cap="2" data-in="stamp" style="left:540px;top:530px;width:420px;height:120px;font-size:34px;border-color:var(--acc2);color:var(--acc2)">break → 30</div>`);
        H(`<div class="r s" data-cap="1" data-delay="0.2" style="left:0;top:670px">count</div>`);
      } },

    { title: ['while：条件为真就继续', 'while: run while it\'s true'],
      cap: [['while 带一个条件，', 'while takes a condition:'],
            ['条件为真就继续，变假就停。', 'it keeps going while true and stops when false.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;width:560px;top:20px;padding:30px 36px;font-size:32px;line-height:1.75">${code(`let mut n = 3;
while n > 0 {
    println!("{n}");
    n -= 1;
}
println!("liftoff!");`)}</div>`);
        H(`<div class="r card mono" data-cap="1" style="left:620px;width:340px;top:20px;height:390px;padding:28px 32px;font-size:32px;line-height:1.7">
          <div class="q">$ cargo run</div><div>3</div><div>2</div><div>1</div><div class="ok">liftoff!</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.0" style="left:0;right:0;top:470px;display:flex;gap:24px;justify-content:center;align-items:center">
          <span class="chip ok" style="border-color:var(--acc2)">n &gt; 0 ${T('真 → 继续', 'true → loop')}</span>
          <span class="chip red" style="border-color:var(--red)">n = 0 ${T('假 → 停', 'false → stop')}</span></div>`);
      } },

    { title: ['for：遍历数组和范围', 'for: walk arrays and ranges'],
      cap: [['最常用的是 for，', "The one you'll use most is for:"],
            ['遍历一个数组，或者一个范围。', 'it walks through an array or a range.'],
            {zh: '0..3 是 0、1、2，不含 3。', en: '0..3 means 0, 1, 2. The 3 is left out.',
             say_zh: '零点点三，就是零、一、二，不含三。', say_en: 'Zero dot dot three means zero, one, two. The three is left out.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:32px;line-height:1.7">${code(`let a = [10, 20, 30];
for x in a {
    println!("{x}");   // 10 20 30
}
for i in 0..3 {
    println!("{i}");   // 0 1 2
}`)}</div>`);
        [0, 1, 2, 3].forEach(i => H(`<div class="r card mono center" data-cap="2" data-delay="${i * 0.35}" data-in="${i === 3 ? 'stamp' : 'pop'}" style="left:${60 + i * 220}px;top:510px;width:180px;height:140px;font-size:56px;${i === 3 ? 'color:var(--quiet);border-style:dashed;text-decoration:line-through' : 'color:var(--acc2);border-color:var(--acc2)'}">${i}</div>`));
        H(`<div class="r s" data-cap="2" data-delay="1.6" style="left:0;right:0;top:680px;text-align:center">${T('左闭右开：包含 0，不包含 3', 'start included, end excluded')}</div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [['总结：if 是表达式，能产生值。', 'To sum up: if is an expression, so it gives a value.'],
            ['不知道转几圈，用 loop；', "Don't know how many rounds? Use loop."],
            ['条件用 while，遍历用 for。', 'Have a condition? while. Walking a collection? for.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;right:0;top:20px;height:150px;gap:24px;border-color:var(--acc)">
          <span class="mono acc" style="font-size:48px;font-weight:800">if</span><span class="h" style="font-size:44px">= ${T('表达式，有值', 'an expression with a value')}</span></div>`);
        const card = (i, k, ic, z, e, cap) => H(`<div class="r card" data-cap="${cap}" data-delay="${i === 2 ? 0.8 : 0}" style="left:${i * 330}px;top:220px;width:300px;height:400px;padding:34px 20px;text-align:center">
          <div>${icon(ic, 70, 'var(--acc2)')}</div>
          <div class="mono" style="font-size:44px;font-weight:800;margin-top:20px">${k}</div>
          <div class="s" style="margin-top:24px">${T(z, e)}</div></div>`);
        card(0, 'loop', 'retry', '不知道几圈', 'unknown rounds', 1);
        card(1, 'while', 'clock', '看条件', 'a condition', 2);
        card(2, 'for', 'box', '遍历集合', 'each item', 2);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期，进入 Rust 的核心：', 'Next time, the heart of Rust:'],
            ['所有权的三条规则。关注我，一起学！', 'the three rules of ownership. Follow along!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 6 课 · Lesson 6', 'Lesson 6')}</div>
          <div class="h" style="font-size:80px;margin-top:30px">${T('所有权三规则', 'Ownership rules')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:40px;margin-top:10px">The 3 rules of ownership</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">owner · one owner · drop</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{"zh": "考考你：这段代码能编译吗？", "en": "Quick quiz: does this code compile?", "say_zh": "考考你：这段代码能编译吗？", "say_en": "Quick quiz: does this code compile?"},
            {"zh": "能，还是不能？评论区告诉我。", "en": "Yes or no? Tell me in the comments.", "say_zh": "能，还是不能？评论区告诉我。", "say_en": "Yes or no? Tell me in the comments."}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:30px 40px;font-size:38px;line-height:1.8">${code(`let n = if true { 1 } else { "one" };`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:238px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T("能", "Yes")}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T("不能", "No")}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:438px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
