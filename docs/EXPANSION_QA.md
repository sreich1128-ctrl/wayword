# Expansion QA report

2026-10-13. Draft content in `content/added/<code>.json`, written by Claude, **not yet checked by a native speaker**. The app shows every item with a Draft tag. Generated from the files themselves; rerun after edits.

## Completeness

| Language | Phrases | Words | Examples | Replies | Japanese reading | Reviewer notes |
|---|---|---|---|---|---|---|
| European Portuguese | 56/56 | 73/73 | 68/68 | 13/13 | — | 37 |
| Spanish | 56/56 | 73/73 | 68/68 | 13/13 | — | 41 |
| French | 56/56 | 73/73 | 68/68 | 13/13 | — | 30 |
| Italian | 56/56 | 73/73 | 68/68 | 13/13 | — | 48 |
| Romanian | 56/56 | 73/73 | 68/68 | 13/13 | — | 43 |
| Russian | 56/56 | 73/73 | 68/68 | 13/13 | — | 37 |
| Japanese | 56/56 | 73/73 | 68/68 | 13/13 | all | 60 |
| Hebrew | 56/56 | 73/73 | 68/68 | 13/13 | — | 52 |
| Levantine Arabic | 56/56 | 73/73 | 68/68 | 13/13 | — | 51 |

`npm run validate` checks all of this on every run (every phrase, word, example and reply present; frames keep `___`; examples have no blank; Japanese readings).

## Changes made in review

- Portuguese nuts: "frutos secos" → "frutos de casca rija" (the allergen-label term; "frutos secos" can mean dried fruit).
- Romanian nuts: "nuci" (usually walnuts) → "fructe cu coajă lemnoasă" (the label term for tree nuts).
- Hebrew next departure: names the bus ("the next one" alone sounded unnatural).
- "Bag" is only a lost-belongings word now; languages use a different word for a shop bag, which the phrase "A bag, please" covers.

## Native review first: allergy and emergency

These matter for safety. Each line: the phrase, its pronunciation, and the drafter's note with a literal back-translation.

### European Portuguese

- **I'm allergic to ___.** Sou alérgico a ___. (soh ah-LEHR-zhee-koo ah) · SAFETY. Literal: 'I am allergic to ___.' Masculine speaker; a woman says 'Sou alérgica a ___.' The 'a' contracts with an article: a + o = ao (ao glúten, ao leite), a + a = à, a + os = aos; with a bare plural it stays 'a' (a frutos secos). 'Tenho alergia a ___' (I have an allergy to) is an equally common alternative.
- **Without ___, please.** Sem ___, por favor. (seng, poor fah-VOR) · SAFETY. Literal: 'Without ___, please.' The noun goes in with no article (sem carne, sem leite). For a real allergy, pair it with 'Sou alérgico a ___' so staff understand it is not just a preference.
- **Help!** Socorro! (soo-KOH-roo) · SAFETY. Literal: 'Help!/Rescue!' The standard emergency shout. The rr is the throaty r.
- **Call the police.** Chame a polícia! (SHAH-muh ah poo-LEE-see-ah) · SAFETY. Literal: 'Call the police!' (addressing one person). To a group: 'Chamem a polícia!' Emergency number in Portugal is 112.
- **I need a doctor.** Preciso de um médico. (pruh-SEE-zoo duh oong MEH-dee-koo) · SAFETY. Literal: 'I need (of) a doctor.' Portugal keeps the 'de' after precisar. In speech 'de um' often becomes 'dum'.
- **Where is the pharmacy?** Onde fica a farmácia? (ON-duh FEE-kah ah far-MAH-see-ah) · SAFETY. Literal: 'Where is the pharmacy?' For any open one: 'Onde fica a farmácia mais próxima?' (nearest).
- **It's an emergency.** É uma emergência. (eh OO-mah ee-muhr-ZHEN-see-ah) · SAFETY. Literal: 'It is an emergency.'
- **I don't feel well.** Não me sinto bem. (nowng muh SEEN-too beng) · SAFETY. Literal: 'I don't feel myself well' = I don't feel well.
- **I need to call someone.** Preciso de ligar a alguém. (pruh-SEE-zoo duh lee-GAR ah al-GAYNG) · SAFETY. Literal: 'I need to call (phone) someone.' 'Ligar a' = phone; 'telefonar a alguém' is an equivalent.
- **I lost my ___.** Perdi ___. (puhr-DEE) · SAFETY. Literal: 'I lost ___.' The possessive goes in the blank and agrees with the noun: o meu passaporte, a minha carteira, as minhas chaves. 'Perdi-me' would mean 'I got lost', so the object must follow.
- **Allergen words:** nuts = os frutos de casca rija · peanuts = os amendoins · gluten = o glúten · shellfish = o marisco · milk = o leite · eggs = os ovos · dairy = os laticínios · meat = a carne

