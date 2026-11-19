// 生活里的技术 · 试播第 1 期：付款时转圈又点一次，会扣两次钱吗？
// Scene 1 is drawn with at(-1): already on screen at t = 0, so the first word lands on the spinning payment page.
const LIFE_C = '#0F8B8D';   // series colour (teal): the system side, order numbers, the key term; same on the cover
function lifeRound(x, y, w, h, r) {
  return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} ` +
         `H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}
function lifePhone(x, y, w, h, col) {
  return group(() => { path(lifeRound(x, y, w, h, 34), { stroke: col || INK, strokeWidth: 5, roughness: 1 });
    line(x + w * 0.38, y + 22, x + w * 0.62, y + 22, { strokeWidth: 5, roughness: 0.6 }); });
}
function lifeSpin(cx, cy, r, col) {
  return group(() => { path(`M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx} ${cy - r}`, { stroke: col || BLU, strokeWidth: 8, roughness: 0.7 });
    circle(cx, cy - r, 14, { stroke: col || BLU, fill: col || BLU, fillStyle: 'solid', roughness: 0.5 }); });
}
function lifeServer(x, y, w, h, label, col) {
  col = col || LIFE_C;
  return group(() => { box(x, y, w, h, { stroke: col, strokeWidth: 5, fill: '#E3F3F2', fillStyle: 'solid', roughness: 1.1 });
    for (let i = 1; i <= 2; i++) line(x + 20, y + h * i / 3, x + w - 20, y + h * i / 3, { stroke: col, strokeWidth: 3 });
    if (label) T(x + w / 2, y + h + 50, label, 42, col); });
}
function lifeTicket(x, y, w, h, text, size) {
  return group(() => { box(x, y, w, h, { stroke: LIFE_C, strokeWidth: 5, fill: '#fff', fillStyle: 'solid', roughness: 1 });
    line(x + 26, y + 12, x + 26, y + h - 12, { stroke: LIFE_C, strokeWidth: 3, strokeLineDash: [8, 8] });
    T(x + w / 2 + 12, y + h / 2 + (size || 44) * 0.35, text, size || 44, LIFE_C); });
}

function lifeStrike(x, y, w) { return line(x - w / 2, y - 12, x + w / 2, y - 20, { stroke: RED, strokeWidth: 6, roughness: 1 }); }   // cross out a word

