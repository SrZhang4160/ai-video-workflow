// 第 3 课 · 基本类型：整数、浮点、bool、char、元组、数组
window.EPISODE = {
  n: 3,
  scenes: [
    { title: ['Rust 的基本类型', "Rust's basic types"],
      cap: [['Rust 里每个值都有类型。', 'In Rust, every value has a type.'],
            ['基本类型其实就两大类：', 'The basic types come in two groups:'],
            {zh: '一类叫标量，一类叫复合。', en: 'scalar and compound.', say_zh: '一类叫标量，一类叫复合类型。'}],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:280px;width:400px;top:30px;height:130px;flex-direction:column;border-color:var(--acc)">
          <div class="h">${B('基本类型', 'Basic types')}</div></div>`);
        H(`<svg class="r" data-cap="1" style="left:0;top:160px" width="960" height="120"><path d="M480 0 L240 110 M480 0 L720 110" stroke="#4A5160" stroke-width="4" fill="none"/></svg>`);
        H(`<div class="r card" data-cap="2" data-in="left" style="left:0;width:460px;top:290px;height:440px;padding:30px;text-align:center">
          <div class="h">${T('标量', 'Scalar')}</div>${LANG === 'zh' ? '<div class="s">scalar</div>' : ''}
          <div class="s" style="margin-top:10px">${T('一个值', 'one value')}</div>
          <div class="mono" style="font-size:34px;line-height:1.7;margin-top:26px"><span class="ty">i32</span> · <span class="ty">f64</span><br><span class="ty">bool</span> · <span class="ty">char</span></div></div>`);
        H(`<div class="r card" data-cap="2" data-delay="0.5" data-in="right" style="left:500px;width:460px;top:290px;height:440px;padding:30px;text-align:center">
          <div class="h">${T('复合', 'Compound')}</div>${LANG === 'zh' ? '<div class="s">compound</div>' : ''}
          <div class="s" style="margin-top:10px">${T('多个值打包', 'several values packed')}</div>
          <div class="mono" style="font-size:34px;line-height:1.7;margin-top:26px"><span class="acc">(1, 2.0)</span><br><span class="acc">[1, 2, 3]</span></div></div>`);
      } },

    { title: ['整数：i 和 u', 'Integers: i and u'],
      cap: [{zh: '先看整数：i 是有符号，', en: 'Integers first: i means signed,', say_zh: '先看整数：i 是有符号，', say_en: 'Integers first: i means signed,'},
            {zh: 'u 是无符号，只能存非负数。', en: 'u means unsigned, zero or more.', say_zh: 'u 是无符号，只能存非负数。', say_en: 'u means unsigned, zero or more.'},
            {zh: '后面的数字是位数。', en: 'The number after it is the size in bits.'},
            {zh: '不写类型，默认就是 i32。', en: 'Leave the type out and you get i32.', say_zh: '不写类型，默认就是 i 三十二。', say_en: 'Leave the type out and you get i thirty-two.'}]
        ,
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:36px;line-height:1.8">${code(`let a: i32 = -5;   // ${T('有符号', 'signed')}
let b: u8 = 255;   // ${T('无符号', 'unsigned')}
let c = 42;        // ${T('默认 i32', 'i32 by default')}`)}</div>`);
        const cell = (x, t, c, cap, d) => `<div class="r card mono center" data-cap="${cap}" data-delay="${d}" data-in="pop" style="left:${x}px;top:330px;width:170px;height:100px;font-size:34px;color:${c};border-color:${c}">${t}</div>`;
        ['i8', 'i16', 'i32', 'i64', 'i128'].forEach((t, i) => H(cell(i * 197, t, t === 'i32' ? 'var(--acc)' : 'var(--ink)', 2, i * 0.15)));
        H(`<div class="r s" data-cap="2" data-delay="0.9" style="left:0;right:0;top:450px;text-align:center">${T('u8 … u128 同理', 'same for u8 … u128')}</div>`);
        H(`<div class="r" data-cap="3" data-in="stamp" style="left:0;right:0;top:540px;text-align:center"><span class="chip acc" style="border-color:var(--acc);font-size:32px">${T('默认 i32', 'default: i32')}</span></div>`);
      } },

    { title: ['浮点：默认 f64', 'Floats: f64 by default'],
      cap: [{zh: '带小数点的是浮点，默认 f64。', en: 'Numbers with a decimal point are floats: f64.', say_zh: '带小数点的是浮点，默认 f 六十四。', say_en: 'Numbers with a decimal point are floats: f sixty-four.'},
            ['注意，整数和浮点不能直接相加，', "Careful: you can't add an integer to a float,"],
            ['Rust 不会偷偷帮你转换。', "Rust won't convert it for you."]],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:36px;line-height:1.8">${code(`let x = 2.5;        // f64
let y: f32 = 1.0;   // f32`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:270px;padding:30px 40px;font-size:34px;line-height:1.7;border-color:var(--red)">${code(`let n = 1 + 2.0;`)}
          <div class="red" style="font-size:28px;font-weight:800;margin-top:10px">error[E0277]: cannot add a float to an integer</div></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:530px;padding:30px 40px;font-size:34px;line-height:1.7;border-color:var(--acc2)">${code(`let n = 1.0 + 2.0;   // ${T('都写成浮点', 'both floats')}`)}</div>`);
        H(`<div class="r" data-cap="2" data-delay="0.8" data-in="stamp" style="left:840px;top:552px">${icon('check', 70, 'var(--acc2)')}</div>`);
      } },

    { title: ['bool 和 char', 'bool and char'],
      cap: [{zh: 'bool 只有两个值：true 和 false。', en: 'A bool is just true or false.', say_zh: '布尔类型，只有两个值：true，和 false。', say_en: 'A bool is just true, or false.'},
            ['char 用单引号，是一个字符，', 'A char uses single quotes: one character,'],
            ['中文、emoji 都能装下。', 'and it can hold Chinese or even an emoji.']],
      build() {
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:20px;height:250px;padding:30px 40px">
          <div class="mono ty" style="font-size:40px;font-weight:800">bool</div>
          <div style="display:flex;gap:40px;justify-content:center;margin-top:30px">
            <div class="card mono center ok" style="width:260px;height:100px;font-size:40px;border-color:var(--acc2)">true</div>
            <div class="card mono center red" style="width:260px;height:100px;font-size:40px;border-color:var(--red)">false</div></div></div>`);
        H(`<div class="r card" data-cap="1" style="left:0;right:0;top:310px;height:360px;padding:30px 40px">
          <div class="mono ty" style="font-size:40px;font-weight:800">char</div>
          <div class="mono" style="font-size:36px;margin-top:20px">${code(`let c = 'z';   // ${T('单引号', 'single quotes')}`)}</div></div>`);
        ["'z'", "'中'", "'🦀'"].forEach((t, i) => H(`<div class="r card mono center yel" data-cap="2" data-delay="${i * 0.3}" data-in="pop" style="left:${60 + i * 290}px;top:500px;width:240px;height:130px;font-size:52px">${t}</div>`));
      } },

    { title: ['元组：不同类型打包', 'Tuples: mixed types together'],
      cap: [['复合类型第一个，元组：', 'First compound type: the tuple.'],
            ['不同类型的值，打包在一起，', 'It packs values of different types together,'],
            {zh: '用点加下标取：t.0、t.1。', en: 'and you read them by position: t.0, t.1.', say_zh: '用点加下标取，比如 t 点零，t 点一。', say_en: 'and you read them by position: t dot zero, t dot one.'}],
      build() {
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:20px;padding:30px 40px;font-size:36px;line-height:1.8">${code(`let t = (500, 6.4, 'z');
let a = t.0;   // 500
let (x, y, z) = t;   // ${T('拆开', 'unpack')}`)}</div>`);
        const slot = (x, v, ty, d) => `<div class="r" data-cap="2" data-delay="${d}" data-in="drop" style="left:${x}px;top:380px;width:260px;text-align:center">
          <div class="card mono center" style="height:120px;font-size:42px;border-color:var(--acc)">${v}</div>
          <div class="mono ty" style="font-size:30px;margin-top:12px">${ty}</div></div>`;
        H(slot(40, '500', 'i32', 0));
        H(slot(350, '6.4', 'f64', 0.3));
        H(slot(660, "'z'", 'char', 0.6));
        H(`<div class="r s" data-cap="2" data-delay="1.0" style="left:0;right:0;top:600px;text-align:center">t.0 &nbsp; · &nbsp; t.1 &nbsp; · &nbsp; t.2</div>`);
      } },

    { title: ['数组：同类型、定长', 'Arrays: same type, fixed length'],
      cap: [['数组呢，所有元素类型必须一样，', 'An array needs every element to be the same type,'],
            ['长度也固定，写在类型里。', 'and its length is fixed, written in the type.'],
            ['用方括号下标取值。', 'Read items with square brackets.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:36px;line-height:1.8">${code(`let arr: [i32; 3] = [1, 2, 3];
let first = arr[0];   // 1`)}</div>`);
        [1, 2, 3].forEach((v, i) => H(`<div class="r" data-cap="0" data-delay="${0.4 + i * 0.2}" data-in="pop" style="left:${180 + i * 210}px;top:300px;width:180px;text-align:center">
          <div class="card mono center" style="height:130px;font-size:48px;border-color:var(--blue)">${v}</div>
          <div class="mono q" style="font-size:28px;margin-top:10px">[${i}]</div></div>`));
        H(`<div class="r" data-cap="1" data-in="pop" style="left:0;right:0;top:530px;text-align:center"><span class="chip mono" style="font-size:34px;border-color:var(--acc)"><span class="ty">i32</span> <span class="q">;</span> <span class="acc">3</span></span></div>`);
        H(`<div class="r s" data-cap="1" data-delay="0.6" style="left:0;right:0;top:620px;text-align:center">${T('类型 i32 · 长度 3', 'type i32 · length 3')}</div>`);
      } },

    { title: ['一张表记住', 'Remember it in one table'],
      cap: [['总结：标量是单个值，', 'To recap: a scalar is a single value,'],
            ['元组装不同类型，', 'a tuple holds mixed types,'],
            ['数组装同一种类型。', 'an array holds just one type.']],
      build() {
        const row = (y, k, a, cap, c) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:150px;display:grid;grid-template-columns:330px 1fr;align-items:center;padding:0 40px;gap:20px;${c ? 'border-color:var(--acc)' : ''}">
          <div class="h" style="font-size:38px">${k}</div><div class="mono" style="font-size:32px">${a}</div></div>`;
        H(row(40, T('标量', 'Scalar'), '<span class="ty">i32 · f64 · bool · char</span>', 0));
        H(row(220, T('元组', 'Tuple'), `(500, 6.4, 'z') <span class="q" style="font-family:'Noto Sans SC';font-size:28px">${T('可混合', 'mixed')}</span>`, 1, 1));
        H(row(400, T('数组', 'Array'), `[1, 2, 3] <span class="q" style="font-family:'Noto Sans SC';font-size:28px">${T('同类型 · 定长', 'one type · fixed')}</span>`, 2, 1));
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期，聊聊函数和表达式：', 'Next time: functions and expressions.'],
            ['为什么最后一行不加分号？', 'Why does the last line skip the semicolon?']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 4 课 · Lesson 4', 'Lesson 4')}</div>
          <div class="h" style="font-size:${LANG === 'zh' ? 72 : 60}px;margin-top:30px">${T('函数与表达式', 'Functions &amp; expressions')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:36px;margin-top:10px">Functions &amp; expressions</div>' : ''}
          <div class="mono acc" style="font-size:28px;margin-top:40px">fn add(a: i32, b: i32) -&gt; i32 { a + b }</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{"zh": "留道题，大家来答：x 是什么类型？", "en": "A quiz for everyone: what type is x?", "say_zh": "最后留道题，大家一起来答：x 是什么类型？", "say_en": "Here's a quiz for everyone: what type is x?"},
            {"zh": "f32 还是 f64？答案留在评论区！", "en": "f32 or f64? Drop your answer in the comments.", "say_zh": "是 F 三十二，还是 F 六十四？把你的答案留在评论区！", "say_en": "Is it f thirty-two, or f sixty-four? Drop your answer in the comment section."}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:30px 40px;font-size:38px;line-height:1.8">${code(`let x = 3.0;`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:238px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T("f32", "f32")}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T("f64", "f64")}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:438px;text-align:center;font-size:52px">${T('你选哪个？评论区见 ↓', 'Your pick? Comment below ↓')}</div>`);
      } },
  ],
};
