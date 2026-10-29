# Review sheet: Russian (214 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/ru.<tool>.json` (for example `ru.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of Russian (Russia) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- gender: Some phrases have masculine/feminine variants; dataset flags visible variants in text.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 214 keys, in order, and nothing else after the code block.

| key | English | draft | pronunciation_easy | note |
|---|---|---|---|---|
| table_for | A table for ___, please. | Столик на ___, пожалуйста. | STOH-leek nah, pah-ZHAH-loo-stah | Frame: ___ is filled with a word. The number after на takes a collective/case form, not the plain number: на одного, на двоих, на троих, на четверых. See examples. |
| menu_please | The menu, please. | Меню, пожалуйста. | mee-NYOO, pah-ZHAH-loo-stah |  |
| allergic_to | I'm allergic to ___. | У меня аллергия на ___. | oo mee-NYAH ah-leer-GEE-yah nah | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: 'I have an allergy to ___' (lit. 'at me [is] allergy on ___'). The allergen takes the accusative case (на орехи, на молоко, на яйца). Gender-neutral. |
| vegetarian | I'm vegetarian. | Я вегетарианец/вегетарианка. | ya vee-gee-tah-ree-AH-neets/vee-gee-tah-ree-AHN-kah | Speaker gender: вегетарианец (man) / вегетарианка (woman). |
| without | Without ___, please. | Без ___, пожалуйста. | byez, pah-ZHAH-loo-stah | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: 'Without ___, please.' Без takes the genitive: без мяса, без молока, без глютена, без льда, без орехов. For an allergy, pair it with 'У меня аллергия на ___' so staff know it is medical, not a preference. |
| to_go | To go, please. | С собой, пожалуйста. | s sah-BOY, pah-ZHAH-loo-stah |  |
| for_here | For here, please. | Здесь, пожалуйста. | zdyes, pah-ZHAH-loo-stah | Lit. 'Here, please'; the natural answer to 'Здесь или с собой?'. Fuller: Я буду есть здесь (I'll eat here). |
| another_one | Another one, please. | Ещё один, пожалуйста. | yee-SHCHYO ah-DEEN, pah-ZHAH-loo-stah | один agrees with the item's gender: ещё одну for a feminine noun (чашку, бутылку, кружку пива), ещё одно for neuter (пиво, вино). Ещё один fits masculine items (чай, кофе, бокал). Reviewer: consider whether a neutral form is preferable. |
| ticket_to | A ticket to ___, please. | Билет до ___, пожалуйста. | bee-LYET dah, pah-ZHAH-loo-stah | Frame: ___ is filled with a word. До takes the genitive (до аэропорта, до вокзала). For trains/buses between cities, the city name also goes in the genitive: до Москвы. |
| does_this_go_to | Does this go to ___? | Этот идёт до ___? | EH-tat ee-DYOT dah | Frame: ___ is filled with a word. Lit. 'Does this one go to ___?', said pointing at a bus or train (автобус, поезд, трамвай are masculine). For a commuter train (электричка, feminine) it would be Эта идёт до ___? To a driver: Вы едете до ___? (Are you going to ___?). Not sure which is best as a single default. |
| take_me_to | Take me to ___, please. | Довезите меня до ___, пожалуйста. | dah-vee-ZEE-tyeh mee-NYAH dah, pah-ZHAH-loo-stah | Frame: ___ is filled with a word. Lit. 'Drive me as far as ___, please' (taxi). До always takes the genitive. Отвезите меня в/на ___ is equally natural but its preposition changes per place (в аэропорт, на вокзал), so до was chosen to keep the frame fixed. In practice drivers also accept just 'До аэропорта, пожалуйста.' |
| stop_here | Stop here, please. | Остановите здесь, пожалуйста. | ah-stah-nah-VEE-tyeh zdyes, pah-ZHAH-loo-stah |  |
| next_departure | When does the next one leave? | Когда отправляется следующий? | kahg-DAH aht-prahv-LYAH-eet-sah SLYEH-doo-yoo-shchee | следующий is masculine (поезд, автобус); for a feminine vehicle (электричка, маршрутка) use следующая. |
| which_platform | Which platform? | Какая платформа? | kah-KAH-yah plaht-FOR-mah | At big long-distance stations the track is often called путь: Какой путь? (kah-KOY poot). |
| how_long_trip | How long does it take? | Сколько времени ехать? | SKOL-kah VRYEH-mee-nee YEH-khat | Lit. 'How much time to travel?'. Shorter Сколько ехать? is also common. |
| one_way_or_return | One way or return? | В одну сторону или туда и обратно? | v ahd-NOO STOH-rah-noo EE-lee too-DAH ee ah-BRAHT-nah |  |
| left | Left. | Налево. | nah-LYEH-vah | Direction (turn left/right), not "correct". Direction 'to the left' (where to go). Location 'on the left' is слева (SLYEH-vah). |
| right | Right. | Направо. | nah-PRAH-vah | Direction (turn left/right), not "correct". Direction 'to the right'. Location 'on the right' is справа (SPRAH-vah). |
| straight_ahead | Straight ahead. | Прямо. | PRYAH-mah |  |
| im_lost | I'm lost. | Я заблудился/заблудилась. | ya zah-bloo-DEEL-sah/zah-bloo-DEE-lahs | Speaker gender: заблудился (man) / заблудилась (woman). |
| have_reservation | I have a reservation. | У меня бронь. | oo mee-NYAH bron | Lit. 'I have a booking'. бронь is the everyday word at hotels and restaurants; more formal: У меня забронирован номер (I have a room booked). |
| under_name | Under the name ___. | На имя ___. | nah EE-myah | Frame: ___ is filled with a word. |
| checkout_time | What time is checkout? | Во сколько выезд? | vah SKOL-kah VY-yeest | Lit. 'At what time is departure?'. Hotels also say расчётный час (checkout hour): Во сколько расчётный час? |
| leave_bags | Can I leave my bags here? | Можно оставить здесь багаж? | MOZH-nah ah-STAH-veet zdyes bah-GAHSH | Lit. 'Can I leave luggage here?'. Вещи (things) is also used: Можно оставить здесь вещи? |
| doesnt_work | The ___ doesn't work. | ___ не работает. | nee rah-BOH-tah-yeet | Frame: ___ is filled with a word. Plural subjects take не работают. For hot water the natural sentence is Нет горячей воды (There is no hot water), used in the examples instead of the frame. |
| another_towel | Can I have another towel? | Можно ещё одно полотенце? | MOZH-nah yee-SHCHYO ahd-NOH pah-lah-TYEN-tseh |  |
| ill_take_it | I'll take it. | Я это возьму. | ya EH-tah vahz-MOO | Беру! (bee-ROO, 'I'm taking it') is a shorter everyday alternative. |
| try_it_on | Can I try it on? | Можно примерить? | MOZH-nah pree-MYEH-reet |  |
| another_size | Do you have it in another size? | У вас есть другой размер? | oo vahs yest droo-GOY rahz-MYER |  |
| bag_please | A bag, please. | Пакет, пожалуйста. | pah-KYET, pah-ZHAH-loo-stah | пакет = shop bag (plastic or paper); shops often charge a few roubles for it. |
| haircut | A haircut, please. | Подстригите меня, пожалуйста. | paht-stree-GEE-tyeh mee-NYAH, pah-ZHAH-loo-stah | Lit. 'Cut my hair, please'. Мне нужна стрижка (I need a haircut) is also fine. |
| just_trim | Just a trim. | Только подровнять. | TOL-kah pahd-rahv-NYAHT | Lit. 'Just even it up'; the usual way to ask for a trim. |
| not_too_short | Not too short. | Не слишком коротко. | nee SLEESH-kahm KOH-raht-kah |  |
| shorter_sides | Shorter on the sides. | По бокам покороче. | pah bah-KAHM pah-kah-ROH-cheh |  |
| like_this | Like this. | Вот так. | vot tahk | Lit. 'Like in the photo', said while showing it. Вот так (vot TAHK, 'like this') also works. [Fixed 2026-10-14 per ChatGPT review.] |
| beard_trim | A beard trim, please. | Подровняйте бороду, пожалуйста. | pahd-rahv-NYAI-tyeh BOH-rah-doo, pah-ZHAH-loo-stah |  |
| where_pharmacy | Where is the pharmacy? | Где аптека? | gdyeh ahp-TYEH-kah | SAFETY: allergy/emergency. Back-translation: 'Where is [the] pharmacy?'. For the nearest one: Где ближайшая аптека? |
| its_emergency | It's an emergency. | У меня экстренная ситуация! | oo mee-NYAH EKS-tren-nah-yah see-too-AH-tsy-yah | SAFETY: allergy/emergency. Back-translation: 'It's urgent!'. This is the everyday way to say it; Это экстренный случай (it's an emergency case) is more formal and less often shouted. [Fixed 2026-10-14 per ChatGPT review.] |
| lost_my | I lost my ___. | Я потерял/потеряла ___. | ya pah-tee-RYAHL/pah-tee-RYAH-lah | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: 'I lost ___.' Speaker gender: потерял (man) / потеряла (woman). The object takes the accusative (паспорт, сумку). Russian normally omits 'my' here. |
| call_someone | I need to call someone. | Мне нужно кому-то позвонить. | mnyeh NOOZH-nah kah-MOO-tah pah-zvah-NEET | SAFETY: allergy/emergency. Back-translation: 'I need to make a phone call' (lit. 'to me [it is] necessary to call'). Add Можно с вашего телефона? to ask to use someone's phone. [Fixed 2026-10-14 per ChatGPT review.] |
| do_you_have | Do you have ___? | У вас есть ___? | oo vahs YEST | Frame: ___ is filled with a word. Lit. 'At you is there ___?'. The noun stays in the nominative, so the blank takes the plain word. |
| how_much_is | How much is ___? | Сколько стоит ___? | SKOL-kah STOH-eet | Frame: ___ is filled with a word. Plural items take стоят (STOH-yaht): Сколько стоят билеты? |
| i_need | I need ___, please. | Мне ___, пожалуйста. | mnyeh, pah-ZHAH-loo-stah | Frame: ___ is filled with a word. Back-translation: 'To me [is] needed ___, please.' The word for 'needed' agrees with the noun (нужен masc., нужна fem., нужно neut., нужны plural), so it is inside the blank: Мне нужна помощь, Мне нужно такси. Gender-neutral for the speaker. Safety: 'I need help' = Мне нужна помощь (lit. 'to me [is] needed help'); shouted, Помогите! (Help!). 'I need a doctor' = Мне нужен врач (lit. 'to me [is] needed a doctor'). |
| is_there_nearby | Is there a ___ nearby? | Здесь рядом есть ___? | zdyes RYAH-dahm yest | Frame: ___ is filled with a word. Lit. 'Here nearby is there ___?'. Noun stays nominative. Тут поблизости есть ___? is equally common. |
| pay_with | Can I pay with ___? | Можно оплатить ___? | MOZH-nah ahp-lah-TEET | Frame: ___ is filled with a word. Lit. 'Can [one] pay ___?'. The means of payment goes in the instrumental with no preposition (наличными, картой, телефоном), so 'with' is inside the blank. Matches the vetted Можно оплатить картой? |
| can_you | Can you ___, please? | Можете ___, пожалуйста? | MOH-zhuh-tyeh, pah-ZHAH-loo-stah | Frame: ___ is filled with a word. Lit. 'Can [you] ___, please?' + infinitive; matches the vetted Можете повторить? / Можете мне помочь? |
| like_without | I'd like ___ without ___. | Мне ___ без ___, пожалуйста. | mnyeh byez, pah-ZHAH-loo-stah | Frame: ___ is filled with a word. Lit. 'For me ___ without ___, please' (the usual way to order; gender-neutral, unlike Я бы хотел/хотела). First blank is accusative (воду, кофе, чай), second is genitive after без (молока, сахара, льда), so case changes are inside the blanks. |
| can_i_here | Can I ___ here? | Можно здесь ___? | MOZH-nah zdyes | Frame: ___ is filled with a word. Lit. 'Is it allowed here to ___?' + infinitive; same pattern as the vetted Можно оставить здесь багаж? |
| looking_for | I'm looking for ___. | Я ищу ___. | ya ee-SHCHOO | Frame: ___ is filled with a word. The object takes the accusative (feminine nouns change: гостиницу), so the case form is inside the blank. Gender-neutral. |
| is_included | Is ___ included? | ___ входит в стоимость? | FKHOH-deet f STOH-ee-mahst | Frame: ___ is filled with a word. Lit. 'Does ___ go into the price?'. Chosen over ___ включён? because включён/включена/включено/включены changes with the noun's gender; входит only changes for plural (входят). Not sure which a native would pick as the default; both are common. |
| where_can_i | Where can I ___? | Где можно ___? | gdyeh MOZH-nah | Frame: ___ is filled with a word. Lit. 'Where is it possible to ___?' + infinitive. Gender-neutral. |
| where_is~word_pharmacy | Where is the pharmacy? | Где аптека? | gdyeh ahp-TYEH-kah |  |
| where_is~word_supermarket | Where is the supermarket? | Где супермаркет? | gdyeh soo-peer-MAR-keet |  |
| where_is~word_exit |  | Где выход? | gdyeh VY-khat |  |
| nearest~word_atm | Where is the nearest ATM? | Где ближайший банкомат? | gdyeh blee-ZHAI-shee bahn-kah-MAHT |  |
| how_get~word_train_station | How do I get to the train station? | Как добраться до вокзала? | kak dah-BRAHT-sah dah vahk-ZAH-lah |  |
| how_get~word_city_centre | How do I get to the city centre? | Как добраться до центра города? | kak dah-BRAHT-sah dah TSEN-trah GOH-rah-dah |  |
| how_get~word_hotel | How do I get to the hotel? | Как добраться до гостиницы? | kak dah-BRAHT-sah dah gah-STEE-nee-tsy |  |
| can_i_have~word_tea | Can I have a tea, please? | Можно мне чай, пожалуйста? | MOZH-nah mnyeh chai, pah-ZHAH-loo-stah |  |
| can_i_have~word_beer | Can I have a beer, please? | Можно мне пиво, пожалуйста? | MOZH-nah mnyeh PEE-vah, pah-ZHAH-loo-stah |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | Можно мне бокал вина, пожалуйста? | MOZH-nah mnyeh bah-KAHL vee-NAH, pah-ZHAH-loo-stah |  |
| can_i_have~word_orange_juice |  | Можно мне апельсиновый сок, пожалуйста? | MOZH-nah mnyeh ah-peel-SEE-nah-vy sok, pah-ZHAH-loo-stah |  |
| can_i_have~word_menu | Can I have the menu, please? | Можно мне меню, пожалуйста? | MOZH-nah mnyeh mee-NYOO, pah-ZHAH-loo-stah |  |
| can_i_have~word_receipt | Can I have a receipt, please? | Можно мне чек, пожалуйста? | MOZH-nah mnyeh chek, pah-ZHAH-loo-stah |  |
| i_would_like~word_tea | I'd like a tea, please. | Я бы хотел чаю, пожалуйста. | ya by khah-TYEL CHAH-yoo, pah-ZHAH-loo-stah |  |
| i_would_like~word_beer | I'd like a beer, please. | Я бы хотел пива, пожалуйста. | ya by khah-TYEL PEE-vah, pah-ZHAH-loo-stah |  |
| i_would_like~word_glass_of_wine |  | Я бы хотел бокал вина, пожалуйста. | ya by khah-TYEL bah-KAHL vee-NAH, pah-ZHAH-loo-stah |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | Я бы хотел апельсиновый сок, пожалуйста. | ya by khah-TYEL ah-peel-SEE-nah-vy sok, pah-ZHAH-loo-stah |  |
| i_would_like~word_bread | I'd like some bread, please. | Я бы хотел хлеба, пожалуйста. | ya by khah-TYEL KHLYEH-bah, pah-ZHAH-loo-stah |  |
| i_would_like~word_water | I'd like some water, please. | Я бы хотел воды, пожалуйста. | ya by khah-TYEL vah-DY, pah-ZHAH-loo-stah |  |
| table_for~word_one | A table for one, please. | Столик на одного, пожалуйста. | STOH-leek nah ahd-nah-VOH, pah-ZHAH-loo-stah |  |
| table_for~word_three | A table for three, please. | Столик на троих, пожалуйста. | STOH-leek nah trah-EEKH, pah-ZHAH-loo-stah |  |
| allergic_to~word_eggs |  | У меня аллергия на яйца. | oo mee-NYAH ah-leer-GEE-yah nah YAI-tsah | SAFETY: allergy/emergency. |
| without~word_meat | Without meat, please. | Без мяса, пожалуйста. | byez MYAH-sah, pah-ZHAH-loo-stah | SAFETY: allergy/emergency. |
| without~word_milk | Without milk, please. | Без молока, пожалуйста. | byez mah-lah-KAH, pah-ZHAH-loo-stah | SAFETY: allergy/emergency. |
| without~word_gluten | Without gluten, please. | Без глютена, пожалуйста. | byez glyoo-TEH-nah, pah-ZHAH-loo-stah | SAFETY: allergy/emergency. |
| without~word_ice | Without ice, please. | Без льда, пожалуйста. | byez LDAH, pah-ZHAH-loo-stah | SAFETY: allergy/emergency. |
| without~word_nuts | Without nuts, please. | Без орехов, пожалуйста. | byez ah-RYEH-khaf, pah-ZHAH-loo-stah | SAFETY: allergy/emergency. |
| ticket_to~word_airport | A ticket to the airport, please. | Билет до аэропорта, пожалуйста. | bee-LYET dah ah-eh-rah-POR-tah, pah-ZHAH-loo-stah |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | Билет до центра города, пожалуйста. | bee-LYET dah TSEN-trah GOH-rah-dah, pah-ZHAH-loo-stah |  |
| ticket_to~word_beach | A ticket to the beach, please. | Билет до пляжа, пожалуйста. | bee-LYET dah PLYAH-zhah, pah-ZHAH-loo-stah |  |
| ticket_to~word_train_station | A ticket to the train station, please. | Билет до вокзала, пожалуйста. | bee-LYET dah vahk-ZAH-lah, pah-ZHAH-loo-stah |  |
| does_this_go_to~word_airport | Does this go to the airport? | Этот идёт до аэропорта? | EH-tat ee-DYOT dah ah-eh-rah-POR-tah |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | Этот идёт до центра города? | EH-tat ee-DYOT dah TSEN-trah GOH-rah-dah |  |
| does_this_go_to~word_beach | Does this go to the beach? | Этот идёт до пляжа? | EH-tat ee-DYOT dah PLYAH-zhah |  |
| does_this_go_to~word_train_station | Does this go to the train station? | Этот идёт до вокзала? | EH-tat ee-DYOT dah vahk-ZAH-lah |  |
| take_me_to~word_airport | Take me to the airport, please. | Довезите меня до аэропорта, пожалуйста. | dah-vee-ZEE-tyeh mee-NYAH dah ah-eh-rah-POR-tah, pah-ZHAH-loo-stah |  |
| take_me_to~word_hotel | Take me to the hotel, please. | Довезите меня до гостиницы, пожалуйста. | dah-vee-ZEE-tyeh mee-NYAH dah gah-STEE-nee-tsy, pah-ZHAH-loo-stah |  |
| take_me_to~word_train_station | Take me to the train station, please. | Довезите меня до вокзала, пожалуйста. | dah-vee-ZEE-tyeh mee-NYAH dah vahk-ZAH-lah, pah-ZHAH-loo-stah |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | Довезите меня до центра города, пожалуйста. | dah-vee-ZEE-tyeh mee-NYAH dah TSEN-trah GOH-rah-dah, pah-ZHAH-loo-stah |  |
| take_me_to~word_beach | Take me to the beach, please. | Довезите меня до пляжа, пожалуйста. | dah-vee-ZEE-tyeh mee-NYAH dah PLYAH-zhah, pah-ZHAH-loo-stah |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | Кондиционер не работает. | kahn-dee-tsy-ah-NYER nee rah-BOH-tah-yeet |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | Wi-Fi не работает. | vai-FAI nee rah-BOH-tah-yeet |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | Нет горячей воды. | nyet gah-RYAH-chey vah-DY |  |
| doesnt_work~word_door_lock |  | Дверной замок не работает. | dveer-NOY zah-MOK nee rah-BOH-tah-yeet |  |
| lost_my~word_passport | I lost my passport. | Я потерял/потеряла паспорт. | ya pah-tee-RYAHL/pah-tee-RYAH-lah PAHS-pahrt | SAFETY: allergy/emergency. |
| lost_my~word_phone | I lost my phone. | Я потерял/потеряла телефон. | ya pah-tee-RYAHL/pah-tee-RYAH-lah tee-lee-FON | SAFETY: allergy/emergency. |
| lost_my~word_wallet | I lost my wallet. | Я потерял/потеряла кошелёк. | ya pah-tee-RYAHL/pah-tee-RYAH-lah kah-shee-LYOK | SAFETY: allergy/emergency. |
| lost_my~word_bag |  | Я потерял/потеряла сумку. | ya pah-tee-RYAHL/pah-tee-RYAH-lah SOOM-koo | SAFETY: allergy/emergency. |
| lost_my~word_keys | I lost my keys. | Я потерял/потеряла ключи. | ya pah-tee-RYAHL/pah-tee-RYAH-lah klyoo-CHEE | SAFETY: allergy/emergency. |
| lost_my~word_room_key | I lost my room key. | Я потерял/потеряла ключ от номера. | ya pah-tee-RYAHL/pah-tee-RYAH-lah klyooch at NOH-mee-rah | SAFETY: allergy/emergency. |
| do_you_have~wifi | Do you have Wi-Fi? | У вас есть Wi-Fi? | oo vahs yest vai-FAI |  |
| do_you_have~vegetarian_food | Do you have vegetarian food? | У вас есть вегетарианские блюда? | oo vahs yest vee-gee-tah-ree-AHN-skee-yeh BLYOO-dah | Lit. 'vegetarian dishes', the natural restaurant wording; вегетарианская еда (food) also works. |
| do_you_have~charger | Do you have a phone charger? | У вас есть зарядка для телефона? | oo vahs yest zah-RYAHT-kah dlyah tee-lee-FOH-nah |  |
| do_you_have~map | Do you have a map? | У вас есть карта города? | oo vahs yest KAR-tah GOH-rah-dah | Lit. 'a map of the city'; plain карта can also mean a bank card, so города was added. |
| how_much_is~coffee | How much is a coffee? | Сколько стоит кофе? | SKOL-kah STOH-eet KOH-fyeh |  |
| i_need~help | I need help, please. | Мне нужна помощь. | mnyeh noozh-NAH POH-mahshch | Back-translation: 'To me [is] needed help.' пожалуйста dropped: it sounds odd in an urgent request. In real danger shout Помогите! |
| i_need~water | I need water, please. | Мне нужна вода, пожалуйста. | mnyeh noozh-NAH vah-DAH, pah-ZHAH-loo-stah | To ask for some to drink, Дайте, пожалуйста, воды (Give me some water, please) is more usual. |
| i_need~taxi | I need a taxi, please. | Мне нужно такси, пожалуйста. | mnyeh NOOZH-nah tahk-SEE, pah-ZHAH-loo-stah | такси is neuter, hence нужно. Asking staff to order one: Вызовите мне такси, пожалуйста (Call me a taxi). |
| is_there_nearby~bathroom | Is there a bathroom nearby? | Здесь рядом есть туалет? | zdyes RYAH-dahm yest too-ah-LYET |  |
| is_there_nearby~pharmacy | Is there a pharmacy nearby? | Здесь рядом есть аптека? | zdyes RYAH-dahm yest ahp-TYEH-kah |  |
| is_there_nearby~atm | Is there an ATM nearby? | Здесь рядом есть банкомат? | zdyes RYAH-dahm yest bahn-kah-MAHT |  |
| is_there_nearby~supermarket | Is there a supermarket nearby? | Здесь рядом есть супермаркет? | zdyes RYAH-dahm yest soo-peer-MAR-keet |  |
| pay_with~cash | Can I pay with cash? | Можно оплатить наличными? | MOZH-nah ahp-lah-TEET nah-LEECH-ny-mee |  |
| pay_with~phone | Can I pay with my phone? | Можно оплатить телефоном? | MOZH-nah ahp-lah-TEET tee-lee-FOH-nahm | Lit. 'pay by phone'; Russian omits 'my'. Note: foreign-issued cards and phone wallets generally don't work in Russia, so cash may be the real answer. |
| can_you~write | Can you write it down, please? | Можете это написать, пожалуйста? | MOH-zhuh-tyeh EH-tah nah-pee-SAHT, pah-ZHAH-loo-stah | Lit. 'Can you write this, please?'. Shorter and just as polite: Напишите, пожалуйста (nah-pee-SHEE-tyeh). |
| like_without~coffee_milk | I'd like a coffee without milk. | Мне кофе без молока, пожалуйста. | mnyeh KOH-fyeh byez mah-lah-KAH, pah-ZHAH-loo-stah |  |
| like_without~tea_sugar | I'd like a tea without sugar. | Мне чай без сахара, пожалуйста. | mnyeh chai byez SAH-khah-rah, pah-ZHAH-loo-stah |  |
| like_without~water_ice | I'd like water without ice. | Мне воду без льда, пожалуйста. | mnyeh VOH-doo byez LDAH, pah-ZHAH-loo-stah |  |
| can_i_here~sit | Can I sit here? | Можно здесь сесть? | MOZH-nah zdyes SYEST | For a free seat people usually ask Здесь свободно? (zdyes svah-BOD-nah, 'Is it free here?'). |
| can_i_here~photos | Can I take photos here? | Можно здесь фотографировать? | MOZH-nah zdyes fah-tah-grah-FEE-rah-vat |  |
| can_i_here~charge | Can I charge my phone here? | Можно здесь зарядить телефон? | MOZH-nah zdyes zah-ryah-DEET tee-lee-FON |  |
| looking_for~my_hotel | I'm looking for my hotel. | Я ищу свою гостиницу. | ya ee-SHCHOO svah-YOO gah-STEE-nee-tsoo | свою = 'my own' (accusative); отель (ah-TEL, masc.: свой отель) is also common for hotels. |
| looking_for~restaurant | I'm looking for a restaurant. | Я ищу ресторан. | ya ee-SHCHOO ree-stah-RAHN |  |
| looking_for~exit | I'm looking for the exit. | Я ищу выход. | ya ee-SHCHOO VY-khat |  |
| is_included~breakfast | Is breakfast included? | Завтрак входит в стоимость? | ZAHF-trak FKHOH-deet f STOH-ee-mahst | Hotels equally say Завтрак включён? (ZAHF-trak fklyoo-CHYON). |
| is_included~tax | Is tax included? | Налог входит в стоимость? | nah-LOK FKHOH-deet f STOH-ee-mahst | Russian shelf prices normally include VAT (НДС), so this is rarely asked; a tourist/hotel tax would be туристический налог. |
| is_included~wifi | Is Wi-Fi included? | Wi-Fi входит в стоимость? | vai-FAI FKHOH-deet f STOH-ee-mahst |  |
| is_included~luggage | Is luggage included? | Багаж входит в стоимость? | bah-GAHSH FKHOH-deet f STOH-ee-mahst | For a flight ticket, Багаж включён в билет? (Is luggage included in the ticket?) is more specific. |
| where_can_i~taxi | Where can I get a taxi? | Где можно взять такси? | gdyeh MOZH-nah VZYAHT tahk-SEE | Lit. 'Where can one take a taxi?'. In Russian cities taxis are mostly ordered by app (Яндекс Go). |
| where_can_i~change_money | Where can I change money? | Где можно поменять деньги? | gdyeh MOZH-nah pah-mee-NYAHT DYEN-gee |  |
| where_can_i~sim | Where can I buy a SIM card? | Где можно купить сим-карту? | gdyeh MOZH-nah koo-PEET seem-KAR-too | Foreigners need a passport to buy a SIM in Russia. |
| reply~here_you_go | Here you go. | Вот, пожалуйста. | vot, pah-ZHAH-loo-stah | Said TO the traveller by staff. |
| reply~inside_or_outside | Inside or outside? | Внутри или на улице? | vnoo-TREE EE-lee nah OO-lee-tseh | Said TO the traveller by staff. |
| reply~how_many_people | How many people? | На сколько человек? | nah SKOL-kah chee-lah-VYEK | Said TO the traveller by staff. |
| reply~this_way | This way. | Сюда, пожалуйста. | syoo-DAH, pah-ZHAH-loo-stah | Said TO the traveller by staff. |
| reply~next_stop | Next stop. | Следующая остановка. | SLYEH-doo-yoo-shchah-yah ah-stah-NOF-kah | Said TO the traveller by staff. |
| reply~one_moment | One moment, please. | Одну минуту, пожалуйста. | ahd-NOO mee-NOO-too, pah-ZHAH-loo-stah | Said TO the traveller by staff. |
| reply~what_size | What size? | Какой размер? | kah-KOY rahz-MYER | Said TO the traveller by staff. |
| reply~receipt_question | Would you like a receipt? | Чек нужен? | chek NOO-zheen | Said TO the traveller by staff. |
| reply~how_would_you_like_it | How would you like it cut? | Как вас подстричь? | kak vahs paht-STREECH | Said TO the traveller by staff. |
| word~word_train_station | train station | вокзал | vahk-ZAHL | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | автобусная остановка | af-TOH-boos-nah-yah ah-stah-NOF-kah | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | аэропорт | ah-eh-rah-PORT | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | станция метро | STAHN-tsy-yah mee-TROH | A single word, as it would appear inside a sentence. |
| word~word_hotel | hotel | гостиница | gah-STEE-nee-tsah | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | пляж | plyahsh | A single word, as it would appear inside a sentence. |
| word~word_city_centre | city centre | центр города | TSENTR GOH-rah-dah | A single word, as it would appear inside a sentence. |
| word~word_pharmacy | pharmacy | аптека | ahp-TYEH-kah | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | банкомат | bahn-kah-MAHT | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | супермаркет | soo-peer-MAR-keet | A single word, as it would appear inside a sentence. |
| word~word_platform | platform | платформа | plaht-FOR-mah | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | касса | KAHS-sah | A single word, as it would appear inside a sentence. |
| word~word_exit | exit | выход | VY-khat | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | вход | fkhot | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | чай | chai | A single word, as it would appear inside a sentence. |
| word~word_beer | beer | пиво | PEE-vah | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | бокал вина | bah-KAHL vee-NAH | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | апельсиновый сок | ah-peel-SEE-nah-vy sok | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | меню | mee-NYOO | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | счёт | shchyot | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | сумка | SOOM-kah | A single word, as it would appear inside a sentence. |
| word~word_receipt | receipt | чек | chek | A single word, as it would appear inside a sentence. |
| word~word_water | water | вода | vah-DAH | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | кофе | KOH-feh | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | хлеб | khlyep | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | молоко | mah-lah-KOH | A single word, as it would appear inside a sentence. |
| word~word_ice | ice | лёд | lyot | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | орехи | ah-RYEH-khee | A single word, as it would appear inside a sentence. |
| word~word_gluten | gluten | глютен | glyoo-TEN | A single word, as it would appear inside a sentence. |
| word~word_shellfish | shellfish | морепродукты | mah-ree-prah-DOOK-ty | A single word, as it would appear inside a sentence. |
| word~word_eggs | eggs | яйца | YAI-tsah | A single word, as it would appear inside a sentence. |
| word~word_meat | meat | мясо | MYAH-sah | A single word, as it would appear inside a sentence. |
| word~word_dairy | dairy | молочные продукты | mah-LOCH-ny-yeh prah-DOOK-ty | A single word, as it would appear inside a sentence. |
| word~word_peanuts | peanuts | арахис | ah-RAH-khees | A single word, as it would appear inside a sentence. |
| word~word_passport | passport | паспорт | PAHS-pahrt | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | телефон | tee-lee-FON | A single word, as it would appear inside a sentence. |
| word~word_wallet | wallet | кошелёк | kah-shee-LYOK | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | ключи | klyoo-CHEE | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | билет | bee-LYET | A single word, as it would appear inside a sentence. |
| word~word_room_key | room key | ключ от номера | klyooch at NOH-mee-rah | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | кондиционер | kahn-dee-tsy-ah-NYER | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | душ | doosh | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | Wi-Fi | vai-FAI | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | телевизор | tee-lee-VEE-zahr | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | горячая вода | gah-RYAH-chah-yah vah-DAH | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | дверной замок | dveer-NOY zah-MOK | A single word, as it would appear inside a sentence. |
| word~word_one | one | один | ah-DEEN | A single word, as it would appear inside a sentence. |
| word~word_two | two | два | dvah | A single word, as it would appear inside a sentence. |
| word~word_three | three | три | tree | A single word, as it would appear inside a sentence. |
| word~word_four | four | четыре | chee-TY-ree | A single word, as it would appear inside a sentence. |
| word~word_five | five | пять | pyaht | A single word, as it would appear inside a sentence. |
| word~word_six | six | шесть | shest | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | семь | syem | A single word, as it would appear inside a sentence. |
| word~word_eight | eight | восемь | VOH-seem | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | девять | DYEH-veet | A single word, as it would appear inside a sentence. |
| word~word_ten | ten | десять | DYEH-seet | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | двадцать | DVAH-tsat | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | пятьдесят | pee-dee-SYAHT | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | сто | stoh | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | наверху | nah-veer-KHOO | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | внизу | vnee-ZOO | A single word, as it would appear inside a sentence. |
| word~word_near | near | близко | BLEES-kah | A single word, as it would appear inside a sentence. |
| word~word_far | far | далеко | dah-lee-KOH | A single word, as it would appear inside a sentence. |
| word~word_today | today | сегодня | see-VOD-nyah | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | завтра | ZAHF-trah | A single word, as it would appear inside a sentence. |
| word~word_now | now | сейчас | see-CHAHS | A single word, as it would appear inside a sentence. |
| word~word_later | later | позже | POZH-zheh | A single word, as it would appear inside a sentence. |
| word~word_open | open | открыто | aht-KRY-tah | A single word, as it would appear inside a sentence. |
| word~word_closed | closed | закрыто | zah-KRY-tah | A single word, as it would appear inside a sentence. |
| word~word_yes | yes | да | dah | A single word, as it would appear inside a sentence. |
| word~word_no | no | нет | nyet | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | наличные | nah-LEECH-ny-yeh | A single word, as it would appear inside a sentence. |
| word~word_card | card | карта | KAR-tah | A single word, as it would appear inside a sentence. |
