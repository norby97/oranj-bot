const { caesarEncrypt, caesarDecrypt } = require('./caesar');
const { vigenereEncrypt, vigenereDecrypt } = require('./vigenere');

const plaintexts = [
  'oranges are not what they seem',
  'peel back the layers to reveal truth',
  'golden juice hides bitter secrets',
  'some fruits ferment into power'
];

function generateChallenge(difficulty) {
  const original = plaintexts[Math.floor(Math.random() * plaintexts.length)];
  let encrypted = original;
  const layers = [];

  switch (difficulty) {
    case 'easy':
      encrypted = caesarEncrypt(encrypted, 3);
      layers.push((text) => caesarDecrypt(text, 3));
      break;
    case 'medium':
      encrypted = caesarEncrypt(encrypted, 5);
      encrypted = vigenereEncrypt(encrypted, 'PURPLE');
      layers.push((text) => vigenereDecrypt(text, 'PURPLE'));
      layers.push((text) => caesarDecrypt(text, 5));
      break;
    case 'hard':
      encrypted = caesarEncrypt(encrypted, 2);
      encrypted = vigenereEncrypt(encrypted, 'PEEL');
      encrypted = vigenereEncrypt(encrypted, 'BRONZE');
      layers.push((text) => vigenereDecrypt(text, 'BRONZE'));
      layers.push((text) => vigenereDecrypt(text, 'PEEL'));
      layers.push((text) => caesarDecrypt(text, 2));
      break;
    case 'veryhard':
      encrypted = caesarEncrypt(encrypted.split('').reverse().join(''), 7);
      encrypted = vigenereEncrypt(encrypted, 'SILVER');
      layers.push((text) => vigenereDecrypt(text, 'SILVER'));
      layers.push((text) => caesarDecrypt(text, 7));
      layers.push((text) => text.split('').reverse().join(''));
      break;
    case 'insane':
      encrypted = caesarEncrypt(encrypted, 6);
      encrypted = vigenereEncrypt(encrypted, 'GOLD');
      encrypted = encrypted.split('').reverse().join('');
      encrypted = caesarEncrypt(encrypted, 4);
      layers.push((text) => caesarDecrypt(text, 4));
      layers.push((text) => text.split('').reverse().join(''));
      layers.push((text) => vigenereDecrypt(text, 'GOLD'));
      layers.push((text) => caesarDecrypt(text, 6));
      break;
  }

  return {
    encrypted,
    original,
    check: (attempt) =>
      attempt.toLowerCase().replace(/\s+/g, '') ===
      original.toLowerCase().replace(/\s+/g, ''),
    layers
  };
}

function checkSolution(attempt, challenge) {
  return challenge.check(attempt);
}

module.exports = { generateChallenge, checkSolution };
