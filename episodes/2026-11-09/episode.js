// 第 17 课 · 生命周期入门：'a 到底在说什么
window.EPISODE = {
  n: 17,
  scenes: [
    { title: ['这段代码为什么编译不过？', "Why won't this compile?"],
      cap: [['两个字符串，返回长度更大的那个，', 'Take two strings, return the longer one.'],
            ['这么简单的函数，居然编译不过？', "Such a simple function, and it won't compile?"]],
      build() {
        H(`<div class="r card mono" data-cap="0" style="font-variant-ligatures:none;left:0;right:0;top:40px;padding:30px 40px;font-size:32px;line-height:1.75">${code(`fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}`)}</div>`);
        H(`<div class="r card" data-cap="1" data-shake="1" style="left:0;right:0;top:330px;padding:28px 40px;border-color:var(--red)">
          <div class="mono red" style="font-variant-ligatures:none;font-size:34px;font-weight:800">error[E0106]</div>
          <div class="mono red" style="font-variant-ligatures:none;font-size:30px;margin-top:8px">missing lifetime specifier</div></div>`);
        H(`<div class="r center" data-cap="1" data-delay="1.0" data-in="stamp" style="left:0;right:0;top:600px">
          <span class="h mono acc" style="font-variant-ligatures:none;font-size:80px">'a ?</span></div>`);
      } },

    { title: ['编译器在问什么', 'What the compiler is asking'],
      cap: [['编译器其实在问一个问题，', 'The compiler is really asking one question.'],
            {zh: '返回的引用，借的是 x 还是 y？', en: 'Is the returned reference borrowed from x, or from y?', say_zh: '返回的引用，借的是 X 还是 Y？'},
            ['不知道借的谁，就没法检查有没有效。', "If it doesn't know, it can't check the reference is still valid."]],
      build() {
        H(`<div class="r card mono center" data-cap="0" data-in="left" style="font-variant-ligatures:none;left:60px;top:60px;width:300px;height:130px;font-size:40px;border-color:var(--blue)">x: &amp;str</div>`);
        H(`<div class="r card mono center" data-cap="0" data-delay="0.4" data-in="left" style="font-variant-ligatures:none;left:60px;top:300px;width:300px;height:130px;font-size:40px;border-color:var(--blue)">y: &amp;str</div>`);
        H(`<svg class="r" data-cap="1" style="left:360px;top:60px" width="230" height="370"><path d="M0 65 L200 185 M0 305 L200 185" stroke="#8B93A3" stroke-width="4" stroke-dasharray="12 10" fill="none"/><path d="M200 185 l-22 -16 l4 16 l-4 16 z" fill="#8B93A3"/></svg>`);
        H(`<div class="r card center" data-cap="1" data-delay="0.5" data-in="pop" style="left:600px;top:170px;width:320px;height:150px;flex-direction:column;gap:4px;border-color:var(--acc)">
          <div class="mono" style="font-variant-ligatures:none;font-size:38px">-&gt; &amp;str</div><div class="h acc" style="font-size:48px">?</div></div>`);
        H(`<div class="r card center" data-cap="2" style="left:60px;right:60px;top:540px;height:160px;gap:22px;border-color:var(--red)">
          ${icon('cross', 50, 'var(--red)')}<span class="h" style="font-size:36px">${T('借自谁不知道 → 没法检查', "unknown source → can't check")}</span></div>`);
      } },

    { title: ["加上 'a", "Add 'a"],
      cap: [{zh: "加上 'a，把三个引用连在一起。", en: "Add 'a to tie the three references together.", say_zh: '加上生命周期标注，把三个引用连在一起。', say_en: 'Add a lifetime, tick a, to tie the three references together.'},
            {zh: '意思是：返回值的有效期，', en: 'It means the returned reference is valid', say_zh: '意思是，返回值的有效期，'},
            {zh: '不会超过 x 和 y 里更短的那个。', en: 'no longer than the shorter-lived of x and y.', say_zh: '不会超过 X 和 Y 里更短的那个。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="font-variant-ligatures:none;left:0;right:0;top:20px;padding:26px 36px;font-size:30px;line-height:1.7">${code(`fn longest<'a>(x: &'a str, y: &'a str)
    -> &'a str {
    if x.len() > y.len() { x } else { y }
}`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.0" data-in="pop" style="left:0;right:0;top:300px;text-align:center"><span class="chip" style="font-size:30px;border-color:var(--acc)"><span class="mono acc" style="font-variant-ligatures:none;">'a</span> = ${T('一个有效期的名字', 'a name for how long a reference is valid')}</span></div>`);
        const bar = (y, w, label, c, cap, d) => H(`<div class="r" data-cap="${cap}" data-delay="${d}" data-in="left" style="left:60px;top:${y}px;display:flex;align-items:center;gap:20px">
          <div class="mono" style="font-variant-ligatures:none;width:90px;font-size:32px;color:${c}">${label}</div><div style="width:${w}px;height:40px;border-radius:10px;background:${c}"></div></div>`);
        bar(420, 700, 'x', 'var(--blue)', 1, 0);
        bar(500, 430, 'y', 'var(--blue)', 1, 0.3);
        bar(600, 430, 'ret', 'var(--acc)', 2, 0);
        H(`<div class="r s" data-cap="2" data-delay="0.6" style="left:0;right:0;top:700px;text-align:center">${T('返回值 ≤ 两者中更短的', 'result ≤ the shorter of the two')}</div>`);
      } },

    { title: ["'a 不会延长寿命", "'a doesn't extend anything"],
      cap: [{zh: "注意，'a 不会让谁多活一秒，", en: "Careful: 'a doesn't make anything live longer.", say_zh: '注意，生命周期标注，不会让谁多活一秒，', say_en: "Careful: a lifetime doesn't make anything live longer."},
            ['它只是描述关系，让编译器帮你检查。', 'It only describes a relationship, so the compiler can check it.']],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="left" style="left:0;width:460px;top:60px;height:340px;flex-direction:column;gap:24px;border-color:var(--red)">
          ${icon('cross', 70, 'var(--red)')}<div class="h" style="font-size:40px">${T('延长寿命', 'Extends a lifetime')}</div></div>`);
        H(`<div class="r card center" data-cap="1" data-in="right" style="left:500px;width:460px;top:60px;height:340px;flex-direction:column;gap:24px;border-color:var(--acc2)">
          ${icon('check', 70, 'var(--acc2)')}<div class="h" style="font-size:40px">${T('描述关系', 'Describes a relation')}</div></div>`);
        H(`<div class="r card center" data-cap="1" data-delay="1.2" data-in="pop" style="left:60px;right:60px;top:470px;height:150px;gap:20px;border-color:var(--acc)">
          ${icon('shield', 50, 'var(--acc)')}<span class="h" style="font-size:36px">${T('编译器按它检查', 'the compiler checks against it')}</span></div>`);
      } },

    { title: ['编译器替你抓 bug', 'The compiler catches the bug'],
      cap: [{zh: 'b 在大括号结束时就被释放了，', en: 'b is freed at the closing brace.', say_zh: 'B 在大括号结束时，就被释放了，'},
            {zh: '外面还用 r，r 可能指向 b，', en: 'r is still used outside, and r may point to b,', say_zh: '外面还在用 R，它可能指向 B，'},
            ['编译器直接拦住，不让运行。', 'so the compiler stops it before it can run.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="font-variant-ligatures:none;left:0;right:0;top:20px;padding:26px 36px;font-size:29px;line-height:1.7">${code(`let a = String::from("hello");
let r;
{
    let b = String::from("hi");
    r = longest(&a, &b);
}                   // ${T('b 在这里释放', 'b is freed here')}
println!("{}", r);  // ${T('r 还在用', 'r still used')}`)}</div>`);
        H(`<div class="r card" data-cap="2" data-shake="1" style="left:0;right:0;top:480px;padding:26px 40px;border-color:var(--red)">
          <div class="mono red" style="font-variant-ligatures:none;font-size:32px;font-weight:800">error[E0597]</div>
          <div class="mono red" style="font-variant-ligatures:none;font-size:28px;margin-top:8px">\`b\` does not live long enough</div></div>`);
        H(`<div class="r" data-cap="2" data-delay="1.0" style="left:0;right:0;top:680px;text-align:center"><span class="chip ok" style="border-color:var(--acc2)">${T('不会有悬垂引用', 'no dangling reference')}</span></div>`);
      } },

    { title: ['大多数时候不用写', 'Usually you skip it'],
      cap: [{zh: "那每个引用都要写 'a 吗？不用。", en: "So do you write 'a on every reference? No.", say_zh: '那每个引用都要标注吗？不用。', say_en: 'So do you annotate every reference? No.'},
            ['参数里只有一个引用时，', 'When only one parameter is a reference,'],
            ['编译器自动让返回值跟它绑定。', 'the compiler ties the result to it for you.']],
      build() {
        H(`<div class="r card mono" data-cap="1" style="font-variant-ligatures:none;left:0;right:0;top:40px;padding:30px 40px;font-size:32px;line-height:1.75">${code(`fn first_word(s: &str) -> &str {
    s.split(' ').next().unwrap()
}`)}</div>`);
        H(`<div class="r mono acc" data-cap="2" data-in="pop" style="font-variant-ligatures:none;left:0;right:0;top:290px;text-align:center;font-size:52px">↓ ${T('编译器补上', 'filled in')}</div>`);
        H(`<div class="r card mono" data-cap="2" data-delay="0.5" style="font-variant-ligatures:none;left:0;right:0;top:400px;padding:28px 36px;font-size:28px;line-height:1.7;border-color:var(--acc2);border-style:dashed">${code(`fn first_word<'a>(s: &'a str) -> &'a str`)}</div>`);
        H(`<div class="r" data-cap="2" data-delay="1.2" style="left:0;right:0;top:580px;text-align:center"><span class="chip">${T('生命周期省略 · lifetime elision', 'lifetime elision')}</span></div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [{zh: "总结：'a 是给有效期起的名字，", en: "To recap: 'a is a name for how long a reference is valid,", say_zh: '总结一下，生命周期标注，是给有效期起的名字，', say_en: 'To recap: a lifetime is a name for how long a reference is valid,'},
            ['它描述引用之间的关系，不改变寿命，', 'it describes how references relate, without changing how long anything lives,'],
            ['只有一个引用参数时，可以不写。', 'and with only one reference parameter, you can skip it.']],
      build() {
        const row = (y, k, z, e, c, cap) => H(`<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:160px;display:grid;grid-template-columns:330px 1fr;align-items:center;padding:0 36px;gap:16px;border-color:${c}">
          <div class="mono" style="font-variant-ligatures:none;font-size:38px;font-weight:800;color:${c}">${k}</div><div style="font-size:32px">${T(z, e)}</div></div>`);
        row(30, "'a", '给有效期起个名字', 'a name for how long a reference is valid', 'var(--acc)', 0);
        row(220, "-&gt; &amp;'a str", '描述关系，不改变寿命', 'describes a relation, changes nothing', 'var(--blue)', 1);
        row(410, '(s: &amp;str)', '只有一个引用参数：省略', 'one reference parameter: skip it', 'var(--acc2)', 2);
        H(`<div class="r card center" data-cap="2" data-delay="1.0" data-in="pop" style="left:100px;right:100px;top:620px;height:130px;border-color:var(--acc);font-size:38px;font-weight:800">${T('返回值借自谁？写清楚', 'Say where the result is borrowed from')}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期讲迭代器和闭包，', en: 'Next time: iterators and closures.'},
            ['一句代码，处理一整个列表。', 'One line to process a whole list.'],
            ['关注我，一起学！', 'Follow along and learn with me!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 18 课 · Lesson 18', 'Lesson 18')}</div>
          <div class="h" style="font-size:72px;margin-top:30px">${T('迭代器和闭包', 'Iterators & closures')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:40px;margin-top:10px">Iterators &amp; closures</div>' : ''}
          <div class="mono acc" style="font-variant-ligatures:none;font-size:32px;margin-top:40px">v.iter().map(|x| x * 2)</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：这段代码能编译吗？', en: 'Quick quiz: does this code compile?'},
            {zh: '能，还是不能？评论区告诉我。', en: 'Yes or no? Tell me in the comments.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="font-variant-ligatures:none;left:0;right:0;top:40px;padding:30px 40px;font-size:36px;line-height:1.8">${code(`fn first(x: &str, n: usize) -> &str {
    &x[..n]
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:330px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('能', 'Yes')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('不能', 'No')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:530px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
