// JavaScript version for lyric-format-convert


// param txt: String, the original mixed-lrc text
// return: Object, the vrc-format lyric
function mlrc2vrc (txt) {
  vrcObj = {
    'karaoke': false,
    'scrollDisabled': false,
    'translated': false,
    'origin': {
      'version': 2,
      'text': ''
    },
    'translate': {
      'version': 2,
      'text': ''
    }
  };

  let pattern = /\[.*?\]\s*[^\[\]]*/g;
  txt.match(pattern).forEach(item => {
    var splited = item.match(/^\s*([^]*?)\s*$/)[1].split('\n'); // the match is used for "strip"
    if (splited.length > 2) {
      vrcObj.translated = true;
    }
    vrcObj.origin.text += splited[0] + splited[1] + '\n';
    vrcObj.translate.text += splited[0] + (splited.length > 2 ? splited[2] : '') + '\n';
  });

  return vrcObj
}


exports.mlrc2vrc = mlrc2vrc