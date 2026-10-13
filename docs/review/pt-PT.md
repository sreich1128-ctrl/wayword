# Review sheet: European Portuguese (184 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/pt-PT.<tool>.json` (for example `pt-PT.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of European Portuguese (Portugal) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- bathroom: Brazil: banheiro. Portugal: casa de banho.
- dont_understand: Brazil commonly: Não entendo.
- and_you: In informal Portugal, 'E tu?' is common; 'você' usage differs by region/register.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 184 keys, in order, and nothing else after the code block.

| key | English | draft | pronunciation_easy | note |
|---|---|---|---|---|
| table_for | A table for ___, please. | Uma mesa para ___, por favor. | OO-mah MEH-zah PAH-rah, poor fah-VOR | Frame: ___ is filled with a word. The blank needs the number plus pessoa/pessoas, and the number agrees with feminine 'pessoa': uma pessoa, duas pessoas, três pessoas. A bare number ('para dois') is also heard but 'duas pessoas' is the safe form. |
| menu_please | The menu, please. | A ementa, por favor. | ah ee-MEN-tah, poor fah-VOR | Ementa is the Portugal word (Brazil: cardápio). 'A carta' is also used in restaurants; 'o menu' in Portugal often means a set meal. |
| allergic_to | I'm allergic to ___. | Sou alérgico a ___. | soh ah-LEHR-zhee-koo ah | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Literal: 'I am allergic to ___.' Masculine speaker; a woman says 'Sou alérgica a ___.' The 'a' contracts with an article: a + o = ao (ao glúten, ao leite), a + a = à, a + os = aos; with a bare plural it stays 'a' (a frutos secos). 'Tenho alergia a ___' (I have an allergy to) is an equally common alternative. |
| without | Without ___, please. | Sem ___, por favor. | seng, poor fah-VOR | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Literal: 'Without ___, please.' The noun goes in with no article (sem carne, sem leite). For a real allergy, pair it with 'Sou alérgico a ___' so staff understand it is not just a preference. |
| to_go | To go, please. | Para levar, por favor. | PAH-rah luh-VAR, poor fah-VOR |  |
| for_here | For here, please. | Para comer aqui, por favor. | PAH-rah koo-MEHR ah-KEE, poor fah-VOR | Literally 'to eat here'. For a drink only, 'Para beber aqui' fits better; 'É para aqui' is also heard. |
| another_one | Another one, please. | Mais um, por favor. | mysh oong, poor fah-VOR | Agrees with the item: 'Mais um' for a masculine noun (café, copo), 'Mais uma' for a feminine one (cerveja, água). 'Outro/Outra, por favor' also works. |
| ticket_to | A ticket to ___, please. | Um bilhete para ___, por favor. | oong bee-LYEH-tuh PAH-rah, poor fah-VOR | Frame: ___ is filled with a word. 'para' never contracts in writing, so the article goes inside the blank (para o aeroporto, para a praia). City names usually take no article (para Sintra), except a few like o Porto. |
| does_this_go_to | Does this go to ___? | Vai para ___? | vy PAH-rah | Frame: ___ is filled with a word. Literally 'Does it go to ___?', said pointing at or to the driver of the bus/train; this avoids a gendered 'este/esta'. Fuller: 'Este autocarro vai para ___?' / 'Este comboio vai para ___?'. Article goes inside the blank (para o aeroporto). |
| take_me_to | Take me to ___, please. | Leve-me a ___, por favor. | LEH-vuh-muh ah, poor fah-VOR | Frame: ___ is filled with a word. 'a' contracts with the article: ao aeroporto, à praia, ao hotel. In a taxi many people simply say 'Para o aeroporto, por favor.' |
| stop_here | Stop here, please. | Pare aqui, por favor. | PAH-ruh ah-KEE, poor fah-VOR |  |
| next_departure | When does the next one leave? | Quando sai o próximo? | KWAN-doo sy oo PROH-see-moo | Masculine 'o próximo' assumes comboio/autocarro (both masculine); for a feminine noun (a camioneta) it is 'a próxima'. Note: próximo is said PROH-see-moo (x = s); the existing 'nearest' entry respells it PROK-see-moo, which a reviewer may want to fix. |
| which_platform | Which platform? | Qual é a linha? | kwal eh ah LEE-nyah | Portuguese train stations (CP) label platforms 'Linha' (track). 'Plataforma' or 'cais' are understood but less used on signs. |
| how_long_trip | How long does it take? | Quanto tempo demora? | KWAN-too TEN-poo duh-MOH-rah |  |
| one_way_or_return | One way or return? | Só ida ou ida e volta? | saw EE-dah oh EE-dah ee VOL-tah |  |
| left | Left. | À esquerda. | ah esh-KEHR-dah | Direction (turn left/right), not "correct". |
| right | Right. | À direita. | ah dee-RAY-tah | Direction (turn left/right), not "correct". |
| straight_ahead | Straight ahead. | Sempre em frente. | SEN-pruh eng FREN-tuh | 'Sempre em frente' (keep going straight) is the stock direction phrase; plain 'Em frente' is also correct. |
| show_on_map | Can you show me on the map? | Pode mostrar-me no mapa? | POH-duh moosh-TRAR-muh noo MAH-pah |  |
| near_here | Is it near here? | É perto daqui? | eh PEHR-too dah-KEE |  |
| under_name | Under the name ___. | Em nome de ___. | eng NOH-muh duh | Frame: ___ is filled with a word. Names take no article here. Fuller form: 'Está em nome de ___.' |
| wifi_password | What's the Wi-Fi password? | Qual é a palavra-passe do Wi-Fi? | kwal eh ah pah-LAH-vrah-PAH-suh doo WY-fy | Palavra-passe is the Portugal term (Brazil: senha); the English 'password' is also widely used. Wi-Fi is usually said 'WY-fy' in Portugal, though some say 'WEE-fee'; reviewer to confirm. |
| checkout_time | What time is checkout? | A que horas é o check-out? | ah keh OH-rahsh eh oo check-out |  |
| leave_bags | Can I leave my bags here? | Posso deixar as malas aqui? | POH-soo day-SHAR ahsh MAH-lahsh ah-KEE |  |
| doesnt_work | The ___ doesn't work. | ___ não funciona. | nowng foon-see-OH-nah | Frame: ___ is filled with a word. The blank is the noun with its article (O ar condicionado, A televisão). A plural noun needs 'não funcionam'. 'Não está a funcionar' (isn't working right now) is equally natural. |
| another_towel | Can I have another towel? | Pode dar-me outra toalha? | POH-duh DAR-muh OH-trah too-AH-lyah | Literally 'Can you give me another towel?', the natural request form; 'Posso ter outra toalha?' mirrors the English more closely but sounds a bit translated. |
| just_looking | I'm just looking. | Estou só a ver. | esh-TOH saw ah VEHR |  |
| ill_take_it | I'll take it. | Vou levar isto. | voh luh-VAR EESH-too | Neutral 'isto' avoids gender. Also common: 'Fico com este/esta' or just 'Levo.' |
| try_it_on | Can I try it on? | Posso experimentar? | POH-soo esh-puh-ree-men-TAR |  |
| another_size | Do you have it in another size? | Tem noutro tamanho? | teng NOH-troo tah-MAH-nyoo |  |
| bag_please | A bag, please. | Um saco, por favor. | oong SAH-koo, poor fah-VOR |  |
| haircut | A haircut, please. | Queria cortar o cabelo, por favor. | kuh-REE-ah koor-TAR oo kah-BEH-loo, poor fah-VOR |  |
| just_trim | Just a trim. | Só aparar as pontas. | saw ah-pah-RAR ahsh PON-tahsh | Literally 'Just trim the ends.' Natural at a hairdresser; a barber would also understand 'Só aparar.' |
| not_too_short | Not too short. | Não muito curto. | nowng MWEEN-too KOOR-too |  |
| shorter_sides | Shorter on the sides. | Mais curto dos lados. | mysh KOOR-too doosh LAH-doosh |  |
| like_this | Like this. | Assim. | ah-SEENG | Said while showing the photo. Fuller: 'Assim, como nesta foto.' (Like this, as in this photo.) |
| beard_trim | A beard trim, please. | Aparar a barba, por favor. | ah-pah-RAR ah BAR-bah, poor fah-VOR |  |
| where_pharmacy | Where is the pharmacy? | Onde fica a farmácia? | ON-duh FEE-kah ah far-MAH-see-ah | SAFETY: allergy/emergency. SAFETY. Literal: 'Where is the pharmacy?' For any open one: 'Onde fica a farmácia mais próxima?' (nearest). |
| lost_my | I lost my ___. | Perdi ___. | puhr-DEE | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Literal: 'I lost ___.' The possessive goes in the blank and agrees with the noun: o meu passaporte, a minha carteira, as minhas chaves. 'Perdi-me' would mean 'I got lost', so the object must follow. |
| not_well | I don't feel well. | Não me sinto bem. | nowng muh SEEN-too beng | SAFETY: allergy/emergency. SAFETY. Literal: 'I don't feel myself well' = I don't feel well. |
| call_someone | I need to call someone. | Preciso de ligar a alguém. | pruh-SEE-zoo duh lee-GAR ah al-GAYNG | SAFETY: allergy/emergency. SAFETY. Literal: 'I need to call (phone) someone.' 'Ligar a' = phone; 'telefonar a alguém' is an equivalent. |
| where_is~word_train_station | Where is the train station? | Onde fica a estação de comboios? | ON-duh FEE-kah ah esh-tah-SOWNG duh kong-BOY-oosh |  |
| where_is~word_bus_stop | Where is the bus stop? | Onde fica a paragem de autocarro? | ON-duh FEE-kah ah pah-RAH-zhayng duh ow-toh-KAH-roo |  |
| where_is~word_pharmacy | Where is the pharmacy? | Onde fica a farmácia? | ON-duh FEE-kah ah far-MAH-see-ah |  |
| where_is~word_atm | Where is an ATM? | Onde fica o multibanco? | ON-duh FEE-kah oo mool-tee-BAN-koo |  |
| where_is~word_supermarket | Where is the supermarket? | Onde fica o supermercado? | ON-duh FEE-kah oo soo-pehr-mehr-KAH-doo |  |
| nearest~word_atm | Where is the nearest ATM? | Onde fica o multibanco mais próximo? | ON-duh FEE-kah oo mool-tee-BAN-koo mysh PROH-see-moo |  |
| nearest~word_metro_station | Where is the nearest metro station? | Onde fica a estação de metro mais próxima? | ON-duh FEE-kah ah esh-tah-SOWNG duh MEH-troo mysh PROH-see-mah |  |
| nearest~word_bus_stop | Where is the nearest bus stop? | Onde fica a paragem de autocarro mais próxima? | ON-duh FEE-kah ah pah-RAH-zhayng duh ow-toh-KAH-roo mysh PROH-see-mah |  |
| how_get~word_airport | How do I get to the airport? | Como chego ao aeroporto? | KOH-moo SHEH-goo ow ah-eh-roo-POR-too |  |
| how_get~word_train_station | How do I get to the train station? | Como chego à estação de comboios? | KOH-moo SHEH-goo ah esh-tah-SOWNG duh kong-BOY-oosh |  |
| how_get~word_city_centre | How do I get to the city centre? | Como chego ao centro da cidade? | KOH-moo SHEH-goo ow SEN-troo dah see-DAH-duh |  |
| how_get~word_beach | How do I get to the beach? | Como chego à praia? | KOH-moo SHEH-goo ah PRY-ah |  |
| how_get~word_hotel | How do I get to the hotel? | Como chego ao hotel? | KOH-moo SHEH-goo ow oh-TEL |  |
| can_i_have~word_tea | Can I have a tea, please? | Posso ter um chá, por favor? | POH-soo tehr oong SHAH, poor fah-VOR |  |
| can_i_have~word_beer | Can I have a beer, please? | Posso ter uma cerveja, por favor? | POH-soo tehr OO-mah suhr-VAY-zhah, poor fah-VOR |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | Posso ter um copo de vinho, por favor? | POH-soo tehr oong KOH-poo duh VEE-nyoo, poor fah-VOR |  |
| can_i_have~word_orange_juice | Can I have an orange juice, please? | Posso ter um sumo de laranja, por favor? | POH-soo tehr oong SOO-moo duh lah-RAN-zhah, poor fah-VOR |  |
| can_i_have~word_menu | Can I have the menu, please? | Posso ter a ementa, por favor? | POH-soo tehr ah ee-MEN-tah, poor fah-VOR |  |
| can_i_have~word_receipt | Can I have a receipt, please? | Posso ter o recibo, por favor? | POH-soo tehr oo ruh-SEE-boo, poor fah-VOR |  |
| i_would_like~word_tea | I'd like a tea, please. | Queria um chá, por favor. | kuh-REE-ah oong SHAH, poor fah-VOR |  |
| i_would_like~word_beer | I'd like a beer, please. | Queria uma cerveja, por favor. | kuh-REE-ah OO-mah suhr-VAY-zhah, poor fah-VOR |  |
| i_would_like~word_glass_of_wine | I'd like a glass of wine, please. | Queria um copo de vinho, por favor. | kuh-REE-ah oong KOH-poo duh VEE-nyoo, poor fah-VOR |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | Queria um sumo de laranja, por favor. | kuh-REE-ah oong SOO-moo duh lah-RAN-zhah, poor fah-VOR |  |
| i_would_like~word_bread | I'd like some bread, please. | Queria pão, por favor. | kuh-REE-ah POWNG, poor fah-VOR |  |
| i_would_like~word_water | I'd like some water, please. | Queria uma água, por favor. | kuh-REE-ah OO-mah AH-gwah, poor fah-VOR |  |
| table_for~word_one | A table for one, please. | Uma mesa para uma pessoa, por favor. | OO-mah MEH-zah PAH-rah OO-mah puh-SOH-ah, poor fah-VOR |  |
| table_for~word_two | A table for two, please. | Uma mesa para duas pessoas, por favor. | OO-mah MEH-zah PAH-rah DOO-ahsh puh-SOH-ahsh, poor fah-VOR |  |
| table_for~word_three | A table for three, please. | Uma mesa para três pessoas, por favor. | OO-mah MEH-zah PAH-rah traysh puh-SOH-ahsh, poor fah-VOR |  |
| table_for~word_four | A table for four, please. | Uma mesa para quatro pessoas, por favor. | OO-mah MEH-zah PAH-rah KWAH-troo puh-SOH-ahsh, poor fah-VOR |  |
| allergic_to~word_nuts | I'm allergic to nuts. | Sou alérgico a frutos de casca rija. | soh ah-LEHR-zhee-koo ah FROO-toosh duh KASH-kah REE-zhah | SAFETY: allergy/emergency. |
| allergic_to~word_peanuts | I'm allergic to peanuts. | Sou alérgico ao amendoim. | soh ah-LEHR-zhee-koo ow ah-men-doo-EENG | SAFETY: allergy/emergency. |
| allergic_to~word_gluten | I'm allergic to gluten. | Sou alérgico ao glúten. | soh ah-LEHR-zhee-koo ow GLOO-ten | SAFETY: allergy/emergency. |
| allergic_to~word_shellfish | I'm allergic to shellfish. | Sou alérgico ao marisco. | soh ah-LEHR-zhee-koo ow mah-REESH-koo | SAFETY: allergy/emergency. |
| allergic_to~word_milk | I'm allergic to milk. | Sou alérgico ao leite. | soh ah-LEHR-zhee-koo ow LAY-tuh | SAFETY: allergy/emergency. |
| allergic_to~word_eggs | I'm allergic to eggs. | Sou alérgico a ovos. | soh ah-LEHR-zhee-koo ah OH-voosh | SAFETY: allergy/emergency. |
| without~word_meat | Without meat, please. | Sem carne, por favor. | seng KAR-nuh, poor fah-VOR | SAFETY: allergy/emergency. |
| without~word_milk | Without milk, please. | Sem leite, por favor. | seng LAY-tuh, poor fah-VOR | SAFETY: allergy/emergency. |
| without~word_gluten | Without gluten, please. | Sem glúten, por favor. | seng GLOO-ten, poor fah-VOR | SAFETY: allergy/emergency. |
| without~word_ice | Without ice, please. | Sem gelo, por favor. | seng ZHEH-loo, poor fah-VOR | SAFETY: allergy/emergency. |
| without~word_nuts | Without nuts, please. | Sem frutos de casca rija, por favor. | seng FROO-toosh duh KASH-kah REE-zhah, poor fah-VOR | SAFETY: allergy/emergency. |
| ticket_to~word_airport | A ticket to the airport, please. | Um bilhete para o aeroporto, por favor. | oong bee-LYEH-tuh PAH-rah oo ah-eh-roo-POR-too, poor fah-VOR |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | Um bilhete para o centro da cidade, por favor. | oong bee-LYEH-tuh PAH-rah oo SEN-troo dah see-DAH-duh, poor fah-VOR |  |
| ticket_to~word_beach | A ticket to the beach, please. | Um bilhete para a praia, por favor. | oong bee-LYEH-tuh PAH-rah ah PRY-ah, poor fah-VOR |  |
| ticket_to~word_train_station | A ticket to the train station, please. | Um bilhete para a estação de comboios, por favor. | oong bee-LYEH-tuh PAH-rah ah esh-tah-SOWNG duh kong-BOY-oosh, poor fah-VOR |  |
| does_this_go_to~word_airport | Does this go to the airport? | Vai para o aeroporto? | vy PAH-rah oo ah-eh-roo-POR-too |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | Vai para o centro da cidade? | vy PAH-rah oo SEN-troo dah see-DAH-duh |  |
| does_this_go_to~word_beach | Does this go to the beach? | Vai para a praia? | vy PAH-rah ah PRY-ah |  |
| does_this_go_to~word_train_station | Does this go to the train station? | Vai para a estação de comboios? | vy PAH-rah ah esh-tah-SOWNG duh kong-BOY-oosh |  |
| take_me_to~word_airport | Take me to the airport, please. | Leve-me ao aeroporto, por favor. | LEH-vuh-muh ow ah-eh-roo-POR-too, poor fah-VOR |  |
| take_me_to~word_hotel | Take me to the hotel, please. | Leve-me ao hotel, por favor. | LEH-vuh-muh ow oh-TEL, poor fah-VOR |  |
| take_me_to~word_train_station | Take me to the train station, please. | Leve-me à estação de comboios, por favor. | LEH-vuh-muh ah esh-tah-SOWNG duh kong-BOY-oosh, poor fah-VOR |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | Leve-me ao centro da cidade, por favor. | LEH-vuh-muh ow SEN-troo dah see-DAH-duh, poor fah-VOR |  |
| take_me_to~word_beach | Take me to the beach, please. | Leve-me à praia, por favor. | LEH-vuh-muh ah PRY-ah, poor fah-VOR |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | O ar condicionado não funciona. | oo ar kon-dee-see-oo-NAH-doo nowng foon-see-OH-nah |  |
| doesnt_work~word_shower | The shower doesn't work. | O chuveiro não funciona. | oo shoo-VAY-roo nowng foon-see-OH-nah |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | O Wi-Fi não funciona. | oo WY-fy nowng foon-see-OH-nah |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | A água quente não funciona. | ah AH-gwah KEN-tuh nowng foon-see-OH-nah |  |
| doesnt_work~word_door_lock | The door lock doesn't work. | A fechadura da porta não funciona. | ah fuh-shah-DOO-rah dah POR-tah nowng foon-see-OH-nah |  |
| lost_my~word_wallet | I lost my wallet. | Perdi a minha carteira. | puhr-DEE ah MEE-nyah kar-TAY-rah | SAFETY: allergy/emergency. |
| lost_my~word_bag | I lost my bag. | Perdi a minha mala. | puhr-DEE ah MEE-nyah MAH-lah | SAFETY: allergy/emergency. |
| lost_my~word_keys | I lost my keys. | Perdi as minhas chaves. | puhr-DEE ahsh MEE-nyahsh SHAH-vush | SAFETY: allergy/emergency. |
| lost_my~word_room_key | I lost my room key. | Perdi a chave do quarto. | puhr-DEE ah SHAH-vuh doo KWAR-too | SAFETY: allergy/emergency. |
| reply~here_you_go | Here you go. | Aqui tem. | ah-KEE teng | Said TO the traveller by staff. |
| reply~inside_or_outside | Inside or outside? | Dentro ou na esplanada? | DEN-troo oh nah esh-plah-NAH-dah | Said TO the traveller by staff. |
| reply~have_booking | Do you have a reservation? | Tem reserva? | teng ruh-ZEHR-vah | Said TO the traveller by staff. |
| reply~next_stop | Next stop. | Próxima paragem. | PROH-see-mah pah-RAH-zhayng | Said TO the traveller by staff. |
| reply~one_moment | One moment, please. | Um momento, por favor. | oong moo-MEN-too, poor fah-VOR | Said TO the traveller by staff. |
| reply~what_size | What size? | Que tamanho veste? | keh tah-MAH-nyoo VESH-tuh | Said TO the traveller by staff. |
| reply~receipt_question | Would you like a receipt? | Quer fatura? | kehr fah-TOO-rah | Said TO the traveller by staff. |
| reply~how_would_you_like_it | How would you like it cut? | Como é que quer o corte? | KOH-moo eh keh kehr oo KOR-tuh | Said TO the traveller by staff. |
| word~word_train_station | train station | a estação de comboios | ah esh-tah-SOWNG duh kong-BOY-oosh | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | a paragem de autocarro | ah pah-RAH-zhayng duh ow-toh-KAH-roo | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | o aeroporto | oo ah-eh-roo-POR-too | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | a estação de metro | ah esh-tah-SOWNG duh MEH-troo | A single word, as it would appear inside a sentence. |
| word~word_hotel | hotel | o hotel | oo oh-TEL | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | a praia | ah PRY-ah | A single word, as it would appear inside a sentence. |
| word~word_city_centre | city centre | o centro da cidade | oo SEN-troo dah see-DAH-duh | A single word, as it would appear inside a sentence. |
| word~word_pharmacy | pharmacy | a farmácia | ah far-MAH-see-ah | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | o multibanco | oo mool-tee-BAN-koo | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | o supermercado | oo soo-pehr-mehr-KAH-doo | A single word, as it would appear inside a sentence. |
| word~word_platform | platform | a linha | ah LEE-nyah | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | a bilheteira | ah bee-lyuh-TAY-rah | A single word, as it would appear inside a sentence. |
| word~word_exit | exit | a saída | ah sah-EE-dah | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | a entrada | ah en-TRAH-dah | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | um chá | oong SHAH | A single word, as it would appear inside a sentence. |
| word~word_beer | beer | uma cerveja | OO-mah suhr-VAY-zhah | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | um copo de vinho | oong KOH-poo duh VEE-nyoo | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | um sumo de laranja | oong SOO-moo duh lah-RAN-zhah | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | a ementa | ah ee-MEN-tah | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | a conta | ah KON-tah | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | a mala | ah MAH-lah | A single word, as it would appear inside a sentence. |
| word~word_receipt | receipt | o recibo | oo ruh-SEE-boo | A single word, as it would appear inside a sentence. |
| word~word_water | water | a água | ah AH-gwah | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | um café | oong kah-FEH | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | o pão | oo POWNG | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | o leite | oo LAY-tuh | A single word, as it would appear inside a sentence. |
| word~word_ice | ice | o gelo | oo ZHEH-loo | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | os frutos de casca rija | oosh FROO-toosh duh KASH-kah REE-zhah | A single word, as it would appear inside a sentence. Review edit: the allergen-label term for tree nuts. "Frutos secos" is the everyday word but can also mean dried fruit. |
| word~word_gluten | gluten | o glúten | oo GLOO-ten | A single word, as it would appear inside a sentence. |
| word~word_shellfish | shellfish | o marisco | oo mah-REESH-koo | A single word, as it would appear inside a sentence. |
| word~word_eggs | eggs | os ovos | oosh OH-voosh | A single word, as it would appear inside a sentence. |
| word~word_meat | meat | a carne | ah KAR-nuh | A single word, as it would appear inside a sentence. |
| word~word_dairy | dairy | os laticínios | oosh lah-tee-SEE-nee-oosh | A single word, as it would appear inside a sentence. |
| word~word_peanuts | peanuts | os amendoins | oosh ah-men-doo-EENSH | A single word, as it would appear inside a sentence. |
| word~word_passport | passport | o passaporte | oo pah-sah-POR-tuh | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | o telemóvel | oo tuh-luh-MOH-vel | A single word, as it would appear inside a sentence. |
| word~word_wallet | wallet | a carteira | ah kar-TAY-rah | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | as chaves | ahsh SHAH-vush | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | o bilhete | oo bee-LYEH-tuh | A single word, as it would appear inside a sentence. |
| word~word_room_key | room key | a chave do quarto | ah SHAH-vuh doo KWAR-too | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | o ar condicionado | oo ar kon-dee-see-oo-NAH-doo | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | o chuveiro | oo shoo-VAY-roo | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | o Wi-Fi | oo WY-fy | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | a televisão | ah tuh-luh-vee-ZOWNG | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | a água quente | ah AH-gwah KEN-tuh | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | a fechadura | ah fuh-shah-DOO-rah | A single word, as it would appear inside a sentence. |
| word~word_one | one | um | oong | A single word, as it would appear inside a sentence. |
| word~word_two | two | dois | doysh | A single word, as it would appear inside a sentence. |
| word~word_three | three | três | traysh | A single word, as it would appear inside a sentence. |
| word~word_four | four | quatro | KWAH-troo | A single word, as it would appear inside a sentence. |
| word~word_five | five | cinco | SEEN-koo | A single word, as it would appear inside a sentence. |
| word~word_six | six | seis | saysh | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | sete | SEH-tuh | A single word, as it would appear inside a sentence. |
| word~word_eight | eight | oito | OY-too | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | nove | NOH-vuh | A single word, as it would appear inside a sentence. |
| word~word_ten | ten | dez | desh | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | vinte | VEEN-tuh | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | cinquenta | seen-KWEN-tah | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | cem | sayng | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | lá em cima | lah eng SEE-mah | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | lá em baixo | lah eng BY-shoo | A single word, as it would appear inside a sentence. |
| word~word_near | near | perto | PEHR-too | A single word, as it would appear inside a sentence. |
| word~word_far | far | longe | LON-zhuh | A single word, as it would appear inside a sentence. |
| word~word_today | today | hoje | OH-zhuh | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | amanhã | ah-mah-NYAHNG | A single word, as it would appear inside a sentence. |
| word~word_now | now | agora | ah-GOH-rah | A single word, as it would appear inside a sentence. |
| word~word_later | later | mais tarde | mysh TAR-duh | A single word, as it would appear inside a sentence. |
| word~word_open | open | aberto | ah-BEHR-too | A single word, as it would appear inside a sentence. |
| word~word_closed | closed | fechado | fuh-SHAH-doo | A single word, as it would appear inside a sentence. |
| word~word_yes | yes | sim | seeng | A single word, as it would appear inside a sentence. |
| word~word_no | no | não | nowng | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | dinheiro | dee-NYAY-roo | A single word, as it would appear inside a sentence. |
| word~word_card | card | cartão | kar-TAWNG | A single word, as it would appear inside a sentence. |