### Spanish

- **I'm allergic to ___.** Soy alérgico a ___. (soy ah-LEHR-hee-koh ah) · Back-translation: "I am allergic to ___." Masculine speaker (file convention); a woman says "Soy alérgica a ___" (ah-LEHR-hee-kah). a + el contracts to al (al gluten, al maní), so the article goes with the word, not the frame. Safety item: please verify. Word notes: peanuts = "maní" (most of Latin America), "cacahuate" (Mexico), "cacahuete" (Spain). Nuts = "frutos secos" (tree nuts generally); "nueces" strictly means walnuts but is used loosely in Mexico. Back-translations of examples: "I am allergic to the nuts / the peanut / the gluten / the shellfish / the milk / the eggs" (Spanish uses the article here). Dairy = "los lácteos".
- **Without ___, please.** Sin ___, por favor. (seen, por fah-VOR) · Back-translation: "Without ___, please." The noun after sin normally drops its article (sin leche, sin gluten), so examples omit it. Safety item (used for allergies/diet): please verify. Examples back-translate as "Without meat / milk / gluten / ice / nuts, please".
- **Help!** ¡Ayuda! (ah-YOO-dah) · Back-translation: "Help!" "¡Socorro!" is also widely understood. Safety item: please verify.
- **Call the police.** ¡Llama a la policía! (YAH-mah ah lah poh-lee-SEE-ah) · Back-translation: "Call (tú) the police!" tú like the rest of the file; usted form is "¡Llame a la policía!". Both are understood in an emergency. Safety item: please verify.
- **I need a doctor.** Necesito un médico. (neh-seh-SEE-toh oon MEH-dee-koh) · Back-translation: "I need a doctor." "Un doctor" is also common in Latin America. Safety item: please verify.
- **Where is the pharmacy?** ¿Dónde está la farmacia? (DON-deh es-TAH lah far-MAH-syah) · Back-translation: "Where is the pharmacy?" To ask for any pharmacy nearby, "¿Dónde hay una farmacia?" (where is there a pharmacy) is more natural. Safety item: please verify.
- **It's an emergency.** Es una emergencia. (es OO-nah eh-mehr-HEN-syah) · Back-translation: "It is an emergency." Safety item: please verify.
- **I don't feel well.** No me siento bien. (noh meh SYEN-toh byen) · Back-translation: "I don't feel well." Safety item: please verify.
- **I need to call someone.** Necesito llamar a alguien. (neh-seh-SEE-toh yah-MAR ah AL-gyen) · Back-translation: "I need to call someone." Safety item: please verify.
- **I lost my ___.** Perdí ___. (pehr-DEE) · Back-translation: "I lost ___." The blank takes a possessive that changes per word (mi pasaporte, mis llaves), so it is not fixed in the frame. Spain more often says "He perdido ___". Safety item: please verify. Word notes: wallet = "billetera" ("cartera" in Mexico and Spain, but cartera is a handbag in parts of South America); phone = "teléfono" ("celular" in Latin America, "móvil" in Spain); bag = "bolsa" (Spain: "bolso" for a handbag, "mochila" for a backpack). Room key example says "the key to my room".
- **Allergen words:** nuts = los frutos secos · peanuts = el maní · gluten = el gluten · shellfish = los mariscos · milk = la leche · eggs = los huevos · dairy = los lácteos · meat = la carne

### French

