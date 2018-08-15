const getDataParts = require('./read-structure')

const structureTypeMap = {
  '?': {
    description: 'Structure will be detailed later',
    special: true,
  },
  '': {
    description: 'null',
    special: true,
    accumulator: true,
  },
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

const structures = Object.values(structureTypeMap)

const specials = Object.keys(structureTypeMap).map((structureType, index) => {
  if (structures[index].special) return structureType
  return null
}).filter((v) => (v || v === ''))

const accumulators = Object.keys(structureTypeMap).map((structureType, index) => {
  if (structures[index].accumulator) return structureType
  return null
}).filter((v) => (v || v === ''))

const isSpecial = (key) => specials.includes(key)
const isAccumulator = (key) => accumulators.includes(key)

module.exports = {
  structureTypeMap,
  isSpecial,
  isAccumulator,
}
