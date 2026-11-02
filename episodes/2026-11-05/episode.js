// 第 13 课 · Result 和 ? 运算符：错误处理
window.EPISODE = {
  n: 13,
  scenes: [
    { title: ['出错了，Rust 怎么办？', 'When things fail in Rust'],
      cap: [{zh: '把 "abc" 转成数字，会怎样？', en: 'What happens if you turn "abc" into a number?',
             say_zh: '把字母 A B C 转成数字，会怎样？', say_en: 'What happens if you turn the text A B C into a number?'},
            {zh: 'Rust 不抛异常，它返回 Result。', en: "Rust doesn't throw an exception. It returns a Result.",
             say_zh: 'Rust 不抛异常，它返回一个结果类型。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:40px 44px;font-size:40px;line-height:1.8">${code(`let n = "abc".parse::<i32>();`)}</div>`);
        H(`<div class="r mono" data-cap="0" data-delay="1.0" data-in="pop" style="left:420px;top:230px;font-size:110px;font-weight:800;color:var(--yel)">?</div>`);
        H(`<div class="r card center" data-cap="1" data-in="stamp" style="left:60px;width:400px;top:430px;height:200px;flex-direction:column;gap:10px;border-color:var(--quiet)">
          <div class="s">${T('其他语言', 'Other languages')}</div><div class="h q" style="font-size:38px">throw ${T('异常', 'exception')}</div></div>`);
        H(`<div class="r card center" data-cap="1" data-delay="0.8" data-in="pop" style="left:500px;width:400px;top:430px;height:200px;flex-direction:column;gap:10px;border-color:var(--acc)">
          <div class="s">Rust</div><div class="mono acc" style="font-size:40px;font-weight:800">Result</div></div>`);
      } },

    { title: ['Result：成功或失败', 'Result: success or failure'],
      cap: [{zh: '比起 Option，Result 还说出失败原因。', en: 'Unlike Option, Result also tells you why it failed.', say_zh: '比起可选类型，结果类型还能说出失败原因。'},
            {zh: '成功是 Ok(值)，失败是 Err(错误)。', en: 'Success is Ok(value). Failure is Err(error).',
             say_zh: '成功就装着值，失败就装着错误。', say_en: 'Success is Ok, holding the value. Failure is Err, holding the error.'}],
      build() {
        const pill = (x, y, t, c) => `<div class="r mono" style="left:${x}px;top:${y}px;font-size:32px;border:2px solid ${c};border-radius:14px;padding:12px 22px;color:${c}">${t}</div>`;
        H(`<div class="r card" data-cap="0" style="left:0;width:465px;top:20px;height:320px;padding:28px">
          <div class="mono ty" style="text-align:center;font-size:40px;font-weight:800">Option&lt;T&gt;</div>
          <div class="s" style="text-align:center;margin-top:8px">${T('有没有值', 'is there a value?')}</div>
          ${pill(30, 170, 'Some(v)', 'var(--acc2)')}${pill(290, 170, 'None', 'var(--quiet)')}</div>`);
        H(`<div class="r card" data-cap="0" data-delay="1.2" style="left:495px;width:465px;top:20px;height:320px;padding:28px;border-color:var(--acc)">
          <div class="mono ty" style="text-align:center;font-size:40px;font-weight:800">Result&lt;T, E&gt;</div>
          <div class="s" style="text-align:center;margin-top:8px">${T('成功，或失败的原因', 'success, or why it failed')}</div>
          ${pill(40, 170, 'Ok(v)', 'var(--acc2)')}${pill(250, 170, 'Err(e)', 'var(--red)')}</div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:390px;padding:28px 40px;font-size:32px;line-height:1.7">${code(`enum Result<T, E> {
    Ok(T),    // ${T('成功：值', 'success: the value')}
    Err(E),   // ${T('失败：错误', 'failure: the error')}
}`)}</div>`);
      } },

    { title: ['match：两条路都要写', 'match: handle both paths'],
      cap: [{zh: '最直接的：用 match，两条路都写。', en: 'The direct way: match, and handle both paths.', say_zh: '最直接的：用模式匹配，两条路都写。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:${T('32px', '30px')};line-height:1.75">${code(`match "abc".parse::<i32>() {
    Ok(n) => println!("got {n}"),
    Err(e) => println!("error: {e}"),
}`)}</div>`);
        H(`<div class="r card mono center" data-cap="0" data-delay="0.8" style="left:0;width:465px;top:330px;height:110px;font-size:30px;border-color:var(--acc2);color:var(--acc2)">Ok(n) → ${T('用这个数', 'use n')}</div>`);
        H(`<div class="r card mono center" data-cap="0" data-delay="1.1" style="left:495px;width:465px;top:330px;height:110px;font-size:30px;border-color:var(--red);color:var(--red)">Err(e) → ${T('处理错误', 'handle e')}</div>`);
        H(`<div class="r card mono" data-cap="0" data-delay="1.5" style="left:0;right:0;top:490px;padding:26px 40px;font-size:30px;line-height:1.7">
          <div class="q">$ cargo run</div><div>error: invalid digit found in string</div></div>`);
      } },

    { title: ['unwrap：偷懒，但会崩', 'unwrap: quick, but it crashes'],
      cap: [{zh: '偷懒用 unwrap：失败程序直接崩。', en: 'The shortcut is unwrap, but on Err it panics.', say_zh: '偷懒就用解包：一失败，程序就崩溃。', say_en: 'The shortcut is unwrap, but on an error it panics.'},
            ['写小例子可以，正式代码少用。', 'Fine for quick demos. Avoid it in real code.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:30px;line-height:1.8">${code(`let a: i32 = "42".parse().unwrap();  // 42
let b: i32 = "abc".parse().unwrap(); // ${T('崩', 'panic')}`)}</div>`);
        H(`<div class="r card mono" data-cap="0" data-delay="1.2" data-shake="1" style="left:0;right:0;top:260px;padding:26px 36px;font-size:26px;line-height:1.6;border-color:var(--red)">
          <div class="red" style="font-weight:800">${icon('boom', 34, 'var(--red)')} panic · ${T('程序崩溃', 'the program crashes')}</div>
          <div class="q">called \`Result::unwrap()\` on an \`Err\` value: …</div></div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:500px;display:flex;gap:30px;justify-content:center">
          <div class="card center" style="width:430px;height:180px;flex-direction:column;gap:10px;border-color:var(--acc2)">${icon('check', 44, 'var(--acc2)')}<div class="h" style="font-size:32px">${T('小例子、测试', 'Demos, tests')}</div></div>
          <div class="card center" style="width:430px;height:180px;flex-direction:column;gap:10px;border-color:var(--red)">${icon('cross', 44, 'var(--red)')}<div class="h" style="font-size:32px">${T('正式代码', 'Real code')}</div></div></div>`);
      } },

    { title: ['? 运算符：错误往上交', 'The ? operator: pass it up'],
      cap: [{zh: '更常用的，是 ? 运算符。', en: 'More common is the ? operator.', say_zh: '更常用的，是问号运算符。', say_en: 'More common is the question mark operator.'},
            {zh: '成功就取值继续，失败就把错误返回。', en: 'Ok: keep the value. Err: return it to the caller.', say_en: 'If it is Ok, keep the value. If it is an Err, return it to the caller.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 36px;font-size:${T('29px', '28px')};line-height:1.7">${code(`use std::num::ParseIntError;

fn double(s: &str) -> Result<i32, ParseIntError> {
    let n: i32 = s.parse()?;
    Ok(n * 2)
}`)}</div>`);
        H(`<div class="r card center" data-cap="0" data-delay="0.8" data-in="pop" style="left:380px;top:370px;width:200px;height:110px;border-color:var(--yel)"><span class="mono yel" style="font-size:56px;font-weight:800">?</span></div>`);
        H(`<div class="r card center" data-cap="1" data-in="left" style="left:0;width:340px;top:560px;height:180px;flex-direction:column;gap:8px;border-color:var(--acc2)">
          <div class="mono ok" style="font-size:32px">Ok(n)</div><div class="s">${T('n 留下，继续', 'keep n, go on')}</div></div>`);
        H(`<div class="r card center" data-cap="1" data-delay="1.6" data-in="right" style="left:620px;width:340px;top:560px;height:180px;flex-direction:column;gap:8px;border-color:var(--red)">
          <div class="mono red" style="font-size:32px">Err(e)</div><div class="s">return Err(e)</div></div>`);
        H(`<svg class="r" data-cap="1" style="left:0;top:480px" width="960" height="80"><path d="M480 0 L170 76" stroke="#5BE7C4" stroke-width="4" fill="none"/></svg>`);
        H(`<svg class="r" data-cap="1" data-delay="1.6" style="left:0;top:480px" width="960" height="80"><path d="M480 0 L790 76" stroke="#FF6B6B" stroke-width="4" fill="none"/></svg>`);
      } },

    { title: ['用 ? 的函数也要返回 Result', '? needs a Result-returning fn'],
      cap: [{zh: '注意：用 ? 的函数也得返回 Result。', en: 'Watch out: to use ? on a Result, the fn must return one.', say_zh: '注意：用问号的函数，自己也得返回结果类型。', say_en: 'Watch out: to use the question mark on a Result, the function must return a Result too.'},
            {zh: '连 main 都可以返回 Result。', en: 'Even main can return a Result.', say_zh: '连主函数都可以返回结果类型。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-shake="1" style="left:0;right:0;top:20px;padding:24px 36px;font-size:30px;line-height:1.6;border-color:var(--red)">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:4px">${icon('cross', 32, 'var(--red)')} ${T('返回 ()，不能用 ?', 'returns (), so no ?')}</div>${code(`fn main() {
    let n: i32 = "42".parse()?;
}`)}
          <div class="red" style="font-size:24px;font-weight:800;margin-top:6px">error[E0277]: the \`?\` operator can only be used in a function that returns \`Result\` or \`Option\` …</div></div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:380px;padding:24px 36px;font-size:30px;line-height:1.6;border-color:var(--acc2)">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:4px">${icon('check', 32, 'var(--acc2)')} ${T('main 返回 Result', 'main returns a Result')}</div>${code(`use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let n: i32 = "42".parse()?;
    println!("{n}");
    Ok(())
}`)}</div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [['总结：在 Rust 里，错误也是一个值。', 'To sum up: in Rust, an error is just a value.'],
            {zh: 'match 就地处理，? 交给上层，', en: 'match handles it here. ? passes it up.', say_zh: '模式匹配就地处理，问号交给上层，', say_en: 'match handles it here. The question mark passes it up.'},
            {zh: 'unwrap 只在确定不会错时用。', en: "unwrap only when you're sure it can't fail.", say_zh: '解包，只在确定不会出错时用。'}],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;right:0;top:20px;height:150px;gap:24px;border-color:var(--acc)">
          <span class="mono acc" style="font-size:44px;font-weight:800">Result</span><span class="h" style="font-size:40px">= Ok(v) | Err(e)</span></div>`);
        const card = (i, k, ic, c, z, e, cap, d) => H(`<div class="r card" data-cap="${cap}" data-delay="${d}" style="left:${i * 330}px;top:220px;width:300px;height:420px;padding:34px 20px;text-align:center;border-color:${c}">
          <div>${icon(ic, 70, c)}</div>
          <div class="mono" style="font-size:44px;font-weight:800;margin-top:20px">${k}</div>
          <div class="s" style="margin-top:24px">${T(z, e)}</div></div>`);
        card(0, 'match', 'gear', 'var(--blue)', '就地处理<br>两条路都写', 'handle it here,<br>both paths', 1, 0);
        card(1, '?', 'rocket', 'var(--acc2)', '错误交给<br>上层', 'pass the error<br>up', 1, 0.8);
        card(2, 'unwrap', 'boom', 'var(--red)', '失败就崩<br>确定才用', 'panics on Err,<br>use with care', 2, 0);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期讲 Cargo：建项目、加依赖、跑测试。', 'Next: Cargo. New projects, dependencies, tests.']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 14 课 · Lesson 14', 'Lesson 14')}</div>
          <div class="h" style="font-size:84px;margin-top:30px">Cargo</div>
          <div class="s" style="font-size:36px;margin-top:10px">${T('建项目 · 加依赖 · 跑测试', 'new · add · test')}</div>
          <div class="mono acc" style="font-size:32px;margin-top:40px">cargo new · cargo add · cargo test</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz; answer in meta.json quiz
      cap: [{zh: '考考你：这段代码能编译吗？', en: 'Quick quiz: does this code compile?'},
            ['能，还是不能？评论区告诉我。', 'Yes or no? Tell me in the comments.']],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:30px;padding:30px 40px;font-size:36px;line-height:1.8">${code(`fn f() -> i32 {
    let n: i32 = "7".parse()?;
    n
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:380px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('能', 'Yes')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('不能', 'No')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:580px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