- **I'm allergic to ___.** Je suis allergique ___. (zhuh swee zah-lehr-ZHEEK) · SAFETY. Back-translation: 'I am allergic [to the] ___.' The blank must include à + article, which contracts and changes per word (au gluten, au lait, aux œufs, aux fruits à coque, à la ..., à l'...), so 'à' is not outside the blank. 'allergique' is the same for male and female speakers.
- **Without ___, please.** Sans ___, s'il vous plaît. (sahn, seel voo PLEH) · SAFETY. Back-translation: 'Without ___, please.' No article after 'sans' (sans viande, sans lait, sans gluten). This is a preference request; for a real allergy use allergic_to as well, since 'sans' alone may be read as taste, not medical need.
- **Help!** Au secours ! (oh suh-KOOR) · SAFETY. Back-translation: 'Help!' (literally 'to the rescue'). The standard French cry for help.
- **Call the police.** Appelez la police ! (ah-play lah poh-LEESS) · SAFETY. Back-translation: 'Call the police!' (polite/plural vous imperative, right for strangers). Emergency number in France: 17 or 112.
- **I need a doctor.** J'ai besoin d'un médecin. (zhay buh-ZWAN duhn mayd-SAN) · SAFETY. Back-translation: 'I have need of a doctor.' = I need a doctor. Same for male and female speakers.
- **Where is the pharmacy?** Où est la pharmacie ? (oo eh lah far-mah-SEE) · SAFETY. Back-translation: 'Where is the pharmacy?' For any pharmacy nearby, 'Il y a une pharmacie près d'ici ?' (Is there a pharmacy near here?) also works.
- **It's an emergency.** C'est une urgence. (say tewn ewr-ZHAHNSS) · SAFETY. Back-translation: 'It is an emergency.' Standard phrasing.
- **I don't feel well.** Je ne me sens pas bien. (zhuh nuh muh sahn pah BYEN) · SAFETY. Back-translation: 'I don't feel myself well.' = I don't feel well. Same for male and female speakers.
- **I need to call someone.** Je dois appeler quelqu'un. (zhuh dwah ah-puh-LAY kel-KUHN) · SAFETY. Back-translation: 'I must call someone.' 'J'ai besoin d'appeler quelqu'un' (I need to call someone) is an equally natural alternative.
- **I lost my ___.** J'ai perdu ___. (zhay pehr-DEW) · SAFETY. Back-translation: 'I have lost ___.' The blank takes a possessive that changes with the noun (mon passeport, ma valise, mes clés), so it stays inside the blank. 'perdu' does not change for speaker gender here.
- **Allergen words:** nuts = les fruits à coque · peanuts = les arachides · gluten = le gluten · shellfish = les fruits de mer · milk = du lait · eggs = les œufs · dairy = les produits laitiers · meat = la viande

### Italian

