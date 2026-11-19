// 生活里的技术 · 试播第 2 期：演唱会抢票，那一秒服务器在干什么？
// Scene 1 is drawn with at(-1): already on screen at t = 0, so the first word lands on the crowd and the ticket pile.
const LIFE_C = '#0F8B8D';   // series colour (teal): the system side and the key terms; same on the cover
function lifeRound(x, y, w, h, r) {
  return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} ` +
         `H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}
function lifePhone(x, y, w, h, col) {
  return group(() => { path(lifeRound(x, y, w, h, 30), { stroke: col || INK, strokeWidth: 5, roughness: 1 });
    line(x + w * 0.38, y + 20, x + w * 0.62, y + 20, { strokeWidth: 5, roughness: 0.6 }); });
}
function lifeServer(x, y, w, h, label, col) {
  col = col || LIFE_C;
  return group(() => { box(x, y, w, h, { stroke: col, strokeWidth: 5, fill: '#E3F3F2', fillStyle: 'solid', roughness: 1.1 });
    for (let i = 1; i <= 2; i++) line(x + 20, y + h * i / 3, x + w - 20, y + h * i / 3, { stroke: col, strokeWidth: 3 });
    if (label) T(x + w / 2, y + h + 50, label, 42, col); });
}
function lifeTicket(x, y, w, h, text, size, col) {
  col = col || LIFE_C;
  return group(() => { box(x, y, w, h, { stroke: col, strokeWidth: 5, fill: '#fff', fillStyle: 'solid', roughness: 1 });
    line(x + 26, y + 12, x + 26, y + h - 12, { stroke: col, strokeWidth: 3, strokeLineDash: [8, 8] });
    T(x + w / 2 + 12, y + h / 2 + (size || 44) * 0.35, text, size || 44, col); });
}
// crowd: rows of small heads (one element)
function lifeCrowd(x, y, cols, rows, gap, col) {
  return group(() => { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    circle(x + c * gap + (r % 2) * gap / 2, y + r * gap * 0.9, gap * 0.55, { stroke: col || INK, strokeWidth: 3, roughness: 1.2 }); });
}

function lifeStrike(x, y, w) { return line(x - w / 2, y - 12, x + w / 2, y - 20, { stroke: RED, strokeWidth: 6, roughness: 1 }); }   // cross out a word

