// Real Mundial 2026 sticker catalog — ported from MundialSwap (WebMundial/lib/).
// This file is pure static data. No component logic lives here.
// Real app: this data comes from GET /api/catalog (seeded from supabase stickers table).

// ── Country names (Spanish) ──────────────────────────────────────────────────
export const COUNTRY_NAMES = {
  MEX: 'México',       RSA: 'Sudáfrica',      KOR: 'Corea del Sur',
  CZE: 'Rep. Checa',   CAN: 'Canadá',         BIH: 'Bosnia Herz.',
  QAT: 'Qatar',        SUI: 'Suiza',           BRA: 'Brasil',
  MAR: 'Marruecos',    HAI: 'Haití',           SCO: 'Escocia',
  USA: 'EE.UU.',       PAR: 'Paraguay',        AUS: 'Australia',
  TUR: 'Turquía',      GER: 'Alemania',        CUW: 'Curazao',
  CIV: 'Costa de Marfil', ECU: 'Ecuador',      NED: 'Países Bajos',
  JPN: 'Japón',        SWE: 'Suecia',          TUN: 'Túnez',
  BEL: 'Bélgica',      EGY: 'Egipto',          IRN: 'Irán',
  NZL: 'Nueva Zelanda',ESP: 'España',          CPV: 'Cabo Verde',
  KSA: 'Arabia Saudita',URU: 'Uruguay',        FRA: 'Francia',
  SEN: 'Senegal',      IRQ: 'Irak',            NOR: 'Noruega',
  ARG: 'Argentina',    ALG: 'Argelia',         AUT: 'Austria',
  JOR: 'Jordania',     POR: 'Portugal',        COD: 'R.D. Congo',
  UZB: 'Uzbekistán',   COL: 'Colombia',        ENG: 'Inglaterra',
  CRO: 'Croacia',      GHA: 'Ghana',           PAN: 'Panamá',
}

// ── Physical album order ─────────────────────────────────────────────────────
// 00(1) → FWC(19) → Bloque1(24×20=480) → CC(14) → Bloque2(24×20=480) = 994 total
const BLOCK1_CODES = [
  'MEX','RSA','KOR','CZE','CAN','BIH','QAT','SUI','BRA','MAR',
  'HAI','SCO','USA','PAR','AUS','TUR','GER','CUW','CIV','ECU',
  'NED','JPN','SWE','TUN',
]
const BLOCK2_CODES = [
  'BEL','EGY','IRN','NZL','ESP','CPV','KSA','URU','FRA','SEN',
  'IRQ','NOR','ARG','ALG','AUT','JOR','POR','COD','UZB','COL',
  'ENG','CRO','GHA','PAN',
]

export const ALBUM_SECTIONS = [
  { section: '00',  count: 1  },
  { section: 'FWC', count: 19 },
  ...BLOCK1_CODES.map((c) => ({ section: c, count: 20 })),
  { section: 'CC',  count: 14 },
  ...BLOCK2_CODES.map((c) => ({ section: c, count: 20 })),
]

// Sections grouped together as "Especiales" in the album filter (not national teams):
// 00 (album logo), FWC (tournament/history) and CC (Coca-Cola collectors).
export const SPECIAL_SECTIONS = ['00', 'FWC', 'CC']

// ── Tier helpers ─────────────────────────────────────────────────────────────
// Tiers: ESP (especiales 00/FWC), CC (Coca-Cola), ESC (escudo), EQP (team photo), JUG (jugador)

export function getTier(section, posInSection) {
  if (section === '00' || section === 'FWC') return 'ESP'
  if (section === 'CC') return 'CC'
  if (posInSection === 1)  return 'ESC'
  if (posInSection === 13) return 'EQP'
  return 'JUG'
}

// Tier → rarity field used by StickerCard
export function getRarity(tier) {
  if (tier === 'ESP') return 'legend'
  if (tier === 'ESC' || tier === 'EQP' || tier === 'CC') return 'gold'
  return 'base'
}

// Tier → position/category field (decision 2026-06-03: position repurposed as category)
export function getCategory(tier) {
  switch (tier) {
    case 'ESP': return 'Especial'
    case 'ESC': return 'Escudo'
    case 'EQP': return 'Foto del equipo'
    case 'CC':  return 'Coca-Cola'
    default:    return 'Jugador'
  }
}

