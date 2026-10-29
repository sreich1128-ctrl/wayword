# Review sheet: Italian (217 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/it.<tool>.json` (for example `it.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of Italian (Italy) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- register: Travel/service phrases lean polite; social phrases are informal.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 217 keys, in order, and nothing else after the code block.

| key | English | draft | pronunciation_easy | note |
|---|---|---|---|---|
| table_for | A table for ___, please. | Un tavolo per ___, per favore. | oon TAH-voh-loh pehr, pehr fah-VOH-reh | Frame: ___ is filled with a word. Blank takes the number of people (due, tre, quattro). For one person the natural phrasing is 'per una persona' rather than 'per uno', so the example uses that. |
| menu_please | The menu, please. | Il menù, per favore. | eel meh-NOO, pehr fah-VOH-reh | Spelled 'menù' or 'menu'; both are standard. |
| allergic_to | I'm allergic to ___. | Sono allergico ___. | SOH-noh al-LEHR-jee-koh | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'I am allergic to ___'. Gender: masculine speaker form; a woman says 'Sono allergica a ___' (al-LEHR-jee-kah). The fixed 'a' merges with the article of the food: al glutine, alla frutta a guscio, ai frutti di mare, alle uova, al latte, alle arachidi; see the examples, don't paste the word after 'a'. [Fixed 2026-10-14 per ChatGPT review.] |
| without | Without ___, please. | Senza ___, per favore. | SEN-tsah, pehr fah-VOH-reh | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'Without ___, please.' 'Senza' takes the bare noun, no article (senza latte, senza glutine). For a serious allergy, combine with allergic_to so staff know it's not a preference. |
| to_go | To go, please. | Da portare via, per favore. | dah por-TAH-reh VEE-ah, pehr fah-VOH-reh | Literally 'to carry away'. 'Da asporto' is the more formal/written term. |
| for_here | For here, please. | Qui, per favore. | kwee, pehr fah-VOH-reh | Literally 'to eat here'. Staff often say 'da consumare qui'; for a drink, 'Da bere qui'. In an Italian bar you'd more often just say 'Qui'. Reviewer: check naturalness. [Fixed 2026-10-14 per ChatGPT review.] |
| delicious | It was delicious. | Era buonissimo. | EH-rah bwoh-NEES-see-moh | Agrees with the dish: 'buonissima' for a feminine dish (la pizza). 'Era tutto buonissimo.' (It was all delicious) works for a whole meal and avoids the choice. |
| another_one | Another one, please. | Un altro, per favore. | oon AHL-troh, pehr fah-VOH-reh | Agrees with the item: 'Un'altra' (oo-NAHL-trah) for feminine things like una birra. |
| ticket_to | A ticket to ___, please. | Un biglietto per ___, per favore. | oon bee-LYET-toh pehr, pehr fah-VOH-reh | Frame: ___ is filled with a word. 'Per' does not merge with the article (per il centro, per la stazione). City names take no article: 'per Roma'. |
| does_this_go_to | Does this go to ___? | Questo va ___? | KWEH-stoh vah | Frame: ___ is filled with a word. Literally 'Does this (one) go to ___?'. Clearer as 'Questo autobus va a ___?' / 'Questo treno va a ___?'. The 'a' merges with the article (all'aeroporto, alla stazione) and the city centre is 'in centro'; see examples. City names: 'a Roma'. [Fixed 2026-10-14 per ChatGPT review.] |
| take_me_to | Take me to ___, please. | Mi porti ___, per favore. | mee POR-tee, pehr fah-VOH-reh | Frame: ___ is filled with a word. Formal (Lei) to a driver. The 'a' merges with the article (all'aeroporto, alla stazione) and the centre is 'in centro'; see examples. [Fixed 2026-10-14 per ChatGPT review.] |
| stop_here | Stop here, please. | Si fermi qui, per favore. | see FEHR-mee kwee, pehr fah-VOH-reh | Formal (Lei) to a driver. |
| next_departure | When does the next one leave? | Quando parte il prossimo? | KWAHN-doh PAR-teh eel PROS-see-moh | Masculine assumes il treno / l'autobus. For a feminine noun (la nave, la corsa) it's 'la prossima'. |
| which_platform | Which platform? | Quale binario? | KWAH-leh bee-NAH-ryoh | For trains. A full question is 'Da quale binario parte?' (From which platform does it leave?). |
| one_way_or_return | One way or return? | Solo andata o andata e ritorno? | SOH-loh ahn-DAH-tah oh ahn-DAH-tah eh ree-TOR-noh |  |
| left | Left. | A sinistra. | ah see-NEE-strah | Direction (turn left/right), not "correct". Direction ('to the left'). |
| right | Right. | A destra. | ah DEH-strah | Direction (turn left/right), not "correct". Direction ('to the right'), not 'correct'. |
| straight_ahead | Straight ahead. | Sempre dritto. | SEM-preh DREET-toh | Also spelled/said 'Sempre diritto'. |
| show_on_map | Can you show me on the map? | Può mostrarmelo sulla mappa? | pwoh moh-STRAR-meh-loh SOOL-lah MAHP-pah | Formal (Lei). Also common: 'Me lo può indicare sulla cartina?' |
| near_here | Is it near here? | È qui vicino? | eh kwee vee-CHEE-noh |  |
| under_name | Under the name ___. | A nome ___. | ah NOH-meh | Frame: ___ is filled with a word. Blank takes a surname: 'A nome Smith.' 'A nome di Smith' is also heard. |
| checkout_time | What time is checkout? | A che ora è il check-out? | ah keh OH-rah eh eel chek-OWT | 'Check-out' is used as-is in hotels. Alternative: 'Entro che ora devo lasciare la camera?' (By what time must I leave the room?). |
| leave_bags | Can I leave my bags here? | Posso lasciare qui i bagagli? | POS-soh lah-SHAH-reh kwee ee bah-GAH-lyee |  |
| doesnt_work | The ___ doesn't work. | ___ non funziona. | non foon-TSYOH-nah | Frame: ___ is filled with a word. The blank takes the noun with its article (L'aria condizionata, La doccia), so the sentence starts with the blank. A plural noun needs 'non funzionano'. |
| another_towel | Can I have another towel? | Posso avere un altro asciugamano? | POS-soh ah-VEH-reh oon AHL-troh ah-shoo-gah-MAH-noh |  |
| ill_take_it | I'll take it. | Lo prendo. | loh PREN-doh | Agrees with the item: 'La prendo.' for a feminine thing (la borsa, la maglia); 'Li prendo' for plurals. |
| try_it_on | Can I try it on? | Posso provarlo? | POS-soh proh-VAR-loh | Agrees with the item: 'Posso provarla?' for a feminine thing (la giacca). |
| another_size | Do you have it in another size? | Ce l'ha in un'altra taglia? | cheh LAH een oo-NAHL-trah TAH-lyah | Formal (Lei). For shoes the size is 'numero': 'Ce l'ha in un altro numero?' |
| bag_please | A bag, please. | Un sacchetto, per favore. | oon sahk-KET-toh, pehr fah-VOH-reh | Regional variation: 'una busta' is very common in the north and centre; 'sacchetto' is understood everywhere. Shops usually charge a few cents for bags. |
| haircut | A haircut, please. | Vorrei un taglio, per favore. | vor-RAY oon TAH-lyoh, pehr fah-VOH-reh | Literally 'I'd like a cut'. Fuller: 'Vorrei tagliare i capelli.' |
| just_trim | Just a trim. | Solo una spuntatina. | SOH-loh OO-nah spoon-tah-TEE-nah | 'Spuntatina' (a little trim of the ends) is the usual barber word; 'una spuntata' also common. Reviewer: check naturalness. |
| not_too_short | Not too short. | Non troppo corti. | non TROP-poh KOR-tee | 'Corti' agrees with i capelli (masculine plural). |
| shorter_sides | Shorter on the sides. | Più corti ai lati. | pyoo KOR-tee ai LAH-tee |  |
| like_this | Like this. | Così. | koh-ZEE | Said while showing the photo. 'Così, come nella foto.' (Like this, as in the photo) is clearer. |
| beard_trim | A beard trim, please. | Una sistemata alla barba, per favore. | OO-nah see-steh-MAH-tah AHL-lah BAR-bah, pehr fah-VOH-reh | Colloquial 'a tidy-up of the beard'. Alternatives: 'Mi regola la barba?' / 'Una regolata alla barba'. Reviewer: check which is most natural. |
| where_pharmacy | Where is the pharmacy? | Dov'è la farmacia? | doh-VEH lah far-mah-CHEE-ah | SAFETY: allergy/emergency. SAFETY. Back-translation: 'Where is the pharmacy?' Pharmacies show a green cross; at night look for the 'farmacia di turno' (duty pharmacy). |
| lost_my | I lost my ___. | Ho perso ___. | oh PEHR-soh | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'I have lost the ___'. Italian normally uses the article, not 'my': 'Ho perso il passaporto.' ('il mio passaporto' is also correct). The blank takes the noun with its article. For theft: 'Mi hanno rubato ___' (they stole my ___). |
| call_someone | I need to call someone. | Devo chiamare qualcuno. | DEH-voh kyah-MAH-reh kwahl-KOO-noh | SAFETY: allergy/emergency. SAFETY. Back-translation: 'I must call someone.' To ask to borrow a phone: 'Posso fare una telefonata?' |
| do_you_have | Do you have ___? | Avete ___? | ah-VEH-teh | Frame: ___ is filled with a word. 'Avete' (you plural) addresses the shop/restaurant as a business, the usual way to ask. To one person formally: 'Ha ___?' (ah). The blank takes the noun with whatever article fits (il Wi-Fi, una cartina, piatti vegetariani); see examples. |
| how_much_is | How much is ___? | Quanto costa ___? | KWAN-toh KOS-tah | Frame: ___ is filled with a word. The blank takes the noun with its article (un biglietto, la camera). A plural noun needs 'Quanto costano ___?' (KWAN-toh KOS-tah-noh). |
| i_need | I need ___, please. | Ho bisogno di ___, per favore. | oh bee-ZOH-nyoh dee, pehr fah-VOH-reh | Frame: ___ is filled with a word. SAFETY. Back-translation: 'I have need of ___, please.' 'Di' merges with a definite article (del, dell', della), so the blank can need adjusting; with 'un/una' it stays 'di un taxi'. For a doctor the app reuses the vetted need_doctor phrase. In a real emergency shout 'Aiuto!' (ah-YOO-toh). |
| is_there_nearby | Is there a ___ nearby? | C'è ___ qui vicino? | cheh, kwee vee-CHEE-noh | Frame: ___ is filled with a word. The blank takes 'un' or 'una' + noun by gender (un bagno, una farmacia), so the article is inside the blank. 'Qui vicino' = 'near here'. |
| pay_with | Can I pay with ___? | Posso pagare ___? | POS-soh pah-GAH-reh | Frame: ___ is filled with a word. The preposition is inside the blank because it changes: cash is 'in contanti' (not 'con'), while card and phone take 'con' + article (con la carta, con il telefono). |
| can_you | Can you ___, please? | Può ___, per favore? | pwoh, pehr fah-VOH-reh | Frame: ___ is filled with a word. Formal (Lei), matching the vetted 'Può aiutarmi?' and 'Può parlare più lentamente?'. The blank takes an infinitive; object pronouns attach to it (scriverlo = write it). |
| like_without | I'd like ___ without ___. | Vorrei ___ senza ___. | vor-RAY, SEN-tsah | Frame: ___ is filled with a word. First blank: the drink/dish with its article (un tè, dell'acqua). Second blank: bare noun, no article after 'senza' (senza zucchero). For a serious allergy use allergic_to instead, so staff know it's not a preference. |
| can_i_here | Can I ___ here? | Posso ___ qui? | POS-soh, kwee | Frame: ___ is filled with a word. The blank takes an infinitive (sedermi, parcheggiare, fare foto). For a free seat in a café, 'È libero?' (Is it free?) is the most natural question. |
| looking_for | I'm looking for ___. | Cerco ___. | CHEHR-koh | Frame: ___ is filled with a word. Literally 'I look for ___'; 'Sto cercando ___' (stoh chehr-KAHN-doh) is equally natural. The blank takes the noun with its article (l'uscita, un ristorante, il mio hotel). |
| is_included | Is ___ included? | ___ è incluso? | eh een-KLOO-zoh | Frame: ___ is filled with a word. The blank takes the noun with its article, so the sentence starts with it. 'Incluso' agrees in gender and number: feminine 'inclusa' (La colazione è inclusa?), plural 'sono inclusi/incluse' (Le tasse sono incluse?); see examples, don't paste the word. |
| where_can_i | Where can I ___? | Dove posso ___? | DOH-veh POS-soh | Frame: ___ is filled with a word. The blank takes an infinitive + object (comprare i biglietti, prendere un taxi). |
| where_is~word_pharmacy | Where is the pharmacy? | Dov'è la farmacia? | doh-VEH lah far-mah-CHEE-ah |  |
| where_is~word_atm | Where is an ATM? | Dov'è il bancomat? | doh-VEH eel BAHN-koh-maht |  |
| where_is~word_supermarket | Where is the supermarket? | Dov'è il supermercato? | doh-VEH eel soo-pehr-mehr-KAH-toh |  |
| where_is~word_exit |  | Dov'è l'uscita? | doh-VEH loo-SHEE-tah |  |
| nearest~word_atm | Where is the nearest ATM? | Dov'è il bancomat più vicino? | doh-VEH eel BAHN-koh-maht pyoo vee-CHEE-noh |  |
| nearest~word_bus_stop | Where is the nearest bus stop? | Dov'è la fermata dell'autobus più vicina? | doh-VEH lah fehr-MAH-tah del-LOW-toh-boos pyoo vee-CHEE-nah |  |
| how_get~word_airport | How do I get to the airport? | Come arrivo all'aeroporto? | KOH-meh ar-REE-voh al-lah-eh-roh-POR-toh |  |
| how_get~word_train_station | How do I get to the train station? | Come arrivo alla stazione? | KOH-meh ar-REE-voh AHL-lah stah-TSYOH-neh |  |
| how_get~word_city_centre | How do I get to the city centre? | Come arrivo in centro? | KOH-meh ar-REE-voh een CHEN-troh |  |
| how_get~word_hotel | How do I get to the hotel? | Come arrivo all'hotel? | KOH-meh ar-REE-voh al-loh-TEL |  |
| can_i_have~word_tea | Can I have a tea, please? | Posso avere un tè, per favore? | POS-soh ah-VEH-reh oon teh, pehr fah-VOH-reh |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | Posso avere un bicchiere di vino, per favore? | POS-soh ah-VEH-reh oon beek-KYEH-reh dee VEE-noh, pehr fah-VOH-reh |  |
| can_i_have~word_orange_juice |  | Posso avere un succo d'arancia, per favore? | POS-soh ah-VEH-reh oon SOOK-koh dah-RAHN-chah, pehr fah-VOH-reh |  |
| can_i_have~word_menu | Can I have the menu, please? | Posso avere il menù, per favore? | POS-soh ah-VEH-reh eel meh-NOO, pehr fah-VOH-reh |  |
| can_i_have~word_receipt | Can I have a receipt, please? | Posso avere lo scontrino, per favore? | POS-soh ah-VEH-reh loh skon-TREE-noh, pehr fah-VOH-reh |  |
| i_would_like~word_tea | I'd like a tea, please. | Vorrei un tè, per favore. | vor-RAY oon teh, pehr fah-VOH-reh |  |
| i_would_like~word_beer | I'd like a beer, please. | Vorrei una birra, per favore. | vor-RAY OO-nah BEER-rah, pehr fah-VOH-reh |  |
| i_would_like~word_glass_of_wine |  | Vorrei un bicchiere di vino, per favore. | vor-RAY oon beek-KYEH-reh dee VEE-noh, pehr fah-VOH-reh |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | Vorrei un succo d'arancia, per favore. | vor-RAY oon SOOK-koh dah-RAHN-chah, pehr fah-VOH-reh |  |
| i_would_like~word_bread | I'd like some bread, please. | Vorrei del pane, per favore. | vor-RAY dehl PAH-neh, pehr fah-VOH-reh |  |
| i_would_like~word_water | I'd like some water, please. | Vorrei dell'acqua, per favore. | vor-RAY del-LAHK-kwah, pehr fah-VOH-reh |  |
| table_for~word_one | A table for one, please. | Un tavolo per una persona, per favore. | oon TAH-voh-loh pehr OO-nah pehr-SOH-nah, pehr fah-VOH-reh |  |
| table_for~word_three | A table for three, please. | Un tavolo per tre, per favore. | oon TAH-voh-loh pehr treh, pehr fah-VOH-reh |  |
| table_for~word_four | A table for four, please. | Un tavolo per quattro, per favore. | oon TAH-voh-loh pehr KWAHT-troh, pehr fah-VOH-reh |  |
| allergic_to~word_nuts | I'm allergic to nuts. | Sono allergico alla frutta a guscio. | SOH-noh al-LEHR-jee-koh AHL-lah FROOT-tah ah GOO-shoh | SAFETY: allergy/emergency. |
| allergic_to~word_shellfish | I'm allergic to shellfish. | Sono allergico ai frutti di mare. | SOH-noh al-LEHR-jee-koh ai FROOT-tee dee MAH-reh | SAFETY: allergy/emergency. |
| allergic_to~word_eggs |  | Sono allergico alle uova. | SOH-noh al-LEHR-jee-koh AHL-leh WOH-vah | SAFETY: allergy/emergency. |
| without~word_meat | Without meat, please. | Senza carne, per favore. | SEN-tsah KAR-neh, pehr fah-VOH-reh | SAFETY: allergy/emergency. |
| without~word_milk | Without milk, please. | Senza latte, per favore. | SEN-tsah LAHT-teh, pehr fah-VOH-reh | SAFETY: allergy/emergency. |
| without~word_gluten | Without gluten, please. | Senza glutine, per favore. | SEN-tsah GLOO-tee-neh, pehr fah-VOH-reh | SAFETY: allergy/emergency. |
| without~word_ice | Without ice, please. | Senza ghiaccio, per favore. | SEN-tsah GYAHCH-choh, pehr fah-VOH-reh | SAFETY: allergy/emergency. |
| without~word_nuts | Without nuts, please. | Senza frutta a guscio, per favore. | SEN-tsah FROOT-tah ah GOO-shoh, pehr fah-VOH-reh | SAFETY: allergy/emergency. |
| ticket_to~word_airport | A ticket to the airport, please. | Un biglietto per l'aeroporto, per favore. | oon bee-LYET-toh pehr lah-eh-roh-POR-toh, pehr fah-VOH-reh |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | Un biglietto per il centro, per favore. | oon bee-LYET-toh pehr eel CHEN-troh, pehr fah-VOH-reh |  |
| ticket_to~word_beach | A ticket to the beach, please. | Un biglietto per la spiaggia, per favore. | oon bee-LYET-toh pehr lah SPYAHJ-jah, pehr fah-VOH-reh |  |
| ticket_to~word_train_station | A ticket to the train station, please. | Un biglietto per la stazione, per favore. | oon bee-LYET-toh pehr lah stah-TSYOH-neh, pehr fah-VOH-reh |  |
| does_this_go_to~word_airport | Does this go to the airport? | Questo va all'aeroporto? | KWEH-stoh vah al-lah-eh-roh-POR-toh |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | Questo va in centro? | KWEH-stoh vah een CHEN-troh |  |
| does_this_go_to~word_beach | Does this go to the beach? | Questo va alla spiaggia? | KWEH-stoh vah AHL-lah SPYAHJ-jah |  |
| does_this_go_to~word_train_station | Does this go to the train station? | Questo va alla stazione? | KWEH-stoh vah AHL-lah stah-TSYOH-neh |  |
| take_me_to~word_airport | Take me to the airport, please. | Mi porti all'aeroporto, per favore. | mee POR-tee al-lah-eh-roh-POR-toh, pehr fah-VOH-reh |  |
| take_me_to~word_hotel | Take me to the hotel, please. | Mi porti all'hotel, per favore. | mee POR-tee al-loh-TEL, pehr fah-VOH-reh |  |
| take_me_to~word_train_station | Take me to the train station, please. | Mi porti alla stazione, per favore. | mee POR-tee AHL-lah stah-TSYOH-neh, pehr fah-VOH-reh |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | Mi porti in centro, per favore. | mee POR-tee een CHEN-troh, pehr fah-VOH-reh |  |
| take_me_to~word_beach | Take me to the beach, please. | Mi porti alla spiaggia, per favore. | mee POR-tee AHL-lah SPYAHJ-jah, pehr fah-VOH-reh |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | L'aria condizionata non funziona. | LAH-ryah kon-dee-tsyoh-NAH-tah non foon-TSYOH-nah |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | Il Wi-Fi non funziona. | eel WAI-fai non foon-TSYOH-nah |  |
| doesnt_work~word_tv | The TV doesn't work. | La TV non funziona. | lah tee-VOO non foon-TSYOH-nah |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | Non c'è acqua calda. | non cheh AH-kwah KAHL-dah |  |
| doesnt_work~word_door_lock |  | La serratura non funziona. | lah sehr-rah-TOO-rah non foon-TSYOH-nah |  |
| lost_my~word_passport | I lost my passport. | Ho perso il passaporto. | oh PEHR-soh eel pahs-sah-POR-toh | SAFETY: allergy/emergency. |
| lost_my~word_phone | I lost my phone. | Ho perso il telefono. | oh PEHR-soh eel teh-LEH-foh-noh | SAFETY: allergy/emergency. |
| lost_my~word_wallet | I lost my wallet. | Ho perso il portafoglio. | oh PEHR-soh eel por-tah-FOH-lyoh | SAFETY: allergy/emergency. |
| lost_my~word_bag |  | Ho perso la borsa. | oh PEHR-soh lah BOR-sah | SAFETY: allergy/emergency. |
| lost_my~word_room_key | I lost my room key. | Ho perso la chiave della camera. | oh PEHR-soh lah KYAH-veh DEL-lah KAH-meh-rah | SAFETY: allergy/emergency. |
| do_you_have~wifi | Do you have Wi-Fi? | Avete il Wi-Fi? | ah-VEH-teh eel WAI-fai |  |
| do_you_have~vegetarian_food | Do you have vegetarian food? | Avete piatti vegetariani? | ah-VEH-teh PYAHT-tee veh-jeh-tah-RYAH-nee | Literally 'Do you have vegetarian dishes?'. 'Avete qualcosa di vegetariano?' (anything vegetarian) is also very common. |
| do_you_have~charger | Do you have a phone charger? | Avete un caricabatterie per il telefono? | ah-VEH-teh oon kah-ree-kah-baht-TEH-ryeh pehr eel teh-LEH-foh-noh |  |
| do_you_have~map | Do you have a map? | Avete una cartina? | ah-VEH-teh OO-nah kar-TEE-nah | 'Cartina' is the usual word for a tourist/city map; 'una mappa' is also understood. |
| how_much_is~coffee | How much is a coffee? | Quanto costa un caffè? | KWAN-toh KOS-tah oon kahf-FEH |  |
| how_much_is~room | How much is the room? | Quanto costa la camera? | KWAN-toh KOS-tah lah KAH-meh-rah | Add 'a notte' (ah NOT-teh) for 'per night'. |
| i_need~help | I need help, please. | Ho bisogno di aiuto, per favore. | oh bee-ZOH-nyoh dee ah-YOO-toh, pehr fah-VOH-reh | SAFETY. Back-translation: 'I have need of help, please.' In an emergency the shout is just 'Aiuto!'. |
| i_need~water | I need water, please. | Ho bisogno di acqua, per favore. | oh bee-ZOH-nyoh dee AHK-kwah, pehr fah-VOH-reh | 'Ho bisogno d'acqua' (elided) is also common. |
| i_need~taxi | I need a taxi, please. | Ho bisogno di un taxi, per favore. | oh bee-ZOH-nyoh dee oon TAHK-see, pehr fah-VOH-reh | To ask someone to call one: 'Mi può chiamare un taxi?' (mee pwoh kyah-MAH-reh oon TAHK-see). |
| is_there_nearby~bathroom | Is there a bathroom nearby? | C'è un bagno qui vicino? | cheh oon BAH-nyoh kwee vee-CHEE-noh | For a public toilet specifically: 'un bagno pubblico'. In a bar/café, 'Dov'è il bagno?' is the normal question. |
| is_there_nearby~pharmacy | Is there a pharmacy nearby? | C'è una farmacia qui vicino? | cheh OO-nah far-mah-CHEE-ah kwee vee-CHEE-noh |  |
| is_there_nearby~supermarket | Is there a supermarket nearby? | C'è un supermercato qui vicino? | cheh oon soo-pehr-mehr-KAH-toh kwee vee-CHEE-noh |  |
| pay_with~cash | Can I pay with cash? | Posso pagare in contanti? | POS-soh pah-GAH-reh een kon-TAHN-tee |  |
| pay_with~phone | Can I pay with my phone? | Posso pagare con il telefono? | POS-soh pah-GAH-reh kon eel teh-LEH-foh-noh | 'col telefono' (contracted) is also common in speech. |
| can_you~write | Can you write it down, please? | Può scriverlo, per favore? | pwoh SKREE-vehr-loh, pehr fah-VOH-reh | 'Me lo può scrivere?' (meh loh pwoh SKREE-veh-reh) is equally natural. |
| like_without~coffee_milk | I'd like a coffee without milk. | Vorrei un caffè senza latte. | vor-RAY oon kahf-FEH SEN-tsah LAHT-teh | In Italy 'un caffè' is an espresso, which has no milk anyway; for a long black coffee ask for 'un caffè americano senza latte'. |
| like_without~tea_sugar | I'd like a tea without sugar. | Vorrei un tè senza zucchero. | vor-RAY oon teh SEN-tsah TSOOK-keh-roh |  |
| like_without~water_ice | I'd like water without ice. | Vorrei dell'acqua senza ghiaccio. | vor-RAY del-LAHK-kwah SEN-tsah GYAHT-choh |  |
| can_i_here~sit | Can I sit here? | Posso sedermi qui? | POS-soh seh-DEHR-mee kwee |  |
| can_i_here~photos | Can I take photos here? | Posso fare foto qui? | POS-soh FAH-reh FOH-toh kwee | 'fare delle foto' is also common. |
| can_i_here~charge | Can I charge my phone here? | Posso caricare il telefono qui? | POS-soh kah-ree-KAH-reh eel teh-LEH-foh-noh kwee |  |
| looking_for~my_hotel | I'm looking for my hotel. | Cerco il mio hotel. | CHEHR-koh eel MEE-oh oh-TEL | 'il mio albergo' (al-BEHR-goh) is also common. |
| looking_for~restaurant | I'm looking for a restaurant. | Cerco un ristorante. | CHEHR-koh oon ree-stoh-RAHN-teh |  |
| looking_for~exit | I'm looking for the exit. | Cerco l'uscita. | CHEHR-koh loo-SHEE-tah |  |
| is_included~tax | Is tax included? | Le tasse sono incluse? | leh TAHS-seh SOH-noh een-KLOO-zeh | Plural is the natural way to ask. At hotels the extra is usually the city tax: 'La tassa di soggiorno è inclusa?'. Shop prices already include IVA (VAT). |
| is_included~wifi | Is Wi-Fi included? | Il Wi-Fi è incluso? | eel WAI-fai eh een-KLOO-zoh |  |
| is_included~luggage | Is luggage included? | Il bagaglio è incluso? | eel bah-GAH-lyoh eh een-KLOO-zoh | For flights, checked luggage is 'il bagaglio da stiva'. |
| where_can_i~buy_tickets | Where can I buy tickets? | Dove posso comprare i biglietti? | DOH-veh POS-soh kom-PRAH-reh ee bee-LYET-tee |  |
| where_can_i~change_money | Where can I change money? | Dove posso cambiare i soldi? | DOH-veh POS-soh kahm-BYAH-reh ee SOL-dee | 'cambiare valuta' (currency) is also heard, especially on signs ('Cambio'). |
| where_can_i~sim | Where can I buy a SIM card? | Dove posso comprare una SIM? | DOH-veh POS-soh kom-PRAH-reh OO-nah seem |  |
| reply~for_here_or_to_go | For here or to go? | Qui o da portare via? | kwee oh dah por-TAH-reh VEE-ah | Said TO the traveller by staff. |
| reply~anything_else | Anything else? | Altro? | AHL-troh | Said TO the traveller by staff. |
| reply~here_you_go | Here you go. | Ecco a lei. | EK-koh ah lay | Said TO the traveller by staff. |
| reply~inside_or_outside | Inside or outside? | Dentro o fuori? | DEN-troh oh FWOH-ree | Said TO the traveller by staff. |
| reply~how_many_people | How many people? | Quanti siete? | KWAHN-tee SYEH-teh | Said TO the traveller by staff. |
| reply~next_stop | Next stop. | Prossima fermata. | PROS-see-mah fehr-MAH-tah | Said TO the traveller by staff. |
| reply~one_moment | One moment, please. | Un attimo, per favore. | oon AHT-tee-moh, pehr fah-VOH-reh | Said TO the traveller by staff. |
| reply~what_size | What size? | Che taglia? | keh TAH-lyah | Said TO the traveller by staff. |
| reply~receipt_question | Would you like a receipt? | Vuole lo scontrino? | VWOH-leh loh skon-TREE-noh | Said TO the traveller by staff. |
| reply~how_would_you_like_it | How would you like it cut? | Come li tagliamo? | KOH-meh lee tah-LYAH-moh | Said TO the traveller by staff. |
| word~word_train_station | train station | la stazione | lah stah-TSYOH-neh | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | la fermata dell'autobus | lah fehr-MAH-tah del-LOW-toh-boos | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | l'aeroporto | lah-eh-roh-POR-toh | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | la stazione della metro | lah stah-TSYOH-neh DEL-lah MEH-troh | A single word, as it would appear inside a sentence. |
| word~word_hotel | hotel | l'hotel | loh-TEL | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | la spiaggia | lah SPYAHJ-jah | A single word, as it would appear inside a sentence. |
| word~word_city_centre | city centre | il centro | eel CHEN-troh | A single word, as it would appear inside a sentence. |
| word~word_pharmacy | pharmacy | la farmacia | lah far-mah-CHEE-ah | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | il bancomat | eel BAHN-koh-maht | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | il supermercato | eel soo-pehr-mehr-KAH-toh | A single word, as it would appear inside a sentence. |
| word~word_platform | platform | il binario | eel bee-NAH-ryoh | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | la biglietteria | lah bee-lyet-teh-REE-ah | A single word, as it would appear inside a sentence. |
| word~word_exit | exit | l'uscita | loo-SHEE-tah | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | l'ingresso | leen-GRES-soh | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | un tè | oon teh | A single word, as it would appear inside a sentence. |
| word~word_beer | beer | una birra | OO-nah BEER-rah | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | un bicchiere di vino | oon beek-KYEH-reh dee VEE-noh | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | un succo d'arancia | oon SOOK-koh dah-RAHN-chah | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | il menù | eel meh-NOO | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | il conto | eel KON-toh | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | la borsa | lah BOR-sah | A single word, as it would appear inside a sentence. |
| word~word_receipt | receipt | lo scontrino | loh skon-TREE-noh | A single word, as it would appear inside a sentence. |
| word~word_water | water | l'acqua | LAHK-kwah | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | un caffè | oon kahf-FEH | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | il pane | eel PAH-neh | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | il latte | eel LAHT-teh | A single word, as it would appear inside a sentence. |
| word~word_ice | ice | il ghiaccio | eel GYAHCH-choh | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | la frutta a guscio | lah FROOT-tah ah GOO-shoh | A single word, as it would appear inside a sentence. |
| word~word_gluten | gluten | il glutine | eel GLOO-tee-neh | A single word, as it would appear inside a sentence. |
| word~word_shellfish | shellfish | i frutti di mare | ee FROOT-tee dee MAH-reh | A single word, as it would appear inside a sentence. |
| word~word_eggs | eggs | le uova | leh WOH-vah | A single word, as it would appear inside a sentence. |
| word~word_meat | meat | la carne | lah KAR-neh | A single word, as it would appear inside a sentence. |
| word~word_dairy | dairy | i latticini | ee lat-tee-CHEE-nee | A single word, as it would appear inside a sentence. |
| word~word_peanuts | peanuts | le arachidi | leh ah-RAH-kee-dee | A single word, as it would appear inside a sentence. |
| word~word_passport | passport | il passaporto | eel pahs-sah-POR-toh | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | il telefono | eel teh-LEH-foh-noh | A single word, as it would appear inside a sentence. |
| word~word_wallet | wallet | il portafoglio | eel por-tah-FOH-lyoh | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | le chiavi | leh KYAH-vee | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | il biglietto | eel bee-LYET-toh | A single word, as it would appear inside a sentence. |
| word~word_room_key | room key | la chiave della camera | lah KYAH-veh DEL-lah KAH-meh-rah | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | l'aria condizionata | LAH-ryah kon-dee-tsyoh-NAH-tah | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | la doccia | lah DOCH-chah | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | il Wi-Fi | eel WAI-fai | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | la TV | lah tee-VOO | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | l'acqua calda | LAHK-kwah KAHL-dah | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | la serratura | lah sehr-rah-TOO-rah | A single word, as it would appear inside a sentence. |
| word~word_one | one | uno | OO-noh | A single word, as it would appear inside a sentence. |
| word~word_two | two | due | DOO-eh | A single word, as it would appear inside a sentence. |
| word~word_three | three | tre | treh | A single word, as it would appear inside a sentence. |
| word~word_four | four | quattro | KWAHT-troh | A single word, as it would appear inside a sentence. |
| word~word_five | five | cinque | CHEEN-kweh | A single word, as it would appear inside a sentence. |
| word~word_six | six | sei | say | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | sette | SET-teh | A single word, as it would appear inside a sentence. |
| word~word_eight | eight | otto | OT-toh | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | nove | NOH-veh | A single word, as it would appear inside a sentence. |
| word~word_ten | ten | dieci | DYEH-chee | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | venti | VEN-tee | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | cinquanta | cheen-KWAHN-tah | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | cento | CHEN-toh | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | di sopra | dee SOH-prah | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | di sotto | dee SOT-toh | A single word, as it would appear inside a sentence. |
| word~word_near | near | vicino | vee-CHEE-noh | A single word, as it would appear inside a sentence. |
| word~word_far | far | lontano | lon-TAH-noh | A single word, as it would appear inside a sentence. |
| word~word_today | today | oggi | OJ-jee | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | domani | doh-MAH-nee | A single word, as it would appear inside a sentence. |
| word~word_now | now | adesso | ah-DES-soh | A single word, as it would appear inside a sentence. |
| word~word_later | later | più tardi | pyoo TAR-dee | A single word, as it would appear inside a sentence. |
| word~word_open | open | aperto | ah-PEHR-toh | A single word, as it would appear inside a sentence. |
| word~word_closed | closed | chiuso | KYOO-zoh | A single word, as it would appear inside a sentence. |
| word~word_yes | yes | sì | see | A single word, as it would appear inside a sentence. |
| word~word_no | no | no | noh | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | i contanti | ee kon-TAHN-tee | A single word, as it would appear inside a sentence. |
| word~word_card | card | la carta | lah KAR-tah | A single word, as it would appear inside a sentence. |
