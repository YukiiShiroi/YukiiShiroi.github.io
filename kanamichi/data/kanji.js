// Kanamichi — © 2026 YukiiShiroi (github.com/YukiiShiroi). All rights reserved.
// Kanamichi kanji data (JLPT N5), loaded before the app script.
// Each lesson: [id, title, [kanji…]]. Each kanji: [meanings, on'yomi (katakana), kun'yomi (hiragana, "." marks the okurigana), memory aid].
// Words: "written|reading|meaning" — a word unlocks once every kanji in it is learned.
window.KANJI_LESSONS = [
  ['n5-1', 'Numbers 1–5', '一二三四五'],
  ['n5-2', 'Numbers 6–10', '六七八九十'],
  ['n5-3', 'Big numbers, money, years', '百千万円年'],
  ['n5-4', 'Days of the week I', '日月火水木'],
  ['n5-5', 'Days of the week II', '金土曜週毎'],
  ['n5-6', 'People and family I', '人子女男父'],
  ['n5-7', 'People and family II', '母友名先生'],
  ['n5-8', 'School and size', '学校大小中'],
  ['n5-9', 'Position', '上下左右外'],
  ['n5-10', 'Directions and countries', '東西南北国'],
  ['n5-11', 'Nature I', '山川田天気'],
  ['n5-12', 'Nature II and description', '雨花白長高'],
  ['n5-13', 'Movement', '見行来出入'],
  ['n5-14', 'Eat, drink, speak', '食飲言話聞'],
  ['n5-15', 'Everyday actions', '読書買休立'],
  ['n5-16', 'Things and questions', '本車電語何'],
  ['n5-17', 'Telling the time', '時分半午前'],
  ['n5-18', 'Time and description', '後今間安新'],
];

