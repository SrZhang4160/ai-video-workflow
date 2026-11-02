// 第 16 课 · 泛型：一份代码，多种类型
window.EPISODE = {
  n: 16,
  scenes: [
    { title: ['每种类型抄一遍？', 'One copy per type?'],
      cap: [['同样的逻辑，每种类型都要抄一遍？', 'Same logic, copied again for every type?'],
            ['用泛型，一份代码就够了。', 'With generics, one copy is enough.']],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="left" style="left:0;right:0;top:20px;padding:26px 40px;font-size:32px;line-height:1.7">${code(`fn max_i32(a: i32, b: i32) -> i32 {
    if a > b { a } else { b }
}`)}</div>`);
        H(`<div class="r card mono" data-cap="0" data-delay="1.0" data-in="right" style="left:0;right:0;top:250px;padding:26px 40px;font-size:32px;line-height:1.7;border-style:dashed">${code(`fn max_f64(a: f64, b: f64) -> f64 {
    if a > b { a } else { b }
}`)}</div>`);
        H(`<div class="r mono red" data-cap="0" data-delay="1.8" data-in="stamp" style="left:780px;top:470px;font-size:56px;font-weight:800">×2</div>`);
        H(`<div class="r card center" data-cap="1" data-in="pop" style="left:120px;right:120px;top:580px;height:150px;gap:24px;border-color:var(--acc)">
          <span class="mono acc" style="font-size:48px;font-weight:800">fn max&lt;T&gt;</span><span class="h" style="font-size:40px">${T('写一次', 'once')}</span></div>`);
      } },

    { title: ['尖括号里的 T', 'The T in angle brackets'],
      cap: [{zh: '在函数名后面加上 <T>，', en: 'Put <T> after the function name.', say_zh: '在函数名后面，加上尖括号 T，', say_en: 'Put angle bracket T after the function name.'},
            {zh: 'T 叫类型参数，代表“某个类型”。', en: 'T is a type parameter: it stands for "some type".', say_zh: '这个 T 叫类型参数，代表某个类型。'},
            {zh: '调用时，编译器自己推出 T 是谁。', en: 'When you call it, the compiler infers what T is.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:36px;line-height:1.75">${code(`fn swap<T>(a: T, b: T) -> (T, T) {
    (b, a)
}`)}</div>`);
        H(`<div class="r" data-cap="1" data-in="pop" style="left:0;right:0;top:270px;text-align:center"><span class="chip" style="font-size:30px;border-color:var(--acc)"><span class="mono acc">T</span> = ${T('类型参数 · type parameter', 'a type parameter')}</span></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:390px;padding:28px 40px;font-size:34px;line-height:1.9;border-color:var(--acc2)">${code(`swap(1, 2);       // T = i32
swap("a", "b");   // T = &str
swap(1.5, 2.5);   // T = f64`)}</div>`);
      } },

    { title: ['T 能比大小吗？', 'Can T be compared?'],
      cap: [{zh: '回到比大小：直接写 a > b？', en: 'Back to max: can we just write a > b?', say_zh: '回到比大小：直接写 a 大于 b？', say_en: 'Back to max: can we just write a greater than b?'},
            {zh: '编译不过：T 不一定能比较。', en: "It won't compile: T might not be comparable.", say_zh: '编译不过：T 不一定能比较。'},
            {zh: '加上约束 T: PartialOrd 就行。', en: 'Add the bound T: PartialOrd and it works.', say_zh: '加上约束，T 冒号 Partial Ord，就行了。', say_en: 'Add the bound T colon PartialOrd, and it works.'},
            {zh: '这就是上期 trait 的用处。', en: "That's what last lesson's traits are for.", say_zh: '这就是上期讲的特征的用处。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:24px 40px;font-size:30px;line-height:1.7">${code(`fn max<T>(a: T, b: T) -> T {
    if a > b { a } else { b }
}`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:230px;padding:20px 40px;font-size:26px;line-height:1.6;border-color:var(--red)">
          <div class="red" style="font-weight:800">error[E0369]: binary operation \`&gt;\`</div>
          <div class="red" style="font-weight:800">cannot be applied to type \`T\`</div></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:400px;padding:24px 40px;font-size:30px;line-height:1.7;border-color:var(--acc2)">${code(`fn max<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}
max(3, 7);      // 7
max(1.5, 0.5);  // 1.5`)}</div>`);
        H(`<div class="r" data-cap="3" data-in="pop" style="left:0;right:0;top:750px;text-align:center"><span class="chip" style="border-color:var(--acc)">${T('trait 约束 = T 必须会做的事', 'trait bound = what T must be able to do')}</span></div>`);
      } },

    { title: ['泛型会变慢吗？', 'Are generics slow?'],
      cap: [['泛型会不会拖慢速度？不会。', 'Do generics slow your code down? No.'],
            ['编译时，每种用到的类型各生成一份。', 'At compile time, Rust makes a copy for each type you use.'],
            ['所以跑起来和手写的一样快。', 'So it runs as fast as hand-written code.']],
      build() {
        H(`<div class="r card mono center" data-cap="0" data-in="drop" style="left:250px;width:460px;top:30px;height:120px;font-size:40px;font-weight:800;border-color:var(--acc);color:var(--acc)">max&lt;T&gt;</div>`);
        H(`<svg class="r" data-cap="1" style="left:0;top:160px" width="960" height="140" viewBox="0 0 960 140">
          <path d="M290 0 L240 112" stroke="var(--quiet)" stroke-width="4" fill="none"/><path d="M670 0 L720 112" stroke="var(--quiet)" stroke-width="4" fill="none"/>
          <polygon points="236,128 228,106 250,112" fill="var(--quiet)"/><polygon points="724,128 710,112 732,106" fill="var(--quiet)"/>
          <text x="480" y="80" text-anchor="middle" font-family="Noto Sans SC" font-size="24" fill="var(--quiet)">${T('编译时 · 单态化', 'compile time · monomorphization')}</text></svg>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="0.6" data-in="left" style="left:40px;width:400px;top:310px;height:120px;font-size:36px;color:var(--acc2);border-color:var(--acc2)">max::&lt;i32&gt;</div>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="1.0" data-in="right" style="left:520px;width:400px;top:310px;height:120px;font-size:36px;color:var(--blue);border-color:var(--blue)">max::&lt;f64&gt;</div>`);
        H(`<div class="r card center" data-cap="2" data-in="stamp" style="left:120px;right:120px;top:520px;height:150px;gap:20px;border-color:var(--acc2)">
          ${icon('rocket', 56, 'var(--acc2)')}<span class="h" style="font-size:40px">${T('运行时零额外开销', 'no extra runtime cost')}</span></div>`);
      } },

    { title: ['你早就用过泛型', "You've used generics"],
      cap: [{zh: '其实 Option<T>、Vec<T> 都是泛型。', en: "Option<T> and Vec<T> are already generic.", say_zh: '其实 Option 和 Vec，早就是泛型。', say_en: 'Option of T and Vec of T are already generic.'},
            ['自己的结构体也能这么写。', 'Your own structs can be generic too.']],
      build() {
        H(`<div class="r" data-cap="0" style="left:0;right:0;top:30px;display:flex;gap:24px;justify-content:center">
          <div class="card mono center" style="width:440px;height:130px;font-size:36px;color:var(--acc2)">Option&lt;f64&gt;</div>
          <div class="card mono center" style="width:440px;height:130px;font-size:36px;color:var(--blue)">Vec&lt;String&gt;</div></div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:230px;padding:28px 40px;font-size:30px;line-height:1.75;border-color:var(--acc)">${code(`struct Point<T> {
    x: T,
    y: T,
}
let a = Point { x: 1, y: 2 };     // T = i32
let b = Point { x: 1.5, y: 2.5 }; // T = f64`)}</div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [{zh: '总结：<T> 声明类型参数，', en: 'To recap: <T> declares a type parameter,', say_zh: '总结一下：尖括号 T，声明类型参数，', say_en: 'To recap: angle bracket T declares a type parameter,'},
            {zh: 'trait 约束规定 T 能做什么，', en: 'a trait bound says what T can do,', say_zh: '特征约束，规定 T 能做什么，'},
            ['编译时展开，没有额外开销。', 'and it expands at compile time, with no extra cost.']],
      build() {
        const row = (y, k, z, e, c, cap) => H(`<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:160px;display:grid;grid-template-columns:360px 1fr;align-items:center;padding:0 36px;gap:16px">
          <div class="mono" style="font-size:38px;font-weight:800;color:${c}">${k}</div><div style="font-size:32px">${T(z, e)}</div></div>`);
        row(30, '&lt;T&gt;', '声明类型参数', 'declare a type parameter', 'var(--acc)', 0);
        row(220, 'T: PartialOrd', 'trait 约束：T 能做什么', 'trait bound: what T can do', 'var(--blue)', 1);
        row(410, 'max::&lt;i32&gt;', '编译时展开，零额外开销', 'expanded at compile time, no extra cost', 'var(--acc2)', 2);
        H(`<div class="r card center" data-cap="2" data-delay="1.0" data-in="pop" style="left:120px;right:120px;top:620px;height:130px;border-color:var(--acc);font-size:40px;font-weight:800">${T('一份代码，多种类型', 'One code, many types')}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: "下期：尖括号里还能放 'a，", en: "Next time: angle brackets can also hold 'a,", say_zh: '下期：尖括号里还能放生命周期，', say_en: 'Next time: angle brackets can also hold a lifetime, tick a,'},
            ['它是什么意思？下期见！', 'What does it mean? See you next time!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 17 课 · Lesson 17', 'Lesson 17')}</div>
          <div class="h" style="font-size:72px;margin-top:30px">${T('生命周期入门', 'Lifetimes 101')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:40px;margin-top:10px">Lifetimes 101</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">fn longest&lt;'a&gt;(...)</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：这段代码能编译吗？', en: 'Quick quiz: does this code compile?'},
            {zh: '能，还是不能？评论区告诉我。', en: 'Yes or no? Tell me in the comments.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:30px 40px;font-size:38px;line-height:1.8">${code(`fn show<T>(x: T) {
    println!("{}", x);
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:330px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('能', 'Yes')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('不能', 'No')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:530px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
