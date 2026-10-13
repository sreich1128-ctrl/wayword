# Review sheet: Japanese (198 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/ja.<tool>.json` (for example `ja.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of Japanese (Japan) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- register: Natural spoken Japanese for travellers. Polite です/ます forms are the default for strangers and service staff; selected social phrases are warmer or more casual where natural.
- pronunciation: English-speaker respelling. Long vowels are shown approximately; double consonants are reflected where useful. The kana reading is authoritative for reading practice.
- writing: target uses natural kanji + kana; reading gives the complete phrase in kana.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 198 keys, in order, and nothing else after the code block.

| key | English | draft | reading | pronunciation_easy | note |
|---|---|---|---|---|---|
| no_thank_you | No, thank you. | 大丈夫です、ありがとうございます。 | だいじょうぶです、ありがとうございます。 | dai-joh-boo des, ah-ree-gah-toh goh-zah-ee-mahs | Literally 'I'm fine, thank you': the most common polite way to decline an offer (a bag, a refill). いいえ、結構です is also correct but can sound stiff. |
| okay | Okay. | 分かりました。 | わかりました。 | wah-kah-ree-mah-shee-tah | Literally 'Understood.' Neutral, polite agreement. オーケー / はい、大丈夫です are also used. |
| table_for | A table for ___, please. | ___でお願いします。 | ___でおねがいします。 | ___ deh oh-neh-guy-shee-mahs | Frame: ___ is filled with a word. Literally '(We are) ___, please.' The blank takes a number of people with the people counter (一人 hitori, 二人 futari, 三人 sannin, 四人 yonin), not a bare number; one and two are irregular. Often said in reply to staff asking 何名様ですか？ |
| allergic_to | I'm allergic to ___. | ___アレルギーがあります。 | ___あれるぎーがあります。 | ___ ah-reh-roo-gee gah ah-ree-mahs | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'I have a ___ allergy.' The food word attaches directly as a compound (卵アレルギー = egg allergy). Standard, widely understood. For severe allergies, travellers should also show this in writing and ask about traces; this phrase does not say how severe the allergy is. |
| vegetarian | I'm vegetarian. | ベジタリアンです。 | べじたりあんです。 | beh-jee-tah-ree-ahn des | Literally 'I am a vegetarian.' Understood, but the concept is applied loosely in Japan: dashi (fish stock) is in many dishes. Clearer add-on: 肉と魚は食べられません (I can't eat meat or fish). |
| without | Without ___, please. | ___抜きでお願いします。 | ___ぬきでおねがいします。 | ___ noo-kee deh oh-neh-guy-shee-mahs | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'With ___ left out, please.' Standard ordering phrase (氷抜き, 肉抜き). ___なしで is an equally common alternative. It is a preference request only: it does not tell staff it is an allergy, so for allergies pair it with allergic_to. |
| to_go | To go, please. | 持ち帰りでお願いします。 | もちかえりでおねがいします。 | moh-chee-kah-eh-ree deh oh-neh-guy-shee-mahs | テイクアウトで is also common, especially at chains. |
| for_here | For here, please. | 店内でお願いします。 | てんないでおねがいします。 | ten-nai deh oh-neh-guy-shee-mahs | Literally 'In the shop, please.' Some chains say イートインで. |
| delicious | It was delicious. | おいしかったです。 | おいしかったです。 | oh-ee-shee-kaht-tah des | On leaving a restaurant, ごちそうさまでした (thank you for the meal) is the customary phrase and pairs well with this. |
| another_one | Another one, please. | もう一つお願いします。 | もうひとつおねがいします。 | moh hee-toh-tsoo oh-neh-guy-shee-mahs | 一つ is the general counter. For a drink, もう一杯 (moh eep-pai) is more precise; for a refill, おかわり. |
| ticket_to | A ticket to ___, please. | ___までの切符をお願いします。 | ___までのきっぷをおねがいします。 | ___ mah-deh noh keep-poo oh oh-neh-guy-shee-mahs | Frame: ___ is filled with a word. Literally 'A ticket as far as ___, please.' In practice the blank is a station name; most tickets come from machines or IC cards. |
| does_this_go_to | Does this go to ___? | これは___に行きますか？ | これは___にいきますか？ | koh-reh wah ___ nee ee-kee-mahs-kah | Frame: ___ is filled with a word. この電車 (this train) / このバス (this bus) in place of これ is more specific; ___に止まりますか？ (does it stop at ___) is also common. |
| take_me_to | Take me to ___, please. | ___までお願いします。 | ___までおねがいします。 | ___ mah-deh oh-neh-guy-shee-mahs | Frame: ___ is filled with a word. Literally '(Up) to ___, please': the standard taxi phrase. |
| stop_here | Stop here, please. | ここで止めてください。 | ここでとめてください。 | koh-koh deh toh-meh-teh koo-dah-sai | In a taxi, ここでお願いします is an equally common, softer alternative. |
| next_departure | When does the next one leave? | 次は何時に出ますか？ | つぎはなんじにでますか？ | tsoo-gee wah nan-jee nee deh-mahs-kah | Literally 'What time does the next one leave?' Clearer with the vehicle named: 次の電車は何時ですか？ (next train) / 次のバス (next bus). |
| which_platform | Which platform? | 何番線ですか？ | なんばんせんですか？ | nan-bahn-sen des-kah | 番線 is for train tracks. For buses, ask 何番乗り場ですか？ (which boarding bay). |
| how_long_trip | How long does it take? | どのくらいかかりますか？ | どのくらいかかりますか？ | doh-noh koo-rai kah-kah-ree-mahs-kah |  |
| one_way_or_return | One way or return? | 片道ですか、往復ですか？ | かたみちですか、おうふくですか？ | kah-tah-mee-chee des-kah, oh-foo-koo des-kah |  |
| left | Left. | 左です。 | ひだりです。 | hee-dah-ree des | Direction (turn left/right), not "correct". Direction: '(It's to the) left.' To a taxi driver: 左に曲がってください (please turn left). |
| right | Right. | 右です。 | みぎです。 | mee-gee des | Direction (turn left/right), not "correct". Direction: '(It's to the) right.' To a taxi driver: 右に曲がってください (please turn right). |
| straight_ahead | Straight ahead. | まっすぐです。 | まっすぐです。 | mahs-soo-goo des | Direction: '(It's) straight ahead.' To a taxi driver: まっすぐ行ってください. |
| im_lost | I'm lost. | 道に迷いました。 | みちにまよいました。 | mee-chee nee mah-yoh-ee-mah-shee-tah |  |
| show_on_map | Can you show me on the map? | 地図で教えてもらえますか？ | ちずでおしえてもらえますか？ | chee-zoo deh oh-shee-eh-teh moh-rah-eh-mahs-kah |  |
| near_here | Is it near here? | この近くですか？ | このちかくですか？ | koh-noh chee-kah-koo des-kah |  |
| have_reservation | I have a reservation. | 予約しています。 | よやくしています。 | yoh-yah-koo shee-teh ee-mahs |  |
| under_name | Under the name ___. | ___の名前で予約しています。 | ___のなまえでよやくしています。 | ___ noh nah-mah-eh deh yoh-yah-koo shee-teh ee-mahs | Frame: ___ is filled with a word. Literally 'I've booked under the name ___.' A foreign name in the blank is said as-is (written in katakana). |
| wifi_password | What's the Wi-Fi password? | Wi-Fiのパスワードは何ですか？ | わいふぁいのぱすわーどはなんですか？ | wai-fai noh pah-soo-wah-doh wah nan des-kah |  |
| checkout_time | What time is checkout? | チェックアウトは何時ですか？ | ちぇっくあうとはなんじですか？ | chek-koo-ah-oo-toh wah nan-jee des-kah |  |
| leave_bags | Can I leave my bags here? | 荷物を預かってもらえますか？ | にもつをあずかってもらえますか？ | nee-moh-tsoo oh ah-zoo-kaht-teh moh-rah-eh-mahs-kah | Literally 'Could you look after my luggage?': the standard hotel phrasing. |
| doesnt_work | The ___ doesn't work. | ___が使えません。 | ___がつかえません。 | ___ gah tsoo-kah-eh-mah-sen | Frame: ___ is filled with a word. Literally 'I can't use the ___': a general-purpose frame. Japanese prefers a specific verb per item, so the examples use つきません (won't turn on), 出ません (nothing comes out), つながりません (won't connect), 壊れています (is broken). |
| another_towel | Can I have another towel? | タオルをもう一枚もらえますか？ | たおるをもういちまいもらえますか？ | tah-oh-roo oh moh ee-chee-mai moh-rah-eh-mahs-kah |  |
| too_expensive | It's too expensive. | ちょっと高いです。 | ちょっとたかいです。 | chot-toh tah-kai des | Literally 'It's a bit expensive': the natural, softened way to say it. The literal 高すぎます (too expensive) is blunt. Haggling is uncommon in Japanese shops. |
| try_it_on | Can I try it on? | 試着してもいいですか？ | しちゃくしてもいいですか？ | shee-chah-koo shee-teh moh ee-ee des-kah |  |
| another_size | Do you have it in another size? | 他のサイズはありますか？ | ほかのさいずはありますか？ | hoh-kah noh sai-zoo wah ah-ree-mahs-kah |  |
| bag_please | A bag, please. | 袋をお願いします。 | ふくろをおねがいします。 | foo-koo-roh oh oh-neh-guy-shee-mahs | Shopping bags usually cost a few yen; staff often ask 袋はご利用ですか？ first. |
| haircut | A haircut, please. | カットをお願いします。 | かっとをおねがいします。 | kat-toh oh oh-neh-guy-shee-mahs |  |
| just_trim | Just a trim. | 少しだけ切ってください。 | すこしだけきってください。 | skoo-shee dah-keh keet-teh koo-dah-sai | Literally 'Please cut just a little.' Salons also say 毛先を整える程度で (just tidy the ends); reviewer may prefer that. |
| not_too_short | Not too short. | あまり短くしないでください。 | あまりみじかくしないでください。 | ah-mah-ree mee-jee-kah-koo shee-nai-deh koo-dah-sai |  |
| shorter_sides | Shorter on the sides. | 横を短めにしてください。 | よこをみじかめにしてください。 | yoh-koh oh mee-jee-kah-meh nee shee-teh koo-dah-sai | 横 (sides); サイド is also used at salons. |
| like_this | Like this. | こんな感じでお願いします。 | こんなかんじでおねがいします。 | kon-nah kahn-jee deh oh-neh-guy-shee-mahs |  |
| beard_trim | A beard trim, please. | ひげを整えてください。 | ひげをととのえてください。 | hee-geh oh toh-toh-noh-eh-teh koo-dah-sai | Literally 'Please tidy my beard.' Barbers (理容室) usually offer this; many hair salons (美容院) do not. |
| call_police | Call the police. | 警察を呼んでください！ | けいさつをよんでください！ | kay-sah-tsoo oh yon-deh koo-dah-sai | SAFETY: allergy/emergency. SAFETY. Back-translation: 'Please call the police!' Police number in Japan is 110; ambulance and fire is 119. A local police box is a 交番 (koban). |
| need_doctor | I need a doctor. | 医者が必要です。 | いしゃがひつようです。 | ee-shah gah hee-tsoo-yoh des | SAFETY: allergy/emergency. SAFETY. Back-translation: 'A doctor is necessary.' Clear and understood. In an urgent case, 救急車を呼んでください (please call an ambulance) is what people actually shout; 病院に行きたいです = 'I want to go to a hospital.' |
| where_pharmacy | Where is the pharmacy? | 薬局はどこですか？ | やっきょくはどこですか？ | yak-kyoh-koo wah doh-koh des-kah | SAFETY: allergy/emergency. SAFETY. Back-translation: 'Where is the pharmacy?' Over-the-counter medicine is mostly sold at ドラッグストア (drugstores), which locals may point you to. |
| its_emergency | It's an emergency. | 緊急です！ | きんきゅうです！ | keen-kyoo des | SAFETY: allergy/emergency. SAFETY. Back-translation: 'It's urgent / an emergency!' Understood; 急いでください (please hurry) is a natural follow-up. |
| lost_my | I lost my ___. | ___をなくしました。 | ___をなくしました。 | ___ oh nah-koo-shee-mah-shee-tah | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'I lost ___.' If it was stolen: ___を盗まれました. Lost property goes to the 交番 (police box) or the station's 忘れ物 (lost and found). |
| not_well | I don't feel well. | 体調が悪いです。 | たいちょうがわるいです。 | tai-choh gah wah-roo-ee des | SAFETY: allergy/emergency. SAFETY. Back-translation: 'My physical condition is bad' = I'm unwell. 気分が悪いです ('I feel bad/sick') is also common and leans toward nausea or feeling faint. |
| call_someone | I need to call someone. | 電話をかけないといけません。 | でんわをかけないといけません。 | den-wah oh kah-keh-nai toh ee-keh-mah-sen | SAFETY: allergy/emergency. SAFETY. Back-translation: 'I have to make a phone call.' Not fully sure this is the most natural card choice; to borrow a phone, 電話を貸してもらえますか？ (could you lend me a phone?) is more useful in practice. |
| where_is~word_bus_stop | Where is the bus stop? | バス停はどこですか？ | ばすていはどこですか？ | bah-soo-tay wah doh-koh des-kah |  |
| where_is~word_pharmacy | Where is the pharmacy? | 薬局はどこですか？ | やっきょくはどこですか？ | yak-kyoh-koo wah doh-koh des-kah |  |
| where_is~word_atm | Where is an ATM? | ATMはどこですか？ | えーてぃーえむはどこですか？ | eh-tee-eh-moo wah doh-koh des-kah |  |
| where_is~word_supermarket | Where is the supermarket? | スーパーはどこですか？ | すーぱーはどこですか？ | soo-pah wah doh-koh des-kah |  |
| nearest~word_pharmacy | Where is the nearest pharmacy? | 一番近い薬局はどこですか？ | いちばんちかいやっきょくはどこですか？ | ee-chee-bahn chee-kai yak-kyoh-koo wah doh-koh des-kah |  |
| nearest~word_atm | Where is the nearest ATM? | 一番近いATMはどこですか？ | いちばんちかいえーてぃーえむはどこですか？ | ee-chee-bahn chee-kai eh-tee-eh-moo wah doh-koh des-kah |  |
| nearest~word_supermarket | Where is the nearest supermarket? | 一番近いスーパーはどこですか？ | いちばんちかいすーぱーはどこですか？ | ee-chee-bahn chee-kai soo-pah wah doh-koh des-kah |  |
| nearest~word_metro_station | Where is the nearest metro station? | 一番近い地下鉄の駅はどこですか？ | いちばんちかいちかてつのえきはどこですか？ | ee-chee-bahn chee-kai chee-kah-teh-tsoo noh eh-kee wah doh-koh des-kah |  |
| how_get~word_airport | How do I get to the airport? | 空港にはどうやって行けばいいですか？ | くうこうにはどうやっていけばいいですか？ | koo-koh nee wah doh-yat-teh ee-keh-bah ee-ee des-kah |  |
| how_get~word_train_station | How do I get to the train station? | 駅にはどうやって行けばいいですか？ | えきにはどうやっていけばいいですか？ | eh-kee nee wah doh-yat-teh ee-keh-bah ee-ee des-kah |  |
| how_get~word_city_centre | How do I get to the city centre? | 中心街にはどうやって行けばいいですか？ | ちゅうしんがいにはどうやっていけばいいですか？ | choo-sheen-guy nee wah doh-yat-teh ee-keh-bah ee-ee des-kah |  |
| how_get~word_beach | How do I get to the beach? | ビーチにはどうやって行けばいいですか？ | びーちにはどうやっていけばいいですか？ | bee-chee nee wah doh-yat-teh ee-keh-bah ee-ee des-kah |  |
| how_get~word_hotel | How do I get to the hotel? | ホテルにはどうやって行けばいいですか？ | ほてるにはどうやっていけばいいですか？ | hoh-teh-roo nee wah doh-yat-teh ee-keh-bah ee-ee des-kah |  |
| can_i_have~word_tea | Can I have a tea, please? | お茶をお願いします。 | おちゃをおねがいします。 | oh-chah oh oh-neh-guy-shee-mahs |  |
| can_i_have~word_beer | Can I have a beer, please? | ビールをお願いします。 | びーるをおねがいします。 | bee-roo oh oh-neh-guy-shee-mahs |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | グラスワインをお願いします。 | ぐらすわいんをおねがいします。 | goo-rah-soo wain oh oh-neh-guy-shee-mahs |  |
| can_i_have~word_orange_juice | Can I have an orange juice, please? | オレンジジュースをお願いします。 | おれんじじゅーすをおねがいします。 | oh-ren-jee joo-soo oh oh-neh-guy-shee-mahs |  |
| can_i_have~word_menu | Can I have the menu, please? | メニューをお願いします。 | めにゅーをおねがいします。 | meh-nyoo oh oh-neh-guy-shee-mahs |  |
| can_i_have~word_receipt | Can I have a receipt, please? | レシートをお願いします。 | れしーとをおねがいします。 | reh-shee-toh oh oh-neh-guy-shee-mahs |  |
| i_would_like~word_tea | I'd like a tea, please. | お茶をお願いします。 | おちゃをおねがいします。 | oh-chah oh oh-neh-guy-shee-mahs |  |
| i_would_like~word_beer | I'd like a beer, please. | ビールをお願いします。 | びーるをおねがいします。 | bee-roo oh oh-neh-guy-shee-mahs |  |
| i_would_like~word_glass_of_wine | I'd like a glass of wine, please. | グラスワインをお願いします。 | ぐらすわいんをおねがいします。 | goo-rah-soo wain oh oh-neh-guy-shee-mahs |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | オレンジジュースをお願いします。 | おれんじじゅーすをおねがいします。 | oh-ren-jee joo-soo oh oh-neh-guy-shee-mahs |  |
| i_would_like~word_bread | I'd like some bread, please. | パンをお願いします。 | ぱんをおねがいします。 | pahn oh oh-neh-guy-shee-mahs |  |
| i_would_like~word_water | I'd like some water, please. | お水をお願いします。 | おみずをおねがいします。 | oh-mee-zoo oh oh-neh-guy-shee-mahs |  |
| table_for~word_one | A table for one, please. | 一人でお願いします。 | ひとりでおねがいします。 | hee-toh-ree deh oh-neh-guy-shee-mahs |  |
| table_for~word_two | A table for two, please. | 二人でお願いします。 | ふたりでおねがいします。 | foo-tah-ree deh oh-neh-guy-shee-mahs |  |
| table_for~word_three | A table for three, please. | 三人でお願いします。 | さんにんでおねがいします。 | sahn-neen deh oh-neh-guy-shee-mahs |  |
| table_for~word_four | A table for four, please. | 四人でお願いします。 | よにんでおねがいします。 | yoh-neen deh oh-neh-guy-shee-mahs |  |
| allergic_to~word_nuts | I'm allergic to nuts. | ナッツアレルギーがあります。 | なっつあれるぎーがあります。 | nat-tsoo ah-reh-roo-gee gah ah-ree-mahs | SAFETY: allergy/emergency. |
| allergic_to~word_peanuts | I'm allergic to peanuts. | ピーナッツアレルギーがあります。 | ぴーなっつあれるぎーがあります。 | pee-nat-tsoo ah-reh-roo-gee gah ah-ree-mahs | SAFETY: allergy/emergency. |
| allergic_to~word_gluten | I'm allergic to gluten. | グルテンアレルギーがあります。 | ぐるてんあれるぎーがあります。 | goo-roo-ten ah-reh-roo-gee gah ah-ree-mahs | SAFETY: allergy/emergency. |
| allergic_to~word_shellfish | I'm allergic to shellfish. | 甲殻類アレルギーがあります。 | こうかくるいあれるぎーがあります。 | koh-kah-koo-roo-ee ah-reh-roo-gee gah ah-ree-mahs | SAFETY: allergy/emergency. |
| allergic_to~word_milk | I'm allergic to milk. | 牛乳アレルギーがあります。 | ぎゅうにゅうあれるぎーがあります。 | gyoo-nyoo ah-reh-roo-gee gah ah-ree-mahs | SAFETY: allergy/emergency. |
| allergic_to~word_eggs | I'm allergic to eggs. | 卵アレルギーがあります。 | たまごあれるぎーがあります。 | tah-mah-goh ah-reh-roo-gee gah ah-ree-mahs | SAFETY: allergy/emergency. |
| without~word_meat | Without meat, please. | 肉抜きでお願いします。 | にくぬきでおねがいします。 | nee-koo noo-kee deh oh-neh-guy-shee-mahs | SAFETY: allergy/emergency. |
| without~word_milk | Without milk, please. | 牛乳抜きでお願いします。 | ぎゅうにゅうぬきでおねがいします。 | gyoo-nyoo noo-kee deh oh-neh-guy-shee-mahs | SAFETY: allergy/emergency. |
| without~word_gluten | Without gluten, please. | グルテン抜きでお願いします。 | ぐるてんぬきでおねがいします。 | goo-roo-ten noo-kee deh oh-neh-guy-shee-mahs | SAFETY: allergy/emergency. |
| without~word_ice | Without ice, please. | 氷抜きでお願いします。 | こおりぬきでおねがいします。 | koh-ree noo-kee deh oh-neh-guy-shee-mahs | SAFETY: allergy/emergency. |
| without~word_nuts | Without nuts, please. | ナッツ抜きでお願いします。 | なっつぬきでおねがいします。 | nat-tsoo noo-kee deh oh-neh-guy-shee-mahs | SAFETY: allergy/emergency. |
| ticket_to~word_airport | A ticket to the airport, please. | 空港までの切符をお願いします。 | くうこうまでのきっぷをおねがいします。 | koo-koh mah-deh noh keep-poo oh oh-neh-guy-shee-mahs |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | 中心街までの切符をお願いします。 | ちゅうしんがいまでのきっぷをおねがいします。 | choo-sheen-guy mah-deh noh keep-poo oh oh-neh-guy-shee-mahs |  |
| ticket_to~word_beach | A ticket to the beach, please. | ビーチまでの切符をお願いします。 | びーちまでのきっぷをおねがいします。 | bee-chee mah-deh noh keep-poo oh oh-neh-guy-shee-mahs |  |
| ticket_to~word_train_station | A ticket to the train station, please. | 駅までの切符をお願いします。 | えきまでのきっぷをおねがいします。 | eh-kee mah-deh noh keep-poo oh oh-neh-guy-shee-mahs |  |
| does_this_go_to~word_airport | Does this go to the airport? | これは空港に行きますか？ | これはくうこうにいきますか？ | koh-reh wah koo-koh nee ee-kee-mahs-kah |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | これは中心街に行きますか？ | これはちゅうしんがいにいきますか？ | koh-reh wah choo-sheen-guy nee ee-kee-mahs-kah |  |
| does_this_go_to~word_beach | Does this go to the beach? | これはビーチに行きますか？ | これはびーちにいきますか？ | koh-reh wah bee-chee nee ee-kee-mahs-kah |  |
| does_this_go_to~word_train_station | Does this go to the train station? | これは駅に行きますか？ | これはえきにいきますか？ | koh-reh wah eh-kee nee ee-kee-mahs-kah |  |
| take_me_to~word_airport | Take me to the airport, please. | 空港までお願いします。 | くうこうまでおねがいします。 | koo-koh mah-deh oh-neh-guy-shee-mahs |  |
| take_me_to~word_hotel | Take me to the hotel, please. | ホテルまでお願いします。 | ほてるまでおねがいします。 | hoh-teh-roo mah-deh oh-neh-guy-shee-mahs |  |
| take_me_to~word_train_station | Take me to the train station, please. | 駅までお願いします。 | えきまでおねがいします。 | eh-kee mah-deh oh-neh-guy-shee-mahs |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | 中心街までお願いします。 | ちゅうしんがいまでおねがいします。 | choo-sheen-guy mah-deh oh-neh-guy-shee-mahs |  |
| take_me_to~word_beach | Take me to the beach, please. | ビーチまでお願いします。 | びーちまでおねがいします。 | bee-chee mah-deh oh-neh-guy-shee-mahs |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | エアコンがつきません。 | えあこんがつきません。 | eh-ah-kon gah tsoo-kee-mah-sen |  |
| doesnt_work~word_shower | The shower doesn't work. | シャワーが出ません。 | しゃわーがでません。 | shah-wah gah deh-mah-sen |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | Wi-Fiがつながりません。 | わいふぁいがつながりません。 | wai-fai gah tsoo-nah-gah-ree-mah-sen |  |
| doesnt_work~word_tv | The TV doesn't work. | テレビがつきません。 | てれびがつきません。 | teh-reh-bee gah tsoo-kee-mah-sen |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | お湯が出ません。 | おゆがでません。 | oh-yoo gah deh-mah-sen |  |
| doesnt_work~word_door_lock | The door lock doesn't work. | ドアの鍵が壊れています。 | どあのかぎがこわれています。 | doh-ah noh kah-gee gah koh-wah-reh-teh ee-mahs |  |
| lost_my~word_passport | I lost my passport. | パスポートをなくしました。 | ぱすぽーとをなくしました。 | pah-soo-poh-toh oh nah-koo-shee-mah-shee-tah | SAFETY: allergy/emergency. |
| lost_my~word_phone | I lost my phone. | 携帯をなくしました。 | けいたいをなくしました。 | kay-tai oh nah-koo-shee-mah-shee-tah | SAFETY: allergy/emergency. |
| lost_my~word_wallet | I lost my wallet. | 財布をなくしました。 | さいふをなくしました。 | sai-foo oh nah-koo-shee-mah-shee-tah | SAFETY: allergy/emergency. |
| lost_my~word_bag | I lost my bag. | かばんをなくしました。 | かばんをなくしました。 | kah-bahn oh nah-koo-shee-mah-shee-tah | SAFETY: allergy/emergency. |
| lost_my~word_keys | I lost my keys. | 鍵をなくしました。 | かぎをなくしました。 | kah-gee oh nah-koo-shee-mah-shee-tah | SAFETY: allergy/emergency. |
| lost_my~word_room_key | I lost my room key. | 部屋の鍵をなくしました。 | へやのかぎをなくしました。 | heh-yah noh kah-gee oh nah-koo-shee-mah-shee-tah | SAFETY: allergy/emergency. |
| reply~for_here_or_to_go | For here or to go? | 店内でお召し上がりですか、お持ち帰りですか？ | てんないでおめしあがりですか、おもちかえりですか？ | ten-nai deh oh-meh-shee-ah-gah-ree des-kah, oh-moh-chee-kah-eh-ree des-kah | Said TO the traveller by staff. |
| reply~anything_else | Anything else? | ご注文は以上でよろしいですか？ | ごちゅうもんはいじょうでよろしいですか？ | goh-choo-mon wah ee-joh deh yoh-roh-shee des-kah | Said TO the traveller by staff. Literally 'Is that everything for your order?': what staff actually say. |
| reply~here_you_go | Here you go. | どうぞ。 | どうぞ。 | doh-zoh | Said TO the traveller by staff. |
| reply~inside_or_outside | Inside or outside? | 中の席と外の席、どちらがよろしいですか？ | なかのせきとそとのせき、どちらがよろしいですか？ | nah-kah noh seh-kee toh soh-toh noh seh-kee, doh-chee-rah gah yoh-roh-shee des-kah | Said TO the traveller by staff. Literally 'Inside seats or outside seats, which would you prefer?' Outdoor seating is less common in Japan; some places say 店内とテラス席. |
| reply~have_booking | Do you have a reservation? | ご予約はされていますか？ | ごよやくはされていますか？ | goh-yoh-yah-koo wah sah-reh-teh ee-mahs-kah | Said TO the traveller by staff. ご予約はございますか？ is an equally common, more formal variant. |
| reply~this_way | This way. | こちらへどうぞ。 | こちらへどうぞ。 | koh-chee-rah eh doh-zoh | Said TO the traveller by staff. |
| reply~next_stop | Next stop. | 次、止まります。 | つぎ、とまります。 | tsoo-gee, toh-mah-ree-mahs | Said TO the traveller by staff. Bus recording after someone presses the stop button: 'Stopping at the next stop.' Train announcements instead say 次は___です (next is ___). Reviewer: confirm this is the best fit for 'Next stop.' |
| reply~its_closed | It's closed. | 閉まっています。 | しまっています。 | shee-maht-teh ee-mahs | Said TO the traveller by staff. |
| reply~one_moment | One moment, please. | 少々お待ちください。 | しょうしょうおまちください。 | shoh-shoh oh-mah-chee koo-dah-sai | Said TO the traveller by staff. |
| reply~what_size | What size? | サイズはおいくつですか？ | さいずはおいくつですか？ | sai-zoo wah oh-ee-koo-tsoo des-kah | Said TO the traveller by staff. Clothing/shoe size. At a café, staff ask サイズはいかがなさいますか？ instead. |
| reply~receipt_question | Would you like a receipt? | レシートはご入用ですか？ | れしーとはごいりようですか？ | reh-shee-toh wah goh-ee-ree-yoh des-kah | Said TO the traveller by staff. Several variants are common: レシートはご利用ですか？, レシートはいりますか？ Note レシートはよろしいですか？ usually means 'You don't need a receipt, right?' |
| reply~how_would_you_like_it | How would you like it cut? | 今日はどうなさいますか？ | きょうはどうなさいますか？ | kyoh wah doh nah-sai-mahs-kah | Said TO the traveller by staff. Literally 'What will you have done today?': the usual salon opener. |
| word~word_train_station | train station | 駅 | えき | eh-kee | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | バス停 | ばすてい | bah-soo-tay | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | 空港 | くうこう | koo-koh | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | 地下鉄の駅 | ちかてつのえき | chee-kah-teh-tsoo noh eh-kee | A single word, as it would appear inside a sentence. |
| word~word_hotel | hotel | ホテル | ほてる | hoh-teh-roo | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | ビーチ | びーち | bee-chee | A single word, as it would appear inside a sentence. 海 (sea) is also commonly used for 'the beach'. |
| word~word_city_centre | city centre | 中心街 | ちゅうしんがい | choo-sheen-guy | A single word, as it would appear inside a sentence. Understood as 'downtown', but Japanese speakers usually name the district or main station (e.g. 新宿, 博多駅) rather than 'city centre'. |
| word~word_pharmacy | pharmacy | 薬局 | やっきょく | yak-kyoh-koo | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | ATM | えーてぃーえむ | eh-tee-eh-moo | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | スーパー | すーぱー | soo-pah | A single word, as it would appear inside a sentence. |
| word~word_platform | platform | ホーム | ほーむ | hoh-moo | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | 切符売り場 | きっぷうりば | keep-poo oo-ree-bah | A single word, as it would appear inside a sentence. At JR stations the staffed ticket office is みどりの窓口. |
| word~word_exit | exit | 出口 | でぐち | deh-goo-chee | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | 入口 | いりぐち | ee-ree-goo-chee | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | お茶 | おちゃ | oh-chah | A single word, as it would appear inside a sentence. お茶 is usually green tea; black tea is 紅茶 (koh-chah). |
| word~word_beer | beer | ビール | びーる | bee-roo | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | グラスワイン | ぐらすわいん | goo-rah-soo wain | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | オレンジジュース | おれんじじゅーす | oh-ren-jee joo-soo | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | メニュー | めにゅー | meh-nyoo | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | お会計 | おかいけい | oh-kai-kay | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | かばん | かばん | kah-bahn | A single word, as it would appear inside a sentence. かばん = one's own bag (belongings sense). A shopping/carrier bag is 袋 (foo-koo-roh). |
| word~word_receipt | receipt | レシート | れしーと | reh-shee-toh | A single word, as it would appear inside a sentence. A formal receipt for expenses is 領収書 (ryoh-shoo-shoh). |
| word~word_water | water | お水 | おみず | oh-mee-zoo | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | コーヒー | こーひー | koh-hee | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | パン | ぱん | pahn | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | 牛乳 | ぎゅうにゅう | gyoo-nyoo | A single word, as it would appear inside a sentence. SAFETY. Literally 'cow's milk'. ミルク is also used (e.g. for coffee). |
| word~word_ice | ice | 氷 | こおり | koh-ree | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | ナッツ | なっつ | nat-tsoo | A single word, as it would appear inside a sentence. SAFETY. Back-translation: 'nuts' (loanword). Standard; covers tree nuts generally. Peanuts are a separate word (ピーナッツ / 落花生). |
| word~word_gluten | gluten | グルテン | ぐるてん | goo-roo-ten | A single word, as it would appear inside a sentence. SAFETY. Back-translation: 'gluten' (loanword). Less widely understood than 小麦 (koh-moo-gee, wheat), which is the allergen Japanese food labels list. Consider teaching 小麦 alongside it. |
| word~word_shellfish | shellfish | 甲殻類 | こうかくるい | koh-kah-koo-roo-ee | A single word, as it would appear inside a sentence. SAFETY. Back-translation: 'crustaceans' (shrimp, crab, lobster): the standard allergy term. Molluscs (clams, oysters, scallops) are 貝類 (kai-roo-ee); English 'shellfish' covers both. Labels list えび (shrimp) and かに (crab). |
| word~word_eggs | eggs | 卵 | たまご | tah-mah-goh | A single word, as it would appear inside a sentence. SAFETY. Back-translation: 'egg(s)'. |
| word~word_meat | meat | 肉 | にく | nee-koo | A single word, as it would appear inside a sentence. SAFETY. Back-translation: 'meat'. Does not include fish or fish stock (dashi). |
| word~word_dairy | dairy | 乳製品 | にゅうせいひん | nyoo-say-heen | A single word, as it would appear inside a sentence. SAFETY. Back-translation: 'milk products'. Same word as the existing dairy card. |
| word~word_peanuts | peanuts | ピーナッツ | ぴーなっつ | pee-nat-tsoo | A single word, as it would appear inside a sentence. SAFETY. Back-translation: 'peanuts' (loanword). Food labels use 落花生 (rak-kah-say). |
| word~word_passport | passport | パスポート | ぱすぽーと | pah-soo-poh-toh | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | 携帯 | けいたい | kay-tai | A single word, as it would appear inside a sentence. Short for 携帯電話 (mobile phone). スマホ (smartphone) is equally common. |
| word~word_wallet | wallet | 財布 | さいふ | sai-foo | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | 鍵 | かぎ | kah-gee | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | 切符 | きっぷ | keep-poo | A single word, as it would appear inside a sentence. 切符 is a transport ticket; for events, チケット. |
| word~word_room_key | room key | 部屋の鍵 | へやのかぎ | heh-yah noh kah-gee | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | エアコン | えあこん | eh-ah-kon | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | シャワー | しゃわー | shah-wah | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | Wi-Fi | わいふぁい | wai-fai | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | テレビ | てれび | teh-reh-bee | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | お湯 | おゆ | oh-yoo | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | ドアの鍵 | どあのかぎ | doh-ah noh kah-gee | A single word, as it would appear inside a sentence. |
| word~word_one | one | 一 | いち | ee-chee | A single word, as it would appear inside a sentence. |
| word~word_two | two | 二 | に | nee | A single word, as it would appear inside a sentence. |
| word~word_three | three | 三 | さん | sahn | A single word, as it would appear inside a sentence. |
| word~word_four | four | 四 | よん | yon | A single word, as it would appear inside a sentence. し (shee) is the other reading; よん is safer in speech. |
| word~word_five | five | 五 | ご | goh | A single word, as it would appear inside a sentence. |
| word~word_six | six | 六 | ろく | roh-koo | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | 七 | なな | nah-nah | A single word, as it would appear inside a sentence. しち (shee-chee) is the other reading; なな is clearer in speech. |
| word~word_eight | eight | 八 | はち | hah-chee | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | 九 | きゅう | kyoo | A single word, as it would appear inside a sentence. く (koo) is the other reading. |
| word~word_ten | ten | 十 | じゅう | joo | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | 二十 | にじゅう | nee-joo | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | 五十 | ごじゅう | goh-joo | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | 百 | ひゃく | hyah-koo | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | 上の階 | うえのかい | oo-eh noh kai | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | 下の階 | したのかい | shee-tah noh kai | A single word, as it would appear inside a sentence. |
| word~word_near | near | 近い | ちかい | chee-kai | A single word, as it would appear inside a sentence. |
| word~word_far | far | 遠い | とおい | toh-ee | A single word, as it would appear inside a sentence. |
| word~word_today | today | 今日 | きょう | kyoh | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | 明日 | あした | ah-shee-tah | A single word, as it would appear inside a sentence. |
| word~word_now | now | 今 | いま | ee-mah | A single word, as it would appear inside a sentence. |
| word~word_later | later | 後で | あとで | ah-toh-deh | A single word, as it would appear inside a sentence. |
| word~word_open | open | 開いています | あいています | ai-teh ee-mahs | A single word, as it would appear inside a sentence. Spoken form ('it's open'). Shop signs say 営業中 (ay-gyoh-choo). |
| word~word_closed | closed | 閉まっています | しまっています | shee-maht-teh ee-mahs | A single word, as it would appear inside a sentence. Spoken form ('it's closed'). Signs say 準備中 (preparing) or 定休日 (regular day off). |
| word~word_yes | yes | はい | はい | high | A single word, as it would appear inside a sentence. |
| word~word_no | no | いいえ | いいえ | ee-eh | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | 現金 | げんきん | gen-keen | A single word, as it would appear inside a sentence. |
| word~word_card | card | カード | かーど | kah-doh | A single word, as it would appear inside a sentence. |
