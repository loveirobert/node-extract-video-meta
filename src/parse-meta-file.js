const { promisify } = require('util')
const fs = require('fs')

const read = promisify(fs.read)
const open = promisify(fs.open)

const signalMap = require('./lib/gopro/signal-map')
const structureTypeMap = require('./lib/gopro/structure-type-map')

const SIGNAL_TYPE_LENGTH = 4
const TYPE_STRUCTURE_LENGTH = 3
const DATA_TYPE_LENGTH = 1

const logger = console

const clean = (v) => v.replace(/\u0000/g, '')

let stats

// TODO: move this to somewhere else
const specials = ['', '?']
const isSpecial = (dataType) => specials.includes(dataType)
const accumulators = ['']
const isAccumulator = (dataType) => accumulators.includes(dataType)

const readNext = async ({ readLength, stateOfRead, metaFile }) => {
  const readBuffer = Buffer.alloc(readLength)
  await read(metaFile, readBuffer, 0, readLength, stateOfRead.position)
  stateOfRead.position += readLength
  return readBuffer
}

const getNextSignal = async ({ stateOfRead, metaFile }) => {
  const signalBuffer = await readNext({ readLength: SIGNAL_TYPE_LENGTH, stateOfRead, metaFile })
  const signal = clean(signalBuffer.toString())
  const signalDetails = signalMap[signal]

  if (stateOfRead.position > stats.size) return false

  if (signal.length < SIGNAL_TYPE_LENGTH || !signalDetails) {
    stateOfRead.position = stateOfRead.position - SIGNAL_TYPE_LENGTH + 1
    return getNextSignal({ stateOfRead, metaFile })
  }

  return signal
}

const readDataType = async ({ stateOfRead, metaFile }) => {
  const readBuffer = await readNext({ readLength: DATA_TYPE_LENGTH, stateOfRead, metaFile })
  return clean(readBuffer.toString('utf8', 0, DATA_TYPE_LENGTH))
}

const readStructure = async ({ stateOfRead, metaFile }) => {
  const buffer = await readNext({ readLength: TYPE_STRUCTURE_LENGTH, stateOfRead, metaFile })
  const structureLength = buffer.slice(0, 1).readUIntBE(0, 1)
  const structureRepeat = buffer.slice(1, 3).readUIntBE(0, 2)
  return { structureLength, structureRepeat }
}

const readValues = async ({
  stateOfRead, metaFile, dataTypeDetails, structure, dataType,
}) => {
  const readLength = structure.structureLength * structure.structureRepeat
  const buffer = await readNext({ readLength, stateOfRead, metaFile })
  const value = dataTypeDetails.read({ buffer, structureLength: structure.structureLength, structureRepeat: structure.structureRepeat })
  return dataType === 'c' ? clean(value) : value
}

async function* readSignals(metaFile, stateOfRead) {
  let signal
  while (signal !== false) {
    let value = ''
    signal = await getNextSignal({ stateOfRead, metaFile })
    const dataType = await readDataType({ stateOfRead, metaFile })
    const structure = await readStructure({ stateOfRead, metaFile })
    const dataTypeDetails = structureTypeMap[dataType]
    if (!isSpecial(dataType)) {
      value = await readValues({
        stateOfRead, metaFile, dataTypeDetails, structure, dataType,
      })
    }
    if (Array.isArray(value) && value.length === 1) [value] = value
    yield {
      signal, stateOfRead: { ...stateOfRead }, dataType, structure, value,
    }
  }
}

const pileUp = (parts) => {
  const hierarchy = []
  let batch = []

  parts.reverse().forEach((part, index) => {
    const lastPart = parts[index - 1]
    if (lastPart) {
      if (isAccumulator(lastPart.dataType)) {
        lastPart.values = [...batch.reverse()]
        const batchPart = batch.find((candidate) => signalMap[candidate.signal].hasEffectOn)
        if (batchPart) {
          const partWithEffect = signalMap[batchPart.signal]
          const { hasEffectOn, operation } = partWithEffect
          const applyOn = batch.find((candidate) => hasEffectOn.includes(candidate.signal))
          if (applyOn) applyOn.value = operation(batchPart.value, applyOn.value)
        }
        batch = []
        hierarchy.push(lastPart)
      }
    }
    if (!isAccumulator(part.dataType)) batch.push(part)
  })
  return hierarchy
}

const parseMetaFile = async (outputFile) => {
  const metaFile = await open(outputFile, 'r')
  stats = fs.statSync(outputFile)
  logger.log(stats)
  const generator = readSignals(metaFile, { position: 0 })

  const parts = []
  let done = false
  let part
  while (!done) {
    ({ value: part, done } = await generator.next())
    if (!done && part.signal) parts.push(part)
  }

  const hierarchy = pileUp(parts)

  return hierarchy
}

module.exports = parseMetaFile
