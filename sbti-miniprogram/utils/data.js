// SBTI 人格测试数据

const questions = [
  { id: 'q1', dim: 'S1', text: '我不仅是屌丝，我还是 joker，我还是咸鱼，这辈子没谈过一场恋爱，胆怯又自卑，我的青春就是一场又一场的意淫，每一天幻想着我也能有一个女孩子和我一起压马路，一起逛街，一起玩，现实却是爆了父母金币，读了个烂学校，混日子之后找班上，没有理想，没有目标，没有能力的三无人员，每次看到你能在网上开屌丝的玩笑，我都想哭，我就是地底下的老鼠，透过下水井的缝隙，窥探地上的各种美好，每一次看到这种都是对我心灵的一次伤害，对我生存空间的一次压缩，求求哥们给我们这种小丑一点活路吧，我真的不想在白天把枕巾哭湿一大片', options: [{ label: '我哭了。。', value: 1 }, { label: '这是什么。。', value: 2 }, { label: '这不是我！', value: 3 }] },
  { id: 'q2', dim: 'S1', text: '我不够好，周围的人都比我优秀', options: [{ label: '确实', value: 1 }, { label: '有时', value: 2 }, { label: '不是', value: 3 }] },
  { id: 'q3', dim: 'S2', text: '我很清楚真正的自己是什么样的', options: [{ label: '不认同', value: 1 }, { label: '中立', value: 2 }, { label: '认同', value: 3 }] },
  { id: 'q4', dim: 'S2', text: '我内心有真正追求的东西', options: [{ label: '不认同', value: 1 }, { label: '中立', value: 2 }, { label: '认同', value: 3 }] },
  { id: 'q5', dim: 'S3', text: '我一定要不断往上爬、变得更厉害', options: [{ label: '不认同', value: 1 }, { label: '中立', value: 2 }, { label: '认同', value: 3 }] },
  { id: 'q6', dim: 'S3', text: '外人的评价对我来说无所吊谓。', options: [{ label: '不认同', value: 1 }, { label: '中立', value: 2 }, { label: '认同', value: 3 }] },
  { id: 'q7', dim: 'E1', text: '对象超过 5 小时没回消息，说自己窜稀了，你会怎么想？', options: [{ label: '拉稀不可能 5 小时，也许 ta 隐瞒了我。', value: 1 }, { label: '在信任和怀疑之间摇摆。', value: 2 }, { label: '也许今天 ta 真的不太舒服。', value: 3 }] },
  { id: 'q8', dim: 'E1', text: '我在感情里经常担心被对方抛弃', options: [{ label: '是的', value: 1 }, { label: '偶尔', value: 2 }, { label: '不是', value: 3 }] },
  { id: 'q9', dim: 'E2', text: '我对天发誓，我对待每一份感情都是认真的！', options: [{ label: '并没有', value: 1 }, { label: '也许？', value: 2 }, { label: '是的！（问心无愧骄傲脸）', value: 3 }] },
  { id: 'q10', dim: 'E2', text: '你的恋爱对象是一个尊老爱幼，温柔敦厚，洁身自好，光明磊落，大义凛然，能言善辩，口才流利，观察入微，见多识广，博学多才，诲人不倦，和蔼可亲，平易近人，心地善良，慈眉善目，积极进取，意气风发，玉树临风，国色天香，倾国倾城，花容月貌的人，此时你会？', options: [{ label: '就算 ta 再优秀我也不会陷入太深。', value: 1 }, { label: '会介于 A 和 C 之间。', value: 2 }, { label: '会非常珍惜 ta，也许会变成恋爱脑。', value: 3 }] },
  { id: 'q11', dim: 'E3', text: '恋爱后，对象非常黏人，你作何感想？', options: [{ label: '那很爽了', value: 1 }, { label: '都行无所谓', value: 2 }, { label: '我更喜欢保留独立空间', value: 3 }] },
  { id: 'q12', dim: 'E3', text: '我在任何关系里都很重视个人空间', options: [{ label: '我更喜欢依赖与被依赖', value: 1 }, { label: '看情况', value: 2 }, { label: '是的！（斩钉截铁地说道）', value: 3 }] },
  { id: 'q13', dim: 'A1', text: '大多数人是善良的', options: [{ label: '其实邪恶的人心比世界上的痔疮更多。', value: 1 }, { label: '也许吧。', value: 2 }, { label: '是的，我愿相信好人更多。', value: 3 }] },
  { id: 'q14', dim: 'A1', text: '你走在街上，一位萌萌的小女孩蹦蹦跳跳地朝你走来（正脸、侧脸看都萌，用 vivo、苹果、华为、OPPO 手机看都萌，实在是非常萌的那种），她递给你一根棒棒糖，此时你作何感想？', options: [{ label: '呜呜她真好真可爱！居然给我棒棒糖！', value: 3 }, { label: '一脸懵逼，作挠头状', value: 2 }, { label: '这也许是一种新型诈骗？还是走开为好。', value: 1 }] },
  { id: 'q15', dim: 'A2', text: '快考试了，学校规定必须上晚自习，请假会扣分，但今晚你约了女/男神一起玩《绝地求生：刺激战场》（一款刺激的游戏），你怎么办？', options: [{ label: '翘了！反正就一次！', value: 1 }, { label: '干脆请个假吧。', value: 2 }, { label: '都快考试了还去啥。', value: 3 }] },
  { id: 'q16', dim: 'A2', text: '我喜欢打破常规，不喜欢被束缚', options: [{ label: '认同', value: 1 }, { label: '保持中立', value: 2 }, { label: '不认同', value: 3 }] },
  { id: 'q17', dim: 'A3', text: '我做事通常有目标。', options: [{ label: '不认同', value: 1 }, { label: '中立', value: 2 }, { label: '认同', value: 3 }] },
  { id: 'q18', dim: 'A3', text: '突然某一天，我意识到人生哪有什么他妈的狗屁意义，人不过是和动物一样被各种欲望支配着，纯纯是被激素控制的东西，饿了就吃，困了就睡，一发情就想交配，我们简直和猪狗一样没什么区别。', options: [{ label: '是这样的。', value: 1 }, { label: '也许是，也许不是。', value: 2 }, { label: '这简直是胡扯', value: 3 }] },
  { id: 'q19', dim: 'Ac1', text: '我做事主要为了取得成果和进步，而不是避免麻烦和风险。', options: [{ label: '不认同', value: 1 }, { label: '中立', value: 2 }, { label: '认同', value: 3 }] },
  { id: 'q20', dim: 'Ac1', text: '你因便秘坐在马桶上（已长达 30 分钟），拉不出很难受。此时你更像', options: [{ label: '再坐三十分钟看看，说不定就有了。', value: 1 }, { label: '用力拍打自己的屁股并说："死屁股，快拉啊！"', value: 2 }, { label: '使用开塞露，快点拉出来才好。', value: 3 }] },
  { id: 'q21', dim: 'Ac2', text: '我做决定比较果断，不喜欢犹豫', options: [{ label: '不认同', value: 1 }, { label: '中立', value: 2 }, { label: '认同', value: 3 }] },
  { id: 'q22', dim: 'Ac2', text: '此题没有题目，请盲选', options: [{ label: '反复思考后感觉应该选 A？', value: 1 }, { label: '啊，要不选 B？', value: 2 }, { label: '不会就选 C？', value: 3 }] },
  { id: 'q23', dim: 'Ac3', text: '别人说你"执行力强"，你内心更接近哪句？', options: [{ label: '我被逼到最后确实执行力超强。。。', value: 1 }, { label: '啊，有时候吧。', value: 2 }, { label: '是的，事情本来就该被推进', value: 3 }] },
  { id: 'q24', dim: 'Ac3', text: '我做事常常有计划，____', options: [{ label: '然而计划不如变化快。', value: 1 }, { label: '有时能完成，有时不能。', value: 2 }, { label: '我讨厌被打破计划。', value: 3 }] },
  { id: 'q25', dim: 'So1', text: '你因玩《第五人格》（一款刺激的游戏）而结识许多网友，并被邀请线下见面，你的想法是？', options: [{ label: '网上口嗨下就算了，真见面还是有点忐忑。', value: 1 }, { label: '见网友也挺好，反正谁来聊我就聊两句。', value: 2 }, { label: '我会打扮一番并热情聊天，万一呢，我是说万一呢？', value: 3 }] },
  { id: 'q26', dim: 'So1', text: '朋友带了 ta 的朋友一起来玩，你最可能的状态是', options: [{ label: '对"朋友的朋友"天然有点距离感，怕影响二人关系', value: 1 }, { label: '看对方，能玩就玩。', value: 2 }, { label: '朋友的朋友应该也算我的朋友！要热情聊天', value: 3 }] },
  { id: 'q27', dim: 'So2', text: '我和人相处主打一个电子围栏，靠太近会自动报警。', options: [{ label: '认同', value: 3 }, { label: '中立', value: 2 }, { label: '不认同', value: 1 }] },
  { id: 'q28', dim: 'So2', text: '我渴望和我信任的人关系密切，熟得像失散多年的亲戚。', options: [{ label: '认同', value: 1 }, { label: '中立', value: 2 }, { label: '不认同', value: 3 }] },
  { id: 'q29', dim: 'So3', text: '有时候你明明对一件事有不同的、负面的看法，但最后没说出来。多数情况下原因是：', options: [{ label: '这种情况较少。', value: 1 }, { label: '可能碍于情面或者关系。', value: 2 }, { label: '不想让别人知道自己是个阴暗的人。', value: 3 }] },
  { id: 'q30', dim: 'So3', text: '我在不同人面前会表现出不一样的自己', options: [{ label: '不认同', value: 1 }, { label: '中立', value: 2 }, { label: '认同', value: 3 }] }
]

