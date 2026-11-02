// 第 14 课 · Cargo：建项目、加依赖、跑测试
window.EPISODE = {
  n: 14,
  scenes: [
    { title: ['Cargo：一个工具全包', 'Cargo does it all'],
      cap: [['建项目、装库、跑测试，要几个工具？', 'Start a project, add libraries, run tests. How many tools?'],
            ['就一个：Cargo。', 'Just one: Cargo.']],
      build() {
        const items = [['建项目', 'New project'], ['加依赖', 'Add libraries'], ['跑测试', 'Run tests']];
        items.forEach(([z, e], i) => H(`<div class="r card center" data-cap="0" data-delay="${i * 0.4}" data-in="pop" style="left:${i * 330}px;top:60px;width:300px;height:130px;font-size:36px;font-weight:800">${T(z, e)}</div>`));
        H(`<div class="r h center" data-cap="0" data-delay="1.4" data-in="pop" style="left:0;right:0;top:250px;font-size:110px;color:var(--yel)">?</div>`);
        H(`<div class="r card center" data-cap="1" data-in="stamp" style="left:180px;right:180px;top:450px;height:220px;gap:30px;border-color:var(--acc);border-width:4px">
          ${icon('box', 96, 'var(--acc)')}<span class="mono acc" style="font-size:84px;font-weight:800">Cargo</span></div>`);
        H(`<div class="r s" data-cap="1" data-delay="0.8" style="left:0;right:0;top:700px;text-align:center">${T('Rust 自带的构建工具 + 包管理器', "Rust's built-in build tool + package manager")}</div>`);
      } },

    { title: ['cargo new：建项目', 'cargo new: start a project'],
      cap: [{zh: '第一步，cargo new 建项目。', en: 'Step one: cargo new creates a project.', say_zh: '第一步，用 Cargo 新建项目。'},
            {zh: '生成 Cargo.toml 和 src/main.rs。', en: 'It creates Cargo.toml and src/main.rs.', say_zh: '生成配置文件 Cargo 点 T O M L，和 S R C 里的入口文件。', say_en: 'It creates Cargo dot toml, and main dot R S in the src folder.'},
            {zh: 'cargo run，编译加运行一步到位。', en: 'cargo run compiles and runs it in one step.', say_zh: '再用 Cargo 运行，编译加运行一步到位。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;width:520px;top:20px;padding:26px 32px;font-size:34px;line-height:1.6"><span class="q">$</span> cargo new hello</div>`);
        H(`<div class="r card mono" data-cap="0" data-delay="0.8" style="left:0;width:520px;top:160px;padding:26px 32px;font-size:34px;line-height:1.75">
          <div>hello/</div>
          <div class="acc">├─ Cargo.toml</div>
          <div>└─ src/</div>
          <div class="ok">&nbsp;&nbsp;&nbsp;└─ main.rs</div></div>`);
        H(`<div class="r card" data-cap="1" data-in="right" style="left:560px;width:400px;top:180px;padding:20px 24px;border-color:var(--acc)"><div class="mono acc" style="font-size:28px;font-weight:800">Cargo.toml</div><div class="s" style="margin-top:6px">${T('项目配置 + 依赖', 'settings + dependencies')}</div></div>`);
        H(`<div class="r card" data-cap="1" data-delay="0.6" data-in="right" style="left:560px;width:400px;top:330px;padding:20px 24px;border-color:var(--acc2)"><div class="mono ok" style="font-size:28px;font-weight:800">src/main.rs</div><div class="s" style="margin-top:6px">${T('程序入口 fn main', 'entry point: fn main')}</div></div>`);
        H(`<div class="r card mono" data-cap="2" data-in="pop" style="left:0;right:0;top:520px;padding:26px 32px;font-size:34px;line-height:1.7"><div><span class="q">$</span> cargo run</div><div class="ok">Hello, world!</div></div>`);
      } },

    { title: ['加依赖：cargo add', 'Add a dependency: cargo add'],
      cap: [{zh: '想用别人的库？cargo add。', en: "Want someone else's library? cargo add.", say_zh: '想用别人的库？用 Cargo 加依赖。', say_en: "Want someone else's library? cargo add."},
            {zh: '它把依赖写进 Cargo.toml，', en: 'It writes the dependency into Cargo.toml.', say_zh: '它会把依赖写进 Cargo 点 T O M L，', say_en: 'It writes the dependency into Cargo dot toml.'},
            {zh: '编译时自动从 crates.io 下载。', en: 'When you build, Cargo downloads it from crates.io.', say_zh: '编译时，自动从 crates 点 I O 下载。', say_en: 'When you build, Cargo downloads it from crates dot I O.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 36px;font-size:36px"><span class="q">$</span> cargo add anyhow</div>`);
        H(`<div class="r mono acc center" data-cap="1" data-in="drop" style="left:0;right:0;top:140px;font-size:56px">↓</div>`);
        H(`<div class="r card mono" data-cap="1" style="left:0;right:0;top:230px;padding:26px 36px;font-size:34px;line-height:1.7;border-color:var(--acc)">${code(`[dependencies]
anyhow = "1.0.104"   # ${T('当时的最新版', 'latest at the time')}`)}</div>`);
        H(`<div class="r card center" data-cap="2" data-in="left" style="left:0;width:400px;top:470px;height:150px;gap:18px;border-color:var(--blue)">${icon('db', 56, 'var(--blue)')}<span class="mono blue" style="font-size:34px">crates.io</span></div>`);
        H(`<div class="r mono acc center" data-cap="2" data-delay="0.5" data-in="left" style="left:400px;width:160px;top:500px;font-size:56px">→</div>`);
        H(`<div class="r card mono center" data-cap="2" data-delay="0.8" data-in="right" style="left:560px;width:400px;top:470px;height:150px;font-size:34px;border-color:var(--acc2);color:var(--acc2)">cargo build</div>`);
      } },

    { title: ['写测试：#[test]', 'Tests: #[test]'],
      cap: [{zh: '测试：函数上面加一行 #[test]，', en: 'Tests: put #[test] above a function,', say_zh: '写测试：在函[sh][ù]上面加一行测试标记，', say_en: 'Tests: put the test attribute above a function,'},
            {zh: '里面用 assert_eq! 比较结果。', en: 'and check the result with assert_eq!.', say_zh: '里面用断言相等的宏，比较结果。', say_en: 'and check the result with assert equal.'},
            {zh: 'cargo test，所有测试一起跑。', en: 'cargo test runs all your tests.', say_zh: '再用 Cargo 跑测试，所有测试一起跑。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:24px 36px;font-size:30px;line-height:1.65">
          <div class="s" style="font-family:'Noto Sans SC';margin-bottom:4px">src/main.rs</div>${code(`fn add(a: i32, b: i32) -> i32 { a + b }
fn main() { println!("{}", add(2, 3)); }
 
#[test]
fn adds_two() {
    assert_eq!(add(2, 3), 5);
}`)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.8" data-in="left" style="left:620px;top:230px"><span class="chip acc" style="border-color:var(--acc)">${T('← 标记为测试', '← marks a test')}</span></div>`);
        H(`<div class="r" data-cap="1" data-in="left" style="left:620px;top:324px"><span class="chip acc" style="border-color:var(--acc)">${T('← 不相等就失败', '← fails if not equal')}</span></div>`);
        H(`<div class="r card mono" data-cap="2" data-in="pop" style="left:0;right:0;top:510px;padding:24px 36px;font-size:30px;line-height:1.7">
          <div><span class="q">$</span> cargo test</div>
          <div>test adds_two ... <span class="ok">ok</span></div>
          <div>test result: <span class="ok">ok</span>. 1 passed; 0 failed; …</div></div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [{zh: 'new 建项目，run 跑起来，', en: 'new starts a project, run runs it,', say_zh: 'Cargo 四个命令：新建项目，运行程序，'},
            {zh: 'add 加依赖，test 跑测试。', en: 'add adds a library, test runs the tests.', say_zh: '加依赖，跑测试。'}],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="pop" style="left:0;right:0;top:20px;height:130px;gap:20px;border-color:var(--acc)">${icon('box', 56, 'var(--acc)')}<span class="mono acc" style="font-size:52px;font-weight:800">cargo</span></div>`);
        const cmds = [['new', '建项目', 'start a project', 'rocket', 0], ['run', '编译 + 运行', 'build + run', 'gear', 0], ['add', '加依赖', 'add a library', 'box', 1], ['test', '跑测试', 'run the tests', 'check', 1]];
        cmds.forEach(([k, z, e, ic, cap], i) => H(`<div class="r card" data-cap="${cap}" data-delay="${(i % 2) * 0.6}" style="left:${(i % 2) * 490}px;top:${190 + Math.floor(i / 2) * 250}px;width:470px;height:220px;padding:30px 30px;display:flex;align-items:center;gap:28px">
          ${icon(ic, 64, 'var(--acc2)')}<div><div class="mono" style="font-size:42px;font-weight:800">cargo ${k}</div><div class="s" style="margin-top:10px">${T(z, e)}</div></div></div>`));
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期聊 trait：', en: 'Next time: traits,', say_zh: '下期聊特征：'},
            ['给不同类型定义共同行为。关注我！', 'shared behavior across types. Follow along!']],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 15 课 · Lesson 15', 'Lesson 15')}</div>
          <div class="h" style="font-size:80px;margin-top:30px">trait</div>
          <div class="s" style="font-size:40px;margin-top:10px">${T('定义共同行为', 'Shared behavior')}</div>
          <div class="mono acc" style="font-size:32px;margin-top:40px">trait · impl · fn</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz (runbooks/scenes.md growth rule 2); answer in meta.json quiz
      cap: [{zh: '考考你：cargo test 结果是？', en: 'Quick quiz: what does cargo test report?', say_zh: '考考你：跑这个测试，结果是什么？'},
            {zh: 'A 通过，还是 B 失败？评论区告诉我。', en: 'A, ok, or B, FAILED? Tell me in the comments.', say_zh: 'A 通过，还是 B 失败？评论区告诉我。', say_en: 'A, ok, or B, failed? Tell me in the comments.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:30px 40px;font-size:38px;line-height:1.7">${code(`#[test]
fn check() {
    assert_eq!(2 + 2, 5);
}`)}</div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:380px;display:flex;gap:48px;justify-content:center">
          <div class="card center h" style="width:380px;height:130px;font-size:42px;border-color:var(--blue)">A · ok${T(' <span class="s" style="margin-left:10px">通过</span>', '')}</div>
          <div class="card center h" style="width:380px;height:130px;font-size:42px;border-color:var(--acc)">B · FAILED${T(' <span class="s" style="margin-left:10px">失败</span>', '')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:580px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
