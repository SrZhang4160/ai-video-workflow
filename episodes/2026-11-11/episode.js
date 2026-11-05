// 第 19 课 · 用 clap 写一个命令行工具（clap 4 derive API；代码在 clap 4.6.7 + rustc 1.98.1 下编译运行过）
window.EPISODE = {
  n: 19,
  scenes: [
    { title: ['命令行参数怎么解析？', 'How do you parse CLI arguments?'],
      cap: [['想写个命令行小工具，参数怎么解析？', 'Writing a command-line tool? How do you read its arguments?'],
            ['自己一个个切字符串，麻烦又容易错。', 'Splitting the strings by hand is tedious and easy to get wrong.'],
            {zh: '用 clap，一个结构体就搞定。', en: 'With clap, one struct does it all.', say_zh: '用 clap，写一个结构体就搞定。'}],
      build() {
        H(`<div class="r card mono center" data-cap="0" data-in="drop" style="left:130px;right:130px;top:30px;height:130px;font-size:42px;border-color:var(--blue)"><span class="ok">$</span>&nbsp;greet Ann -c 2</div>`);
        H(`<div class="r card mono" data-cap="1" data-in="left" style="left:0;right:0;top:210px;padding:24px 36px;font-size:28px;line-height:1.65;font-variant-ligatures:none;border-style:dashed;border-color:var(--red)">${code(`let args: Vec<String> = std::env::args().collect();
let name = &args[1];          // ${T('越界就崩', 'panics if missing')}
if args[2] == "-c" { ... }    // ${T('还有 --count 呢？', 'what about --count?')}`)}</div>`);
        H(`<div class="r mono red" data-cap="1" data-delay="1.2" data-in="stamp" style="left:840px;top:410px;font-size:64px;font-weight:800">✗</div>`);
        H(`<div class="r card center" data-cap="2" data-in="pop" style="left:120px;right:120px;top:560px;height:160px;gap:24px;border-color:var(--acc)">
          <span class="mono acc" style="font-size:52px;font-weight:800">clap</span><span class="h" style="font-size:38px">${T('一个结构体搞定', 'one struct')}</span></div>`);
      } },

    { title: ['第一步：装上 clap', 'Step 1: add clap'],
      cap: [{zh: '先用 cargo add 装上 clap，', en: 'First, add clap with cargo add,', say_zh: '先用 cargo 命令，装上 clap，'},
            {zh: '记得打开 derive 功能。', en: "and turn on the derive feature.", say_zh: '记得打开派生这个功能。'},
            {zh: 'Cargo.toml 里就多了这一行。', en: 'Cargo.toml now has this line.', say_zh: '配置文件里，就多了这条依赖。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:30px 40px;font-size:34px;line-height:1.7"><span class="ok">$</span> cargo add clap <span class="acc">--features derive</span></div>`);
        H(`<div class="r" data-cap="1" data-in="pop" style="left:0;right:0;top:200px;text-align:center"><span class="chip" style="font-size:30px;border-color:var(--acc)"><span class="mono acc">derive</span> = ${T('用结构体定义参数', 'define args with a struct')}</span></div>`);
        H(`<svg class="r" data-cap="2" style="left:0;top:300px" width="960" height="90" viewBox="0 0 960 90"><path d="M480 6 L480 70" stroke="var(--quiet)" stroke-width="4"/><polygon points="466,64 494,64 480,86" fill="var(--quiet)"/></svg>`);
        H(`<div class="r card mono" data-cap="2" data-delay="0.3" style="left:0;right:0;top:410px;padding:28px 36px;font-size:26px;line-height:1.75;border-color:var(--acc2)">
          <div class="cm">Cargo.toml</div><div class="yel">[dependencies]</div><div>${esc('clap = { version = "4.6.7", features = ["derive"] }')}</div></div>`);
      } },

    { title: ['第二步：写个结构体', 'Step 2: write a struct'],
      cap: [{zh: '结构体上加 #[derive(Parser)]，', en: 'Put #[derive(Parser)] on a struct.', say_zh: '在结构体上面，派生一个解析器，', say_en: 'Put derive Parser on a struct.'},
            ['每个字段，就是一个参数。', 'Each field is one argument.'],
            {zh: '三斜杠注释，会变成帮助文字。', en: 'Triple-slash comments become the help text.'}],
      build() {
        // /// doc comments drawn yellow (they become the --help text in the next scenes); blank lines kept
        const src = ['use clap::Parser;', '', '/// Say hello to someone', '#[derive(Parser)]', '#[command(version, about)]', 'struct Args {', '    /// Who to greet', '    name: String,', '', '    /// How many times', '    #[arg(short, long, default_value_t = 1)]', '    count: u8,', '}'];
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:24px 40px;font-size:29px;line-height:1.5">${src.map(l => !l ? '<div>&nbsp;</div>' : /^\s*\/\/\//.test(l) ? `<div class="yel">${l.replace(/^( +)/, x => '&nbsp;'.repeat(x.length))}</div>` : code(l)).join('')}</div>`);
        H(`<div class="r" data-cap="1" data-in="right" style="left:620px;top:345px"><span class="chip" style="font-size:26px;border-color:var(--blue)">${T('字段 = 参数', 'field = argument')}</span></div>`);
        H(`<div class="r" data-cap="2" data-in="pop" style="left:0;right:0;top:740px;text-align:center"><span class="chip" style="font-size:28px;border-color:var(--yel)"><span class="mono yel">///</span> → ${T('帮助文字', 'help text')}</span></div>`);
      } },

    { title: ['位置参数和选项', 'Positional args vs options'],
      cap: [['普通字段是位置参数，必须给。', 'A plain field is a positional argument. It is required.'],
            {zh: '加上 short 和 long，就成了选项，', en: 'Add short and long, and it becomes an option:', say_zh: '加上短写和全写，它就成了选项，'},
            {zh: '-c 和 --count 都能用。', en: '-c and --count both work.', say_zh: '一个减号加字母，或两个减号加全名，都能用。', say_en: 'dash c and dash dash count both work.'},
            {zh: 'default_value_t 给它一个默认值。', en: 'default_value_t gives it a default.', say_zh: '再给它一个默认值，不写就是一。', say_en: 'default value t gives it a default of one.'}],
      build() {
        H(`<div class="r card mono center" data-cap="0" style="left:60px;right:60px;top:40px;height:140px;font-size:50px;gap:28px"><span class="ok">$</span> greet <span class="blue">Ann</span> <span class="acc">-c 2</span></div>`);
        H(`<svg class="r" data-cap="0" data-delay="0.4" style="left:0;top:190px" width="960" height="130" viewBox="0 0 960 130">
          <path d="M455 8 L250 110" stroke="var(--blue)" stroke-width="4" fill="none"/><polygon points="236,118 256,96 264,116" fill="var(--blue)"/>
          <path d="M640 8 L720 110" stroke="var(--acc)" stroke-width="4" fill="none"/><polygon points="728,122 704,108 724,98" fill="var(--acc)"/></svg>`);
        H(`<div class="r card" data-cap="0" data-delay="0.6" data-in="left" style="left:0;width:450px;top:340px;height:250px;padding:26px 30px;border-color:var(--blue)">
          <div class="mono blue" style="font-size:34px;font-weight:800">name: String</div>
          <div class="h" style="font-size:32px;margin-top:22px">${T('位置参数', 'Positional')}</div>
          <div class="s" style="margin-top:8px">${T('必须给，不给就报错', 'required, or it errors')}</div></div>`);
        H(`<div class="r card" data-cap="1" data-in="right" style="left:490px;width:470px;top:340px;height:250px;padding:26px 30px;border-color:var(--acc)">
          <div class="mono acc" style="font-size:34px;font-weight:800">count: u8</div>
          <div class="h" style="font-size:32px;margin-top:22px">${T('选项', 'Option')}</div>
          <div class="mono" style="font-size:28px;margin-top:8px" data-cap="2">-c 2 · --count 2</div></div>`);
        H(`<div class="r" data-cap="3" data-in="pop" style="left:0;right:0;top:640px;text-align:center"><span class="chip mono" style="font-size:28px;border-color:var(--acc2)">default_value_t = 1 → ${T('不写就是 1', 'omitted = 1')}</span></div>`);
      } },

    { title: ['第三步：parse 一下', 'Step 3: call parse'],
      cap: [{zh: 'main 里调用 Args::parse()，', en: 'In main, call Args::parse().', say_zh: '主函数里，调用一下解析方法，', say_en: 'In main, call Args parse.'},
            ['拿到的就是填好的结构体。', 'You get the struct, already filled in.'],
            {zh: '跑一下：传 -c 2，打印两遍。', en: 'Run it with -c 2: it prints twice.', say_zh: '跑一下：传入减号 c 二，打印两遍。', say_en: 'Run it with dash c two: it prints twice.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 40px;font-size:32px;line-height:1.7">${code(`fn main() {
    let args = Args::parse();
    for _ in 0..args.count {
        println!("Hello, {}!", args.name);
    }
}`)}</div>`);
        H(`<div class="r" data-cap="1" data-in="pop" style="left:0;right:0;top:390px;text-align:center"><span class="chip" style="font-size:28px;border-color:var(--blue)"><span class="mono">args.name · args.count</span> ${T('直接用', 'ready to use')}</span></div>`);
        H(`<div class="r card mono" data-cap="2" style="left:0;right:0;top:480px;padding:26px 40px;font-size:32px;line-height:1.75;border-color:var(--acc2)">
          <div><span class="ok">$</span> cargo run -- Ann -c 2</div><div>Hello, Ann!</div><div>Hello, Ann!</div></div>`);
      } },

    { title: ['--help 白送', '--help for free'],
      cap: [{zh: '最爽的是：--help 不用你写，', en: "The best part: you don't write --help,", say_zh: '最爽的是，帮助信息不用你写，'},
            {zh: 'clap 根据结构体自动生成。', en: 'clap generates it from your struct.', say_zh: '它会根据结构体，自动生成。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:20px;padding:26px 34px;font-size:27px;line-height:1.55">
          <div><span class="ok">$</span> greet --help</div>
          <div class="yel">Say hello to someone</div><br>
          <div>Usage: greet [OPTIONS] &lt;NAME&gt;</div><br>
          <div>Arguments:</div>
          <div>&nbsp;&nbsp;&lt;NAME&gt;&nbsp;&nbsp;<span class="yel">Who to greet</span></div><br>
          <div>Options:</div>
          <div>&nbsp;&nbsp;-c, --count &lt;COUNT&gt;&nbsp;&nbsp;<span class="yel">How many times</span> [default: 1]</div>
          <div>&nbsp;&nbsp;-h, --help&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print help</div>
          <div>&nbsp;&nbsp;-V, --version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print version</div></div>`);
        H(`<div class="r" data-cap="1" data-in="pop" style="left:0;right:0;top:640px;text-align:center"><span class="chip" style="font-size:28px;border-color:var(--yel)"><span class="yel">${T('黄色', 'Yellow')}</span> = ${T('来自 /// 注释', 'from your /// comments')}</span></div>`);
      } },

    { title: ['类型就是校验', 'Types are validation'],
      cap: [{zh: 'count 是 u8，传个 abc 进去，', en: 'count is a u8. Pass in abc,', say_zh: '次数是整数类型，传几个字母进去，'},
            {zh: 'clap 直接报错，告诉你哪里不对。', en: 'and clap stops with an error that says what is wrong.', say_zh: '程序直接报错，告诉你哪里不对。'},
            ['类型写对，校验就不用自己写了。', 'Get the type right and the checking is done for you.']],
      build() {
        H(`<div class="r card mono" data-cap="0" style="left:0;right:0;top:40px;padding:26px 36px;font-size:30px;line-height:1.7"><span class="ok">$</span> greet Ann -c <span class="red">abc</span></div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="left:0;right:0;top:190px;padding:24px 36px;font-size:27px;line-height:1.6;border-color:var(--red)">
          <div class="red" style="font-weight:800">error: invalid value 'abc' for</div>
          <div class="red" style="font-weight:800">'--count &lt;COUNT&gt;': invalid digit found in string</div></div>`);
        H(`<div class="r card center" data-cap="2" data-in="stamp" style="left:80px;right:80px;top:460px;height:160px;gap:24px;border-color:var(--acc2)">
          ${icon('shield', 56, 'var(--acc2)')}<span class="h" style="font-size:38px">${T('类型对了，校验白送', 'right type = free validation')}</span></div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [{zh: '总结：derive(Parser) 定义参数，', en: 'To recap: derive(Parser) defines the arguments,', say_zh: '总结一下：派生解析器，定义参数，', say_en: 'To recap: derive Parser defines the arguments,'},
            ['普通字段是位置参数，加属性变选项，', 'plain fields are positional, attributes make options,'],
            {zh: '一句 parse()，帮助和报错全有了。', en: 'and one parse() gives you help and errors for free.', say_zh: '一句解析，帮助和报错就全有了。', say_en: 'and one parse call gives you help and errors for free.'}],
      build() {
        const row = (y, k, z, e, c, cap) => H(`<div class="r card" data-cap="${cap}" style="left:0;right:0;top:${y}px;height:150px;display:grid;grid-template-columns:400px 1fr;align-items:center;padding:0 34px;gap:16px">
          <div class="mono" style="font-size:32px;font-weight:800;color:${c}">${k}</div><div style="font-size:30px">${T(z, e)}</div></div>`);
        row(30, '#[derive(Parser)]', '结构体 = 参数定义', 'struct = argument spec', 'var(--acc)', 0);
        row(205, 'name: String', '位置参数，必须给', 'positional, required', 'var(--blue)', 1);
        row(380, '#[arg(short, long)]', '选项：-c / --count', 'option: -c / --count', 'var(--yel)', 1);
        row(555, 'Args::parse()', '帮助、报错、类型检查', 'help, errors, type checks', 'var(--acc2)', 2);
      } },

    { title: ['下期预告', 'Next episode'],
      cap: [{zh: '下期：用 Rust 调 HTTP 接口，', en: 'Next time: calling an HTTP API from Rust,', say_zh: '下期：用 Rust 调用 H T T P 接口，'},
            {zh: 'reqwest 加 serde，下期见！', en: 'with reqwest and serde. See you then!', say_zh: '请求库加上序列化库，下期见！'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="pop" style="left:80px;right:80px;top:180px;height:440px;border-color:var(--acc);text-align:center;padding-top:70px">
          <div class="s" style="font-size:34px">${T('第 20 课 · Lesson 20', 'Lesson 20')}</div>
          <div class="h" style="font-size:66px;margin-top:30px">${T('用 Rust 调 HTTP API', 'Call an HTTP API')}</div>
          ${LANG === 'zh' ? '<div class="s" style="font-size:38px;margin-top:10px">Call an HTTP API</div>' : ''}
          <div class="mono acc" style="font-size:32px;margin-top:40px">reqwest + serde</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz; answer in meta.json quiz (verified: clap 4.6.7 prints "300 is not in 0..=255")
      cap: [{zh: '考考你：count 是 u8，传 -c 300 会怎样？', en: 'Quick quiz: count is a u8. What does -c 300 do?', say_zh: '考考你：次数是 U 八，传入减号 c 三百，会怎样？', say_en: 'Quick quiz: count is a u8. What does dash c three hundred do?'},
            ['打印三百遍，还是报错？评论区告诉我。', 'Print 300 times, or error? Tell me in the comments.']],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="left:0;right:0;top:40px;padding:28px 40px;font-size:34px;line-height:1.8">${code(`#[arg(short, long, default_value_t = 1)]
count: u8,`)}
          <div style="margin-top:14px"><span class="ok">$</span> greet Ann -c <span class="acc">300</span></div></div>`);
        H(`<div class="r" data-cap="1" style="left:0;right:0;top:360px;display:flex;gap:40px;justify-content:center">
          <div class="card center h" style="width:420px;height:130px;font-size:40px;border-color:var(--blue)">A · ${T('打印 300 遍', 'Prints 300×')}</div>
          <div class="card center h" style="width:420px;height:130px;font-size:40px;border-color:var(--acc)">B · ${T('报错', 'Error')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="left:0;right:0;top:560px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
