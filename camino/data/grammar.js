// Camino — © 2026 YukiiShiroi (github.com/YukiiShiroi). All rights reserved.
// The A1 grammar path. Each point: an explanation, examples [spanish, english], and drills:
//   pick  — fill the ＿ gap; the first option is the right one (options are shuffled when shown)
//   type  — write the form asked for (p: prompt, a: answer, alt: other accepted answers)
//   order — put the words in order (w: the sentence, words separated by spaces; alt: other natural orders)
window.GRAMMAR = [
{id:'gender', title:'el, la, un, una', sub:'Every noun is masculine or feminine',
 explain:`<p>Every Spanish noun is masculine or feminine, and "the" and "a" change to match. Most nouns ending in <b>-o</b> are masculine, most ending in <b>-a</b> are feminine. Learn each noun with its article.</p>
 <table><tr><th></th><th>masculine</th><th>feminine</th></tr><tr><td>the</td><td><b>el</b> libro</td><td><b>la</b> casa</td></tr><tr><td>a / an</td><td><b>un</b> libro</td><td><b>una</b> casa</td></tr></table>
 <p>Some exceptions to keep in mind: <b>el</b> día, <b>la</b> mano, <b>el</b> mapa.</p>`,
 ex:[['el perro y la casa', 'the dog and the house'], ['un amigo y una amiga', 'a friend (male) and a friend (female)'], ['el día', 'the day'], ['la mano', 'the hand']],
 q:[{t:'pick', s:'＿ libro', o:['el', 'la'], en:'the book'}, {t:'pick', s:'＿ mesa', o:['la', 'el'], en:'the table'}, {t:'pick', s:'＿ perro', o:['un', 'una'], en:'a dog'}, {t:'pick', s:'＿ ventana', o:['una', 'un'], en:'a window'},
  {t:'pick', s:'＿ día', o:['el', 'la'], en:'the day'}, {t:'pick', s:'＿ mano', o:['la', 'el'], en:'the hand'}, {t:'type', p:'"the house" in Spanish', a:'la casa'}, {t:'type', p:'"a friend (female)" in Spanish', a:'una amiga'}]},
{id:'plural', title:'Plurals', sub:'los, las, unos, unas',
 explain:`<p>Add <b>-s</b> to words ending in a vowel, <b>-es</b> to words ending in a consonant. The articles become plural too: <b>el → los</b>, <b>la → las</b>, <b>un → unos</b>, <b>una → unas</b> (some).</p>
 <p>A final <b>-z</b> turns into <b>-ces</b>: el lápiz → los lápi<b>ces</b>.</p>`,
 ex:[['los libros', 'the books'], ['las mujeres', 'the women'], ['unos amigos', 'some friends'], ['los lápices', 'the pencils']],
 q:[{t:'pick', s:'＿ casas', o:['las', 'los', 'la'], en:'the houses'}, {t:'pick', s:'＿ perros', o:['los', 'las', 'el'], en:'the dogs'}, {t:'type', p:'plural of "la ciudad"', a:'las ciudades'}, {t:'type', p:'plural of "el libro"', a:'los libros'},
  {t:'type', p:'plural of "el lápiz"', a:'los lápices'}, {t:'pick', s:'＿ chicas', o:['unas', 'unos', 'una'], en:'some girls'}]},
{id:'pronouns', title:'I, you, he, she…', sub:'Subject pronouns and tú vs usted',
 explain:`<p>The subject pronouns are <b>yo</b> (I), <b>tú</b> (you, informal), <b>él</b> (he), <b>ella</b> (she), <b>usted</b> (you, formal), <b>nosotros</b> (we), <b>ustedes</b> (you all), <b>ellos / ellas</b> (they).</p>
 <p>Use <b>tú</b> with friends, family and kids; <b>usted</b> with strangers, older people and at work. <b>usted</b> takes the same verb form as él and ella; <b>ustedes</b> the same as ellos.</p>
 <p>Because the verb ending already shows who it is, Spanish often drops the pronoun: <b>Hablo español</b> = I speak Spanish.</p>`,
 ex:[['Yo soy Ana.', 'I am Ana.'], ['¿Usted es el señor García?', 'Are you Mr. García?'], ['Nosotros somos amigos.', 'We are friends.'], ['Hablo inglés.', 'I speak English.']],
 q:[{t:'pick', s:'＿ = I', o:['yo', 'tú', 'él']}, {t:'pick', s:'＿ = we', o:['nosotros', 'ustedes', 'ellos']}, {t:'pick', s:'To your boss, "you" is…', o:['usted', 'tú', 'yo']}, {t:'pick', s:'To your little brother, "you" is…', o:['tú', 'usted', 'ustedes']},
  {t:'type', p:'"she" in Spanish', a:'ella'}, {t:'type', p:'"you all" in Spanish', a:'ustedes'}]},
{id:'ser', title:'ser: to be (who, what)', sub:'soy, eres, es, somos, son',
 explain:`<p><b>ser</b> is for what something <i>is</i>: identity, origin, job, nationality, description, time.</p>
 <table><tr><td>yo <b>soy</b></td><td>nosotros <b>somos</b></td></tr><tr><td>tú <b>eres</b></td><td>ustedes <b>son</b></td></tr><tr><td>él, ella, usted <b>es</b></td><td>ellos, ellas <b>son</b></td></tr></table>
 <p>No word for "a" before a job: <b>Soy maestro</b> = I'm a teacher.</p>`,
 ex:[['Soy de México.', 'I am from Mexico.'], ['Ella es médica.', 'She is a doctor.'], ['¿Eres estudiante?', 'Are you a student?'], ['Somos amigos.', 'We are friends.'], ['La casa es grande.', 'The house is big.']],
 q:[{t:'pick', s:'Yo ＿ estudiante.', o:['soy', 'es', 'eres'], en:'I am a student.'}, {t:'pick', s:'Tú ＿ mi amigo.', o:['eres', 'es', 'soy'], en:'You are my friend.'}, {t:'pick', s:'Ellos ＿ de Colombia.', o:['son', 'somos', 'es'], en:'They are from Colombia.'},
  {t:'pick', s:'Nosotros ＿ maestros.', o:['somos', 'son', 'soy'], en:'We are teachers.'}, {t:'type', p:'ser → usted', a:'es'}, {t:'type', p:'ser → yo', a:'soy'}, {t:'order', w:'mi madre es médica', en:'My mother is a doctor.'}]},
{id:'estar', title:'estar: to be (how, where)', sub:'estoy, estás, está, estamos, están',
 explain:`<p><b>estar</b> is for <b>where</b> something is and <b>how</b> it is right now: location, feelings, states.</p>
 <table><tr><td>yo <b>estoy</b></td><td>nosotros <b>estamos</b></td></tr><tr><td>tú <b>estás</b></td><td>ustedes <b>están</b></td></tr><tr><td>él, ella, usted <b>está</b></td><td>ellos, ellas <b>están</b></td></tr></table>
 <p>Mind the accents: <b>está</b> (is) but <b>esta</b> (this).</p>`,
 ex:[['Estoy en casa.', 'I am at home.'], ['¿Cómo estás?', 'How are you?'], ['Ella está cansada.', 'She is tired.'], ['¿Dónde están los niños?', 'Where are the children?']],
 q:[{t:'pick', s:'Yo ＿ bien.', o:['estoy', 'está', 'estás'], en:'I am fine.'}, {t:'pick', s:'¿Dónde ＿ el banco?', o:['está', 'están', 'estoy'], en:'Where is the bank?'}, {t:'pick', s:'Nosotros ＿ cansados.', o:['estamos', 'están', 'estás'], en:'We are tired.'},
  {t:'type', p:'estar → tú', a:'estás'}, {t:'type', p:'estar → ellos', a:'están'}, {t:'order', w:'el libro está en la mesa', en:'The book is on the table.'}]},
{id:'ser-estar', title:'ser or estar?', sub:'Two verbs for "to be"',
 explain:`<p>A quick rule: <b>ser</b> says what something <i>is</i> (who, what, where from, what it's like in general). <b>estar</b> says <i>where</i> it is and <i>how</i> it is right now.</p>
 <ul><li>Location → <b>estar</b>: El hotel <b>está</b> cerca.</li><li>Feelings and states → <b>estar</b>: <b>Estoy</b> cansado.</li><li>Identity, job, origin → <b>ser</b>: <b>Es</b> mi hermano. <b>Soy</b> de Perú.</li><li>Description → <b>ser</b>: La casa <b>es</b> grande.</li></ul>`,
 ex:[['Soy Ana y estoy bien.', 'I am Ana and I am fine.'], ['El café está caliente.', 'The coffee is hot (right now).'], ['Mi casa es azul.', 'My house is blue.'], ['La tienda está cerrada.', 'The store is closed.']],
 q:[{t:'pick', s:'Mi hermano ＿ médico.', o:['es', 'está'], en:'My brother is a doctor.'}, {t:'pick', s:'Mi hermano ＿ en el hospital.', o:['está', 'es'], en:'My brother is at the hospital.'}, {t:'pick', s:'Hoy ＿ muy contenta.', o:['estoy', 'soy'], en:'Today I am very happy.'},
  {t:'pick', s:'Nosotros ＿ de Chile.', o:['somos', 'estamos'], en:'We are from Chile.'}, {t:'pick', s:'La sopa ＿ fría.', o:['está', 'es'], en:'The soup is cold (now).'}, {t:'pick', s:'El libro ＿ interesante.', o:['es', 'está'], en:'The book is interesting.'}]},
{id:'ar', title:'-ar verbs', sub:'hablo, hablas, habla…',
 explain:`<p>Most verbs end in <b>-ar</b>. Drop the -ar and add the ending for who's doing it:</p>
 <table><tr><td>yo habl<b>o</b></td><td>nosotros habl<b>amos</b></td></tr><tr><td>tú habl<b>as</b></td><td>ustedes habl<b>an</b></td></tr><tr><td>él, ella, usted habl<b>a</b></td><td>ellos, ellas habl<b>an</b></td></tr></table>
 <p>The same pattern works for trabajar, estudiar, caminar, comprar, necesitar, escuchar…</p>`,
 ex:[['Hablo español.', 'I speak Spanish.'], ['¿Trabajas hoy?', 'Are you working today?'], ['Ella estudia mucho.', 'She studies a lot.'], ['Compramos pan.', 'We buy bread.']],
 q:[{t:'type', p:'hablar → yo', a:'hablo'}, {t:'type', p:'trabajar → tú', a:'trabajas'}, {t:'type', p:'estudiar → ella', a:'estudia'}, {t:'type', p:'comprar → nosotros', a:'compramos'}, {t:'type', p:'caminar → ellos', a:'caminan'},
  {t:'pick', s:'Ustedes ＿ música.', o:['escuchan', 'escucha', 'escuchamos'], en:'You all listen to music.'}, {t:'order', w:'yo hablo inglés y español', en:'I speak English and Spanish.'}]},
{id:'er-ir', title:'-er and -ir verbs', sub:'como, comes… vivo, vives…',
 explain:`<p><b>-er</b> and <b>-ir</b> verbs share most endings. Only "we" is different: -<b>emos</b> vs -<b>imos</b>.</p>
 <table><tr><th></th><th>comer</th><th>vivir</th></tr><tr><td>yo</td><td>com<b>o</b></td><td>viv<b>o</b></td></tr><tr><td>tú</td><td>com<b>es</b></td><td>viv<b>es</b></td></tr><tr><td>él, ella, usted</td><td>com<b>e</b></td><td>viv<b>e</b></td></tr><tr><td>nosotros</td><td>com<b>emos</b></td><td>viv<b>imos</b></td></tr><tr><td>ustedes, ellos</td><td>com<b>en</b></td><td>viv<b>en</b></td></tr></table>`,
 ex:[['Como arroz con pollo.', 'I eat rice with chicken.'], ['¿Dónde vives?', 'Where do you live?'], ['Leemos un libro.', 'We read a book.'], ['Ellos escriben mucho.', 'They write a lot.']],
 q:[{t:'type', p:'comer → yo', a:'como'}, {t:'type', p:'vivir → tú', a:'vives'}, {t:'type', p:'beber → ella', a:'bebe'}, {t:'type', p:'vivir → nosotros', a:'vivimos'}, {t:'type', p:'comer → nosotros', a:'comemos'},
  {t:'type', p:'escribir → ellos', a:'escriben'}, {t:'pick', s:'Mi hermano ＿ en Lima.', o:['vive', 'vivo', 'viven'], en:'My brother lives in Lima.'}]},
{id:'no-questions', title:'No, and asking questions', sub:'No hablo… ¿Hablas…?',
 explain:`<p>To say "not", put <b>no</b> right before the verb: <b>No hablo</b> francés. Spanish happily doubles negatives: <b>No</b> tengo <b>nada</b> = I don't have anything.</p>
 <p>For a yes/no question, just add <b>¿ ?</b> and raise your voice at the end: <b>¿Hablas inglés?</b> No "do" is needed.</p>`,
 ex:[['No trabajo los domingos.', 'I don\'t work on Sundays.'], ['¿Vives aquí?', 'Do you live here?'], ['No, no vivo aquí.', 'No, I don\'t live here.'], ['No hay nada.', 'There is nothing.']],
 q:[{t:'order', w:'no hablo francés', en:'I don\'t speak French.'}, {t:'order', w:'¿hablas inglés?', en:'Do you speak English?'}, {t:'pick', s:'Yo ＿ como carne.', o:['no', 'nada', 'nunca no'], en:'I don\'t eat meat.'},
  {t:'order', w:'mi padre no trabaja hoy', en:'My father isn\'t working today.'}, {t:'pick', s:'No tengo ＿.', o:['nada', 'algo', 'no'], en:'I don\'t have anything.'}]},
{id:'adjectives', title:'Describing words', sub:'They come after the noun, and they match it',
 explain:`<p>Adjectives usually go <b>after</b> the noun, and they match it: masculine/feminine and singular/plural.</p>
 <ul><li>-o adjectives change: un carro roj<b>o</b>, una casa roj<b>a</b>, carros roj<b>os</b>, casas roj<b>as</b>.</li><li>Adjectives ending in -e or a consonant only change for plural: un libro grande, una casa grande, casas grande<b>s</b>, azul → azul<b>es</b>.</li></ul>`,
 ex:[['un perro negro', 'a black dog'], ['una casa blanca', 'a white house'], ['los zapatos nuevos', 'the new shoes'], ['dos camisas azules', 'two blue shirts']],
 q:[{t:'pick', s:'una casa ＿', o:['pequeña', 'pequeño', 'pequeños'], en:'a small house'}, {t:'pick', s:'los libros ＿', o:['nuevos', 'nuevo', 'nuevas'], en:'the new books'}, {t:'pick', s:'las flores ＿', o:['rojas', 'rojos', 'roja'], en:'the red flowers'},
  {t:'type', p:'"a black cat" in Spanish', a:'un gato negro'}, {t:'type', p:'"the white houses" in Spanish', a:'las casas blancas'}, {t:'order', w:'tengo un carro azul', en:'I have a blue car.'}]},
{id:'tener', title:'tener: to have', sub:'tengo, tienes, tiene… and how old you are',
 explain:`<p><b>tener</b> is irregular:</p>
 <table><tr><td>yo <b>tengo</b></td><td>nosotros <b>tenemos</b></td></tr><tr><td>tú <b>tienes</b></td><td>ustedes <b>tienen</b></td></tr><tr><td>él, ella, usted <b>tiene</b></td><td>ellos, ellas <b>tienen</b></td></tr></table>
 <p>Spanish uses tener for age and some feelings: <b>Tengo veinte años</b> (I'm twenty), <b>tengo hambre</b> (I'm hungry), <b>tengo sed</b> (thirsty), <b>tengo frío</b> (cold).</p>`,
 ex:[['Tengo dos hermanos.', 'I have two brothers (or siblings).'], ['¿Cuántos años tienes?', 'How old are you?'], ['Tengo hambre.', 'I\'m hungry.'], ['Ellos tienen un perro.', 'They have a dog.']],
 q:[{t:'type', p:'tener → yo', a:'tengo'}, {t:'type', p:'tener → tú', a:'tienes'}, {t:'type', p:'tener → nosotros', a:'tenemos'}, {t:'pick', s:'Mi abuela ＿ ochenta años.', o:['tiene', 'es', 'está'], en:'My grandmother is eighty.'},
  {t:'pick', s:'Tengo ＿.', o:['sed', 'cansado', 'feliz'], en:'I\'m thirsty.'}, {t:'order', w:'¿cuántos años tienes?', en:'How old are you?'}]},
{id:'hay', title:'hay: there is, there are', sub:'One word for both',
 explain:`<p><b>hay</b> (said like "eye") means both "there is" and "there are". It never changes: <b>hay un libro</b>, <b>hay dos libros</b>. In questions: <b>¿Hay…?</b> = Is there…? / Are there…?</p>
 <p>Use hay to say something exists; use <b>estar</b> to say where a specific thing is: <b>Hay</b> un banco aquí. / El banco <b>está</b> aquí.</p>`,
 ex:[['Hay un perro en la casa.', 'There is a dog in the house.'], ['Hay muchas personas.', 'There are many people.'], ['¿Hay un baño aquí?', 'Is there a bathroom here?'], ['No hay leche.', 'There is no milk.']],
 q:[{t:'pick', s:'＿ tres sillas.', o:['hay', 'son', 'están'], en:'There are three chairs.'}, {t:'pick', s:'¿＿ un hotel cerca?', o:['Hay', 'Está', 'Es'], en:'Is there a hotel nearby?'}, {t:'pick', s:'El hotel ＿ cerca.', o:['está', 'hay', 'es'], en:'The hotel is nearby.'},
  {t:'order', w:'no hay agua', en:'There is no water.'}, {t:'order', w:'hay un gato en la cama', en:'There is a cat on the bed.'}]},
{id:'ir', title:'ir, and ir a…', sub:'voy, vas, va… and the easy future',
 explain:`<p><b>ir</b> (to go) is irregular: <b>voy, vas, va, vamos, van</b>. Going <i>to</i> a place uses <b>a</b>, and a + el = <b>al</b>: Voy <b>al</b> parque.</p>
 <p>The easiest way to talk about the future: <b>ir a + verb</b>. <b>Voy a comer</b> = I'm going to eat.</p>`,
 ex:[['Voy a la tienda.', 'I\'m going to the store.'], ['¿Adónde vas?', 'Where are you going?'], ['Vamos al parque.', 'We\'re going to the park.'], ['Mañana voy a estudiar.', 'Tomorrow I\'m going to study.']],
 q:[{t:'type', p:'ir → yo', a:'voy'}, {t:'type', p:'ir → nosotros', a:'vamos'}, {t:'pick', s:'Ella ＿ a la escuela.', o:['va', 'vas', 'voy'], en:'She goes to school.'}, {t:'pick', s:'Vamos ＿ parque.', o:['al', 'a el', 'en el'], en:'We\'re going to the park.'},
  {t:'order', w:'voy a comer ahora', en:'I\'m going to eat now.'}, {t:'order', w:'ellos van a viajar mañana', en:'They\'re going to travel tomorrow.'}]},
{id:'gustar', title:'me gusta', sub:'Saying what you like',
 explain:`<p>Spanish says "it pleases me" instead of "I like it". The thing you like is the subject, so the verb is <b>gusta</b> for one thing (or an action) and <b>gustan</b> for several:</p>
 <ul><li><b>Me gusta</b> el café. <b>Me gustan</b> los perros. <b>Me gusta</b> bailar.</li></ul>
 <p>Who likes it goes first: <b>me</b> (I), <b>te</b> (you), <b>le</b> (he, she, you formal), <b>nos</b> (we), <b>les</b> (they, you all).</p>`,
 ex:[['Me gusta la música.', 'I like music.'], ['¿Te gustan los gatos?', 'Do you like cats?'], ['No me gusta cocinar.', 'I don\'t like to cook.'], ['Nos gusta el mar.', 'We like the sea.']],
 q:[{t:'pick', s:'Me ＿ el chocolate.', o:['gusta', 'gustan', 'gusto'], en:'I like chocolate.'}, {t:'pick', s:'Me ＿ las flores.', o:['gustan', 'gusta', 'gustas'], en:'I like flowers.'}, {t:'pick', s:'¿＿ gusta el té?', o:['Te', 'Tú', 'Tu'], en:'Do you like tea?'},
  {t:'pick', s:'Nos ＿ bailar.', o:['gusta', 'gustan', 'gustamos'], en:'We like to dance.'}, {t:'order', w:'no me gusta el frío', en:'I don\'t like the cold.'}]},
{id:'possessives', title:'my, your, his…', sub:'mi, tu, su, nuestro',
 explain:`<p>Possessives go before the noun. <b>mi</b> (my), <b>tu</b> (your), <b>su</b> (his, her, its, their, your formal), <b>nuestro / nuestra</b> (our). They add <b>-s</b> for plural nouns: <b>mis</b> amigos, <b>sus</b> libros.</p>
 <p>Only nuestro changes for feminine: <b>nuestra</b> casa.</p>`,
 ex:[['Mi hermana es alta.', 'My sister is tall.'], ['¿Dónde está tu carro?', 'Where is your car?'], ['Sus hijos viven aquí.', 'Their children live here.'], ['Nuestra casa es pequeña.', 'Our house is small.']],
 q:[{t:'pick', s:'＿ amigos son de Perú.', o:['Mis', 'Mi', 'Me'], en:'My friends are from Peru.'}, {t:'pick', s:'＿ casa es grande.', o:['Nuestra', 'Nuestro', 'Nuestros'], en:'Our house is big.'}, {t:'pick', s:'¿Es ＿ perro?', o:['tu', 'tú', 'te'], en:'Is it your dog?'},
  {t:'type', p:'"my books" in Spanish', a:'mis libros'}, {t:'order', w:'mi padre trabaja en un banco', en:'My father works in a bank.'}]},
{id:'questions', title:'Question words', sub:'qué, quién, dónde, cuándo, cómo…',
 explain:`<p>Question words always carry an accent and go first: <b>¿Qué</b> (what), <b>¿Quién</b> (who), <b>¿Dónde</b> (where), <b>¿Adónde</b> (where to), <b>¿Cuándo</b> (when), <b>¿Cómo</b> (how), <b>¿Cuánto</b> (how much), <b>¿Cuántos</b> (how many), <b>¿Por qué</b> (why), <b>¿Cuál</b> (which).</p>
 <p>The verb usually comes right after: <b>¿Dónde vives?</b> <b>¿Qué quieres?</b></p>`,
 ex:[['¿Qué es esto?', 'What is this?'], ['¿Quién es él?', 'Who is he?'], ['¿Cuándo llegas?', 'When are you arriving?'], ['¿Por qué estudias español?', 'Why are you studying Spanish?']],
 q:[{t:'pick', s:'¿＿ vives? — En Bogotá.', o:['Dónde', 'Cuándo', 'Quién']}, {t:'pick', s:'¿＿ es tu cumpleaños? — En mayo.', o:['Cuándo', 'Dónde', 'Qué']}, {t:'pick', s:'¿＿ hermanos tienes? — Dos.', o:['Cuántos', 'Cuánto', 'Cómo']},
  {t:'pick', s:'¿＿ te llamas? — Me llamo Luis.', o:['Cómo', 'Qué', 'Quién']}, {t:'pick', s:'¿＿ estudias? — Porque me gusta.', o:['Por qué', 'Porque', 'Qué']}, {t:'order', w:'¿qué quieres comer?', en:'What do you want to eat?'}]},
{id:'stem', title:'Verbs that change inside', sub:'quiero, puedo, duermo',
 explain:`<p>Some verbs change their stem vowel in every form except nosotros:</p>
 <ul><li><b>e → ie</b>: querer → qu<b>ie</b>ro, qu<b>ie</b>res, qu<b>ie</b>re, queremos, qu<b>ie</b>ren. Also pensar, empezar.</li><li><b>o → ue</b>: poder → p<b>ue</b>do, p<b>ue</b>des, p<b>ue</b>de, podemos, p<b>ue</b>den. Also dormir, volver, encontrar.</li><li><b>u → ue</b>: jugar → j<b>ue</b>go.</li></ul>
 <p>After querer and poder, the next verb stays in the -ar/-er/-ir form: <b>Quiero comer</b>. <b>¿Puedes ayudar?</b></p>`,
 ex:[['Quiero un café, por favor.', 'I want a coffee, please.'], ['¿Puedes repetir?', 'Can you repeat?'], ['Duermo ocho horas.', 'I sleep eight hours.'], ['Podemos ir mañana.', 'We can go tomorrow.']],
 q:[{t:'type', p:'querer → yo', a:'quiero'}, {t:'type', p:'poder → tú', a:'puedes'}, {t:'type', p:'dormir → él', a:'duerme'}, {t:'type', p:'poder → nosotros', a:'podemos'}, {t:'type', p:'jugar → yo', a:'juego'},
  {t:'order', w:'¿puedes hablar más despacio?', en:'Can you speak more slowly?'}]},
{id:'reflexive', title:'me llamo, me levanto', sub:'Reflexive verbs',
 explain:`<p>Verbs ending in <b>-se</b> are done to yourself. The -se moves to the front and matches the person: <b>me</b>, <b>te</b>, <b>se</b>, <b>nos</b>, <b>se</b>.</p>
 <table><tr><td>yo <b>me</b> levanto</td><td>nosotros <b>nos</b> levantamos</td></tr><tr><td>tú <b>te</b> levantas</td><td>ustedes <b>se</b> levantan</td></tr><tr><td>él, ella, usted <b>se</b> levanta</td><td>ellos <b>se</b> levantan</td></tr></table>
 <p>That's where <b>Me llamo…</b> comes from: "I call myself…".</p>`,
 ex:[['Me llamo Sofía.', 'My name is Sofía.'], ['¿A qué hora te levantas?', 'What time do you get up?'], ['Él se ducha por la mañana.', 'He showers in the morning.'], ['Nos acostamos tarde.', 'We go to bed late.']],
 q:[{t:'pick', s:'Yo ＿ llamo Pedro.', o:['me', 'se', 'te'], en:'My name is Pedro.'}, {t:'pick', s:'¿Cómo ＿ llamas?', o:['te', 'me', 'se'], en:'What\'s your name?'}, {t:'pick', s:'Ella ＿ levanta temprano.', o:['se', 'me', 'te'], en:'She gets up early.'},
  {t:'pick', s:'Nosotros ＿ duchamos.', o:['nos', 'se', 'me'], en:'We shower.'}, {t:'order', w:'me levanto a las siete', en:'I get up at seven.'}]},
{id:'time', title:'What time is it?', sub:'Es la una, son las dos',
 explain:`<p><b>¿Qué hora es?</b> = What time is it? For one o'clock, <b>Es la una</b>; for every other hour, <b>Son las…</b>: Son las dos, son las diez.</p>
 <ul><li><b>y media</b> = half past: Son las tres y media.</li><li><b>y cuarto</b> = quarter past.</li><li>"At" a time is <b>a las…</b>: Llego <b>a las</b> ocho.</li></ul>`,
 ex:[['Es la una.', 'It\'s one o\'clock.'], ['Son las cuatro y media.', 'It\'s four thirty.'], ['La clase es a las nueve.', 'The class is at nine.'], ['¿A qué hora llegas?', 'What time do you arrive?']],
 q:[{t:'pick', s:'＿ la una.', o:['Es', 'Son', 'Está']}, {t:'pick', s:'＿ las tres.', o:['Son', 'Es', 'Están']}, {t:'pick', s:'Llego ＿ ocho.', o:['a las', 'en las', 'las']},
  {t:'order', w:'son las dos y media', en:'It\'s two thirty.'}, {t:'type', p:'"It\'s ten o\'clock" in Spanish', a:'son las diez'}]},
];
