// Browsers don't report a voice's gender, so it's looked up from the voice's first name.
// Covers the Apple and Microsoft voices for Wayword's languages; anything else is "unknown".

const FEMALE = `joana catarina luciana fernanda francisca raquel
monica paulina marisol isabela angelica jimena soledad elvira dalia
amelie audrey aurelie marie chantal denise eloise vivienne
alice federica paola emma elsa isabella
milena katya ekaterina svetlana dariya irina
laila mariam amira hoda salma sana layla amany zariyah
carmit hila`.split(/\s+/);

const MALE = `joaquim felipe duarte
jorge juan diego carlos alvaro
thomas jacques nicolas daniel henri remy
luca giuseppe cosimo
yuri pavel dmitry
majed maged tarik naayf taim rami laith hamed shakir
asaf avri`.split(/\s+/);

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function voiceGender(name) {
  const first = fold(name.replace(/^(microsoft|google|apple)\s+/i, '')).split(/[\s(,-]/)[0];
  if (FEMALE.includes(first)) return 'female';
  if (MALE.includes(first)) return 'male';
  return 'unknown';
}

// "Microsoft Hila Online (Natural) - Hebrew (Israel)" -> "Hila"
export function shortVoiceName(name) {
  return name.replace(/^(microsoft|google|apple)\s+/i, '').replace(/\s+(online|desktop).*$/i, '').replace(/\s*\(.*$/, '').trim() || name;
}
