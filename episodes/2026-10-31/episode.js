// 第 8 课 · 借用：& 和 &mut 的规则
window.EPISODE = {
  n: 8,
  scenes: [
    { title: ['借用：& 和 &mut', 'Borrowing: & and &mut'],
      cap: [['上节课讲了，传值会 move 走。', 'Last time: passing a value moves it away.'],
            ['可我只想用一下，怎么办？', 'What if you just want to use it for a moment?'],
            ['答案是：借用。', 'The answer: borrow it.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:30px;padding:30px 40px;font-size:36px;line-height:1.8">${code(
`let s = String::from("hi");
take(s);            // ${T('s 被 move 走', 's is moved')}
println!("{s}");    // ${T('不能再用', 'gone')}`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.4" data-in="stamp" style="left:800px;top:200px">${icon('cross', 100, 'var(--red)')}</div>`);
        H(`<div class="r center s" data-cap="1" style="left:0;right:0;top:370px;font-size:34px">${T('只想用一下，不想交出去？', 'Just use it, not give it away?')}</div>`);
        H(`<div class="r card center" data-cap="2" data-in="pop" style="left:180px;right:180px;top:480px;height:260px;flex-direction:column;gap:12px;border-color:var(--acc)">
          <div class="h acc" style="font-size:72px">${T('借用', 'Borrow')}</div>
          <div class="mono" style="font-size:40px">&amp; · &amp;mut</div></div>`);
      } },

    { title: ['& 只读借用', '&: a read-only borrow'],
      cap: [{zh: '在前面加一个 &，就是借用。', en: 'Put an & in front, and you borrow it.',
             say_zh: '在前面加一个 and 符号，就是借用。', say_en: 'Put an ampersand in front, and you borrow it.'},
            ['函数只拿到引用，所有权不动。', 'The function gets a reference. Ownership stays.'],
            ['用完以后，s 照样能用。', 'After the call, s still works.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:34px;line-height:1.75">${code(
`fn len(s: &String) -> usize {
    s.len()
}
let s = String::from("hi");
let n = len(&s);       // ${T('借给它', 'lend it')}
println!("{s} {n}");   // hi 2`)}</div>`);
        const box = (x, t, c, dash) => `<div class="r card mono center" style="left:${x}px;top:0;width:260px;height:110px;font-size:38px;border-color:${c};color:${c};${dash ? 'border-style:dashed' : ''}">${t}</div>`;
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:480px;height:200px">
          ${box(120, 's', 'var(--acc2)')}
          <div class="r mono blue" style="left:410px;top:22px;font-size:48px">⇢</div>
          ${box(580, 'len(&amp;s)', 'var(--blue)', 1)}
          <div class="r s" style="left:60px;width:380px;top:130px;text-align:center">${T('主人：还是 s', 'owner: still s')}</div>
          <div class="r s" style="left:520px;width:380px;top:130px;text-align:center">${T('只借来看看', 'just looking')}</div></div>`);
        H(`<div class="r" data-cap="2" data-in="stamp" style="left:0;right:0;top:700px;text-align:center"><span class="chip ok" style="border-color:var(--acc2)">${icon('check', 30, 'var(--acc2)')} ${T('s 还能用', 's still usable')}</span></div>`);
      } },

    { title: ['&mut 可变借用', '&mut: a mutable borrow'],
      cap: [{zh: '想让函数改它？用 &mut。', en: 'Want the function to change it? Use &mut.',
             say_zh: '想让函数改它？用 and mut。', say_en: 'Want the function to change it? Use ampersand mut.'},
            ['变量本身也得是 mut。', 'The variable itself must be mut too.'],
            ['改完还回来，s 就变了。', 'It comes back changed.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:34px;line-height:1.75">${code(
`fn shout(s: &mut String) {
    s.push_str("!");
}
let mut s = String::from("hi");
shout(&mut s);
println!("{s}");   // hi!`)}</div>`);
        H(`<div class="r" data-cap="1" data-in="pop" style="left:0;right:0;top:480px;display:flex;gap:30px;justify-content:center">
          <div class="card center" style="width:420px;height:170px;flex-direction:column;gap:6px;border-color:var(--acc)"><div class="mono acc" style="font-size:40px">let mut s</div><div class="s">${T('变量可变', 'variable is mut')}</div></div>
          <div class="card center" style="width:420px;height:170px;flex-direction:column;gap:6px;border-color:var(--acc)"><div class="mono acc" style="font-size:40px">&amp;mut s</div><div class="s">${T('借出去改', 'lent to change')}</div></div></div>`);
        H(`<div class="r center" data-cap="2" style="left:0;right:0;top:700px;gap:30px">
          <div class="card mono" style="padding:14px 34px;font-size:40px;color:var(--quiet)">"hi"</div>
          <div class="mono acc" style="font-size:48px">→</div>
          <div class="card mono" style="padding:14px 34px;font-size:40px;color:var(--acc2);border-color:var(--acc2)">"hi!"</div></div>`);
      } },

    { title: ['核心规则', 'The one rule'],
      cap: [['规则只有一条：同一时刻，', "There's one rule. At any moment,"],
            {zh: '要么很多个 &，都只读；', en: 'either many & borrows, all read-only,',
             say_zh: '要么很多个 and 符号，都只读；', say_en: 'either many shared borrows, all read-only,'},
            {zh: '要么只有一个 &mut，能改。', en: 'or exactly one &mut, which can write.',
             say_zh: '要么只有一个 and mut，能改。', say_en: 'or exactly one ampersand mut, which can write.'},
            ['不能一边读，一边改。', 'Never read and write at the same time.']],
      build() {
        const node = (x, y, t, c, w = 130) => `<div class="r card mono center" style="left:${x}px;top:${y}px;width:${w}px;height:84px;font-size:32px;border-color:${c};color:${c}">${t}</div>`;
        H(`<div class="r card" data-cap="1" style="left:0;width:465px;top:20px;height:520px;padding:24px">
          <div class="h center" style="font-size:34px">${T('多个 &amp;', 'Many &amp;')} ${icon('check', 36, 'var(--acc2)')}</div>
          ${node(155, 110, 's', 'var(--acc2)', 150)}
          <svg class="r" style="left:0;top:194px" width="465" height="130"><path d="M230 0 L80 120 M230 0 L230 120 M230 0 L380 120" stroke="#5B8DEF" stroke-width="3" fill="none"/></svg>
          ${node(15, 324, '&amp;s', 'var(--blue)')}${node(167, 324, '&amp;s', 'var(--blue)')}${node(319, 324, '&amp;s', 'var(--blue)')}
          <div class="r s" style="left:0;right:0;top:440px;text-align:center">${T('都只读', 'all read-only')}</div></div>`);
        H(`<div class="r card" data-cap="2" style="left:495px;width:465px;top:20px;height:520px;padding:24px">
          <div class="h center" style="font-size:34px">${T('一个 &amp;mut', 'One &amp;mut')} ${icon('check', 36, 'var(--acc2)')}</div>
          ${node(155, 110, 's', 'var(--acc2)', 150)}
          <svg class="r" style="left:0;top:194px" width="465" height="130"><path d="M230 0 L230 120" stroke="#FF8A4C" stroke-width="3" fill="none"/></svg>
          ${node(130, 324, '&amp;mut s', 'var(--acc)', 200)}
          <div class="r s" style="left:0;right:0;top:440px;text-align:center">${T('独占，能改', 'exclusive, can write')}</div></div>`);
        H(`<div class="r card center" data-cap="3" data-shake="1" style="left:0;right:0;top:580px;height:150px;gap:24px;border-color:var(--red)">
          <span class="mono" style="font-size:38px">&amp;s</span><span class="h" style="font-size:38px">+</span><span class="mono" style="font-size:38px">&amp;mut s</span>
          <span class="h" style="font-size:34px">${T('同时', 'together')}</span>${icon('cross', 56, 'var(--red)')}</div>`);
      } },

    { title: ['编译器帮你拦住', 'The compiler catches it'],
      cap: [['要是读着读着，又想改，', 'Borrow to read, then try to change it,'],
            ['编译器直接报错，跑都不让跑。', 'and the compiler refuses to build it.'],
            ['这样就从根上避免了数据竞争。', 'That rules out data races at compile time.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:34px;line-height:1.75">${code(
`let mut s = String::from("hi");
let r1 = &s;          // ${T('在读', 'reading')}
let r2 = &mut s;      // ${T('又想改', 'now writing')}
println!("{r1}");`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:340px;padding:28px 40px;font-size:28px;line-height:1.7;border-color:var(--red)">
          <div class="q">$ cargo build</div>
          <div class="red" style="font-weight:800">error[E0502]: cannot borrow \`s\` as mutable</div>
          <div class="red" style="font-weight:800">because it is also borrowed as immutable</div></div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:640px;text-align:center"><span class="chip ok" style="border-color:var(--acc2)">${icon('shield', 30, 'var(--acc2)')} ${T('没有数据竞争', 'no data races')}</span></div>`);
      } },

    { title: ['借用到最后一次使用', 'A borrow ends at its last use'],
      cap: [['好消息：借用不用等到大括号结束。', "Good news: a borrow doesn't wait for the closing brace."],
            ['最后一次用完，它就结束了。', 'It ends right after its last use.'],
            ['先读完，再改，就能编译。', 'Read first, then change. That compiles.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:34px;line-height:1.75">${code(
`let mut s = String::from("hi");
let r1 = &s;
println!("{r1}");   // ${T('r1 最后一次用', 'last use of r1')}
let r2 = &mut s;    // ${T('可以', 'OK')}
r2.push('!');`)}</div>`);
        H(`<div class="r card" data-cap="1" style="left:0;right:0;top:420px;height:250px">
          <div class="r" style="left:40px;right:40px;top:150px;height:4px;background:var(--line)"></div>
          <div class="r mono center" style="left:60px;width:360px;top:40px;height:80px;border-radius:14px;background:rgba(91,141,239,.18);border:3px solid var(--blue);color:var(--blue);font-size:32px">r1 = &amp;s</div>
          <div class="r s" style="left:40px;right:40px;top:180px;text-align:right">${T('时间 →', 'time →')}</div></div>`);
        H(`<div class="r mono center" data-cap="2" data-in="right" style="left:500px;width:400px;top:460px;height:80px;border-radius:14px;background:rgba(255,138,76,.18);border:3px solid var(--acc);color:var(--acc);font-size:32px">r2 = &amp;mut s</div>`);
        H(`<div class="r" data-cap="2" data-delay="0.8" data-in="stamp" style="left:0;right:0;top:710px;text-align:center"><span class="chip ok" style="border-color:var(--acc2)">${icon('check', 30, 'var(--acc2)')} ${T('不重叠，就没问题', 'no overlap, no problem')}</span></div>`);
      } },

    { title: ['一句话记住', 'Remember it in one line'],
      cap: [{zh: '总结：& 可以借很多个，只读；', en: 'To recap: & can be shared, read-only.',
             say_zh: '总结：and 符号可以借很多个，只读；', say_en: 'To recap: shared borrows can be many, read-only.'},
            {zh: '&mut 只能有一个，能改。', en: '&mut is exclusive, and it can write.',
             say_zh: 'and mut 只能有一个，能改。', say_en: 'Ampersand mut is exclusive, and it can write.'}],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="left" style="left:0;width:450px;top:80px;height:420px;flex-direction:column;gap:20px;border-color:var(--blue)">
          <div class="mono blue" style="font-size:80px;font-weight:800">&amp;</div>
          <div class="h">${T('多个读者', 'Many readers')}</div><div class="s">${T('共享 · 只读', 'shared · read-only')}</div></div>`);
        H(`<div class="r card center" data-cap="1" data-in="right" style="left:510px;width:450px;top:80px;height:420px;flex-direction:column;gap:20px;border-color:var(--acc)">
          <div class="mono acc" style="font-size:80px;font-weight:800">&amp;mut</div>
          <div class="h">${T('一个写者', 'One writer')}</div><div class="s">${T('独占 · 能改', 'exclusive · can write')}</div></div>`);
        H(`<div class="r h center" data-cap="1" data-delay="0.6" data-in="pop" style="left:440px;width:80px;top:250px;font-size:36px">${T('或', 'OR')}</div>`);
        H(`<div class="r center" data-cap="1" data-delay="1.2" style="left:0;right:0;top:580px;font-size:40px;font-weight:800">${T('多读 <span class="acc">或</span> 一写，不能同时', 'Many readers <span class="acc">or</span> one writer')}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期聊 String 和 &str，', en: 'Next time: String vs &str,',
             say_zh: '下期聊 String 和 and str，', say_en: 'Next time: String versus ampersand str,'},
            ['切片到底是什么。关注我，一起学！', 'and what a slice really is. Follow along!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 9 课 · Lesson 9', 'Lesson 9')}</div>
          <div class="h mono" style="font-size:76px;margin-top:30px">String · &amp;str</div>
          <div class="s" style="font-size:40px;margin-top:20px">${T('切片是什么 · What is a slice', 'What is a slice?')}</div>
          <div class="mono acc" style="font-size:32px;margin-top:30px">&amp;s[0..2]</div></div>`);
      } },
  ],
};