window.KANJI_INFO = {
  一:['one', 'イチ, イツ', 'ひと.つ', 'A single line: one.'],
  二:['two', 'ニ', 'ふた.つ', 'Two lines: two.'],
  三:['three', 'サン', 'みっ.つ', 'Three lines: three.'],
  四:['four', 'シ', 'よ, よっ.つ, よん', 'A room with four walls and two curtains in the window.'],
  五:['five', 'ゴ', 'いつ.つ', 'A shape like the number 5 squeezed between two lines.'],
  六:['six', 'ロク', 'むっ.つ', 'A little person with a hat and two legs — six legs on a bug, if you squint.'],
  七:['seven', 'シチ', 'なな, なな.つ', 'An upside-down 7 with a line through it.'],
  八:['eight', 'ハチ', 'やっ.つ', 'Two strokes spreading apart, like the bottom of an 8.'],
  九:['nine', 'キュウ, ク', 'ここの.つ', 'A bent arm that is nearly at ten.'],
  十:['ten', 'ジュウ', 'とお', 'A cross: ten fingers crossed.'],
  百:['hundred', 'ヒャク', '', 'One (一) on top of white (白): a hundred.'],
  千:['thousand', 'セン', 'ち', 'Ten (十) with a little slash on top: a thousand.'],
  万:['ten thousand', 'マン, バン', '', 'Ten thousand — 一万 (ichiman) is one ten-thousand.'],
  円:['yen, circle', 'エン', 'まる.い', 'A coin in a frame: yen.'],
  年:['year', 'ネン', 'とし', 'A person carrying the harvest home — once a year.'],
  日:['day, sun', 'ニチ, ジツ', 'ひ, か', 'A window with the sun shining through it.'],
  月:['month, moon', 'ゲツ, ガツ', 'つき', 'A crescent moon with two lines across it.'],
  火:['fire', 'カ', 'ひ', 'A campfire with sparks flying from both sides.'],
  水:['water', 'スイ', 'みず', 'A stream in the middle with splashes on both sides.'],
  木:['tree, wood', 'モク, ボク', 'き', 'A tree: trunk, branches and roots.'],
  金:['gold, money', 'キン, コン', 'かね', 'A roof over a pile of gold nuggets.'],
  土:['earth, soil', 'ド, ト', 'つち', 'A sprout coming out of the ground.'],
  曜:['day of the week', 'ヨウ', '', 'The sun (日) plus wings: the days fly by. Used in 月曜日, 火曜日…'],
  週:['week', 'シュウ', '', 'Something that comes round on a road (辶) every week.'],
  毎:['every', 'マイ', '', 'A mother (母) with a hat on — she does it every day.'],
  人:['person', 'ジン, ニン', 'ひと', 'A person walking: two legs.'],
  子:['child', 'シ, ス', 'こ', 'A baby wrapped up with its arms out.'],
  女:['woman', 'ジョ, ニョ', 'おんな', 'A woman sitting with her legs crossed.'],
  男:['man', 'ダン, ナン', 'おとこ', 'Rice field (田) plus power (力): a man working the field.'],
  父:['father', 'フ', 'ちち', 'Two crossed tools with a moustache on top.'],
  母:['mother', 'ボ', 'はは', 'A woman with two dots: a mother.'],
  友:['friend', 'ユウ', 'とも', 'Two hands reaching for each other: friends.'],
  名:['name', 'メイ, ミョウ', 'な', 'Evening (夕) plus a mouth (口): in the dark, you call out your name.'],
  先:['ahead, previous', 'セン', 'さき', 'Legs walking out ahead. 先生 is "born ahead": a teacher.'],
  生:['life, birth, raw', 'セイ, ショウ', 'い.きる, う.まれる, なま', 'A plant growing out of the ground: life.'],
  学:['study, learning', 'ガク', 'まな.ぶ', 'A child (子) under a roof with sparks of ideas above it.'],
  校:['school', 'コウ', '', 'A tree (木) by a building where people gather: school.'],
  大:['big', 'ダイ, タイ', 'おお.きい', 'A person stretching their arms wide: big.'],
  小:['small', 'ショウ', 'ちい.さい, こ', 'A small line with two tiny drops beside it.'],
  中:['middle, inside', 'チュウ', 'なか', 'A line straight through the middle of a box.'],
  上:['up, above', 'ジョウ', 'うえ, あ.がる, のぼ.る', 'A line pointing up from the ground.'],
  下:['down, below', 'カ, ゲ', 'した, さ.がる, お.りる', 'A line hanging down from the ceiling.'],
  左:['left', 'サ', 'ひだり', 'A hand holding a tool (工) — on the left.'],
  右:['right', 'ウ, ユウ', 'みぎ', 'A hand bringing food to the mouth (口) — the right hand.'],
  外:['outside', 'ガイ, ゲ', 'そと', 'Evening (夕) and a fortune-teller (卜) outside.'],
  東:['east', 'トウ', 'ひがし', 'The sun (日) rising behind a tree (木): east.'],
  西:['west', 'セイ, サイ', 'にし', 'A bird settling into its nest as the sun sets in the west.'],
  南:['south', 'ナン', 'みなみ', 'A warm tent with ten (十) on top: the warm south.'],
  北:['north', 'ホク', 'きた', 'Two people sitting back to back, turning from the cold north.'],
  国:['country', 'コク', 'くに', 'A king’s jewel (玉) inside borders: a country.'],
  山:['mountain', 'サン', 'やま', 'Three peaks: a mountain.'],
  川:['river', 'セン', 'かわ', 'Three lines of flowing water: a river.'],
  田:['rice field', 'デン', 'た', 'A field divided into four paddies.'],
  天:['heaven, sky', 'テン', '', 'Something even bigger (大) above: the sky.'],
  気:['spirit, air', 'キ, ケ', '', 'Steam rising: air, mood. 天気 is weather, 元気 is healthy.'],
  雨:['rain', 'ウ', 'あめ', 'Raindrops falling under the sky.'],
  花:['flower', 'カ', 'はな', 'Grass (艹) on top of something changing (化): a flower.'],
  白:['white', 'ハク', 'しろ, しろ.い', 'The sun (日) with a ray of light on top: white.'],
  長:['long, chief', 'チョウ', 'なが.い', 'An old man with long hair blowing in the wind.'],
  高:['tall, expensive', 'コウ', 'たか.い', 'A tall tower: high, and expensive.'],
  見:['see', 'ケン', 'み.る', 'A big eye (目) on legs: to see.'],
  行:['go', 'コウ, ギョウ', 'い.く, おこな.う', 'A crossroads: going.'],
  来:['come', 'ライ', 'く.る', 'A tree (木) with wheat coming in at the top.'],
  出:['exit, go out', 'シュツ', 'で.る, だ.す', 'Two mountains (山) stacked: climbing out.'],
  入:['enter', 'ニュウ', 'はい.る, い.れる', 'A person bending to go in through a door. Don’t mix it up with 人.'],
  食:['eat, food', 'ショク', 'た.べる', 'A roof over a good bowl of food.'],
  飲:['drink', 'イン', 'の.む', 'Food (食) plus a yawning mouth (欠): drinking.'],
  言:['say', 'ゲン, ゴン', 'い.う', 'Words coming out of a mouth (口).'],
  話:['talk, story', 'ワ', 'はな.す, はなし', 'Words (言) from a tongue (舌): talking.'],
  聞:['hear, ask', 'ブン', 'き.く', 'An ear (耳) at the gate (門): listening.'],
  読:['read', 'ドク', 'よ.む', 'Words (言) you sell (売) — reading them aloud.'],
  書:['write', 'ショ', 'か.く', 'A hand holding a brush over the sun (日): writing.'],
  買:['buy', 'バイ', 'か.う', 'A net over a shell (貝, old money): buying.'],
  休:['rest', 'キュウ', 'やす.む', 'A person (亻) leaning on a tree (木): resting.'],
  立:['stand', 'リツ', 'た.つ', 'A person standing on the ground.'],
  本:['book, origin', 'ホン', 'もと', 'A tree (木) with a mark at the root: the origin. Also "book".'],
  車:['car, vehicle', 'シャ', 'くるま', 'A cart seen from above: two wheels and an axle.'],
  電:['electricity', 'デン', '', 'Rain (雨) and lightning: electricity.'],
  語:['language, word', 'ゴ', 'かた.る', 'Words (言) of me (吾): language.'],
  何:['what', 'カ', 'なに, なん', 'A person (亻) asking: what?'],
  時:['time, hour', 'ジ', 'とき', 'The sun (日) moving over a temple (寺): time.'],
  分:['minute, part, understand', 'フン, ブン', 'わ.かる', 'A sword (刀) cutting something in two: a part.'],
  半:['half', 'ハン', 'なか.ば', 'A line cutting a cow in half.'],
  午:['noon', 'ゴ', '', 'A pestle at its highest point: noon. 午前 a.m., 午後 p.m.'],
  前:['before, front', 'ゼン', 'まえ', 'Someone stepping forward in front.'],
  後:['after, behind', 'ゴ, コウ', 'あと, うし.ろ', 'Walking slowly (彳) behind: after.'],
  今:['now', 'コン', 'いま', 'A roof over one moment: now.'],
  間:['interval, between', 'カン, ケン', 'あいだ, ま', 'The sun (日) shining between the gate (門) doors.'],
  安:['cheap, calm', 'アン', 'やす.い', 'A woman (女) under a roof: peaceful, and cheap.'],
  新:['new', 'シン', 'あたら.しい', 'Fresh wood (木) cut with an axe (斤): new.'],
};

