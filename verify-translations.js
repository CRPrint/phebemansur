import fs from 'fs';

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
    } else {
      keys.push(`${prefix}${key}`);
    }
  }
  return keys;
}

try {
  const en = JSON.parse(fs.readFileSync('./en-US.json', 'utf-8'));
  const es = JSON.parse(fs.readFileSync('./es-US.json', 'utf-8'));

  const enKeys = getKeys(en).sort();
  const esKeys = getKeys(es).sort();

  const missingInEs = enKeys.filter(k => !esKeys.includes(k));
  const missingInEn = esKeys.filter(k => !enKeys.includes(k));

  if (missingInEs.length > 0 || missingInEn.length > 0) {
    console.error('❌ Translation key mismatch found!');
    if (missingInEs.length > 0) {
      console.error('Keys in English but missing in Spanish:', missingInEs);
    }
    if (missingInEn.length > 0) {
      console.error('Keys in Spanish but missing in English:', missingInEn);
    }
    process.exit(1);
  } else {
    console.log('✅ Translation check passed. All keys match perfectly!');
    process.exit(0);
  }
} catch (error) {
  console.error('Error verifying translations:', error);
  process.exit(1);
}
