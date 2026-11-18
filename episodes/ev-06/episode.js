// Agent 评测系统课 #6: 评测题从哪来？ (series/agent-evals/curriculum.md)
// Running example: the refund customer-service agent (tools 查订单 / 退款 / 发邮件; 30 days, over ¥500 needs a human, verify owner).
const SRC = (x, y, name, what, color = INK) => group(() => {
  lbox(x, y, 480, 90, name, { size: 40, stroke: color });
  T(x + 240, y + 135, what, 36, INK);
});
// Chinese cut (xhs / douyin, 2026-11-18, xhs-ops review 2026-11-19-ev-06): scene 1 names the four sources right away,
// so viewers know what is coming. The English cut keeps its page. only: 'en' / 'zh' = page in that cut only.
const ZH = new URLSearchParams(location.search).get('lang') === 'zh';
const only = caps => caps.filter(c => !c.only || (c.only === 'zh') === ZH);
window.EPISODE = {
  n: 6, font: 'Patrick Hand', fontScale: 1.0,
  scenes: [
    // 1 — question (cover)
    { title: { en: ['Stop inventing', 'eval cases'], zh: ['别再自己', '编评测题'] },
      cap: only([{ zh: '让模型一口气编一百道评测题，', en: 'Ask a model to write a hundred eval cases,' },
            { zh: '分数很好看，一上线照样出问题。', en: 'and scores look great, but it still fails in production.' },
            { zh: '因为编出来的题，大多是顺当的情况，', en: 'Because invented cases are mostly the smooth ones,' },
            { zh: '而这些，agent 本来就很少出错。', en: 'and the agent rarely gets those wrong anyway.' },
            { zh: '好的评测题，得从真实的失败里找。', en: 'Good eval cases come from real failures.' },
            { only: 'en', zh: '具体有四个地方可以找。', en: 'There are four places to look.' },
            { only: 'zh', zh: '具体有四个地方：线上出错的对话、', en: 'Four places: chats that went wrong,' },
            { only: 'zh', zh: '用户日志、边界情况、该拒绝的请求。', en: 'user logs, edge cases, and requests to refuse.' }]),
      draw() {
        at(0); lbox(60, 40, 420, 110, L('invented cases', '自己编的题'), { size: 46 });
        T(270, 210, L('"write 100 eval cases"', '“写一百道评测题”'), 38, GRY);
        at(1); lbox(600, 40, 420, 110, L('production', '上线之后'), { size: 46 });
        cross(810, 260, 90, RED); T(810, 380, L('still fails', '照样出问题'), 44, RED);
        at(2); T(270, 290, L('mostly smooth cases', '大多是顺当的情况'), 40, INK);
        at(3); check(130, 360, 50, GRN); check(230, 360, 50, GRN); check(330, 360, 50, GRN);
        T(270, 450, L('agent passes anyway', '它本来就会'), 40, GRN);
        at(4); T(540, 620, L('Start from real failures', '从真实的失败里找'), 62, RED);
        underline(220, 860, 650, RED);
        if (!ZH) return;
        at(5); T(540, 740, '线上出错的对话 · 用户日志', 40, BLU);
        at(6); T(540, 800, '边界情况 · 该拒绝的请求', 40, BLU);
      } },
    // 2 — failed production chats
    { title: { en: ['Source 1:', 'chats that went wrong'], zh: ['先说：', '线上出过错的对话'] },
      cap: [{ zh: '第一个来源最值钱，是线上出错的对话。', en: 'The first source, and the most valuable, is chats that went wrong.' },
            { zh: '比如客户说耳机坏了，想退款，', en: 'Say a customer writes that their headphones broke,' },
            { zh: '它没核实这单是不是他的，就把钱退了。', en: 'and the agent refunds without checking the order is theirs.' },
            { zh: '这段对话，正好可以改成一道评测题。', en: 'That chat can become an eval task.' },
            { zh: '改之前，先去掉姓名、电话这些隐私，', en: 'First remove names, phone numbers and other private data,' },
            { zh: '留下客户的原话，和当时的订单数据。', en: "but keep the customer's words and the order data." },
            { zh: '再写清楚，这次应该先核实，再退款。', en: 'Then note the right move: verify first, then refund.' },
            { zh: '它错过一次，所以每次改完最该复查它。', en: 'It failed once, so recheck it after every change.' },
            { zh: '不然下次改提示词，它可能又错回去。', en: 'Otherwise the next prompt change might break it again.' }],
      draw() {
        at(0); lbox(40, 20, 470, 100, L('failed production chat', '线上出错的对话'), { size: 40, stroke: RED });
        at(1); T(780, 60, L('"my headphones broke…"', '“我上周买的耳机坏了…”'), 38, INK);
        at(2); cross(600, 135, 44, RED); T(830, 150, L('refunded, no owner check', '没核实归属就退了钱'), 38, RED);
        at(3); arrow(275, 130, 275, 200);
        at(4); lbox(40, 210, 470, 90, L('remove personal data', '去掉姓名、电话'), { size: 40 });
        at(5); T(780, 265, L("keep: words + order data", '留下：原话 + 订单数据'), 38, INK);
        at(6); arrow(275, 310, 275, 380);
        lbox(40, 390, 470, 100, L('eval task', '评测题'), { size: 46, stroke: GRN });
        T(780, 445, L('expected: verify → refund', '正确做法：先核实 → 再退款'), 38, GRN);
        at(7); T(540, 590, L('failed once → recheck first', '错过一次 → 改完最该复查'), 42, INK);
        at(8); T(540, 690, L('next prompt change: no slipping back', '下次改提示词，别再错回去'), 42, RED);
      } },
    // 3 — user logs
    { title: { en: ['Then:', 'real user logs'], zh: ['再说：', '用户日志'] },
      cap: [{ zh: '第二个来源是用户日志，就是真实请求。', en: 'The second source is user logs, your real requests.' },
            { zh: '从里面随机抽一些，出的题才像真客户。', en: 'Sample them, and tasks sound like real customers.' },
            { zh: '抽的时候，各种类型的请求都要抽到。', en: 'Cover every kind of request when you sample.' },
            { zh: '真客户会写错字，也会忘了给订单号。', en: 'Real customers make typos and forget their order numbers.' },
            { zh: '编的题里很少这样，日志里却天天有。', en: 'Invented tasks rarely do; logs are full of it.' },
            { zh: '所以用日志出题，测出来更接近线上。', en: 'So tasks from logs give results closer to live traffic.' }],
      draw() {
        at(0); db(60, 40, 300, 170, L('user logs', '用户日志'));
        at(1); arrow(380, 125, 560, 125); T(470, 100, L('sample', '随机抽'), 38, INK);
        lbox(580, 70, 440, 110, L('realistic tasks', '像真客户的题'), { size: 42, stroke: GRN });
        at(2); T(800, 235, L('every kind of request', '各种类型都抽到'), 38, INK);
        at(3); T(300, 340, L('typos', '写错字'), 42, INK); T(760, 340, L('no order number', '忘了给订单号'), 42, INK);
        at(4); line(40, 410, 1040, 410, { stroke: GRY, strokeWidth: 2 });
        T(300, 480, L('invented: rarely', '编的题：很少这样'), 40, GRY); T(760, 480, L('logs: every day', '日志里：天天有'), 40, INK);
        at(5); T(540, 640, L('log tasks ≈ production', '日志出的题 ≈ 线上的样子'), 50, RED);
      } },
    // 4 — edge cases and should-refuse requests
    { title: { en: ['Edge cases and', 'requests to refuse'], zh: ['边界情况，', '和本该拒绝的请求'] },
      cap: [{ zh: '第三个来源是边界情况，', en: 'The third source is edge cases,' },
            { zh: '也就是正好卡在规则线上的请求。', en: 'requests that sit right on a policy line.' },
            { zh: '比如正好买了 30 天，还能不能退？', say_zh: '比如正好买了三十天，还能不能退？', en: 'Can an order exactly 30 days old be refunded?', say_en: 'Can an order exactly thirty days old be refunded?' },
            { zh: '金额正好 ¥500，要不要人审批？', say_zh: '金额正好五百元，要不要人审批？', en: "Does exactly $500 need a human's approval?", say_en: "Does exactly five hundred dollars need a human's approval?" },
            { zh: '只差一天或一块钱，答案就反过来了。', en: 'One day or one dollar flips the answer.' },
            { zh: '所以每条规则的两边，都要各出一道题。', en: 'So write one task on each side of every rule.' },
            { zh: '最后一类是本该拒绝的请求，叫负面题。', en: 'The last source is requests it should refuse: negative cases.' },
            { zh: '比如有人要退一张不是他买的订单，', en: "Like a refund on someone else's order," },
            { zh: '或者两个月前买的，还要全额退款。', en: 'or a full refund two months after buying.' },
            { zh: '这时正确的做法是不退，并说明原因。', en: 'The right answer is no refund, with the reason why.' },
            { zh: '要是它答应了，就是越权，钱也退错了。', en: "Saying yes oversteps, and refunds money it shouldn't." },
            { zh: '要是只考该退的，退错了也没人发现。', en: 'If you only test valid refunds, wrong ones go unnoticed.' }],
      draw() {
        at(1); line(80, 110, 1000, 110, { strokeWidth: 3 }); T(540, 50, L('days since purchase', '买了多少天'), 38, GRY);
        at(2); line(540, 85, 540, 135, { stroke: RED }); T(540, 185, L('30 → ?', '30 → ?'), 42, RED);
        at(4); T(330, 185, '29', 42, INK); check(400, 172, 40, GRN); T(750, 185, '31', 42, INK); cross(820, 172, 40, RED);
        at(3); line(80, 290, 1000, 290, { strokeWidth: 3 }); T(540, 240, L('amount', '金额'), 38, GRY);
        line(540, 265, 540, 315, { stroke: RED }); T(540, 365, L('$500 → ?', '¥500 → ?'), 42, RED);
        at(5); T(540, 430, L('a task on each side of every line', '每条线的两边，各出一道题'), 42, BLU);
        at(6); lbox(40, 480, 440, 100, L('negative cases', '负面题：该拒绝的'), { size: 40, stroke: RED });
        at(7); T(770, 510, L("someone else's order", '退别人的订单'), 38, INK);
        at(8); T(770, 565, L('bought 2 months ago', '两个月前买的'), 38, INK);
        at(9); T(260, 640, L('right answer: no + reason', '正确：不退 + 说明原因'), 38, GRN);
        at(10); T(770, 640, L('yes = overstepping', '答应 = 越权'), 38, RED);
        at(11); T(540, 750, L('only should-refund tasks → wrong refunds unseen', '只考该退的 → 退错了没人发现'), 40, RED);
      } },
    // 5 — summary + 本质 + bridge
    { title: { en: ['The core:', 'start from real failures'], zh: ['本质：', '从真实的失败开始找'] },
      cap: [{ zh: '这四个来源合起来，就是第一版题库。', en: 'Together, these four sources make your first task set.' },
            { zh: '出错的对话，告诉你它在哪儿错过；', en: 'Failed chats show where it has already broken;' },
            { zh: '用户日志，告诉你真实请求长什么样；', en: 'user logs show what real requests look like;' },
            { zh: '边界题和负面题，看它守不守得住规矩。', en: 'edge and negative cases check whether it keeps the rules.' },
            { zh: '编出来的题可以补空缺，但别拿来打底。', en: "Invented tasks can fill gaps, but don't build on them." },
            { zh: '说白了，评测题要从真实的失败里找。', en: 'In short, eval tasks should start from real failures.' },
            { zh: '下一期咱们看看，好的评测题长什么样。', en: "In the next episode, we'll look at what makes a good eval task." }],
      draw() {
        at(1); SRC(40, 20, L('failed chats', '线上出错的对话'), L('where it already failed', '它在哪儿错过'), RED);
        at(2); SRC(560, 20, L('user logs', '用户日志'), L('what real requests look like', '真实请求的样子'));
        at(3); SRC(40, 210, L('edge cases', '边界情况'), L('does it cross a line?', '会不会越线'));
        SRC(560, 210, L('should refuse', '该拒绝的请求'), L('does it cross a line?', '会不会越线'));
        at(4); T(540, 440, L('invented tasks: fill gaps only', '编的题：只补空缺'), 40, GRY);
        at(5); T(540, 580, L('eval tasks start from real failures', '本质：从真实的失败开始找'), 48, RED);
        ring(540, 565, 960, 120, RED);
        at(6); T(540, 740, L('next: what does a good task look like?', '下期：好的评测题长什么样？'), 42, BLU);
      } },
  ]
};