- **I'm allergic to ___.** Sono allergico a ___. (SOH-noh al-LEHR-jee-koh ah) · SAFETY. Back-translation: 'I am allergic to ___'. Gender: masculine speaker form; a woman says 'Sono allergica a ___' (al-LEHR-jee-kah). The fixed 'a' merges with the article of the food: al glutine, alla frutta a guscio, ai frutti di mare, alle uova, al latte, alle arachidi; see the examples, don't paste the word after 'a'.
- **Without ___, please.** Senza ___, per favore. (SEN-tsah, pehr fah-VOH-reh) · SAFETY. Back-translation: 'Without ___, please.' 'Senza' takes the bare noun, no article (senza latte, senza glutine). For a serious allergy, combine with allergic_to so staff know it's not a preference.
- **Help!** Aiuto! (ah-YOO-toh) · SAFETY. Back-translation: 'Help!' Standard shout for help.
- **Call the police.** Chiami la polizia! (KYAH-mee lah poh-lee-TSEE-ah) · SAFETY. Back-translation: 'Call (you, formal) the police!' Shouting to a group: 'Chiamate la polizia!' Emergency number in Italy/EU: 112.
- **I need a doctor.** Ho bisogno di un medico. (oh bee-ZOH-nyoh dee oon MEH-dee-koh) · SAFETY. Back-translation: 'I have need of a doctor.' 'Medico' is the general word; 'dottore' is also understood.
- **Where is the pharmacy?** Dov'è la farmacia? (doh-VEH lah far-mah-CHEE-ah) · SAFETY. Back-translation: 'Where is the pharmacy?' Pharmacies show a green cross; at night look for the 'farmacia di turno' (duty pharmacy).
- **It's an emergency.** È un'emergenza. (eh oo-neh-mehr-JEN-tsah) · SAFETY. Back-translation: 'It is an emergency.'
- **I don't feel well.** Non mi sento bene. (non mee SEN-toh BEH-neh) · SAFETY. Back-translation: 'I don't feel (myself) well.'
- **I need to call someone.** Devo chiamare qualcuno. (DEH-voh kyah-MAH-reh kwahl-KOO-noh) · SAFETY. Back-translation: 'I must call someone.' To ask to borrow a phone: 'Posso fare una telefonata?'
- **I lost my ___.** Ho perso ___. (oh PEHR-soh) · SAFETY. Back-translation: 'I have lost the ___'. Italian normally uses the article, not 'my': 'Ho perso il passaporto.' ('il mio passaporto' is also correct). The blank takes the noun with its article. For theft: 'Mi hanno rubato ___' (they stole my ___).
- **Allergen words:** nuts = la frutta a guscio · peanuts = le arachidi · gluten = il glutine · shellfish = i frutti di mare · milk = il latte · eggs = le uova · dairy = i latticini · meat = la carne

### Romanian

- **I'm allergic to ___.** Sunt alergic la ___. (soont ah-LER-jeek lah ___) · Masculine speaker. Feminine: Sunt alergică la ___. Literal: 'I am allergic to ___.' Noun after la is used without the article (la nuci, la lapte).
- **Without ___, please.** Fără ___, vă rog. (FUH-ruh ___, vuh rohg) · Literal: 'Without ___, please.' Noun without article (fără carne, fără gheață).
- **Help!** Ajutor! (ah-zhoo-TOR) · Literal: 'Help!' (the noun). The standard shout.
- **Call the police.** Chemați poliția! (keh-MAHTS poh-LEE-tsyah) · Literal: 'Call the police!' (polite/plural imperative). Emergency number in Romania is 112.
- **I need a doctor.** Am nevoie de un doctor. (ahm neh-VOH-yeh deh oon DOK-tor) · Literal: 'I have need of a doctor.' Medic is also common: Am nevoie de un medic.
- **Where is the pharmacy?** Unde este farmacia? (OON-deh YES-teh far-mah-CHEE-ah) · Literal: 'Where is the pharmacy?' For the closest: Unde este cea mai apropiată farmacie?
- **It's an emergency.** Este o urgență. (YES-teh oh oor-JEN-tsuh) · Literal: 'It is an emergency.'
- **I don't feel well.** Nu mă simt bine. (noo muh simt BEE-neh) · Literal: 'I don't feel myself well.' Gender-neutral.
- **I need to call someone.** Trebuie să sun pe cineva. (TREH-boo-yeh suh soon peh chee-neh-VAH) · Literal: 'I must call someone.' Alternative: Am nevoie să sun pe cineva ('I need to call someone').
- **I lost my ___.** Mi-am pierdut ___. (myahm pyer-DOOT ___) · Literal: 'I have lost (to myself) ___.' Blank takes the noun with its definite article (pașaportul, cheile); no possessive needed. If stolen: Mi s-a furat ___.
- **Allergen words:** nuts = fructe cu coajă lemnoasă · peanuts = arahide · gluten = gluten · shellfish = fructe de mare · milk = lapte · eggs = ouă · dairy = lactate · meat = carne

### Russian