// ── Sticker names — 994 real World Cup 2026 players/emblems ─────────────────
// Ported from MundialSwap (WebMundial/lib/sticker-names.ts). Source: Panini official CSV.
// Corrections applied in source: MAR lowercase→uppercase, SWI→SUI, KAS→KSA,
// GER/BEL duplicate entries excluded, CC limited to CC1–CC14.
export const STICKER_NAMES = {
  // ── Special ─────────────────────────────────────────────────────────────────
  '00': 'Álbum Tradicional Logo',

  // ── FWC block 1 (1–8): tournament identity ──────────────────────────────────
  FWC1: 'Official Emblem 1', FWC2: 'Official Emblem 2', FWC3: 'Official Mascots',
  FWC4: 'Official Slogan',   FWC5: 'Official Ball',     FWC6: 'Canada',
  FWC7: 'Mexico',            FWC8: 'USA',

  // ── MEX ─────────────────────────────────────────────────────────────────────
  MEX1:  'Emblem',           MEX2:  'Luis Malagón',      MEX3:  'Johan Vasquez',
  MEX4:  'Jorge Sánchez',    MEX5:  'Cesar Montes',      MEX6:  'Jesus Gallardo',
  MEX7:  'Israel Reyes',     MEX8:  'Diego Lainez',      MEX9:  'Carlos Rodriguez',
  MEX10: 'Edson Alvarez',    MEX11: 'Orbelin Pineda',    MEX12: 'Marcel Ruiz',
  MEX13: 'Team Photo',       MEX14: 'Érick Sánchez',     MEX15: 'Hirving Lozano',
  MEX16: 'Santiago Giménez', MEX17: 'Raúl Jiménez',      MEX18: 'Alexis Vega',
  MEX19: 'Roberto Alvarado', MEX20: 'Cesar Huerta',

  // ── RSA ─────────────────────────────────────────────────────────────────────
  RSA1:  'Emblem',            RSA2:  'Ronwen Williams',    RSA3:  'Sipho Chaine',
  RSA4:  'Aubrey Modiba',     RSA5:  'Samukele Kabini',    RSA6:  'Mbekezeli Mbokazi',
  RSA7:  'Khulumani Ndamane', RSA8:  'Siyabonga Ngezana',  RSA9:  'Khuliso Mudau',
  RSA10: 'Nkosinathi Sibisi', RSA11: 'Teboho Mokoena',     RSA12: 'Thalente Mbatha',
  RSA13: 'Team Photo',        RSA14: 'Bathasi Aubaas',     RSA15: 'Yaya Sithole',
  RSA16: 'Sipho Mbule',       RSA17: 'Lyle Foster',        RSA18: 'Iqraam Rayners',
  RSA19: 'Mohau Nkota',       RSA20: 'Oswin Appollis',

  // ── KOR ─────────────────────────────────────────────────────────────────────
  KOR1:  'Emblem',            KOR2:  'Hyeon-woo Jo',        KOR3:  'Seung-Gyu Kim',
  KOR4:  'Min-jae Kim',       KOR5:  'Yu-min Cho',          KOR6:  'Young-woo Seol',
  KOR7:  'Han-beom Lee',      KOR8:  'Tae-seok Lee',        KOR9:  'Myung-jae Lee',
  KOR10: 'Jae-sung Lee',      KOR11: 'In-beom Hwang',       KOR12: 'Kang-in Lee',
  KOR13: 'Team Photo',        KOR14: 'Seung-ho Paik',       KOR15: 'Jens Castrop',
  KOR16: 'Dongg-yeong Lee',   KOR17: 'Gue-sung Cho',        KOR18: 'Heung-min Son',
  KOR19: 'Hee-chan Hwang',    KOR20: 'Hyeon-Gyu Oh',

  // ── CZE ─────────────────────────────────────────────────────────────────────
  CZE1:  'Emblem',            CZE2:  'Matej Kovar',         CZE3:  'Jindrich Stanek',
  CZE4:  'Ladislav Krejci',   CZE5:  'Vladimir Coufal',     CZE6:  'Jaroslav Zeleny',
  CZE7:  'Tomas Holes',       CZE8:  'David Zima',          CZE9:  'Michal Sadilek',
  CZE10: 'Lukas Provod',      CZE11: 'Lukas Cerv',          CZE12: 'Tomas Soucek',
  CZE13: 'Team Photo',        CZE14: 'Pavel Sulc',          CZE15: 'Matej Vydra',
  CZE16: 'Vasil Kusej',       CZE17: 'Tomas Chory',         CZE18: 'Vaclav Cerny',
  CZE19: 'Adam Hlozek',       CZE20: 'Patrik Schick',

  // ── CAN ─────────────────────────────────────────────────────────────────────
  CAN1:  'Emblem',            CAN2:  'Dayne St.Clair',      CAN3:  'Alphonso Davies',
  CAN4:  'Alistair Johnston', CAN5:  'Samuel Adekugbe',     CAN6:  'Riche Larvea',
  CAN7:  'Derek Cornelius',   CAN8:  'Moïse Bombito',       CAN9:  'Kamal Miller',
  CAN10: 'Stephen Eustáquio', CAN11: 'Ismaël Koné',         CAN12: 'Jonathan Osorio',
  CAN13: 'Team Photo',        CAN14: 'Jacob Shaffelburg',   CAN15: 'Mathieu Choinière',
  CAN16: 'Niko Sigur',        CAN17: 'Tajon Buchanan',      CAN18: 'Liam Millar',
  CAN19: 'Cyle Larin',        CAN20: 'Jonathan David',

  // ── BIH ─────────────────────────────────────────────────────────────────────
  BIH1:  'Emblem',            BIH2:  'Nikola Vasilj',        BIH3:  'Amer Dedic',
  BIH4:  'Sead Kolasinac',    BIH5:  'Tarik Muharemovic',    BIH6:  'Nihad Mujakic',
  BIH7:  'Nikola Katic',      BIH8:  'Amir Hadziahmetovic',  BIH9:  'Benjamin Tahirovic',
  BIH10: 'Armin Gigovic',     BIH11: 'Ivan Sunjic',          BIH12: 'Ivan Basic',
  BIH13: 'Team Photo',        BIH14: 'Dzenis Burnic',        BIH15: 'Esmir Bajraktarevic',
  BIH16: 'Amar Memic',        BIH17: 'Ermedin Demirovic',    BIH18: 'Edin Dzeko',
  BIH19: 'Samed Bazdar',      BIH20: 'Haris Tabakovic',

  // ── QAT ─────────────────────────────────────────────────────────────────────
  QAT1:  'Emblem',            QAT2:  'Meshaal Barsham',      QAT3:  'Sultan Albrake',
  QAT4:  'Lucas Mendes',      QAT5:  'Homam Ahmed',          QAT6:  'Boualem Khoukhi',
  QAT7:  'Pedro Miguel',      QAT8:  'Tarek Salman',         QAT9:  'Mohamed Al-Mannai',
  QAT10: 'Karim Boudiaf',     QAT11: 'Assim Madibo',         QAT12: 'Ahmed Fatehi',
  QAT13: 'Team Photo',        QAT14: 'Mohammed Waad',        QAT15: 'Abdulaziz Hatem',
  QAT16: 'Hassan Al-Haydos',  QAT17: 'Edmilson Junior',      QAT18: 'Akram Hassan Afif',
  QAT19: 'Ahmed Al Ganehi',   QAT20: 'Almoez Ali',

  // ── SUI ─────────────────────────────────────────────────────────────────────
  SUI1:  'Emblem',            SUI2:  'Gregor Kobel',          SUI3:  'Yvon Mvogo',
  SUI4:  'Manuel Akanji',     SUI5:  'Ricardo Rodriguez',     SUI6:  'Nico Elvedi',
  SUI7:  'Aurèle Amenda',     SUI8:  'Silvan Widmer',         SUI9:  'Granit Xhaka',
  SUI10: 'Denis Zakaria',     SUI11: 'Remo Freuler',          SUI12: 'Fabian Rieder',
  SUI13: 'Team Photo',        SUI14: 'Ardon Jashari',         SUI15: 'Johan Manzambi',
  SUI16: 'Michel Aebischer',  SUI17: 'Breel Embolo',          SUI18: 'Ruben Vargas',
  SUI19: 'Dan Ndoye',         SUI20: 'Zeki Amdouni',

  // ── BRA ─────────────────────────────────────────────────────────────────────
  BRA1:  'Emblem',            BRA2:  'Alisson',               BRA3:  'Bento',
  BRA4:  'Marquinhos',        BRA5:  'Éder Militão',          BRA6:  'Gabriel Magalhães',
  BRA7:  'Danilo',            BRA8:  'Wesley',                BRA9:  'Lucas Paquetá',
  BRA10: 'Casemiro',          BRA11: 'Bruno Guimarães',       BRA12: 'Luiz Henrique',
  BRA13: 'Team Photo',        BRA14: 'Vinicius Júnior',       BRA15: 'Rodrygo',
  BRA16: 'João Pedro',        BRA17: 'Matheus Cunha',         BRA18: 'Gabriel Martinelli',
  BRA19: 'Raphinha',          BRA20: 'Estévão',

  // ── MAR ─────────────────────────────────────────────────────────────────────
  MAR1:  'Emblem',            MAR2:  'Yassine Bounou',        MAR3:  'Munir El Kajoui',
  MAR4:  'Achraf Hakimi',     MAR5:  'Noussair Mazraoui',     MAR6:  'Nayef Aguerd',
  MAR7:  'Roman Saiss',       MAR8:  'Jawad El Yamio',        MAR9:  'Adam Masina',
  MAR10: 'Sofyan Amrabat',    MAR11: 'Azzedine Ounahi',       MAR12: 'Eliesse Ben Seghir',
  MAR13: 'Team Photo',        MAR14: 'Bilal El Khannouss',    MAR15: 'Ismael Saibari',
  MAR16: 'Youssef En-Nesyri', MAR17: 'Abde Ezzalzouli',      MAR18: 'Soufiane Rahimi',
  MAR19: 'Brahim Diaz',       MAR20: 'Ayoub El Kaabi',

  // ── HAI ─────────────────────────────────────────────────────────────────────
  HAI1:  'Emblem',            HAI2:  'Johny Placide',         HAI3:  'Carlens Arcus',
  HAI4:  'Martin Expérience', HAI5:  'Jean-Kevin Duverne',    HAI6:  'Ricardo Adé',
  HAI7:  'Duke Lacroix',      HAI8:  'Garven Metusala',       HAI9:  'Hannes Delcroix',
  HAI10: 'Leverton Pierre',   HAI11: 'Danley Jean Jacques',   HAI12: 'Jean-Ricner Bellegarde',
  HAI13: 'Team Photo',        HAI14: 'Christopher Attys',     HAI15: 'Derrick Etienne Jr',
  HAI16: 'Josue Casimir',     HAI17: 'Ruben Providence',      HAI18: 'Duckens Nazon',
  HAI19: 'Louicius Deedson',  HAI20: 'Frantzdy Pierrot',

  // ── SCO ─────────────────────────────────────────────────────────────────────
  SCO1:  'Emblem',            SCO2:  'Angus Gunn',            SCO3:  'Jack Hendry',
  SCO4:  'Kieran Tierney',    SCO5:  'Aaron Hickey',          SCO6:  'Andrew Robertson',
  SCO7:  'Scott McKenna',     SCO8:  'John Souttar',          SCO9:  'Anthony Ralston',
  SCO10: 'Grant Hanley',      SCO11: 'Scott McTominay',       SCO12: 'Billy Gilmour',
  SCO13: 'Team Photo',        SCO14: 'Lewis Ferguson',        SCO15: 'Ryan Christie',
  SCO16: 'Kenny McLean',      SCO17: 'John McGinn',           SCO18: 'Lyndon Dykes',
  SCO19: 'Che Adams',         SCO20: 'Ben Gannon-Doak',

  // ── USA ─────────────────────────────────────────────────────────────────────
  USA1:  'Emblem',            USA2:  'Math Freese',            USA3:  'Chris Richards',
  USA4:  'Tim Ream',          USA5:  'Mark McKenzie',          USA6:  'Alex Freeman',
  USA7:  'Antonee Robinson',  USA8:  'Tyler Adams',            USA9:  'Tanner Tessmann',
  USA10: 'Weston McKenny',    USA11: 'Christian Roldan',       USA12: 'Timothy Weah',
  USA13: 'Team Photo',        USA14: 'Diego Luna',             USA15: 'Malik Tillman',
  USA16: 'Christian Pulisic', USA17: 'Brenden Aaronson',       USA18: 'Ricardo Pepi',
  USA19: 'Haji Wright',       USA20: 'Folarin Balogun',

  // ── PAR ─────────────────────────────────────────────────────────────────────
  PAR1:  'Emblem',            PAR2:  'Roberto Fernandez',      PAR3:  'Orlando Gill',
  PAR4:  'Gustavo Gomez',     PAR5:  'Fabián Balbuena',        PAR6:  'Juan José Cáceres',
  PAR7:  'Omar Alderete',     PAR8:  'Junior Alonso',          PAR9:  'Mathías Villasanti',
  PAR10: 'Diego Gomez',       PAR11: 'Damián Bobadilla',       PAR12: 'Andres Cubas',
  PAR13: 'Team Photo',        PAR14: 'Matias Galarza Fonda',   PAR15: 'Julio Enciso',
  PAR16: 'Alejandro Romero Gamarra', PAR17: 'Miguel Almirón',  PAR18: 'Ramon Sosa',
  PAR19: 'Angel Romero',      PAR20: 'Antonio Sanabria',

  // ── AUS ─────────────────────────────────────────────────────────────────────
  AUS1:  'Emblem',            AUS2:  'Mathew Ryan',            AUS3:  'Joe Gauci',
  AUS4:  'Harry Souttar',     AUS5:  'Alessandro Circati',     AUS6:  'Jordan Bos',
  AUS7:  'Aziz Behich',       AUS8:  'Cameron Burgess',        AUS9:  'Lewis Miller',
  AUS10: 'Milos Degenek',     AUS11: 'Jackson Irvine',         AUS12: 'Riley McGree',
  AUS13: 'Team Photo',        AUS14: "Aiden O'Neill",          AUS15: 'Connor Metcalfe',
  AUS16: 'Patrick Yazbek',    AUS17: 'Craig Goodwin',          AUS18: 'Kusini Vengi',
  AUS19: 'Nestory Irankunda', AUS20: 'Mohamed Touré',

  // ── TUR ─────────────────────────────────────────────────────────────────────
  TUR1:  'Emblem',            TUR2:  'Ugurcan Cakir',          TUR3:  'Mert Muldur',
  TUR4:  'Zeki Celik',        TUR5:  'Abdulkerim Bardakci',    TUR6:  'Caglar Soyuncu',
  TUR7:  'Merih Demiral',     TUR8:  'Ferdi Kadioglu',         TUR9:  'Kaan Ayhan',
  TUR10: 'Ismail Yuksek',     TUR11: 'Hakan Calhanoglu',       TUR12: 'Orkun Kokcu',
  TUR13: 'Team Photo',        TUR14: 'Arda Guler',             TUR15: 'Irfan Can Kahveci',
  TUR16: 'Yunus Akgun',       TUR17: 'Can Uzun',               TUR18: 'Baris Alper Yilmaz',
  TUR19: 'Kerem Akturkoglu',  TUR20: 'Kenan Yildiz',

  // ── GER ─────────────────────────────────────────────────────────────────────
  GER1:  'Emblem',            GER2:  'Marc-André ter Stegen',  GER3:  'Jonathan Tah',
  GER4:  'David Raum',        GER5:  'Nico Schlotterbeck',     GER6:  'Antonio Rüdiger',
  GER7:  'Waldemar Anton',    GER8:  'Ridle Baku',             GER9:  'Maximilian Mittelstadt',
  GER10: 'Joshua Kimmich',    GER11: 'Florian Wirtz',          GER12: 'Felix Nmecha',
  GER13: 'Team Photo',        GER14: 'Leon Goretzka',          GER15: 'Jamal Musiala',
  GER16: 'Serge Gnabry',      GER17: 'Kai Havertz',            GER18: 'Leroy Sane',
  GER19: 'Karim Adeyemi',     GER20: 'Nick Woltemade',

  // ── CUW ─────────────────────────────────────────────────────────────────────
  CUW1:  'Emblem',            CUW2:  'Eloy Room',              CUW3:  'Armando Obispo',
  CUW4:  'Sherel Floranus',   CUW5:  'Jurien Gaari',           CUW6:  'Joshua Brenet',
  CUW7:  'Roshon Van Eijma',  CUW8:  'Shurandy Sambo',         CUW9:  'Livano Comenencia',
  CUW10: 'Godfried Roemeratoe', CUW11: 'Juninho Bacuna',       CUW12: 'Leandro Bacuna',
  CUW13: 'Team Photo',        CUW14: 'Tahith Chong',           CUW15: 'Kenji Gorre',
  CUW16: 'Jearl Margaritha',  CUW17: 'Jurgen Locadia',         CUW18: 'Jeremy Antonisse',
  CUW19: 'Gervane Kastaneer', CUW20: 'Sontje Hansen',

  // ── CIV ─────────────────────────────────────────────────────────────────────
  CIV1:  'Emblem',            CIV2:  'Yahia Fofana',           CIV3:  'Ghislain Konan',
  CIV4:  'Wilfried Singo',    CIV5:  'Odilon Kossounou',       CIV6:  'Evan Ndicka',
  CIV7:  'Willy Boly',        CIV8:  'Emmanuel Agbadou',       CIV9:  'Ousmane Diomande',
  CIV10: 'Franck Kessie',     CIV11: 'Seko Fofana',            CIV12: 'Ibrahim Sangare',
  CIV13: 'Team Photo',        CIV14: 'Jean-Philippe Gbamin',   CIV15: 'Amad Diallo',
  CIV16: 'Sébastien Haller',  CIV17: 'Simon Adingra',          CIV18: 'Yan Diomande',
  CIV19: 'Evann Guessand',    CIV20: 'Oumar Diakite',

  // ── ECU ─────────────────────────────────────────────────────────────────────
  ECU1:  'Emblem',            ECU2:  'Hernán Galíndez',        ECU3:  'Gonzalo Valle',
  ECU4:  'Piero Hincapié',    ECU5:  'Pervis Estupiñán',       ECU6:  'Willian Pacho',
  ECU7:  'Ángelo Preciado',   ECU8:  'Joel Ordóñez',           ECU9:  'Moises Caicedo',
  ECU10: 'Alan Franco',       ECU11: 'Kendry Paez',            ECU12: 'Pedro Vite',
  ECU13: 'Team Photo',        ECU14: 'John Veboah',            ECU15: 'Leonardo Campana',
  ECU16: 'Gonzalo Plata',     ECU17: 'Nilson Angulo',          ECU18: 'Alan Minda',
  ECU19: 'Kevin Rodriguez',   ECU20: 'Enner Valencia',

  // ── NED ─────────────────────────────────────────────────────────────────────
  NED1:  'Emblem',            NED2:  'Bart Verbruggen',        NED3:  'Virgil van Dijk',
  NED4:  'Micky van de Ven',  NED5:  'Jurrien Timber',         NED6:  'Denzel Dumfries',
  NED7:  'Nathan Aké',        NED8:  'Jeremie Frimpong',       NED9:  'Jan Paul van Hecke',
  NED10: 'Tijjani Reijnders', NED11: 'Ryan Gravenberch',       NED12: 'Teun Koopmeiners',
  NED13: 'Team Photo',        NED14: 'Frenkie de Jong',        NED15: 'Xavi Simons',
  NED16: 'Justin Kluivert',   NED17: 'Memphis Depay',          NED18: 'Donyell Malen',
  NED19: 'Wout Weghorst',     NED20: 'Cody Gakpo',

  // ── JPN ─────────────────────────────────────────────────────────────────────
  JPN1:  'Emblem',            JPN2:  'Zion Suzuki',             JPN3:  'Henry Heroki Mochizuki',
  JPN4:  'Ayumu Seko',        JPN5:  'Junnosuke Suzuki',        JPN6:  'Shogo Taniguchi',
  JPN7:  'Tsuyoshi Watanabe', JPN8:  'Kaishu Sano',             JPN9:  'Yuki Soma',
  JPN10: 'Ao Tanaka',         JPN11: 'Daichi Kamada',           JPN12: 'Takefusa Kubo',
  JPN13: 'Team Photo',        JPN14: 'Ritsu Doan',              JPN15: 'Keito Nakamura',
  JPN16: 'Takumi Minamino',   JPN17: 'Shuto Machino',           JPN18: 'Junya Ito',
  JPN19: 'Koki Ogawa',        JPN20: 'Ayase Ueda',

  // ── SWE ─────────────────────────────────────────────────────────────────────
  SWE1:  'Emblem',            SWE2:  'Victor Johansson',        SWE3:  'Isak Hien',
  SWE4:  'Gabriel Gudmundsson', SWE5: 'Emil Holm',              SWE6:  'Victor Nilsson Lindelöf',
  SWE7:  'Gustaf Lagerbielke', SWE8:  'Lucas Bergvall',         SWE9:  'Hugo Larsson',
  SWE10: 'Jesper Karlström',  SWE11: 'Yasin Ayari',             SWE12: 'Mattias Svanberg',
  SWE13: 'Team Photo',        SWE14: 'Daniel Svensson',         SWE15: 'Ken Sema',
  SWE16: 'Roony Bardghji',    SWE17: 'Dejan Kulusevski',        SWE18: 'Anthony Elanga',
  SWE19: 'Alexander Isak',    SWE20: 'Viktor Gyökeres',

  // ── TUN ─────────────────────────────────────────────────────────────────────
  TUN1:  'Emblem',            TUN2:  'Bechir Ben Said',         TUN3:  'Aymen Dahmen',
  TUN4:  'Yan Valery',        TUN5:  'Montassar Talbi',         TUN6:  'Yassine Meriah',
  TUN7:  'Ali Abdi',          TUN8:  'Dylan Bronn',             TUN9:  'Ellyes Skhiri',
  TUN10: 'Aissa Laidouni',    TUN11: 'Ferjani Sassi',           TUN12: 'Mohamed Ali Ben Romdhane',
  TUN13: 'Team Photo',        TUN14: 'Hannibal Mejbri',         TUN15: 'Elias Achouri',
  TUN16: 'Elias Saad',        TUN17: 'Hazem Mastouri',          TUN18: 'Ismael Gharbi',
  TUN19: 'Sayfallah Ltaief',  TUN20: 'Naim Sliti',

  // ── BEL ─────────────────────────────────────────────────────────────────────
  BEL1:  'Emblem',            BEL2:  'Thibaut Courtois',        BEL3:  'Arthur Theate',
  BEL4:  'Timothy Castagne',  BEL5:  'Zeno Debast',             BEL6:  'Brandon Mechele',
  BEL7:  'Maxim De Cuyper',   BEL8:  'Thomas Meunier',          BEL9:  'Youri Tielemans',
  BEL10: 'Amadou Onana',      BEL11: 'Nicolas Raskin',          BEL12: 'Alexis Saelemaekers',
  BEL13: 'Team Photo',        BEL14: 'Hans Vanaken',            BEL15: 'Kevin De Bruyne',
  BEL16: 'Jérémy Doku',       BEL17: 'Charles De Ketelaere',    BEL18: 'Leandro Trossard',
  BEL19: 'Loïs Openda',       BEL20: 'Romelu Lukaku',

  // ── EGY ─────────────────────────────────────────────────────────────────────
  EGY1:  'Emblem',            EGY2:  'Mohamed El Shenawy',      EGY3:  'Mohamed Hany',
  EGY4:  'Mohamed Hamdy',     EGY5:  'Yasser Ibrahim',          EGY6:  'Khaled Sobhi',
  EGY7:  'Ramy Rabia',        EGY8:  'Hossam Abdelmaguid',      EGY9:  'Ahmed Fatouh',
  EGY10: 'Marwan Attia',      EGY11: 'Zizo',                    EGY12: 'Hamdy Fathy',
  EGY13: 'Team Photo',        EGY14: 'Mohamed Lasheen',         EGY15: 'Emam Ashour',
  EGY16: 'Osama Faisal',      EGY17: 'Mohamed Salah',           EGY18: 'Mostafa Mohamed',
  EGY19: 'Trezeguet',         EGY20: 'Omar Marmoush',

  // ── IRN ─────────────────────────────────────────────────────────────────────
  IRN1:  'Emblem',            IRN2:  'Alireza Beiranvand',      IRN3:  'Morteza Pouraliganji',
  IRN4:  'Ehsan Hajsafi',     IRN5:  'Milad Mohammadi',         IRN6:  'Shojae Khalilzadeh',
  IRN7:  'Ramin Rezaeian',    IRN8:  'Hossein Kanaani',         IRN9:  'Sadegh Moharrami',
  IRN10: 'Saleh Hardani',     IRN11: 'Saeed Ezatolahi',         IRN12: 'Saman Ghoddos',
  IRN13: 'Team Photo',        IRN14: 'Omid Noorafkan',          IRN15: 'Roozbeh Cheshmi',
  IRN16: 'Mohammad Mohebi',   IRN17: 'Sardar Azmoun',           IRN18: 'Mehdi Taremi',
  IRN19: 'Alireza Jahanbakhsh', IRN20: 'Ali Gholizadeh',

  // ── NZL ─────────────────────────────────────────────────────────────────────
  NZL1:  'Emblem',            NZL2:  'Max Crocombe Payne',      NZL3:  'Alex Paulsen',
  NZL4:  'Michael Boxall',    NZL5:  'Liberato Cacace',         NZL6:  'Tim Payne',
  NZL7:  'Tyler Bindon',      NZL8:  'Francis de Vries',        NZL9:  'Finn Surman',
  NZL10: 'Joe Bell',          NZL11: 'Sarpreet Singh',          NZL12: 'Ryan Thomas',
  NZL13: 'Team Photo',        NZL14: 'Matthew Garbett',         NZL15: 'Marko Stamenić',
  NZL16: 'Ben Old',           NZL17: 'Chris Wood',              NZL18: 'Elijah Just',
  NZL19: 'Callum McCowatt',   NZL20: 'Kosta Barbarouses',

  // ── ESP ─────────────────────────────────────────────────────────────────────
  ESP1:  'Emblem',            ESP2:  'Unai Simon',              ESP3:  'Robin Le Normand',
  ESP4:  'Aymeric Laporte',   ESP5:  'Dean Huijsen',            ESP6:  'Pedro Porro',
  ESP7:  'Dani Carvajal',     ESP8:  'Marc Cucurella',          ESP9:  'Martín Zubimendi',
  ESP10: 'Rodri',             ESP11: 'Pedri',                   ESP12: 'Fabian Ruiz',
  ESP13: 'Team Photo',        ESP14: 'Mikel Merino',            ESP15: 'Lamine Yamal',
  ESP16: 'Dani Olmo',         ESP17: 'Nico Williams',           ESP18: 'Ferran Torres',
  ESP19: 'Álvaro Morata',     ESP20: 'Mikel Oyarzabal',

  // ── CPV ─────────────────────────────────────────────────────────────────────
  CPV1:  'Emblem',            CPV2:  'Vozinha',                 CPV3:  'Logan Costa',
  CPV4:  'Pico',              CPV5:  'Diney',                   CPV6:  'Steven Moreira',
  CPV7:  'Wagner Pina',       CPV8:  'Joao Paulo',              CPV9:  'Yannick Semedo',
  CPV10: 'Kevin Pina',        CPV11: 'Patrick Andrade',         CPV12: 'Jamiro Monteiro',
  CPV13: 'Team Photo',        CPV14: 'Deroy Duarte',            CPV15: 'Garry Rodrigues',
  CPV16: 'Jovane Cabral',     CPV17: 'Ryan Mendes',             CPV18: 'Dailon Livramento',
  CPV19: 'Willy Semedo',      CPV20: 'Bebe',

  // ── KSA ─────────────────────────────────────────────────────────────────────
  KSA1:  'Emblem',            KSA2:  'Nawaf Alaqidi',           KSA3:  'Abdulrahman Al-Sanbi',
  KSA4:  'Saud Abdulhamid',   KSA5:  'Nawaf Bouwashl',          KSA6:  'Jihad Thakri',
  KSA7:  'Moteb Al-Harbi',    KSA8:  'Hassan Altambakti',       KSA9:  'Musab Aljuwayr',
  KSA10: 'Ziyad Aljohani',    KSA11: 'Abdullah Alkhaibari',     KSA12: 'Nasser Aldawsari',
  KSA13: 'Team Photo',        KSA14: 'Saleh Abu Alshamat',      KSA15: 'Marwan Alsahafi',
  KSA16: 'Salem Aldawsari',   KSA17: 'Abdulrahman Al-Aboud',    KSA18: 'Feras Akbrikan',
  KSA19: 'Saleh Alshehri',    KSA20: 'Abdullah Al-Hamdan',

  // ── URU ─────────────────────────────────────────────────────────────────────
  URU1:  'Emblem',            URU2:  'Sergio Rochet',           URU3:  'Santiago Mele',
  URU4:  'Ronald Araujo',     URU5:  'José María Giménez',      URU6:  'Sebastian Caceres',
  URU7:  'Mathias Olivera',   URU8:  'Guillermo Varela',        URU9:  'Nahitan Nandez',
  URU10: 'Federico Valverde', URU11: 'Giorgian De Arrascaeta',  URU12: 'Rodrigo Bentancur',
  URU13: 'Team Photo',        URU14: 'Manuel Ugarte',           URU15: 'Nicolás de la Cruz',
  URU16: 'Maxi Araujo',       URU17: 'Darwin Núñez',            URU18: 'Federico Viñas',
  URU19: 'Rodrigo Aguirre',   URU20: 'Facundo Pellistri',

  // ── FRA ─────────────────────────────────────────────────────────────────────
  FRA1:  'Emblem',            FRA2:  'Mike Maignan',            FRA3:  'Theo Hernandez',
  FRA4:  'William Saliba',    FRA5:  'Jules Kounde',            FRA6:  'Ibrahima Konate',
  FRA7:  'Dayot Upamecano',   FRA8:  'Lucas Digne',             FRA9:  'Aurélien Tchouaméni',
  FRA10: 'Eduardo Camavinga', FRA11: 'Manu Kone',               FRA12: 'Adrien Rabiot',
  FRA13: 'Team Photo',        FRA14: 'Michael Olise',           FRA15: 'Ousmane Dembele',
  FRA16: 'Bradley Barcola',   FRA17: 'Désiré Doué',             FRA18: 'Kingsley Coman',
  FRA19: 'Hugo Ekitike',      FRA20: 'Kylian Mbappe',

  // ── SEN ─────────────────────────────────────────────────────────────────────
  SEN1:  'Emblem',            SEN2:  'Edouard Mendy',           SEN3:  'Yehvann Diouf',
  SEN4:  'Moussa Niakhaté',   SEN5:  'Abdoulaye Seck',          SEN6:  'Ismail Jakobs',
  SEN7:  'El Hadji Malick Diouf', SEN8: 'Kalidou Koulibaly',   SEN9:  'Idrissa Gana Gueye',
  SEN10: 'Pape Matar Sarr',   SEN11: 'Pape Gueye',              SEN12: 'Habib Diarra',
  SEN13: 'Team Photo',        SEN14: 'Lamine Camara',           SEN15: 'Sadio Mane',
  SEN16: 'Ismaïla Sarr',      SEN17: 'Boulaye Dia',             SEN18: 'Iliman Ndiaye',
  SEN19: 'Nicolas Jackson',   SEN20: 'Krepin Diatta',

  // ── IRQ ─────────────────────────────────────────────────────────────────────
  IRQ1:  'Emblem',            IRQ2:  'Jalal Hassan',            IRQ3:  'Rebin Sulaka',
  IRQ4:  'Hussein Ali',       IRQ5:  'Akam Hashem',             IRQ6:  'Merchas Doski',
  IRQ7:  'Zaid Tahseen',      IRQ8:  'Manaf Younis',            IRQ9:  'Zidane Iqbal',
  IRQ10: 'Amir Al-Ammari',    IRQ11: 'Ibrahim Bavesh',          IRQ12: 'Ali Jasim',
  IRQ13: 'Team Photo',        IRQ14: 'Youssef Amyn',            IRQ15: 'Aimar Sher',
  IRQ16: 'Marko Farji',       IRQ17: 'Osama Rashid',            IRQ18: 'Ali Al-Hamadi',
  IRQ19: 'Aymen Hussein',     IRQ20: 'Mohanad Ali',

  // ── NOR ─────────────────────────────────────────────────────────────────────
  NOR1:  'Emblem',            NOR2:  'Orjan Nyland',             NOR3:  'Julian Ryerson',
  NOR4:  'Leo Ostigård',      NOR5:  'Kristoffer Vassbakk Ajer', NOR6:  'Marcus Holmgren Pedersen',
  NOR7:  'David Møller Wolfe',NOR8:  'Torbjørn Heggem',          NOR9:  'Morten Thorsby',
  NOR10: 'Martin Ødegaard',   NOR11: 'Sander Berge',             NOR12: 'Andreas Schjelderup',
  NOR13: 'Team Photo',        NOR14: 'Patrick Berg',             NOR15: 'Erling Haaland',
  NOR16: 'Alexander Sørloth', NOR17: 'Aron Dønnum',              NOR18: 'Jorgen Strand Larsen',
  NOR19: 'Antonio Nusa',      NOR20: 'Oscar Bobb',

  // ── ARG ─────────────────────────────────────────────────────────────────────
  ARG1:  'Emblem',            ARG2:  'Emiliano Martinez',       ARG3:  'Nahuel Molina',
  ARG4:  'Cristian Romero',   ARG5:  'Nicolas Otamendi',        ARG6:  'Nicolas Tagliafico',
  ARG7:  'Leonardo Balerdi',  ARG8:  'Enzo Fernandez',          ARG9:  'Alexis Mac Allister',
  ARG10: 'Rodrigo De Paul',   ARG11: 'Exequiel Palacios',       ARG12: 'Leandro Paredes',
  ARG13: 'Team Photo',        ARG14: 'Nico Paz',                ARG15: 'Franco Mastantuono',
  ARG16: 'Nico Gonzalez',     ARG17: 'Lionel Messi',            ARG18: 'Lautaro Martinez',
  ARG19: 'Julian Alvarez',    ARG20: 'Giuliano Simeone',

  // ── ALG ─────────────────────────────────────────────────────────────────────
  ALG1:  'Emblem',            ALG2:  'Alexis Guendouz',         ALG3:  'Ramy Bensebaini',
  ALG4:  'Youcef Atal',       ALG5:  "Rayan Aït-Nouri",         ALG6:  'Mohamed Amine Tougai',
  ALG7:  'Aïssa Mandi',       ALG8:  'Ismael Bennacer',         ALG9:  'Houssem Aquar',
  ALG10: 'Hicham Boudaoui',   ALG11: 'Ramiz Zerrouki',          ALG12: 'Nabil Bentalab',
  ALG13: 'Team Photo',        ALG14: 'Farés Chaibi',            ALG15: 'Riyad Mahrez',
  ALG16: 'Said Benrahma',     ALG17: 'Anis Hadj Moussa',        ALG18: 'Amine Gouiri',
  ALG19: 'Baghdad Bounedjah', ALG20: 'Mohammed Amoura',

  // ── AUT ─────────────────────────────────────────────────────────────────────
  AUT1:  'Emblem',            AUT2:  'Alexander Schlager',      AUT3:  'Patrick Pentz',
  AUT4:  'David Alaba',       AUT5:  'Kevin Danso',             AUT6:  'Philipp Lienhart',
  AUT7:  'Stefan Posch',      AUT8:  'Phillipp Mwene',          AUT9:  'Alexander Prass',
  AUT10: 'Xaver Schlager',    AUT11: 'Marcel Sabitzer',         AUT12: 'Konrad Laimer',
  AUT13: 'Team Photo',        AUT14: 'Florian Grillitsch',      AUT15: 'Nicolas Seiwald',
  AUT16: 'Romano Schmid',     AUT17: 'Patrick Wimmer',          AUT18: 'Christoph Baumgartner',
  AUT19: 'Michael Gregoritsch', AUT20: 'Marko Arnautović',

  // ── JOR ─────────────────────────────────────────────────────────────────────
  JOR1:  'Emblem',            JOR2:  'Yazeed Abulaila',         JOR3:  'Ihsan Haddad',
  JOR4:  'Mohammad Abu Hashish', JOR5: 'Yazan Al-Arab',         JOR6:  'Abdallah Nasib',
  JOR7:  'Saleem Obaid',      JOR8:  'Mohammad Abualnadi',      JOR9:  'Ibrahim Saadeh',
  JOR10: 'Nizar Al-Rashdan',  JOR11: 'Noor Al-Rawabdeh',        JOR12: 'Mohannad Abu Taha',
  JOR13: 'Team Photo',        JOR14: 'Amer Jamous',             JOR15: 'Musa Al-Taamari',
  JOR16: 'Yazan Al-Naimat',   JOR17: 'Mahmoud Al-Mardi',        JOR18: 'Ali Olwan',
  JOR19: 'Mohammad Abu Zrayq', JOR20: 'Ibrahim Sabra',

  // ── POR ─────────────────────────────────────────────────────────────────────
  POR1:  'Emblem',            POR2:  'Diogo Costa',             POR3:  'Jose Sa',
  POR4:  'Ruben Dias',        POR5:  'João Cancelo',            POR6:  'Diogo Dalot',
  POR7:  'Nuno Mendes',       POR8:  'Gonçalo Inácio',          POR9:  'Bernardo Silva',
  POR10: 'Bruno Fernandes',   POR11: 'Ruben Neves',             POR12: 'Vitinha',
  POR13: 'Team Photo',        POR14: 'João Neves',              POR15: 'Cristiano Ronaldo',
  POR16: 'Francisco Trincao', POR17: 'João Felix',              POR18: 'Gonçalo Ramos',
  POR19: 'Pedro Neto',        POR20: 'Rafael Leão',

  // ── COD ─────────────────────────────────────────────────────────────────────
  COD1:  'Emblem',            COD2:  'Lionel Mpasi',            COD3:  'Aaron Wan-Bissaka',
  COD4:  'Axel Tuanzebe',     COD5:  'Arthur Masuaku',          COD6:  'Chancel Mbemba',
  COD7:  'Joris Kayembe',     COD8:  'Charles Pickel',          COD9:  "Ngal'ayel Mukau",
  COD10: 'Edo Kayembe',       COD11: 'Samuel Moutoussamy',      COD12: 'Noah Sadiki',
  COD13: 'Team Photo',        COD14: 'Théo Bongonda',           COD15: 'Meschak Elia',
  COD16: 'Yoane Wissa',       COD17: 'Brian Cipenga',           COD18: 'Fiston Mayele',
  COD19: 'Cédric Bakambu',    COD20: 'Nathanaël Mbuku',

  // ── UZB ─────────────────────────────────────────────────────────────────────
  UZB1:  'Emblem',            UZB2:  'Utkir Yusupov',           UZB3:  'Farrukh Savfiev',
  UZB4:  'Sherzod Nasrullaev', UZB5: 'Umar Eshmurodov',         UZB6:  'Husniddin Aliqulov',
  UZB7:  'Rustamjon Ashurmatov', UZB8: 'Khojiakbar Alijonov',   UZB9:  'Abdukodir Khusanov',
  UZB10: 'Odiljon Hamrobekov', UZB11: 'Otabek Shukurov',        UZB12: 'Jamshid Iskanderov',
  UZB13: 'Team Photo',        UZB14: 'Azizbek Turgunboev',      UZB15: 'Khojimat Erkinov',
  UZB16: 'Eldor Shomurodov',  UZB17: 'Oston Urunov',            UZB18: 'Jaloliddin Masharipov',
  UZB19: 'Igor Sergeev',      UZB20: 'Abbosbek Fayzullaev',

  // ── COL ─────────────────────────────────────────────────────────────────────
  COL1:  'Emblem',            COL2:  'Camilo Vargas',           COL3:  'David Ospina',
  COL4:  'Dávinson Sánchez',  COL5:  'Yerry Mina',              COL6:  'Daniel Munoz',
  COL7:  'Johan Mojica',      COL8:  'Jhon Lucumí',             COL9:  'Santiago Arias',
  COL10: 'Jefferson Lerma',   COL11: 'Kevin Castaño',           COL12: 'Richard Rios',
  COL13: 'Team Photo',        COL14: 'James Rodriguez',         COL15: 'Juan Fernando Quintero',
  COL16: 'Jorge Carrascal',   COL17: 'Jon Arias',               COL18: 'Jhon Cordova',
  COL19: 'Luis Suarez',       COL20: 'Luis Diaz',

  // ── ENG ─────────────────────────────────────────────────────────────────────
  ENG1:  'Emblem',            ENG2:  'Jordan Pickford',         ENG3:  'John Stones',
  ENG4:  'Marc Guéhi',        ENG5:  'Ezri Konsa',              ENG6:  'Trent Alexander-Arnold',
  ENG7:  'Reece James',       ENG8:  'Dan Burn',                ENG9:  'Jordan Henderson',
  ENG10: 'Declan Rice',       ENG11: 'Jude Bellingham',         ENG12: 'Cole Palmer',
  ENG13: 'Team Photo',        ENG14: 'Morgan Rogers',           ENG15: 'Anthony Gordon',
  ENG16: 'Phil Foden',        ENG17: 'Bukayo Saka',             ENG18: 'Harry Kane',
  ENG19: 'Marcus Rashford',   ENG20: 'Ollie Watkins',

  // ── CRO ─────────────────────────────────────────────────────────────────────
  CRO1:  'Emblem',            CRO2:  'Dominik Livaković',       CRO3:  'Duje Caleta-Car',
  CRO4:  'Josko Gvardiol',    CRO5:  'Josip Stanišić',          CRO6:  'Luka Vušković',
  CRO7:  'Josip Sutalo',      CRO8:  'Kristijan Jakic',         CRO9:  'Luka Modrić',
  CRO10: 'Mateo Kovacic',     CRO11: 'Martin Baturina',         CRO12: 'Lovro Majer',
  CRO13: 'Team Photo',        CRO14: 'Mario Pasalic',           CRO15: 'Petar Sucic',
  CRO16: 'Ivan Perišić',      CRO17: 'Marco Pasalic',           CRO18: 'Ante Budimir',
  CRO19: 'Andrej Kramarić',   CRO20: 'Franjo Ivanovic',

  // ── GHA ─────────────────────────────────────────────────────────────────────
  GHA1:  'Emblem',            GHA2:  'Lawrence Ati Zigi',       GHA3:  'Tariq Lamptey',
  GHA4:  'Mohammed Salisu',   GHA5:  'Alidu Seidu',             GHA6:  'Alexander Djiku',
  GHA7:  'Gideon Mensah',     GHA8:  'Caleb Yirenkyi',          GHA9:  'Abdul Issahaku Fatawu',
  GHA10: 'Thomas Partey',     GHA11: 'Salis Abdul Samed',       GHA12: 'Kamaldeen Sulemana',
  GHA13: 'Team Photo',        GHA14: 'Mohammed Kudus',          GHA15: 'Inaki Williams',
  GHA16: 'Jordan Ayew',       GHA17: 'Andrew Ayew',             GHA18: 'Joseph Paintsil',
  GHA19: 'Osman Bukari',      GHA20: 'Antoine Semenyo',

  // ── PAN ─────────────────────────────────────────────────────────────────────
  PAN1:  'Emblem',            PAN2:  'Orlando Mosquera',        PAN3:  'Luis Mejia',
  PAN4:  'Fidel Escobar',     PAN5:  'Andres Andrade',          PAN6:  'Michael Amir Murillo',
  PAN7:  'Eric Davis',        PAN8:  'Jose Cordoba',            PAN9:  'Cesar Blackman',
  PAN10: 'Cristian Martinez', PAN11: 'Aníbal Godoy',            PAN12: 'Adalberto Carrasquilla',
  PAN13: 'Team Photo',        PAN14: 'Édgar Bárcenas',          PAN15: 'Carlos Harvey',
  PAN16: 'Ismael Díaz',       PAN17: 'Jose Fajardo',            PAN18: 'Cecilio Waterman',
  PAN19: 'Jose Luiz Rodriguez', PAN20: 'Alberto Quintero',

  // ── FWC block 2 (9–19): World Cup history ────────────────────────────────────
  FWC9:  'Italy 1934',        FWC10: 'Uruguay 1950',            FWC11: 'West Germany 1954',
  FWC12: 'Brazil 1962',       FWC13: 'West Germany 1974',       FWC14: 'Argentina 1986',
  FWC15: 'Brazil 1994',       FWC16: 'Brazil 2002',             FWC17: 'Italy 2006',
  FWC18: 'Germany 2014',      FWC19: 'Argentina 2022',

  // ── CC (Coca-Cola Collectors, CC1–CC14) ──────────────────────────────────────
  CC1:  'Lamine Yamal',       CC2:  'Joshua Kimmich',           CC3:  'Harry Kane',
  CC4:  'Santiago Giménez',   CC5:  'Josko Gvardiol',           CC6:  'Federico Valverde',
  CC7:  'Jefferson Lerma',    CC8:  'Enner Valencia',           CC9:  'Gabriel Magalhães',
  CC10: 'Virgil van Dijk',    CC11: 'Alphonso Davies',          CC12: 'Emiliano Martinez',
  CC13: 'Raúl Jiménez',       CC14: 'Lautaro Martínez',
}
