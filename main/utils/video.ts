export function parseM3U8Header(m3u8: string) {
  const stream = [];
  const audio: Record<string, any> = {};
  const _list = m3u8.split('\n');
  const mediaFlag = '#EXT-X-MEDIA:';
  const streamFlag = '#EXT-X-STREAM-INF:';
  for (let i = 0; i < _list.length; i++) {
    const line = _list[i];
    if (line === '') continue;

    if (line.indexOf(mediaFlag) === 0) {
      const _obj = parseM3U8Value(line.slice(mediaFlag.length));
      audio[_obj['GROUP-ID']] = _obj;
      continue;
    }

    if (line.indexOf(streamFlag, 0) === 0) {
      const _obj = parseM3U8Value(line.slice(streamFlag.length));
      _obj['URL'] = _list[++i];
      stream.push(_obj);
    }
  }

  // console.log({ audio, stream });
  stream.forEach((item) => {
    item['AUDIO'] = audio[item['AUDIO']];
  });
  return stream;
}

export function parseM3U8Content(m3u8: string) {
  const res = [];
  const _list = m3u8.split('\n');
  const headerFlag = '#EXT-X-MAP:';
  const itemFlag = '#EXTINF:';
  for (let i = 0; i < _list.length; i++) {
    const line = _list[i];
    if (line === '') continue;

    if (line.indexOf(headerFlag) === 0) {
      const _obj = parseM3U8Value(line.slice(headerFlag.length));
      res.push(_obj['URI']);
      continue;
    }

    if (line.indexOf(itemFlag, 0) === 0) {
      res.push(_list[++i]);
    }
  }

  return res;
}

function parseM3U8Value(val: string) {
  const res: Record<string, any> = {};
  let k = '';
  let v = '';
  let writeInKey = true;
  let inVal = false;
  for (let i = 0; i < val.length; i++) {
    const c = val[i];
    if (c === '=' && !inVal) {
      writeInKey = false;
      continue;
    }
    if (c === '"') {
      inVal = !inVal;
      continue;
    }

    if (c === ',' && !inVal) {
      res[k] = v;
      k = '';
      v = '';
      writeInKey = true;
      continue;
    }
    if (writeInKey) k += c;
    else v += c;
  }
  res[k] = v;
  return res;
}