window.EPISODE = {
  n: 2, font: 'Patrick Hand',
  scenes: [
    // 1 — hook: a million people, ten thousand tickets, one second
    { title: ['一万张票，', '一百万人同时点'],
      cap: [{ zh: '演唱会一万张票，一百万人同时点，' },
            { zh: '那一秒里发生了什么？' },
            { zh: '一百万人抢一万张，' },
            { zh: '至少九十九万人注定抢不到。' },
            { zh: '所以那一秒，系统最要紧的不是卖得快，' },
            { zh: '而是一张都不能多卖。' }],
      draw() {
        at(-1); lifeCrowd(70, 70, 8, 6, 58, INK);
        T(290, 420, '一百万人', 56);
        arrow(540, 230, 690, 230, { color: RED, width: 6 }); arrow(540, 300, 690, 300, { color: RED, width: 6 });
        lifeTicket(730, 120, 300, 90, '演唱会门票', 42, DRED); lifeTicket(745, 225, 300, 90, '演唱会门票', 42, DRED);
        T(890, 400, '一万张', 56, DRED);
        at(1); T(615, 160, '那一秒？', 46, RED);
        at(2, 0.3); line(40, 480, 1040, 480, { stroke: GRY, strokeWidth: 3, strokeLineDash: [10, 10] });
        at(3); T(540, 570, '至少九十九万人抢不到', 60, RED);
        at(4); T(270, 705, '卖得快', 56, GRY); lifeStrike(270, 705, 200);
        at(5); lbox(520, 625, 500, 120, '一张都不能多卖', { size: 56, stroke: LIFE_C, color: LIFE_C, strokeWidth: 6, fill: '#E3F3F2', fillStyle: 'solid' });
      } },
    // 2 — overselling: two people each check "one left"
    { title: ['为什么', '会多卖？'],
      cap: [{ zh: '为什么会多卖？' },
            { zh: '假设只剩最后一张，你和另一个人同时点。' },
            { zh: '如果系统给你们俩各查各的，' },
            { zh: '查到的都是“还剩一张”，' },
            { zh: '就会给你们俩都出票。' },
            { zh: '一个座位卖给了两个人，这就叫超卖。' }],
      draw() {
        at(1); lifeTicket(370, 20, 340, 100, '最后一张', 48, DRED);
        person(140, 400, 220, BLU, '你'); person(940, 400, 220, INK, '另一个人');
        at(2); arrow(230, 280, 360, 280, { color: BLU }); lbox(365, 220, 160, 110, '查', { size: 50, stroke: BLU, color: BLU });
        arrow(850, 280, 720, 280); lbox(555, 220, 160, 110, '查', { size: 50 });
        at(3); T(445, 400, '还剩一张', 40, BLU); T(635, 400, '还剩一张', 40, INK);
        at(4); lifeTicket(150, 520, 300, 90, '出票 ✓', 44, BLU); lifeTicket(630, 520, 300, 90, '出票 ✓', 44, INK);
        at(5); T(540, 690, '一个座位 → 两个人', 52, RED);
        lbox(390, 720, 300, 100, '超卖', { size: 70, stroke: RED, color: RED, strokeWidth: 6 });
      } },
    // 3 — one counter, decremented one at a time
    { title: ['余票只记', '一个计数器'],
      cap: [{ zh: '所以余票不能让每个人各查各的。' },
            { zh: '系统会把剩几张记在一个计数器里，' },
            { zh: '来一个人就减一，' },
            { zh: '而且这个减法是一个一个排着做的。' },
            { zh: '减到零，后面的人直接看到“已售罄”。' },
            { zh: '最后那一张，只可能落到一个人手里。' }],
      draw() {
        at(0); T(270, 100, '各查各的', 50, GRY); lifeStrike(270, 100, 230);
        at(1); lbox(640, 130, 380, 200, '余票  3', { size: 80, stroke: LIFE_C, color: LIFE_C, strokeWidth: 6, fill: '#E3F3F2', fillStyle: 'solid' });
        T(830, 380, '计数器', 46, LIFE_C);
        at(2); person(100, 330, 150, INK); person(210, 330, 150, INK); person(320, 330, 150, INK); person(430, 330, 150, INK);
        arrow(500, 230, 630, 230, { color: LIFE_C, width: 5 }); T(565, 200, '−1', 44, LIFE_C);
        at(3); T(270, 440, '一个一个排着减', 46, LIFE_C);
        T(160, 560, '3', 70, INK); arrow(200, 545, 270, 545); T(310, 560, '2', 70, INK); arrow(350, 545, 420, 545);
        T(460, 560, '1', 70, INK); arrow(500, 545, 570, 545); T(610, 560, '0', 70, RED);
        at(4); lbox(690, 480, 330, 120, '已售罄', { size: 62, stroke: RED, color: RED, strokeWidth: 6 });
        at(5); note(140, 660, 800, 130, '最后一张，只落到一个人手里', 48);
      } },
    // 4 — the crowd is too big: a waiting queue lets people in batch by batch
    { title: ['先排队，', '再一批批放人'],
      cap: [{ zh: '可光有计数器还不够。' },
            { zh: '一百万人同时挤进来，' },
            { zh: '每放进一个人，都要给他选座、生成订单，' },
            { zh: '系统一下子扛不住。' },
            { zh: '所以很多购票平台会先让你' },
            { zh: '进一个等候队列，再一批一批放人进去。' },
            { zh: '你看到的“排队中”，就是这一步。' }],
      draw() {
        at(0); lifeServer(760, 60, 260, 200, '选座 · 生成订单');
        at(1); lifeCrowd(50, 60, 6, 4, 52, INK); T(190, 300, '一百万人', 46);
        at(2); arrow(370, 160, 745, 160, { color: RED, width: 6 }); arrow(370, 230, 745, 220, { color: RED, width: 6 });
        at(3); T(890, 380, '扛不住', 54, RED);
        at(4); box(60, 470, 560, 110, { stroke: LIFE_C, strokeWidth: 5 }); T(340, 455, '等候队列', 44, LIFE_C);
        at(5); lifeCrowd(95, 505, 9, 1, 58, INK); arrow(630, 525, 740, 525, { color: LIFE_C, width: 5 });
        T(880, 515, '一批一批', 46, LIFE_C); T(880, 570, '放进去', 46, LIFE_C);
        at(6); lifePhone(400, 620, 280, 200); T(540, 740, '排队中…', 44, BLU);
      } },
    // 5 — a ticket you got is held for payment; unpaid ones go back on sale
    { title: ['抢到了，', '还不算你的'],
      cap: [{ zh: '抢到了，也还不算你的。' },
            { zh: '系统会先把这张票给你锁住，等你付钱。' },
            { zh: '规定时间里没付，锁就解开，' },
            { zh: '票退回去重新卖。' },
            { zh: '所以开售过一会儿再刷新，' },
            { zh: '有时候还能捡到票，' },
            { zh: '这就是大家说的回流票。' }],
      draw() {
        at(0); lifeTicket(60, 60, 320, 100, '你抢到的票', 44, BLU);
        at(1); lock(460, 100, 70); T(720, 90, '锁住，等你付钱', 46, LIFE_C);
        at(2); T(290, 280, '规定时间里没付', 46, DRED); arrow(290, 305, 290, 380, { color: DRED }); T(290, 430, '锁解开', 48, DRED);
        at(3); carrow([[420, 420], [620, 470], [760, 380]], { color: LIFE_C, width: 5 });
        lbox(760, 250, 270, 140, '余票  +1', { size: 60, stroke: LIFE_C, color: LIFE_C, fill: '#E3F3F2', fillStyle: 'solid' });
        at(4); T(540, 560, '开售过一会儿，再刷新', 48, INK);
        at(5); T(540, 630, '有时候还能捡到票', 46, GRN);
        at(6); lbox(340, 680, 400, 120, '回流票', { size: 72, stroke: LIFE_C, color: LIFE_C, strokeWidth: 6 });
      } },
    // 6 — send it to someone + A/B question
    { title: ['没抢到，', '你会走吗？'],
      cap: [{ zh: '下次朋友没抢到票就想放弃，' },
            { zh: '把这条发给他。' },
            { zh: '你抢票是 A 一直刷到最后，', say_zh: '你抢票是A一直刷到最后，' },
            { zh: '还是 B 没抢到就走？', say_zh: '还是B没抢到就走？' }],
      draw() {
        at(0); person(200, 380, 260, INK); T(200, 450, '想放弃的朋友', 42);
        lifePhone(270, 170, 120, 220); T(330, 290, '售罄', 30, RED);
        at(1); carrow([[460, 260], [620, 200], [780, 260]], { color: LIFE_C, width: 5 }); T(860, 290, '发给他', 56, LIFE_C);
        at(2); lbox(60, 560, 450, 130, 'A  刷到最后', { size: 54, stroke: GRN, color: GRN, fill: LGRN, fillStyle: 'solid' });
        at(3); lbox(570, 560, 450, 130, 'B  没抢到就走', { size: 52, stroke: RED, color: DRED, fill: LRED, fillStyle: 'solid' });
        T(540, 780, '你选哪个？', 50, INK);
      } },
  ],
};