// Kanji that are easy to mix up (used by the lookalike drill)
window.KANJI_LOOKALIKES = ['人入八', '日白田', '千十', '土上', '木本休', '話語読', '午千'];

window.KANJI_WORDS = `一つ|ひとつ|one (thing)
二つ|ふたつ|two (things)
三つ|みっつ|three (things)
四つ|よっつ|four (things)
五つ|いつつ|five (things)
一人|ひとり|one person, alone
二人|ふたり|two people
三人|さんにん|three people
一月|いちがつ|January
四月|しがつ|April
六月|ろくがつ|June
七月|しちがつ|July
九月|くがつ|September
二日|ふつか|the 2nd (of the month), two days
三日|みっか|the 3rd (of the month), three days
八日|ようか|the 8th (of the month), eight days
十日|とおか|the 10th (of the month), ten days
百円|ひゃくえん|100 yen
三百|さんびゃく|three hundred
六百|ろっぴゃく|six hundred
八百|はっぴゃく|eight hundred
千円|せんえん|1,000 yen
三千|さんぜん|three thousand
一万円|いちまんえん|10,000 yen
今年|ことし|this year
毎年|まいとし/まいねん|every year
来年|らいねん|next year
日本|にほん/にっぽん|Japan
日本語|にほんご|Japanese (language)
日本人|にほんじん|Japanese person
毎日|まいにち|every day
今日|きょう|today
月曜日|げつようび|Monday
火曜日|かようび|Tuesday
水曜日|すいようび|Wednesday
木曜日|もくようび|Thursday
金曜日|きんようび|Friday
土曜日|どようび|Saturday
日曜日|にちようび|Sunday
毎週|まいしゅう|every week
今週|こんしゅう|this week
来週|らいしゅう|next week
先週|せんしゅう|last week
今月|こんげつ|this month
先月|せんげつ|last month
来月|らいげつ|next month
毎月|まいつき/まいげつ|every month
水|みず|water
火|ひ|fire
木|き|tree
お金|おかね|money
人|ひと|person
大人|おとな|adult
女の子|おんなのこ|girl
男の子|おとこのこ|boy
女の人|おんなのひと|woman
男の人|おとこのひと|man
子ども|こども|child
父|ちち|(my) father
母|はは|(my) mother
お父さん|おとうさん|father
お母さん|おかあさん|mother
友だち|ともだち|friend
名前|なまえ|name
先生|せんせい|teacher
学生|がくせい|student
大学|だいがく|university
学校|がっこう|school
大学生|だいがくせい|university student
小学校|しょうがっこう|elementary school
中学校|ちゅうがっこう|junior high school
大きい|おおきい|big
小さい|ちいさい|small
中|なか|inside
上|うえ|above, on top
下|した|below, under
右|みぎ|right
左|ひだり|left
外|そと|outside
外国|がいこく|foreign country
外国人|がいこくじん|foreigner
東|ひがし|east
西|にし|west
南|みなみ|south
北|きた|north
国|くに|country
中国|ちゅうごく|China
山|やま|mountain
川|かわ|river
天気|てんき|weather
電気|でんき|electricity, lights
雨|あめ|rain
花|はな|flower
花見|はなみ|flower viewing
白い|しろい|white
長い|ながい|long
高い|たかい|tall, expensive
見る|みる|to see, to watch
行く|いく|to go
来る|くる|to come
出る|でる|to go out, to leave
入る|はいる|to enter
食べる|たべる|to eat
飲む|のむ|to drink
言う|いう|to say
話す|はなす|to speak
電話|でんわ|telephone
聞く|きく|to listen, to ask
読む|よむ|to read
書く|かく|to write
買う|かう|to buy
休む|やすむ|to rest, to take a day off
休み|やすみ|holiday, break
立つ|たつ|to stand
本|ほん|book
車|くるま|car
電車|でんしゃ|train
何|なに/なん|what
何人|なんにん|how many people
何時|なんじ|what time
時間|じかん|time, hours
一時|いちじ|one o'clock
四時|よじ|four o'clock
九時|くじ|nine o'clock
三時半|さんじはん|half past three
五分|ごふん|five minutes
十分|じゅっぷん/じっぷん|ten minutes
午前|ごぜん|a.m., morning
午後|ごご|p.m., afternoon
前|まえ|front, before
後ろ|うしろ|behind
今|いま|now
人間|にんげん|human being
安い|やすい|cheap
新しい|あたらしい|new
新聞|しんぶん|newspaper`;
