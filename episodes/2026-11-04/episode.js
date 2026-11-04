// 第 12 课 · Option：Rust 为什么没有 null
// Voice notes: the cloned Chinese voice trips on short English keywords, so say_zh speaks them in Chinese:
// null → 空值, Option → 可选类型, Some → 有值, None → 没值, unwrap → 解包, if let → 如果匹配, match → 模式匹配,
// Option<i32> → 可选的整数, Result → 结果类型.
window.EPISODE = {
  n: 12,
  scenes: [
    { title: ['Rust 为什么没有 null？', 'Why does Rust have no null?'],
      cap: [['最常见的崩溃之一：空引用。', 'One of the most common crashes: a null reference.'],
            {zh: 'Rust 干脆没有 null，为什么？', en: 'Rust has no null at all. Why?', say_zh: 'Rust 干脆没有空值，为什么？'}],
      build() {
        const err = (y, lang, msg, d) => H(`<div class="r card mono" data-cap="0" data-delay="${d}" data-in="left" data-shake="1" style="left:0;right:0;top:${y}px;padding:16px 28px;border-color:var(--red)">
          <div class="s" style="font-family:'Noto Sans SC';font-size:24px">${lang}</div><div class="red" style="font-size:26px;font-weight:800">${msg}</div></div>`);
        err(20, 'Java', 'NullPointerException', 0);
        err(160, 'JavaScript', 'TypeError: Cannot read properties of null', 0.4);
        err(300, 'Python', 'AttributeError: \'NoneType\' object has no attribute \'x\'', 0.8);
        H(`<div class="r card center" data-cap="1" data-in="stamp" style="left:180px;right:180px;top:480px;height:160px;gap:24px;border-color:var(--acc)">
          <span class="mono" style="font-size:60px;font-weight:800;text-decoration:line-through;color:var(--quiet)">null</span>
          <span class="h" style="font-size:44px">${T('Rust 里没有', 'not in Rust')}</span></div>`);
        H(`<div class="r h center" data-cap="1" data-delay="1.0" data-in="pop" style="left:0;right:0;top:690px;font-size:100px;color:var(--yel)">?</div>`);
      } },

    { title: ['null 的问题', "What's wrong with null"],
      cap: [{zh: '类型看不出会是 null，忘查就崩。', en: "The type won't say it can be null. Miss a check, it crashes.", say_zh: '类型看不出它可能是空值，忘了检查就崩。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 34px;font-size:30px;line-height:1.75">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:4px">Java</div>${code(`String name = findName(id);
int n = name.length();`)}</div>`);
        H(`<div class="r card center" data-cap="0" style="left:0;width:450px;top:280px;height:200px;flex-direction:column;gap:10px">
          <div class="s">${T('类型写的是', 'The type says')}</div><div class="mono ty" style="font-size:44px;font-weight:800">String</div></div>`);
        H(`<div class="r card center" data-cap="0" data-delay="0.6" style="left:510px;width:450px;top:280px;height:200px;flex-direction:column;gap:10px;border-style:dashed;border-color:var(--yel)">
          <div class="s">${T('实际可能是', 'It might really be')}</div><div class="mono yel" style="font-size:44px;font-weight:800">null</div></div>`);
        H(`<div class="r card center" data-cap="0" data-delay="1.2" data-shake="1" style="left:0;right:0;top:530px;height:120px;gap:18px;border-color:var(--red)">
          ${icon('boom', 50, 'var(--red)')}<span class="mono red" style="font-size:32px;font-weight:800">NullPointerException</span></div>`);
        H(`<div class="r s" data-cap="0" data-delay="2.2" style="left:0;right:0;top:700px;text-align:center;font-size:28px">${T('null 引用的发明者 Tony Hoare 称它为"十亿美元的错误"', 'Tony Hoare, who invented the null reference: "my billion-dollar mistake"')}</div>`);
      } },

    { title: ['Option：有，或者没有', 'Option: something or nothing'],
      cap: [{zh: 'Rust 用上期的 enum：Option。', en: 'Rust uses an enum from last lesson: Option.', say_zh: 'Rust 用上期学的枚举：可选类型。'},
            {zh: '要么 Some 装着值，要么 None。', en: 'Either Some, holding a value, or None.', say_zh: '要么有值，装着值；要么没值。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;width:470px;top:20px;padding:30px 34px;font-size:34px;line-height:1.75">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:6px">${T('标准库里的定义', 'From the standard library')}</div>${code(`enum Option<T> {
    Some(T),
    None,
}`)}</div>`);
        H(`<div class="r card mono center" data-cap="1" data-in="pop" style="left:530px;width:430px;top:20px;height:170px;flex-direction:column;gap:6px;border-color:var(--acc2)">
          <div style="font-size:48px;font-weight:800;color:var(--acc2)">Some(5)</div><div class="s" style="font-family:'Noto Sans SC'">${T('有值', 'has a value')}</div></div>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="1.2" data-in="pop" style="left:530px;width:430px;top:220px;height:170px;flex-direction:column;gap:6px;border-style:dashed">
          <div style="font-size:48px;font-weight:800;color:var(--quiet)">None</div><div class="s" style="font-family:'Noto Sans SC'">${T('没有值', 'no value')}</div></div>`);
        H(`<div class="r" data-cap="0" data-delay="0.8" style="left:0;right:0;top:410px;text-align:center"><span class="chip">${T('第 11 课 · enum + match', 'Lesson 11 · enum + match')}</span></div>`);
      } },

    { title: ['为什么：写在类型里', 'Why: it lives in the type'],
      cap: [{zh: '关键：Option<i32> 不是 i32。', en: 'The key: an Option<i32> is not an i32.', say_zh: '关键是：可选的整数，不是整数。', say_en: 'The key: an Option of i32 is not an i32.'},
            ['想直接拿来相加？编译不通过。', "Try to add it directly? It won't compile."],
            ['类型写明了：它可能没值。', 'The type says it: there may be no value.'],
            ['编译器要你先处理没值的情况。', 'The compiler makes you handle the None case first.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 38px;font-size:32px;line-height:1.75">${code(`let x: i32 = 5;
let y: Option<i32> = Some(3);
let sum = x + y;`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:270px;padding:20px 34px;border-color:var(--red)">
          <div class="red" style="font-size:28px;font-weight:800">error[E0277]: cannot add \`Option&lt;i32&gt;\` to \`i32\`</div></div>`);
        H(`<div class="r card center" data-cap="2" data-in="pop" style="left:0;width:450px;top:420px;height:220px;flex-direction:column;gap:10px;border-color:var(--acc)">
          <div class="mono acc" style="font-size:40px;font-weight:800">Option&lt;i32&gt;</div><div class="s">${T('可能没有，写明了', '"maybe none", stated')}</div></div>`);
        H(`<div class="r card center" data-cap="3" data-in="pop" style="left:510px;width:450px;top:420px;height:220px;flex-direction:column;gap:10px;border-color:var(--acc2)">
          ${icon('shield', 56, 'var(--acc2)')}<div class="s">${T('编译时就拦住', 'caught at compile time')}</div></div>`);
      } },

    { title: ['用 match 取出值', 'Use match to get the value'],
      cap: [{zh: '怎么取出值？用上期的 match。', en: 'How do you get the value out? With match, from last time.', say_zh: '怎么取出值？用上期的模式匹配。'},
            {zh: 'Some、None 都得写，漏了就报错。', en: "Write both Some and None, or it won't compile.", say_zh: '有值、没值都得写，漏一个就报错。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 38px;font-size:32px;line-height:1.75">${code(`let v = vec![10, 20, 30];
match v.get(5) {   // ${T('可能越界', 'may be out of range')}
    Some(x) => println!("{x}"),
    None => println!("no item 5"),
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:390px;display:flex;gap:30px;justify-content:center">
          <div class="card mono center" style="width:420px;height:120px;font-size:34px;border-color:var(--acc2);color:var(--acc2)">Some(x) ${icon('check', 34, 'var(--acc2)')}</div>
          <div class="card mono center" style="width:420px;height:120px;font-size:34px;border-color:var(--acc2);color:var(--acc2)">None ${icon('check', 34, 'var(--acc2)')}</div></div>`);
        H(`<div class="r card mono" data-cap="1" data-delay="1.2" data-shake="1" style="left:0;right:0;top:570px;padding:20px 34px;border-color:var(--red)">
          <div class="red" style="font-size:25px;font-weight:800">error[E0004]: non-exhaustive patterns: \`None\` not covered</div></div>`);
      } },

    { title: ['三个常用写法', 'Three handy shortcuts'],
      cap: [['只关心有值？', 'Only care about the value?'],
            {zh: '用 if let，有值才执行。', en: 'Use if let. It runs only when there is a value.', say_zh: '用如果匹配，有值才执行。'},
            {zh: '要个默认值？用 unwrap_or。', en: 'Want a default? Use unwrap_or.', say_zh: '要默认值？用解包或默认。', say_en: 'Want a default? Use unwrap or.'},
            {zh: 'unwrap 没值就崩，少用。', en: 'unwrap panics on None. Use it sparingly.', say_zh: '直接解包，没值就崩，少用。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:22px 34px;font-size:30px;line-height:1.7">${code(`let port: Option<u16> = None;`)}</div>`);
        const row = (cap, y, src, ic, c, note) => H(`<div class="r card" data-cap="${cap}" data-in="left" style="left:0;right:0;top:${y}px;height:170px;padding:22px 34px;border-color:${c}">
          <div class="mono" style="font-size:30px">${code(src)}</div>
          <div style="margin-top:16px;display:flex;align-items:center;gap:14px">${icon(ic, 34, c)}<span class="s" style="color:${c}">${note}</span></div></div>`);
        row(1, 150, 'if let Some(p) = port { println!("{p}"); }', 'check', 'var(--acc2)', T('有值才执行，没值跳过', 'runs only if there is a value'));
        row(2, 350, 'let p = port.unwrap_or(8080);', 'check', 'var(--acc2)', T('没值就用 8080', 'no value → 8080'));
        row(3, 550, 'let p = port.unwrap();', 'boom', 'var(--red)', T('没值 → panic，程序崩溃', 'no value → panic, the program crashes'));
      } },

    { title: ['一张图总结', 'One-picture summary'],
      cap: [{zh: '总结：null 藏在暗处，运行才崩；', en: 'To sum up: null hides and crashes at runtime.', say_zh: '总结：空值藏在暗处，运行时才崩；'},
            {zh: 'Option 写在类型里，编译就管。', en: 'Option lives in the type, so the compiler checks it.', say_zh: '可选类型写在类型里，编译时就管住。'}],
      build() {
        const col = (cap, x, head, c, ic, rows) => H(`<div class="r card" data-cap="${cap}" data-in="${x ? 'right' : 'left'}" style="left:${x}px;width:450px;top:20px;height:640px;padding:30px 30px;border-color:${c}">
          <div class="center" style="gap:14px">${icon(ic, 46, c)}<span class="mono" style="font-size:46px;font-weight:800;color:${c}">${head}</span></div>
          ${rows.map(([k, v]) => `<div style="margin-top:34px"><div class="s" style="font-size:26px">${k}</div><div class="h" style="font-size:34px;margin-top:4px">${v}</div></div>`).join('')}</div>`);
        col(0, 0, 'null', 'var(--red)', 'cross', [
          [T('类型里看得出吗', 'Visible in the type?'), T('看不出', 'No')],
          [T('忘了处理', 'Forget to handle it'), T('运行时崩溃', 'crash at runtime')],
          [T('谁来提醒你', 'Who reminds you'), T('没人', 'nobody')]]);
        col(1, 510, 'Option', 'var(--acc2)', 'check', [
          [T('类型里看得出吗', 'Visible in the type?'), T('一眼看出', 'Yes')],
          [T('忘了处理', 'Forget to handle it'), T('编译报错', 'compile error')],
          [T('怎么取值', 'How to get the value'), '<span class="mono" style="font-size:28px">match · if let · unwrap_or</span>']]);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '出错了怎么办？下期：Result 和 ?', en: 'What about errors? Next: Result and the ? operator.', say_zh: '那出错了怎么办？下期讲结果类型和问号。', say_en: 'What about errors? Next: Result and the question mark operator.'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 13 课 · Lesson 13', 'Lesson 13')}</div>
          <div class="h" style="font-size:${T('76px', '68px')};margin-top:30px">${T('Result 和 ?', 'Result and ?')}</div>
          <div class="s" style="font-size:40px;margin-top:10px">${T('错误处理 · Error handling', 'Error handling')}</div>
          <div class="mono acc" style="font-size:32px;margin-top:40px">Ok(v) · Err(e) · ?</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：x 明明是 Some，能编译吗？', en: 'Quick quiz: x is clearly Some. Does this compile?', say_zh: '考考你：x 明明有值，能编译吗？'},
            ['能，还是不能？评论区告诉我。', 'Yes or no? Tell me in the comments.']],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:30px 40px;font-size:36px;line-height:1.7">${code(`let x: Option<i32> = Some(5);
match x {
    Some(n) => println!("{n}"),
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:380px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('能', 'Yes')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('不能', 'No')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:580px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
