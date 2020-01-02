function getPinyin(item) {
  const res = {
    word: item.name,
    full: '',
    initial: ''
  }
  if (item.pinyin) {
    res.full = item.pinyin
    res.initial = item.pinyin.split(' ').map(m => m[0]).join('')
  }
  return res
}

function isMatchPinyin(word, pinyin) {
  return pinyin.word.indexOf(word) !== -1 ||
    pinyin.initial.indexOf(word) !== -1 ||
    pinyin.full.indexOf(word) !== -1
}

export { getPinyin, isMatchPinyin }
