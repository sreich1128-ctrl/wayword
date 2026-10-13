# Review sheet: Hebrew (190 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/he.<tool>.json` (for example `he.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of Hebrew (Israel) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- register: Modern conversational Israeli Hebrew.
- gender: v1 uses masculine singular forms for Steven's own speech and many direct-address examples. The UI/data model should later support feminine addressee variants.
- pronunciation: Easy learner pronunciation, not IPA.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 190 keys, in order, and nothing else after the code block.

| key | English | draft | pronunciation_easy | note |
|---|---|---|---|---|
| table_for | A table for ___, please. | שולחן ל___, בבקשה. | shul-KHAN le-___, be-va-ka-SHA | Frame: ___ is filled with a word. The prefix ל (le-) is fixed, but numbers for counting people take masculine forms (לשניים, לשלושה, לארבעה), not the counting forms in vocab. For one person, לאחד is usual for a man (feminine: לאחת). Also common: אנחנו שניים (a-NAKH-noo SHNA-yim, 'we are two'). |
| menu_please | The menu, please. | תפריט, בבקשה. | taf-REET, be-va-ka-SHA | Also natural: אפשר תפריט? (ef-SHAR taf-REET). |
| allergic_to | I'm allergic to ___. | אני אלרגי ל___. | a-NEE a-LER-gee le-___ | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: 'I [am] allergic to ___.' Masculine speaker; a woman says אני אלרגית (a-LER-geet). Prefix ל attaches to the allergen word. To stress severity add: זה מסוכן לי (ze me-su-KAN lee, 'it is dangerous for me'). |
| without | Without ___, please. | בלי ___, בבקשה. | blee ___, be-va-ka-SHA | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: 'Without ___, please.' בלי never changes form; for an allergy, say allergic_to as well, since בלי alone may be read as a preference. |
| to_go | To go, please. | לקחת, בבקשה. | la-KA-khat, be-va-ka-SHA | Literally 'to take'. The standard café answer; טייק אווי is also understood. |
| for_here | For here, please. | לשבת פה, בבקשה. | la-SHE-vet po, be-va-ka-SHA | Literally 'to sit here'. Pairs with the staff question לשבת או לקחת? |
| delicious | It was delicious. | היה טעים מאוד. | ha-YA ta-EEM me-OD |  |
| another_one | Another one, please. | עוד אחד, בבקשה. | od e-KHAD, be-va-ka-SHA | אחד agrees with the item, not the speaker: masculine item (קפה) עוד אחד; feminine item (בירה, כוס) עוד אחת (od a-KHAT). |
| ticket_to | A ticket to ___, please. | כרטיס ל___, בבקשה. | kar-TEES le-___, be-va-ka-SHA | Frame: ___ is filled with a word. ל merges with ה: לשדה (li-SDE), לחוף (la-KHOF). In Israel most bus/train fares are paid with a Rav-Kav card, so this is mostly for abroad or intercity counters. |
| does_this_go_to | Does this go to ___? | זה מגיע ל___? | ze ma-GEE-a le-___ | Frame: ___ is filled with a word. Literally 'Does this arrive to ___?'. Natural on a bus: האוטובוס הזה מגיע ל___? For a train (feminine רכבת): הרכבת הזאת מגיעה ל___? Reviewer: check whether זה נוסע ל___? is preferred. |
| take_me_to | Take me to ___, please. | תיקח אותי ל___, בבקשה. | ti-KAKH o-TEE le-___, be-va-ka-SHA | Frame: ___ is filled with a word. Masculine addressee (driver); to a woman: תיקחי (ti-ke-KHEE). Many Israelis just say the destination: לשדה התעופה, בבקשה. |
| stop_here | Stop here, please. | תעצור פה, בבקשה. | ta-a-TSOR po, be-va-ka-SHA | Masculine addressee; to a woman: תעצרי (ta-ats-REE). אפשר לעצור פה? (ef-SHAR la-a-TSOR po) is gender-neutral. |
| next_departure | When does the next one leave? | מתי יוצא האוטובוס הבא? | ma-TAI yo-TSE ha-O-to-boos ha-BA | Review edit: names the bus, since "the next one" alone sounds unnatural. For a train (רכבת, feminine): מתי יוצאת הרכבת הבאה? (ma-TAI yots-ET ha-ra-KE-vet ha-ba-A). |
| which_platform | Which platform? | איזה רציף? | EY-ze ra-TSEEF |  |
| one_way_or_return | One way or return? | הלוך או הלוך ושוב? | ha-LOKH o ha-LOKH va-SHUV |  |
| left | Left. | שמאלה. | SMO-la | Direction (turn left/right), not "correct". Direction form ('to the left'). The adjective/side is שמאל (smol). |
| right | Right. | ימינה. | ya-MEE-na | Direction (turn left/right), not "correct". Direction form ('to the right'). Not 'correct' (that is נכון). |
| straight_ahead | Straight ahead. | ישר. | ya-SHAR | Also heard: ישר ישר (keep going straight). |
| im_lost | I'm lost. | הלכתי לאיבוד. | ha-LAKH-tee le-ee-BOOD | Literally 'I went to loss'. Past tense, same for men and women. |
| show_on_map | Can you show me on the map? | אפשר להראות לי על המפה? | ef-SHAR le-har-OT lee al ha-ma-PA |  |
| near_here | Is it near here? | זה קרוב לכאן? | ze ka-ROV le-KHAN | זה קרוב לפה? (le-PO) is equally common. |
| under_name | Under the name ___. | על שם ___. | al shem ___ | Frame: ___ is filled with a word. |
| wifi_password | What's the Wi-Fi password? | מה הסיסמה לוויי-פיי? | ma ha-sis-MA la-WAI-fai | Stress on וויי-פיי varies (WAI-fai / wai-FAI). Some say לאינטרנט (la-IN-ter-net) instead. |
| checkout_time | What time is checkout? | באיזו שעה הצ'ק-אאוט? | be-EY-zo sha-A ha-chek-AUT | Uses the English loan צ'ק-אאוט, which Israeli hotels use. Reviewer: check spelling/respelling of the loanword. |
| leave_bags | Can I leave my bags here? | אפשר להשאיר פה את המזוודות? | ef-SHAR le-hash-EER po et ha-miz-va-DOT | Uses מזוודות (suitcases); for backpacks/smaller bags: התיקים (ha-tee-KEEM). |
| doesnt_work | The ___ doesn't work. | ה___ לא עובד. | ha-___ lo o-VED | Frame: ___ is filled with a word. Verb agrees with the noun: masculine עובד (o-VED), feminine עובדת (o-VE-det), plural עובדים (ov-DEEM). For a construct noun the ה moves to the second word. Hot water is more natural as אין מים חמים ('there is no hot water'). |
| another_towel | Can I have another towel? | אפשר לקבל עוד מגבת? | ef-SHAR le-ka-BEL od ma-GE-vet |  |
| ill_take_it | I'll take it. | אני אקח את זה. | a-NEE e-KAKH et ze |  |
| try_it_on | Can I try it on? | אפשר למדוד? | ef-SHAR lim-DOD |  |
| another_size | Do you have it in another size? | יש את זה במידה אחרת? | yesh et ze be-mi-DA a-khe-RET |  |
| bag_please | A bag, please. | שקית, בבקשה. | sa-KEET, be-va-ka-SHA | שקית is a plastic/carrier bag (often charged for). Not תיק (handbag/backpack). |
| haircut | A haircut, please. | תספורת, בבקשה. | tis-po-RET, be-va-ka-SHA |  |
| just_trim | Just a trim. | רק לקצר קצת. | rak le-ka-TSER KT-sat | Literally 'just to shorten a little'. Reviewer: check against barber usage; רק לסדר (rak le-sa-DER, 'just tidy it') is also common. |
| not_too_short | Not too short. | לא קצר מדי. | lo ka-TSAR mi-DAI |  |
| shorter_sides | Shorter on the sides. | יותר קצר בצדדים. | yo-TER ka-TSAR ba-tsda-DEEM |  |
| like_this | Like this. | ככה. | KA-kha | Said while showing the photo. כמו בתמונה (kmo ba-tmu-NA, 'like in the picture') is a clearer alternative. |
| beard_trim | A beard trim, please. | לסדר את הזקן, בבקשה. | le-sa-DER et ha-za-KAN, be-va-ka-SHA | Literally 'to tidy the beard, please'. Reviewer: check; לקצר את הזקן (shorten) is the alternative. |
| where_pharmacy | Where is the pharmacy? | איפה בית המרקחת? | EY-fo beyt ha-mir-KA-khat | SAFETY: allergy/emergency. Back-translation: 'Where [is] the pharmacy?' בית מרקחת is the standard word; many Israelis just say סופר-פארם (the main chain) or ask איפה יש פה בית מרקחת? ('where is there a pharmacy here?'). |
| its_emergency | It's an emergency. | זה מקרה חירום. | ze mik-RE khe-ROOM | SAFETY: allergy/emergency. Back-translation: 'This is an emergency case.' Shorter and very common: זה דחוף! (ze da-KHOOF, 'it's urgent!'). |
| lost_my | I lost my ___. | איבדתי את ה___ שלי. | ee-BAD-tee et ha-___ she-LEE | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: 'I lost the ___ of mine.' Past tense, same for men and women. ה goes on the noun; for a two-word noun (room key) it becomes את המפתח של החדר שלי. |
| call_someone | I need to call someone. | אני צריך להתקשר למישהו. | a-NEE tsa-REEKH le-hit-ka-SHER le-MEE-she-hu | SAFETY: allergy/emergency. Back-translation: 'I need to call to someone.' Masculine speaker; feminine צריכה (tsree-KHA). To borrow a phone: אפשר להתקשר מהטלפון שלך? (ef-SHAR le-hit-ka-SHER me-ha-TE-le-fon shel-KHA). |
| where_is~word_pharmacy | Where is the pharmacy? | איפה בית המרקחת? | EY-fo beyt ha-mir-KA-khat |  |
| where_is~word_atm | Where is an ATM? | איפה הכספומט? | EY-fo ha-kas-po-MAT |  |
| where_is~word_supermarket | Where is the supermarket? | איפה הסופר? | EY-fo ha-SOO-per |  |
| nearest~word_pharmacy | Where is the nearest pharmacy? | איפה בית המרקחת הכי קרוב? | EY-fo beyt ha-mir-KA-khat ha-KHEE ka-ROV |  |
| nearest~word_atm | Where is the nearest ATM? | איפה הכספומט הכי קרוב? | EY-fo ha-kas-po-MAT ha-KHEE ka-ROV |  |
| nearest~word_supermarket | Where is the nearest supermarket? | איפה הסופר הכי קרוב? | EY-fo ha-SOO-per ha-KHEE ka-ROV |  |
| nearest~word_metro_station | Where is the nearest metro station? | איפה תחנת המטרו הכי קרובה? | EY-fo ta-kha-NAT ha-MET-ro ha-KHEE kro-VA |  |
| nearest~word_bus_stop | Where is the nearest bus stop? | איפה תחנת האוטובוס הכי קרובה? | EY-fo ta-kha-NAT ha-O-to-boos ha-KHEE kro-VA |  |
| how_get~word_airport | How do I get to the airport? | איך מגיעים לשדה התעופה? | ekh ma-gee-EEM li-SDE ha-te-oo-FA |  |
| how_get~word_train_station | How do I get to the train station? | איך מגיעים לתחנת הרכבת? | ekh ma-gee-EEM le-ta-kha-NAT ha-ra-KE-vet |  |
| how_get~word_city_centre | How do I get to the city centre? | איך מגיעים למרכז העיר? | ekh ma-gee-EEM le-mer-KAZ ha-EER |  |
| how_get~word_hotel | How do I get to the hotel? | איך מגיעים למלון? | ekh ma-gee-EEM la-ma-LON |  |
| can_i_have~word_tea | Can I have a tea, please? | אפשר לקבל תה, בבקשה? | ef-SHAR le-ka-BEL te, be-va-ka-SHA |  |
| can_i_have~word_beer | Can I have a beer, please? | אפשר לקבל בירה, בבקשה? | ef-SHAR le-ka-BEL BEE-ra, be-va-ka-SHA |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | אפשר לקבל כוס יין, בבקשה? | ef-SHAR le-ka-BEL kos YA-yin, be-va-ka-SHA |  |
| can_i_have~word_orange_juice | Can I have an orange juice, please? | אפשר לקבל מיץ תפוזים, בבקשה? | ef-SHAR le-ka-BEL mits ta-poo-ZEEM, be-va-ka-SHA |  |
| can_i_have~word_menu | Can I have the menu, please? | אפשר לקבל תפריט, בבקשה? | ef-SHAR le-ka-BEL taf-REET, be-va-ka-SHA |  |
| can_i_have~word_receipt | Can I have a receipt, please? | אפשר לקבל קבלה, בבקשה? | ef-SHAR le-ka-BEL ka-ba-LA, be-va-ka-SHA |  |
| i_would_like~word_tea | I'd like a tea, please. | אני רוצה תה, בבקשה. | a-NEE ro-TSE te, be-va-ka-SHA |  |
| i_would_like~word_beer | I'd like a beer, please. | אני רוצה בירה, בבקשה. | a-NEE ro-TSE BEE-ra, be-va-ka-SHA |  |
| i_would_like~word_glass_of_wine | I'd like a glass of wine, please. | אני רוצה כוס יין, בבקשה. | a-NEE ro-TSE kos YA-yin, be-va-ka-SHA |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | אני רוצה מיץ תפוזים, בבקשה. | a-NEE ro-TSE mits ta-poo-ZEEM, be-va-ka-SHA |  |
| i_would_like~word_bread | I'd like some bread, please. | אני רוצה לחם, בבקשה. | a-NEE ro-TSE LE-khem, be-va-ka-SHA |  |
| i_would_like~word_water | I'd like some water, please. | אני רוצה מים, בבקשה. | a-NEE ro-TSE MA-yim, be-va-ka-SHA |  |
| table_for~word_one | A table for one, please. | שולחן לאחד, בבקשה. | shul-KHAN le-e-KHAD, be-va-ka-SHA |  |
| table_for~word_two | A table for two, please. | שולחן לשניים, בבקשה. | shul-KHAN lish-NA-yim, be-va-ka-SHA |  |
| table_for~word_three | A table for three, please. | שולחן לשלושה, בבקשה. | shul-KHAN lish-lo-SHA, be-va-ka-SHA |  |
| table_for~word_four | A table for four, please. | שולחן לארבעה, בבקשה. | shul-KHAN le-ar-ba-A, be-va-ka-SHA |  |
| allergic_to~word_nuts | I'm allergic to nuts. | אני אלרגי לאגוזים. | a-NEE a-LER-gee le-e-go-ZEEM | SAFETY: allergy/emergency. |
| allergic_to~word_peanuts | I'm allergic to peanuts. | אני אלרגי לבוטנים. | a-NEE a-LER-gee le-bot-NEEM | SAFETY: allergy/emergency. |
| allergic_to~word_gluten | I'm allergic to gluten. | אני אלרגי לגלוטן. | a-NEE a-LER-gee le-GLOO-ten | SAFETY: allergy/emergency. |
| allergic_to~word_shellfish | I'm allergic to shellfish. | אני אלרגי לפירות ים. | a-NEE a-LER-gee le-fey-ROT yam | SAFETY: allergy/emergency. |
| allergic_to~word_milk | I'm allergic to milk. | אני אלרגי לחלב. | a-NEE a-LER-gee le-kha-LAV | SAFETY: allergy/emergency. |
| allergic_to~word_eggs | I'm allergic to eggs. | אני אלרגי לביצים. | a-NEE a-LER-gee le-bey-TSEEM | SAFETY: allergy/emergency. |
| without~word_meat | Without meat, please. | בלי בשר, בבקשה. | blee ba-SAR, be-va-ka-SHA | SAFETY: allergy/emergency. |
| without~word_milk | Without milk, please. | בלי חלב, בבקשה. | blee kha-LAV, be-va-ka-SHA | SAFETY: allergy/emergency. |
| without~word_gluten | Without gluten, please. | בלי גלוטן, בבקשה. | blee GLOO-ten, be-va-ka-SHA | SAFETY: allergy/emergency. |
| without~word_ice | Without ice, please. | בלי קרח, בבקשה. | blee KE-rakh, be-va-ka-SHA | SAFETY: allergy/emergency. |
| without~word_nuts | Without nuts, please. | בלי אגוזים, בבקשה. | blee e-go-ZEEM, be-va-ka-SHA | SAFETY: allergy/emergency. |
| ticket_to~word_airport | A ticket to the airport, please. | כרטיס לשדה התעופה, בבקשה. | kar-TEES li-SDE ha-te-oo-FA, be-va-ka-SHA |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | כרטיס למרכז העיר, בבקשה. | kar-TEES le-mer-KAZ ha-EER, be-va-ka-SHA |  |
| ticket_to~word_beach | A ticket to the beach, please. | כרטיס לחוף, בבקשה. | kar-TEES la-KHOF, be-va-ka-SHA |  |
| ticket_to~word_train_station | A ticket to the train station, please. | כרטיס לתחנת הרכבת, בבקשה. | kar-TEES le-ta-kha-NAT ha-ra-KE-vet, be-va-ka-SHA |  |
| does_this_go_to~word_airport | Does this go to the airport? | זה מגיע לשדה התעופה? | ze ma-GEE-a li-SDE ha-te-oo-FA |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | זה מגיע למרכז העיר? | ze ma-GEE-a le-mer-KAZ ha-EER |  |
| does_this_go_to~word_beach | Does this go to the beach? | זה מגיע לחוף? | ze ma-GEE-a la-KHOF |  |
| does_this_go_to~word_train_station | Does this go to the train station? | זה מגיע לתחנת הרכבת? | ze ma-GEE-a le-ta-kha-NAT ha-ra-KE-vet |  |
| take_me_to~word_airport | Take me to the airport, please. | תיקח אותי לשדה התעופה, בבקשה. | ti-KAKH o-TEE li-SDE ha-te-oo-FA, be-va-ka-SHA |  |
| take_me_to~word_hotel | Take me to the hotel, please. | תיקח אותי למלון, בבקשה. | ti-KAKH o-TEE la-ma-LON, be-va-ka-SHA |  |
| take_me_to~word_train_station | Take me to the train station, please. | תיקח אותי לתחנת הרכבת, בבקשה. | ti-KAKH o-TEE le-ta-kha-NAT ha-ra-KE-vet, be-va-ka-SHA |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | תיקח אותי למרכז העיר, בבקשה. | ti-KAKH o-TEE le-mer-KAZ ha-EER, be-va-ka-SHA |  |
| take_me_to~word_beach | Take me to the beach, please. | תיקח אותי לחוף, בבקשה. | ti-KAKH o-TEE la-KHOF, be-va-ka-SHA |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | המזגן לא עובד. | ha-maz-GAN lo o-VED |  |
| doesnt_work~word_shower | The shower doesn't work. | המקלחת לא עובדת. | ha-mik-LA-khat lo o-VE-det |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | הוויי-פיי לא עובד. | ha-WAI-fai lo o-VED |  |
| doesnt_work~word_tv | The TV doesn't work. | הטלוויזיה לא עובדת. | ha-te-le-VEEZ-ya lo o-VE-det |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | אין מים חמים. | eyn MA-yim kha-MEEM |  |
| doesnt_work~word_door_lock | The door lock doesn't work. | המנעול של הדלת לא עובד. | ha-man-OOL shel ha-DE-let lo o-VED |  |
| lost_my~word_passport | I lost my passport. | איבדתי את הדרכון שלי. | ee-BAD-tee et ha-dar-KON she-LEE | SAFETY: allergy/emergency. |
| lost_my~word_phone | I lost my phone. | איבדתי את הטלפון שלי. | ee-BAD-tee et ha-TE-le-fon she-LEE | SAFETY: allergy/emergency. |
| lost_my~word_wallet | I lost my wallet. | איבדתי את הארנק שלי. | ee-BAD-tee et ha-ar-NAK she-LEE | SAFETY: allergy/emergency. |
| lost_my~word_bag | I lost my bag. | איבדתי את התיק שלי. | ee-BAD-tee et ha-TEEK she-LEE | SAFETY: allergy/emergency. |
| lost_my~word_keys | I lost my keys. | איבדתי את המפתחות שלי. | ee-BAD-tee et ha-maf-te-KHOT she-LEE | SAFETY: allergy/emergency. |
| lost_my~word_room_key | I lost my room key. | איבדתי את המפתח של החדר שלי. | ee-BAD-tee et ha-maf-TE-akh shel ha-KHE-der she-LEE | SAFETY: allergy/emergency. |
| reply~for_here_or_to_go | For here or to go? | לשבת או לקחת? | la-SHE-vet o la-KA-khat | Said TO the traveller by staff. |
| reply~here_you_go | Here you go. | בבקשה. | be-va-ka-SHA | Said TO the traveller by staff. Also heard: הנה (HI-ne, 'here'). |
| reply~inside_or_outside | Inside or outside? | בפנים או בחוץ? | bif-NEEM o ba-KHOOTS | Said TO the traveller by staff. |
| reply~how_many_people | How many people? | כמה אתם? | KA-ma a-TEM | Said TO the traveller by staff. Literally 'How many are you?'; the usual host question. Also: כמה אנשים? (KA-ma a-na-SHEEM). |
| reply~have_booking | Do you have a reservation? | יש לך הזמנה? | yesh le-KHA haz-ma-NA | Said TO the traveller by staff. To a man; to a woman: יש לך (yesh lakh); to a group: יש לכם (la-KHEM). |
| reply~this_way | This way. | מכאן, בבקשה. | mi-KAN, be-va-ka-SHA | Said TO the traveller by staff. Also heard: בוא אחריי (bo a-kha-RAI, 'follow me', to a man). |
| reply~next_stop | Next stop. | התחנה הבאה. | ha-ta-kha-NA ha-ba-A | Said TO the traveller by staff. |
| reply~its_closed | It's closed. | זה סגור. | ze sa-GOOR | Said TO the traveller by staff. Agrees with the place: masculine סגור (sa-GOOR), feminine סגורה (sgoo-RA), e.g. הקופה סגורה (the ticket office is closed). |
| reply~one_moment | One moment, please. | רגע אחד, בבקשה. | RE-ga e-KHAD, be-va-ka-SHA | Said TO the traveller by staff. Often just רגע (RE-ga). |
| reply~what_size | What size? | איזו מידה? | EY-zo mi-DA | Said TO the traveller by staff. |
| reply~receipt_question | Would you like a receipt? | צריך קבלה? | tsa-REEKH ka-ba-LA | Said TO the traveller by staff. Literally 'Need a receipt?'; the usual till question. |
| reply~how_would_you_like_it | How would you like it cut? | איך לספר? | ekh le-sa-PER | Said TO the traveller by staff. Literally 'How to cut?'. Also: איך אתה רוצה את זה? (to a man). |
| word~word_train_station | train station | תחנת הרכבת | ta-kha-NAT ha-ra-KE-vet | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | תחנת האוטובוס | ta-kha-NAT ha-O-to-boos | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | שדה התעופה | sde ha-te-oo-FA | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | תחנת המטרו | ta-kha-NAT ha-MET-ro | A single word, as it would appear inside a sentence. Israel has no metro yet (Tel Aviv has a light rail: הרכבת הקלה); מטרו is understood for abroad. |
| word~word_hotel | hotel | המלון | ha-ma-LON | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | החוף | ha-KHOF | A single word, as it would appear inside a sentence. Israelis often say הים (ha-YAM, 'the sea') for going to the beach. |
| word~word_city_centre | city centre | מרכז העיר | mer-KAZ ha-EER | A single word, as it would appear inside a sentence. |
| word~word_pharmacy | pharmacy | בית המרקחת | beyt ha-mir-KA-khat | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | הכספומט | ha-kas-po-MAT | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | הסופר | ha-SOO-per | A single word, as it would appear inside a sentence. Short for סופרמרקט, the everyday word. |
| word~word_platform | platform | הרציף | ha-ra-TSEEF | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | הקופה | ha-koo-PA | A single word, as it would appear inside a sentence. |
| word~word_exit | exit | היציאה | ha-ye-tsee-A | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | הכניסה | ha-knee-SA | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | תה | te | A single word, as it would appear inside a sentence. |
| word~word_beer | beer | בירה | BEE-ra | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | כוס יין | kos YA-yin | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | מיץ תפוזים | mits ta-poo-ZEEM | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | תפריט | taf-REET | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | חשבון | khesh-BON | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | תיק | teek | A single word, as it would appear inside a sentence. Handbag/backpack (for lost_my). A shopping/carrier bag is שקית (sa-KEET). |
| word~word_receipt | receipt | קבלה | ka-ba-LA | A single word, as it would appear inside a sentence. |
| word~word_water | water | מים | MA-yim | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | קפה | ka-FE | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | לחם | LE-khem | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | חלב | kha-LAV | A single word, as it would appear inside a sentence. Back-translation: 'milk'. |
| word~word_ice | ice | קרח | KE-rakh | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | אגוזים | e-go-ZEEM | A single word, as it would appear inside a sentence. Back-translation: 'nuts' (tree nuts in general; peanuts are separate, בוטנים). |
| word~word_gluten | gluten | גלוטן | GLOO-ten | A single word, as it would appear inside a sentence. Back-translation: 'gluten'. Gluten-free is ללא גלוטן (le-LO GLOO-ten). Stress: check. |
| word~word_shellfish | shellfish | פירות ים | pey-ROT yam | A single word, as it would appear inside a sentence. Back-translation: 'fruits of the sea' (seafood). Covers shellfish; not kosher, so rarely on kosher menus. |
| word~word_eggs | eggs | ביצים | bey-TSEEM | A single word, as it would appear inside a sentence. Back-translation: 'eggs'. |
| word~word_meat | meat | בשר | ba-SAR | A single word, as it would appear inside a sentence. Back-translation: 'meat'. Note chicken (עוף) is often not thought of as בשר; say בלי בשר ובלי עוף if needed. |
| word~word_dairy | dairy | מוצרי חלב | moo-tsa-REY kha-LAV | A single word, as it would appear inside a sentence. Back-translation: 'milk products'. Menus mark this as חלבי (kha-la-VEE). |
| word~word_peanuts | peanuts | בוטנים | bot-NEEM | A single word, as it would appear inside a sentence. Back-translation: 'peanuts'. Snacks like Bamba are peanut-based. |
| word~word_passport | passport | דרכון | dar-KON | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | טלפון | TE-le-fon | A single word, as it would appear inside a sentence. |
| word~word_wallet | wallet | ארנק | ar-NAK | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | מפתחות | maf-te-KHOT | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | כרטיס | kar-TEES | A single word, as it would appear inside a sentence. |
| word~word_room_key | room key | המפתח של החדר | ha-maf-TE-akh shel ha-KHE-der | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | המזגן | ha-maz-GAN | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | המקלחת | ha-mik-LA-khat | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | הוויי-פיי | ha-WAI-fai | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | הטלוויזיה | ha-te-le-VEEZ-ya | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | המים החמים | ha-MA-yim ha-kha-MEEM | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | המנעול של הדלת | ha-man-OOL shel ha-DE-let | A single word, as it would appear inside a sentence. |
| word~word_one | one | אחת | a-KHAT | A single word, as it would appear inside a sentence. Counting forms (feminine), as used when counting or reading numbers. Counting people or masculine nouns uses אחד, שניים, שלושה, ארבעה, חמישה... (see table_for examples). |
| word~word_two | two | שתיים | SHTA-yim | A single word, as it would appear inside a sentence. |
| word~word_three | three | שלוש | sha-LOSH | A single word, as it would appear inside a sentence. |
| word~word_four | four | ארבע | AR-ba | A single word, as it would appear inside a sentence. |
| word~word_five | five | חמש | kha-MESH | A single word, as it would appear inside a sentence. |
| word~word_six | six | שש | shesh | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | שבע | SHE-va | A single word, as it would appear inside a sentence. |
| word~word_eight | eight | שמונה | shmo-NE | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | תשע | TE-sha | A single word, as it would appear inside a sentence. |
| word~word_ten | ten | עשר | E-ser | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | עשרים | es-REEM | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | חמישים | kha-mee-SHEEM | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | מאה | me-A | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | למעלה | le-MA-la | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | למטה | le-MA-ta | A single word, as it would appear inside a sentence. |
| word~word_near | near | קרוב | ka-ROV | A single word, as it would appear inside a sentence. |
| word~word_far | far | רחוק | ra-KHOK | A single word, as it would appear inside a sentence. |
| word~word_today | today | היום | ha-YOM | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | מחר | ma-KHAR | A single word, as it would appear inside a sentence. |
| word~word_now | now | עכשיו | akh-SHAV | A single word, as it would appear inside a sentence. |
| word~word_later | later | אחר כך | a-khar-KAKH | A single word, as it would appear inside a sentence. |
| word~word_open | open | פתוח | pa-TOO-akh | A single word, as it would appear inside a sentence. |
| word~word_closed | closed | סגור | sa-GOOR | A single word, as it would appear inside a sentence. |
| word~word_yes | yes | כן | ken | A single word, as it would appear inside a sentence. |
| word~word_no | no | לא | lo | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | מזומן | me-zoo-MAN | A single word, as it would appear inside a sentence. |
| word~word_card | card | כרטיס | kar-TEES | A single word, as it would appear inside a sentence. You will very often hear אשראי (ash-RAI, 'credit') instead. |
