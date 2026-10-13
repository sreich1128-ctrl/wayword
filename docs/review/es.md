# Review sheet: Spanish (173 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/es.<tool>.json` (for example `es.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of Spanish (Neutral) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- region: Neutral conversational Spanish; local vocabulary varies by country.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 173 keys, in order, and nothing else after the code block.

| key | English | draft | pronunciation_easy | note |
|---|---|---|---|---|
| table_for | A table for ___, please. | Una mesa para ___, por favor. | OO-nah MEH-sah PAH-rah, por fah-VOR | Frame: ___ is filled with a word. Blank takes the bare number (uno, dos...). "Para uno" is fine; "para una persona" is an equally common alternative. |
| menu_please | The menu, please. | La carta, por favor. | lah KAR-tah, por fah-VOR | "La carta" is understood everywhere. "El menú" is very common in Latin America, but in Spain "el menú" usually means the set lunch (menú del día). |
| allergic_to | I'm allergic to ___. | Soy alérgico a ___. | soy ah-LEHR-hee-koh ah | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: "I am allergic to ___." Masculine speaker (file convention); a woman says "Soy alérgica a ___" (ah-LEHR-hee-kah). a + el contracts to al (al gluten, al maní), so the article goes with the word, not the frame. Safety item: please verify. Word notes: peanuts = "maní" (most of Latin America), "cacahuate" (Mexico), "cacahuete" (Spain). Nuts = "frutos secos" (tree nuts generally); "nueces" strictly means walnuts but is used loosely in Mexico. Back-translations of examples: "I am allergic to the nuts / the peanut / the gluten / the shellfish / the milk / the eggs" (Spanish uses the article here). Dairy = "los lácteos". |
| without | Without ___, please. | Sin ___, por favor. | seen, por fah-VOR | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: "Without ___, please." The noun after sin normally drops its article (sin leche, sin gluten), so examples omit it. Safety item (used for allergies/diet): please verify. Examples back-translate as "Without meat / milk / gluten / ice / nuts, please". |
| to_go | To go, please. | Para llevar, por favor. | PAH-rah yeh-VAR, por fah-VOR |  |
| for_here | For here, please. | Para comer aquí, por favor. | PAH-rah koh-MEHR ah-KEE, por fah-VOR | Literally "to eat here". For a drink only, "Para tomar aquí" fits better. |
| another_one | Another one, please. | Otro, por favor. | OH-troh, por fah-VOR | Agrees with the thing ordered: "Otra, por favor" for a feminine noun (otra cerveza, otra copa). |
| ticket_to | A ticket to ___, please. | Un boleto a ___, por favor. | oon boh-LEH-toh ah, por fah-VOR | Frame: ___ is filled with a word. "Boleto" is Latin American; Spain says "billete", and Argentina/Chile often "pasaje" for long-distance. a + el contracts to al (al aeropuerto). |
| does_this_go_to | Does this go to ___? | ¿Este va a ___? | ES-teh vah ah | Frame: ___ is filled with a word. "Este" = this one (bus/train, masculine). a + el contracts to al. |
| take_me_to | Take me to ___, please. | Llévame a ___, por favor. | YEH-vah-meh ah, por fah-VOR | Frame: ___ is filled with a word. Uses tú like the rest of the file. With taxi drivers in much of Latin America usted is more usual: "¿Me lleva a ___, por favor?". a + el contracts to al. |
| stop_here | Stop here, please. | Para aquí, por favor. | PAH-rah ah-KEE, por fah-VOR | tú form; usted form is "Pare aquí, por favor" (common with taxi drivers). |
| next_departure | When does the next one leave? | ¿Cuándo sale el próximo? | KWAN-doh SAH-leh el PROK-see-moh | "El próximo" assumes a masculine vehicle (tren, autobús); "la próxima" if referring to a feminine one. |
| which_platform | Which platform? | ¿De qué andén sale? | deh keh an-DEN SAH-leh | Literally "From which platform does it leave?". Spanish train stations often say "vía" (track) instead of andén; bus stations may use "plataforma". |
| one_way_or_return | One way or return? | ¿Ida o ida y vuelta? | EE-dah oh EE-dah ee VWEL-tah |  |
| left | Left. | A la izquierda. | ah lah ees-KYEHR-dah | Direction (turn left/right), not "correct". |
| right | Right. | A la derecha. | ah lah deh-REH-chah | Direction (turn left/right), not "correct". |
| straight_ahead | Straight ahead. | Todo derecho. | TOH-doh deh-REH-choh | Latin American. Spain says "Todo recto". Note derecho (straight) vs derecha (right) differ by one letter. |
| show_on_map | Can you show me on the map? | ¿Me lo puedes mostrar en el mapa? | meh loh PWEH-des mos-TRAR en el MAH-pah |  |
| near_here | Is it near here? | ¿Está cerca de aquí? | es-TAH SEHR-kah deh ah-KEE |  |
| under_name | Under the name ___. | A nombre de ___. | ah NOM-breh deh | Frame: ___ is filled with a word. |
| wifi_password | What's the Wi-Fi password? | ¿Cuál es la contraseña del wifi? | kwal es lah kon-trah-SEN-yah del WAI-fai | Wifi is said "wai-fai" in most of Latin America, "wee-fee" in Spain. "La clave del wifi" is also common. |
| checkout_time | What time is checkout? | ¿A qué hora hay que dejar la habitación? | ah keh OH-rah eye keh deh-HAR lah ah-bee-tah-SYON | Literally "What time do we have to leave the room?". Hotel staff also say "la salida" or "el check-out". |
| leave_bags | Can I leave my bags here? | ¿Puedo dejar mis maletas aquí? | PWEH-doh deh-HAR mees mah-LEH-tas ah-KEE |  |
| doesnt_work | The ___ doesn't work. | ___ no funciona. | noh foon-SYOH-nah | Frame: ___ is filled with a word. Blank takes the word with its article (El aire acondicionado...). Plural nouns need "no funcionan". For hot water the natural sentence is "No hay agua caliente" (there is no hot water), used in the example instead of the frame. Shower is "regadera" in Mexico. |
| another_towel | Can I have another towel? | ¿Me das otra toalla? | meh das OH-trah toh-AH-yah |  |
| just_looking | I'm just looking. | Solo estoy mirando. | SOH-loh es-TOY mee-RAN-doh | Much of Latin America says "Solo estoy viendo" (Mexico: "Nada más estoy viendo"). |
| ill_take_it | I'll take it. | Me lo llevo. | meh loh YEH-voh | "Me la llevo" if the item is a feminine noun (la camisa). |
| try_it_on | Can I try it on? | ¿Me lo puedo probar? | meh loh PWEH-doh proh-BAR | "Me la puedo probar" for a feminine item. |
| another_size | Do you have it in another size? | ¿Lo tienes en otra talla? | loh TYEH-nes en OH-trah TAH-yah | "La" for a feminine item. Shop staff are often addressed with usted: "¿Lo tiene en otra talla?". Shoe size is "número". |
| bag_please | A bag, please. | Una bolsa, por favor. | OO-nah BOL-sah, por fah-VOR |  |
| haircut | A haircut, please. | Un corte de pelo, por favor. | oon KOR-teh deh PEH-loh, por fah-VOR |  |
| just_trim | Just a trim. | Solo las puntas. | SOH-loh las POON-tas | Literally "Just the ends", the usual way to ask for a trim. Not fully sure it's the best fit for short men's hair, where "Solo un recorte" or "Solo emparejar" may be heard. |
| not_too_short | Not too short. | No muy corto. | noh mwee KOR-toh |  |
| shorter_sides | Shorter on the sides. | Más corto a los lados. | mas KOR-toh ah los LAH-dos | Mexico often says "de los lados". |
| like_this | Like this. | Así. | ah-SEE | Said while showing a photo. "Así, como en la foto" (like this, like in the photo) is a fuller option. |
| beard_trim | A beard trim, please. | Un arreglo de barba, por favor. | oon ah-REH-gloh deh BAR-bah, por fah-VOR | Not fully sure this is the most common phrasing; "Arréglame la barba" (fix up my beard) or "perfilado de barba" are also used. |
| where_pharmacy | Where is the pharmacy? | ¿Dónde está la farmacia? | DON-deh es-TAH lah far-MAH-syah | SAFETY: allergy/emergency. Back-translation: "Where is the pharmacy?" To ask for any pharmacy nearby, "¿Dónde hay una farmacia?" (where is there a pharmacy) is more natural. Safety item: please verify. |
| lost_my | I lost my ___. | Perdí ___. | pehr-DEE | Frame: ___ is filled with a word. SAFETY: allergy/emergency. Back-translation: "I lost ___." The blank takes a possessive that changes per word (mi pasaporte, mis llaves), so it is not fixed in the frame. Spain more often says "He perdido ___". Safety item: please verify. Word notes: wallet = "billetera" ("cartera" in Mexico and Spain, but cartera is a handbag in parts of South America); phone = "teléfono" ("celular" in Latin America, "móvil" in Spain); bag = "bolsa" (Spain: "bolso" for a handbag, "mochila" for a backpack). Room key example says "the key to my room". |
| call_someone | I need to call someone. | Necesito llamar a alguien. | neh-seh-SEE-toh yah-MAR ah AL-gyen | SAFETY: allergy/emergency. Back-translation: "I need to call someone." Safety item: please verify. |
| where_is~word_pharmacy | Where is the pharmacy? | ¿Dónde está la farmacia? | DON-deh es-TAH lah far-MAH-syah |  |
| where_is~word_atm | Where is an ATM? | ¿Dónde está el cajero automático? | DON-deh es-TAH el kah-HEH-roh ow-toh-MAH-tee-koh |  |
| where_is~word_supermarket | Where is the supermarket? | ¿Dónde está el supermercado? | DON-deh es-TAH el soo-pehr-mehr-KAH-doh |  |
| nearest~word_atm | Where is the nearest ATM? | ¿Dónde está el cajero automático más cercano? | DON-deh es-TAH el kah-HEH-roh ow-toh-MAH-tee-koh mas sehr-KAH-noh |  |
| how_get~word_city_centre | How do I get to the city centre? | ¿Cómo llego al centro? | KOH-moh YEH-goh al SEN-troh |  |
| how_get~word_beach | How do I get to the beach? | ¿Cómo llego a la playa? | KOH-moh YEH-goh ah lah PLAH-yah |  |
| can_i_have~word_tea | Can I have a tea, please? | ¿Me das un té, por favor? | meh das oon teh, por fah-VOR |  |
| can_i_have~word_beer | Can I have a beer, please? | ¿Me das una cerveza, por favor? | meh das OO-nah sehr-VEH-sah, por fah-VOR |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | ¿Me das una copa de vino, por favor? | meh das OO-nah KOH-pah deh VEE-noh, por fah-VOR |  |
| can_i_have~word_orange_juice | Can I have an orange juice, please? | ¿Me das un jugo de naranja, por favor? | meh das oon HOO-goh deh nah-RAN-hah, por fah-VOR |  |
| can_i_have~word_menu | Can I have the menu, please? | ¿Me das la carta, por favor? | meh das lah KAR-tah, por fah-VOR |  |
| can_i_have~word_receipt | Can I have a receipt, please? | ¿Me das el recibo, por favor? | meh das el reh-SEE-boh, por fah-VOR |  |
| i_would_like~word_tea | I'd like a tea, please. | Quisiera un té, por favor. | kee-SYEH-rah oon teh, por fah-VOR |  |
| i_would_like~word_beer | I'd like a beer, please. | Quisiera una cerveza, por favor. | kee-SYEH-rah OO-nah sehr-VEH-sah, por fah-VOR |  |
| i_would_like~word_glass_of_wine | I'd like a glass of wine, please. | Quisiera una copa de vino, por favor. | kee-SYEH-rah OO-nah KOH-pah deh VEE-noh, por fah-VOR |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | Quisiera un jugo de naranja, por favor. | kee-SYEH-rah oon HOO-goh deh nah-RAN-hah, por fah-VOR |  |
| i_would_like~word_bread | I'd like some bread, please. | Quisiera pan, por favor. | kee-SYEH-rah pan, por fah-VOR |  |
| i_would_like~word_water | I'd like some water, please. | Quisiera agua, por favor. | kee-SYEH-rah AH-gwah, por fah-VOR |  |
| table_for~word_one | A table for one, please. | Una mesa para uno, por favor. | OO-nah MEH-sah PAH-rah OO-noh, por fah-VOR |  |
| table_for~word_three | A table for three, please. | Una mesa para tres, por favor. | OO-nah MEH-sah PAH-rah tres, por fah-VOR |  |
| table_for~word_four | A table for four, please. | Una mesa para cuatro, por favor. | OO-nah MEH-sah PAH-rah KWAH-troh, por fah-VOR |  |
| allergic_to~word_nuts | I'm allergic to nuts. | Soy alérgico a los frutos secos. | soy ah-LEHR-hee-koh ah los FROO-tos SEH-kos | SAFETY: allergy/emergency. |
| allergic_to~word_peanuts | I'm allergic to peanuts. | Soy alérgico al maní. | soy ah-LEHR-hee-koh al mah-NEE | SAFETY: allergy/emergency. |
| allergic_to~word_gluten | I'm allergic to gluten. | Soy alérgico al gluten. | soy ah-LEHR-hee-koh al GLOO-ten | SAFETY: allergy/emergency. |
| allergic_to~word_shellfish | I'm allergic to shellfish. | Soy alérgico a los mariscos. | soy ah-LEHR-hee-koh ah los mah-REES-kos | SAFETY: allergy/emergency. |
| allergic_to~word_milk | I'm allergic to milk. | Soy alérgico a la leche. | soy ah-LEHR-hee-koh ah lah LEH-cheh | SAFETY: allergy/emergency. |
| allergic_to~word_eggs | I'm allergic to eggs. | Soy alérgico a los huevos. | soy ah-LEHR-hee-koh ah los WEH-vos | SAFETY: allergy/emergency. |
| without~word_meat | Without meat, please. | Sin carne, por favor. | seen KAR-neh, por fah-VOR | SAFETY: allergy/emergency. |
| without~word_milk | Without milk, please. | Sin leche, por favor. | seen LEH-cheh, por fah-VOR | SAFETY: allergy/emergency. |
| without~word_gluten | Without gluten, please. | Sin gluten, por favor. | seen GLOO-ten, por fah-VOR | SAFETY: allergy/emergency. |
| without~word_ice | Without ice, please. | Sin hielo, por favor. | seen YEH-loh, por fah-VOR | SAFETY: allergy/emergency. |
| without~word_nuts | Without nuts, please. | Sin frutos secos, por favor. | seen FROO-tos SEH-kos, por fah-VOR | SAFETY: allergy/emergency. |
| ticket_to~word_airport | A ticket to the airport, please. | Un boleto al aeropuerto, por favor. | oon boh-LEH-toh al ah-eh-roh-PWEHR-toh, por fah-VOR |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | Un boleto al centro, por favor. | oon boh-LEH-toh al SEN-troh, por fah-VOR |  |
| ticket_to~word_beach | A ticket to the beach, please. | Un boleto a la playa, por favor. | oon boh-LEH-toh ah lah PLAH-yah, por fah-VOR |  |
| ticket_to~word_train_station | A ticket to the train station, please. | Un boleto a la estación de tren, por favor. | oon boh-LEH-toh ah lah es-tah-SYON deh tren, por fah-VOR |  |
| does_this_go_to~word_airport | Does this go to the airport? | ¿Este va al aeropuerto? | ES-teh vah al ah-eh-roh-PWEHR-toh |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | ¿Este va al centro? | ES-teh vah al SEN-troh |  |
| does_this_go_to~word_beach | Does this go to the beach? | ¿Este va a la playa? | ES-teh vah ah lah PLAH-yah |  |
| does_this_go_to~word_train_station | Does this go to the train station? | ¿Este va a la estación de tren? | ES-teh vah ah lah es-tah-SYON deh tren |  |
| take_me_to~word_airport | Take me to the airport, please. | Llévame al aeropuerto, por favor. | YEH-vah-meh al ah-eh-roh-PWEHR-toh, por fah-VOR |  |
| take_me_to~word_hotel | Take me to the hotel, please. | Llévame al hotel, por favor. | YEH-vah-meh al oh-TEL, por fah-VOR |  |
| take_me_to~word_train_station | Take me to the train station, please. | Llévame a la estación de tren, por favor. | YEH-vah-meh ah lah es-tah-SYON deh tren, por fah-VOR |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | Llévame al centro, por favor. | YEH-vah-meh al SEN-troh, por fah-VOR |  |
| take_me_to~word_beach | Take me to the beach, please. | Llévame a la playa, por favor. | YEH-vah-meh ah lah PLAH-yah, por fah-VOR |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | El aire acondicionado no funciona. | el EYE-reh ah-kon-dee-syoh-NAH-doh noh foon-SYOH-nah |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | El wifi no funciona. | el WAI-fai noh foon-SYOH-nah |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | No hay agua caliente. | noh eye AH-gwah kah-LYEN-teh |  |
| doesnt_work~word_door_lock | The door lock doesn't work. | La cerradura no funciona. | lah seh-rah-DOO-rah noh foon-SYOH-nah |  |
| lost_my~word_bag | I lost my bag. | Perdí mi bolsa. | pehr-DEE mee BOL-sah | SAFETY: allergy/emergency. |
| lost_my~word_room_key | I lost my room key. | Perdí la llave de mi habitación. | pehr-DEE lah YAH-veh deh mee ah-bee-tah-SYON | SAFETY: allergy/emergency. |
| reply~for_here_or_to_go | For here or to go? | ¿Para comer aquí o para llevar? | PAH-rah koh-MEHR ah-KEE oh PAH-rah yeh-VAR | Said TO the traveller by staff. |
| reply~here_you_go | Here you go. | Aquí tiene. | ah-KEE TYEH-neh | Said TO the traveller by staff. |
| reply~inside_or_outside | Inside or outside? | ¿Adentro o afuera? | ah-DEN-troh oh ah-FWEH-rah | Said TO the traveller by staff. |
| reply~have_booking | Do you have a reservation? | ¿Tiene reserva? | TYEH-neh reh-SEHR-vah | Said TO the traveller by staff. |
| reply~next_stop | Next stop. | Próxima parada. | PROK-see-mah pah-RAH-dah | Said TO the traveller by staff. |
| reply~its_closed | It's closed. | Está cerrado. | es-TAH seh-RAH-doh | Said TO the traveller by staff. |
| reply~one_moment | One moment, please. | Un momento, por favor. | oon moh-MEN-toh, por fah-VOR | Said TO the traveller by staff. |
| reply~what_size | What size? | ¿Qué talla? | keh TAH-yah | Said TO the traveller by staff. |
| reply~receipt_question | Would you like a receipt? | ¿Quiere el recibo? | KYEH-reh el reh-SEE-boh | Said TO the traveller by staff. |
| reply~how_would_you_like_it | How would you like it cut? | ¿Cómo se lo corto? | KOH-moh seh loh KOR-toh | Said TO the traveller by staff. |
| word~word_train_station | train station | la estación de tren | lah es-tah-SYON deh tren | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | la parada de autobús | lah pah-RAH-dah deh ow-toh-BOOS | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | el aeropuerto | el ah-eh-roh-PWEHR-toh | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | la estación de metro | lah es-tah-SYON deh MEH-troh | A single word, as it would appear inside a sentence. |
| word~word_hotel | hotel | el hotel | el oh-TEL | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | la playa | lah PLAH-yah | A single word, as it would appear inside a sentence. |
| word~word_city_centre | city centre | el centro | el SEN-troh | A single word, as it would appear inside a sentence. |
| word~word_pharmacy | pharmacy | la farmacia | lah far-MAH-syah | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | el cajero automático | el kah-HEH-roh ow-toh-MAH-tee-koh | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | el supermercado | el soo-pehr-mehr-KAH-doh | A single word, as it would appear inside a sentence. |
| word~word_platform | platform | el andén | el an-DEN | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | la taquilla | lah tah-KEE-yah | A single word, as it would appear inside a sentence. |
| word~word_exit | exit | la salida | lah sah-LEE-dah | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | la entrada | lah en-TRAH-dah | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | un té | oon teh | A single word, as it would appear inside a sentence. |
| word~word_beer | beer | una cerveza | OO-nah sehr-VEH-sah | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | una copa de vino | OO-nah KOH-pah deh VEE-noh | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | un jugo de naranja | oon HOO-goh deh nah-RAN-hah | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | la carta | lah KAR-tah | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | la cuenta | lah KWEN-tah | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | una bolsa | OO-nah BOL-sah | A single word, as it would appear inside a sentence. |
| word~word_receipt | receipt | el recibo | el reh-SEE-boh | A single word, as it would appear inside a sentence. |
| word~word_water | water | agua | AH-gwah | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | un café | oon kah-FEH | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | pan | pan | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | la leche | lah LEH-cheh | A single word, as it would appear inside a sentence. |
| word~word_ice | ice | hielo | YEH-loh | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | los frutos secos | los FROO-tos SEH-kos | A single word, as it would appear inside a sentence. |
| word~word_gluten | gluten | el gluten | el GLOO-ten | A single word, as it would appear inside a sentence. |
| word~word_shellfish | shellfish | los mariscos | los mah-REES-kos | A single word, as it would appear inside a sentence. |
| word~word_eggs | eggs | los huevos | los WEH-vos | A single word, as it would appear inside a sentence. |
| word~word_meat | meat | la carne | lah KAR-neh | A single word, as it would appear inside a sentence. |
| word~word_dairy | dairy | los lácteos | los LAK-teh-os | A single word, as it would appear inside a sentence. |
| word~word_peanuts | peanuts | el maní | el mah-NEE | A single word, as it would appear inside a sentence. |
| word~word_passport | passport | el pasaporte | el pah-sah-POR-teh | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | el teléfono | el teh-LEH-foh-noh | A single word, as it would appear inside a sentence. |
| word~word_wallet | wallet | la billetera | lah bee-yeh-TEH-rah | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | las llaves | las YAH-ves | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | el boleto | el boh-LEH-toh | A single word, as it would appear inside a sentence. |
| word~word_room_key | room key | la llave de la habitación | lah YAH-veh deh lah ah-bee-tah-SYON | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | el aire acondicionado | el EYE-reh ah-kon-dee-syoh-NAH-doh | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | la ducha | lah DOO-chah | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | el wifi | el WAI-fai | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | la tele | lah TEH-leh | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | el agua caliente | el AH-gwah kah-LYEN-teh | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | la cerradura | lah seh-rah-DOO-rah | A single word, as it would appear inside a sentence. |
| word~word_one | one | uno | OO-noh | A single word, as it would appear inside a sentence. |
| word~word_two | two | dos | dos | A single word, as it would appear inside a sentence. |
| word~word_three | three | tres | tres | A single word, as it would appear inside a sentence. |
| word~word_four | four | cuatro | KWAH-troh | A single word, as it would appear inside a sentence. |
| word~word_five | five | cinco | SEEN-koh | A single word, as it would appear inside a sentence. |
| word~word_six | six | seis | says | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | siete | SYEH-teh | A single word, as it would appear inside a sentence. |
| word~word_eight | eight | ocho | OH-choh | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | nueve | NWEH-veh | A single word, as it would appear inside a sentence. |
| word~word_ten | ten | diez | dyes | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | veinte | VAYN-teh | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | cincuenta | seen-KWEN-tah | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | cien | syen | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | arriba | ah-REE-bah | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | abajo | ah-BAH-hoh | A single word, as it would appear inside a sentence. |
| word~word_near | near | cerca | SEHR-kah | A single word, as it would appear inside a sentence. |
| word~word_far | far | lejos | LEH-hos | A single word, as it would appear inside a sentence. |
| word~word_today | today | hoy | oy | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | mañana | mah-NYAH-nah | A single word, as it would appear inside a sentence. |
| word~word_now | now | ahora | ah-OH-rah | A single word, as it would appear inside a sentence. |
| word~word_later | later | más tarde | mas TAR-deh | A single word, as it would appear inside a sentence. |
| word~word_open | open | abierto | ah-BYEHR-toh | A single word, as it would appear inside a sentence. |
| word~word_closed | closed | cerrado | seh-RAH-doh | A single word, as it would appear inside a sentence. |
| word~word_yes | yes | sí | see | A single word, as it would appear inside a sentence. |
| word~word_no | no | no | noh | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | efectivo | eh-fek-TEE-voh | A single word, as it would appear inside a sentence. |
| word~word_card | card | tarjeta | tar-HEH-tah | A single word, as it would appear inside a sentence. |