// 特殊题目（饮酒测试）
const specialQuestions = [
  { id: 'drink_gate_q1', special: true, kind: 'drink_gate', text: '您平时有什么爱好？', options: [{ label: '吃喝拉撒', value: 1 }, { label: '艺术爱好', value: 2 }, { label: '饮酒', value: 3 }, { label: '健身', value: 4 }] },
  { id: 'drink_gate_q2', special: true, kind: 'drink_trigger', text: '您对饮酒的态度是？', options: [{ label: '小酌怡情，喝不了太多。', value: 1 }, { label: '我习惯将白酒灌在保温杯，当白开水喝，酒精令我信服。', value: 2 }] }
]

// 人格类型库
const TYPE_LIBRARY = {
  "CTRL": { code: "CTRL", cn: "拿捏者", intro: "怎么样，被我拿捏了吧？", desc: "恭喜您，您测出了全中国最为罕见的人格，您是宇宙熵增定律的天然反抗者！全世界所谓成功人士里，99.99% 都是您的拙劣模仿者。CTRL 人格，是行走的人形自走任务管理器。" },
  "ATM-er": { code: "ATM-er", cn: "送钱者", intro: "你以为我很有钱吗？", desc: "恭喜您，您竟然测出了这个世界上最稀有的人格。像一部老旧但坚固的 ATM 机，插进去的是别人的焦虑和麻烦，吐出来的是"没事，有我"的安心保证。" },
  "Dior-s": { code: "Dior-s", cn: "屌丝", intro: "等着我屌丝逆袭。", desc: "恭喜！您并非屌丝，您是犬儒主义先贤第欧根尼失散多年的精神传人。Dior-s 人格，是对当代消费主义陷阱和成功学 PUA 最彻底的蔑视。" },
  "BOSS": { code: "BOSS", cn: "领导者", intro: "方向盘给我，我来开。", desc: "BOSS 是一个手里永远拿着方向盘的人。效率是他们的信仰，秩序是他们的呼吸。他们不是"自带领袖气场"，他们本身就是人形的气场发生器。" },
  "THAN-K": { code: "THAN-K", cn: "感恩者", intro: "我感谢苍天！我感谢大地！", desc: "恭喜您，您测出了全中国最为罕见的人格。THAN-K 拥有温润如玉的性格和海纳百川的胸怀。他们眼中的世界没有完全的坏人，只有"尚未被感恩光芒照耀到的朋友"。" },
  "OH-NO": { code: "OH-NO", cn: "哦不人", intro: "哦不！我怎么会是这个人格？！", desc: ""哦不！"并非恐惧的尖叫，而是一种顶级的智慧。哦不人对"边界"有一种近乎偏执的尊重。他们是秩序的守护神，是混乱世界里最后那批神经绷得很直的体面人。" },
  "GOGO": { code: "GOGO", cn: "行者", intro: "gogogo~出发咯", desc: "GOGO 活在一个极致的"所见即所得"世界里。他们不是在"解决问题"，他们是在"清除待办事项"。对他们来说，世界上只有两种状态：已完成，和即将被我完成。" },
  "SEXY": { code: "SEXY", cn: "尤物", intro: "您就是天生的尤物！", desc: "当您走进一个房间，照明系统会自动将您识别为天生的尤物。无论是谁，都容易对您的存在产生一种超标的注意力。" },
  "LOVE-R": { code: "LOVE-R", cn: "多情者", intro: "爱意太满，现实显得有点贫瘠。", desc: "LOVE-R 人格像远古神话时代幸存至今的珍稀物种。您的情感处理器不是二进制的，而是彩虹制的。" },
  "MUM": { code: "MUM", cn: "妈妈", intro: "或许...我可以叫你妈妈吗....?", desc: "恭喜您，您测出了全中国最稀有的妈妈人格。妈妈人格的底色是温柔，擅长感知情绪，具有超强共情力。" },
  "FAKE": { code: "FAKE", cn: "伪人", intro: "已经，没有人类了。", desc: "在社交场合，伪人是八面玲珑的存在，因为他们切换人格面具比切换手机输入法还快。夜深人静时，伪人把面具一层层摘下来，最后才发现，面具下空得很。" },
  "OJBK": { code: "OJBK", cn: "无所谓人", intro: "我说随便，是真的随便。", desc: "这已经不是一种人格，而是一种统治哲学。这不是没主见，这是在告诉你：尔等凡俗的选择，于朕而言，皆为蝼蚁。" },
  "MALO": { code: "MALO", cn: "吗喽", intro: "人生是个副本，而我只是一只吗喽。", desc: "朋友，你不是"童心未泯"，你压根就没进化。你的灵魂还停留在那个挂在树上荡秋千、看见香蕉就两眼放光的快乐时代。" },
  "JOKE-R": { code: "JOKE-R", cn: "小丑", intro: "原来我们都是小丑。", desc: "JOKE-R 人格不是一个"人"，更像一个把笑话穿在身上的小丑。你打开一层，是个笑话；再打开一层，是个段子；你一层层打开，直到最后，你发现最里面……是空的。" },
  "WOC!": { code: "WOC!", cn: "握草人", intro: "卧槽，我怎么是这个人格？", desc: "他们拥有两种完全独立的操作系统：一个叫"表面系统"，负责发出"我操""牛逼""啊？"等一系列大惊小怪的拟声词；另一个叫"后台系统"，负责冷静分析。" },
  "THIN-K": { code: "THIN-K", cn: "思考者", intro: "已深度思考 100s。", desc: "您的大脑长时间处于思考状态。您十分会审判信息，注重论点、论据、逻辑推理、潜在偏见。" },
  "SHIT": { code: "SHIT", cn: "愤世者", intro: "这个世界，构石一坨。", desc: "SHIT 的行为模式是一场惊天动地的悖论戏剧。嘴上：这个项目简直是屎。手上：默默打开 Excel，开始建构函数模型和甘特图。" },
  "ZZZZ": { code: "ZZZZ", cn: "装死者", intro: "我没死，我只是在睡觉。", desc: "群里 99+ 条消息您可以视而不见，但当有人发出"@全体成员"的最后通牒时，您会像刚从千年古墓里苏醒一样。" },
  "POOR": { code: "POOR", cn: "贫困者", intro: "我穷，但我很专。", desc: "这个"贫困"不是钱包余额的判决书，更像一种欲望断舍离后的资源再分配。别人把精力撒成漫天二维码，你把精力压成一束激光。" },
  "MONK": { code: "MONK", cn: "僧人", intro: "没有那种世俗的欲望。", desc: "MONK 已然看破红尘，不希望闲人来扰其清修。MONK 的个人空间，是他们的结界，是他们的须弥山。" },
  "IMSB": { code: "IMSB", cn: "傻者", intro: "认真的么？我真的是傻逼么？", desc: "IMSB 人格的大脑里住着两个不死不休的究极战士：一个叫"我他妈冲了！"，另一个叫"我是个傻逼！"。" },
  "SOLO": { code: "SOLO", cn: "孤儿", intro: "我哭了，我怎么会是孤儿？", desc: "孤儿的自我价值感偏低，因此有时主动疏远他人。孤儿们在自己的灵魂外围建起了一座名为"莫挨老子"的万里长城。" },
  "FUCK": { code: "FUCK", cn: "草者", intro: "操！这是什么人格？", desc: "人类文明城市里，出现了一株无法被任何除草剂杀死的、具有超级生命力的人形野草。" },
  "DEAD": { code: "DEAD", cn: "死者", intro: "我，还活着吗？", desc: "死者已经看透了那些无意义的哲学思考，因此显得对一切"失去"了兴趣。死者是超越了欲望和目标的终极贤者。" },
  "IMFW": { code: "IMFW", cn: "废物", intro: "我真的...是废物吗？", desc: "废物们的自尊通常有些脆弱，缺乏安全感。给废物一颗糖，他们会还你一个完全信任你、亮晶晶的眼神。" },
  "HHHH": { code: "HHHH", cn: "傻乐者", intro: "哈哈哈哈哈哈。", desc: "由于您的思维回路过于清奇，标准人格库已全面崩溃。哈哈哈哈哈哈哈哈哈哈哈哈！" },
  "DRUNK": { code: "DRUNK", cn: "酒鬼", intro: "烈酒烧喉，不得不醉。", desc: "您体内流淌的不是血液，是美味的五粮液！是国窖 1573！是江小白！" }
}

