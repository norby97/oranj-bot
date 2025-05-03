function vigenere(text, key, decrypt = false) {
  let result = '';
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const code = text.charCodeAt(i);
    if (/[a-z]/i.test(c)) {
      const base = code >= 97 ? 97 : 65;
      const k = key.charCodeAt(j % key.length) - 65;
      const shift = decrypt ? -k : k;
      const newChar = String.fromCharCode(
        ((code - base + shift + 26) % 26) + base
      );
      result += newChar;
      j++;
    } else {
      result += c;
    }
  }
  return result;
}

module.exports = {
  vigenereEncrypt: (text, key) => vigenere(text, key, false),
  vigenereDecrypt: (text, key) => vigenere(text, key, true)
};