window.EPISODE = {
  n: 1, font: 'Patrick Hand',
  scenes: [
    // 1 — hook: the spinning payment page, tapped again
    { title: ['付款一直转圈，', '又点了一次？'],
      cap: [{ zh: '付钱的时候手机一直转圈，' },
            { zh: '你又点了一次，为什么钱只扣了一次？' },
            { zh: '其实你第一次点下去，钱可能已经扣了。' }],
      draw() {
        at(-1); lifePhone(390, 10, 300, 600);
        T(540, 105, '付款', 46);
        T(540, 190, '¥ 25.00', 60);
        lifeSpin(540, 330, 62, BLU);
        T(540, 450, '支付中…', 42, GRY);
        lbox(420, 500, 240, 80, '确认付款', { size: 40, stroke: BLU, color: BLU, fill: LBLU, fillStyle: 'solid' });
        at(0, 0.3); T(190, 280, '一直转圈…', 48, DRED); arrow(290, 300, 455, 330, { color: DRED });
        at(1); ring(540, 540, 330, 130, RED);
        T(870, 470, '又点一次', 50, RED); T(870, 560, '×2', 76, RED);
        at(2); note(130, 660, 820, 130, '第一次点下去，钱可能已经扣了', 48);
      } },
    // 2 — payment is a round trip; the reply half can get lost
    { title: ['付款', '是一个来回'],
      cap: [{ zh: '付款要走一个来回。' },
            { zh: '手机先把请求发给支付系统，' },
            { zh: '系统扣完钱，' },
            { zh: '再把“成功”发回你的手机。' },
            { zh: '要是网络正好卡在回来这一半，' },
            { zh: '你看到的就是一直转圈，' },
            { zh: '可那边早就扣完了。' }],
      draw() {
        at(0); lifePhone(60, 170, 210, 400); T(165, 630, '你的手机', 42);
        lifeServer(790, 220, 250, 210, '支付系统');
        at(1); arrow(285, 290, 775, 290, { color: BLU, width: 5 }); T(530, 260, '① 请求：付款', 42, BLU);
        at(2); T(915, 360, '扣款 ✓', 48, GRN);
        at(3); arrow(775, 420, 285, 420, { color: GRN, width: 5 }); T(530, 480, '② 回复：成功', 42, GRN);
        at(4); cross(530, 420, 80, RED); T(530, 560, '网络卡在回来这一半', 44, RED);
        at(5); lifeSpin(165, 360, 48, BLU); T(165, 700, '一直转圈', 44, DRED);
        at(6); ring(915, 345, 220, 100, RED); T(700, 760, '那边早就扣完了', 56, DRED); underline(500, 900, 780);
      } },
    // 3 — the second request: how does the system know it's the same payment? the order number
    { title: ['凭什么认出', '是同一笔？'],
      cap: [{ zh: '那你再点一次，又一个请求到了，' },
            { zh: '系统凭什么知道这是同一笔，' },
            { zh: '而不是你想再付一笔？' },
            { zh: '靠的是订单号。' },
            { zh: '你点付款之前，' },
            { zh: '这笔订单就已经有了一个编号。' },
            { zh: '在同一个付款页面里，不管你点几次，' },
            { zh: '发出去的都是这个编号。' }],
      draw() {
        at(0); lifePhone(60, 330, 200, 380);
        lifeServer(800, 360, 240, 200, '支付系统');
        arrow(275, 430, 785, 430, { color: GRY, width: 4 }); T(470, 405, '第一次', 38, GRY);
        arrow(275, 560, 785, 560, { color: BLU, width: 5 }); T(470, 535, '第二次', 38, BLU);
        at(1); T(920, 320, '同一笔？', 46, DRED);
        at(2); T(920, 660, '还是再付一笔？', 42, DRED);
        at(3); lifeTicket(300, 40, 480, 120, '订单号 8302', 56);
        at(4); T(160, 120, '付款之前', 42, LIFE_C);
        at(5); arrow(160, 145, 160, 315, { color: LIFE_C }); T(540, 225, '这笔订单早就有了编号', 40, LIFE_C);
        at(6); lifeTicket(560, 455, 190, 66, '8302', 36);
        at(7); lifeTicket(560, 585, 190, 66, '8302', 36); T(655, 700, '点几次都是同一个号', 40, LIFE_C);
      } },
    // 4 — check first, then charge
    { title: ['先查编号，', '再扣钱'],
      cap: [{ zh: '所以系统收到请求，第一件事不是扣钱，' },
            { zh: '而是先查这个编号付过没有。' },
            { zh: '付过了，就不再扣，直接告诉你，' },
            { zh: '上次已经付成功了。' }],
      draw() {
        at(0); lbox(290, 20, 500, 110, '收到请求：8302', { size: 48, stroke: BLU, color: BLU });
        T(915, 92, '直接扣钱？', 44, GRY); lifeStrike(915, 92, 230);
        at(1); arrow(540, 135, 540, 215, { color: LIFE_C });
        lbox(220, 220, 640, 120, '先查：8302 付过没有？', { size: 48, stroke: LIFE_C, color: LIFE_C, fill: '#E3F3F2', fillStyle: 'solid' });
        at(1, 1.2); arrow(330, 345, 230, 460, { color: GRY }); T(220, 520, '没付过', 42, GRY); T(220, 580, '扣钱，记一笔', 38, GRY);
        at(2); arrow(750, 345, 850, 460, { color: GRN, width: 5 }); T(850, 520, '付过了', 46, GRN); T(850, 585, '不再扣', 46, GRN);
        at(3); note(380, 650, 640, 130, '回复你：上次已经付成功了 ✓', 44);
      } },
    // 5 — two requests at the same moment: one order number, one ledger entry
    { title: ['两次同时到，', '怎么办？'],
      cap: [{ zh: '可要是两次请求几乎同时到，' },
            { zh: '两边一查都还没付，怎么办？' },
            { zh: '所以记账还有一条死规矩，' },
            { zh: '一个订单号只能记一笔。' },
            { zh: '先到的那次记上了，' },
            { zh: '后到的那次写不进去，钱也就扣不下来。' }],
      draw() {
        at(0); lbox(40, 110, 270, 100, '请求 8302', { size: 44, stroke: BLU, color: BLU });
        lbox(40, 430, 270, 100, '请求 8302', { size: 44, stroke: BLU, color: BLU });
        T(175, 320, '几乎同时', 42, DRED);
        at(1); T(420, 150, '查：没付', 40, RED); T(420, 410, '查：没付', 40, RED);
        at(2); box(600, 40, 440, 560, { stroke: LIFE_C, strokeWidth: 5 }); T(820, 110, '账本', 52, LIFE_C);
        line(620, 140, 1020, 140, { stroke: LIFE_C, strokeWidth: 3 });
        at(3); T(820, 210, '一个订单号只记一笔', 40, LIFE_C); underline(650, 990, 228, LIFE_C);
        at(4); arrow(315, 180, 610, 310, { color: GRN, width: 5 });
        lbox(640, 280, 360, 90, '8302 · 已记 ✓', { size: 44, stroke: GRN, color: GRN, fill: LGRN, fillStyle: 'solid' });
        at(5); arrow(315, 480, 600, 450, { color: RED, width: 5 }); cross(600, 450, 70, RED);
        T(820, 470, '写不进去', 48, RED); T(820, 540, '钱扣不下来', 44, RED);
        T(540, 720, '先到的记上，后到的进不来', 52, INK);
      } },
    // 6 — the result has a name: idempotent
    { title: ['点一次和点十次，', '结果一样'],
      cap: [{ zh: '这样一来，同一笔付款，' },
            { zh: '点一次和点十次，结果都一样。' },
            { zh: '程序员管这个叫幂等。' }],
      draw() {
        at(0); lifeTicket(370, 20, 340, 100, '8302', 52);
        at(1); lbox(60, 180, 380, 120, '点 1 次', { size: 56 });
        arrow(250, 305, 250, 385); T(250, 450, '扣 1 笔', 56, GRN);
        T(540, 330, '=', 100, INK);
        lbox(640, 180, 380, 120, '点 10 次', { size: 56 });
        arrow(830, 305, 830, 385); T(830, 450, '扣 1 笔', 56, GRN);
        at(2); lbox(340, 540, 400, 150, '幂等', { size: 96, stroke: LIFE_C, color: LIFE_C, strokeWidth: 6, fill: '#E3F3F2', fillStyle: 'solid' });
        T(540, 770, '同一件事做几次，结果都一样', 44, LIFE_C);
      } },
    // 7 — what it can't catch: leaving and scanning again makes a new order
    { title: ['它只认', '同一个订单号'],
      cap: [{ zh: '不过它只认同一个订单号。' },
            { zh: '你要是退出去重新扫码、重新输金额，' },
            { zh: '那就是一笔新订单，真会再扣一次。' },
            { zh: '所以下次付款转圈，先别急着重扫，' },
            { zh: '去账单里看一眼扣没扣。' }],
      draw() {
        at(0); T(270, 50, '同一个页面再点', 44); lifeTicket(130, 90, 280, 90, '8302', 48);
        T(270, 260, '只扣一次', 48, GRN); check(400, 245, 50);
        at(1); T(810, 50, '退出去重新扫码', 44, DRED); T(810, 110, '重新输金额', 40, DRED);
        at(2); lifeTicket(640, 140, 340, 90, '新订单 6930', 40); T(810, 300, '真会再扣一次', 48, RED); cross(990, 285, 50, RED);
        line(540, 30, 540, 330, { stroke: GRY, strokeWidth: 3, strokeLineDash: [10, 10] });
        at(3); note(90, 400, 900, 140, '付款转圈：先别急着重扫', 56);
        at(4); doc(230, 590, 130, 170); T(640, 690, '去账单里看一眼扣没扣', 48, LIFE_C); check(960, 670, 56);
      } },
    // 8 — send it to someone + A/B question
    { title: ['付款转圈，', '你会怎么做？'],
      cap: [{ zh: '下次家里谁付款卡住了想重扫，' },
            { zh: '把这条发给他。' },
            { zh: '你遇到付款转圈，是 A 先等一等，', say_zh: '你遇到付款转圈，是A先等一等，' },
            { zh: '还是 B 马上再点一次？', say_zh: '还是B马上再点一次？' }],
      draw() {
        at(0); person(200, 380, 260, INK); lifePhone(270, 170, 120, 220); lifeSpin(330, 280, 30, BLU);
        T(200, 450, '想重扫的家人', 42);
        at(1); carrow([[460, 260], [620, 200], [780, 260]], { color: LIFE_C, width: 5 }); T(860, 290, '发给他', 56, LIFE_C);
        at(2); lbox(60, 560, 450, 130, 'A  先等一等', { size: 54, stroke: GRN, color: GRN, fill: LGRN, fillStyle: 'solid' });
        at(3); lbox(570, 560, 450, 130, 'B  马上再点', { size: 54, stroke: RED, color: DRED, fill: LRED, fillStyle: 'solid' });
        T(540, 780, '你选哪个？', 50, INK);
      } },
  ],
};
