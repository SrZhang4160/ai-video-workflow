// Agent 评测系统课 #5: 行业基准分数高，你的 agent 就好用吗？ (series/agent-evals/curriculum.md)
// Running example: the refund customer-service agent (tools 查订单 / 退款 / 发邮件; 30 days, over ¥500 needs a human, verify owner).
const BENCH = (y, name, h = 70) => lbox(40, y, 330, h, name, { size: 40 });
// Chinese cut (xhs / douyin, 2026-11-18, xhs-ops experiment 002): after the hook it goes straight to the SWE-bench example;
// the harness is one line after τ-bench. The English cut keeps every page. only: 'en' / 'zh' = page in that cut only;
// pg(en, zh) = the page index a drawing appears on in each cut.
const ZH = new URLSearchParams(location.search).get('lang') === 'zh';
const only = caps => caps.filter(c => !c.only || (c.only === 'zh') === ZH);
const pg = (en, zh) => ZH ? zh : en;
window.EPISODE = {
  n: 5, font: 'Patrick Hand', fontScale: 1.0,
  scenes: [
    // 1 — question (cover)
    { title: { en: ['Top of the leaderboard', '≠ good for you'], zh: ['榜单分数高，', '不等于好用'] },
      cap: only([{ zh: '新模型在榜单上分数第一，', en: 'A new model tops the leaderboard.' },
            { zh: '换到你的 agent 上，就一定好用吗？', en: 'Will it work well in your agent?' },
            { zh: '不一定。榜单考的是通用能力，', en: 'Not necessarily. Leaderboards test general ability,' },
            { zh: '你自己的业务规矩，它一条都不考。', en: 'and none of your own business rules.' },
            { only: 'en', zh: '榜单背后是基准：公开考题加判分规则。', en: 'Behind a leaderboard is a benchmark: public tasks plus grading rules.' },
            { only: 'en', zh: '先看看这些基准，到底在考什么。', en: 'First, let\'s see what these benchmarks actually test.' }]),
      draw() {
        at(0); box(60, 50, 400, 340, { stroke: INK });
        T(260, 110, L('leaderboard', '榜单'), 46, INK);
        [170, 230, 290, 350].forEach(y => line(90, y - 30, 430, y - 30, { stroke: GRY, strokeWidth: 2 }));
        T(260, 190, L('new model  #1', '新模型  第 1'), 40, RED); T(260, 250, L('model B', '模型 B'), 40, GRY);
        T(260, 310, L('model C', '模型 C'), 40, GRY);
        at(1); arrow(480, 220, 610, 220, { color: INK });
        lbox(630, 140, 400, 160, L('your agent', '你的 agent'), { size: 44 });
        T(545, 190, '?', 90, RED);
        at(2); T(260, 460, L('tests general ability', '考的是通用能力'), 40, BLU);
        at(3); T(830, 370, L('your rules: not tested', '你的规矩：不考'), 40, RED);
        if (ZH) return;
        at(4); T(540, 570, L('benchmark = public tasks + grading rules', '基准 = 公开考题 + 判分规则'), 42, INK);
        at(5); T(540, 700, L('What do they test?', '它们到底考什么？'), 60, RED);
        underline(240, 840, 730, RED);
      } },
    // 2 — who the benchmarks test
    { title: { en: ['What do benchmarks', 'actually test?'], zh: ['基准，', '测的到底是谁？'] },
      cap: only([{ only: 'en', zh: '分数表上比的，其实是一个个模型。', en: 'A score table actually compares models.' },
            { only: 'en', zh: '考的是 agent 类的任务，', en: 'The tasks are agent tasks,' },
            { only: 'en', zh: '所以要给模型套上一个现成的 agent 外壳。', en: 'so each model is wrapped in a ready-made agent harness.' },
            { only: 'en', zh: '外壳里有固定的提示词和一套工具。', en: 'The harness has a fixed prompt and a set of tools.' },
            { only: 'en', zh: '外壳尽量不变，分数差主要就是模型的差。', en: 'Keep the harness the same, and the gap mostly comes from the model.' },
            { zh: '先看 SWE-bench，考改开源项目的 bug，', say_zh: '先看 S W E bench，考改开源项目的 bug，', en: 'SWE-bench, for example, has it fix real open-source bugs,', say_en: 'S W E bench, for example, has it fix real open-source bugs,' },
            { zh: '改完跑项目自带的测试，全过才算对。', en: "and a fix counts only if the project's tests pass." },
            { zh: '再比如 τ-bench，考的是客服类任务。', say_zh: '再比如 tau bench，考的是客服类任务。', en: 'tau-bench tests customer-service tasks.', say_en: 'tau bench tests customer-service tasks.' },
            { zh: '一个模型扮顾客，跟被测的 agent 对话。', en: 'One model plays the customer and talks to the agent under test.' },
            { zh: 'agent 照一份规则，用工具改模拟数据库。', en: 'The agent follows a policy and uses tools on a mock database.' },
            { zh: '最后查数据库的状态，和标准答案比对。', en: 'At the end, the database is compared with the expected state.' },
            { only: 'zh', zh: '考 agent 时，每个模型套的是同一个外壳，', en: 'In these tests, every model gets the same harness,' },
            { only: 'zh', zh: '所以分数差，主要是模型的差。', en: 'so the score gap is mostly the model.' },
            { zh: '还有考网页操作、电脑操作和调工具的。', en: 'Others test web tasks, computer use, and tool calling.' },
            { zh: '它们测的，都是模型做 agent 的通用本事。', en: "All of them measure a model's general skill as an agent." }]),
      draw() {
        at(pg(0, 6)); T(540, 40, L('a score table compares models', '分数表比的是模型'), 42, INK);
        lbox(60, 80, 260, 80, L('model A', '模型 A'), { size: 38 }); lbox(410, 80, 260, 80, L('model B', '模型 B'), { size: 38 }); lbox(760, 80, 260, 80, L('model C', '模型 C'), { size: 38 });
        at(pg(2, 6)); box(40, 200, 1000, 190, { stroke: BLU });
        T(540, 230, L('agent harness', 'agent 外壳'), 40, BLU);
        at(pg(3, 6)); T(540, 280, L('fixed prompt + tools', '固定提示词 + 工具'), 38, INK);
        lbox(400, 305, 280, 70, L('swap the model', '只换模型'), { size: 36 });
        at(pg(4, 7)); T(540, 430, L('gap ≈ the model', '分数差 ≈ 模型的差'), 42, RED);
        at(pg(5, 0)); lbox(40, 470, 330, 70, 'SWE-bench', { size: 38 }); T(715, 505, L('fix real bugs → tests pass', '改真实 bug → 测试全过'), 36, INK);
        at(pg(7, 2)); lbox(40, 560, 330, 70, 'τ-bench', { size: 38 }); T(715, 575, L('a model plays the customer', '模型扮顾客'), 36, INK);
        at(pg(9, 4)); T(715, 620, L('policy + tools → mock DB', '照规则用工具改数据库'), 36, INK);
        at(pg(10, 5)); T(715, 665, L('→ compare final DB state', '→ 比对数据库最后状态'), 36, INK);
        at(pg(11, 8)); T(540, 730, 'WebArena · OSWorld · BFCL …', 38, GRY);
        at(pg(12, 9)); T(540, 790, L("= a model's general agent skill", '= 模型做 agent 的通用本事'), 44, RED);
      } },
    // 3 — your agent is a whole system; scores can also run high
    { title: { en: ['Your agent is', 'more than the model'], zh: ['你的 agent，', '不只是一个模型'] },
      cap: [{ zh: '可你的退款客服，不只是一个模型。', en: 'But your refund agent is more than a model.' },
            { zh: '它是模型，加上你写的提示词，', en: "It's the model, plus the prompt you wrote," },
            { zh: '加上查订单、退款和发邮件这些工具，', en: 'plus your tools for orders, refunds and emails,' },
            { zh: '还有你自己定下的退款规矩。', en: 'plus your own refund rules.' },
            { zh: '比如 30 天内才能退款，', say_zh: '比如三十天内才能退款，', en: 'Say refunds only within 30 days,', say_en: 'Say refunds only within thirty days,' },
            { zh: '超过 ¥500 要人工审批，', say_zh: '超过五百元要人工审批，', en: "anything over $500 needs a human's approval,", say_en: "anything over five hundred dollars needs a human's approval," },
            { zh: '退之前还得核实，这单是不是他买的。', en: 'and you check the order belongs to the customer.' },
            { zh: '这些规矩，公开基准一条都不考。', en: 'No public benchmark tests these rules.' },
            { zh: '可你的客服每天碰到的，恰恰就是这些。', en: "Yet that's exactly what your agent faces every day." },
            { zh: '而且基准的分数，本身也可能偏高。', en: 'And benchmark scores can also run high.' },
            { zh: '题是公开的，题和答案可能混进训练数据。', en: 'The tasks are public, so they can leak into training data.' },
            { zh: '模型可能背过答案，分数就不准了。', en: 'A model may have memorized them, so the score misleads.' },
            { zh: '所以基准测的，是模型的通用本事，', en: "So benchmarks measure a model's general skill," },
            { zh: 'agent 评测测的，是你这一整套系统。', en: 'while agent evals measure your whole system.' }],
      draw() {
        at(0); lbox(40, 30, 330, 100, L('your refund agent', '你的退款客服'), { size: 40 });
        at(1); T(720, 50, L('= model + your prompt', '= 模型 + 你的提示词'), 38, INK);
        at(2); T(720, 100, L('+ tools: order · refund · email', '+ 工具：查订单 · 退款 · 发邮件'), 36, INK);
        at(3); T(720, 150, L('+ your rules', '+ 你的规矩'), 38, INK);
        at(4); T(560, 210, L('refund within 30 days', '30 天以内才能退'), 36, GRY);
        at(5); T(560, 255, L('over $500 → human approval', '超过 ¥500 → 人工审批'), 36, GRY);
        at(6); T(560, 300, L('verify the owner first', '先核实是不是他买的'), 36, GRY);
        at(7); cross(950, 255, 60, RED); T(860, 360, L("benchmarks don't test these", '基准一条都不考'), 38, RED);
        at(9); line(40, 410, 1040, 410, { stroke: GRY, strokeWidth: 2 });
        lbox(40, 440, 260, 90, L('public tasks', '公开考题'), { size: 38 });
        at(10); arrow(310, 485, 390, 485); db(400, 430, 250, 110, L('training data', '训练数据'));
        at(11); arrow(660, 485, 740, 485); lbox(750, 440, 290, 90, L('memorized?', '背过答案？'), { size: 38 });
        T(895, 575, L('score runs high', '分数偏高'), 38, RED);
        at(12); T(540, 660, L("benchmark → a model's general skill", '基准 → 模型的通用本事'), 42, INK);
        at(13); T(540, 730, L('agent eval → your whole system', 'agent 评测 → 你的整套系统'), 42, GRN);
        ring(540, 730, 900, 80, GRN);
      } },
    // 4 — what to do + 本质 + bridge (summary page)
    { title: { en: ['The core:', 'benchmarks shortlist'], zh: ['本质：', '基准挑模型，自己的题测 agent'] },
      cap: [{ zh: '那基准分数有什么用呢？用来初选模型。', en: 'So what are benchmark scores for? Shortlisting models.' },
            { zh: '分数明显偏低的，可以先排除掉。', en: 'Clearly weaker models can be dropped early.' },
            { zh: '但最后选哪个、改完有没有变好，', en: 'But to pick one, or to see whether a change helped,' },
            { zh: '都得用你自己的评测集，一道道去量。', en: 'you measure on your own eval set, task by task.' },
            { zh: '题从你的退款对话里来，按你的规矩判。', en: 'Its tasks come from your refund chats, graded by your rules.' },
            { zh: '说白了，基准帮你挑模型，', en: 'In short, benchmarks help you pick a model,' },
            { zh: '你的 agent 好不好用，得用自己的题来测。', en: 'but only your own tasks show whether your agent works.' },
            { zh: '下一期咱们聊聊，自己的评测题从哪来。', en: "In the next episode, we'll see where your own tasks come from." }],
      draw() {
        at(0); lbox(40, 30, 440, 110, L('benchmark score', '基准分数'), { size: 44 });
        arrow(490, 85, 580, 85); T(810, 100, L('shortlist models', '初选模型'), 44, INK);
        at(1); T(810, 165, L('drop the weak ones', '偏低的先排除'), 38, GRY);
        at(2); lbox(40, 230, 440, 110, L('your own eval set', '自己的评测集'), { size: 44, stroke: GRN });
        arrow(490, 285, 580, 285); T(790, 270, L('which model?', '选哪一个？'), 42, INK);
        T(790, 330, L('did the change help?', '改完变好了吗？'), 42, INK);
        at(3); check(1010, 295, 50, GRN);
        at(4); T(540, 440, L('your refund chats + your rules', '你的退款对话 + 你的规矩'), 40, BLU);
        at(5); T(540, 580, L('benchmarks pick models; your tasks test your agent', '基准挑模型，自己的题测 agent'), 46, RED);
        ring(540, 565, 980, 120, RED);
        at(7); T(540, 740, L('next: where do eval tasks come from?', '下期：自己的评测题从哪来？'), 42, BLU);
      } },
  ]
};