// 人格匹配模式
const TYPE_PATTERNS = {
  "CTRL": "HHH-HMH-MHH-HHH-MHM",
  "ATM-er": "HHH-HHM-HHH-HMH-MHL",
  "Dior-s": "LLL-LLL-LLL-LLL-LLL",
  "BOSS": "HHH-HHH-HHH-HHH-HHH",
  "THAN-K": "HHH-HHH-HHH-HHH-MHH",
  "OH-NO": "MMM-MMM-MMM-MMM-MMM",
  "GOGO": "HHH-MHH-HHH-MHH-HHH",
  "SEXY": "HHH-HHH-HHH-MHH-HHH",
  "LOVE-R": "MHH-HHH-MHH-HHH-MHH",
  "MUM": "MHH-MHH-MHH-MHH-MHH",
  "FAKE": "HMM-MMM-MMM-MMM-MMM",
  "OJBK": "MMM-LLL-MMM-LLL-MMM",
  "MALO": "LMM-MLL-LMM-MLL-LMM",
  "JOKE-R": "LLM-LLL-LLL-LLL-LLL",
  "WOC!": "MML-MML-MML-MML-MML",
  "THIN-K": "MMM-HMM-MMM-HMM-MMM",
  "SHIT": "LHH-LHH-LHH-LHH-LHH",
  "ZZZZ": "LLL-MLL-LLL-MLL-LLL",
  "POOR": "HMM-HMM-HMM-HMM-HMM",
  "MONK": "LLL-LLL-HLL-LLL-HLL",
  "IMSB": "MLL-LLL-MLL-LLL-MLL",
  "SOLO": "LLL-LLL-LLL-LLL-HLL",
  "FUCK": "HHL-HHL-HHL-HHL-HHL",
  "DEAD": "LLL-LLL-LLL-LLL-LLL",
  "IMFW": "LML-LLL-LML-LLL-LML",
  "HHHH": "random"
}

module.exports = {
  questions,
  specialQuestions,
  TYPE_LIBRARY,
  TYPE_PATTERNS
}
