// 生活里的技术 · 试播第 3 期：刷视频为什么不卡？它早就被放在你家附近了
// Scene 1 is drawn with at(-1): already on screen at t = 0, so the first word lands on the video next to your home.
const LIFE_C = '#0F8B8D';   // series colour (teal): servers and the key term; same on the cover
function lifeRound(x, y, w, h, r) {
  return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} ` +
         `H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}
function lifePhone(x, y, w, h, col) {
  return group(() => { path(lifeRound(x, y, w, h, 28), { stroke: col || INK, strokeWidth: 5, roughness: 1 });
    line(x + w * 0.38, y + 18, x + w * 0.62, y + 18, { strokeWidth: 5, roughness: 0.6 }); });
}
function lifeServer(x, y, w, h, label, col) {
  col = col || LIFE_C;
  return group(() => { box(x, y, w, h, { stroke: col, strokeWidth: 5, fill: '#E3F3F2', fillStyle: 'solid', roughness: 1.1 });
    for (let i = 1; i <= 2; i++) line(x + 16, y + h * i / 3, x + w - 16, y + h * i / 3, { stroke: col, strokeWidth: 3 });
    if (label) T(x + w / 2, y + h + 46, label, 40, col); });
}
function lifePlay(cx, cy, s, col) {   // a small video tile with a play triangle
  col = col || RED;
  return group(() => { box(cx - s * 0.7, cy - s * 0.5, s * 1.4, s, { stroke: col, strokeWidth: 4, fill: '#fff', fillStyle: 'solid', roughness: 1 });
    poly([[cx - s * 0.18, cy - s * 0.25], [cx - s * 0.18, cy + s * 0.25], [cx + s * 0.26, cy]], { stroke: col, fill: col, fillStyle: 'solid', roughness: 0.6 }); });
}
function lifeHouse(x, y, w, col) {    // x, y = bottom-left
  col = col || INK; const h = w * 0.7;
  return group(() => { box(x, y - h, w, h, { stroke: col, strokeWidth: 4 });
    poly([[x - 16, y - h], [x + w / 2, y - h - w * 0.55], [x + w + 16, y - h]], { stroke: col, strokeWidth: 4 });
    box(x + w * 0.38, y - h * 0.55, w * 0.24, h * 0.55, { stroke: col, strokeWidth: 3 }); });
}

function lifeStrike(x, y, w) { return line(x - w / 2, y - 12, x + w / 2, y - 20, { stroke: RED, strokeWidth: 6, roughness: 1 }); }   // cross out a word

