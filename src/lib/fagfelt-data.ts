export interface FagfeltEntry {
  slug: string;
  title: string;
  shortTitle: string;
  intro: string;
  sections: {
    heading: string;
    body: string;
  }[];
  ainas_note: string;
}

export const FAGFELT: Record<string, FagfeltEntry> = {

  "ketaminbehandling": {
    slug: "ketaminbehandling",
    title: "Ketaminbehandling",
    shortTitle: "Ketaminbehandling",
    intro: "Ketamin er ikke et nytt funn — det har vært i klinisk bruk siden 1960-tallet som bedøvelsesmiddel. Det som er nytt, er forståelsen av hva det gjør med hjernen ved lave doser: det kan gjenoppbygge synaptiske forbindelser som stress og depresjon har brutt ned. For pasienter som ikke responderer på vanlige antidepressiva, har det vist seg å virke der ingenting annet har gjort det.",
    sections: [
      {
        heading: "Hvordan det virker",
        body: "Ketamin blokkerer NMDA-reseptorer i hjernen og utløser en kaskade av glutamaterg signalering som stimulerer produksjonen av BDNF — et protein som fremmer vekst av nye synapser i prefrontal cortex. Der vanlige antidepressiva virker på serotonin eller noradrenalin og trenger 4–6 uker på å gi effekt, kan ketamin gi merkbar bedring innen timer. Det er ikke magi. Det er nevrobiologi vi nå forstår bedre enn vi gjorde for ti år siden."
      },
      {
        heading: "Hvem det hjelper",
        body: "Sterkest dokumentasjon er for behandlingsresistent depresjon — pasienter som har prøvd to eller flere antidepressiva uten tilstrekkelig effekt. Studier viser responsrater på 50–70 %. Esketamin (S-ketamin, Spravato), en nesespray som er godkjent i USA og Europa, er det første genuint nye antidepressive virkestoffet på mange tiår.\n\nKetamin brukes også ved kronisk smerte der andre behandlinger ikke strekker til — særlig komplekst regionalt smertesyndrom (CRPS) og nevropatisk smerte. Det angriper den sentrale sensitiveringen som holder smerten i live selv etter at den opprinnelige skaden er leget."
      },
      {
        heading: "Det vi ikke vet",
        body: "Effekten av en enkelt behandling varer typisk 2–4 uker. Langtidsprotokollene er ikke standardiserte, og vi vet ikke nok om optimal dosering og vedlikeholdsbehandling over tid. Ketamin er et narkotikum med misbrukspotensiale. Det er derfor avgjørende at behandlingen skjer i et klinisk og medisinsk rammeverk — ikke som selvmedisinering. Riktig seleksjon av pasienter, trygt miljø og god oppfølging etterpå påvirker resultatet betydelig."
      }
    ],
    ainas_note: "Jeg har sett pasienter som har levd i mørke i årevis, og som etter ketaminbehandling forteller om noe som ligner gjenklangen av seg selv. Det er ikke en kur. Men for noen er det et vindu — og av og til er et vindu nok."
  },

  "cannabismedisin": {
    slug: "cannabismedisin",
    title: "Cannabismedisin",
    shortTitle: "Cannabismedisin",
    intro: "Cannabis har vært i medisinsk bruk i over 5000 år. Det er ikke alternativmedisin — det er en plante vi mistet av syne i nesten hundre år fordi politikk og jus fikk forrang over farmakologi. Det endocannabinoide systemet er ett av kroppens mest utbredte signalsystemer, og vi forstår det stadig bedre.",
    sections: [
      {
        heading: "Det endocannabinoide systemet",
        body: "CB1-reseptorer finnes primært i sentralnervesystemet og regulerer smerte, humør, appetitt og søvn. CB2-reseptorer er i immunsystemet og perifert vev og regulerer inflammasjon. Kroppen produserer egne cannabinoider — anandamid og 2-AG — som binder til disse reseptorene. THC og CBD fra cannabisplanten virker på det samme systemet, men med langt mindre presisjon enn kroppens egne stoffer. Det forklarer både effektene og bivirkningene."
      },
      {
        heading: "Hva forskningen faktisk viser",
        body: "Sterkest evidens er for tre indikasjoner: kvalme og oppkast etter kjemoterapi (Grad 1-evidens), spastisitet ved multippel sklerose (nabiximols/Sativex er godkjent i Norge og Europa), og behandlingsresistent epilepsi hos barn (CBD/Epidiolex, Grad 1-evidens).\n\nModerat evidens finnes for nevropatisk smerte, kreftsmerter og søvnforstyrrelser ved kronisk smerte. For angst, PTSD og andre psykiske lidelser er evidensen mer blandet — noe tyder på effekt ved lave doser CBD, men høye doser THC kan forverre angst og øke risiko for psykose, særlig hos sårbare individer."
      },
      {
        heading: "I Norge",
        body: "Medisinsk cannabis ble legalisert i Norge i 2016 gjennom unntaksordningen til Legemiddelverket. Preparater med THC krever individuell søknad og spesialistinvolvering. Ordningen er streng — og tilgangen er fortsatt begrenset sammenliknet med andre skandinaviske land.\n\nViktige forbehold: legemiddelinteraksjoner via CYP-enzymer (antikoagulantia, antiepileptika) er klinisk relevante og krever kompetent oppfølging. Dosering er dårlig standardisert. Vi trenger langt mer forskning — særlig langtidsstudier."
      }
    ],
    ainas_note: "Vi har kalt det ulovlig i hundre år, og likevel har pasienter funnet veien til det. Mitt ansvar som lege er å forstå systemet det virker gjennom — og bruke det der det faktisk hjelper, ikke der vi håper det gjør det."
  },

  "funksjonell-medisin": {
    slug: "funksjonell-medisin",
    title: "Funksjonell medisin",
    shortTitle: "Funksjonell medisin",
    intro: "Vestlig medisin er glimrende på det akutte og det målbare. Den er nesten blind for det kroniske og komplekse. Funksjonell medisin er ikke et alternativ til skolemedisin — det er en utvidelse av den, inn i terrenget den helst ikke beveger seg.",
    sections: [
      {
        heading: "Hva det handler om",
        body: "Funksjonell medisin stiller spørsmålet: hva er oppstrørsårsaken til dette? I stedet for å behandle symptomer isolert, ser den på samspillet mellom tarmhelse, immunsystem, hormonakser, mitokondriefunksjon og avgiftning — og leter etter det som forstyrrer balansen.\n\nKlinisk innebærer det en grundig gjennomgang av pasientens livshistorie, kosthold, søvn, stressnivå og miljøeksponering. Og ofte avansert laboratorieanalyse som standard blodprøver ikke fanger opp."
      },
      {
        heading: "Hvem trenger det",
        body: "Pasienter med komplekse, flerorgansymptomer — fibromyalgi, kronisk tretthet, irritabel tarm, autoimmune tilstander, metabolsk syndrom — som har gått gjennom det konvensjonelle systemet og fått normal prøver tilbake, men likevel er påfallende syke.\n\nEn studie publisert i JAMA Internal Medicine (Beidelschies et al., 2019) fant at pasienter som mottok funksjonsmedisinsk behandling rapporterte signifikant bedre helse enn kontrollgruppen over tid. Det er ikke et RCT. Men det er heller ikke ingenting."
      },
      {
        heading: "Hva det ikke er",
        body: "Funksjonell medisin er et spekter — fra seriøs integrativ medisin til ren pseudovitenskap. Ikke all testing er klinisk validert. Ikke alle kosttilskudd har effekt. Og feltet mangler standardisering.\n\nMitt standpunkt: de enkeltintervensjoner som er best dokumentert — kostendring, trening, stressreduksjon, målrettet supplementering der det er grunnlag — er godt forankret i evidens. Rammeverket for å se dem i sammenheng er nyttig. Spesifikke protokoller uten evidensgrunnlag er ikke det."
      }
    ],
    ainas_note: "Jeg ble lege fordi jeg ville hjelpe mennesker som falt utenfor. Funksjonell medisin er ikke et kurs jeg tok — det er der den kliniske nysgjerrigheten tok meg, etter mange år med pasienter systemet ikke hadde svar til."
  },

  "5-element-akupunktur": {
    slug: "5-element-akupunktur",
    title: "5 Element Akupunktur",
    shortTitle: "5 Element Akupunktur",
    intro: "5 Element Akupunktur er ikke en samling av punkter du stikker på. Det er en diagnostisk filosofi — et kart over hele mennesket, der kropp, sinn og ånd ses som ett sammenhengende system. I vestlig klinisk praksis er det mest kjent gjennom J.R. Worsleys arbeid i det 20. århundre, men røttene er klassisk kinesisk medisin.",
    sections: [
      {
        heading: "De fem elementene",
        body: "Tre, Ild, Jord, Metall og Vann — hvert element tilsvarer organpar, årstider, emosjoner, sanseorganer og farger. Det sentrale kliniske konseptet er det konstitusjonelle elementet (causative factor, CF): det elementet som er fundamentalt svakest i deg, og som preger hele din måte å møte verden på.\n\nI stedet for å behandle symptomet — angst, søvnvansker, smerter — behandler 5 Element-akupunktur det underliggende mønsteret. Samme symptom kan ha helt ulik behandling hos to ulike personer, avhengig av hvilket element som er roten."
      },
      {
        heading: "Forskning og mekanismer",
        body: "5 Element Akupunktur spesifikt har et tynt forskningsgrunnlag — de fleste studier undersøker akupunktur generelt uten å skille metoder. Et pilotforsøk (Hicks et al., Journal of Alternative and Complementary Medicine, 2014) viste signifikant bedring i velvære og redusert angst mot ventelistekontroll.\n\nDe mekanismene som er best dokumentert for akupunktur generelt — modulering av det autonome nervesystemet, endogen opioidfrigjøring, endorfiner, redusert sentralsensitivisering — er sannsynlig relevante også her. Det konstitusjonelle kartet er ikke påvist fysiologisk, men det er et klinisk nyttig rammeverk."
      },
      {
        heading: "Den taoistiske forståelsen",
        body: "Det som skilte den kinesiske medisinen fra den vestlige var aldri at den var mystisk. Det var at den aldri skilte psyke fra soma. At den aldri isolerte et organ fra resten. At den aldri behandlet uten å se hvem pasienten var.\n\nI min praksis er dette ikke i stedet for moderne diagnostikk — det er ved siden av. Som en annen inngang til den samme personen."
      }
    ],
    ainas_note: "Den taoistiske helseforståelsen ble medisin for meg selv. Ikke fordi jeg la fra meg det jeg lærte på medisinstudiet — men fordi det ga meg et språk for det skolemedisin ikke hadde ord for."
  },

  "polyvagalteori": {
    slug: "polyvagalteori",
    title: "Polyvagalteori",
    shortTitle: "Polyvagalteori",
    intro: "Polyvagalteori er utviklet av nevrofysiologen Stephen Porges og beskriver hvordan det autonome nervesystemet regulerer trygghet, fare og forbindelse. Det er et av de mest innflytelsesrike rammeverkene i traumefeltet de siste tretti årene — og et av de mest omstridte innen akademisk nevrovitenskap.",
    sections: [
      {
        heading: "Tre nivåer",
        body: "Teorien beskriver tre fylogenetisk organiserte responssystemer. Det ventrale vagale systemet — det nyeste — er aktivt når vi er trygge: vi er nysgjerrige, åpne, i kontakt. Det sympatiske systemet tar over ved trussel: vi mobiliserer til kamp eller flukt. Det dorsale vagale systemet er det eldste: ved overveldig trussel uten fluktmulighet lukker vi oss ned — dissociasjon, nummenhet, kollaps.\n\nPorges kaller kroppens ubevisste skanning for trusler «neuroception» — en prosess under kognitiv bevissthet som avgjør hvilken tilstand vi er i."
      },
      {
        heading: "Klinisk relevans",
        body: "For traumearbeid er rammen verdifull. Den forklarer hvorfor mange traumatiserte ikke kan «bestemme seg for» å slappe av — nervesystemet er satt på beredskap av erfaringer det ikke har integrert. Den forklarer hvorfor terapeutisk relasjon og trygghet ikke er trivielle faktorer, men nevrobiologiske forutsetninger for at læring og helbredelse skal kunne skje.\n\nPolyvagal-informert behandling ser ikke på symptomer som patologi, men som adaptive responser på en verden som har vært utrygg."
      },
      {
        heading: "Hva vi bør være ærlige om",
        body: "Teorien er omstridt i nevrovitenskapelig litteratur. Kritikere (særlig Grossman og Taylor) anfører at Porges' modell av det dorsale vagale systemet hos pattedyr ikke er godt støttet av komparativ nevroanatomi. Den er vanskelig å operasjonalisere og teste empirisk.\n\nDet betyr ikke at den kliniske innsikten er ugyldig. Verdien er i stor grad heuristisk: den gir pasienter en tilgjengelig, ikke-skammende modell for sine egne reaksjoner. Det er klinisk meningsfull i seg selv — men det er ikke det samme som bevist nevrovitenskap."
      }
    ],
    ainas_note: "Det viktigste teorien ga meg som kliniker: forståelsen av at pasienter som ikke reagerer som forventet på behandling, ikke er vanskelige. De er trygge nok til å overleve — men ikke trygge nok til å heles. Det er noe annet."
  },

  "ifs": {
    slug: "ifs",
    title: "Internal Family Systems",
    shortTitle: "IFS",
    intro: "Internal Family Systems (IFS), utviklet av psykologen Richard Schwartz, tar utgangspunkt i at sinnet er sammensatt av «deler» — indre stemmer, impulser og mønstre med egne perspektiver og intensjoner. Ingen av dem er onde. Alle gjør det beste de kan med det de vet.",
    sections: [
      {
        heading: "Delene og Selvet",
        body: "IFS skiller mellom tre typer deler: eksilene (de som bærer på smerten), managerne (de som beskytter og kontrollerer) og brannmennene (de som reagerer impulsivt når eksilene er i fare). Bak alle disse finnes Selvet — kjernen av deg, preget av ro, nysgjerrighet og medfølelse, som kan lede systemet uten at noen del trenger å ta kontrollen.\n\nTerapeutisk mål er ikke å bli kvitt noen del — det er å la Selvet tre inn i en lederrolle, slik at ingen del trenger å kjempe for kontroll."
      },
      {
        heading: "Forskning og evidens",
        body: "En randomisert kontrollert studie (Shadick et al., Journal of Rheumatology, 2021) viste signifikant reduksjon i smerte, depresjon og skam hos pasienter med revmatoid artritt etter IFS-behandling. Tidligere studier har vist effekt på PTSD og sammensatte somatiske symptomer.\n\nEvidensbasen er voksende, men fortsatt begrenset — relativt få RCTs, de fleste med små utvalg. SAMHSA i USA klassifiserte IFS som evidensbasert metode i 2015. Størst klinisk verdi ser ut til å være ved komplekse traumer, skam-pregede presentasjoner (avhengighet, spiseforstyrrelser, selvskading) og tilstander som responderer dårlig på protokollstyrte kognitiv-atferdsorienterte tilnærminger."
      },
      {
        heading: "Ingen dårlige deler",
        body: "Det som skiller IFS fra mange andre terapiformer er holdningen: det finnes ingen dårlige deler. Atferd som selvskading, rusing eller sabotasje er ikke patologi — det er en del som gjør noe for å beskytte mot noe verre.\n\nDenne reframen kan ha kraftig terapeutisk effekt på pasienter som i årevis har skammet seg over sine egne reaksjoner. Å møte dem med nysgjerrighet i stedet for vurdering er ikke bare snillhet — det er teknikk."
      }
    ],
    ainas_note: "IFS ga meg et språk for noe jeg hadde sett klinisk i mange år: at det som ser ut som motstand mot helbredelse, nesten alltid er beskyttelse. Og at det eneste som løser beskyttelse er nok trygghet til at vakten kan legges ned."
  },

  "somatic-experiencing": {
    slug: "somatic-experiencing",
    title: "Somatic Experiencing",
    shortTitle: "Somatic Experiencing",
    intro: "Somatic Experiencing (SE) er utviklet av psykologen Peter Levine, og tar utgangspunkt i en observasjon fra dyreriket: dyr som overlever livstruende situasjoner rister det ut av kroppen og går videre. Mennesker gjør det sjelden. Vi holder igjen. Og det biologiske beredskapssvaret som aldri fikk fullføre, setter seg.",
    sections: [
      {
        heading: "Trauma som ufullstendig respons",
        body: "SE ser ikke på traume som det som skjedde — men som det nervesystemet ikke klarte å fullføre. Frys-reaksjonen, den mobiliserte men blokkerte fluktresponsen, den ubrukte styrken i muskler som spente seg til forsvar: dette er ikke erindringer, det er fysiologisk aktivering som ikke er blitt løst.\n\nTerapeutisk arbeid i SE handler om å spore kroppens sensasjoner, nærme seg aktiveringen i små doser (titrering), og la nervesystemet fullføre det det aldri fikk fullføre — gradvis, trygt, uten å gjenfortelle traumehistorien."
      },
      {
        heading: "Forskning",
        body: "En randomisert kontrollert studie (Brom et al., Psychological Trauma, 2017) med 63 PTSD-pasienter viste signifikant reduksjon i PTSD-symptomer, depresjon og somatiske plager sammenlignet med ventelistekontroll, med resultater opprettholdt etter 6 måneder. Studien er lovende, men for liten til å si noe sikkert om SE opp mot etablerte behandlinger som EMDR eller CPT.\n\nSE brukes klinisk ved PTSD, somatoforme lidelser, funksjonell nevrologisk sykdom og komplekst utviklingstrauma — særlig hos pasienter som har hatt dårlig nytte av eller blitt retraumatisert av samtaleterapi."
      },
      {
        heading: "Når kroppen vet mer enn ordene",
        body: "Det som skiller SE fra de fleste andre traumebehandlinger er vektleggingen av kroppssensasjon fremfor narrativ. Du trenger ikke fortelle historien for å bearbeide den. For mange pasienter er dette avgjørende: de har fortalt historien hundre ganger, og det har gjort dem verre, ikke bedre.\n\nSE er ikke snakk om kroppen — det er arbeid gjennom kroppen. Skillet er ikke semantisk. Det er klinisk."
      }
    ],
    ainas_note: "Kroppen husker det hodet har glemt. Og kroppen kan heles det hodet ikke klarer å tenke seg ut av. Levines arbeid ga meg et rammeverk for det jeg allerede hadde sett, men ikke hatt ord for."
  },

  "pustearbeid": {
    slug: "pustearbeid",
    title: "Pustearbeid",
    shortTitle: "Pustearbeid",
    intro: "Pusten er den eneste autonome kroppsfunksjonen du også kan styre bevisst. Det gjør den til en direkte inngang til nervesystemet — ikke som metafor, men som fysiologi.",
    sections: [
      {
        heading: "Mekanismen",
        body: "Sakte, dypt diafragmatisk pust ved rundt 5–6 åndedrag per minutt — såkalt resonanspust — aktiverer baroreflexi og vagusnerven og øker hjertefrekvensvariabiliteten (HRV). Det senker sympatisk aktivering og gir økt parasympatisk tonus.\n\nCO2 er undervurdert i samtalen om pust. Kronisk overpusting (hyperventilasjon) gir lavt CO2-nivå, som forårsaker blodårekrampe, økt nevronisk eksitabilitet og angst. Å trene CO2-toleranse — gjennom kontrollert, saktere pust — reduserer reaktiviteten i nervesystemet over tid."
      },
      {
        heading: "Evidens",
        body: "Saktepust er ett av de best dokumenterte adjuvantene ved hypertensjon — meta-analyser viser reduksjon på 5–8 mmHg systolisk blodtrykk. For angstlidelser og PTSD støttes diafragmatisk pust i en rekke RCTs som effektiv kortidsintervensjon.\n\nEn studie fra Stanford (Huberman/Bhatt, Cell Reports Medicine, 2023) viste at «cyclic sighing» — ett langt innpust med pause, etterfulgt av passiv utpust — var mer effektivt for umiddelbar affektregulering enn mindfulnessmeditasjon og boksepust, i en forhåndsregistrert studie med 114 deltakere."
      },
      {
        heading: "Hva vi bør skille fra hverandre",
        body: "«Pustearbeid» er ikke ett ting. Resonanspust og saktepust er klinisk godt dokumenterte. Holotropisk pustearbeid (hyperventilering for å indusere endrede bevissthetstilstander) har svakt evidensgrunnlag og medfører risiko for besvimelse og, sjelden, krampeanfall. Wim Hof-metoden har noen immune data men begrenset klinisk dokumentasjon.\n\nSom kliniker er mitt ståsted: det er godt grunnlag for å anbefale saktepust som selvregulering. Det er ikke det samme som å anbefale «breathwork» som kategori."
      }
    ],
    ainas_note: "Pusten er alltid der. Uansett hva som skjer, kan du alltid komme tilbake til den. Det er ikke en teknikk — det er et anker. Og det er alltid tilgjengelig."
  },

  "dyreterapi": {
    slug: "dyreterapi",
    title: "Dyreterapi",
    shortTitle: "Dyreterapi",
    intro: "Dyr leser nervesystemet uten å dømme det. De reagerer på det som faktisk er der — ikke på det vi presenterer, ikke på historien vi forteller om oss selv. For mange pasienter er det en relasjonell erfaring som er tryggere enn noe menneskelig samspill har vært.",
    sections: [
      {
        heading: "Biokjemi og mekanismer",
        body: "Positivt samspill med dyr utløser frigjøring av oksytocin, beta-endorfiner, prolaktin og dopamin, og reduserer kortisol og stresshormonet ACTH. En kjent studie (Odendaal & Meintjes, The Veterinary Journal, 2003) viste bilaterale oksytocinstegninger — altså hos både menneske og hund — ved positivt samspill.\n\nAnatomisk aktiveres det parasympatiske systemet gjennom rolig, ikke-truende taktil kontakt, visuell soothing og det sosiale engasjementsystemet (jf. polyvagalteori) — uten den evalueringen og usikkerheten som menneskelige relasjoner ofte medfører."
      },
      {
        heading: "Hva forskningen viser",
        body: "En meta-analyse (Charry-Sánchez et al., PLOS ONE, 2021) som dekket 49 studier fant signifikant reduksjon i angst (standardisert gjennomsnittsforskjell ~0,6) og depresjon ved dyreassisterte intervensjoner. Sterkest evidens finnes for pediatrisk hospitalsangst, demengrelatert agitasjon og PTSD hos veteraner.\n\nVeteranstudier ved Purdue University (O'Haire & Rodriguez, PTSD, 2018) viste reduksjon i PTSD-symptomer, søvnproblemer og medikamentbruk ved hundeassistert terapi. Hesteassistert terapi viser lovende data ved traumatiserte ungdommer og autismespektertilstand."
      },
      {
        heading: "På Rytterbakken",
        body: "Dyreterapi på Rytterbakken er ikke et program — det er en integrert del av hverdagen på gården. Dyrene er der. Samspillet skjer naturlig.\n\nDet er ikke tilfeldig. Et gårdssted som behandlingsramme er en av de eldste og mest undervurderte terapeutiske kontekstene vi har. Vi er ikke den første til å oppdage det. Men vi er kanskje noen av de første til å gjøre det bevisst og dokumentere det."
      }
    ],
    ainas_note: "Dyr lyver ikke om hva de sanser. Hvis du er nervøs, vet hunden det. Hvis du er til stede, kjenner hesten det. Det er ikke terapi som teknikk — det er regulering som skjer i en relasjon uten agenda."
  },

  "trening-som-medisin": {
    slug: "trening-som-medisin",
    title: "Trening som medisin",
    shortTitle: "Trening som medisin",
    intro: "Trening er den best dokumenterte intervensjonen i forebyggende medisin vi har. Ikke et supplement, ikke et tillegg — en primærbehandling med effekter på nær sagt alle organsystemer. Og den er gratis.",
    sections: [
      {
        heading: "Mekanismene",
        body: "Aerob trening øker BDNF — hjernens gjødselmiddel — og fremmer nevrogenese i hippocampus, med dokumenterte effekter på depresjon og kognisjon. Den reduserer systemisk inflammasjon via myokiner (IL-6 fra muskler demper TNF-alfa og IL-1beta), forbedrer insulinsensitivitet og senker HPA-aksens reaktivitet på stress.\n\nAkutt trening gir endorfin- og endocannabinoidfrigjøring (anandamid). Langsiktig trening endrer kroppen på en måte som gjør den bedre rustet til å møte og regulere stress."
      },
      {
        heading: "Mot depresjon og angst",
        body: "En stor meta-analyse publisert i BMJ i 2023 (Noetel et al., 218 RCTs, n=14 170) fant at trening var like effektivt som antidepressiva og psykoterapi mot depresjon — med de største effektene for gå/løpe, yoga og styrketrening.\n\nFor styrketrening spesifikt: en meta-analyse i JAMA Psychiatry (Gordon et al., 2017) fant signifikant reduksjon i depressive symptomer uavhengig av helsestatus, frekvens og intensitet. Effekten av styrketrening på mental helse er robust og konsistent — og fortsatt undervurdert.\n\nSelv én time fysisk aktivitet per uke er assosiert med 12 % redusert risiko for fremtidig depresjon (Harvey et al., American Journal of Psychiatry, 2018)."
      },
      {
        heading: "Den ene utfordringen",
        body: "Dokumentasjonen er overveldende. Men den hjelper lite hvis pasienten slutter etter tre måneder.\n\nEtterlevelse kollapser typisk innen 6–12 måneder. En resept på trening uten strukturert oppfølging og atferdsstøtte er nesten ineffektiv. Dosen finnes. Leveringssystemet er problemet.\n\nDet er grunnen til at trening på Rytterbakken ikke er et program du hjem til — det er en del av hverdagen du er her for å bygge."
      }
    ],
    ainas_note: "Jeg har lært mer om depresjon av å se hva som skjer med kropper som beveger seg, enn av det meste jeg leste på medisinstudiet. Trening er ikke alternativt. Det er det vi kanskje burde ha ordinert fra starten."
  }

};

export function getFagfelt(slug: string): FagfeltEntry | undefined {
  return FAGFELT[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(FAGFELT);
}
