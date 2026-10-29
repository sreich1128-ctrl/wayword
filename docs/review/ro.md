# Review sheet: Romanian (241 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/ro.<tool>.json` (for example `ro.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of Romanian (Romania) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- register: Natural Romanian for travellers in Romania. Polite forms are used with strangers and service staff; informal singular forms are used in social conversation.
- pronunciation: English-speaker respelling intended as a quick speaking scaffold, not IPA.
- orthography: Keep Romanian diacritics ă, â, î, ș and ț in target text.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 241 keys, in order, and nothing else after the code block.

| key | English | draft | pronunciation_easy | note |
|---|---|---|---|---|
| no_thank_you | No, thank you. | Nu, mulțumesc. | noo, mool-tsoo-MESK |  |
| table_for | A table for ___, please. | O masă pentru ___, vă rog. | oh MAH-suh PEN-troo ___, vuh rohg | Frame: ___ is filled with a word. Blank takes a number + persoane (feminine), so the number changes form: o persoană, două persoane (not doi). Colloquially people also say O masă pentru doi. |
| menu_please | The menu, please. | Meniul, vă rog. | meh-NEE-ool, vuh rohg |  |
| allergic_to | I'm allergic to ___. | Sunt alergic la ___. | soont ah-LER-jeek lah ___ | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Masculine speaker. Feminine: Sunt alergică la ___. Literal: 'I am allergic to ___.' Noun after la is used without the article (la nuci, la lapte). |
| vegetarian | I'm vegetarian. | Sunt vegetarian. | soont veh-jeh-tah-ree-AHN | Masculine speaker. Feminine: Sunt vegetariană (veh-jeh-tah-ree-AH-nuh). |
| without | Without ___, please. | Fără ___, vă rog. | FUH-ruh ___, vuh rohg | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Literal: 'Without ___, please.' Noun without article (fără carne, fără gheață). |
| to_go | To go, please. | La pachet, vă rog. | lah pah-KET, vuh rohg |  |
| for_here | For here, please. | Aici, vă rog. | ah-EETCH, vuh rohg | Answer to 'Aici sau la pachet?'. Fuller: Servesc aici ('I'll eat here'). Check which a reviewer finds most natural. |
| delicious | It was delicious. | A fost delicios. | ah fost deh-lee-chee-OHS | Delicios refers to the dish generically (masculine/neuter). About mâncarea or a feminine dish: A fost delicioasă. A fost foarte bun is also very common. |
| another_one | Another one, please. | Încă unul, vă rog. | IN-kuh OO-nool, vuh rohg | Depends on the item's gender: unul for masculine/neuter (un ceai, un suc), una for feminine (o bere, o cafea): Încă una, vă rog. |
| ticket_to | A ticket to ___, please. | Un bilet pentru ___, vă rog. | oon bee-LET PEN-troo ___, vuh rohg | Frame: ___ is filled with a word. Pentru + noun without article works for places and towns (pentru Brașov, pentru aeroport). Până la ___ is also common. |
| does_this_go_to | Does this go to ___? | Merge la ___? | MEHR-jeh lah ___ | Frame: ___ is filled with a word. Subject left implicit; can add Autobuzul ăsta / Trenul ăsta ('this bus/train'). The preposition changes for the city centre: Merge în centru? (not la). |
| take_me_to | Take me to ___, please. | Duceți-mă la ___, vă rog. | DOO-chets muh lah ___, vuh rohg | Frame: ___ is filled with a word. Polite imperative. Preposition changes for the city centre: Duceți-mă în centru. A softer alternative: Mă duceți la ___, vă rog? |
| stop_here | Stop here, please. | Opriți aici, vă rog. | oh-PREETS ah-EETCH, vuh rohg |  |
| next_departure | When does the next one leave? | Când pleacă următorul? | kuhnd PLYAH-kuh oor-muh-TOH-rool | Următorul fits masculine/neuter vehicles (tren, autobuz). For a feminine noun (cursa, the next run): Când pleacă următoarea? |
| which_platform | Which platform? | De la ce peron pleacă? | deh lah cheh peh-RON PLYAH-kuh | Literal: 'From which platform does it leave?' Romanian stations announce the track as linia, so De la ce linie pleacă? is equally common; reviewer may prefer it. |
| how_long_trip | How long does it take? | Cât durează drumul? | kuht doo-RYAH-zuh DROO-mool |  |
| one_way_or_return | One way or return? | Dus sau dus-întors? | doos sow doos-in-TORS |  |
| left | Left. | La stânga. | lah STUHN-gah | Direction (turn left/right), not "correct". |
| right | Right. | La dreapta. | lah DRYAHP-tah | Direction (turn left/right), not "correct". |
| straight_ahead | Straight ahead. | Drept înainte. | drept ih-nah-EEN-teh |  |
| show_on_map | Can you show me on the map? | Îmi puteți arăta pe hartă? | im poo-TETS ah-ruh-TAH peh HAR-tuh |  |
| near_here | Is it near here? | Este aproape de aici? | YES-teh ah-PRWAH-peh deh ah-EETCH |  |
| have_reservation | I have a reservation. | Am o rezervare. | ahm oh reh-zer-VAH-reh |  |
| under_name | Under the name ___. | Pe numele ___. | peh NOO-meh-leh ___ | Frame: ___ is filled with a word. |
| wifi_password | What's the Wi-Fi password? | Care este parola de la Wi-Fi? | KAH-reh YES-teh pah-ROH-lah deh lah WAI-fai |  |
| checkout_time | What time is checkout? | La ce oră este check-out-ul? | lah cheh OH-ruh YES-teh chek-OW-tool | Hotels use the English loan check-out. Without it: Până la ce oră trebuie să eliberez camera? ('By what time must I vacate the room?'). |
| leave_bags | Can I leave my bags here? | Pot să las bagajele aici? | poht suh lahs bah-GAH-zheh-leh ah-EETCH |  |
| doesnt_work | The ___ doesn't work. | ___ nu funcționează. | ___ noo foonk-tsyoh-NYAH-zuh | Frame: ___ is filled with a word. Blank takes the noun with its definite article (Dușul, Aerul condiționat). Colloquially nu merge. For hot water the natural sentence is different: Nu este apă caldă ('There is no hot water'). |
| another_towel | Can I have another towel? | Pot să mai primesc un prosop? | poht suh my pree-MESK oon proh-SOP |  |
| just_looking | I'm just looking. | Doar mă uit. | dwar muh ooyt |  |
| ill_take_it | I'll take it. | Îl iau. | il yow | Depends on the item's gender: Îl iau for masculine/neuter (pantoful, tricoul), O iau for feminine (rochia, geanta). |
| too_expensive | It's too expensive. | Este prea scump. | YES-teh pryah skoomp | Adjective agrees with the item: scump (masculine/neuter), scumpă (feminine), scumpe (plural). |
| try_it_on | Can I try it on? | Pot să probez? | poht suh proh-BEZ | Object left out so it fits any item; with an object: Pot să-l probez? / Pot s-o probez? |
| another_size | Do you have it in another size? | Aveți și altă mărime? | ah-VETS shee AL-tuh muh-REE-meh |  |
| bag_please | A bag, please. | O pungă, vă rog. | oh POON-guh, vuh rohg | Pungă is a plastic/paper shop bag; a sturdier reusable bag is sacoșă. |
| haircut | A haircut, please. | Un tuns, vă rog. | oon toons, vuh rohg | Fuller and very natural: Aș vrea să mă tund ('I'd like to get my hair cut'). |
| just_trim | Just a trim. | Doar puțin scurtat, vă rog. | dwar poo-TSEEN skoor-TAHT, vuh rohg | Unsure of the most natural barber phrasing. Literal: 'Just a little shortened, please.' Alternatives: Doar vârfurile ('just the ends'), Doar să le aranjați puțin. |
| not_too_short | Not too short. | Nu prea scurt. | noo pryah skoort |  |
| shorter_sides | Shorter on the sides. | Mai scurt pe laterale. | my skoort peh lah-teh-RAH-leh | Barbers also say pe lateral ('on the sides'); reviewer may prefer it. [Fixed 2026-10-14 per ChatGPT review.] |
| like_this | Like this. | Așa. | ah-SHAH | Literal: 'Like in this photo.' Said while showing the photo; Uite, așa ('Look, like this') also works. [Fixed 2026-10-14 per ChatGPT review.] |
| beard_trim | A beard trim, please. | Aranjați-mi barba, vă rog. | ah-ran-ZHAHTS-mee BAR-bah, vuh rohg | Literal: 'Tidy my beard, please.' Check this is the usual barber phrasing. |
| need_doctor | I need a doctor. | Am nevoie de un doctor. | ahm neh-VOH-yeh deh oon DOK-tor | SAFETY: allergy/emergency. Literal: 'I have need of a doctor.' Medic is also common: Am nevoie de un medic. |
| where_pharmacy | Where is the pharmacy? | Unde este farmacia? | OON-deh YES-teh far-mah-CHEE-ah | SAFETY: allergy/emergency. Literal: 'Where is the pharmacy?' For the closest: Unde este cea mai apropiată farmacie? |
| its_emergency | It's an emergency. | Este o urgență. | YES-teh oh oor-JEN-tsuh | SAFETY: allergy/emergency. Literal: 'It is an emergency.' |
| lost_my | I lost my ___. | Mi-am pierdut ___. | myahm pyer-DOOT ___ | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Literal: 'I have lost (to myself) ___.' Blank takes the noun with its definite article (pașaportul, cheile); no possessive needed. If stolen: Mi s-a furat ___. |
| call_someone | I need to call someone. | Trebuie să sun pe cineva. | TREH-boo-yeh suh soon peh chee-neh-VAH | SAFETY: allergy/emergency. Literal: 'I must call someone.' Alternative: Am nevoie să sun pe cineva ('I need to call someone'). |
| do_you_have | Do you have ___? | Aveți ___? | ah-VETS ___ | Frame: ___ is filled with a word. Blank takes a mass noun bare (Aveți apă?) or a countable noun with un/o (Aveți o hartă?, Aveți un încărcător?). |
| how_much_is | How much is ___? | Cât costă ___? | kuht KOS-tuh ___ | Frame: ___ is filled with a word. Blank takes un/o for 'a' (un bilet, o cafea) or the definite article for 'the' (camera). Costă is the same for singular and plural (Cât costă biletele?). |
| i_need | I need ___, please. | Am nevoie de ___, vă rog. | ahm neh-VOH-yeh deh ___, vuh rohg | Frame: ___ is filled with a word. Safety phrase. Literal: 'I have need of ___, please.' After de the noun is bare (de ajutor, de apă) or with un/o (de un taxi, de un doctor). Gender-neutral. The doctor variant reuses need_doctor (Am nevoie de un doctor = 'I have need of a doctor'); in a real emergency the number is 112. |
| is_there_nearby | Is there a ___ nearby? | Este ___ pe aproape? | YES-teh ___ peh ah-PRWAH-peh | Frame: ___ is filled with a word. Blank takes vreun (masculine/neuter) or vreo (feminine) + noun, i.e. 'any': vreun bancomat, vreo farmacie. Un/o also works. Pe aici ('around here') is an equally common ending. |
| pay_with | Can I pay with ___? | Pot plăti cu ___? | poht pluh-TEE koo ___ | Frame: ___ is filled with a word. Matches pay_card. Blank takes the noun with its definite article (cu cardul, cu telefonul). Cash is different: Pot plăti cash? (no cu); formal: în numerar. |
| can_you | Can you ___, please? | Puteți ___, vă rog? | poo-TETS ___, vuh rohg | Frame: ___ is filled with a word. Blank takes a verb: bare infinitive (vorbi mai rar) or să + subjunctive (să repetați). Object pronouns go before puteți (Mă puteți ajuta?) or attach to să (să-mi scrieți). |
| like_without | I'd like ___ without ___. | Aș dori ___ fără ___. | ash doh-REE ___ FUH-ruh ___ | Frame: ___ is filled with a word. First blank takes un/o + noun (o cafea, un ceai) or a bare mass noun (apă); after fără the noun is bare (fără lapte). Gender-neutral. |
| can_i_here | Can I ___ here? | Pot să ___ aici? | poht suh ___ ah-EETCH | Frame: ___ is filled with a word. Blank takes a first-person verb in the subjunctive (să parchez, să fac poze). Reflexive/object pronouns attach to să (să-mi încarc). |
| looking_for | I'm looking for ___. | Caut ___. | KAH-oot ___ | Frame: ___ is filled with a word. Blank takes the noun with its definite article (intrarea, hotelul meu) or with un/o (un restaurant). For a person add pe: Caut pe cineva. |
| is_included | Is ___ included? | ___ este inclus? | ___ YES-teh een-KLOOS | Frame: ___ is filled with a word. Matches tip_included. Blank takes the noun with its definite article. Inclus agrees: inclus (masculine/neuter), inclusă (feminine), incluse / sunt incluse (plural). |
| where_can_i | Where can I ___? | Unde pot să ___? | OON-deh poht suh ___ | Frame: ___ is filled with a word. Blank takes a first-person subjunctive verb (să cumpăr, să schimb). Bare infinitive also works: Unde pot cumpăra bilete? |
| where_is~word_pharmacy | Where is the pharmacy? | Unde este farmacia? | OON-deh YES-teh far-mah-CHEE-ah |  |
| where_is~word_atm | Where is an ATM? | Unde este un bancomat? | OON-deh YES-teh oon ban-koh-MAHT |  |
| where_is~word_supermarket | Where is the supermarket? | Unde este un supermarket? | OON-deh YES-teh oon soo-per-MAR-ket |  |
| where_is~word_exit |  | Unde este ieșirea? | OON-deh YES-teh yeh-SHEE-ryah |  |
| nearest~word_pharmacy | Where is the nearest pharmacy? | Unde este cea mai apropiată farmacie? | OON-deh YES-teh chah my ah-proh-pee-AH-tuh far-mah-CHEE-eh |  |
| nearest~word_atm | Where is the nearest ATM? | Unde este cel mai apropiat bancomat? | OON-deh YES-teh chel my ah-proh-pee-AHT ban-koh-MAHT |  |
| nearest~word_supermarket | Where is the nearest supermarket? | Unde este cel mai apropiat supermarket? | OON-deh YES-teh chel my ah-proh-pee-AHT soo-per-MAR-ket |  |
| nearest~word_metro_station | Where is the nearest metro station? | Unde este cea mai apropiată stație de metrou? | OON-deh YES-teh chah my ah-proh-pee-AH-tuh STAH-tsyeh deh meh-TROW |  |
| nearest~word_bus_stop | Where is the nearest bus stop? | Unde este cea mai apropiată stație de autobuz? | OON-deh YES-teh chah my ah-proh-pee-AH-tuh STAH-tsyeh deh ow-toh-BOOZ |  |
| how_get~word_airport | How do I get to the airport? | Cum ajung la aeroport? | koom ah-ZHOONG lah ah-eh-roh-PORT |  |
| how_get~word_train_station | How do I get to the train station? | Cum ajung la gară? | koom ah-ZHOONG lah GAH-ruh |  |
| how_get~word_city_centre | How do I get to the city centre? | Cum ajung în centru? | koom ah-ZHOONG in CHEN-troo |  |
| how_get~word_hotel | How do I get to the hotel? | Cum ajung la hotel? | koom ah-ZHOONG lah hoh-TEL |  |
| can_i_have~word_tea | Can I have a tea, please? | Pot să primesc un ceai, vă rog? | poht suh pree-MESK oon chye, vuh rohg |  |
| can_i_have~word_beer | Can I have a beer, please? | Pot să primesc o bere, vă rog? | poht suh pree-MESK oh BEH-reh, vuh rohg |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | Pot să primesc un pahar de vin, vă rog? | poht suh pree-MESK oon pah-HAR deh veen, vuh rohg |  |
| can_i_have~word_orange_juice |  | Pot să primesc un suc de portocale, vă rog? | poht suh pree-MESK oon sook deh por-toh-KAH-leh, vuh rohg |  |
| can_i_have~word_menu | Can I have the menu, please? | Pot să primesc meniul, vă rog? | poht suh pree-MESK meh-NEE-ool, vuh rohg |  |
| can_i_have~word_receipt | Can I have a receipt, please? | Pot să primesc bonul, vă rog? | poht suh pree-MESK BOH-nool, vuh rohg |  |
| i_would_like~word_tea | I'd like a tea, please. | Aș dori un ceai, vă rog. | ash doh-REE oon chye, vuh rohg |  |
| i_would_like~word_beer | I'd like a beer, please. | Aș dori o bere, vă rog. | ash doh-REE oh BEH-reh, vuh rohg |  |
| i_would_like~word_glass_of_wine |  | Aș dori un pahar de vin, vă rog. | ash doh-REE oon pah-HAR deh veen, vuh rohg |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | Aș dori un suc de portocale, vă rog. | ash doh-REE oon sook deh por-toh-KAH-leh, vuh rohg |  |
| i_would_like~word_bread | I'd like some bread, please. | Aș dori niște pâine, vă rog. | ash doh-REE NEESH-teh PUY-neh, vuh rohg |  |
| i_would_like~word_water | I'd like some water, please. | Aș dori apă, vă rog. | ash doh-REE AH-puh, vuh rohg |  |
| table_for~word_one | A table for one, please. | O masă pentru o persoană, vă rog. | oh MAH-suh PEN-troo oh per-SWAH-nuh, vuh rohg |  |
| table_for~word_two | A table for two, please. | O masă pentru două persoane, vă rog. | oh MAH-suh PEN-troo DOH-wuh per-SWAH-neh, vuh rohg |  |
| table_for~word_three | A table for three, please. | O masă pentru trei persoane, vă rog. | oh MAH-suh PEN-troo tray per-SWAH-neh, vuh rohg |  |
| table_for~word_four | A table for four, please. | O masă pentru patru persoane, vă rog. | oh MAH-suh PEN-troo PAH-troo per-SWAH-neh, vuh rohg |  |
| allergic_to~word_nuts | I'm allergic to nuts. | Sunt alergic la fructe cu coajă lemnoasă. | soont ah-LER-jeek lah FROOK-teh koo KWAH-zhuh lem-NWAH-suh | SAFETY: allergy/emergency. |
| allergic_to~word_peanuts | I'm allergic to peanuts. | Sunt alergic la arahide. | soont ah-LER-jeek lah ah-rah-HEE-deh | SAFETY: allergy/emergency. |
| allergic_to~word_gluten | I'm allergic to gluten. | Sunt alergic la gluten. | soont ah-LER-jeek lah GLOO-ten | SAFETY: allergy/emergency. |
| allergic_to~word_shellfish | I'm allergic to shellfish. | Sunt alergic la fructe de mare. | soont ah-LER-jeek lah FROOK-teh deh MAH-reh | SAFETY: allergy/emergency. |
| allergic_to~word_milk | I'm allergic to milk. | Sunt alergic la lapte. | soont ah-LER-jeek lah LAHP-teh | SAFETY: allergy/emergency. |
| allergic_to~word_eggs |  | Sunt alergic la ouă. | soont ah-LER-jeek lah OH-wuh | SAFETY: allergy/emergency. |
| without~word_meat | Without meat, please. | Fără carne, vă rog. | FUH-ruh KAR-neh, vuh rohg | SAFETY: allergy/emergency. |
| without~word_milk | Without milk, please. | Fără lapte, vă rog. | FUH-ruh LAHP-teh, vuh rohg | SAFETY: allergy/emergency. |
| without~word_gluten | Without gluten, please. | Fără gluten, vă rog. | FUH-ruh GLOO-ten, vuh rohg | SAFETY: allergy/emergency. |
| without~word_ice | Without ice, please. | Fără gheață, vă rog. | FUH-ruh GYAH-tsuh, vuh rohg | SAFETY: allergy/emergency. |
| without~word_nuts | Without nuts, please. | Fără fructe cu coajă lemnoasă, vă rog. | FUH-ruh FROOK-teh koo KWAH-zhuh lem-NWAH-suh, vuh rohg | SAFETY: allergy/emergency. |
| ticket_to~word_airport | A ticket to the airport, please. | Un bilet pentru aeroport, vă rog. | oon bee-LET PEN-troo ah-eh-roh-PORT, vuh rohg |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | Un bilet pentru centru, vă rog. | oon bee-LET PEN-troo CHEN-troo, vuh rohg |  |
| ticket_to~word_beach | A ticket to the beach, please. | Un bilet pentru plajă, vă rog. | oon bee-LET PEN-troo PLAH-zhuh, vuh rohg |  |
| ticket_to~word_train_station | A ticket to the train station, please. | Un bilet pentru gară, vă rog. | oon bee-LET PEN-troo GAH-ruh, vuh rohg |  |
| does_this_go_to~word_airport | Does this go to the airport? | Merge la aeroport? | MEHR-jeh lah ah-eh-roh-PORT |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | Merge în centru? | MEHR-jeh in CHEN-troo |  |
| does_this_go_to~word_beach | Does this go to the beach? | Merge la plajă? | MEHR-jeh lah PLAH-zhuh |  |
| does_this_go_to~word_train_station | Does this go to the train station? | Merge la gară? | MEHR-jeh lah GAH-ruh |  |
| take_me_to~word_airport | Take me to the airport, please. | Duceți-mă la aeroport, vă rog. | DOO-chets muh lah ah-eh-roh-PORT, vuh rohg |  |
| take_me_to~word_hotel | Take me to the hotel, please. | Duceți-mă la hotel, vă rog. | DOO-chets muh lah hoh-TEL, vuh rohg |  |
| take_me_to~word_train_station | Take me to the train station, please. | Duceți-mă la gară, vă rog. | DOO-chets muh lah GAH-ruh, vuh rohg |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | Duceți-mă în centru, vă rog. | DOO-chets muh in CHEN-troo, vuh rohg |  |
| take_me_to~word_beach | Take me to the beach, please. | Duceți-mă la plajă, vă rog. | DOO-chets muh lah PLAH-zhuh, vuh rohg |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | Aerul condiționat nu funcționează. | AH-eh-rool kon-dee-tsyoh-NAHT noo foonk-tsyoh-NYAH-zuh |  |
| doesnt_work~word_shower | The shower doesn't work. | Dușul nu funcționează. | DOO-shool noo foonk-tsyoh-NYAH-zuh |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | Wi-Fi-ul nu funcționează. | WAI-fai-ool noo foonk-tsyoh-NYAH-zuh |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | Nu este apă caldă. | noo YES-teh AH-puh KAL-duh |  |
| doesnt_work~word_door_lock |  | Încuietoarea nu funcționează. | in-koo-yeh-TWAH-ryah noo foonk-tsyoh-NYAH-zuh |  |
| lost_my~word_passport | I lost my passport. | Mi-am pierdut pașaportul. | myahm pyer-DOOT pah-shah-POR-tool | SAFETY: allergy/emergency. |
| lost_my~word_phone | I lost my phone. | Mi-am pierdut telefonul. | myahm pyer-DOOT teh-leh-FOH-nool | SAFETY: allergy/emergency. |
| lost_my~word_bag |  | Mi-am pierdut geanta. | myahm pyer-DOOT JAHN-tah | SAFETY: allergy/emergency. |
| lost_my~word_keys | I lost my keys. | Mi-am pierdut cheile. | myahm pyer-DOOT KAY-leh | SAFETY: allergy/emergency. |
| lost_my~word_room_key | I lost my room key. | Mi-am pierdut cheia de la cameră. | myahm pyer-DOOT KAY-ah deh lah KAH-meh-ruh | SAFETY: allergy/emergency. |
| do_you_have~wifi | Do you have Wi-Fi? | Aveți Wi-Fi? | ah-VETS WAI-fai | Said as in English (wai-fai); some say wee-fee. |
| do_you_have~vegetarian_food | Do you have vegetarian food? | Aveți mâncare vegetariană? | ah-VETS muhn-KAH-reh veh-jeh-tah-ree-AH-nuh | In a restaurant also: Aveți preparate vegetariene? ('vegetarian dishes'). |
| do_you_have~charger | Do you have a phone charger? | Aveți un încărcător de telefon? | ah-VETS oon in-kuhr-kuh-TOR deh teh-leh-FON |  |
| do_you_have~map | Do you have a map? | Aveți o hartă? | ah-VETS oh HAR-tuh |  |
| how_much_is~ticket | How much is a ticket? | Cât costă un bilet? | kuht KOS-tuh oon bee-LET |  |
| how_much_is~coffee | How much is a coffee? | Cât costă o cafea? | kuht KOS-tuh oh kah-FYAH |  |
| how_much_is~room | How much is the room? | Cât costă camera? | kuht KOS-tuh KAH-meh-rah | Per night: Cât costă camera pe noapte? |
| i_need~help | I need help, please. | Am nevoie de ajutor, vă rog. | ahm neh-VOH-yeh deh ah-zhoo-TOR, vuh rohg | Safety. Literal: 'I have need of help, please.' Natural and clear; urgently people shout Ajutor! or ask Mă puteți ajuta? |
| i_need~water | I need water, please. | Am nevoie de apă, vă rog. | ahm neh-VOH-yeh deh AH-puh, vuh rohg |  |
| i_need~taxi | I need a taxi, please. | Am nevoie de un taxi, vă rog. | ahm neh-VOH-yeh deh oon tak-SEE, vuh rohg | To ask someone to call one: Îmi puteți chema un taxi? |
| is_there_nearby~bathroom | Is there a bathroom nearby? | Este vreo toaletă pe aproape? | YES-teh vryoh toh-ah-LEH-tuh peh ah-PRWAH-peh | Toaletă is the neutral word; signs often say WC. |
| is_there_nearby~pharmacy | Is there a pharmacy nearby? | Este vreo farmacie pe aproape? | YES-teh vryoh far-mah-CHEE-eh peh ah-PRWAH-peh |  |
| is_there_nearby~atm | Is there an ATM nearby? | Este vreun bancomat pe aproape? | YES-teh vryoon ban-koh-MAHT peh ah-PRWAH-peh |  |
| is_there_nearby~supermarket | Is there a supermarket nearby? | Este vreun supermarket pe aproape? | YES-teh vryoon soo-per-MAR-ket peh ah-PRWAH-peh |  |
| pay_with~cash | Can I pay with cash? | Pot plăti cash? | poht pluh-TEE kesh | Cash (said kesh) is the everyday word, with no cu. Formal: Pot plăti în numerar? |
| pay_with~phone | Can I pay with my phone? | Pot plăti cu telefonul? | poht pluh-TEE koo teh-leh-FOH-nool |  |
| can_you~write | Can you write it down, please? | Puteți să-mi scrieți, vă rog? | poo-TETS suh-mee SKREE-ets, vuh rohg | Literal: 'Can you write (it) for me, please?' Object left out so it fits any thing (price, address); unsure if a reviewer prefers Mi-l puteți scrie? / Puteți să-mi scrieți asta? |
| like_without~coffee_milk | I'd like a coffee without milk. | Aș dori o cafea fără lapte. | ash doh-REE oh kah-FYAH FUH-ruh LAHP-teh |  |
| like_without~tea_sugar | I'd like a tea without sugar. | Aș dori un ceai fără zahăr. | ash doh-REE oon chye FUH-ruh ZAH-huhr |  |
| like_without~water_ice | I'd like water without ice. | Aș dori apă fără gheață. | ash doh-REE AH-puh FUH-ruh GYAH-tsuh | For a bottle: o apă; you may be asked plată sau minerală? (still or sparkling). |
| can_i_here~sit | Can I sit here? | Pot să stau aici? | poht suh stow ah-EETCH | For a free seat, E liber? ('Is it free?') is the most common question. |
| can_i_here~park | Can I park here? | Pot să parchez aici? | poht suh par-KEZ ah-EETCH |  |
| can_i_here~photos | Can I take photos here? | Pot să fac poze aici? | poht suh fahk POH-zeh ah-EETCH | Poze is everyday; formal signs say fotografii. |
| can_i_here~charge | Can I charge my phone here? | Pot să-mi încarc telefonul aici? | poht suh-mee in-KARK teh-leh-FOH-nool ah-EETCH |  |
| looking_for~my_hotel | I'm looking for my hotel. | Caut hotelul meu. | KAH-oot hoh-TEH-lool mehw |  |
| looking_for~entrance | I'm looking for the entrance. | Caut intrarea. | KAH-oot een-TRAH-ryah |  |
| looking_for~restaurant | I'm looking for a restaurant. | Caut un restaurant. | KAH-oot oon res-tow-RANT |  |
| looking_for~exit | I'm looking for the exit. | Caut ieșirea. | KAH-oot yeh-SHEE-ryah |  |
| is_included~tax | Is tax included? | TVA-ul este inclus? | teh-veh-AH-ool YES-teh een-KLOOS | TVA is VAT, normally already in Romanian prices. For hotel/city taxes ask Taxele sunt incluse? Reviewer may prefer that. |
| is_included~wifi | Is Wi-Fi included? | Wi-Fi-ul este inclus? | WAI-fai-ool YES-teh een-KLOOS |  |
| is_included~luggage | Is luggage included? | Bagajul este inclus? | bah-GAH-zhool YES-teh een-KLOOS | For flights, checked luggage is bagajul de cală. |
| where_can_i~buy_tickets | Where can I buy tickets? | Unde pot să cumpăr bilete? | OON-deh poht suh KOOM-puhr bee-LEH-teh |  |
| where_can_i~taxi | Where can I get a taxi? | Unde pot să găsesc un taxi? | OON-deh poht suh guh-SESK oon tak-SEE | Literal: 'Where can I find a taxi?' (Romanian uses găsi, not 'get'). |
| where_can_i~change_money | Where can I change money? | Unde pot să schimb bani? | OON-deh poht suh skeemb bahn | An exchange office is a casă de schimb (valutar). |
| where_can_i~sim | Where can I buy a SIM card? | Unde pot să cumpăr o cartelă SIM? | OON-deh poht suh KOOM-puhr oh kar-TEH-luh seem |  |
| reply~for_here_or_to_go | For here or to go? | Aici sau la pachet? | ah-EETCH sow lah pah-KET | Said TO the traveller by staff. |
| reply~anything_else | Anything else? | Mai doriți ceva? | my doh-REETS cheh-VAH | Said TO the traveller by staff. |
| reply~here_you_go | Here you go. | Poftiți. | pof-TEETS | Said TO the traveller by staff. |
| reply~inside_or_outside | Inside or outside? | Înăuntru sau afară? | in-uh-OON-troo sow ah-FAH-ruh | Said TO the traveller by staff. Staff often say pe terasă ('on the terrace') for outside. |
| reply~how_many_people | How many people? | Pentru câte persoane? | PEN-troo KUH-teh per-SWAH-neh | Said TO the traveller by staff. |
| reply~have_booking | Do you have a reservation? | Aveți rezervare? | ah-VETS reh-zer-VAH-reh | Said TO the traveller by staff. |
| reply~next_stop | Next stop. | Următoarea stație. | oor-muh-TWAH-ryah STAH-tsyeh | Said TO the traveller by staff. |
| reply~its_closed | It's closed. | Este închis. | YES-teh in-KEES | Said TO the traveller by staff. |
| reply~one_moment | One moment, please. | Un moment, vă rog. | oon moh-MENT, vuh rohg | Said TO the traveller by staff. |
| reply~what_size | What size? | Ce mărime purtați? | cheh muh-REE-meh poor-TAHTS | Said TO the traveller by staff. |
| reply~receipt_question | Would you like a receipt? | Doriți bonul? | doh-REETS BOH-nool | Said TO the traveller by staff. |
| reply~how_would_you_like_it | How would you like it cut? | Cum doriți să vă tund? | koom doh-REETS suh vuh toond | Said TO the traveller by staff. |
| word~word_train_station | train station | gara | GAH-rah | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | stația de autobuz | STAH-tsyah deh ow-toh-BOOZ | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | aeroportul | ah-eh-roh-POR-tool | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | stația de metrou | STAH-tsyah deh meh-TROW | A single word, as it would appear inside a sentence. |
| word~word_hotel | hotel | hotelul | hoh-TEH-lool | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | plaja | PLAH-zhah | A single word, as it would appear inside a sentence. |
| word~word_city_centre | city centre | centrul orașului | CHEN-trool oh-RAH-shoo-looy | A single word, as it would appear inside a sentence. |
| word~word_pharmacy | pharmacy | farmacia | far-mah-CHEE-ah | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | bancomatul | ban-koh-MAH-tool | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | supermarketul | soo-per-MAR-keh-tool | A single word, as it would appear inside a sentence. |
| word~word_platform | platform | peronul | peh-ROH-nool | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | casa de bilete | KAH-sah deh bee-LEH-teh | A single word, as it would appear inside a sentence. |
| word~word_exit | exit | ieșirea | yeh-SHEE-ryah | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | intrarea | een-TRAH-ryah | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | un ceai | oon chye | A single word, as it would appear inside a sentence. |
| word~word_beer | beer | o bere | oh BEH-reh | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | un pahar de vin | oon pah-HAR deh veen | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | un suc de portocale | oon sook deh por-toh-KAH-leh | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | meniul | meh-NEE-ool | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | nota | NOH-tah | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | geanta | JAHN-tah | A single word, as it would appear inside a sentence. Geanta is a handbag/bag you carry (fits 'I lost my bag'). A shop bag is punga; a backpack is rucsacul. |
| word~word_receipt | receipt | bonul | BOH-nool | A single word, as it would appear inside a sentence. Bonul (fiscal) is the till receipt; chitanța is a handwritten/formal receipt. |
| word~word_water | water | apă | AH-puh | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | o cafea | oh kah-FYAH | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | pâine | PUY-neh | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | lapte | LAHP-teh | A single word, as it would appear inside a sentence. Literal: 'milk'. Allergen word; used without article after la / fără. |
| word~word_ice | ice | gheață | GYAH-tsuh | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | fructe cu coajă lemnoasă | FROOK-teh koo KWAH-zhuh lem-NWAH-suh | A single word, as it would appear inside a sentence. Review edit: the allergen-label term for tree nuts. "Nuci" usually means walnuts only. |
| word~word_gluten | gluten | gluten | GLOO-ten | A single word, as it would appear inside a sentence. Literal: 'gluten'. Same word as English. |
| word~word_shellfish | shellfish | fructe de mare | FROOK-teh deh MAH-reh | A single word, as it would appear inside a sentence. Literal: 'fruits of the sea' = seafood (shellfish, crustaceans, molluscs; usually not fish). Narrower: crustacee (crustaceans), moluște (molluscs). |
| word~word_eggs | eggs | ouă | OH-wuh | A single word, as it would appear inside a sentence. Literal: 'eggs'. |
| word~word_meat | meat | carne | KAR-neh | A single word, as it would appear inside a sentence. Literal: 'meat'. Some people don't count chicken or fish as carne; for strict vegetarian needs, also say fără pui, fără pește. |
| word~word_dairy | dairy | lactate | lak-TAH-teh | A single word, as it would appear inside a sentence. Literal: 'dairy products'. |
| word~word_peanuts | peanuts | arahide | ah-rah-HEE-deh | A single word, as it would appear inside a sentence. Literal: 'peanuts'. Kept separate from nuci. |
| word~word_passport | passport | pașaportul | pah-shah-POR-tool | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | telefonul | teh-leh-FOH-nool | A single word, as it would appear inside a sentence. |
| word~word_wallet | wallet | portofelul | por-toh-FEH-lool | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | cheile | KAY-leh | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | biletul | bee-LEH-tool | A single word, as it would appear inside a sentence. |
| word~word_room_key | room key | cheia de la cameră | KAY-ah deh lah KAH-meh-ruh | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | aerul condiționat | AH-eh-rool kon-dee-tsyoh-NAHT | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | dușul | DOO-shool | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | Wi-Fi-ul | WAI-fai-ool | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | televizorul | teh-leh-vee-ZOH-rool | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | apa caldă | AH-pah KAL-duh | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | încuietoarea | in-koo-yeh-TWAH-ryah | A single word, as it would appear inside a sentence. |
| word~word_one | one | unu | OO-noo | A single word, as it would appear inside a sentence. |
| word~word_two | two | doi | doy | A single word, as it would appear inside a sentence. |
| word~word_three | three | trei | tray | A single word, as it would appear inside a sentence. |
| word~word_four | four | patru | PAH-troo | A single word, as it would appear inside a sentence. |
| word~word_five | five | cinci | cheench | A single word, as it would appear inside a sentence. |
| word~word_six | six | șase | SHAH-seh | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | șapte | SHAHP-teh | A single word, as it would appear inside a sentence. |
| word~word_eight | eight | opt | opt | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | nouă | NOH-wuh | A single word, as it would appear inside a sentence. |
| word~word_ten | ten | zece | ZEH-cheh | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | douăzeci | doh-wuh-ZECH | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | cincizeci | cheench-ZECH | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | o sută | oh SOO-tuh | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | sus | soos | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | jos | zhos | A single word, as it would appear inside a sentence. |
| word~word_near | near | aproape | ah-PRWAH-peh | A single word, as it would appear inside a sentence. |
| word~word_far | far | departe | deh-PAR-teh | A single word, as it would appear inside a sentence. |
| word~word_today | today | azi | ahz | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | mâine | MUY-neh | A single word, as it would appear inside a sentence. |
| word~word_now | now | acum | ah-KOOM | A single word, as it would appear inside a sentence. |
| word~word_later | later | mai târziu | my tuhr-ZEEW | A single word, as it would appear inside a sentence. |
| word~word_open | open | deschis | des-KEES | A single word, as it would appear inside a sentence. |
| word~word_closed | closed | închis | in-KEES | A single word, as it would appear inside a sentence. |
| word~word_yes | yes | da | dah | A single word, as it would appear inside a sentence. |
| word~word_no | no | nu | noo | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | numerar | noo-meh-RAR | A single word, as it would appear inside a sentence. |
| word~word_card | card | card | kard | A single word, as it would appear inside a sentence. |
