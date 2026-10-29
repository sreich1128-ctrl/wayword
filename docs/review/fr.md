# Review sheet: French (217 items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as `docs/review/fr.<tool>.json` (for example `fr.chatgpt.json`), or paste it back to Claude Code.

---

You are a native-level reviewer of French (France) for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
- register: Travel/service phrases lean polite; social phrases use informal tu.
- `pronunciation_easy` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single ```json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all 217 keys, in order, and nothing else after the code block.

| key | English | draft | pronunciation_easy | note |
|---|---|---|---|---|
| table_for | A table for ___, please. | Une table pour ___, s'il vous plaît. | ewn TAH-bluh poor, seel voo PLEH | Frame: ___ is filled with a word. Blank takes a bare number (deux, trois...). For one person say 'pour une personne' rather than 'pour un'. 'pour deux personnes' is equally natural. |
| menu_please | The menu, please. | La carte, s'il vous plaît. | lah KART, seel voo PLEH | 'La carte' is the menu list. 'Le menu' in France usually means a fixed-price set menu, so 'la carte' is the safer word. |
| allergic_to | I'm allergic to ___. | Je suis allergique ___. | zhuh swee zah-lehr-ZHEEK | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'I am allergic [to the] ___.' The blank must include à + article, which contracts and changes per word (au gluten, au lait, aux œufs, aux fruits à coque, à la ..., à l'...), so 'à' is not outside the blank. 'allergique' is the same for male and female speakers. |
| without | Without ___, please. | Sans ___, s'il vous plaît. | sahn, seel voo PLEH | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'Without ___, please.' No article after 'sans' (sans viande, sans lait, sans gluten). This is a preference request; for a real allergy use allergic_to as well, since 'sans' alone may be read as taste, not medical need. |
| to_go | To go, please. | À emporter, s'il vous plaît. | ah ahn-por-TAY, seel voo PLEH |  |
| for_here | For here, please. | Sur place, s'il vous plaît. | sewr PLASS, seel voo PLEH |  |
| another_one | Another one, please. | Un autre, s'il vous plaît. | uh-NOH-truh, seel voo PLEH | Gender of the thing, not the speaker: 'Un autre' for a masculine item (un café, un verre), 'Une autre' (ew-NOH-truh) for a feminine one (une bière). |
| ticket_to | A ticket to ___, please. | Un billet pour ___, s'il vous plaît. | uhn bee-YEH poor, seel voo PLEH | Frame: ___ is filled with a word. Usually filled with a city name (pour Lyon). 'pour' does not contract, so the word's own article stays (pour la gare, pour le centre-ville). |
| does_this_go_to | Does this go to ___? | Est-ce qu'il va ___ ? | es-keel VAH | Frame: ___ is filled with a word. Blank takes à + article, which contracts per word (à l'aéroport, au centre-ville, à la gare), so 'à' stays inside the blank. 'il' = the bus/train/metro/tram, all masculine. Reviewer: 'Ce bus va à ___ ?' is an alternative if the vehicle is named. |
| take_me_to | Take me to ___, please. | Emmenez-moi ___, s'il vous plaît. | ahn-muh-nay MWAH, seel voo PLEH | Frame: ___ is filled with a word. Blank takes à + article, contracting per word (à l'aéroport, au centre-ville). In a taxi people very often just say the destination: 'À l'aéroport, s'il vous plaît.' A softer option is 'Vous pouvez m'emmener ___ ?' |
| stop_here | Stop here, please. | Arrêtez-vous ici, s'il vous plaît. | ah-reh-tay-voo zee-SEE, seel voo PLEH | Reviewer: 'Vous pouvez vous arrêter ici ?' or simply 'Ici, s'il vous plaît.' are also common to a taxi driver. |
| next_departure | When does the next one leave? | Le prochain part à quelle heure ? | luh proh-SHAN par ah kel UHR | 'Le prochain' assumes a masculine vehicle (train, bus). For a feminine one (une navette) it is 'La prochaine'. |
| which_platform | Which platform? | C'est quel quai ? | say kel KAY | 'quai' = platform, understood everywhere. French train departure boards show 'Voie' (track), so travellers may also hear/ask 'C'est quelle voie ?' |
| how_long_trip | How long does it take? | Ça prend combien de temps ? | sah prahn kohm-byen duh TAHN |  |
| one_way_or_return | One way or return? | Aller simple ou aller-retour ? | ah-LAY SAN-pluh oo ah-lay ruh-TOOR |  |
| left | Left. | À gauche. | ah GOHSH | Direction (turn left/right), not "correct". |
| right | Right. | À droite. | ah DRWAHT | Direction (turn left/right), not "correct". |
| straight_ahead | Straight ahead. | Tout droit. | too DRWAH |  |
| show_on_map | Can you show me on the map? | Vous pouvez me montrer sur la carte ? | voo poo-VAY muh mohn-TRAY sewr lah KART |  |
| under_name | Under the name ___. | Au nom de ___. | oh nohn duh | Frame: ___ is filled with a word. 'de' becomes d' before a name starting with a vowel or mute h (Au nom d'Anderson). |
| wifi_password | What's the Wi-Fi password? | Quel est le mot de passe du wifi ? | kel eh luh moh duh PAHSS dew wee-FEE |  |
| checkout_time | What time is checkout? | À quelle heure faut-il libérer la chambre ? | ah kel uhr foh-TEEL lee-bay-RAY lah SHAHN-bruh | Reviewer: natural hotel phrasing is 'libérer la chambre' (vacate the room). 'Le check-out est à quelle heure ?' is also widely used in hotels. |
| leave_bags | Can I leave my bags here? | Je peux laisser mes bagages ici ? | zhuh puh leh-SAY may bah-GAHZH ee-SEE |  |
| doesnt_work | The ___ doesn't work. | ___ ne marche pas. | nuh marsh PAH | Frame: ___ is filled with a word. Blank takes the noun with its article (La douche ne marche pas). 'ne fonctionne pas' is a slightly more formal synonym. For hot water, 'Il n'y a pas d'eau chaude' (there's no hot water) is more idiomatic than the filled frame. |
| another_towel | Can I have another towel? | Je peux avoir une autre serviette ? | zhuh puh ah-vwahr ew-NOH-truh sehr-VYET | 'serviette' is also a table napkin; in a hotel room it is understood as towel. 'serviette de bain' if it needs to be explicit. |
| just_looking | I'm just looking. | Je regarde, merci. | zhuh ruh-GARD, mehr-SEE |  |
| try_it_on | Can I try it on? | Je peux l'essayer ? | zhuh puh leh-say-YAY |  |
| another_size | Do you have it in another size? | Vous l'avez dans une autre taille ? | voo lah-VAY dahn zew-NOH-truh TIE | For shoes the word is 'pointure' (dans une autre pointure). |
| bag_please | A bag, please. | Un sac, s'il vous plaît. | uhn SAK, seel voo PLEH |  |
| haircut | A haircut, please. | Une coupe, s'il vous plaît. | ewn KOOP, seel voo PLEH |  |
| just_trim | Just a trim. | Juste rafraîchir, s'il vous plaît. | zhewst rah-freh-SHEER, seel voo PLEH | Reviewer: 'rafraîchir' (refresh) is the usual salon/barber word for a trim; 'juste égaliser' (just even it out) or 'juste les pointes' (just the ends) are alternatives. Not fully sure which is most natural at a men's barber. |
| not_too_short | Not too short. | Pas trop court. | pah troh KOOR |  |
| shorter_sides | Shorter on the sides. | Plus court sur les côtés. | plew koor sewr lay koh-TAY |  |
| like_this | Like this. | Comme ça. | kom SAH |  |
| beard_trim | A beard trim, please. | Une taille de barbe, s'il vous plaît. | ewn TIE duh BARB, seel voo PLEH | 'Taille de barbe' is the usual barber-menu term. Reviewer: 'Vous pouvez me tailler la barbe ?' is a verb alternative. |
| where_pharmacy | Where is the pharmacy? | Où est la pharmacie ? | oo eh lah far-mah-SEE | SAFETY: allergy/emergency. SAFETY. Back-translation: 'Where is the pharmacy?' For any pharmacy nearby, 'Il y a une pharmacie près d'ici ?' (Is there a pharmacy near here?) also works. |
| lost_my | I lost my ___. | J'ai perdu ___. | zhay pehr-DEW | Frame: ___ is filled with a word. SAFETY: allergy/emergency. SAFETY. Back-translation: 'I have lost ___.' The blank takes a possessive that changes with the noun (mon passeport, ma valise, mes clés), so it stays inside the blank. 'perdu' does not change for speaker gender here. |
| call_someone | I need to call someone. | Je dois appeler quelqu'un. | zhuh dwah ah-puh-LAY kel-KUHN | SAFETY: allergy/emergency. SAFETY. Back-translation: 'I must call someone.' 'J'ai besoin d'appeler quelqu'un' (I need to call someone) is an equally natural alternative. |
| do_you_have | Do you have ___? | Vous avez ___ ? | voo zah-VAY | Frame: ___ is filled with a word. Blank takes the noun with its article, which varies (le Wi-Fi, des plats végétariens, un chargeur), so the article is inside the blank. The liaison 'vous_avez' (voo zah-VAY) is obligatory. |
| how_much_is | How much is ___? | Combien coûte ___ ? | kohm-BYEN KOOT | Frame: ___ is filled with a word. Blank takes the noun with its article (un billet, la chambre). Plural nouns need 'coûtent' (same pronunciation). Casual alternative everywhere: 'C'est combien, ___ ?' |
| i_need | I need ___, please. | J'ai besoin ___, s'il vous plaît. | zhay buh-ZWAN, seel voo PLEH | Frame: ___ is filled with a word. SAFETY (help/doctor). Back-translation: 'I have need [of] ___, please.' The blank includes 'de', which elides and combines per word (d'aide, d'eau, d'un taxi, d'un médecin), so it is inside the blank. Same for male and female speakers. |
| is_there_nearby | Is there a ___ nearby? | Il y a ___ près d'ici ? | eel yah ... preh dee-SEE | Frame: ___ is filled with a word. Blank takes the article as well as the noun (un/une/des), since gender and number vary: 'des toilettes' is plural in French. The English frame has 'a' before the blank; in French the article goes inside it. |
| pay_with | Can I pay with ___? | Je peux payer ___ ? | zhuh puh pay-YAY | Frame: ___ is filled with a word. The preposition changes with the means of payment and goes inside the blank: en espèces (cash), par carte (card), avec mon téléphone (phone). |
| can_you | Can you ___, please? | Vous pouvez ___, s'il vous plaît ? | voo poo-VAY, seel voo PLEH | Frame: ___ is filled with a word. Blank takes an infinitive; object pronouns go before it inside the blank (me l'écrire, m'aider, répéter). Polite vous, matching the vetted 'Vous pouvez répéter ?'. |
| like_without | I'd like ___ without ___. | Je voudrais ___ sans ___. | zhuh voo-DRAY ... sahn | Frame: ___ is filled with a word. First blank takes the item with its article (un café, un thé, de l'eau); second blank takes a bare noun, no article after 'sans' (sans lait, sans sucre, sans glaçons). |
| can_i_here | Can I ___ here? | Je peux ___ ici ? | zhuh puh ... ee-SEE | Frame: ___ is filled with a word. Blank takes an infinitive; reflexive verbs bring 'me' inside the blank (m'asseoir, me garer). |
| looking_for | I'm looking for ___. | Je cherche ___. | zhuh SHEHRSH | Frame: ___ is filled with a word. Blank takes the noun with its article or possessive (mon hôtel, l'entrée, un restaurant). No preposition after 'chercher'. |
| is_included | Is ___ included? | ___ est compris ? | eh kohn-PREE | Frame: ___ is filled with a word. The verb and 'compris' agree with the noun: 'est compris' (masc. sing.), 'est comprise' (fem. sing.), 'sont compris/comprises' (plural). Blank takes the noun with its article. 'compris' matches the vetted 'Le service est compris ?'; 'inclus' is an equally common synonym, especially for flights and fares. |
| where_can_i | Where can I ___? | Où est-ce que je peux ___ ? | oo es-kuh zhuh PUH | Frame: ___ is filled with a word. Blank takes an infinitive phrase. 'Où est-ce que je peux' is neutral and polite; 'Où puis-je ___ ?' is more formal, 'Où je peux ___ ?' more casual. |
| where_is~word_pharmacy | Where is the pharmacy? | Où est la pharmacie ? | oo eh lah far-mah-SEE |  |
| where_is~word_atm | Where is an ATM? | Où est le distributeur de billets ? | oo eh luh dees-tree-bew-TUHR duh bee-YEH |  |
| where_is~word_supermarket | Where is the supermarket? | Où est le supermarché ? | oo eh luh sew-pehr-mar-SHAY |  |
| where_is~word_exit |  | Où est la sortie ? | oo eh lah sor-TEE |  |
| nearest~word_atm | Where is the nearest ATM? | Où est le distributeur de billets le plus proche ? | oo eh luh dees-tree-bew-TUHR duh bee-YEH luh plew PROSH |  |
| nearest~word_bus_stop | Where is the nearest bus stop? | Où est l'arrêt de bus le plus proche ? | oo eh lah-REH duh BEWSS luh plew PROSH |  |
| how_get~word_airport | How do I get to the airport? | Comment aller à l'aéroport ? | koh-MAHN ah-LAY ah lah-ay-roh-POR |  |
| how_get~word_train_station | How do I get to the train station? | Comment aller à la gare ? | koh-MAHN ah-LAY ah lah GAR |  |
| how_get~word_city_centre | How do I get to the city centre? | Comment aller au centre-ville ? | koh-MAHN ah-LAY oh sahn-truh-VEEL |  |
| how_get~word_beach | How do I get to the beach? | Comment aller à la plage ? | koh-MAHN ah-LAY ah lah PLAHZH |  |
| how_get~word_hotel | How do I get to the hotel? | Comment aller à l'hôtel ? | koh-MAHN ah-LAY ah loh-TEL |  |
| can_i_have~word_tea | Can I have a tea, please? | Je peux avoir un thé, s'il vous plaît ? | zhuh puh ah-vwahr uhn TAY, seel voo PLEH |  |
| can_i_have~word_beer | Can I have a beer, please? | Je peux avoir une bière, s'il vous plaît ? | zhuh puh ah-vwahr ewn BYEHR, seel voo PLEH |  |
| can_i_have~word_glass_of_wine | Can I have a glass of wine, please? | Je peux avoir un verre de vin, s'il vous plaît ? | zhuh puh ah-vwahr uhn vehr duh VAN, seel voo PLEH |  |
| can_i_have~word_orange_juice |  | Je peux avoir un jus d'orange, s'il vous plaît ? | zhuh puh ah-vwahr uhn zhew doh-RAHNZH, seel voo PLEH |  |
| can_i_have~word_menu | Can I have the menu, please? | Je peux avoir la carte, s'il vous plaît ? | zhuh puh ah-vwahr lah KART, seel voo PLEH |  |
| can_i_have~word_receipt | Can I have a receipt, please? | Je peux avoir un reçu, s'il vous plaît ? | zhuh puh ah-vwahr uhn ruh-SEW, seel voo PLEH |  |
| i_would_like~word_tea | I'd like a tea, please. | Je voudrais un thé, s'il vous plaît. | zhuh voo-dray uhn TAY, seel voo PLEH |  |
| i_would_like~word_beer | I'd like a beer, please. | Je voudrais une bière, s'il vous plaît. | zhuh voo-dray ewn BYEHR, seel voo PLEH |  |
| i_would_like~word_glass_of_wine |  | Je voudrais un verre de vin, s'il vous plaît. | zhuh voo-dray uhn vehr duh VAN, seel voo PLEH |  |
| i_would_like~word_orange_juice | I'd like an orange juice, please. | Je voudrais un jus d'orange, s'il vous plaît. | zhuh voo-dray uhn zhew doh-RAHNZH, seel voo PLEH |  |
| i_would_like~word_bread | I'd like some bread, please. | Je voudrais du pain, s'il vous plaît. | zhuh voo-dray dew PAN, seel voo PLEH |  |
| i_would_like~word_water | I'd like some water, please. | Je voudrais de l'eau, s'il vous plaît. | zhuh voo-dray duh LOH, seel voo PLEH |  |
| table_for~word_one | A table for one, please. | Une table pour une personne, s'il vous plaît. | ewn TAH-bluh poor ewn pehr-SON, seel voo PLEH |  |
| table_for~word_three | A table for three, please. | Une table pour trois, s'il vous plaît. | ewn TAH-bluh poor TRWAH, seel voo PLEH |  |
| allergic_to~word_nuts | I'm allergic to nuts. | Je suis allergique aux fruits à coque. | zhuh swee zah-lehr-ZHEEK oh frwee ah KOK | SAFETY: allergy/emergency. |
| allergic_to~word_peanuts | I'm allergic to peanuts. | Je suis allergique aux arachides. | zhuh swee zah-lehr-ZHEEK oh zah-rah-SHEED | SAFETY: allergy/emergency. |
| allergic_to~word_eggs |  | Je suis allergique aux œufs. | zhuh swee zah-lehr-ZHEEK oh ZUH | SAFETY: allergy/emergency. |
| without~word_meat | Without meat, please. | Sans viande, s'il vous plaît. | sahn VYAHND, seel voo PLEH | SAFETY: allergy/emergency. |
| without~word_milk | Without milk, please. | Sans lait, s'il vous plaît. | sahn LEH, seel voo PLEH | SAFETY: allergy/emergency. |
| without~word_gluten | Without gluten, please. | Sans gluten, s'il vous plaît. | sahn glew-TEN, seel voo PLEH | SAFETY: allergy/emergency. |
| without~word_ice | Without ice, please. | Sans glaçons, s'il vous plaît. | sahn glah-SOHN, seel voo PLEH | SAFETY: allergy/emergency. |
| without~word_nuts | Without nuts, please. | Sans fruits à coque, s'il vous plaît. | sahn frwee ah KOK, seel voo PLEH | SAFETY: allergy/emergency. |
| ticket_to~word_airport | A ticket to the airport, please. | Un billet pour l'aéroport, s'il vous plaît. | uhn bee-YEH poor lah-ay-roh-POR, seel voo PLEH |  |
| ticket_to~word_city_centre | A ticket to the city centre, please. | Un billet pour le centre-ville, s'il vous plaît. | uhn bee-YEH poor luh sahn-truh-VEEL, seel voo PLEH |  |
| ticket_to~word_beach | A ticket to the beach, please. | Un billet pour la plage, s'il vous plaît. | uhn bee-YEH poor lah PLAHZH, seel voo PLEH |  |
| ticket_to~word_train_station | A ticket to the train station, please. | Un billet pour la gare, s'il vous plaît. | uhn bee-YEH poor lah GAR, seel voo PLEH |  |
| does_this_go_to~word_airport | Does this go to the airport? | Est-ce qu'il va à l'aéroport ? | es-keel vah ah lah-ay-roh-POR |  |
| does_this_go_to~word_city_centre | Does this go to the city centre? | Est-ce qu'il va au centre-ville ? | es-keel vah oh sahn-truh-VEEL |  |
| does_this_go_to~word_beach | Does this go to the beach? | Est-ce qu'il va à la plage ? | es-keel vah ah lah PLAHZH |  |
| does_this_go_to~word_train_station | Does this go to the train station? | Est-ce qu'il va à la gare ? | es-keel vah ah lah GAR |  |
| take_me_to~word_airport | Take me to the airport, please. | Emmenez-moi à l'aéroport, s'il vous plaît. | ahn-muh-nay mwah ah lah-ay-roh-POR, seel voo PLEH |  |
| take_me_to~word_hotel | Take me to the hotel, please. | Emmenez-moi à l'hôtel, s'il vous plaît. | ahn-muh-nay mwah ah loh-TEL, seel voo PLEH |  |
| take_me_to~word_train_station | Take me to the train station, please. | Emmenez-moi à la gare, s'il vous plaît. | ahn-muh-nay mwah ah lah GAR, seel voo PLEH |  |
| take_me_to~word_city_centre | Take me to the city centre, please. | Emmenez-moi au centre-ville, s'il vous plaît. | ahn-muh-nay mwah oh sahn-truh-VEEL, seel voo PLEH |  |
| take_me_to~word_beach | Take me to the beach, please. | Emmenez-moi à la plage, s'il vous plaît. | ahn-muh-nay mwah ah lah PLAHZH, seel voo PLEH |  |
| doesnt_work~word_air_conditioning | The air conditioning doesn't work. | La climatisation ne marche pas. | lah klee-mah-tee-zah-SYOHN nuh marsh PAH |  |
| doesnt_work~word_shower | The shower doesn't work. | La douche ne marche pas. | lah DOOSH nuh marsh PAH |  |
| doesnt_work~word_wi_fi | The Wi-Fi doesn't work. | Le wifi ne marche pas. | luh wee-FEE nuh marsh PAH |  |
| doesnt_work~word_hot_water | The hot water doesn't work. | Il n'y a pas d'eau chaude. | eel nee ah pah doh SHOHD |  |
| doesnt_work~word_door_lock |  | La serrure ne marche pas. | lah seh-REWR nuh marsh PAH |  |
| lost_my~word_bag |  | J'ai perdu mon sac. | zhay pehr-dew mohn SAK | SAFETY: allergy/emergency. |
| lost_my~word_room_key | I lost my room key. | J'ai perdu la clé de ma chambre. | zhay pehr-dew lah KLAY duh mah SHAHN-bruh | SAFETY: allergy/emergency. |
| do_you_have~wifi | Do you have Wi-Fi? | Vous avez le Wi-Fi ? | voo zah-vay luh wee-FEE | French says 'le Wi-Fi' (the Wi-Fi). Usually pronounced 'wee-fee'. |
| do_you_have~vegetarian_food | Do you have vegetarian food? | Vous avez des plats végétariens ? | voo zah-vay day plah vay-zhay-tah-RYEN | Literally 'vegetarian dishes', the natural way to ask in a restaurant. 'Vous avez un menu végétarien ?' is also common. |
| do_you_have~charger | Do you have a phone charger? | Vous avez un chargeur de téléphone ? | voo zah-vay uhn shar-ZHUHR duh tay-lay-FON |  |
| how_much_is~ticket | How much is a ticket? | Combien coûte un billet ? | kohm-byen koot uhn bee-YEH | For metro/bus tickets 'un ticket' is also used in some cities (Paris metro). |
| how_much_is~coffee | How much is a coffee? | Combien coûte un café ? | kohm-byen koot uhn kah-FAY |  |
| how_much_is~room | How much is the room? | Combien coûte la chambre ? | kohm-byen koot lah SHAHN-bruh | To ask per night: 'C'est combien la nuit ?' |
| i_need~help | I need help, please. | J'ai besoin d'aide, s'il vous plaît. | zhay buh-zwan DED, seel voo PLEH | SAFETY. Back-translation: 'I have need of help, please.' = I need help. Natural and urgent enough; in a real emergency 'Au secours !' (help_shout) is the shout. |
| i_need~water | I need water, please. | J'ai besoin d'eau, s'il vous plaît. | zhay buh-zwan DOH, seel voo PLEH |  |
| i_need~taxi | I need a taxi, please. | J'ai besoin d'un taxi, s'il vous plaît. | zhay buh-zwan duhn tahk-SEE, seel voo PLEH | Grammatical and clear; to ask someone to call one, 'Vous pouvez m'appeler un taxi ?' is more natural. |
| is_there_nearby~bathroom | Is there a bathroom nearby? | Il y a des toilettes près d'ici ? | eel yah day twah-LET preh dee-SEE | 'toilettes' is always plural in this sense, hence 'des'. |
| is_there_nearby~pharmacy | Is there a pharmacy nearby? | Il y a une pharmacie près d'ici ? | eel yah ewn far-mah-SEE preh dee-SEE |  |
| is_there_nearby~atm | Is there an ATM nearby? | Il y a un distributeur de billets près d'ici ? | eel yah uhn dees-tree-bew-TUHR duh bee-YEH preh dee-SEE | Matches the vetted ATM word; 'un distributeur' alone and 'un DAB' are also heard. |
| is_there_nearby~supermarket | Is there a supermarket nearby? | Il y a un supermarché près d'ici ? | eel yah uhn sew-pehr-mar-SHAY preh dee-SEE |  |
| pay_with~cash | Can I pay with cash? | Je peux payer en espèces ? | zhuh puh pay-yay ahn ness-PESS | 'en liquide' (ahn lee-KEED) is an equally common, more casual alternative. |
| pay_with~phone | Can I pay with my phone? | Je peux payer avec mon téléphone ? | zhuh puh pay-yay ah-vek mohn tay-lay-FON | 'payer sans contact' (pay contactless) is also widely understood. |
| can_you~write | Can you write it down, please? | Vous pouvez me l'écrire, s'il vous plaît ? | voo poo-vay muh lay-KREER, seel voo PLEH | Literally 'Can you write it for me?'; the natural way to ask for something to be written down. |
| like_without~coffee_milk | I'd like a coffee without milk. | Je voudrais un café sans lait. | zhuh voo-dray uhn kah-FAY sahn LEH | In France 'un café' is an espresso, served black by default, so 'sans lait' mostly matters when ordering a longer coffee ('un café allongé sans lait'). |
| like_without~tea_sugar | I'd like a tea without sugar. | Je voudrais un thé sans sucre. | zhuh voo-dray uhn TAY sahn SEW-kruh |  |
| like_without~water_ice | I'd like water without ice. | Je voudrais de l'eau sans glaçons. | zhuh voo-dray duh LOH sahn glah-SOHN |  |
| can_i_here~photos | Can I take photos here? | Je peux prendre des photos ici ? | zhuh puh prahn-druh day foh-TOH ee-SEE |  |
| can_i_here~charge | Can I charge my phone here? | Je peux recharger mon téléphone ici ? | zhuh puh ruh-shar-ZHAY mohn tay-lay-FON ee-SEE |  |
| looking_for~my_hotel | I'm looking for my hotel. | Je cherche mon hôtel. | zhuh shehrsh mohn noh-TEL |  |
| looking_for~entrance | I'm looking for the entrance. | Je cherche l'entrée. | zhuh shehrsh lahn-TRAY |  |
| looking_for~restaurant | I'm looking for a restaurant. | Je cherche un restaurant. | zhuh shehrsh uhn ress-toh-RAHN |  |
| looking_for~exit | I'm looking for the exit. | Je cherche la sortie. | zhuh shehrsh lah sor-TEE |  |
| is_included~breakfast | Is breakfast included? | Le petit-déjeuner est compris ? | luh puh-tee day-zhuh-NAY eh kohn-PREE |  |
| is_included~tax | Is tax included? | Les taxes sont comprises ? | lay TAHKS sohn kohn-PREEZ | Plural form (sont comprises). In France sales tax (TVA) is always in the shown price; at hotels the question is usually about 'la taxe de séjour' (tourist tax): 'La taxe de séjour est comprise ?' |
| is_included~wifi | Is Wi-Fi included? | Le Wi-Fi est compris ? | luh wee-FEE eh kohn-PREE |  |
| is_included~luggage | Is luggage included? | Les bagages sont compris ? | lay bah-GAHZH sohn kohn-PREE | Plural form (sont compris). For a flight, 'Le bagage en soute est inclus ?' (Is checked baggage included?) is the more specific airline phrasing. |
| where_can_i~buy_tickets | Where can I buy tickets? | Où est-ce que je peux acheter des billets ? | oo es-kuh zhuh puh ahsh-TAY day bee-YEH |  |
| where_can_i~taxi | Where can I get a taxi? | Où est-ce que je peux prendre un taxi ? | oo es-kuh zhuh puh prahn-druh uhn tahk-SEE | 'prendre un taxi' (take a taxi) is the natural verb for 'get a taxi'. |
| where_can_i~change_money | Where can I change money? | Où est-ce que je peux changer de l'argent ? | oo es-kuh zhuh puh shahn-zhay duh lar-ZHAHN |  |
| where_can_i~sim | Where can I buy a SIM card? | Où est-ce que je peux acheter une carte SIM ? | oo es-kuh zhuh puh ahsh-tay ewn kart SEEM |  |
| reply~inside_or_outside | Inside or outside? | À l'intérieur ou en terrasse ? | ah lan-tay-RYUHR oo ahn teh-RASS | Said TO the traveller by staff. Waiters also say 'En salle ou en terrasse ?' |
| reply~how_many_people | How many people? | Vous êtes combien ? | voo ZET kohm-BYEN | Said TO the traveller by staff. |
| reply~have_booking | Do you have a reservation? | Vous avez une réservation ? | voo zah-VAY ewn ray-zehr-vah-SYOHN | Said TO the traveller by staff. |
| reply~next_stop | Next stop. | Prochain arrêt. | proh-sheh-nah-REH | Said TO the traveller by staff. |
| reply~its_closed | It's closed. | C'est fermé. | say fehr-MAY | Said TO the traveller by staff. |
| reply~one_moment | One moment, please. | Un instant, s'il vous plaît. | uh-nan-STAHN, seel voo PLEH | Said TO the traveller by staff. |
| reply~what_size | What size? | Quelle taille ? | kel TIE | Said TO the traveller by staff. For shoes: 'Quelle pointure ?' (kel pwan-TEWR). |
| reply~receipt_question | Would you like a receipt? | Vous voulez le ticket ? | voo voo-LAY luh tee-KEH | Said TO the traveller by staff. In shops and cafés the receipt is usually 'le ticket'; 'un reçu' is also heard. |
| reply~how_would_you_like_it | How would you like it cut? | Je vous les coupe comment ? | zhuh voo lay koop koh-MAHN | Said TO the traveller by staff. Uncertain: also 'Qu'est-ce qu'on vous fait ?' (What are we doing for you?). Phrasing varies by barber. |
| word~word_train_station | train station | la gare | lah GAR | A single word, as it would appear inside a sentence. |
| word~word_bus_stop | bus stop | l'arrêt de bus | lah-REH duh BEWSS | A single word, as it would appear inside a sentence. |
| word~word_airport | airport | l'aéroport | lah-ay-roh-POR | A single word, as it would appear inside a sentence. |
| word~word_metro_station | metro station | la station de métro | lah stah-SYOHN duh may-TROH | A single word, as it would appear inside a sentence. |
| word~word_hotel | hotel | l'hôtel | loh-TEL | A single word, as it would appear inside a sentence. |
| word~word_beach | beach | la plage | lah PLAHZH | A single word, as it would appear inside a sentence. |
| word~word_city_centre | city centre | le centre-ville | luh sahn-truh-VEEL | A single word, as it would appear inside a sentence. |
| word~word_pharmacy | pharmacy | la pharmacie | lah far-mah-SEE | A single word, as it would appear inside a sentence. |
| word~word_atm | ATM | le distributeur de billets | luh dees-tree-bew-TUHR duh bee-YEH | A single word, as it would appear inside a sentence. |
| word~word_supermarket | supermarket | le supermarché | luh sew-pehr-mar-SHAY | A single word, as it would appear inside a sentence. |
| word~word_platform | platform | le quai | luh KAY | A single word, as it would appear inside a sentence. |
| word~word_ticket_office | ticket office | le guichet | luh gee-SHEH | A single word, as it would appear inside a sentence. |
| word~word_exit | exit | la sortie | lah sor-TEE | A single word, as it would appear inside a sentence. |
| word~word_entrance | entrance | l'entrée | lahn-TRAY | A single word, as it would appear inside a sentence. |
| word~word_tea | tea | un thé | uhn TAY | A single word, as it would appear inside a sentence. |
| word~word_beer | beer | une bière | ewn BYEHR | A single word, as it would appear inside a sentence. |
| word~word_glass_of_wine | glass of wine | un verre de vin | uhn vehr duh VAN | A single word, as it would appear inside a sentence. |
| word~word_orange_juice | orange juice | un jus d'orange | uhn zhew doh-RAHNZH | A single word, as it would appear inside a sentence. |
| word~word_menu | menu | la carte | lah KART | A single word, as it would appear inside a sentence. |
| word~word_bill | bill | l'addition | lah-dee-SYOHN | A single word, as it would appear inside a sentence. |
| word~word_bag | bag | un sac | uhn SAK | A single word, as it would appear inside a sentence. |
| word~word_receipt | receipt | un reçu | uhn ruh-SEW | A single word, as it would appear inside a sentence. |
| word~word_water | water | de l'eau | duh LOH | A single word, as it would appear inside a sentence. |
| word~word_coffee | coffee | un café | uhn kah-FAY | A single word, as it would appear inside a sentence. |
| word~word_bread | bread | du pain | dew PAN | A single word, as it would appear inside a sentence. |
| word~word_milk | milk | du lait | dew LEH | A single word, as it would appear inside a sentence. |
| word~word_ice | ice | des glaçons | day glah-SOHN | A single word, as it would appear inside a sentence. |
| word~word_nuts | nuts | les fruits à coque | lay frwee ah KOK | A single word, as it would appear inside a sentence. |
| word~word_gluten | gluten | le gluten | luh glew-TEN | A single word, as it would appear inside a sentence. |
| word~word_shellfish | shellfish | les fruits de mer | lay frwee duh MEHR | A single word, as it would appear inside a sentence. |
| word~word_eggs | eggs | les œufs | lay ZUH | A single word, as it would appear inside a sentence. |
| word~word_meat | meat | la viande | lah VYAHND | A single word, as it would appear inside a sentence. |
| word~word_dairy | dairy | les produits laitiers | lay proh-dwee lay-TYAY | A single word, as it would appear inside a sentence. |
| word~word_peanuts | peanuts | les arachides | lay zah-rah-SHEED | A single word, as it would appear inside a sentence. |
| word~word_passport | passport | le passeport | luh pahss-POR | A single word, as it would appear inside a sentence. |
| word~word_phone | phone | le téléphone | luh tay-lay-FON | A single word, as it would appear inside a sentence. |
| word~word_wallet | wallet | le portefeuille | luh por-tuh-FUHY | A single word, as it would appear inside a sentence. |
| word~word_keys | keys | les clés | lay KLAY | A single word, as it would appear inside a sentence. |
| word~word_ticket | ticket | le billet | luh bee-YEH | A single word, as it would appear inside a sentence. |
| word~word_room_key | room key | la clé de la chambre | lah KLAY duh lah SHAHN-bruh | A single word, as it would appear inside a sentence. |
| word~word_air_conditioning | air conditioning | la climatisation | lah klee-mah-tee-zah-SYOHN | A single word, as it would appear inside a sentence. |
| word~word_shower | shower | la douche | lah DOOSH | A single word, as it would appear inside a sentence. |
| word~word_wi_fi | Wi-Fi | le wifi | luh wee-FEE | A single word, as it would appear inside a sentence. |
| word~word_tv | TV | la télé | lah tay-LAY | A single word, as it would appear inside a sentence. |
| word~word_hot_water | hot water | l'eau chaude | loh SHOHD | A single word, as it would appear inside a sentence. |
| word~word_door_lock | door lock | la serrure | lah seh-REWR | A single word, as it would appear inside a sentence. |
| word~word_one | one | un | uhn | A single word, as it would appear inside a sentence. |
| word~word_two | two | deux | duh | A single word, as it would appear inside a sentence. |
| word~word_three | three | trois | trwah | A single word, as it would appear inside a sentence. |
| word~word_four | four | quatre | KAH-truh | A single word, as it would appear inside a sentence. |
| word~word_five | five | cinq | sank | A single word, as it would appear inside a sentence. |
| word~word_six | six | six | seess | A single word, as it would appear inside a sentence. |
| word~word_seven | seven | sept | set | A single word, as it would appear inside a sentence. |
| word~word_eight | eight | huit | weet | A single word, as it would appear inside a sentence. |
| word~word_nine | nine | neuf | nuhf | A single word, as it would appear inside a sentence. |
| word~word_ten | ten | dix | deess | A single word, as it would appear inside a sentence. |
| word~word_twenty | twenty | vingt | van | A single word, as it would appear inside a sentence. |
| word~word_fifty | fifty | cinquante | san-KAHNT | A single word, as it would appear inside a sentence. |
| word~word_one_hundred | one hundred | cent | sahn | A single word, as it would appear inside a sentence. |
| word~word_upstairs | upstairs | en haut | ahn OH | A single word, as it would appear inside a sentence. |
| word~word_downstairs | downstairs | en bas | ahn BAH | A single word, as it would appear inside a sentence. |
| word~word_near | near | près | preh | A single word, as it would appear inside a sentence. |
| word~word_far | far | loin | lwan | A single word, as it would appear inside a sentence. |
| word~word_today | today | aujourd'hui | oh-zhoor-DWEE | A single word, as it would appear inside a sentence. |
| word~word_tomorrow | tomorrow | demain | duh-MAN | A single word, as it would appear inside a sentence. |
| word~word_now | now | maintenant | mant-NAHN | A single word, as it would appear inside a sentence. |
| word~word_later | later | plus tard | plew TAR | A single word, as it would appear inside a sentence. |
| word~word_open | open | ouvert | oo-VEHR | A single word, as it would appear inside a sentence. |
| word~word_closed | closed | fermé | fehr-MAY | A single word, as it would appear inside a sentence. |
| word~word_yes | yes | oui | wee | A single word, as it would appear inside a sentence. |
| word~word_no | no | non | nohn | A single word, as it would appear inside a sentence. |
| word~word_cash | cash | les espèces | lay zes-PESS | A single word, as it would appear inside a sentence. |
| word~word_card | card | la carte | lah KART | A single word, as it would appear inside a sentence. |
