const { promisify } = require('util')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path
const ffmpeg = require('fluent-ffmpeg')

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

const ffbrope = promisify(ffmpeg.ffprobe)

const getVideoMetaIndex = async (file, metaType) => {
  const { streams } = await ffbrope(file)
  const gpsStreamIndex = streams.findIndex(((s) => s.codec_tag_string === metaType))
  return gpsStreamIndex
}

module.exports = getVideoMetaIndex
