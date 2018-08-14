const { promisify } = require('util')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const { exec } = require('child_process')

const asyncExec = promisify(exec)

const logger = console

const peelMetaStream = async (file, streamIndex, outputFile) => {
  const { err } = await asyncExec(`${ffmpegPath} -y -i ${file} -codec copy -map 0:${streamIndex} -f rawvideo ${outputFile}`)
  if (err) logger.error(err.message)
}

module.exports = peelMetaStream
