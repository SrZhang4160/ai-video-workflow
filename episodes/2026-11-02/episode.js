// 第 10 课 · struct + impl：给数据加方法
window.EPISODE = {
  n: 10,
  scenes: [
    { title: ['方法写在哪？', 'Where do methods go?'],
      cap: [{zh: 'Rust 没有 class，方法写哪？', en: 'Rust has no classes. So where do methods go?', say_zh: 'Rust 没有类，那方法写在哪？'},
            {zh: 'struct 放数据，impl 放方法。', en: 'A struct holds the data. An impl block holds the methods.',
             say_zh: '结构体放数据，实现块放方法。', say_en: 'A struct holds the data. An implementation block holds the methods.'},
            ['一分钟把这两个讲清楚。', "Let's sort out both in one minute."]],
      build() {
        H(`<div class="r card mono center" data-cap="0" style="left:180px;right:180px;top:60px;height:150px;font-size:56px;font-weight:800;color:var(--quiet);border-style:dashed;text-decoration:line-through">class</div>`);
        H(`<div class="r mono" data-cap="0" data-delay="0.8" data-in="pop" style="left:440px;top:230px;font-size:100px;font-weight:800;color:var(--yel)">?</div>`);
        H(`<div class="r card" data-cap="1" data-in="left" style="left:0;top:420px;width:450px;height:260px;text-align:center;padding-top:44px;border-color:var(--acc2)">
          <div class="mono ok" style="font-size:60px;font-weight:800">struct</div>
          <div class="h" style="margin-top:24px">${B('数据', 'Data')}</div></div>`);
        H(`<div class="r card" data-cap="1" data-delay="0.6" data-in="right" style="left:510px;top:420px;width:450px;height:260px;text-align:center;padding-top:44px;border-color:var(--acc)">
          <div class="mono acc" style="font-size:60px;font-weight:800">impl</div>
          <div class="h" style="margin-top:24px">${B('方法', 'Methods')}</div></div>`);
        H(`<div class="r mono h acc" data-cap="1" data-delay="1.0" data-in="pop" style="left:456px;top:510px;font-size:52px">+</div>`);
      } },

    { title: ['struct：定义数据', 'struct: define the data'],
      cap: [{zh: '先用 struct 定义数据：', en: 'First, define the data with a struct:', say_zh: '先用结构体定义数据：'},
            ['一个矩形，有宽 w 和高 h。', 'a rectangle with a width w and a height h.'],
            ['用点号就能读字段。', 'Use a dot to read a field.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:34px;line-height:1.7">${code(`struct Rect {
    w: u32,   // ${T('宽', 'width')}
    h: u32,   // ${T('高', 'height')}
}
let r = Rect { w: 3, h: 4 };
println!("{}", r.w); // 3`)}</div>`);
        H(`<div class="r card" data-cap="1" data-in="pop" style="left:280px;top:470px;width:400px;height:250px;border-color:var(--acc2);padding:22px 30px">
          <div class="s" style="margin-bottom:10px">r · Rect</div>
          <div class="mono" style="font-size:36px;line-height:1.7">w: <span class="nu">3</span><br>h: <span class="nu">4</span></div></div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:760px;text-align:center"><span class="chip">r.w → 3</span><span class="chip">r.h → 4</span></div>`);
      } },

    { title: ['impl：给它加方法', 'impl: add a method'],
      cap: [{zh: '再写 impl Rect，把方法放进去。', en: 'Then write impl Rect and put methods inside.',
             say_zh: '再给 Rect 写一个实现块，把方法放进去。', say_en: 'Then write an implementation block for Rect, and put methods inside.'},
            {zh: '第一个参数 &self，借用它自己。', en: 'The first parameter, &self, borrows the value itself.',
             say_zh: '第一个参数，是对它自己的借用。', say_en: 'The first parameter, ampersand self, borrows the value itself.'},
            {zh: '调用写 r.area()，得到 12。', en: 'Call it as r.area(), and you get 12.',
             say_zh: '调用的时候写 r 点 area，得到十二。', say_en: 'Call it as r dot area, and you get twelve.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:34px;line-height:1.7;border-color:var(--acc)">${code(`impl Rect {
    fn area(&self) -> u32 {
        self.w * self.h
    }
}`)}</div>`);
        H(`<div class="r card center" data-cap="1" data-in="pop" style="left:0;width:440px;top:400px;height:150px;flex-direction:column;gap:6px;border-color:var(--blue)">
          <div class="mono blue" style="font-size:44px;font-weight:800">&amp;self</div><div class="s">${T('= 借用 r 本身', '= borrows r itself')}</div></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:600px;padding:26px 40px;font-size:34px;line-height:1.7">${code(`println!("{}", r.area()); // 12`)}</div>`);
        H(`<div class="r card mono center" data-cap="2" data-delay="0.8" data-in="stamp" style="left:500px;width:460px;top:400px;height:150px;font-size:40px;color:var(--acc2);border-color:var(--acc2)">3 × 4 = 12</div>`);
      } },

    { title: ['self 的三种写法', 'Three kinds of self'],
      cap: [{zh: 'self 有三种写法，对应前几课：', en: 'self comes in three forms, matching earlier lessons:',
             say_zh: '第一个参数有三种写法，对应前几课：'},
            {zh: '&self 只读，&mut self 能改，', en: '&self only reads, &mut self can modify,',
             say_zh: '不可变借用只能读，可变借用能修改，', say_en: 'ampersand self only reads, a mutable borrow of self can modify,'},
            {zh: '只写 self，就拿走所有权。', en: 'and plain self takes ownership.', say_zh: '不加引用，就直接拿走所有权。'}],
      build() {
        const row = (y, sig, z, e, c, cap) => H(`<div class="r card" data-cap="${cap}" data-in="left" style="left:0;right:0;top:${y}px;height:160px;display:grid;grid-template-columns:360px 1fr;align-items:center;padding:0 40px;border-color:${c}">
          <div class="mono" style="font-size:44px;font-weight:800;color:${c}">${sig}</div><div style="font-size:32px;font-weight:700">${T(z, e)}</div></div>`);
        row(40, '&amp;self', '只读 · 不可变借用', 'read only · shared borrow', 'var(--blue)', 1);
        row(230, '&amp;mut self', '能改字段 · 需 let mut r', 'can modify · needs let mut r', 'var(--acc)', 1);
        row(420, 'self', '拿走所有权', 'takes ownership', 'var(--red)', 2);
        H(`<div class="r s" data-cap="2" data-delay="0.8" style="left:0;right:0;top:640px;text-align:center">${T('最常用的是 &amp;self', '&amp;self is the most common')}</div>`);
      } },

    { title: ['没有 self：关联函数', 'No self: associated functions'],
      cap: [{zh: '不带 self 的不是方法，是关联函数。', en: 'Without self, it is not a method but an associated function.', say_zh: '不带这个参数的，不是方法，是关联函数。'},
            {zh: '最常见的是 new，用来创建实例，', en: 'The most common one is new, which builds a value.', say_zh: '最常见的是 new，用来创建实例，'},
            {zh: '用双冒号调用：Rect::new。', en: 'Call it with two colons: Rect::new.',
             say_zh: '用两个冒号来调用。', say_en: 'Call it with two colons: Rect, colon colon, new.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:34px;line-height:1.7">${code(`impl Rect {
    fn new(w: u32, h: u32) -> Self {
        Self { w, h }  // Self = Rect
    }
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:400px;text-align:center"><span class="chip">${T('new 只是惯例，不是关键字', 'new is a convention, not a keyword')}</span></div>`);
        H(`<div class="r card mono center" data-cap="2" data-in="pop" style="left:0;right:0;top:520px;height:150px;font-size:44px;border-color:var(--acc)">let r = Rect<span class="acc" style="font-weight:800">::</span>new(3, 4);</div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [{zh: '总结：struct 管数据，impl 管方法；', en: 'To sum up: struct holds data, impl holds methods.',
             say_zh: '总结：结构体管数据，实现块管方法；', say_en: 'To sum up: the struct holds data, the implementation block holds methods.'},
            {zh: '有 self 用点调用，没有就用 ::。', en: 'Has self? Use a dot. No self? Use ::',
             say_zh: '第一个参数是自身的，用点来调用；没有，就用两个冒号。', say_en: 'Has self? Use a dot. No self? Use two colons.'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="left" style="left:0;top:20px;width:440px;height:400px;padding:30px 34px;border-color:var(--acc2)">
          <div class="mono ok" style="font-size:44px;font-weight:800">struct Rect</div>
          <div class="s" style="margin-top:6px">${T('数据', 'data')}</div>
          <div class="mono" style="font-size:36px;line-height:1.8;margin-top:20px">w: u32<br>h: u32</div></div>`);
        H(`<div class="r card" data-cap="0" data-delay="0.6" data-in="right" style="left:520px;top:20px;width:440px;height:400px;padding:30px 34px;border-color:var(--acc)">
          <div class="mono acc" style="font-size:44px;font-weight:800">impl Rect</div>
          <div class="s" style="margin-top:6px">${T('方法', 'methods')}</div>
          <div class="mono" style="font-size:36px;line-height:1.8;margin-top:20px">new()<br>area(&amp;self)</div></div>`);
        H(`<div class="r mono h acc" data-cap="0" data-delay="1.0" data-in="pop" style="left:462px;top:180px;font-size:52px">+</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:470px;display:flex;gap:40px">
          <div class="card" style="flex:1;height:200px;text-align:center;padding-top:36px"><div class="mono" style="font-size:40px;font-weight:800">r<span class="acc">.</span>area()</div><div class="s" style="margin-top:18px">${T('有 self：方法', 'has self: method')}</div></div>
          <div class="card" style="flex:1;height:200px;text-align:center;padding-top:36px"><div class="mono" style="font-size:40px;font-weight:800">Rect<span class="acc">::</span>new()</div><div class="s" style="margin-top:18px">${T('没 self：不是方法', 'no self: not a method')}</div></div></div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期：enum 加 match，', en: 'Next time: enum and match,', say_zh: '下期：枚举加模式匹配，', say_en: 'Next time: enums and match,'},
            ['一种情况都不能漏。关注我，一起学！', 'and every case must be handled. Follow along!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 11 课 · Lesson 11', 'Lesson 11')}</div>
          <div class="h" style="font-size:72px;margin-top:30px">enum + match</div>
          <div class="s" style="font-size:40px;margin-top:10px">${T('穷尽所有情况', 'Handle every case')}</div>
          <div class="mono acc" style="font-size:32px;margin-top:40px">enum · match · _ =&gt;</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：这段代码能编译吗？', en: 'Quick quiz: does this code compile?', say_zh: '考考你：这段代码能编译吗？', say_en: 'Quick quiz: does this code compile?'},
            {zh: '能，还是不能？评论区告诉我。', en: 'Yes or no? Tell me in the comments.', say_zh: '能，还是不能？评论区告诉我。', say_en: 'Yes or no? Tell me in the comments.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:20px;padding:26px 40px;font-size:34px;line-height:1.65">${code(`struct Counter { n: u32 }
impl Counter {
    fn inc(&self) {
        self.n += 1;
    }
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:460px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('能', 'Yes')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('不能', 'No')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:660px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
