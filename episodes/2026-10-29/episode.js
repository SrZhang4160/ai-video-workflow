// 第 6 课 · 所有权的三条规则
window.EPISODE = {
  n: 6,
  scenes: [
    { title: ['所有权的三条规则', 'The 3 rules of ownership'],
      cap: [['Rust 没有垃圾回收，', 'Rust has no garbage collector,'],
            ['也不用你手动释放内存。', "and you don't free memory by hand."],
            ['那内存谁来管？靠三条规则。', 'So who cleans up? Three simple rules.']],
      build() {
        H(`<div class="r center" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;height:200px">
          <div class="h" style="font-size:150px;color:var(--acc)">?</div></div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:250px;display:flex;gap:30px;justify-content:center">
          <div class="card center" style="width:420px;height:140px;gap:16px;font-size:32px">${icon('cross', 44, 'var(--red)')}${T('垃圾回收', 'Garbage collector')}</div>
          <div class="card center" style="width:420px;height:140px;gap:16px;font-size:32px">${icon('cross', 44, 'var(--red)')}${T('手动 free', 'Manual free')}</div></div>`);
        [['1', '每个值都有主人', 'Every value has an owner'], ['2', '同一时刻只有一个主人', 'One owner at a time'], ['3', '主人走了，值就被清理', 'Owner leaves, value is dropped']]
          .forEach(([n, z, e], i) => H(`<div class="r card" data-cap="2" data-delay="${0.4 + i * 0.4}" data-in="left" style="left:0;right:0;top:${440 + i * 130}px;height:110px;display:flex;align-items:center;gap:26px;padding:0 34px;border-color:var(--acc)">
            <div class="mono acc" style="font-size:44px;font-weight:800">${n}</div><div style="font-size:34px;font-weight:700">${T(z, e)}</div></div>`));
      } },

    { title: ['规则一：每个值都有主人', 'Rule 1: every value has an owner'],
      cap: [['第一条：每个值都有一个主人。', 'Rule one: every value has an owner.'],
            {zh: '你看，这个字符串的主人就是 s。', en: 'Here, the owner of this string is s.', say_zh: '你看，这个字符串的主人就是 S。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:34px 40px;font-size:38px;line-height:1.8">${code(`let s = String::from("hi");
// ${T('s 是这个值的主人', 's owns this value')}`)}</div>`);
        H(`<div class="r card mono center" data-cap="1" data-in="left" style="left:90px;top:360px;width:260px;height:150px;font-size:48px;color:var(--acc2);border-color:var(--acc2)">s</div>`);
        H(`<div class="r mono acc" data-cap="1" data-delay="0.5" data-in="pop" style="left:400px;top:385px;font-size:70px">→</div>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="0.8" data-in="right" style="left:560px;top:360px;width:310px;height:150px;font-size:44px;color:var(--yel);border-color:var(--yel)">"hi"</div>`);
        H(`<div class="r" data-cap="1" data-delay="1.2" style="left:0;right:0;top:560px;display:flex;justify-content:space-around;padding:0 60px">
          <span class="s">${T('主人 owner', 'owner')}</span><span class="s">${T('值 value', 'value')}</span></div>`);
      } },

    { title: ['规则二：只有一个主人', 'Rule 2: one owner at a time'],
      cap: [['第二条：同一时刻只能有一个主人。', 'Rule two: only one owner at a time.'],
            {zh: '把 s1 赋给 s2，主人就换了，', en: 'Assign s1 to s2, and the owner changes.', say_zh: '把 S 一 赋给 S 二，主人就换了，', say_en: 'Assign s one to s two, and the owner changes.'},
            {zh: '再用 s1，编译器直接报错。', en: 'Use s1 again, and the compiler says no.', say_zh: '再用 S 一，编译器直接报错。', say_en: 'Use s one again, and the compiler says no.'}],
      build() {
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:20px;padding:30px 40px;font-size:34px;line-height:1.75">${code(`let s1 = String::from("hi");
let s2 = s1;       // ${T('主人换成 s2', 'owner is now s2')}
println!("{s1}");  // ${T('不能再用 s1', 's1 is gone')}`)}</div>`);
        H(`<div class="r card mono" data-cap="2" data-shake="1" style="left:0;right:0;top:300px;padding:28px 40px;font-size:30px;line-height:1.7;border-color:var(--red)">
          <div class="q">$ cargo run</div>
          <div class="red" style="font-weight:800">error[E0382]: borrow of moved</div>
          <div class="red" style="font-weight:800">value: \`s1\`</div></div>`);
        H(`<div class="r" data-cap="2" data-delay="1.4" style="left:0;right:0;top:600px;text-align:center"><span class="chip ok" style="border-color:var(--acc2)">${T('不会有两个主人重复释放', 'no two owners freeing the same memory')}</span></div>`);
      } },

    { title: ['规则三：主人走了，值就清理', 'Rule 3: owner leaves, value is dropped'],
      cap: [['第三条：主人离开作用域，', 'Rule three: when the owner goes out of scope,'],
            ['值就被自动清理，内存释放。', 'the value is dropped and its memory freed.'],
            ['这一步是编译器帮你插进去的。', 'The compiler inserts that cleanup for you.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:30px 40px;font-size:36px;line-height:1.8">${code(`{
    let s = String::from("hi");
    // ${T('这里 s 可以用', 's is usable here')}
}   // ${T('s 离开作用域', 's goes out of scope')}`)}</div>`);
        H(`<div class="r card center" data-cap="1" data-in="drop" style="left:0;right:0;top:380px;height:150px;gap:24px;border-color:var(--acc2)">
          ${icon('box', 60, 'var(--acc2)')}<span class="mono" style="font-size:40px">"hi"</span><span class="s">${T('在 } 处自动 drop', 'dropped at the }')}</span></div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:580px;display:flex;gap:30px;justify-content:center">
          <span class="chip">${T('编译时决定', 'decided at compile time')}</span><span class="chip ok" style="border-color:var(--acc2)">${T('不需要垃圾回收', 'no GC needed')}</span></div>`);
      } },

    { title: ['三种管内存的方式', 'Three ways to manage memory'],
      cap: [['对比一下：手动释放，容易漏或重复；', 'Compare: manual free is easy to forget or double up,'],
            ['垃圾回收，运行时要额外开销；', 'a garbage collector costs time at runtime,'],
            ['所有权，编译时就把账算清了。', 'ownership settles it all at compile time.']],
      build() {
        const col = (i, cap, z, e, sz, se, c, ic) => H(`<div class="r card" data-cap="${cap}" style="left:${i * 325}px;top:30px;width:310px;height:520px;padding:30px 20px;text-align:center;border-color:${c}">
          <div style="margin-top:10px">${icon(ic, 80, c)}</div>
          <div class="h" style="font-size:36px;margin-top:30px">${T(z, e)}</div>
          <div class="s" style="margin-top:30px;line-height:1.5">${T(sz, se)}</div></div>`);
        col(0, 0, '手动释放', 'Manual free', '忘了就泄漏<br>多释放出大错', 'forget: leak<br>twice: memory bug', 'var(--red)', 'boom');
        col(1, 1, '垃圾回收', 'Garbage collector', '运行时<br>额外开销', 'extra work<br>at runtime', 'var(--yel)', 'clock');
        col(2, 2, '所有权', 'Ownership', '编译时检查<br>自动释放', 'checked at<br>compile time', 'var(--acc2)', 'shield');
        H(`<div class="r" data-cap="2" data-delay="0.8" data-in="stamp" style="left:${2 * 325 + 115}px;top:580px">${icon('check', 90, 'var(--acc2)')}</div>`);
      } },

    { title: ['一句话记住', 'Remember it in one line'],
      cap: [['总结一下：一个值，一个主人，', 'To sum up: one value, one owner,'],
            ['主人走了，值就跟着走。', 'and when the owner leaves, the value goes too.']],
      build() {
        [['1', '每个值都有主人', 'Every value has an owner'], ['2', '同一时刻只有一个主人', 'One owner at a time'], ['3', '主人走了，值就被清理', 'Owner leaves, value is dropped']]
          .forEach(([n, z, e], i) => H(`<div class="r card" data-cap="${i < 2 ? 0 : 1}" data-delay="${i === 1 ? 0.6 : 0}" style="left:0;right:0;top:${30 + i * 160}px;height:130px;display:flex;align-items:center;gap:30px;padding:0 40px">
            <div class="mono acc" style="font-size:52px;font-weight:800">${n}</div><div style="font-size:38px;font-weight:700">${T(z, e)}</div></div>`));
        H(`<div class="r center" data-cap="1" data-delay="0.8" data-in="pop" style="left:0;right:0;top:560px;height:160px">
          <div class="card center" style="padding:24px 50px;border-color:var(--acc);font-size:44px;font-weight:800">${T('一个值 · 一个<span class="acc">主人</span>', 'One value · one <span class="acc">owner</span>')}</div></div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['下期，咱们聊聊三个词：', "Next time, three words you'll see everywhere:"],
            ['Move、Clone 和 Copy。', 'Move, Clone and Copy.'],
            ['关注我，一起学！', 'Follow along and learn with me!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 7 课 · Lesson 7', 'Lesson 7')}</div>
          <div class="h" style="font-size:64px;margin-top:30px">Move · Clone · Copy</div>
          <div class="s" style="font-size:40px;margin-top:20px">${T('有什么区别？', "What's the difference?")}</div>
          <div class="mono acc" style="font-size:32px;margin-top:40px">let s2 = s1.clone();</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{"zh": "考考你：这段代码能编译吗？", "en": "Quick quiz: does this code compile?", "say_zh": "考考你：这段代码能编译吗？", "say_en": "Quick quiz: does this code compile?"},
            {"zh": "能，还是不能？评论区告诉我。", "en": "Yes or no? Tell me in the comments.", "say_zh": "能，还是不能？评论区告诉我。", "say_en": "Yes or no? Tell me in the comments."}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:30px 40px;font-size:38px;line-height:1.8">${code(`let s1 = String::from("hi");
let s2 = s1;
println!("{}", s1);`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:374px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T("能", "Yes")}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T("不能", "No")}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:574px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
