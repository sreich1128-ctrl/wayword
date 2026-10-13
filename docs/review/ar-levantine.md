# Review sheet: Levantine Arabic (202 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/ar-levantine.<tool>.json` (for example `ar-levantine.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of Levantine Arabic (Palestinian/Jordanian-leaning) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- dialect: Conversational Levantine, Palestinian/Jordanian-leaning. Forms vary across Palestine, Jordan, Lebanon and Syria.
- gender: Many second-person forms change by gender. v1 often shows the masculine/default learner form; future UI should support gender variants.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 202 keys, in order, and nothing else after the code block.

| key | English | draft | pronunciation_easy | note |
|---|---|---|---|---|
| no_thank_you | No, thank you. | لأ، شكراً. | la, SHUK-ran |  |
| okay | Okay. | ماشي. | MAA-shee | Neutral agreement. طيب (TAY-yeb) and أوكي are equally common; ماشي is most typical in Palestine/Jordan. |
| table_for | A table for ___, please. | طاولة لـ___، لو سمحت. | TAA-wleh la-___, law sa-MAHT | Frame: ___ is filled with a word. Blank takes number + 'person' (شخص), and the noun changes with the number: لشخص واحد (1), لشخصين (dual, 2), لتلات/لأربع أشخاص (3-10, plural). See examples. Waiters may simply hear the number with fingers. |
| menu_please | The menu, please. | المنيو، لو سمحت. | il-MEN-yoo, law sa-MAHT | منيو is the everyday word; formal قائمة الطعام appears in print. |
| allergic_to | I'm allergic to ___. | عندي حساسية من ___. | AN-dee ha-saa-SEE-yeh min ___ | Frame: ___ is filled with a word. SAFETY: allergy/emergency. ALLERGY. Literal: 'I have an allergy from ___' (= I'm allergic to ___). حساسية على ___ is also heard. Blank takes the allergen with the article (المكسرات, البيض). Gender-neutral. |
| without | Without ___, please. | بدون ___، لو سمحت. | bi-DOON ___, law sa-MAHT | Frame: ___ is filled with a word. SAFETY: allergy/emergency. ALLERGY/DIET. Literal: 'Without ___, please.' Blank takes the noun with no article (بدون لحمة, بدون حليب). بلا (BA-la) ___ is a common alternative. |
| to_go | To go, please. | سفري، لو سمحت. | SAF-ree, law sa-MAHT | سفري ('for travel') is the standard takeaway word in Jordan/Palestine/Syria; in Lebanon 'take away' (in English) is common too. |
| for_here | For here, please. | هون، لو سمحت. | hoon, law sa-MAHT | Literal: 'Here, please.' Natural as an answer to هون ولا سفري؟. Fuller: بدي آكل هون (I want to eat here). |
| delicious | It was delicious. | كان كتير طيب. | kaan kTEER TAY-yeb | Refers to the meal (masc). For a feminine dish (e.g. الأكلة) كانت كتير طيبة. Palestinians also say زاكي (ZAA-kee). |
| another_one | Another one, please. | كمان واحد، لو سمحت. | ka-MAAN WAA-hed, law sa-MAHT | Gender agrees with the item, not the speaker: كمان واحدة (WAH-deh) for feminine items like قهوة or بيرة. |
| ticket_to | A ticket to ___, please. | تذكرة لـ___، لو سمحت. | TAZ-ka-ra la-___, law sa-MAHT | Frame: ___ is filled with a word. لـ + ال merges to لل (للمطار). Colloquially تكت/تيكت is also heard. Blank takes the destination with its article. |
| does_this_go_to | Does this go to ___? | هاد بيروح على ___؟ | haad bi-ROOH a-la ___ | Frame: ___ is filled with a word. هاد/بيروح assume a masculine vehicle (باص, سرفيس, قطار). For a feminine noun (e.g. السيارة) هاي بتروح. على + ال contracts to عال (عالمطار). |
| take_me_to | Take me to ___, please. | وصّلني على ___، لو سمحت. | was-SIL-nee a-la ___, law sa-MAHT | Frame: ___ is filled with a word. Masculine form (file convention: masculine speaker/listener). Addressed to a male driver; to a female driver وصّليني (was-si-LEE-nee). ودّيني على ___ is also common in Palestine/Jordan. على + ال contracts to عال. |
| stop_here | Stop here, please. | وقّف هون، لو سمحت. | WA'-'if hoon, law sa-MAHT | Masculine form (file convention: masculine speaker/listener). Addressed to a male driver; female: وقّفي. نزّلني هون (naz-ZIL-nee hoon, 'let me off here') is equally common. |
| next_departure | When does the next one leave? | إمتى بيطلع الجاي؟ | EM-ta bi-TLA ij-JAAY | Literal: 'When does the coming one leave?' Masculine (bus/train). For a feminine noun: إمتى بتطلع الجاية. Jordanian/Palestinian also أيمتى. |
| which_platform | Which platform? | أي رصيف؟ | ay ra-SEEF | Uncertain: rail is rare in the Levant and travellers may not need this; رصيف is the standard word for platform (also 'sidewalk'). Some say أي منصة. |
| how_long_trip | How long does it take? | قديش بدها وقت؟ | ad-DAYSH BAD-ha wa't | Literal: 'How much time does it need?' Also: قديش بتاخد وقت؟ |
| one_way_or_return | One way or return? | رايح بس ولا رايح جاي؟ | RAA-yeH bas wa-la RAA-yeH JAAY | Colloquial; signs/tickets use ذهاب فقط / ذهاب وإياب. |
| left | Left. | عالشمال. | ash-SHMAAL | Direction (turn left/right), not "correct". Direction 'to the left'. شمال also means north; يسار (ya-SAAR) is understood everywhere. |
| right | Right. | عاليمين. | al-ya-MEEN | Direction (turn left/right), not "correct". Direction 'to the right'. |
| straight_ahead | Straight ahead. | دغري. | DUGH-ree | Direction. على طول (a-la TOOL) is equally common across the Levant. |
| im_lost | I'm lost. | أنا ضايع. | ANA DAA-ye | Masculine form (file convention: masculine speaker/listener). Female speaker: أنا ضايعة (DAY-'a). Literal: 'I am lost'. |
| show_on_map | Can you show me on the map? | ممكن توريني عالخريطة؟ | MUM-kin t-war-REE-nee al-kha-REE-ta | Same form for male and female listener. |
| near_here | Is it near here? | قريب من هون؟ | a-REEB min hoon |  |
| have_reservation | I have a reservation. | عندي حجز. | AN-dee HAJZ |  |
| under_name | Under the name ___. | باسم ___. | b-ISM ___ | Frame: ___ is filled with a word. Fuller: الحجز باسم ___ (the reservation is under the name ___). Blank takes a name. |
| wifi_password | What's the Wi-Fi password? | شو باسورد الواي فاي؟ | shoo PAS-word il-WAY-fay | Also: شو كلمة السر تبع الواي فاي؟ |
| checkout_time | What time is checkout? | الساعة قديش لازم أطلع من الغرفة؟ | is-SAA-a ad-DAYSH LAA-zim AT-la min il-GHUR-feh | Literal: 'At what time must I leave the room?' Hotel staff also understand إمتى الـ check out؟. Not fully sure which is more natural at reception; flag for review. |
| leave_bags | Can I leave my bags here? | فيني أترك الشنط هون؟ | FEE-nee AT-rok ish-SHU-nat hoon | Literal: 'Can I leave the bags here?' (no possessive, more natural). |
| doesnt_work | The ___ doesn't work. | ___ ما بيشتغل. | ___ ma bish-TA-ghal | Frame: ___ is filled with a word. Verb agrees with the noun's gender: masculine ما بيشتغل, feminine ما بتشتغل. Blank takes the noun with its article. مش شغّال / خربان (broken) are also common. |
| another_towel | Can I have another towel? | ممكن تعطيني منشفة تانية؟ | MUM-kin ta-TEE-nee MAN-sha-feh TAAN-yeh | Towel: منشفة in Palestine/Syria/Lebanon; Jordanians often say بشكير. |
| just_looking | I'm just looking. | بس عم بتفرّج. | bas am bat-FAR-raj | عم is Syrian/Lebanese/Palestinian; Jordanians often drop it: بس بتفرّج. |
| ill_take_it | I'll take it. | باخده. | BAA-khdo | Object pronoun agrees with the item: باخدها (BAAKH-d-ha) for a feminine item. |
| too_expensive | It's too expensive. | كتير غالي. | kTEER GHAA-lee | Adjective agrees with the item: غالية for a feminine item. |
| try_it_on | Can I try it on? | فيني أجرّبه؟ | FEE-nee a-JAR-ri-bo | Object pronoun agrees with the item: أجرّبها for a feminine item (e.g. جاكيت is masc, بلوزة fem). |
| another_size | Do you have it in another size? | في قياس تاني؟ | fee ee-YAAS TAA-nee | Literal: 'Is there another size?' مقاس is also used; for shoes people say نمرة. |
| bag_please | A bag, please. | كيس، لو سمحت. | kees, law sa-MAHT | كيس = plastic/shopping bag. |
| haircut | A haircut, please. | بدي أقص شعري، لو سمحت. | BAD-dee a-USS SHA-ree, law sa-MAHT | Literal: 'I want to cut my hair, please' (the normal way to ask at a barber). |
| just_trim | Just a trim. | بس قص خفيف. | bas USS kha-FEEF | Uncertain: literal 'just a light cut'. Barbers also say ترتيب (tidy-up) or شوي من فوق. Reviewer to confirm most natural. |
| not_too_short | Not too short. | مش كتير قصير. | mish kTEER a-SEER |  |
| shorter_sides | Shorter on the sides. | الجنبين أقصر، لو سمحت. | ij-jan-BAYN A-sar, law sa-MAHT | Uncertain: literal 'the two sides shorter, please'. Alternative: قصّر عالجناب أكتر. Reviewer to confirm barber usage. |
| like_this | Like this. | متل هيك. | MI-tel hayk | Said while showing a photo. Just هيك also works. |
| beard_trim | A beard trim, please. | ظبّطلي دقني، لو سمحت. | zab-BIT-lee DA'-nee, law sa-MAHT | Masculine form (file convention: masculine speaker/listener). Addressed to a male barber (female: ظبّطيلي). Literal: 'Fix my beard for me, please.' Not fully sure this is the most common barber phrasing; تحديد دقن is used for shaping. |
| help_shout | Help! | ساعدوني! | saa-'DOO-nee | SAFETY: allergy/emergency. EMERGENCY. Literal: 'Help me!' (addressed to everyone, plural). Also shouted: الحقوني! (il-Ha-'OO-nee, 'come quickly to me'). Gender-neutral. |
| need_doctor | I need a doctor. | بدي دكتور. | BAD-dee duk-TOOR | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I want/need a doctor.' Gender-neutral. محتاج دكتور (masc) / محتاجة (fem) is also used. |
| where_pharmacy | Where is the pharmacy? | وين الصيدلية؟ | wayn is-say-da-LEE-yeh | SAFETY: allergy/emergency. EMERGENCY. Literal: 'Where is the pharmacy?' |
| its_emergency | It's an emergency. | هاي حالة طارئة! | hay HAA-leh TAA-ri-'a | SAFETY: allergy/emergency. EMERGENCY. Literal: 'This is an emergency case!' Slightly formal but widely understood; in speech ضروري كتير! ('very urgent') is also used. |
| lost_my | I lost my ___. | ضيّعت ___. | day-YA'T ___ | Frame: ___ is filled with a word. SAFETY: allergy/emergency. EMERGENCY. Literal: 'I lost ___.' The possessive 'my' is a suffix on the noun (-ee), so the word changes: ضيّعت جواز سفري ('I lost my passport'). See examples. Gender-neutral. |
| not_well | I don't feel well. | مش حاسس حالي منيح. | mish HAA-ses HAA-lee mneeH | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I'm not feeling myself well.' Masculine form (file convention: masculine speaker/listener). Female speaker: مش حاسة حالي منيح (HAAS-seh). Shorter: أنا تعبان (masc) / تعبانة (fem), 'I'm unwell/tired'. |
| call_someone | I need to call someone. | لازم أتصل بحدا. | LAA-zim at-TI-sil b-HA-da | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I must call someone.' Gender-neutral. |
| where_is~word_train_station | Where is the train station? | وين محطة القطار؟ | wayn ma-HAT-tit il-i-TAAR |  |
| where_is~word_bus_stop | Where is the bus stop? | وين موقف الباص؟ | wayn MAW-af il-BAAS |  |
| where_is~word_pharmacy | Where is the pharmacy? | وين الصيدلية؟ | wayn is-say-da-LEE-yeh |  |
| where_is~word_atm | Where is an ATM? | وين الصراف الآلي؟ | wayn is-sar-RAAF il-AA-lee |  |
| where_is~word_supermarket | Where is the supermarket? | وين السوبرماركت؟ | wayn is-soo-ber-MAR-ket |  |
| where_is~word_exit | Where is the exit? | وين المخرج؟ | wayn il-MAKH-raj |  |
| nearest~word_pharmacy | Where is the nearest pharmacy? | وين أقرب صيدلية؟ | wayn AK-rab say-da-LEE-yeh |  |
| nearest~word_atm | Where is the nearest ATM? | وين أقرب صراف آلي؟ | wayn AK-rab sar-RAAF AA-lee |  |
| nearest~word_supermarket | Where is the nearest supermarket? | وين أقرب سوبرماركت؟ | wayn AK-rab soo-ber-MAR-ket |  |
| nearest~word_metro_station | Where is the nearest metro station? | وين أقرب محطة مترو؟ | wayn AK-rab ma-HAT-tit MET-ro |  |
| nearest~word_bus_stop | Where is the nearest bus stop? | وين أقرب موقف باص؟ | wayn AK-rab MAW-af BAAS |  |
| how_get~word_airport | How do I get to the airport? | كيف بروح عالمطار؟ | keef ba-ROOH al-ma-TAAR |  |
| how_get~word_train_station | How do I get to the train station? | كيف بروح على محطة القطار؟ | keef ba-ROOH a-la ma-HAT-tit il-i-TAAR |  |
| how_get~word_city_centre | How do I get to the city centre? | كيف بروح على وسط البلد؟ | keef ba-ROOH a-la WUST il-BA-lad |  |
| how_get~word_beach | How do I get to the beach? | كيف بروح عالبحر؟ | keef ba-ROOH al-BAHR |  |
| how_get~word_hotel | How do I get to the hotel? | كيف بروح عالفندق؟ | keef ba-ROOH al-FUN-du' |  |
| can_i_have~word_tea | Can I have a tea, please? | ممكن تعطيني شاي، لو سمحت؟ | MUM-kin ta-TEE-nee shaay, law sa-MAHT |  |
| can_i_have~word_beer | Can I have a beer, please? | ممكن تعطيني بيرة، لو سمحت؟ | MUM-kin ta-TEE-nee BEE-ra, law sa-MAHT |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | ممكن تعطيني كاسة نبيد، لو سمحت؟ | MUM-kin ta-TEE-nee KAA-set na-BEED, law sa-MAHT |  |
| can_i_have~word_orange_juice | Can I have an orange juice, please? | ممكن تعطيني عصير برتقان، لو سمحت؟ | MUM-kin ta-TEE-nee a-SEER bur-ta-AAN, law sa-MAHT |  |
| can_i_have~word_menu | Can I have the menu, please? | ممكن تعطيني المنيو، لو سمحت؟ | MUM-kin ta-TEE-nee il-MEN-yoo, law sa-MAHT |  |
| can_i_have~word_receipt | Can I have a receipt, please? | ممكن تعطيني الفاتورة، لو سمحت؟ | MUM-kin ta-TEE-nee il-FAA-too-ra, law sa-MAHT |  |
| i_would_like~word_tea | I'd like a tea, please. | بدي شاي، لو سمحت. | BAD-dee shaay, law sa-MAHT |  |
| i_would_like~word_beer | I'd like a beer, please. | بدي بيرة، لو سمحت. | BAD-dee BEE-ra, law sa-MAHT |  |
| i_would_like~word_glass_of_wine | I'd like a glass of wine, please. | بدي كاسة نبيد، لو سمحت. | BAD-dee KAA-set na-BEED, law sa-MAHT |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | بدي عصير برتقان، لو سمحت. | BAD-dee a-SEER bur-ta-AAN, law sa-MAHT |  |
| i_would_like~word_bread | I'd like some bread, please. | بدي خبز، لو سمحت. | BAD-dee KHUB-ez, law sa-MAHT |  |
| i_would_like~word_water | I'd like some water, please. | بدي مي، لو سمحت. | BAD-dee may, law sa-MAHT |  |
| table_for~word_one | A table for one, please. | طاولة لشخص واحد، لو سمحت. | TAA-wleh la-SHAKHS WAA-hed, law sa-MAHT |  |
| table_for~word_two | A table for two, please. | طاولة لشخصين، لو سمحت. | TAA-wleh la-shakh-SAYN, law sa-MAHT | Dual form: 'for two persons' is one word, شخصين. |
| table_for~word_three | A table for three, please. | طاولة لتلات أشخاص، لو سمحت. | TAA-wleh la-TLAT ash-KHAAS, law sa-MAHT | Before a plural noun تلاتة shortens to تلات. |
| table_for~word_four | A table for four, please. | طاولة لأربع أشخاص، لو سمحت. | TAA-wleh la-AR-ba ash-KHAAS, law sa-MAHT | Before a plural noun أربعة shortens to أربع. |
| allergic_to~word_nuts | I'm allergic to nuts. | عندي حساسية من المكسرات. | AN-dee ha-saa-SEE-yeh min il-mu-kas-sa-RAAT | SAFETY: allergy/emergency. ALLERGY. Literal: 'I have an allergy from nuts (mixed nuts)'. |
| allergic_to~word_peanuts | I'm allergic to peanuts. | عندي حساسية من الفستق السوداني. | AN-dee ha-saa-SEE-yeh min il-FUS-tu' is-soo-DAA-nee | SAFETY: allergy/emergency. ALLERGY. Literal: 'I have an allergy from peanuts ('Sudanese pistachio'). Lebanese also say فستق عبيد; plain فستق means pistachio, so keep سوداني'. |
| allergic_to~word_gluten | I'm allergic to gluten. | عندي حساسية من الغلوتين. | AN-dee ha-saa-SEE-yeh min il-ghloo-TEEN | SAFETY: allergy/emergency. ALLERGY. Literal: 'I have an allergy from gluten (loanword; staff may not know it, add القمح 'wheat' if needed)'. |
| allergic_to~word_shellfish | I'm allergic to shellfish. | عندي حساسية من ثمار البحر. | AN-dee ha-saa-SEE-yeh min tha-MAAR il-BAHR | SAFETY: allergy/emergency. ALLERGY. Literal: 'I have an allergy from 'fruits of the sea' = shellfish/seafood; may be taken to include fish. Crustaceans specifically: القشريات'. |
| allergic_to~word_milk | I'm allergic to milk. | عندي حساسية من الحليب. | AN-dee ha-saa-SEE-yeh min il-ha-LEEB | SAFETY: allergy/emergency. ALLERGY. Literal: 'I have an allergy from milk'. |
| allergic_to~word_eggs | I'm allergic to eggs. | عندي حساسية من البيض. | AN-dee ha-saa-SEE-yeh min il-BAYD | SAFETY: allergy/emergency. ALLERGY. Literal: 'I have an allergy from eggs'. |
| without~word_meat | Without meat, please. | بدون لحمة، لو سمحت. | bi-DOON LAH-meh, law sa-MAHT | SAFETY: allergy/emergency. DIET. Literal: 'Without meat (some cooks don't count chicken as لحمة; add ولا جاج 'nor chicken'), please.' |
| without~word_milk | Without milk, please. | بدون حليب، لو سمحت. | bi-DOON ha-LEEB, law sa-MAHT | SAFETY: allergy/emergency. DIET. Literal: 'Without milk, please.' |
| without~word_gluten | Without gluten, please. | بدون غلوتين، لو سمحت. | bi-DOON ghloo-TEEN, law sa-MAHT | SAFETY: allergy/emergency. DIET. Literal: 'Without gluten, please.' |
| without~word_ice | Without ice, please. | بدون تلج، لو سمحت. | bi-DOON talj, law sa-MAHT | SAFETY: allergy/emergency. DIET. Literal: 'Without ice, please.' |
| without~word_nuts | Without nuts, please. | بدون مكسرات، لو سمحت. | bi-DOON mu-kas-sa-RAAT, law sa-MAHT | SAFETY: allergy/emergency. DIET. Literal: 'Without nuts, please.' |
| ticket_to~word_airport | A ticket to the airport, please. | تذكرة للمطار، لو سمحت. | TAZ-ka-ra lil-ma-TAAR, law sa-MAHT |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | تذكرة لوسط البلد، لو سمحت. | TAZ-ka-ra la-WUST il-BA-lad, law sa-MAHT |  |
| ticket_to~word_beach | A ticket to the beach, please. | تذكرة للبحر، لو سمحت. | TAZ-ka-ra lil-BAHR, law sa-MAHT |  |
| ticket_to~word_train_station | A ticket to the train station, please. | تذكرة لمحطة القطار، لو سمحت. | TAZ-ka-ra la-ma-HAT-tit il-i-TAAR, law sa-MAHT |  |
| does_this_go_to~word_airport | Does this go to the airport? | هاد بيروح عالمطار؟ | haad bi-ROOH al-ma-TAAR |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | هاد بيروح على وسط البلد؟ | haad bi-ROOH a-la WUST il-BA-lad |  |
| does_this_go_to~word_beach | Does this go to the beach? | هاد بيروح عالبحر؟ | haad bi-ROOH al-BAHR |  |
| does_this_go_to~word_train_station | Does this go to the train station? | هاد بيروح على محطة القطار؟ | haad bi-ROOH a-la ma-HAT-tit il-i-TAAR |  |
| take_me_to~word_airport | Take me to the airport, please. | وصّلني عالمطار، لو سمحت. | was-SIL-nee al-ma-TAAR, law sa-MAHT |  |
| take_me_to~word_hotel | Take me to the hotel, please. | وصّلني عالفندق، لو سمحت. | was-SIL-nee al-FUN-du', law sa-MAHT |  |
| take_me_to~word_train_station | Take me to the train station, please. | وصّلني على محطة القطار، لو سمحت. | was-SIL-nee a-la ma-HAT-tit il-i-TAAR, law sa-MAHT |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | وصّلني على وسط البلد، لو سمحت. | was-SIL-nee a-la WUST il-BA-lad, law sa-MAHT |  |
| take_me_to~word_beach | Take me to the beach, please. | وصّلني عالبحر، لو سمحت. | was-SIL-nee al-BAHR, law sa-MAHT |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | المكيّف ما بيشتغل. | il-mu-KAY-yef ma bish-TA-ghal |  |
| doesnt_work~word_shower | The shower doesn't work. | الدوش ما بيشتغل. | id-DOOSH ma bish-TA-ghal |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | الواي فاي ما بيشتغل. | il-WAY-fay ma bish-TA-ghal |  |
| doesnt_work~word_tv | The TV doesn't work. | التلفزيون ما بيشتغل. | it-til-fiz-YOON ma bish-TA-ghal |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | ما في مي سخنة. | ma fee may SUKH-neh | Frame not used literally: 'the hot water doesn't work' is unnatural; Levantine says 'there's no hot water'. |
| doesnt_work~word_door_lock | The door lock doesn't work. | قفل الباب ما بيشتغل. | IF-l il-BAAB ma bish-TA-ghal | Uncertain: قفل الباب خربان ('the door lock is broken') may be more natural. |
| lost_my~word_passport | I lost my passport. | ضيّعت جواز سفري. | day-YA'T ja-WAAZ SAF-ree | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I lost my passport ('my travel permit')'. |
| lost_my~word_phone | I lost my phone. | ضيّعت تلفوني. | day-YA'T tal-FOO-nee | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I lost my phone. Jordan/Palestine also جوالي / موبايلي'. |
| lost_my~word_wallet | I lost my wallet. | ضيّعت جزداني. | day-YA'T jiz-DAA-nee | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I lost my wallet. محفظتي also understood'. |
| lost_my~word_bag | I lost my bag. | ضيّعت شنطتي. | day-YA'T SHAN-ti-tee | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I lost my bag'. |
| lost_my~word_keys | I lost my keys. | ضيّعت مفاتيحي. | day-YA'T ma-fa-TEE-hee | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I lost my keys'. |
| lost_my~word_room_key | I lost my room key. | ضيّعت مفتاح غرفتي. | day-YA'T mif-TAAH GHUR-fi-tee | SAFETY: allergy/emergency. EMERGENCY. Literal: 'I lost my room key ('key of my room')'. |
| reply~for_here_or_to_go | For here or to go? | هون ولا سفري؟ | hoon wa-la SAF-ree | Said TO the traveller by staff. |
| reply~anything_else | Anything else? | بدك شي تاني؟ | BAD-dak shee TAA-nee | Said TO the traveller by staff. Said to a male customer; to a female: بدِك (BID-dek). Palestinians/Jordanians also say إشي (ISH-ee) for شي. |
| reply~inside_or_outside | Inside or outside? | جوا ولا برا؟ | JUW-wa wa-la BAR-ra | Said TO the traveller by staff. |
| reply~have_booking | Do you have a reservation? | عندك حجز؟ | AN-dak HAJZ | Said TO the traveller by staff. To a male guest; to a female: عندِك (AN-dek). |
| reply~this_way | This way. | من هون. | min hoon | Said TO the traveller by staff. Often تفضّل من هون (please, this way). |
| reply~next_stop | Next stop. | المحطة الجاية. | il-ma-HAT-ta ij-JAY-yeh | Said TO the traveller by staff. Spoken form; recorded announcements use formal المحطة القادمة. |
| reply~its_closed | It's closed. | مسكّر. | m-SAK-kar | Said TO the traveller by staff. Agrees with the place: مسكّرة (m-sak-KA-ra) for a feminine noun like الصيدلية. |
| reply~one_moment | One moment, please. | لحظة، لو سمحت. | LAH-za, law sa-MAHT | Said TO the traveller by staff. Also: دقيقة (da-EE-a), 'a minute'. |
| reply~what_size | What size? | أي قياس؟ | ay ee-YAAS | Said TO the traveller by staff. Also: شو قياسك؟ / شو نمرتك؟ (shoes). |
| reply~receipt_question | Would you like a receipt? | بدك الفاتورة؟ | BAD-dak il-FAA-too-ra | Said TO the traveller by staff. To a male customer; female: بدِك. Jordan/Palestine also say الوصل (il-WASL) for receipt. |
| reply~how_would_you_like_it | How would you like it cut? | كيف بدك القصة؟ | keef BAD-dak il-US-sa | Said TO the traveller by staff. Literal: 'How do you want the cut?' To a male customer (barber context). |
| word~word_train_station | train station | محطة القطار | ma-HAT-tit il-i-TAAR | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | موقف الباص | MAW-af il-BAAS | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | المطار | il-ma-TAAR | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | محطة المترو | ma-HAT-tit il-MET-ro | A single word, as it would appear inside a sentence. |
| word~word_hotel | hotel | الفندق | il-FUN-du' | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | البحر | il-BAHR | A single word, as it would appear inside a sentence. |
| word~word_city_centre | city centre | وسط البلد | WUST il-BA-lad | A single word, as it would appear inside a sentence. |
| word~word_pharmacy | pharmacy | الصيدلية | is-say-da-LEE-yeh | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | الصراف الآلي | is-sar-RAAF il-AA-lee | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | السوبرماركت | is-soo-ber-MAR-ket | A single word, as it would appear inside a sentence. |
| word~word_platform | platform | الرصيف | ir-ra-SEEF | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | شباك التذاكر | shub-BAAK it-ta-ZAA-kir | A single word, as it would appear inside a sentence. |
| word~word_exit | exit | المخرج | il-MAKH-raj | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | المدخل | il-MAD-khal | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | شاي | shaay | A single word, as it would appear inside a sentence. |
| word~word_beer | beer | بيرة | BEE-ra | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | كاسة نبيد | KAA-set na-BEED | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | عصير برتقان | a-SEER bur-ta-AAN | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | المنيو | il-MEN-yoo | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | الحساب | il-HI-saab | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | الشنطة | ish-SHAN-ta | A single word, as it would appear inside a sentence. |
| word~word_receipt | receipt | الفاتورة | il-FAA-too-ra | A single word, as it would appear inside a sentence. |
| word~word_water | water | مي | may | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | قهوة | AH-weh | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | خبز | KHUB-ez | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | حليب | ha-LEEB | A single word, as it would appear inside a sentence. |
| word~word_ice | ice | تلج | talj | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | مكسرات | mu-kas-sa-RAAT | A single word, as it would appear inside a sentence. |
| word~word_gluten | gluten | غلوتين | ghloo-TEEN | A single word, as it would appear inside a sentence. |
| word~word_shellfish | shellfish | ثمار البحر | tha-MAAR il-BAHR | A single word, as it would appear inside a sentence. |
| word~word_eggs | eggs | بيض | bayd | A single word, as it would appear inside a sentence. |
| word~word_meat | meat | لحمة | LAH-meh | A single word, as it would appear inside a sentence. |
| word~word_dairy | dairy | مشتقات حليب | moosh-ta-AAT ha-LEEB | A single word, as it would appear inside a sentence. |
| word~word_peanuts | peanuts | فستق سوداني | FUS-tu' soo-DAA-nee | A single word, as it would appear inside a sentence. |
| word~word_passport | passport | جواز السفر | ja-WAAZ is-SA-far | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | التلفون | it-til-FOON | A single word, as it would appear inside a sentence. |
| word~word_wallet | wallet | الجزدان | ij-jiz-DAAN | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | المفاتيح | il-ma-fa-TEEH | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | التذكرة | it-TAZ-ka-ra | A single word, as it would appear inside a sentence. |
| word~word_room_key | room key | مفتاح الغرفة | mif-TAAH il-GHUR-feh | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | المكيّف | il-mu-KAY-yef | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | الدوش | id-DOOSH | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | الواي فاي | il-WAY-fay | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | التلفزيون | it-til-fiz-YOON | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | المي السخنة | il-may is-SUKH-neh | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | قفل الباب | IF-l il-BAAB | A single word, as it would appear inside a sentence. |
| word~word_one | one | واحد | WAA-hed | A single word, as it would appear inside a sentence. |
| word~word_two | two | تنين | tnayn | A single word, as it would appear inside a sentence. |
| word~word_three | three | تلاتة | ta-LAA-teh | A single word, as it would appear inside a sentence. |
| word~word_four | four | أربعة | AR-ba-a | A single word, as it would appear inside a sentence. |
| word~word_five | five | خمسة | KHAM-seh | A single word, as it would appear inside a sentence. |
| word~word_six | six | ستة | SIT-teh | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | سبعة | SAB-a | A single word, as it would appear inside a sentence. |
| word~word_eight | eight | تمانية | ta-MAN-yeh | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | تسعة | TIS-a | A single word, as it would appear inside a sentence. |
| word~word_ten | ten | عشرة | A-sha-ra | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | عشرين | ish-REEN | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | خمسين | kham-SEEN | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | مية | MEE-yeh | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | فوق | fo' | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | تحت | taht | A single word, as it would appear inside a sentence. |
| word~word_near | near | قريب | a-REEB | A single word, as it would appear inside a sentence. |
| word~word_far | far | بعيد | ba-EED | A single word, as it would appear inside a sentence. |
| word~word_today | today | اليوم | il-YOM | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | بكرة | BUK-ra | A single word, as it would appear inside a sentence. |
| word~word_now | now | هلأ | HA-la' | A single word, as it would appear inside a sentence. |
| word~word_later | later | بعدين | ba-DAYN | A single word, as it would appear inside a sentence. |
| word~word_open | open | مفتوح | maf-TOOH | A single word, as it would appear inside a sentence. |
| word~word_closed | closed | مسكّر | m-SAK-kar | A single word, as it would appear inside a sentence. |
| word~word_yes | yes | آه | aah | A single word, as it would appear inside a sentence. |
| word~word_no | no | لأ | la | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | كاش | kaash | A single word, as it would appear inside a sentence. |
| word~word_card | card | كرت | kart | A single word, as it would appear inside a sentence. |