window.EPISODE = {
  n: 3, font: 'Patrick Hand',
  scenes: [
    // 1 — hook: the video you're watching sits on a server near your home
    { title: ['你刷的这条视频，', '就在你家附近'],
      cap: [{ zh: '你正在刷的这条视频，' },
            { zh: '其实早就在你家附近了。' },
            { zh: '这不是打比方，' },
            { zh: '它真的就存在离你不远的一台服务器上。' }],
      draw() {
        at(-1); lifeHouse(90, 560, 260); lifePhone(175, 330, 90, 170); lifePlay(220, 415, 46);
        T(220, 640, '你家', 50);
        lifeServer(700, 300, 260, 220); lifePlay(830, 410, 70);
        T(830, 600, '附近的服务器', 46, LIFE_C);
        at(0, 0.2); arrow(690, 420, 380, 420, { color: LIFE_C, width: 6 });
        at(2); T(540, 120, '打比方？', 52, GRY); lifeStrike(540, 120, 230);
        at(3); T(540, 740, '真的就存在离你不远的一台服务器上', 44, LIFE_C); underline(200, 880, 760, LIFE_C);
      } },
    // 2 — fetching from one far machine room: a long road, and a hot video jams it
    { title: ['都去千里外取，', '会怎样？'],
      cap: [{ zh: '视频本来存在视频软件自己的机房里，' },
            { zh: '那个机房可能离你上千公里。' },
            { zh: '如果每个人都去那儿取，' },
            { zh: '数据就要走很远的路。' },
            { zh: '更麻烦的是，' },
            { zh: '一条热门视频几百万人同时看，' },
            { zh: '同一份文件要在同一条长路上跑几百万遍，' },
            { zh: '路一堵，所有人一起卡。' }],
      draw() {
        at(0); lifeServer(790, 40, 240, 190); T(910, 280, '视频软件的机房', 40, LIFE_C);
        at(1); lifeHouse(70, 720, 170); T(155, 790, '你', 44);
        curve([[250, 650], [420, 600], [520, 450], [650, 250], [780, 140]], { stroke: GRY, strokeWidth: 6, roughness: 1.4 });
        T(300, 500, '上千公里', 52, DRED);
        at(2); person(330, 730, 110, INK); person(420, 730, 110, INK); person(510, 730, 110, INK);
        at(3); T(810, 420, '走很远的路', 46, DRED);
        at(4); lifePlay(520, 130, 60, RED); T(520, 220, '热门视频', 40, RED);
        at(5); T(230, 140, '几百万人同时看', 46, RED);
        at(6); T(780, 570, '同一条长路 × 几百万遍', 42, RED);
        at(7); ring(560, 410, 200, 130, RED); T(860, 720, '一起卡', 64, RED);
      } },
    // 3 — servers in many cities, each with a copy; this is a CDN
    { title: ['在各个城市', '放服务器'],
      cap: [{ zh: '所以视频软件会在各个城市放很多服务器，' },
            { zh: '把视频复制一份过去。' },
            { zh: '你一点开，请求就被送到离你近的那一台。' },
            { zh: '路短了，看的人也分散到了各地。' },
            { zh: '这套做法叫内容分发网络，简称 CDN，', say_zh: '这套做法叫内容分发网络，简称CDN，' },
            { zh: '它干的就是把同一份内容' },
            { zh: '提前放到离用户近的地方。' }],
      draw() {
        at(0); path('M90 120 Q300 40 560 90 Q860 60 1010 200 Q1040 420 930 560 Q700 640 470 600 Q220 610 110 470 Q40 300 90 120 Z',
                    { stroke: GRY, strokeWidth: 3, roughness: 2 });
        lifeServer(170, 160, 120, 90); lifeServer(560, 130, 120, 90); lifeServer(820, 260, 120, 90);
        lifeServer(330, 400, 120, 90); lifeServer(690, 450, 120, 90);
        at(1); lifePlay(230, 205, 26); lifePlay(620, 175, 26); lifePlay(880, 305, 26); lifePlay(390, 445, 26); lifePlay(750, 495, 26);
        at(2); lifeHouse(500, 590, 90); arrow(455, 470, 505, 525, { color: LIFE_C, width: 5 }); T(400, 375, '离你近的那一台', 38, LIFE_C);
        at(3); T(540, 680, '路短了，人也分散了', 46, GRN);
        at(4); lbox(150, 710, 330, 110, 'CDN', { size: 72, stroke: LIFE_C, color: LIFE_C, strokeWidth: 6, fill: '#E3F3F2', fillStyle: 'solid' });
        T(760, 770, '内容分发网络', 50, LIFE_C);
        at(5, 0.3); T(540, 40, '同一份内容，提前放到离用户近的地方', 38, LIFE_C);
      } },
    // 4 — not everything fits: hot videos go ahead, cold ones get copied after the first viewer
    { title: ['全都复制？', '放不下'],
      cap: [{ zh: '可是视频那么多，' },
            { zh: '每个城市都存一份全部的，根本放不下。' },
            { zh: '所以热门的会提前放过去；' },
            { zh: '冷门的，你那一片第一个看的人' },
            { zh: '要从远处取，会慢一点，' },
            { zh: '取完就在附近留一份，后面的人就快了。' }],
      draw() {
        at(0); lifeServer(800, 30, 230, 170); T(915, 250, '远处的机房', 40, LIFE_C);
        lifeServer(60, 300, 300, 230); T(210, 580, '你附近的服务器', 40, LIFE_C);
        at(1); T(560, 120, '全部视频 × 每个城市', 42, DRED); T(560, 180, '放不下', 50, RED);
        at(2); lifePlay(130, 360, 40, RED); T(260, 372, '热门', 40, RED); T(210, 440, '提前放好 ✓', 38, GRN);
        at(3); person(560, 760, 120, INK); T(560, 810, '第一个看的人', 36);
        at(4); carrow([[620, 660], [820, 520], [900, 260]], { color: GRY, width: 5 }); T(920, 470, '远处取，慢一点', 40, DRED);
        at(5); carrow([[790, 230], [560, 280], [370, 420]], { color: LIFE_C, width: 5 }); T(560, 330, '留一份', 42, LIFE_C);
        person(440, 760, 100, INK); person(340, 760, 100, INK); T(390, 660, '后面的人：快', 38, GRN);
      } },
    // 5 — the phone already downloads the start of the next videos: even unwatched videos use data
    { title: ['你还没划，', '下一条已经在下了'],
      cap: [{ zh: '这还没完。' },
            { zh: '你看这一条的时候，' },
            { zh: '手机通常已经在悄悄下载下面几条的开头。' },
            { zh: '所以你往上一划，马上就能播。' },
            { zh: '这也意味着，没点开看的视频，' },
            { zh: '也可能已经用掉了你的流量。' }],
      draw() {
        at(1); lifePhone(80, 40, 330, 560); lifePlay(245, 240, 110, RED); T(245, 420, '正在看', 44);
        at(2); lbox(520, 40, 500, 110, '下一条 · 开头已下好', { size: 38, stroke: LIFE_C, color: LIFE_C });
        lbox(520, 180, 500, 110, '再下一条 · 开头已下好', { size: 38, stroke: LIFE_C, color: LIFE_C });
        lbox(520, 320, 500, 110, '再下一条 · 开头已下好', { size: 38, stroke: LIFE_C, color: LIFE_C });
        at(3); arrow(245, 560, 245, 470, { color: BLU, width: 6 }); T(245, 640, '一划就播', 48, BLU);
        at(4); T(770, 520, '没点开看的', 46, DRED);
        at(5); note(470, 580, 560, 150, '也可能用掉了你的流量', 46);
      } },
    // 6 — send it to someone + A/B question
    { title: ['刷视频，', '你用流量吗？'],
      cap: [{ zh: '下次家里谁说没看几条视频流量就没了，' },
            { zh: '把这条发给他。' },
            { zh: '你刷视频是 A 只连 Wi-Fi 刷，', say_zh: '你刷视频是A只连WiFi刷，' },
            { zh: '还是 B 用流量也照刷？', say_zh: '还是B用流量也照刷？' }],
      draw() {
        at(0); person(200, 380, 260, INK); T(200, 450, '说流量不够用的家人', 40);
        lifePhone(270, 170, 120, 220); T(330, 290, '流量 0', 30, RED);
        at(1); carrow([[460, 260], [620, 200], [780, 260]], { color: LIFE_C, width: 5 }); T(860, 290, '发给他', 56, LIFE_C);
        at(2); lbox(60, 560, 450, 130, 'A  只连 Wi-Fi', { size: 54, stroke: GRN, color: GRN, fill: LGRN, fillStyle: 'solid' });
        at(3); lbox(570, 560, 450, 130, 'B  用流量照刷', { size: 52, stroke: RED, color: DRED, fill: LRED, fillStyle: 'solid' });
        T(540, 780, '你选哪个？', 50, INK);
      } },
  ],
};
