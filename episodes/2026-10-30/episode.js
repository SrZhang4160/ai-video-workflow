// 第 7 课 · Move、Clone、Copy 有什么区别
window.EPISODE = {
  n: 7,
  scenes: [
    { title: ['Move、Clone、Copy', 'Move, Clone, Copy'],
      cap: [{zh: '同样是 let b = a，', en: 'Same line: let b = a.', say_zh: '同样是 let b 等于 a，', say_en: 'Same line: let b equals a.'},
            ['为什么有时 a 就不能用了？', 'So why is a sometimes unusable afterwards?']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 36px;font-size:32px;line-height:1.7">${code(`let a = 5;
let b = a;
println!("{a}");   // ${T('没问题', 'fine')}`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.8" data-in="stamp" style="left:820px;top:60px">${icon('check', 90, 'var(--acc2)')}</div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:270px;padding:26px 36px;font-size:32px;line-height:1.7;border-color:var(--red)">${code(`let a = String::from("hi");
let b = a;
println!("{a}");   // ${T('报错', 'error')}`)}</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.8" data-in="stamp" data-shake="1" style="left:820px;top:310px">${icon('cross', 90, 'var(--red)')}</div>`);
        H(`<div class="r center" data-cap="1" data-delay="1.6" data-in="pop" style="left:0;right:0;top:560px;gap:30px">
          <span class="card mono acc center" style="width:260px;height:120px;font-size:44px;font-weight:800">Move</span>
          <span class="card mono blue center" style="width:260px;height:120px;font-size:44px;font-weight:800">Clone</span>
          <span class="card mono ok center" style="width:260px;height:120px;font-size:44px;font-weight:800">Copy</span></div>`);
      } },

    { title: ['Move：所有权搬走了', 'Move: ownership moves'],
      cap: [['像 String 这种堆上的数据，', 'For heap data like a String,'],
            {zh: '赋值时，所有权直接搬给 s2。', en: 'assignment moves ownership to s2.', say_zh: '赋值时，所有权直接搬给 S二。', say_en: 'assignment moves ownership to S two.'},
            {zh: 's1 作废，再用就编译报错。', en: 's1 is now invalid. Using it is a compile error.', say_zh: 'S一 就作废了，再用就编译报错。', say_en: 'S one is now invalid. Using it is a compile error.'}],
      build() {
        const box = (x, y, t, c, dash) => `<div class="r card mono center" style="left:${x}px;top:${y}px;width:200px;height:100px;font-size:38px;border-color:${c};color:${c};${dash ? 'border-style:dashed' : ''}">${t}</div>`;
        H(`<div class="r card" data-cap="0" style="left:0;right:0;top:20px;height:420px">
          <div class="r s" style="left:40px;top:20px">${B('栈', 'Stack', 28)}</div>
          <div class="r s" style="left:640px;top:20px">${B('堆', 'Heap', 28)}</div>
          ${box(40, 90, 's1', 'var(--acc2)')}
          ${box(640, 160, '"hi"', 'var(--yel)')}
          <svg class="r" style="left:0;top:0" width="960" height="420"><line x1="240" y1="140" x2="630" y2="200" stroke="#8B93A3" stroke-width="4" marker-end="url(#ah)"/>
            <defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8B93A3"/></marker></defs></svg></div>`);
        H(`<div class="r" data-cap="1" data-in="left" style="left:40px;top:270px">${box(0, 0, 's2', 'var(--acc)')}</div>`);
        H(`<svg class="r" data-cap="1" data-delay="0.5" style="left:0;top:20px" width="960" height="420"><line x1="240" y1="300" x2="630" y2="230" stroke="#FF8A4C" stroke-width="5" marker-end="url(#ah2)"/>
          <defs><marker id="ah2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#FF8A4C"/></marker></defs></svg>`);
        H(`<div class="r" data-cap="2" data-in="stamp" style="left:200px;top:80px">${icon('cross', 70, 'var(--red)')}</div>`);
        H(`<div class="r card mono" data-cap="2" data-delay="0.6" data-shake="1" style="left:0;right:0;top:480px;padding:26px 36px;font-size:30px;line-height:1.7;border-color:var(--red)">
          <div>${code(`println!("{s1}");`)}</div>
          <div class="red" style="font-weight:800">error[E0382]: borrow of moved value: \`s1\`</div></div>`);
      } },

    { title: ['Clone：手动复制一份', 'Clone: copy it on purpose'],
      cap: [{zh: '两个都要？调用 .clone()。', en: 'Want both? Call .clone().', say_zh: '两个都要？那就调用 clone。', say_en: 'Want both? Call clone.'},
            ['堆上的数据会完整复制一份，', 'The heap data gets copied in full.'],
            ['代价是：数据越大，越慢。', 'The cost: the bigger the data, the slower.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 36px;font-size:32px;line-height:1.7">${code(`let s1 = String::from("hi");
let s2 = s1.clone();
println!("{s1} {s2}");   // hi hi`)}</div>`);
        const box = (x, y, t, c) => `<div class="r card mono center" style="left:${x}px;top:${y}px;width:200px;height:100px;font-size:38px;border-color:${c};color:${c}">${t}</div>`;
        H(`<div class="r card" data-cap="1" style="left:0;right:0;top:270px;height:380px">
          <div class="r s" style="left:40px;top:16px">${B('栈', 'Stack', 28)}</div>
          <div class="r s" style="left:640px;top:16px">${B('堆', 'Heap', 28)}</div>
          ${box(40, 80, 's1', 'var(--acc2)')}${box(640, 80, '"hi"', 'var(--yel)')}
          <div class="r mono q" style="left:340px;top:100px;font-size:48px">→</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="0.6" data-in="drop" style="left:0;top:270px;width:960px;height:380px">
          ${box(40, 240, 's2', 'var(--blue)')}${box(640, 240, '"hi"', 'var(--yel)')}
          <div class="r mono blue" style="left:340px;top:260px;font-size:48px">→</div></div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:700px;text-align:center"><span class="chip">${T('显式写出来', 'explicit')}</span><span class="chip red" style="border-color:var(--red)">${T('可能很贵', 'can be costly')}</span></div>`);
      } },

    { title: ['Copy：自动复制', 'Copy: copied automatically'],
      cap: [['那整数为什么还能用？', 'So why does the integer still work?'],
            {zh: 'i32 只在栈上，实现了 Copy，', en: 'i32 lives only on the stack and implements Copy,', say_zh: 'i三十二 只在栈上，实现了 Copy，', say_en: 'i thirty-two lives only on the stack and implements Copy,'},
            ['赋值时自动复制，a 照样能用。', 'so assignment copies it, and a still works.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 36px;font-size:34px;line-height:1.7">${code(`let a = 5;          // i32
let b = a;
println!("{a} {b}"); // 5 5`)}</div>`);
        H(`<div class="r card" data-cap="1" style="left:0;right:0;top:290px;height:360px">
          <div class="r s" style="left:40px;top:16px">${B('全在栈上', 'All on the stack', 28)}</div>
          <div class="r card mono center" style="left:120px;top:110px;width:240px;height:150px;font-size:44px;border-color:var(--acc2)">a = 5</div></div>`);
        H(`<div class="r card mono center" data-cap="2" data-in="right" style="left:600px;top:400px;width:240px;height:150px;font-size:44px;border-color:var(--acc2);color:var(--acc2)">b = 5</div>`);
        H(`<div class="r mono acc" data-cap="2" data-delay="0.4" data-in="pop" style="left:440px;top:430px;font-size:60px">→</div>`);
        H(`<div class="r" data-cap="2" data-delay="1.0" data-in="stamp" style="left:300px;top:370px">${icon('check', 70, 'var(--acc2)')}</div>`);
      } },

    { title: ['Move 和 Copy 的真区别', 'Move vs Copy, really'],
      cap: [['Move 和 Copy，底层都一样：', 'Under the hood, Move and Copy are the same:'],
            ['都是把栈上的字节复制一份。', 'both copy the bytes on the stack.'],
            ['区别只在：旧变量还能不能用。', 'The only difference: is the old one still usable?']],
      build() {
        const lane = (y, name, color, ok, cap) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:250px;border-color:${color}">
          <div class="r mono" style="left:36px;top:24px;font-size:40px;font-weight:800;color:${color}">${name}</div>
          <div class="r card mono center" style="left:60px;top:100px;width:200px;height:110px;font-size:40px;${ok ? '' : 'border-style:dashed;color:var(--quiet)'}">a</div>
          <div class="r center" style="left:280px;top:100px;width:380px;height:110px;flex-direction:column"><div class="mono" style="font-size:48px;color:${color}">→</div><div class="s" style="font-size:26px">${T('复制字节', 'copy bytes')}</div></div>
          <div class="r card mono center" style="left:680px;top:100px;width:200px;height:110px;font-size:40px;border-color:${color}">b</div></div>`;
        H(lane(20, 'Move', 'var(--acc)', false, 1));
        H(lane(310, 'Copy', 'var(--acc2)', true, 1));
        H(`<div class="r" data-cap="2" data-in="stamp" style="left:225px;top:95px">${icon('cross', 70, 'var(--red)')}</div>`);
        H(`<div class="r" data-cap="2" data-delay="0.6" data-in="stamp" style="left:225px;top:385px">${icon('check', 70, 'var(--acc2)')}</div>`);
        H(`<div class="r" data-cap="2" data-delay="1.2" style="left:0;right:0;top:610px;text-align:center"><span class="chip">${T('旧变量：作废 vs 照常可用', 'old variable: gone vs still usable')}</span></div>`);
      } },

    { title: ['哪些类型是 Copy？', 'Which types are Copy?'],
      cap: [{zh: '整数、浮点、布尔、字符都是 Copy', en: 'Integers, floats, bool and char are Copy.', say_zh: '整数、浮点数、布尔、字符，都是 Copy。'},
            ['String 管着堆内存，就不是。', "String owns heap memory, so it isn't."],
            {zh: '自定义类型也能 derive。', en: 'Your own types can derive it too.', say_zh: '自定义类型，也能 derive 出 Copy。'}],
      build() {
        const chip = (t, c) => `<span class="mono" style="display:inline-block;margin:8px;padding:8px 18px;border:2px solid ${c};border-radius:12px;color:${c};font-size:30px">${esc(t)}</span>`;
        H(`<div class="r card" data-cap="0" style="left:0;width:465px;top:20px;height:400px;padding:24px">
          <div class="h" style="font-size:34px">${icon('check', 36, 'var(--acc2)')} Copy</div>
          <div style="margin-top:20px">${['i32', 'u64', 'f64', 'bool', 'char', '(i32, bool)'].map(t => chip(t, 'var(--acc2)')).join('')}</div></div>`);
        H(`<div class="r card" data-cap="1" style="left:495px;width:465px;top:20px;height:400px;padding:24px">
          <div class="h" style="font-size:34px">${icon('cross', 36, 'var(--red)')} ${T('不是 Copy', 'Not Copy')}</div>
          <div style="margin-top:20px">${['String', 'Vec<T>', 'Box<T>'].map(t => chip(t, 'var(--red)')).join('')}</div>
          <div class="s" style="margin-top:16px">${T('管着堆内存', 'own heap memory')}</div></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:460px;padding:26px 36px;font-size:32px;line-height:1.7">${code(`#[derive(Clone, Copy)]
struct Point { x: i32, y: i32 }`)}
          <div class="s" style="font-family:'Noto Sans SC';margin-top:6px">${T('条件：每个字段 / 元素都是 Copy（元组、数组同理）', 'Rule: every field or element must be Copy (tuples and arrays too)')}</div></div>`);
      } },

    { title: ['一张表记住', 'Remember it in one table'],
      cap: [['Move 搬走所有权，旧的作废；', 'Move hands over ownership; the old one is gone.'],
            ['Clone 手动复制一份，可能很贵；', 'Clone makes an explicit copy, maybe costly.'],
            ['Copy 自动复制，旧的照样能用。', 'Copy is automatic; the old one still works.']],
      build() {
        const cols = 'grid-template-columns:190px 1fr 210px 170px';
        const row = (y, k, c, how, ok, cost, cap) => `<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:150px;display:grid;${cols};align-items:center;padding:0 30px;gap:10px">
          <div class="mono" style="font-size:38px;font-weight:800;color:${c}">${k}</div><div class="mono" style="font-size:30px">${how}</div><div style="font-size:40px">${ok}</div><div style="font-size:30px">${cost}</div></div>`;
        H(`<div class="r s" data-cap="0" style="left:0;right:0;top:20px;display:grid;${cols};padding:0 30px;gap:10px;font-size:26px"><span></span><span>${T('写法', 'How')}</span><span>${T('a 还能用？', 'a usable?')}</span><span>${T('成本', 'Cost')}</span></div>`);
        H(row(70, 'Move', 'var(--acc)', 'let b = a;', '<span class="red">✗</span>', T('低', 'low'), 0));
        H(row(240, 'Clone', 'var(--blue)', 'a.clone()', '<span class="ok">✓</span>', `<span class="red">${T('可能高', 'can be high')}</span>`, 1));
        H(row(410, 'Copy', 'var(--acc2)', 'let b = a;', '<span class="ok">✓</span>', T('低', 'low'), 2));
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [['不想复制，又想用？那就借。', "No copy, but still need it? Borrow it."],
            {zh: '下期聊借用：& 和 &mut。', en: 'Next time: borrowing, & and &mut.', say_zh: '下期聊借用：不可变引用和可变引用。', say_en: 'Next time: borrowing, ampersand and ampersand mut.'},
            ['关注我，一起学！', 'Follow along and learn with me!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 8 课 · Lesson 8', 'Lesson 8')}</div>
          <div class="h" style="font-size:84px;margin-top:30px">${T('借用', 'Borrowing')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:40px;margin-top:10px">Borrowing</div>' : ''}
          <div class="mono acc" style="font-size:40px;margin-top:40px">&amp;T · &amp;mut T</div></div>`);
      } },
  ],
};
