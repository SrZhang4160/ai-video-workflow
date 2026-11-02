// 第 15 课 · trait：定义共同行为
window.EPISODE = {
  n: 15,
  scenes: [
    { title: ['trait：定义共同行为', 'Traits: shared behavior'],
      cap: [['狗和猫都会叫，', 'A dog and a cat can both speak.'],
            ['一个函数，怎么同时收下它俩？', 'How can one function take them both?'],
            {zh: '答案就是 trait（特征）。', en: 'The answer is a trait.', say_zh: '答案就是特征。'}],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="left" style="left:40px;top:60px;width:400px;height:200px;flex-direction:column;gap:8px;border-color:var(--blue)">
          <div class="mono ty" style="font-size:56px;font-weight:800">Dog</div><div class="mono st" style="font-size:34px">"Woof"</div></div>`);
        H(`<div class="r card center" data-cap="0" data-delay="0.6" data-in="right" style="left:520px;top:60px;width:400px;height:200px;flex-direction:column;gap:8px;border-color:var(--blue)">
          <div class="mono ty" style="font-size:56px;font-weight:800">Cat</div><div class="mono st" style="font-size:34px">"Meow"</div></div>`);
        H(`<div class="r card mono center" data-cap="1" style="left:230px;top:380px;width:500px;height:140px;font-size:44px;border-color:var(--acc)">greet( <span class="yel">?</span> )</div>`);
        H(`<div class="r center" data-cap="2" data-in="stamp" style="left:0;right:0;top:600px;flex-direction:column;gap:8px">
          <div class="h" style="font-size:72px"><span class="acc mono">trait</span></div>
          <div class="s">${T('一份共同的行为清单', 'a shared list of behaviors')}</div></div>`);
      } },

    { title: ['定义：只写签名', 'Define it: just the signature'],
      cap: [{zh: 'trait 就是一份行为清单。', en: 'A trait is a list of behaviors.', say_zh: '特征就是一份行为清单。'},
            ['这里只写方法签名，不写方法体。', 'Only the signature here, no body.'],
            ['谁实现它，谁就得有 speak。', 'Any type that implements it must have speak.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:34px 44px;font-size:38px;line-height:1.8">${code(`trait Speak {
    fn speak(&self) -> String;
}`)}</div>`);
        H(`<div class="r mono acc" data-cap="1" data-in="pop" style="left:560px;top:330px;font-size:56px">↑</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.3" style="left:0;right:0;top:420px;text-align:center"><span class="chip">${T('只有签名，以分号结尾', 'signature only, ends with ;')}</span></div>`);
        H(`<div class="r card center" data-cap="2" data-in="pop" style="left:120px;right:120px;top:560px;height:150px;gap:20px;border-color:var(--acc2)">
          ${icon('check', 50, 'var(--acc2)')}<span class="h" style="font-size:36px">${T('实现 Speak = 必须有 speak', 'implements Speak = has speak')}</span></div>`);
      } },

    { title: ['实现：impl … for 类型', 'Implement: impl … for Type'],
      cap: [{zh: '写 impl Speak for Dog，写出 speak。', en: 'Write impl Speak for Dog, with its speak method.', say_zh: '给 Dog 实现 Speak，写出 speak。', say_en: 'Implement Speak for Dog, with its speak method.'},
            ['猫也一样，各叫各的。', 'Same for Cat. Each makes its own sound.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 36px;font-size:29px;line-height:1.7">${code(`struct Dog;
impl Speak for Dog {
    fn speak(&self) -> String {
        "Woof".into()
    }
}`)}</div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:400px;padding:28px 36px;font-size:29px;line-height:1.7">${code(`struct Cat;
impl Speak for Cat {
    fn speak(&self) -> String {
        "Meow".into()
    }
}`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.4" data-in="stamp" style="right:30px;top:150px">${badge(T('自己的叫声', 'its own sound'), 'var(--acc2)')}</div>`);
      } },

    { title: ['一个函数，谁都能用', 'One function for both'],
      cap: [{zh: '参数写 &impl Speak：实现了就收。', en: 'Make the parameter &impl Speak: any Speak type works.', say_zh: '参数这样写：只要实现了 Speak，都收。', say_en: 'Make the parameter a reference to any Speak type.'},
            ['Dog 和 Cat 都能传进来。', 'So both Dog and Cat can go in.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 40px;font-size:32px;line-height:1.75">${code(`fn greet(x: &impl Speak) {
    println!("{}", x.speak());
}
greet(&Dog);   // Woof
greet(&Cat);   // Meow`)}</div>`);
        H(`<div class="r card mono center" data-cap="1" data-in="left" style="left:40px;top:430px;width:240px;height:110px;font-size:40px;border-color:var(--blue)">Dog</div>`);
        H(`<div class="r card mono center" data-cap="1" data-delay="0.3" data-in="left" style="left:40px;top:580px;width:240px;height:110px;font-size:40px;border-color:var(--blue)">Cat</div>`);
        H(`<svg class="r" data-cap="1" data-delay="0.6" style="left:280px;top:430px" width="220" height="260"><path d="M0 55 L200 130 M0 205 L200 130" stroke="#FF8A4C" stroke-width="4" fill="none"/><path d="M200 130 l-20 -12 l4 12 l-4 12 z" fill="#FF8A4C"/></svg>`);
        H(`<div class="r card center" data-cap="1" data-delay="0.9" data-in="pop" style="left:500px;top:480px;width:440px;height:170px;flex-direction:column;gap:8px;border-color:var(--acc)">
          <div class="mono" style="font-size:36px;font-weight:800">greet()</div><div class="s">${T('只认 Speak', 'only needs Speak')}</div></div>`);
      } },

    { title: ['没实现？编译不过', 'Not implemented? No compile'],
      cap: [['传一个没实现 Speak 的 Rock，', 'Pass in a Rock that does not implement Speak,'],
            ['编译器直接报错，不用等到运行。', 'and the compiler stops you before it ever runs.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:30px 40px;font-size:36px;line-height:1.8">${code(`struct Rock;
greet(&Rock);   // ${T('没实现 Speak', 'no Speak')}`)}</div>`);
        H(`<div class="r card" data-cap="1" data-shake="1" style="left:0;right:0;top:300px;padding:28px 40px;border-color:var(--red)">
          <div class="mono red" style="font-size:34px;font-weight:800">error[E0277]</div>
          <div class="s" style="margin-top:10px">${T('Rock 没有实现 Speak', 'Rock does not implement Speak')}</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.0" style="left:0;right:0;top:560px;display:flex;gap:30px;justify-content:center">
          <span class="chip ok" style="border-color:var(--acc2)">${T('编译时就发现', 'caught at compile time')}</span>
          <span class="chip">${T('不用等到运行', 'not at run time')}</span></div>`);
      } },

    { title: ['默认实现', 'Default methods'],
      cap: [{zh: 'trait 里的方法也能带默认实现，', en: 'A trait method can also have a default body.', say_zh: '特征里的方法也能带默认实现，'},
            ['实现时不写，就用默认的。', 'If a type skips it, the default is used.'],
            ['没有默认实现的方法，必须自己写。', 'Methods with no default must be written.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:28px 36px;font-size:30px;line-height:1.75">${code(`trait Speak {
    fn speak(&self) -> String;
    fn hello(&self) -> String {
        format!("Hi! {}", self.speak())
    }
}`)}</div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;width:560px;top:420px;padding:24px 32px;font-size:32px;line-height:1.7">${code(`Dog.hello()   // Hi! Woof`)}</div>`);
        H(`<div class="r" data-cap="2" style="left:0;right:0;top:580px;display:flex;gap:30px;justify-content:center">
          <div class="card center" style="width:430px;height:150px;flex-direction:column;gap:6px;border-color:var(--red)"><div class="mono" style="font-size:36px;font-weight:800">speak</div><div class="s">${T('没默认 → 必须写', 'no default → must write')}</div></div>
          <div class="card center" style="width:430px;height:150px;flex-direction:column;gap:6px;border-color:var(--acc2)"><div class="mono" style="font-size:36px;font-weight:800">hello</div><div class="s">${T('有默认 → 可不写', 'default → optional')}</div></div></div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [{zh: '总结：trait 定义共同行为，', en: 'To sum up: a trait sets out shared behavior,', say_zh: '总结：特征定义共同行为，'},
            {zh: 'impl 给每个类型实现它，', en: 'impl adds it to each type,', say_zh: '再给每个类型实现它，', say_en: 'you implement it for each type,'},
            {zh: '&impl Trait 让一个函数通吃。', en: 'and &impl Trait lets one function take them all.', say_zh: '一个参数，就能让函数通吃。', say_en: 'and one function can take every type that implements it.'}],
      build() {
        const row = (y, k, z, e, c, cap) => H(`<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:170px;display:grid;grid-template-columns:470px 1fr;align-items:center;padding:0 36px;gap:16px;border-color:${c}">
          <div class="mono" style="font-size:34px;font-weight:800;color:${c}">${k}</div><div class="h" style="font-size:34px">${T(z, e)}</div></div>`);
        row(30, 'trait Speak', '定义行为', 'the behavior', 'var(--acc)', 0);
        row(240, 'impl Speak for Dog', '给类型实现', 'adds it to a type', 'var(--acc2)', 1);
        row(450, 'x: &amp;impl Speak', '一个函数通吃', 'one fn takes all', 'var(--blue)', 2);
        H(`<div class="r s" data-cap="2" data-delay="1.2" style="left:0;right:0;top:670px;text-align:center">${T('定义 → 实现 → 使用', 'define → implement → use')}</div>`);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '其实 &impl Speak 就是泛型的简写。', en: '&impl Speak is shorthand for a generic.', say_zh: '其实刚才那个参数，就是泛型的简写。', say_en: 'That parameter is shorthand for a generic.'},
            ['下期讲泛型。关注我，一起学！', 'Generics are next. Follow along!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:60px;right:60px;top:140px;height:500px;border-color:var(--acc);text-align:center;padding-top:60px">
          <div class="s" style="font-size:34px">${T('第 16 课 · Lesson 16', 'Lesson 16')}</div>
          <div class="h" style="font-size:80px;margin-top:26px">${T('泛型', 'Generics')}</div>
          <div class="s" style="font-size:36px;margin-top:10px">${T('一份代码，多种类型', 'One code, many types')}</div>
          <div class="mono acc" style="font-size:32px;margin-top:44px">fn greet&lt;T: Speak&gt;(x: &amp;T)</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：这段代码能编译吗？', en: 'Quick quiz: does this code compile?'},
            {zh: '能，还是不能？评论区告诉我。', en: 'Yes or no? Tell me in the comments.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:30px;padding:28px 40px;font-size:34px;line-height:1.7">${code(`trait Speak {
    fn speak(&self) -> String;
}
struct Dog;
impl Speak for Dog {}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:420px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--blue)">A · ${T('能', 'Yes')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:46px;border-color:var(--acc)">B · ${T('不能', 'No')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:620px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
