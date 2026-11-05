// 第 20 课 · 用 Rust 调 HTTP API（reqwest + serde）— Rust 系列最后一课
// Code verified 2026-11-04 with reqwest 0.13.5 (features blocking, json) + serde 1.0.229 (derive), rustc 1.98.1;
// output from a real run against https://api.github.com/repos/rust-lang/rust (star count is live).
window.EPISODE = {
  n: 20,
  scenes: [
    { title: ['用 Rust 调 HTTP API', 'Call an HTTP API from Rust'],
      cap: [['想让 Rust 程序去网上拿数据？', 'Want your Rust program to fetch data from the web?'],
            {zh: 'reqwest 发请求，serde 解析 JSON。', en: 'reqwest sends the request, serde parses the JSON.', say_zh: '其实两个库就够了：一个发请求，一个解析 J S O N。', say_en: 'reqwest sends the request, and serde parses the J S O N.'},
            ['咱们拿 rust 仓库的星标数试试。', "Let's try it: get the star count of the rust repo."]],
      build() {
        H(`<div class="r card center" data-cap="0" data-in="left" style="font-variant-ligatures:none;left:0;top:60px;width:340px;height:200px;flex-direction:column;gap:10px;border-color:var(--acc)">
          <div class="h" style="font-variant-ligatures:none;font-size:38px">${T('Rust 程序', 'Rust program')}</div><div class="mono acc" style="font-variant-ligatures:none;font-size:28px">reqwest</div></div>`);
        H(`<div class="r card center" data-cap="0" data-delay="0.5" data-in="right" style="font-variant-ligatures:none;left:620px;top:60px;width:340px;height:200px;flex-direction:column;gap:10px;border-color:var(--blue)">
          <div class="h" style="font-variant-ligatures:none;font-size:36px">API</div><div class="mono blue" style="font-variant-ligatures:none;font-size:26px">api.github.com</div></div>`);
        H(`<div class="r mono center" data-cap="1" data-in="left" style="font-variant-ligatures:none;left:350px;width:260px;top:80px;height:50px;font-size:28px;color:var(--acc)">GET →</div>`);
        H(`<div class="r mono center" data-cap="1" data-delay="0.6" data-in="right" style="font-variant-ligatures:none;left:350px;width:260px;top:190px;height:50px;font-size:28px;color:var(--blue)">← JSON</div>`);
        H(`<div class="r card center" data-cap="1" data-delay="1.2" data-in="pop" style="font-variant-ligatures:none;left:160px;right:160px;top:360px;height:130px;gap:24px;border-color:var(--acc2)">
          <span class="mono yel" style="font-variant-ligatures:none;font-size:34px">serde</span><span class="h acc" style="font-variant-ligatures:none;font-size:40px">→</span><span class="mono ty" style="font-variant-ligatures:none;font-size:36px;font-weight:800">struct Repo</span></div>`);
        H(`<div class="r" data-cap="2" style="font-variant-ligatures:none;left:0;right:0;top:580px;text-align:center"><span class="chip" style="font-variant-ligatures:none;font-size:30px;border-color:var(--acc)">⭐ rust-lang/rust</span></div>`);
      } },

    { title: ['第一步：加依赖', 'Step 1: add the crates'],
      cap: [{zh: '先用 cargo add 加两个库：', en: 'First, add two crates with cargo add:', say_zh: '先用 Cargo 加两个库，'},
            {zh: 'reqwest 打开 blocking 和 json，', en: 'reqwest with the blocking and json features,', say_zh: '请求库打开两个功能，同步和 J S O N，'},
            {zh: 'serde 打开 derive。', en: 'and serde with derive.', say_zh: '序列化库打开派生功能。'},
],
      build() {
        H(`<div class="r card mono" data-cap="0" style="font-variant-ligatures:none;left:0;right:0;top:20px;padding:28px 34px;font-size:28px;line-height:1.8">
          <div><span class="q">$</span> cargo add reqwest <span class="acc">--features blocking,json</span></div>
          <div><span class="q">$</span> cargo add serde <span class="acc">--features derive</span></div></div>`);
        H(`<div class="r card mono" data-cap="2" data-delay="0.4" style="font-variant-ligatures:none;left:0;right:0;top:250px;padding:24px 34px;font-size:26px;line-height:1.75;border-color:var(--acc2)">
          <div class="s" style="font-variant-ligatures:none;font-family:'Noto Sans SC';margin-bottom:6px">Cargo.toml</div>${code(`[dependencies]
reqwest = { version = "0.13",
    features = ["blocking", "json"] }
serde = { version = "1", features = ["derive"] }`)}</div>`);
        H(`<div class="r" data-cap="2" data-delay="1.4" data-in="pop" style="font-variant-ligatures:none;left:0;right:0;top:560px;text-align:center"><span class="chip" style="font-variant-ligatures:none;font-size:30px;border-color:var(--acc)"><span class="mono acc">blocking</span> = ${T('同步写法 · 不用 async', 'synchronous · no async needed')}</span></div>`);
      } },

    { title: ['第二步：定义结构体', 'Step 2: define a struct'],
      cap: [{zh: '照着 JSON 的样子写一个结构体，', en: 'Write a struct shaped like the JSON.', say_zh: '照着 J S O N 的样子，写一个结构体，'},
            {zh: '加上 derive(Deserialize)，', en: 'Add derive(Deserialize).', say_zh: '再加上派生反序列化，', say_en: 'Add derive Deserialize.'},
            {zh: '字段名要和 JSON 的键一模一样。', en: 'Field names must match the JSON keys exactly.', say_zh: '字段名，要和 J S O N 的键一模一样。'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="left" style="font-variant-ligatures:none;left:0;width:490px;top:20px;padding:24px 26px;font-size:24px;line-height:1.75;border-color:var(--blue)">
          <div class="s" style="font-variant-ligatures:none;font-family:'Noto Sans SC';margin-bottom:6px">${T('API 返回的 JSON', 'JSON from the API')}</div>
          <div>{</div><div class="q">&nbsp;&nbsp;"id": 724712,</div>
          <div>&nbsp;&nbsp;<span class="yel">"full_name"</span>:</div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="st">"rust-lang/rust"</span>,</div>
          <div class="q">&nbsp;&nbsp;...</div>
          <div>&nbsp;&nbsp;<span class="yel">"stargazers_count"</span>: <span class="nu">121083</span>,</div>
          <div class="q">&nbsp;&nbsp;...</div><div>}</div></div>`);
        H(`<div class="r card mono" data-cap="1" data-in="right" style="font-variant-ligatures:none;left:510px;right:0;top:20px;padding:24px 26px;font-size:24px;line-height:1.75;border-color:var(--acc)">${code(`use serde::Deserialize;

#[derive(Deserialize)]
struct Repo {
    full_name: String,
    stargazers_count: u32,
}`)}</div>`);
        H(`<div class="r" data-cap="2" data-in="pop" style="font-variant-ligatures:none;left:0;right:0;top:500px;text-align:center"><span class="chip" style="font-variant-ligatures:none;font-size:30px;border-color:var(--yel)">${T('字段名 = JSON 的键', 'field name = JSON key')}</span></div>`);
        H(`<div class="r card center" data-cap="2" data-delay="0.8" style="font-variant-ligatures:none;left:120px;right:120px;top:610px;height:130px;gap:20px">
          <span class="mono yel" style="font-variant-ligatures:none;font-size:30px">"full_name"</span><span class="h acc" style="font-variant-ligatures:none;font-size:40px">=</span><span class="mono" style="font-variant-ligatures:none;font-size:30px">full_name</span></div>`);
      } },

    { title: ['第三步：发请求', 'Step 3: send the request'],
      cap: [{zh: 'get 填网址，再带上 User-Agent。', en: 'get() takes the URL, then add a User-Agent header.', say_zh: '先填上网址，再带上用户代理这个请求头。', say_en: 'get takes the U R L, then add a User-Agent header.'},
            {zh: 'GitHub 要求必须带，不然返回 403。', en: 'GitHub requires one; without it you get a 403.', say_zh: '这个接口要求必须带，不然返回四零三。', say_en: 'GitHub requires one; without it you get a four oh three.'},
            {zh: 'send 发出去，json 直接变成 Repo。', en: 'send() sends it, and json() turns the body into a Repo.', say_zh: '发出去以后，再一步，直接变成结构体。', say_en: 'send sends it, and json turns the body into a Repo.'},
            {zh: '每步都可能失败，所以加 ? 往上抛。', en: 'Each step can fail, so ? passes the error up.', say_zh: '每一步都可能失败，所以加问号往上抛。', say_en: 'Each step can fail, so the question mark passes the error up.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" style="font-variant-ligatures:none;left:0;right:0;top:20px;padding:26px 30px;font-size:25px;line-height:1.8">${code(`use reqwest::blocking::Client;

let repo: Repo = Client::new()
    .get("https://api.github.com/repos/rust-lang/rust")
    .header("User-Agent", "my-rust-app")
    .send()?    // ${T('发出请求', 'send it')}
    .json()?;   // JSON → Repo`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-shake="1" style="font-variant-ligatures:none;left:0;width:440px;top:450px;padding:20px 26px;font-size:26px;line-height:1.6;border-color:var(--red)">
          <div class="red" style="font-variant-ligatures:none;font-weight:800">${T('不带 User-Agent', 'no User-Agent')}</div><div class="red">→ 403 Forbidden</div></div>`);
        H(`<div class="r card center" data-cap="3" data-in="pop" style="font-variant-ligatures:none;left:480px;right:0;top:450px;height:118px;gap:16px;border-color:var(--acc)">
          <span class="mono acc" style="font-variant-ligatures:none;font-size:44px;font-weight:800">?</span><span class="h" style="font-variant-ligatures:none;font-size:30px">${T('出错就往上抛', 'error? pass it up')}</span></div>`);
      } },

    { title: ['跑起来', 'Run it'],
      cap: [{zh: 'main 返回 Result，? 才能用。', en: 'main returns a Result, so ? works inside it.', say_zh: '主函数返回结果类型，问号才能用。', say_en: 'main returns a Result, so the question mark works inside it.'},
            {zh: 'cargo run，真的拿到了星标数！', en: 'cargo run, and we really get the star count!', say_zh: '用 Cargo 跑一下，真的拿到了星标数！'},
],
      build() {
        H(`<div class="r card mono" data-cap="0" style="font-variant-ligatures:none;left:0;right:0;top:20px;padding:26px 34px;font-size:28px;line-height:1.75">${code(`use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    // let repo: Repo = ...
    println!("{} has {} stars",
        repo.full_name, repo.stargazers_count);
    Ok(())
}`)}</div>`);
        H(`<div class="r card mono" data-cap="1" data-in="drop" style="font-variant-ligatures:none;left:0;right:0;top:390px;padding:26px 34px;font-size:30px;line-height:1.8;border-color:var(--acc2);background:#0E1014">
          <div><span class="q">$</span> cargo run</div><div class="ok" style="font-variant-ligatures:none;font-weight:800">rust-lang/rust has 121083 stars</div></div>`);
        H(`<div class="r" data-cap="1" data-delay="1.6" data-in="pop" style="font-variant-ligatures:none;left:0;right:0;top:620px;text-align:center"><span class="chip" style="font-variant-ligatures:none;font-size:28px">${icon('clock', 30, 'var(--yel)')} ${T('实时数据 · 每次可能不同', 'live data · may differ each run')}</span></div>`);
      } },

    { title: ['对不上会怎样？', "What if they don't match?"],
      cap: [{zh: 'JSON 和结构体对不上，会怎样？', en: "What if the JSON and the struct don't match?", say_zh: 'J S O N 和结构体对不上，会怎样？'},
            {zh: '多出来的字段，直接忽略：', en: 'Extra fields are simply ignored:'},
            {zh: '80 多个字段，只取 2 个也行。', en: 'there are 80+ fields, and taking just 2 is fine.', say_zh: '八十多个字段，只取两个也没问题。', say_en: 'there are over eighty fields, and taking just two is fine.'},
            {zh: '类型不对，就返回 Err，不瞎猜。', en: "A wrong type returns an Err. It never guesses.", say_zh: '类型不对，就返回错误，不瞎猜。'}],
      build() {
        H(`<div class="r card" data-cap="0" data-in="left" style="font-variant-ligatures:none;left:0;width:465px;top:20px;height:440px;padding:28px;border-color:var(--acc2)">
          <div class="h" style="font-variant-ligatures:none;font-size:34px">${B('多字段', 'Extra fields')}</div>
          <div class="mono center" style="font-variant-ligatures:none;font-size:48px;font-weight:800;margin-top:50px;gap:18px"><span class="blue">86</span><span class="acc">→</span><span class="ok">2</span></div>
          <div class="s" style="font-variant-ligatures:none;text-align:center;margin-top:30px">${T('没写的字段直接忽略', 'unlisted fields are ignored')}</div></div>`);
        H(`<div class="r" data-cap="2" data-in="stamp" style="font-variant-ligatures:none;left:190px;top:350px">${icon('check', 80, 'var(--acc2)')}</div>`);
        H(`<div class="r card mono" data-cap="3" data-in="right" style="font-variant-ligatures:none;left:495px;width:465px;top:20px;height:440px;padding:28px;font-size:26px;line-height:1.6;border-color:var(--red)">
          <div class="h" style="font-variant-ligatures:none;font-size:34px;font-family:'Noto Sans SC'">${B('类型不对', 'Wrong type')}</div>
          <div style="font-variant-ligatures:none;margin-top:26px">${code(`full_name: u32,`)}</div>
          <div class="red" style="font-variant-ligatures:none;margin-top:20px;font-size:24px">Err: invalid type:<br>string "rust-lang/rust",<br>expected u32</div></div>`);
        H(`<div class="r" data-cap="3" data-delay="0.5" data-in="stamp" style="font-variant-ligatures:none;left:690px;top:350px">${icon('cross', 80, 'var(--red)')}</div>`);
        H(`<div class="r card center" data-cap="3" data-delay="1.2" style="font-variant-ligatures:none;left:120px;right:120px;top:530px;height:130px;border-color:var(--acc)"><span class="h" style="font-variant-ligatures:none;font-size:36px">${T('出错就报错，不猜', 'Errors, never guesses')}</span></div>`);
      } },

    { title: ['一张图记住', 'Remember it in one picture'],
      cap: [{zh: '总结：cargo add 加两个库，', en: 'To recap: cargo add the two crates,', say_zh: '总结一下：先用 Cargo 加两个库，'},
            {zh: '结构体 derive(Deserialize)，', en: 'derive Deserialize on a struct,', say_zh: '结构体加上派生反序列化，'},
            {zh: 'get、send、json，一条链拿到数据。', en: 'then get, send, json: one chain and the data is yours.', say_zh: '再发请求、转结构体，一条链拿到数据。'}],
      build() {
        const row = (y, n, k, z, e, c, cap) => H(`<div class="r card" data-cap="${cap}" style="font-variant-ligatures:none;left:0;right:0;top:${y}px;height:160px;display:grid;grid-template-columns:70px 470px 1fr;align-items:center;padding:0 30px;gap:16px">
          <div class="mono" style="font-variant-ligatures:none;font-size:40px;font-weight:800;color:${c}">${n}</div><div class="mono" style="font-variant-ligatures:none;font-size:28px;font-weight:800;color:${c}">${k}</div><div style="font-variant-ligatures:none;font-size:30px">${T(z, e)}</div></div>`);
        row(30, '1', 'cargo add reqwest serde', '加依赖', 'add the crates', 'var(--acc)', 0);
        row(220, '2', '#[derive(Deserialize)]', '字段名 = JSON 的键', 'field names = JSON keys', 'var(--yel)', 1);
        row(410, '3', '.get().send()?.json()?', '发请求 → 结构体', 'request → struct', 'var(--acc2)', 2);
        H(`<div class="r card center mono" data-cap="2" data-delay="1.0" data-in="pop" style="font-variant-ligatures:none;left:60px;right:60px;top:620px;height:130px;border-color:var(--acc);font-size:36px;font-weight:800;gap:20px">
          <span class="blue">URL</span><span class="acc">→</span><span>JSON</span><span class="acc">→</span><span class="ty">struct</span></div>`);
      } },

    { title: ['Rust 20 课完结', 'All 20 Rust lessons: done'],
      cap: [{zh: '到这儿，Rust 20 课全部讲完了！', en: "That's it: all 20 Rust lessons are done!", say_zh: '到这儿，Rust 二十课全部讲完了！'},
            {zh: '20 课总结加一张学习路线图，', en: 'A one-page summary of all 20, plus a learning path,', say_zh: '二十课的总结，加一张学习路线图，', say_en: 'A one-page summary of all twenty, plus a learning path,'},
            ['马上做成一篇图文笔记，记得收藏。', 'is coming soon as an illustrated post. Save it!']],
      build() {
        H(`<div class="r" data-cap="0" style="font-variant-ligatures:none;left:180px;width:600px;top:30px;display:grid;grid-template-columns:repeat(5,1fr);gap:16px">
          ${Array.from({length: 20}, (_, i) => `<div class="card mono center" style="font-variant-ligatures:none;height:84px;font-size:30px;font-weight:800;border-color:var(--acc2);color:var(--acc2)">${i + 1}</div>`).join('')}</div>`);
        H(`<div class="r" data-cap="0" data-delay="1.0" data-in="stamp" style="font-variant-ligatures:none;left:0;right:0;top:440px;text-align:center"><span class="h acc" style="font-variant-ligatures:none;font-size:60px">${T('完结 ✓', 'Complete ✓')}</span></div>`);
        H(`<div class="r card" data-cap="1" data-in="pop" style="font-variant-ligatures:none;left:80px;right:80px;top:560px;height:240px;border-color:var(--acc);text-align:center;padding-top:36px">
          <div class="s" style="font-variant-ligatures:none;font-size:30px">${T('下一篇 · 图文笔记', 'Next · illustrated post')}</div>
          <div class="h" style="font-variant-ligatures:none;font-size:${LANG === "zh" ? 46 : 40}px;margin-top:18px">${T('一页总结 + 学习路线', 'One-page summary + learning path')}</div></div>`);
      } },

    { title: ['考考你', 'Quick quiz'],   // comment quiz; answer in meta.json quiz (verified against the live API: missing field `stars`)
      cap: [{zh: '考考你：字段名改成 stars，会怎样？', en: 'Quick quiz: the field is renamed to stars. What happens?', say_zh: '考考你：字段名改成这样，会怎样？'},
            {zh: 'A 还是 B？评论区告诉我。', en: 'A or B? Tell me in the comments.'}],
      build() {
        H(`<div class="r card mono" data-cap="0" data-in="pop" style="font-variant-ligatures:none;left:0;right:0;top:30px;padding:28px 40px;font-size:30px;line-height:1.75">${code(`#[derive(Deserialize)]
struct Repo {
    full_name: String,
    stars: u32,
}
// JSON: "stargazers_count": 121083`)}</div>`);
        H(`<div class="r" data-cap="1" style="font-variant-ligatures:none;left:0;right:0;top:430px;display:flex;gap:40px;justify-content:center">
          <div class="card center h" style="font-variant-ligatures:none;width:420px;height:130px;font-size:36px;border-color:var(--blue)">A · ${T('拿到 121083', 'gets 121083')}</div>
          <div class="card center h" style="font-variant-ligatures:none;width:420px;height:130px;font-size:36px;border-color:var(--acc)">B · ${T('返回 Err', 'returns Err')}</div></div>`);
        H(`<div class="r h acc" data-cap="1" data-delay="0.6" style="font-variant-ligatures:none;left:0;right:0;top:630px;text-align:center;font-size:52px">${T('答案评论区见 ↓', 'Answer in the comments ↓')}</div>`);
      } },
  ],
};
