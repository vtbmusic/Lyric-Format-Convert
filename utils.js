// JavaScript version for lyric-format-convert


// param txt: String, the original mixed-lrc text
// return: Object, the vrc-format lyric
function mlrc2vrc (txt) {
  var vrcObj = {
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
    var stripped = item.match(/^\s*([^]*?)\s*$/)[1]; // the match is used for "strip"
    var matchObj = stripped.match(/(\[.*?\])\s*([^\[\]]*)/);
    var timeStamp = matchObj[1];
    var splited = matchObj[2] ? matchObj[2].split('\n') : ['']; // special for js: need to handle "undefined"
    if (splited.length > 1) {
      vrcObj.translated = true;
    }
    vrcObj.origin.text += timeStamp + splited[0] + '\n';
    vrcObj.translate.text += timeStamp + (splited.length > 1 ? splited[1] : '') + '\n';
  });

  return vrcObj;
}


// param origin: String, lrc text with origin language
// param translated: String, lrc text with translated language
// return: String, mixed-lrc text with origin language at first line and translated language at second line
function lrcs2mlrc (origin, translated) {
  let pattern = /\[.*?\]\s*[^\[\]]*/g;
  var oriMatches = [];
  var transMatches = {};
  origin.match(pattern).forEach(item => {
    var matches = item.match(/^(\[.*?\])\s*([^]*)$/);
    oriMatches.push([matches[1], matches[2]]);
  });
  translated.match(pattern).forEach(item => {
    var matches = item.match(/^(\[.*?\])\s*([^]*)$/);
    transMatches[matches[1]] = matches[2];
  });

  mixedLrc = '';
  oriMatches.forEach(item => {
    let time = item[0];
    let text = item[1];
    let lrc = time + '\n' + text + (transMatches[time] ? transMatches[time] : '\n');
    mixedLrc += lrc;
  });
  
  return mixedLrc;
}


// param vrcObj: Object, the vrc-format lyric
// return: String, mixed-lrc text with origin language at first line and translated language at second line
function vrc2mlrc (vrcObj) {
  let ori = vrcObj.origin.text;
  let trans = vrcObj.translate.text;
  return lrcs2mlrc(ori, trans);
}


// param assTxt: String, lyric in format of ass
// return: Object, the vrc-format lyric
function ass2vrc (assTxt) {
  var vrcObj = {
    'karaoke': false,
    'scrollDisabled': false,
    'translated': true, // must be true
    'origin': {
      'version': 2,
      'text': ''
    },
    'translate': {
      'version': 2,
      'text': ''
    }
  };

  let lines = assTxt.split('\n');
  var targeted = 0; // state marker
  var startId = -1;
  var endId = -1;
  var textId = -1;
  for (var i in lines) {
    let line = lines[i];
    if (line === '[Events]') {
      targeted = 1;
      continue;
    }
    if (!targeted) continue;

    line = line.replace(/ /g, ''); // erase spaces
    if (line.length === 0) continue; // empty line

    let pos = line.search(':');
    let items = pos.slice(pos + 1).split(',');
    if (targeted === 1) {
      // find position for start, end, text.
      for (var j in items) {
        let attr = items[j];
        if (attr === 'Start') startId = j;
        else if (attr === 'End') endId = j;
        else if (attr === 'Text') textId = j;

        if (startId === -1) throw 'Fail to find "Start" attribute in [Events]';
        if (endId === -1) throw 'Fail to find "End" attribute in [Events]';
        if (textId === -1) throw 'Fail to find "Text" attribute in [Events]';

        targeted = 2;
      }
    } else if (targeted === 2) {
      let start = items[startId];
      let end = items[endId]; // not used for now
      let text = items[textId];
      text = text.split('\\N');
      if (text.length < 2) throw 'Fail to find translation in line ' + i;
      oriText = text[0];
      transText = text[1];
      vrcObj.origin.text += '[' + start + ']' + oriText + '\n';
      vrcObj.translate.text += '[' + start + ']' + transText + '\n';
    }
  }

  return vrcObj;
}


exports.mlrc2vrc = mlrc2vrc;
exports.lrcs2mlrc = lrcs2mlrc;
exports.vrc2mlrc = vrc2mlrc;
exports.ass2vrc = ass2vrc;