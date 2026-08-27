import { getLocale } from '../i18n/index.js';

export const literaryFacts = [
  {
    ru: {
      text: '«Евгений Онегин» часто называют романом в стихах: сюжет развивается как в романе, но написан стихотворными строфами.',
      source: 'Александр Пушкин',
    },
    en: {
      text: 'Eugene Onegin is often called a novel in verse: it tells a novel-like story through poetic stanzas.',
      source: 'Alexander Pushkin',
    },
  },
  {
    ru: {
      text: 'Пушкинская «онегинская строфа» состоит из 14 строк и имеет устойчивую схему рифмовки.',
      source: 'Евгений Онегин',
    },
    en: {
      text: 'Pushkin’s Onegin stanza has 14 lines and follows a fixed rhyme pattern.',
      source: 'Eugene Onegin',
    },
  },
  {
    ru: {
      text: 'Николай Гоголь мастерски использовал детали: по одной смешной мелочи у него часто раскрывается целый характер.',
      source: 'Николай Гоголь',
    },
    en: {
      text: 'Nikolai Gogol used details masterfully: one comic little trait can reveal an entire character.',
      source: 'Nikolai Gogol',
    },
  },
  {
    ru: {
      text: '«Ревизор» Гоголя построен на ошибке: чиновники принимают случайного приезжего за важного проверяющего.',
      source: 'Ревизор',
    },
    en: {
      text: 'Gogol’s The Government Inspector is built around a mistake: officials take a random visitor for an important inspector.',
      source: 'The Government Inspector',
    },
  },
  {
    ru: {
      text: 'Достоевский особенно известен вниманием к внутреннему миру героев и сложным нравственным выборам.',
      source: 'Фёдор Достоевский',
    },
    en: {
      text: 'Dostoevsky is especially known for exploring characters’ inner lives and difficult moral choices.',
      source: 'Fyodor Dostoevsky',
    },
  },
  {
    ru: {
      text: '«Братья Карамазовы» стали последним большим романом Достоевского.',
      source: 'Фёдор Достоевский',
    },
    en: {
      text: 'The Brothers Karamazov was Dostoevsky’s final major novel.',
      source: 'Fyodor Dostoevsky',
    },
  },
  {
    ru: {
      text: 'Толстой вёл дневники много десятилетий, и они помогают лучше понять его путь как писателя.',
      source: 'Лев Толстой',
    },
    en: {
      text: 'Tolstoy kept diaries for many decades, and they help readers understand his path as a writer.',
      source: 'Leo Tolstoy',
    },
  },
  {
    ru: {
      text: 'Толстой задумал «Анну Каренину» как семейный роман, но постепенно расширил его до картины общества.',
      source: 'Анна Каренина',
    },
    en: {
      text: 'Tolstoy began Anna Karenina as a family novel and gradually expanded it into a portrait of society.',
      source: 'Anna Karenina',
    },
  },
  {
    ru: {
      text: 'Чехов был врачом и всю жизнь сохранял связь с медициной, даже когда стал знаменитым писателем.',
      source: 'Антон Чехов',
    },
    en: {
      text: 'Chekhov was a doctor and kept a lifelong connection with medicine even after becoming a famous writer.',
      source: 'Anton Chekhov',
    },
  },
  {
    ru: {
      text: 'Чеховские пьесы часто строятся не на внешнем действии, а на паузах, подтексте и разговорах.',
      source: 'Антон Чехов',
    },
    en: {
      text: 'Chekhov’s plays often rely less on visible action and more on pauses, subtext, and conversation.',
      source: 'Anton Chekhov',
    },
  },
  {
    ru: {
      text: 'Булгаков много работал с театром, и сценичность заметна во многих его диалогах.',
      source: 'Михаил Булгаков',
    },
    en: {
      text: 'Bulgakov worked closely with theatre, and many of his dialogues have a vivid stage quality.',
      source: 'Mikhail Bulgakov',
    },
  },
  {
    ru: {
      text: 'Булгаков был врачом по образованию; медицинский опыт заметен в его ранней прозе.',
      source: 'Михаил Булгаков',
    },
    en: {
      text: 'Bulgakov trained as a doctor, and his medical experience is visible in his early fiction.',
      source: 'Mikhail Bulgakov',
    },
  },
  {
    ru: {
      text: 'Анна Ахматова стала одним из самых узнаваемых голосов поэзии Серебряного века.',
      source: 'Анна Ахматова',
    },
    en: {
      text: 'Anna Akhmatova became one of the most recognizable poetic voices of the Silver Age.',
      source: 'Anna Akhmatova',
    },
  },
  {
    ru: {
      text: 'Марина Цветаева писала стихи с резким ритмом и неожиданными переносами — это стало частью её узнаваемого стиля.',
      source: 'Марина Цветаева',
    },
    en: {
      text: 'Marina Tsvetaeva’s sharp rhythms and unexpected line breaks became part of her unmistakable style.',
      source: 'Marina Tsvetaeva',
    },
  },
  {
    ru: {
      text: 'Маяковский часто использовал «лесенку» — особую запись строк, которая подчёркивает ритм и интонацию.',
      source: 'Владимир Маяковский',
    },
    en: {
      text: 'Mayakovsky often used a “staircase” line layout to emphasize rhythm and intonation.',
      source: 'Vladimir Mayakovsky',
    },
  },
  {
    ru: {
      text: 'Борис Пастернак был не только прозаиком, но и тонким лирическим поэтом.',
      source: 'Борис Пастернак',
    },
    en: {
      text: 'Boris Pasternak was not only a novelist but also a subtle lyric poet.',
      source: 'Boris Pasternak',
    },
  },
  {
    ru: {
      text: 'Пастернак много переводил Шекспира, Гёте и других классиков мировой литературы.',
      source: 'Борис Пастернак',
    },
    en: {
      text: 'Pasternak translated Shakespeare, Goethe, and other classics of world literature.',
      source: 'Boris Pasternak',
    },
  },
  {
    ru: {
      text: 'Самуил Маршак переводил английские баллады и писал стихи, которые любят читать вслух.',
      source: 'Самуил Маршак',
    },
    en: {
      text: 'Samuil Marshak translated English ballads and wrote poems that are loved for reading aloud.',
      source: 'Samuil Marshak',
    },
  },
  {
    ru: {
      text: 'Корней Чуковский создавал яркие детские стихи с живым ритмом и запоминающимися героями.',
      source: 'Корней Чуковский',
    },
    en: {
      text: 'Korney Chukovsky created lively children’s poems with strong rhythm and memorable characters.',
      source: 'Korney Chukovsky',
    },
  },
  {
    ru: {
      text: 'Иван Тургенев помог сделать слово «нигилист» литературно известным после романа «Отцы и дети».',
      source: 'Отцы и дети',
    },
    en: {
      text: 'Ivan Turgenev helped make the word “nihilist” famous through his novel Fathers and Sons.',
      source: 'Fathers and Sons',
    },
  },
  {
    ru: {
      text: '«Обломов» Гончарова запомнился читателям внимательным изображением характера героя.',
      source: 'Иван Гончаров',
    },
    en: {
      text: 'Goncharov’s Oblomov is remembered for its careful portrait of the main character.',
      source: 'Ivan Goncharov',
    },
  },
  {
    ru: {
      text: 'Лермонтовский «Герой нашего времени» состоит из отдельных повестей, собранных вокруг фигуры Печорина.',
      source: 'Михаил Лермонтов',
    },
    en: {
      text: 'Lermontov’s A Hero of Our Time is made of linked stories centered on Pechorin.',
      source: 'Mikhail Lermontov',
    },
  },
  {
    ru: {
      text: 'Крылов сделал басню особенно популярным жанром в русской литературе XIX века.',
      source: 'Иван Крылов',
    },
    en: {
      text: 'Ivan Krylov made the fable an especially popular genre in nineteenth-century Russian literature.',
      source: 'Ivan Krylov',
    },
  },
  {
    ru: {
      text: 'Державин был не только поэтом, но и государственным деятелем Российской империи.',
      source: 'Гавриил Державин',
    },
    en: {
      text: 'Gavrila Derzhavin was both a poet and a statesman of the Russian Empire.',
      source: 'Gavrila Derzhavin',
    },
  },
  {
    ru: {
      text: 'Древнерусские книжники часто украшали рукописи заставками, буквицами и орнаментами.',
      source: 'Древнерусская литература',
    },
    en: {
      text: 'Old East Slavic scribes often decorated manuscripts with headpieces, initials, and ornaments.',
      source: 'Old East Slavic literature',
    },
  },
  {
    ru: {
      text: 'Шекспир писал для театра, где женские роли в его время исполняли юноши-актёры.',
      source: 'Уильям Шекспир',
    },
    en: {
      text: 'Shakespeare wrote for a theatre where female roles were performed by young male actors.',
      source: 'William Shakespeare',
    },
  },
  {
    ru: {
      text: 'Сонеты Шекспира состоят из 14 строк и часто заканчиваются сильным смысловым поворотом.',
      source: 'Сонеты Шекспира',
    },
    en: {
      text: 'Shakespeare’s sonnets have 14 lines and often end with a strong turn of thought.',
      source: 'Shakespeare’s sonnets',
    },
  },
  {
    ru: {
      text: '«Дон Кихот» Сервантеса часто называют одним из первых великих романов Нового времени.',
      source: 'Мигель де Сервантес',
    },
    en: {
      text: 'Cervantes’s Don Quixote is often called one of the first great modern novels.',
      source: 'Miguel de Cervantes',
    },
  },
  {
    ru: {
      text: 'Сервантес и Шекспир жили в одну эпоху, но создавали очень разные литературные миры.',
      source: 'Сервантес и Шекспир',
    },
    en: {
      text: 'Cervantes and Shakespeare lived in the same era but created very different literary worlds.',
      source: 'Cervantes and Shakespeare',
    },
  },
  {
    ru: {
      text: 'Данте написал «Божественную комедию» не на латыни, а на итальянском народном языке своего времени.',
      source: 'Данте Алигьери',
    },
    en: {
      text: 'Dante wrote The Divine Comedy not in Latin but in the Italian vernacular of his time.',
      source: 'Dante Alighieri',
    },
  },
  {
    ru: {
      text: '«Божественная комедия» делится на три большие части и выстроена как путешествие героя.',
      source: 'Божественная комедия',
    },
    en: {
      text: 'The Divine Comedy is divided into three large parts and shaped as the hero’s journey.',
      source: 'The Divine Comedy',
    },
  },
  {
    ru: {
      text: 'Гомерические поэмы веками передавались устно, прежде чем закрепились в письменной традиции.',
      source: 'Гомер',
    },
    en: {
      text: 'The Homeric poems were transmitted orally for generations before becoming fixed in written tradition.',
      source: 'Homer',
    },
  },
  {
    ru: {
      text: '«Одиссея» рассказывает о долгом путешествии домой и стала образцом приключенческого сюжета.',
      source: 'Одиссея',
    },
    en: {
      text: 'The Odyssey tells of a long journey home and became a model for adventure storytelling.',
      source: 'The Odyssey',
    },
  },
  {
    ru: {
      text: '«Тысяча и одна ночь» — собрание историй, где рамочный сюжет связывает множество разных сказаний.',
      source: 'Тысяча и одна ночь',
    },
    en: {
      text: 'One Thousand and One Nights uses a frame story to connect many different tales.',
      source: 'One Thousand and One Nights',
    },
  },
  {
    ru: {
      text: 'Братья Гримм были филологами и собирали сказки как часть изучения языка и народной культуры.',
      source: 'Братья Гримм',
    },
    en: {
      text: 'The Brothers Grimm were philologists who collected fairy tales as part of studying language and folk culture.',
      source: 'Brothers Grimm',
    },
  },
  {
    ru: {
      text: 'Ганс Христиан Андерсен писал литературные сказки: многие из них не были простыми пересказами фольклора.',
      source: 'Ганс Христиан Андерсен',
    },
    en: {
      text: 'Hans Christian Andersen wrote literary fairy tales; many were not simple retellings of folklore.',
      source: 'Hans Christian Andersen',
    },
  },
  {
    ru: {
      text: '«Алиса в Стране чудес» выросла из истории, которую Льюис Кэрролл рассказал во время лодочной прогулки.',
      source: 'Льюис Кэрролл',
    },
    en: {
      text: 'Alice’s Adventures in Wonderland grew from a story Lewis Carroll told during a boating trip.',
      source: 'Lewis Carroll',
    },
  },
  {
    ru: {
      text: 'Льюис Кэрролл был математиком, и игра с логикой заметна во многих сценах «Алисы».',
      source: 'Льюис Кэрролл',
    },
    en: {
      text: 'Lewis Carroll was a mathematician, and playful logic runs through many scenes in Alice.',
      source: 'Lewis Carroll',
    },
  },
  {
    ru: {
      text: 'Мэри Шелли создала необычную историю о науке и ответственности ещё в юном возрасте.',
      source: 'Мэри Шелли',
    },
    en: {
      text: 'Mary Shelley created an unusual story about science and responsibility while still very young.',
      source: 'Mary Shelley',
    },
  },
  {
    ru: {
      text: '«Франкенштейн» часто считают одним из важных ранних произведений научной фантастики.',
      source: 'Франкенштейн',
    },
    en: {
      text: 'Frankenstein is often considered an important early work of science fiction.',
      source: 'Frankenstein',
    },
  },
  {
    ru: {
      text: 'Джейн Остин публиковала ранние романы анонимно: на титульных листах было указано «by a Lady».',
      source: 'Джейн Остин',
    },
    en: {
      text: 'Jane Austen published early novels anonymously, with title pages saying “by a Lady.”',
      source: 'Jane Austen',
    },
  },
  {
    ru: {
      text: '«Гордость и предубеждение» сначала называлась «Первые впечатления».',
      source: 'Джейн Остин',
    },
    en: {
      text: 'Pride and Prejudice was first titled First Impressions.',
      source: 'Jane Austen',
    },
  },
  {
    ru: {
      text: 'Шарлотта, Эмили и Энн Бронте сначала публиковались под мужскими псевдонимами Каррер, Эллис и Эктон Белл.',
      source: 'Сёстры Бронте',
    },
    en: {
      text: 'Charlotte, Emily, and Anne Brontë first published under the male pen names Currer, Ellis, and Acton Bell.',
      source: 'Brontë sisters',
    },
  },
  {
    ru: {
      text: '«Грозовой перевал» — единственный роман Эмили Бронте.',
      source: 'Эмили Бронте',
    },
    en: {
      text: 'Wuthering Heights is Emily Brontë’s only novel.',
      source: 'Emily Brontë',
    },
  },
  {
    ru: {
      text: 'Чарльз Диккенс часто печатал романы по частям, поэтому читатели ждали продолжения как сериала.',
      source: 'Чарльз Диккенс',
    },
    en: {
      text: 'Charles Dickens often published novels in installments, so readers waited for the next part like a serial.',
      source: 'Charles Dickens',
    },
  },
  {
    ru: {
      text: '«Рождественская песнь» Диккенса помогла закрепить образ Рождества как времени милосердия и семейного тепла.',
      source: 'Чарльз Диккенс',
    },
    en: {
      text: 'Dickens’s A Christmas Carol helped shape the image of Christmas as a time of mercy and family warmth.',
      source: 'Charles Dickens',
    },
  },
  {
    ru: {
      text: 'Виктор Гюго работал над «Отверженными» много лет и сделал роман панорамой французского общества.',
      source: 'Виктор Гюго',
    },
    en: {
      text: 'Victor Hugo worked on Les Misérables for years and turned it into a panorama of French society.',
      source: 'Victor Hugo',
    },
  },
  {
    ru: {
      text: '«Собор Парижской Богоматери» привлёк внимание к ценности средневековой архитектуры Парижа.',
      source: 'Виктор Гюго',
    },
    en: {
      text: 'The Hunchback of Notre-Dame drew attention to the value of Paris’s medieval architecture.',
      source: 'Victor Hugo',
    },
  },
  {
    ru: {
      text: 'Александр Дюма писал приключенческие романы, которые часто выходили газетными публикациями с продолжением.',
      source: 'Александр Дюма',
    },
    en: {
      text: 'Alexandre Dumas wrote adventure novels that often appeared as serialized newspaper publications.',
      source: 'Alexandre Dumas',
    },
  },
  {
    ru: {
      text: '«Три мушкетёра» — роман о дружбе, смелости и приключениях во Франции XVII века.',
      source: 'Три мушкетёра',
    },
    en: {
      text: 'The Three Musketeers is a novel about friendship, courage, and adventure in seventeenth-century France.',
      source: 'The Three Musketeers',
    },
  },
  {
    ru: {
      text: 'Жюль Верн писал о путешествиях и технологиях так убедительно, что его часто связывают с рождением научной фантастики.',
      source: 'Жюль Верн',
    },
    en: {
      text: 'Jules Verne wrote about travel and technology so vividly that he is often linked with the birth of science fiction.',
      source: 'Jules Verne',
    },
  },
  {
    ru: {
      text: '«Вокруг света за 80 дней» появился в эпоху, когда железные дороги и пароходы меняли ощущение расстояния.',
      source: 'Жюль Верн',
    },
    en: {
      text: 'Around the World in Eighty Days appeared when railways and steamships were changing how people felt distance.',
      source: 'Jules Verne',
    },
  },
  {
    ru: {
      text: 'Герберт Уэллс использовал фантастику, чтобы увлекательно размышлять о науке и будущем.',
      source: 'Герберт Уэллс',
    },
    en: {
      text: 'H. G. Wells used science fiction to think imaginatively about science and the future.',
      source: 'H. G. Wells',
    },
  },
  {
    ru: {
      text: '«Машина времени» Уэллса сделала путешествие во времени одним из классических сюжетов фантастики.',
      source: 'Машина времени',
    },
    en: {
      text: 'Wells’s The Time Machine helped make time travel a classic science-fiction plot.',
      source: 'The Time Machine',
    },
  },
  {
    ru: {
      text: 'Артур Конан Дойл был врачом; прототипом наблюдательности Холмса часто называют доктора Джозефа Белла.',
      source: 'Артур Конан Дойл',
    },
    en: {
      text: 'Arthur Conan Doyle was a doctor; Dr. Joseph Bell is often cited as a model for Holmes’s powers of observation.',
      source: 'Arthur Conan Doyle',
    },
  },
  {
    ru: {
      text: 'Шерлок Холмс впервые появился в повести «Этюд в багровых тонах».',
      source: 'Шерлок Холмс',
    },
    en: {
      text: 'Sherlock Holmes first appeared in the novella A Study in Scarlet.',
      source: 'Sherlock Holmes',
    },
  },
  {
    ru: {
      text: 'Агата Кристи создала двух знаменитых сыщиков: Эркюля Пуаро и мисс Марпл.',
      source: 'Агата Кристи',
    },
    en: {
      text: 'Agatha Christie created two famous detectives: Hercule Poirot and Miss Marple.',
      source: 'Agatha Christie',
    },
  },
  {
    ru: {
      text: 'Агата Кристи любила путешествия и нередко использовала впечатления от поездок в своих сюжетах.',
      source: 'Агата Кристи',
    },
    en: {
      text: 'Agatha Christie loved travel and often used impressions from her journeys in her plots.',
      source: 'Agatha Christie',
    },
  },
  {
    ru: {
      text: 'Толкин был филологом, и языки Средиземья стали одной из основ его мира.',
      source: 'Дж. Р. Р. Толкин',
    },
    en: {
      text: 'Tolkien was a philologist, and the languages of Middle-earth became one of the foundations of his world.',
      source: 'J. R. R. Tolkien',
    },
  },
  {
    ru: {
      text: '«Хоббит» сначала был детской книгой, а затем вырос в огромную мифологию «Властелина колец».',
      source: 'Дж. Р. Р. Толкин',
    },
    en: {
      text: 'The Hobbit began as a children’s book and grew into the vast mythology of The Lord of the Rings.',
      source: 'J. R. R. Tolkien',
    },
  },
  {
    ru: {
      text: 'Клайв Льюис и Толкин входили в литературный круг «Инклинги» и обсуждали рукописи друг друга.',
      source: 'Инклинги',
    },
    en: {
      text: 'C. S. Lewis and Tolkien belonged to the Inklings, a literary circle that discussed members’ manuscripts.',
      source: 'The Inklings',
    },
  },
  {
    ru: {
      text: '«Хроники Нарнии» соединяют приключение, сказку и христианские мотивы.',
      source: 'Клайв Льюис',
    },
    en: {
      text: 'The Chronicles of Narnia blend adventure, fairy tale, and Christian motifs.',
      source: 'C. S. Lewis',
    },
  },
  {
    ru: {
      text: 'Джордж Оруэлл — псевдоним Эрика Артура Блэра.',
      source: 'Джордж Оруэлл',
    },
    en: {
      text: 'George Orwell was the pen name of Eric Arthur Blair.',
      source: 'George Orwell',
    },
  },
  {
    ru: {
      text: 'Оруэлл ценил ясный язык и считал, что хорошая проза должна быть точной и понятной.',
      source: 'Джордж Оруэлл',
    },
    en: {
      text: 'Orwell valued clear language and believed good prose should be precise and understandable.',
      source: 'George Orwell',
    },
  },
  {
    ru: {
      text: 'Рэй Брэдбери в юности часто ходил в библиотеку и называл её своим настоящим университетом.',
      source: 'Рэй Брэдбери',
    },
    en: {
      text: 'Ray Bradbury often visited libraries as a young man and called the library his real university.',
      source: 'Ray Bradbury',
    },
  },
  {
    ru: {
      text: 'Брэдбери писал рассказы с особой поэтичностью, поэтому его фантастику легко узнать по настроению.',
      source: 'Рэй Брэдбери',
    },
    en: {
      text: 'Bradbury wrote stories with a poetic touch, making his science fiction easy to recognize by mood.',
      source: 'Ray Bradbury',
    },
  },
  {
    ru: {
      text: 'Айзек Азимов писал не только фантастику, но и научно-популярные книги по самым разным темам.',
      source: 'Айзек Азимов',
    },
    en: {
      text: 'Isaac Asimov wrote not only science fiction but also nonfiction books on many subjects.',
      source: 'Isaac Asimov',
    },
  },
  {
    ru: {
      text: 'Три закона робототехники Азимова стали одной из самых известных идей в фантастике о роботах.',
      source: 'Айзек Азимов',
    },
    en: {
      text: 'Asimov’s Three Laws of Robotics became one of the most famous ideas in robot fiction.',
      source: 'Isaac Asimov',
    },
  },
  {
    ru: {
      text: 'Урсула Ле Гуин использовала фантастику и фэнтези, чтобы говорить о культуре, языке и устройстве общества.',
      source: 'Урсула Ле Гуин',
    },
    en: {
      text: 'Ursula K. Le Guin used science fiction and fantasy to explore culture, language, and society.',
      source: 'Ursula K. Le Guin',
    },
  },
  {
    ru: {
      text: '«Волшебник Земноморья» Ле Гуин строится вокруг силы истинных имён.',
      source: 'Земноморье',
    },
    en: {
      text: 'Le Guin’s A Wizard of Earthsea is built around the power of true names.',
      source: 'Earthsea',
    },
  },
];

export function getLiteraryFactForLevel(level, locale = getLocale()) {
  const normalizedLevel = Math.max(1, Math.floor(Number(level) || 1));
  const fact = literaryFacts[(normalizedLevel - 1) % literaryFacts.length];
  return fact[locale] ?? fact.ru;
}
