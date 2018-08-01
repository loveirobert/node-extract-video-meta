const { promisify } = require('util')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const { exec } = require('child_process')

const asyncExec = promisify(exec)

const peelMetaStream = async (file, streamIndex, outputFile) => {
  // TODO: handle errors const { err, stdout, stderr } =
  await asyncExec(`${ffmpegPath} -y -i ${file} -codec copy -map 0:${streamIndex} -f rawvideo ${outputFile}`)
}

module.exports = peelMetaStream
