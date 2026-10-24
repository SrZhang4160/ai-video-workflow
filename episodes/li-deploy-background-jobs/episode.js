// LinkedIn deep dive: why deploys lose or repeat background jobs, and 4 fixes. English only.
const W = 960;
const card = (x, y, w, h, inner, extra = '') =>
  `<div class="r card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">${inner}</div>`;
const job = (label, color = 'var(--yel)') =>
  `<span style="display:inline-flex;align-items:center;gap:10px;background:#20242D;border:2px solid ${color};border-radius:14px;padding:10px 18px;font-family:JBM;font-size:28px;color:${color}">${icon('box', 30, color)}${label}</span>`;
const big = (text, size = 44, color = 'var(--ink)') => `<div style="font-size:${size}px;font-weight:800;color:${color};line-height:1.2">${text}</div>`;
const small = (text, size = 26) => `<div style="font-size:${size}px;color:var(--quiet);line-height:1.35;margin-top:8px">${text}</div>`;
const arrow = (x, y, w, color = '#4A5160', cap, delay) =>
  `<svg class="r" ${cap !== undefined ? `data-cap="${cap}"` : ''} ${delay ? `data-delay="${delay}"` : ''} data-in="left" style="left:${x}px;top:${y}px" width="${w}" height="40"><path d="M2 20H${w - 14}" stroke="${color}" stroke-width="4" stroke-linecap="round"/><path d="M${w - 22} 8l16 12-16 12" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

window.EPISODE = {
  n: 0,
  tag: ['', 'Backend · Reliability'],
  scenes: [
    { title: ['', 'Why deploys lose or repeat background jobs'],
      cap: [{en: 'You ship a new release.'},
            {en: 'A background job runs twice.'},
            {en: 'Your customer gets charged twice.'}],
      build() {
        H(card(0, 40, 300, 300, `<div class="center" style="flex-direction:column;height:100%;gap:18px">${icon('rocket', 110, 'var(--acc)')}${big('Deploy v2', 38)}</div>`, 'border-color:var(--acc)'))
          .dataset.cap = 0;
        const j = H(`<div class="r" data-cap="1" data-in="pop" style="left:330px;top:150px">${job('charge $20')}</div>`);
        H(`<div class="r" data-cap="1" data-delay="0.5" data-in="pop" style="left:330px;top:240px">${job('charge $20', 'var(--red)')}</div>`);
        H(card(660, 40, 300, 420, `<div style="padding:26px 28px;font-family:JBM">
            <div style="font-size:26px;color:var(--quiet)">RECEIPT</div>
            <div style="font-size:30px;margin-top:22px;display:flex;justify-content:space-between"><span>Plan</span><span>$20</span></div>
            <div style="font-size:30px;margin-top:14px;display:flex;justify-content:space-between;color:var(--red)"><span>Plan</span><span>$20</span></div>
            <div style="border-top:2px dashed var(--line);margin-top:22px;padding-top:16px;font-size:34px;font-weight:800;display:flex;justify-content:space-between"><span>Total</span><span class="red">$40</span></div></div>`)).dataset.cap = 2;
        H(`<div class="r" data-cap="2" data-delay="0.6" data-in="stamp" style="left:720px;top:470px;transform:rotate(-8deg);border:5px solid var(--red);color:var(--red);border-radius:14px;padding:6px 22px;font-size:46px;font-weight:900;font-family:JBM">×2</div>`);
        H(`<div class="r" data-cap="2" data-delay="1.2" style="left:0;right:0;top:640px;text-align:center">${big('Two problems. Four fixes.', 48, 'var(--acc)')}</div>`);
      } },

    { title: ['', 'Problem 1 · Old and new code run at the same time'],
      cap: [{en: 'Problem one: during a deploy,'},
            {en: 'old and new code run at the same time.'},
            {en: "New code sends a job that an old worker can't understand."}],
      build() {
        H(card(0, 60, 260, 230, `<div class="center" style="flex-direction:column;height:100%;gap:14px">${icon('rocket', 70, 'var(--blue)')}${big('New app', 34)}${badge('v2', 'var(--blue)')}</div>`, 'border-color:var(--blue)')).dataset.cap = 1;
        H(card(700, 60, 260, 230, `<div class="center" style="flex-direction:column;height:100%;gap:14px">${icon('gear', 70, 'var(--quiet)')}${big('Old worker', 34)}${badge('v1', 'var(--quiet)')}</div>`)).dataset.cap = 1;
        H(`<div class="r" data-cap="1" data-delay="0.3" style="left:290px;top:140px;width:380px;height:80px;border:3px dashed #4A5160;border-radius:40px"></div>`);
        H(`<div class="r" data-cap="1" data-delay="0.35" style="left:375px;top:100px;font-size:24px;color:var(--quiet)">queue</div>`);
        H(`<div class="r" data-cap="2" data-in="left" data-move="250,0,1.2" style="left:250px;top:152px">${job('job v2', 'var(--blue)')}</div>`);
        H(`<div class="r" data-cap="2" data-delay="2.0" data-in="stamp" data-shake="1" style="left:800px;top:20px">${icon('cross', 90, 'var(--red)')}</div>`);
        H(card(140, 380, 680, 200, `<div style="padding:28px 34px;font-family:JBM;font-size:28px;line-height:1.7">
            <div class="red">KeyError: 'currency'</div><div class="cm">worker v1 doesn't know the v2 job format</div></div>`, 'border-color:var(--red)')).dataset.cap = 2;
        H(`<div class="r" data-cap="2" data-delay="2.6" style="left:0;right:0;top:640px;text-align:center">${small('Mixed versions are normal during any rolling deploy.', 30)}</div>`);
      } },

    { title: ['', 'Problem 2 · The work is done, then a crash'],
      cap: [{en: 'Problem two: a worker finishes the work,'},
            {en: 'crashes before it records "done",'},
            {en: 'and the retry does it again.'}],
      build() {
        const step = (x, ic, color, t1, t2) => card(x, 120, 215, 290,
          `<div class="center" style="flex-direction:column;height:100%;gap:12px;padding:0 12px">${icon(ic, 72, color)}${big(t1, 30)}${small(t2, 22)}</div>`, `border-color:${color}`);
        H(step(0, 'card', 'var(--acc2)', 'Charge card', 'payment API ✓')).dataset.cap = 0;
        H(arrow(218, 245, 32, '#4A5160', 1));
        const c = H(step(248, 'boom', 'var(--red)', 'Crash', 'before "done" is saved')); c.dataset.cap = 1; c.dataset.in = 'pop'; c.dataset.shake = '1';
        H(arrow(466, 245, 32, '#4A5160', 2));
        H(step(496, 'retry', 'var(--yel)', 'Retry', 'job looks unfinished')).dataset.cap = 2;
        H(arrow(714, 245, 32, '#4A5160', 2, 0.8));
        const d = H(step(745, 'card', 'var(--red)', 'Charge again', 'same $20, twice')); d.dataset.cap = 2; d.dataset.delay = '1.0';
        H(`<div class="r" data-cap="2" data-delay="1.8" style="left:0;right:0;top:500px;text-align:center">${big('The effect happened. The record of it didn\'t.', 38, 'var(--acc)')}</div>`);
      } },

    { title: ['', 'Graceful shutdown is not enough'],
      cap: [{en: 'Graceful shutdown helps planned deploys.'},
            {en: "It can't stop crashes, or fix version mismatches."}],
      build() {
        H(card(0, 60, 465, 340, `<div style="padding:34px">${icon('check', 64, 'var(--acc2)')}${big('Helps', 40, 'var(--acc2)')}
            ${small('Planned deploys: running jobs get time to finish before the worker stops.', 28)}</div>`, 'border-color:var(--acc2)')).dataset.cap = 0;
        H(card(495, 60, 465, 340, `<div style="padding:34px">${icon('cross', 64, 'var(--red)')}${big("Doesn't help", 40, 'var(--red)')}
            ${small('Crashes, OOM kills, lost machines.', 28)}${small('New jobs reaching old workers.', 28)}</div>`, 'border-color:var(--red)')).dataset.cap = 1;
        H(`<div class="r" data-cap="1" data-delay="1.4" style="left:0;right:0;top:470px;text-align:center">${big('So here are four fixes.', 44, 'var(--acc)')}</div>`);
      } },

    { title: ['', 'Fix 1 · Deploy support before behavior'],
      cap: [{en: 'Fix one: deploy support before behavior.'},
            {en: 'First, workers that understand old and new jobs.'},
            {en: 'Then, let producers send the new format.'}],
      build() {
        H(`<div class="r" data-cap="0" data-in="pop" style="left:0;top:20px">${num(1)}</div>`);
        H(`<div class="r" data-cap="0" style="left:80px;top:24px">${big('Two-phase deploy', 40)}</div>`);
        H(card(0, 130, 960, 190, `<div style="display:flex;align-items:center;gap:28px;padding:30px 34px">${badge('Step 1', 'var(--acc2)', 28)}${icon('gear', 72, 'var(--acc2)')}
            <div>${big('Workers read v1 + v2', 36)}${small('ship the reader first, nothing sends v2 yet', 24)}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        H(card(0, 360, 960, 190, `<div style="display:flex;align-items:center;gap:28px;padding:30px 34px">${badge('Step 2', 'var(--blue)', 28)}${icon('rocket', 72, 'var(--blue)')}
            <div>${big('Producers start sending v2', 36)}${small('only after every worker can read it', 24)}</div></div>`, 'border-color:var(--blue)')).dataset.cap = 2;
        H(`<div class="r" data-cap="2" data-delay="1.2" data-in="stamp" style="left:860px;top:600px">${icon('check', 80, 'var(--acc2)')}</div>`);
        H(`<div class="r" data-cap="2" data-delay="0.8" style="left:0;top:620px">${src('AWS deployment guidance')}</div>`);
      } },

    { title: ['', 'Fix 2 · Put a version on every job'],
      cap: [{en: 'Fix two: put a version on every job.'},
            {en: 'Keep handlers for older versions,'},
            {en: 'or route them to separate queues.'}],
      build() {
        H(`<div class="r" data-cap="0" data-in="pop" style="left:0;top:20px">${num(2)}</div>`);
        H(`<div class="r card mono" data-cap="0" style="left:0;top:110px;width:400px;padding:28px 30px;font-size:28px;line-height:1.7">${code(`{
  "task": "charge",
  "version": 2,
  "amount": 20,
  "currency": "USD"
}`)}</div>`);
        H(card(470, 110, 490, 150, `<div style="display:flex;align-items:center;gap:20px;padding:0 28px;height:100%">${icon('gear', 60, 'var(--acc2)')}<div>${big('One worker', 32)}${small('handles v1 and v2', 24)}</div></div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        H(`<div class="r" data-cap="2" style="left:470px;top:300px;font-size:26px;color:var(--quiet)">or, when they can't coexist:</div>`);
        H(card(470, 350, 490, 110, `<div style="display:flex;align-items:center;gap:16px;padding:0 24px;height:100%">${badge('v1', 'var(--quiet)')}<span class="mono" style="font-size:28px">queue-v1 → old workers</span></div>`)).dataset.cap = 2;
        const q2 = H(card(470, 480, 490, 110, `<div style="display:flex;align-items:center;gap:16px;padding:0 24px;height:100%">${badge('v2', 'var(--blue)')}<span class="mono" style="font-size:28px">queue-v2 → new workers</span></div>`, 'border-color:var(--blue)'));
        q2.dataset.cap = 2; q2.dataset.delay = '0.5';
        H(`<div class="r" data-cap="2" data-delay="1.0" style="left:0;top:640px">${src('GitLab job versioning')}</div>`);
      } },

    { title: ['', 'Fix 3 · Give each operation a stable ID'],
      cap: [{en: 'Fix three: give each operation a stable ID.'},
            {en: "On retry, check the ID, and skip work that's already done."}],
      build() {
        H(`<div class="r" data-cap="0" data-in="pop" style="left:0;top:20px">${num(3)}</div>`);
        H(`<div class="r" data-cap="0" style="left:80px;top:24px">${big('Idempotency key', 40)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.6" data-in="left" style="left:0;top:140px">${job('op_id = charge-8f2', 'var(--yel)')}</div>`);
        H(card(560, 120, 400, 300, `<div style="padding:26px 30px;font-family:JBM">
            <div style="display:flex;align-items:center;gap:12px;font-size:26px;color:var(--quiet)">${icon('db', 34, 'var(--quiet)')}done operations</div>
            <div style="font-size:28px;margin-top:22px">charge-7c1 <span class="ok">✓</span></div>
            <div style="font-size:28px;margin-top:10px">charge-8f2 <span class="ok">✓</span></div>
            <div style="font-size:28px;margin-top:10px;color:var(--quiet)">email-31a ✓</div></div>`)).dataset.cap = 0;
        H(`<div class="r" data-cap="1" data-in="left" style="left:0;top:300px">${job('retry: charge-8f2', 'var(--red)')}</div>`);
        H(arrow(420, 316, 120, 'var(--yel)', 1, 0.6));
        H(card(0, 480, 960, 130, `<div style="display:flex;align-items:center;gap:22px;padding:0 34px;height:100%">${icon('shield', 70, 'var(--acc2)')}${big('Already done → skip. No second charge.', 36, 'var(--acc2)')}</div>`, 'border-color:var(--acc2)'))
          .dataset.cap = 1;
        H(`<div class="r" data-cap="1" data-delay="1.6" style="left:0;top:650px">${src('AWS: making retries safe with idempotent APIs')}</div>`);
      } },

    { title: ['', 'Fix 4 · Assume every job can run twice'],
      cap: [{en: 'Fix four: assume every job can run twice.'},
            {en: 'And keep old workers until the old jobs are gone.'}],
      build() {
        H(`<div class="r" data-cap="0" data-in="pop" style="left:0;top:20px">${num(4)}</div>`);
        H(`<div class="r" data-cap="0" style="left:80px;top:24px">${big('At-least-once, not exactly-once', 40)}</div>`);
        H(`<div class="r" data-cap="0" data-delay="0.5" data-in="pop" style="left:0;right:0;top:120px;text-align:center"><span style="font-family:JBM;font-size:120px;font-weight:900;color:var(--acc)">×2</span>
          ${small('a job can finish, then run again if its "done" signal is lost', 26)}</div>`);
        H(card(0, 400, 960, 170, `<div style="display:flex;align-items:center;gap:22px;padding:0 30px;height:100%">${icon('gear', 64, 'var(--quiet)')}
            <div style="flex:1">${big('Old workers stay up', 34)}${small('until queued, running, scheduled and retrying v1 jobs reach zero', 24)}</div>
            <div style="display:flex;gap:8px">${badge('v1', 'var(--quiet)')}${badge('v1', 'var(--quiet)')}${badge('v1', 'var(--quiet)')}</div></div>`)).dataset.cap = 1;
        H(`<div class="r" data-cap="1" data-delay="1.4" style="left:0;top:620px">${src('Sidekiq best practices')}</div>`);
      } },

    { title: ['', 'The takeaway'],
      cap: [{en: 'Versioning stops incompatible execution.'},
            {en: 'Idempotency stops repeated effects.'},
            {en: 'You need both.'},
            {en: 'How does your team deploy workers?'}],
      build() {
        H(card(0, 30, 465, 330, `<div style="padding:34px">${badge('Versioning', 'var(--blue)', 30)}${big('stops incompatible execution', 36)}${small('right code for the right job', 26)}</div>`, 'border-color:var(--blue)')).dataset.cap = 0;
        H(card(495, 30, 465, 330, `<div style="padding:34px">${badge('Idempotency', 'var(--acc2)', 30)}${big('stops repeated effects', 36)}${small('a retry can\'t do the work twice', 26)}</div>`, 'border-color:var(--acc2)')).dataset.cap = 1;
        H(`<div class="r" data-cap="2" data-in="pop" style="left:0;right:0;top:400px;text-align:center">${big('You need both.', 64, 'var(--acc)')}</div>`);
        H(`<div class="r" data-cap="2" data-delay="0.6" style="left:0;right:0;top:500px;text-align:center">${small('Even workflow engines like Temporal ask for idempotent activities.', 26)}</div>`);
        H(card(130, 590, 700, 120, `<div class="center" style="height:100%;gap:18px">${icon('user', 44, 'var(--acc)')}${big('How does your team deploy workers?', 32)}</div>`, 'border-color:var(--acc)')).dataset.cap = 3;
      } },
  ],
};