- **I'm allergic to ___.** У меня аллергия на ___. (oo mee-NYAH ah-leer-GEE-yah nah) · Back-translation: 'I have an allergy to ___' (lit. 'at me [is] allergy on ___'). The allergen takes the accusative case (на орехи, на молоко, на яйца). Gender-neutral.
- **Without ___, please.** Без ___, пожалуйста. (byez, pah-ZHAH-loo-stah) · Back-translation: 'Without ___, please.' Без takes the genitive: без мяса, без молока, без глютена, без льда, без орехов. For an allergy, pair it with 'У меня аллергия на ___' so staff know it is medical, not a preference.
- **Help!** Помогите! (pah-mah-GEE-tyeh) · Back-translation: 'Help!' (lit. 'help [me]!', polite/plural imperative). The standard shout for help.
- **Call the police.** Вызовите полицию! (VY-zah-vee-tyeh pah-LEE-tsy-yoo) · Back-translation: 'Call the police!' (вызвать = summon). Emergency number 112; police direct 102.
- **I need a doctor.** Мне нужен врач. (mnyeh NOO-zheen vrahch) · Back-translation: 'I need a doctor' (lit. 'to me [is] needed a doctor'). Gender-neutral. For an ambulance: Вызовите скорую! (Call an ambulance!), number 103 or 112.
- **Where is the pharmacy?** Где аптека? (gdyeh ahp-TYEH-kah) · Back-translation: 'Where is [the] pharmacy?'. For the nearest one: Где ближайшая аптека?
- **It's an emergency.** Это срочно! (EH-tah SROCH-nah) · Back-translation: 'It's urgent!'. This is the everyday way to say it; Это экстренный случай (it's an emergency case) is more formal and less often shouted.
- **I don't feel well.** Я плохо себя чувствую. (ya PLOH-khah see-BYAH CHOOST-voo-yoo) · Back-translation: 'I feel bad (unwell)' (lit. 'I badly myself feel'). Gender-neutral. Shorter and more urgent: Мне плохо (I feel sick/faint). The first в in чувствую is silent.
- **I need to call someone.** Мне нужно позвонить. (mnyeh NOOZH-nah pah-zvah-NEET) · Back-translation: 'I need to make a phone call' (lit. 'to me [it is] necessary to call'). Add Можно с вашего телефона? to ask to use someone's phone.
- **I lost my ___.** Я потерял/потеряла ___. (ya pah-tee-RYAHL/pah-tee-RYAH-lah) · Back-translation: 'I lost ___.' Speaker gender: потерял (man) / потеряла (woman). The object takes the accusative (паспорт, сумку). Russian normally omits 'my' here.
- **Allergen words:** nuts = орехи · peanuts = арахис · gluten = глютен · shellfish = морепродукты · milk = молоко · eggs = яйца · dairy = молочные продукты · meat = мясо

### Japanese

- **I'm allergic to ___.** ___アレルギーがあります。 (___ ah-reh-roo-gee gah ah-ree-mahs) · SAFETY. Back-translation: 'I have a ___ allergy.' The food word attaches directly as a compound (卵アレルギー = egg allergy). Standard, widely understood. For severe allergies, travellers should also show this in writing and ask about traces; this phrase does not say how severe the allergy is.
- **Without ___, please.** ___抜きでお願いします。 (___ noo-kee deh oh-neh-guy-shee-mahs) · SAFETY. Back-translation: 'With ___ left out, please.' Standard ordering phrase (氷抜き, 肉抜き). ___なしで is an equally common alternative. It is a preference request only: it does not tell staff it is an allergy, so for allergies pair it with allergic_to.
- **Help!** 助けて！ (tah-soo-keh-teh) · SAFETY. Back-translation: 'Help (me)!' / 'Save me!' The standard shout. 誰か！ (Someone!) is also shouted.
- **Call the police.** 警察を呼んでください！ (kay-sah-tsoo oh yon-deh koo-dah-sai) · SAFETY. Back-translation: 'Please call the police!' Police number in Japan is 110; ambulance and fire is 119. A local police box is a 交番 (koban).
- **I need a doctor.** 医者が必要です。 (ee-shah gah hee-tsoo-yoh des) · SAFETY. Back-translation: 'A doctor is necessary.' Clear and understood. In an urgent case, 救急車を呼んでください (please call an ambulance) is what people actually shout; 病院に行きたいです = 'I want to go to a hospital.'
- **Where is the pharmacy?** 薬局はどこですか？ (yak-kyoh-koo wah doh-koh des-kah) · SAFETY. Back-translation: 'Where is the pharmacy?' Over-the-counter medicine is mostly sold at ドラッグストア (drugstores), which locals may point you to.
- **It's an emergency.** 緊急です！ (keen-kyoo des) · SAFETY. Back-translation: 'It's urgent / an emergency!' Understood; 急いでください (please hurry) is a natural follow-up.
- **I don't feel well.** 体調が悪いです。 (tai-choh gah wah-roo-ee des) · SAFETY. Back-translation: 'My physical condition is bad' = I'm unwell. 気分が悪いです ('I feel bad/sick') is also common and leans toward nausea or feeling faint.
- **I need to call someone.** 電話をかけないといけません。 (den-wah oh kah-keh-nai toh ee-keh-mah-sen) · SAFETY. Back-translation: 'I have to make a phone call.' Not fully sure this is the most natural card choice; to borrow a phone, 電話を貸してもらえますか？ (could you lend me a phone?) is more useful in practice.
- **I lost my ___.** ___をなくしました。 (___ oh nah-koo-shee-mah-shee-tah) · SAFETY. Back-translation: 'I lost ___.' If it was stolen: ___を盗まれました. Lost property goes to the 交番 (police box) or the station's 忘れ物 (lost and found).
- **Allergen words:** nuts = ナッツ · peanuts = ピーナッツ · gluten = グルテン · shellfish = 甲殻類 · milk = 牛乳 · eggs = 卵 · dairy = 乳製品 · meat = 肉

### Hebrew

- **I'm allergic to ___.** אני אלרגי ל___. (a-NEE a-LER-gee le-___) · Back-translation: 'I [am] allergic to ___.' Masculine speaker; a woman says אני אלרגית (a-LER-geet). Prefix ל attaches to the allergen word. To stress severity add: זה מסוכן לי (ze me-su-KAN lee, 'it is dangerous for me').
- **Without ___, please.** בלי ___, בבקשה. (blee ___, be-va-ka-SHA) · Back-translation: 'Without ___, please.' בלי never changes form; for an allergy, say allergic_to as well, since בלי alone may be read as a preference.
- **Help!** הצילו! (ha-TSEE-loo) · Back-translation: 'Save [me]!' / 'Rescue!' The standard shout for help, said the same by anyone. Israel emergency numbers: police 100, ambulance (Magen David Adom) 101.
- **Call the police.** תתקשרו למשטרה! (tit-kash-ROO la-mish-ta-RA) · Back-translation: '(You all) call to the police!' Plural, addressed to bystanders, same for any gender. To one man: תתקשר (tit-ka-SHER); to one woman: תתקשרי (tit-kash-REE). Police number in Israel: 100.
- **I need a doctor.** אני צריך רופא. (a-NEE tsa-REEKH ro-FE) · Back-translation: 'I need a doctor.' Masculine speaker; feminine אני צריכה (tsree-KHA). If urgent: אני צריך אמבולנס (am-bu-LANS), number 101.
- **Where is the pharmacy?** איפה בית המרקחת? (EY-fo beyt ha-mir-KA-khat) · Back-translation: 'Where [is] the pharmacy?' בית מרקחת is the standard word; many Israelis just say סופר-פארם (the main chain) or ask איפה יש פה בית מרקחת? ('where is there a pharmacy here?').
- **It's an emergency.** זה מקרה חירום. (ze mik-RE khe-ROOM) · Back-translation: 'This is an emergency case.' Shorter and very common: זה דחוף! (ze da-KHOOF, 'it's urgent!').
- **I don't feel well.** אני לא מרגיש טוב. (a-NEE lo mar-GEESH tov) · Back-translation: 'I don't feel good.' Masculine speaker; feminine אני לא מרגישה טוב (mar-gee-SHA).
- **I need to call someone.** אני צריך להתקשר למישהו. (a-NEE tsa-REEKH le-hit-ka-SHER le-MEE-she-hu) · Back-translation: 'I need to call to someone.' Masculine speaker; feminine צריכה (tsree-KHA). To borrow a phone: אפשר להתקשר מהטלפון שלך? (ef-SHAR le-hit-ka-SHER me-ha-TE-le-fon shel-KHA).
- **I lost my ___.** איבדתי את ה___ שלי. (ee-BAD-tee et ha-___ she-LEE) · Back-translation: 'I lost the ___ of mine.' Past tense, same for men and women. ה goes on the noun; for a two-word noun (room key) it becomes את המפתח של החדר שלי.
- **Allergen words:** nuts = אגוזים · peanuts = בוטנים · gluten = גלוטן · shellfish = פירות ים · milk = חלב · eggs = ביצים · dairy = מוצרי חלב · meat = בשר

