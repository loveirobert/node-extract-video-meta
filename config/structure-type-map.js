const readNext = (buffer, readState, structureLength, length, reader) => {
  let data = []
  for (let i = readState.position; i < readState.position + structureLength; i += length) {
    const buf = Buffer.from(buffer.slice(i, i + length))
    if (structureLength === 1) {
      data = buf
    } else if (reader && structureLength === length) {
      data = buf[reader](0, length)
    } else if (reader) {
      data.push(buf[reader](0, length))
    } else {
      data.push(buf)
    }
  }
  readState.position += structureLength
  return data
}

const getDataParts = ({
  reader, buffer, byteLength, structureLength, structureRepeat,
}) => {
  const dataParts = []
  const readState = {
    position: 0,
  }
  while (readState.position < structureLength * structureRepeat) {
    dataParts.push(readNext(buffer, readState, structureLength, byteLength, reader))
  }
  return dataParts
}

const structureTypeMap = {
  '\u0000': {
    description: 'null',
  },
  c: {
    description: 'single byte c style ASCII character string',
    byteLength: 1,
    read: ({ buffer, structureLength, structureRepeat }) => getDataParts({
      byteLength: 1,
      buffer,
      structureLength,
      structureRepeat,
    }).map((character) => (Array.isArray(character) ? character.map((char) => char.toString()).join('') : character.toString())).join(''),
  },
  f: {
    description: '32-bit float (IEEE 754)',
    byteLength: 4,
    read: ({ buffer, structureLength, structureRepeat }) => getDataParts({
      reader: 'readFloatBE',
      byteLength: 4,
      buffer,
      structureLength,
      structureRepeat,
    }),
  },
  l: {
    description: '32-bit signed integer',
    byteLength: 4,
    read: ({ buffer, structureLength, structureRepeat }) => getDataParts({
      reader: 'readIntBE',
      byteLength: 4,
      buffer,
      structureLength,
      structureRepeat,
    }),
  },
  L: {
    description: '32-bit unsigned integer',
    byteLength: 4,
    read: ({ buffer, structureLength, structureRepeat }) => getDataParts({
      reader: 'readUIntBE',
      byteLength: 4,
      buffer,
      structureLength,
      structureRepeat,
    }),
  },
  s: {
    description: '16-bit signed integer',
    byteLength: 2,
    read: ({ buffer, structureLength, structureRepeat }) => getDataParts({
      reader: 'readIntBE',
      byteLength: 2,
      buffer,
      structureLength,
      structureRepeat,
    }),
  },
  S: {
    description: '16-bit unsigned integer',
    byteLength: 2,
    read: ({ buffer, structureLength, structureRepeat }) => getDataParts({
      reader: 'readUIntBE',
      byteLength: 2,
      buffer,
      structureLength,
      structureRepeat,
    }),
  },
  U: {
    description: 'Date + UTC Time format yymmddhhmmss.sss - (years 20xx covered)',
    byteLength: 1,
    read: ({ buffer, structureLength, structureRepeat }) => getDataParts({
      byteLength: 1,
      buffer,
      structureLength,
      structureRepeat,
    }).join(''),
  },
}

module.exports = structureTypeMap
