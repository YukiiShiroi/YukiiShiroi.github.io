// Kanamichi — © 2026 YukiiShiroi (github.com/YukiiShiroi). All rights reserved.
// Kanamichi graded reader (JLPT N5).
// Lines: words separated by spaces; kanji carry their reading in brackets, e.g. 日本[にほん].
// A line may start with a speaker, e.g. "A：". g lists the grammar points a text needs before it unlocks.
// q: comprehension questions; the first option is the right one (shown shuffled).
window.READER = [
{id:'hajimemashite', title:'はじめまして', en:'Nice to meet you', g:['wa-desu', 'no', 'mo'], text:
`はじめまして。
わたし は アンナ です。
アメリカ人[じん] です。
大学生[だいがくせい] です。
わたし の ともだち は ケン です。
ケン も 大学生[だいがくせい] です。
よろしく おねがい します。`,
 q:[['Where is Anna from?', 'America', 'Japan', 'China'], ['What does Anna do?', 'She’s a university student', 'She’s a teacher', 'She’s a doctor'], ['Who is Ken?', 'Anna’s friend', 'Anna’s teacher', 'Anna’s father']]},

{id:'kore', title:'これ は なん です か', en:'What is this?', g:['wa-desu', 'ka', 'no', 'mo', 'kosoado'], text:
`A：これ は なん です か。
B：それ は 本[ほん] です。
A：あれ も 本[ほん] です か。
B：いいえ、あれ は ノート です。
A：この ペン は だれ の です か。
B：わたし の です。`,
 q:[['What is the thing near A?', 'A book', 'A notebook', 'A pen'], ['What is the thing over there?', 'A notebook', 'A book', 'An umbrella'], ['Whose pen is it?', 'B’s', 'A’s', 'The teacher’s']]},

{id:'mainichi', title:'わたし の 毎日[まいにち]', en:'My day', g:['wa-desu', 'o-masu', 'ni', 'de'], text:
`わたし は 毎日[まいにち] 六時[ろくじ] に おきます。
あさ、パン を 食[た]べます。
コーヒー を 飲[の]みます。
八時[はちじ] に 電車[でんしゃ] で 学校[がっこう] に 行[い]きます。
学校[がっこう] で 日本語[にほんご] を べんきょう します。
五時[ごじ] に うち に かえります。
よる、本[ほん] を 読[よ]みます。`,
 q:[['What time do they get up?', 'Six o’clock', 'Eight o’clock', 'Five o’clock'], ['How do they get to school?', 'By train', 'By bus', 'On foot'], ['What do they do in the evening?', 'Read a book', 'Watch TV', 'Drink coffee']]},

{id:'kinou', title:'きのう', en:'Yesterday', g:['masu-forms', 'deshita', 'to', 'e', 'aru-iru', 'i-adj'], text:
`きのう は 日曜日[にちようび] でした。
天気[てんき] は はれ でした。
ともだち と こうえん へ 行[い]きました。
こうえん に 花[はな] が たくさん ありました。
いっしょに おべんとう を 食[た]べました。
とても たのしい 一日[いちにち] でした。`,
 q:[['What day was yesterday?', 'Sunday', 'Saturday', 'Monday'], ['Who did they go with?', 'A friend', 'Their mother', 'Nobody'], ['What was in the park?', 'Lots of flowers', 'Lots of dogs', 'A big lake']]},

{id:'kaimono', title:'かいもの', en:'Shopping', g:['wa-desu', 'ka', 'kosoado', 'i-adj', 'o-masu'], text:
`てんいん：いらっしゃいませ。
わたし：すみません、この かばん は いくら です か。
てんいん：三千円[さんぜんえん] です。
わたし：ちょっと 高[たか]い です ね。 あの 白[しろ]い かばん は？
てんいん：あれ は 千円[せんえん] です。 安[やす]い です よ。
わたし：じゃあ、あれ を ください。`,
 q:[['How much is the first bag?', '3,000 yen', '1,000 yen', '10,000 yen'], ['What colour is the cheaper bag?', 'White', 'Black', 'Red'], ['Which bag does the shopper buy?', 'The white one', 'The first one', 'Neither']]},

{id:'tenki', title:'天気[てんき]', en:'The weather', g:['wa-desu', 'ka', 'i-adj', 'adj-past', 'kara', 'de', 'o-masu'], text:
`きょう は 雨[あめ] です。
とても さむい です。
きのう は 天気[てんき] が よかった です。
あたたかかった です。
雨[あめ] です から、きょう は うち で 本[ほん] を 読[よ]みます。
あした は 天気[てんき] が いい です か。`,
 q:[['What is the weather like today?', 'Rainy and cold', 'Sunny and warm', 'Snowy'], ['How was yesterday?', 'Nice and warm', 'Cold', 'Rainy'], ['What will they do today?', 'Read a book at home', 'Go to the park', 'Go shopping']]},

{id:'kazoku', title:'わたし の かぞく', en:'My family', g:['wa-desu', 'no', 'to', 'mo', 'aru-iru', 'ga-suki', 'i-adj', 'na-adj'], text:
`わたし の かぞく は 四人[よにん] です。
父[ちち] と 母[はは] と 小[ちい]さい いもうと が います。
父[ちち] は 先生[せんせい] です。
母[はは] は りょうり が じょうず です。
いもうと は 十[じゅっ]さい です。
いぬ も います。 名前[なまえ] は ポチ です。
みんな げんき です。`,
 q:[['How many people are in the family?', 'Four', 'Three', 'Five'], ['What does the father do?', 'He’s a teacher', 'He’s a doctor', 'He’s a cook'], ['What is the dog called?', 'Pochi', 'Ken', 'Anna']]},

{id:'yasumi', title:'土曜日[どようび] の やくそく', en:'Plans for Saturday', g:['mashou', 'tai', 'ni', 'de', 'e', 'ka'], text:
`A：土曜日[どようび]、いっしょに 山[やま] へ 行[い]きませんか。
B：いい です ね。 行[い]きたい です。
A：何時[なんじ] に あいましょう か。
B：九時[くじ] は どう です か。
A：いい です よ。 えき の 前[まえ] で あいましょう。
B：はい。 たのしみ です。`,
 q:[['Where are they going?', 'The mountains', 'The sea', 'The station'], ['What time will they meet?', 'Nine o’clock', 'Seven o’clock', 'Noon'], ['Where will they meet?', 'In front of the station', 'At the mountain', 'At A’s home']]},

{id:'denwa', title:'電話[でんわ]', en:'A phone call', g:['te-imasu', 'te-kudasai', 'aru-iru', 'ka', 'de'], text:
`A：もしもし、ケン さん？ いま 何[なに] を して います か。
B：いま うち で テレビ を 見[み]て います。
A：そう です か。 外[そと] は 雨[あめ] が ふって います よ。
B：え、ほんとう です か。 かさ が ありません。
A：じゃあ、うち に いて ください。`,
 q:[['What is Ken doing?', 'Watching TV at home', 'Reading a book', 'Sleeping'], ['What is the weather like?', 'It’s raining', 'It’s sunny', 'It’s snowing'], ['What doesn’t Ken have?', 'An umbrella', 'A phone', 'A TV']]},

{id:'resutoran', title:'レストラン で', en:'At the restaurant', g:['tai', 'te-kudasai', 'o-masu', 'ga-suki', 'de'], text:
`てんいん：ごちゅうもん は？
A：ラーメン を ください。
B：わたし は すし が 食[た]べたい です。
てんいん：お飲[の]みもの は？
A：お水[みず] を 二[ふた]つ ください。
B：あと、メニュー を 見[み]せて ください。`,
 q:[['What does A order?', 'Ramen', 'Sushi', 'Curry'], ['What does B want to eat?', 'Sushi', 'Ramen', 'Cake'], ['How many waters do they ask for?', 'Two', 'One', 'Three']]},

{id:'ryokou', title:'日本[にほん] りょこう', en:'A trip to Japan', g:['e', 'adj-past', 'na-adj', 'o-masu', 'tai', 'de', 'masu-forms'], text:
`先月[せんげつ]、日本[にほん] へ 行[い]きました。
とうきょう は 人[ひと] が おおかった です。
電車[でんしゃ] は とても きれい でした。
すし を たくさん 食[た]べました。
とても おいしかった です。
山[やま] で 花見[はなみ] を しました。
また 行[い]きたい です。`,
 q:[['When did they go to Japan?', 'Last month', 'Last year', 'Last week'], ['What was Tokyo like?', 'Crowded', 'Quiet', 'Empty'], ['What did they do in the mountains?', 'Flower viewing', 'Skiing', 'Camping']]},

{id:'tegami', gl:{より:'from (signing a letter: アンナより = from Anna)'}, title:'てがみ', en:'A letter home', g:['kara', 'te-imasu', 'tai', 'e', 'aru-iru', 'ni', 'de'], text:
`お母[かあ]さん へ
おげんき です か。
わたし は いま 大学[だいがく] で 日本語[にほんご] を べんきょう して います。
毎日[まいにち] いそがしい です から、あまり 電話[でんわ] が できません。
でも、ともだち が たくさん います から、たのしい です。
なつやすみ に うち へ かえりたい です。
アンナ より`,
 q:[['Who is the letter to?', 'Her mother', 'Her teacher', 'Her friend'], ['Why can’t she call often?', 'She’s busy every day', 'She has no phone', 'Calls are expensive'], ['When does she want to go home?', 'In the summer holidays', 'Next week', 'At New Year']]},
];