### Levantine Arabic

- **I'm allergic to ___.** عندي حساسية من ___. (AN-dee ha-saa-SEE-yeh min ___) · ALLERGY. Literal: 'I have an allergy from ___' (= I'm allergic to ___). حساسية على ___ is also heard. Blank takes the allergen with the article (المكسرات, البيض). Gender-neutral.
- **Without ___, please.** بدون ___، لو سمحت. (bi-DOON ___, law sa-MAHT) · ALLERGY/DIET. Literal: 'Without ___, please.' Blank takes the noun with no article (بدون لحمة, بدون حليب). بلا (BA-la) ___ is a common alternative.
- **Help!** ساعدوني! (saa-'DOO-nee) · EMERGENCY. Literal: 'Help me!' (addressed to everyone, plural). Also shouted: الحقوني! (il-Ha-'OO-nee, 'come quickly to me'). Gender-neutral.
- **Call the police.** اتصل بالشرطة! (it-TI-sil bish-SHUR-ta) · EMERGENCY. Literal: 'Call the police!' Masculine form (file convention: masculine speaker/listener). Female listener: اتصلي (it-TSI-lee); to a group: اتصلوا. In Lebanon البوليس is also heard. Police number: 911 in Jordan/Palestine, 112 in Lebanon.
- **I need a doctor.** بدي دكتور. (BAD-dee duk-TOOR) · EMERGENCY. Literal: 'I want/need a doctor.' Gender-neutral. محتاج دكتور (masc) / محتاجة (fem) is also used.
- **Where is the pharmacy?** وين الصيدلية؟ (wayn is-say-da-LEE-yeh) · EMERGENCY. Literal: 'Where is the pharmacy?'
- **It's an emergency.** هاي حالة طارئة! (hay HAA-leh TAA-ri-'a) · EMERGENCY. Literal: 'This is an emergency case!' Slightly formal but widely understood; in speech ضروري كتير! ('very urgent') is also used.
- **I don't feel well.** مش حاسس حالي منيح. (mish HAA-ses HAA-lee mneeH) · EMERGENCY. Literal: 'I'm not feeling myself well.' Masculine form (file convention: masculine speaker/listener). Female speaker: مش حاسة حالي منيح (HAAS-seh). Shorter: أنا تعبان (masc) / تعبانة (fem), 'I'm unwell/tired'.
- **I need to call someone.** لازم أتصل بحدا. (LAA-zim at-TI-sil b-HA-da) · EMERGENCY. Literal: 'I must call someone.' Gender-neutral.
- **I lost my ___.** ضيّعت ___. (day-YA'T ___) · EMERGENCY. Literal: 'I lost ___.' The possessive 'my' is a suffix on the noun (-ee), so the word changes: ضيّعت جواز سفري ('I lost my passport'). See examples. Gender-neutral.
- **Allergen words:** nuts = مكسرات · peanuts = فستق سوداني · gluten = غلوتين · shellfish = ثمار البحر · milk = حليب · eggs = بيض · dairy = مشتقات حليب · meat = لحمة

## Gender-dependent items

Following each language's existing convention (masculine speaker by default; slash pairs where the dataset uses them). The note gives the other form.

- **European Portuguese:** no_thank_you, table_for, vegetarian, another_one, next_departure, im_lost, ill_take_it
- **Spanish:** vegetarian, another_one, does_this_go_to, next_departure, im_lost, ill_take_it, too_expensive, try_it_on, another_size
- **French:** sorry, vegetarian, another_one, does_this_go_to, next_departure, im_lost, ill_take_it
- **Italian:** vegetarian, delicious, another_one, next_departure, im_lost, ill_take_it, too_expensive, try_it_on, not_too_short
- **Romanian:** table_for, vegetarian, delicious, another_one, next_departure, ill_take_it, too_expensive
- **Russian:** vegetarian, another_one, does_this_go_to, next_departure, im_lost
- **Japanese:** none (polite forms are gender-neutral)
- **Hebrew:** sorry, table_for, vegetarian, another_one, does_this_go_to, take_me_to, stop_here, next_departure, im_lost, doesnt_work, just_looking
- **Levantine Arabic:** sorry, vegetarian, delicious, another_one, does_this_go_to, take_me_to, stop_here, next_departure, im_lost, show_on_map, doesnt_work, ill_take_it, too_expensive, try_it_on, beard_trim

## Everything else the drafters flagged

Phrasing they weren't fully sure of, regional alternatives, and frames whose grammar changes per word. Full notes are in each file's `qa` fields.

- **European Portuguese** (19): goodbye, sorry, okay, good_evening, menu_please, for_here, delicious, ticket_to, does_this_go_to, take_me_to, which_platform, straight_ahead, under_name, wifi_password, doesnt_work, another_towel, too_expensive, just_trim, like_this
- **Spanish** (22): sorry, okay, good_evening, table_for, menu_please, for_here, delicious, ticket_to, take_me_to, stop_here, which_platform, how_long_trip, straight_ahead, have_reservation, wifi_password, checkout_time, doesnt_work, just_looking, just_trim, shorter_sides, like_this, beard_trim
- **French** (13): table_for, menu_please, ticket_to, take_me_to, stop_here, which_platform, under_name, checkout_time, doesnt_work, another_towel, another_size, just_trim, beard_trim
- **Italian** (29): goodbye, sorry, okay, good_evening, table_for, menu_please, to_go, for_here, ticket_to, does_this_go_to, take_me_to, stop_here, which_platform, left, right, straight_ahead, show_on_map, have_reservation, under_name, wifi_password, checkout_time, doesnt_work, just_looking, another_size, bag_please, haircut, just_trim, like_this, beard_trim
- **Romanian** (16): sorry, okay, for_here, ticket_to, does_this_go_to, take_me_to, which_platform, checkout_time, doesnt_work, try_it_on, bag_please, haircut, just_trim, shorter_sides, like_this, beard_trim
- **Russian** (22): sorry, youre_welcome, okay, table_for, for_here, ticket_to, take_me_to, which_platform, how_long_trip, left, right, near_here, have_reservation, wifi_password, checkout_time, leave_bags, doesnt_work, ill_take_it, bag_please, haircut, just_trim, like_this
- **Japanese** (29): goodbye, sorry, youre_welcome, no_thank_you, okay, table_for, vegetarian, to_go, for_here, delicious, another_one, ticket_to, does_this_go_to, take_me_to, stop_here, next_departure, which_platform, left, right, straight_ahead, under_name, leave_bags, doesnt_work, ill_take_it, too_expensive, bag_please, just_trim, shorter_sides, beard_trim
- **Hebrew** (17): youre_welcome, okay, menu_please, to_go, for_here, ticket_to, left, right, straight_ahead, near_here, wifi_password, checkout_time, leave_bags, bag_please, just_trim, like_this, beard_trim
- **Levantine Arabic** (26): goodbye, youre_welcome, okay, table_for, menu_please, to_go, for_here, ticket_to, which_platform, how_long_trip, one_way_or_return, left, right, straight_ahead, under_name, wifi_password, checkout_time, leave_bags, another_towel, just_looking, another_size, bag_please, haircut, just_trim, shorter_sides, like_this

## Not done yet

- **Audio:** new items play in the phone's voice. Natural recordings need an ElevenLabs run (about 56 phrases + 68 examples + 13 replies per language).
- **"How it's said" tips** for the new phrases.
- **Promotion:** once a native speaker (or the dataset tool) confirms an item, move it from `content/added/<code>.json` into `content/lang/<code>.json`; the vetted version always wins.
