const { promisify } = require('util')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path
const ffmpeg = require('fluent-ffmpeg')

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

const ffbrope = promisify(ffmpeg.ffprobe)
const logger = console

const getVideoMetaIndex = async (file, metaType) => {
  let gpsStreamIndex
  try {
    const { streams } = await ffbrope(file)
    gpsStreamIndex = streams.findIndex(((s) => s.codec_tag_string === metaType))
  } catch (err) {
    logger.error(err.message)
  }
  return gpsStreamIndex
}

module.exports = getVideoMetaIndex