// Shared glossary for every text: surface form → meaning. (Readings come from the text.)
window.READER_GLOSS = {
  'はじめまして':'nice to meet you', 'わたし':'I, me', 'アンナ':'Anna (a name)', 'アメリカ人':'American (person)', '大学生':'university student',
  'ともだち':'friend', 'ケン':'Ken (a name)', 'よろしく':'please treat me well', 'おねがい':'request, please', 'します':'do (polite)',
  'これ':'this (near me)', 'それ':'that (near you)', 'あれ':'that (over there)', 'なん':'what', '本':'book', 'いいえ':'no', 'ノート':'notebook',
  'この':'this …', 'ペン':'pen', 'だれ':'who', '毎日':'every day', '六時':'six o’clock', 'おきます':'get up', 'あさ':'morning', 'パン':'bread',
  '食べます':'eat', 'コーヒー':'coffee', '飲みます':'drink', '八時':'eight o’clock', '電車':'train', '学校':'school', '行きます':'go',
  '日本語':'Japanese (language)', 'べんきょう':'study', '五時':'five o’clock', 'うち':'home', 'かえります':'go home, return', 'よる':'evening, night',
  '読みます':'read', 'きのう':'yesterday', '日曜日':'Sunday', 'でした':'was', '天気':'weather', 'はれ':'sunny', 'こうえん':'park',
  '行きました':'went', '花':'flower', 'たくさん':'many, a lot', 'ありました':'there was/were', 'いっしょに':'together', 'おべんとう':'packed lunch',
  '食べました':'ate', 'とても':'very', 'たのしい':'fun', '一日':'a day', 'てんいん':'shop assistant', 'いらっしゃいませ':'welcome (in a shop)',
  'すみません':'excuse me', 'かばん':'bag', 'いくら':'how much', '三千円':'3,000 yen', 'ちょっと':'a little', '高い':'expensive, tall',
  'ね':'…isn’t it (seeks agreement)', 'あの':'that … (over there)', '白い':'white', '千円':'1,000 yen', '安い':'cheap', 'よ':'…you know (tells new info)',
  'じゃあ':'well then', 'ください':'please (give me)', 'きょう':'today', '雨':'rain', 'さむい':'cold', 'よかった':'was good',
  'あたたかかった':'was warm', 'から':'because, so', '読みます':'read', 'あした':'tomorrow', 'いい':'good', 'かぞく':'family', '四人':'four people',
  '父':'(my) father', '母':'(my) mother', '小さい':'small, little', 'いもうと':'younger sister', 'います':'there is (people, animals); after a て-form: is …ing', '先生':'teacher',
  'りょうり':'cooking', 'じょうず':'good at', '十さい':'ten years old', 'いぬ':'dog', '名前':'name', 'ポチ':'Pochi (a dog’s name)', 'みんな':'everyone',
  'げんき':'well, healthy', '土曜日':'Saturday', '山':'mountain', '行きませんか':'won’t you go?', '行きたい':'want to go', '何時':'what time',
  'あいましょう':'let’s meet', 'か':'(question)', '九時':'nine o’clock', 'どう':'how, what', 'えき':'station', '前':'in front of', 'はい':'yes',
  'たのしみ':'looking forward to it', 'もしもし':'hello (on the phone)', 'さん':'Mr/Ms (polite suffix)', 'いま':'now', '何':'what',
  'して':'doing (て-form of する)', '見て':'watching (て-form of みる)', 'テレビ':'TV', 'そう':'so, like that', '外':'outside',
  'ふって':'falling (rain, て-form)', 'え':'eh? (surprise)', 'ほんとう':'true, really', 'かさ':'umbrella', 'ありません':'there isn’t, don’t have',
  'いて':'stay (て-form of いる)', 'ごちゅうもん':'your order', 'ラーメン':'ramen', 'すし':'sushi', '食べたい':'want to eat', 'お飲みもの':'drinks',
  'お水':'water', '二つ':'two (things)', 'あと':'also, and then', 'メニュー':'menu', '見せて':'show (て-form)', '先月':'last month', '日本':'Japan',
  'とうきょう':'Tokyo', '人':'people, person', 'おおかった':'there were many', 'きれい':'clean, pretty', 'おいしかった':'was delicious',
  '花見':'flower viewing', 'しました':'did', 'また':'again', 'お母さん':'mother', 'おげんき':'well (polite)', '大学':'university',
  'いそがしい':'busy', 'あまり':'(not) much', '電話':'phone call', 'できません':'can’t', 'でも':'but', 'なつやすみ':'summer holidays',
  'かえりたい':'want to go home', 'より':'than; from', 'あめ':'rain',
};
