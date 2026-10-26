// 第 9 课 · String 和 &str：切片是什么
window.EPISODE = {
  n: 9,
  scenes: [
    { title: ['String 和 &str', 'String and &str'],
      cap: [{zh: 'Rust 里有两种字符串，', en: 'Rust has two kinds of strings:', say_zh: 'Rust 里有两种字符串，'},
            {zh: 'String 和 &str。', en: 'String and &str.', say_zh: 'String 和 and str。', say_en: 'String and ampersand str.'},
            ['它们到底差在哪？', "So what's the difference?"]],
      build() {
        H(`<div class="r card mono center" data-cap="1" data-in="left" style="left:40px;top:120px;width:400px;height:220px;font-size:64px;font-weight:800;color:var(--acc2);border-color:var(--acc2)">String</div>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="0.6" data-in="right" style="left:520px;top:120px;width:400px;height:220px;font-size:64px;font-weight:800;color:var(--blue);border-color:var(--blue)">&amp;str</div>`);
        H(`<div class="r h center" data-cap="2" data-in="pop" style="left:0;right:0;top:420px;font-size:120px;color:var(--acc)">?</div>`);
        H(`<div class="r s" data-cap="2" data-delay="0.6" style="left:0;right:0;top:600px;text-align:center">${T('一句话：一个拥有，一个借用', 'In short: one owns, one borrows')}</div>`);
      } },

    { title: ['String：自己拥有', 'String: it owns its text'],
      cap: [['String 拥有自己的文字，', 'A String owns its text.'],
            ['内容放在堆上，可以变长。', 'The text lives on the heap and can grow.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:34px;line-height:1.7">${code(`let mut s = String::from("hello");
s.push_str(" world"); // ${T('变长', 'grows')}`)}</div>`);
        H(`<div class="r card" data-cap="1" data-in="left" style="left:0;top:280px;width:300px;padding:22px 26px">
          <div class="s" style="margin-bottom:8px">${T('栈 · s', 'stack · s')}</div>
          <div class="mono" style="font-size:30px;line-height:1.7">ptr<br>len: 11<br>cap: ≥ 11</div></div>`);
        H(`<div class="r mono acc" data-cap="1" data-delay="0.5" data-in="pop" style="left:318px;top:340px;font-size:56px">→</div>`);
        H(`<div class="r card" data-cap="1" data-delay="0.7" data-in="right" style="left:390px;top:280px;width:570px;padding:22px 26px;border-color:var(--acc2)">
          <div class="s" style="margin-bottom:12px">${T('堆 · 文字本身', 'heap · the text')}</div>
          <div class="mono ok" style="font-size:40px;letter-spacing:2px">"hello world"</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.4" style="left:0;right:0;top:560px;text-align:center"><span class="chip ok" style="border-color:var(--acc2)">${T('拥有 · 可修改 · 可变长', 'owned · mutable · growable')}</span></div>`);
      } },

    { title: ['&str：一段切片', '&str: a slice'],
      cap: [{zh: '&str 叫字符串切片，', en: '&str is called a string slice.', say_zh: 'and str 叫字符串切片，', say_en: 'Ampersand str is called a string slice.'},
            ['它不拥有文字，只是借来看一段：', "It doesn't own text. It borrows a view of a part:"],
            ['一个起点，加一个长度。', 'just a start pointer plus a length.']],
      build() {
        const chars = 'hello world'.split('');
        H(`<div class="r" data-cap="0" style="left:40px;top:40px;display:flex;gap:6px">${chars.map((c, i) => `<div class="mono center" style="width:74px;height:90px;border:2px solid ${i < 5 ? 'var(--blue)' : 'var(--line)'};border-radius:10px;font-size:40px;background:${i < 5 ? 'rgba(90,160,255,.14)' : 'var(--panel)'}">${c === ' ' ? '␣' : c}</div>`).join('')}</div>`);
        H(`<div class="r s" data-cap="0" style="left:40px;top:145px">${T('s 的文字（堆上）', "s's text (on the heap)")}</div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:230px;padding:28px 40px;font-size:36px;line-height:1.7">${code(`let hello: &str = &s[0..5];
println!("{hello}"); // hello`)}</div>`);
        H(`<div class="r card" data-cap="2" data-in="left" style="left:40px;top:470px;width:420px;padding:22px 26px;border-color:var(--blue)">
          <div class="s" style="margin-bottom:8px">hello · &amp;str</div>
          <div class="mono blue" style="font-size:32px;line-height:1.7">ptr → 'h'<br>len: 5</div></div>`);
        H(`<div class="r s" data-cap="2" data-delay="0.8" style="left:500px;top:500px;width:440px">${T('没有复制，只是指向原来的文字', 'No copy: it points into the original text')}</div>`);
      } },

    { title: ['切片也是借用', 'A slice is a borrow'],
      cap: [['切片是借用，上节课的规则照样管：', "A slice is a borrow, so last lesson's rules apply:"],
            ['切片还在用，原字符串就不能改。', "while it's in use, you can't change the String."]],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:34px;line-height:1.75">${code(`let mut s = String::from("hello");
let h = &s[0..2];   // ${T('借用开始', 'borrow starts')}
s.clear();          // ${T('想修改', 'try to change')}
println!("{h}");    // ${T('还在用 h', 'h still used')}`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:350px;padding:26px 40px;font-size:28px;line-height:1.7;border-color:var(--red)">
          <div class="red" style="font-weight:800">error[E0502]: cannot borrow \`s\` as mutable</div>
          <div class="red" style="font-weight:800">because it is also borrowed as immutable</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.6" style="left:0;right:0;top:600px;text-align:center"><span class="chip ok" style="border-color:var(--acc2)">${T('不会出现悬空的切片', 'no dangling slices')}</span></div>`);
      } },

    { title: ['函数参数用 &str', 'Take &str in functions'],
      cap: [{zh: '字符串字面量，类型就是 &str。', en: 'A string literal already has type &str.', say_zh: '字符串字面量，类型就是 and str。', say_en: 'A string literal is already a string slice.'},
            {zh: '所以参数写 &str 最通用：', en: 'So &str is the most flexible parameter type:', say_zh: '所以参数写 and str 最通用：', say_en: 'So a string slice is the most flexible parameter type:'},
            {zh: '字面量、&String 都能传。', en: 'it takes literals and &String alike.', say_zh: '字面量、String 的引用都能传。', say_en: 'it takes literals and references to a String alike.'}]
      ,
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:24px 40px;font-size:34px;line-height:1.7">${code(`let t: &str = "hi"; // ${T('字面量', 'a literal')}`)}</div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:180px;padding:28px 40px;font-size:34px;line-height:1.75;border-color:var(--acc)">${code(`fn greet(name: &str) {
    println!("hi, {name}");
}
greet("Tom");      // ${T('字面量', 'literal')} ✓
let s = String::from("Amy");
greet(&s);         // &String ✓`)}</div>`);
        H(`<div class="r s" data-cap="2" data-delay="1.0" style="left:0;right:0;top:640px;text-align:center">${T('&String 会自动转成 &str', '&String converts to &str automatically')}</div>`);
      } },

    { title: ['一张表记住', 'Remember it in one table'],
      cap: [['总结一下：String 拥有、能改；', 'To recap: String owns its text and can change it.'],
            {zh: '&str 只借一段来看。', en: '&str just borrows a view of some text.', say_zh: 'and str 只借一段来看。', say_en: 'A string slice just borrows a view of some text.'}]
      ,
      build() {
        const row = (y, k, a, b, c, cap) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:150px;display:grid;grid-template-columns:240px 1fr 1fr;align-items:center;padding:0 34px;gap:10px">
          <div class="mono" style="font-size:38px;font-weight:800;color:${c}">${k}</div><div style="font-size:30px">${a}</div><div style="font-size:30px">${b}</div></div>`;
        H(`<div class="r s" data-cap="0" style="left:0;right:0;top:20px;display:grid;grid-template-columns:240px 1fr 1fr;padding:0 34px;gap:10px"><span></span><span>${T('拥有文字？', 'Owns the text?')}</span><span>${T('能修改？', 'Can change it?')}</span></div>`);
        H(row(70, 'String', `<span class="ok">✓</span> ${T('堆上', 'on the heap')}`, `<span class="ok">✓</span> ${T('要 mut', 'with mut')}`, 'var(--acc2)', 0));
        H(row(240, '&amp;str', `<span class="red">✗</span> ${T('借用', 'borrowed')}`, `<span class="red">✗</span> ${T('只读', 'read-only')}`, 'var(--blue)', 1));
        H(`<div class="r card center" data-cap="1" data-delay="0.8" data-in="pop" style="left:0;right:0;top:450px;height:130px;border-color:var(--acc);font-size:34px;font-weight:800">${T('参数优先写 <span class="mono acc" style="margin-left:12px">&amp;str</span>', 'Parameters: prefer <span class="mono acc">&amp;str</span>')}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期，给自己的数据加上方法。', 'Next time: adding methods to your own data.'],
            ['关注我，一起学！', 'Follow along and learn with me!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 10 课 · Lesson 10', 'Lesson 10')}</div>
          <div class="h" style="font-size:72px;margin-top:30px">struct + impl</div>
          <div class="s" style="font-size:40px;margin-top:10px">${T('给数据加方法', 'Add methods to data')}</div>
          <div class="mono acc" style="font-size:32px;margin-top:40px">struct · impl · &amp;self</div></div>`);
      } },
  ],
};
