function caesarEncrypt(text, shift) {
  return text.replace(/[a-z]/gi, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(
      ((char.charCodeAt(0) - base + shift + 26) % 26) + base
    );
  });
}

function caesarDecrypt(text, shift) {
  return caesarEncrypt(text, -shift);
}

module.exports = { caesarEncrypt, caesarDecrypt };
