// 第 4 课 · 函数与表达式：最后一行不加分号就是返回值
window.EPISODE = {
  n: 4,
  scenes: [
    { title: ['没写 return，也能返回？', 'No return, still returns?'],
      cap: [{zh: '这个函数没写 return，', en: "This function has no return,", say_zh: '这个函[sh][ù]没写 return，'},
            {zh: '为什么也能返回值？', en: 'so how does it return a value?', say_zh: '为什么也能返回一个值？'},
            ['秘密就在最后一行：没有分号。', 'The secret: the last line has no semicolon.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:36px 44px;font-size:42px;line-height:1.8">${code(`fn add(a: i32, b: i32) -> i32 {
    a + b
}`)}</div>`);
        H(`<div class="r h" data-cap="1" data-in="pop" style="left:0;right:0;top:340px;text-align:center;font-size:120px;color:var(--yel)">?</div>`);
        H(`<div class="r card center" data-cap="2" data-in="stamp" style="left:180px;right:180px;top:560px;height:150px;border-color:var(--acc);flex-direction:column;gap:6px">
          <div class="h acc" style="font-size:46px">${T('最后一行没有 ;', 'No ; on the last line')}</div></div>`);
      } },

    { title: ['函数怎么写', 'How a function looks'],
      cap: [{zh: '先看函数怎么写：', en: "First, how a function looks:", say_zh: '先看函[sh][ù]怎么写：'},
            ['参数必须标明类型，', 'every parameter needs a type,'],
            ['箭头后面写返回类型。', 'and the return type goes after the arrow.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:30px;padding:36px 40px;font-size:40px;line-height:1.8">${code(`fn add(a: i32, b: i32) -> i32 {
    a + b
}`)}</div>`);
        const lab = (x, cap, c, k, z, e) => `<div class="r card" data-cap="${cap}" data-in="pop" style="left:${x}px;top:360px;width:290px;height:240px;text-align:center;padding-top:40px;border-color:${c}">
          <div class="mono" style="font-size:38px;color:${c}">${k}</div>
          <div class="s" style="margin-top:28px">${T(z, e)}</div></div>`;
        H(lab(0, 0, 'var(--ink)', 'fn add', '定义函数', 'define a function'));
        H(lab(335, 1, 'var(--blue)', 'a: i32', '参数要写类型', 'params need types'));
        H(lab(670, 2, 'var(--acc)', '-&gt; i32', '返回类型', 'return type'));
      } },

    { title: ['语句 vs 表达式', 'Statements vs expressions'],
      cap: [{zh: '函数体里的代码分两种：', en: 'Inside a function, code comes in two kinds:', say_zh: '函[sh][ù]体里的代码分两种：'},
            ['语句只做事，不产生值；', 'statements do something but give no value;'],
            ['表达式会算出一个值。', 'expressions evaluate to a value.']],
      build() {
        H(`<div class="r card" data-cap="1" data-in="left" style="left:0;width:450px;top:30px;height:560px;padding:34px 30px;text-align:center">
          <div class="h">${B('语句', 'Statement')}</div>
          <div class="mono" style="font-size:40px;margin-top:70px">let y = 6;</div>
          <div class="mono q" style="font-size:40px;margin-top:60px">${T('→ 没有值', '→ no value')}</div></div>`);
        H(`<div class="r card" data-cap="2" data-in="right" style="left:510px;width:450px;top:30px;height:560px;padding:34px 30px;text-align:center;border-color:var(--acc2)">
          <div class="h">${B('表达式', 'Expression')}</div>
          <div class="mono" style="font-size:40px;margin-top:70px">5 + 1</div>
          <div class="mono ok" style="font-size:40px;margin-top:60px">→ 6</div></div>`);
        H(`<div class="r s" data-cap="2" data-delay="1.0" style="left:0;right:0;top:640px;text-align:center">${T('函数调用、运算、代码块都是表达式', 'calls, math and blocks are all expressions')}</div>`);
      } },

    { title: ['分号的作用', 'What the semicolon does'],
      cap: [{zh: '加上分号，表达式就变成语句，', en: 'Add a semicolon, and it becomes a statement.'},
            {zh: '值被丢掉，只剩一个空元组。', en: 'The value is dropped, leaving the unit type ().', say_en: 'The value is dropped, leaving the unit type: empty parentheses.'}],
      build() {
        const row = (y, cap, src, out, c) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:200px;display:flex;align-items:center;justify-content:space-around;border-color:${c}">
          <div class="mono" style="font-size:50px">${src}</div><div class="mono acc" style="font-size:50px">→</div><div class="mono" style="font-size:50px;color:${c}">${out}</div></div>`;
        H(row(30, 0, '{ x + 1 }', '6', 'var(--acc2)'));
        H(row(280, 0, '{ x + 1<span class="red">;</span> }', '()', 'var(--quiet)'));
        H(`<div class="r s" data-cap="0" style="left:0;right:0;top:500px;text-align:center">${T('假设 x = 5', 'say x = 5')}</div>`);
        H(`<div class="r" data-cap="1" data-in="pop" style="left:0;right:0;top:590px;text-align:center"><span class="chip">() = ${T('空元组，表示“没有值”', 'unit: “no value”')}</span></div>`);
      } },

    { title: ['最后一行 = 返回值', 'Last line = return value'],
      cap: [{zh: '所以函数体的最后一行，', en: "So in a function body, the last line,", say_zh: '所以函[sh][ù]体的最后一行，'},
            ['不加分号，它的值就是返回值。', 'with no semicolon, is the return value.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:30px;padding:34px 40px;font-size:40px;line-height:1.8;border-color:var(--acc2)">${code(`fn plus_one(x: i32) -> i32 {
    x + 1    // ${T('没有分号', 'no semicolon')}
}`)}</div>`);
        H(`<div class="r" data-cap="1" data-in="stamp" style="left:800px;top:120px">${icon('check', 100, 'var(--acc2)')}</div>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="0.6" style="left:160px;right:160px;top:400px;height:170px;font-size:46px">plus_one(5) <span class="acc" style="margin:0 24px">→</span> <span class="ok">6</span></div>`);
      } },

    { title: ['多一个分号就报错', 'One extra semicolon breaks it'],
      cap: [{zh: '要是手快多加了一个分号，', en: 'Add one semicolon by habit,', say_en: 'Add one semicolon out of habit,'},
            {zh: '函数就返回空元组，类型对不上。', en: 'and the function returns (), not i32.', say_zh: '函[sh][ù]就返回空元组，类型对不上。', say_en: 'and the function returns unit, not i 32.'},
            ['编译器会提示你：删掉这个分号。', 'The compiler even says: remove this semicolon.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:38px;line-height:1.75">${code(`fn plus_one(x: i32) -> i32 {
    x + 1;   // ${T('多了分号', 'extra ;')}
}`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:330px;padding:28px 40px;font-size:29px;line-height:1.7;border-color:var(--red)">
          <div class="q">$ cargo build</div>
          <div class="red" style="font-weight:800">error[E0308]: mismatched types</div>
          <div class="red">expected \`i32\`, found \`()\`</div>
          <div class="ok">help: remove this semicolon</div>
          <div class="ok">      to return this value</div></div>`);
      } },

    { title: ['代码块也是表达式', 'Blocks are expressions too'],
      cap: [['其实花括号代码块也一样：', 'Curly-brace blocks work the same way:'],
            ['最后一行的值，就是整个块的值。', "the last line's value is the whole block's value."]],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;width:560px;top:30px;padding:34px 40px;font-size:40px;line-height:1.8">${code(`let y = {
    let x = 3;
    x + 1
};`)}</div>`);
        H(`<div class="r mono acc" data-cap="1" data-in="pop" style="left:600px;top:150px;font-size:70px">→</div>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="0.4" data-in="pop" style="left:690px;width:270px;top:110px;height:170px;font-size:50px;border-color:var(--acc2);color:var(--acc2)">y = 4</div>`);
        H(`<div class="r s" data-cap="1" data-delay="1.0" style="left:0;right:0;top:470px;text-align:center">${T('函数体，其实就是一个代码块', 'a function body is just a block')}</div>`);
      } },

    { title: ['一句话记住', 'Remember it in one line'],
      cap: [['总结一下：没分号，是值；', 'To recap: no semicolon, it is a value;'],
            ['有分号，值就没了。', 'add a semicolon, and the value is gone.'],
            ['想提前返回，再用 return。', 'Save return for exiting early.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;width:450px;top:40px;height:300px;flex-direction:column;gap:20px;border-color:var(--acc2)">
          <div class="mono ok" style="font-size:52px">x + 1</div><div class="h">${T('= 值', '= value')}</div></div>`);
        H(`<div class="r card center" data-cap="1" data-in="pop" style="left:510px;width:450px;top:40px;height:300px;flex-direction:column;gap:20px">
          <div class="mono" style="font-size:52px">x + 1<span class="red">;</span></div><div class="h q">${T('= 没有值', '= no value')}</div></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:400px;padding:28px 40px;font-size:34px;line-height:1.7">${code(`if x < 0 {
    return 0;   // ${T('提前返回', 'early exit')}
}`)}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期，聊聊 if 和循环，', en: 'Next time: if and loops,', say_zh: '下期，聊聊条件判断和循环，'},
            {zh: '你会发现，if 也是表达式。', en: 'and why if is an expression too.', say_zh: '你会发现，条件判断也是表达式。'},
            ['关注我，一起学！', 'Follow along and learn with me!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 5 课 · Lesson 5', 'Lesson 5')}</div>
          <div class="h" style="font-size:84px;margin-top:30px">${T('控制流', 'Control flow')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:40px;margin-top:10px">Control flow</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">if · loop · while · for</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{"zh": "考考你：这段代码能编译吗？", "en": "Quick quiz: does this code compile?", "say_zh": "考考你：这段代码能编译吗？", "say_en": "Quick quiz: does this code compile?"},
            {"zh": "能，还是不能？评论区告诉我。", "en": "Yes or no? Tell me in the comments.", "say_zh": "能，还是不能？评论区告诉我。", "say_en": "Yes or no? Tell me in the comments."}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:30px 40px;font-size:38px;line-height:1.8">${code(`fn five() -> i32 {
    5;
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:374px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T("能", "Yes")}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T("不能", "No")}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:574px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
