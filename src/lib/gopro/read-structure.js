const readNext = (buffer, readState, structureLength, length, reader) => {
  let data = []

  for (let i = readState.position; i < readState.position + structureLength; i += length) {
    const buf = Buffer.from(buffer.slice(i, i + length))
    if (reader) {
      if (reader && structureLength === length) {
        readState.position += structureLength
         return buf[reader](0, length)
      }
      data.push(buf[reader](0, length))
    }
    // TODO: totally split returned values with and without code
    if (structureLength === 1) {
      readState.position += structureLength
      return buf
    }
    data.push(buf)
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

module.exports = getDataParts
