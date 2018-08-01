const signalMap = {
  DEVC: {
    description: 'DEVC - nested device data to speed the parsing of multiple devices in post',
  },
  DVID: {
    description: 'DVID - unique id per stream for a metadata source (in camera or external input) (single 4 byte int)',
  },
  DVNM: {
    description: 'DVNM - human readable device type/name (char string)',
  },
  STRM: {
    description: 'STRM - nested channel/stream of telemetry data',
  },
  WBAL: {
    description: 'WBAL - White Balance in Kelvin, 24, 25 or 30 (based video frame rate)',
  },
  STNM: {
    description: 'STNM - human readable telemetry/metadata stream type/name (char string)',
  },
  SIUN: {
    description: 'SIUN - Display string for metadata units where inputs are in SI units "uT","rad/s","km/s","m/s","mm/s" etc.',
  },
  UNIT: {
    description: 'UNIT - Freedform display string for metadata units (char sting like "RPM", "MPH", "km/h", etc)',
  },
  SCAL: {
    description: 'SCAL - divisor for input data to scale to the correct units',
  },
  TYPE: {
    description: 'TYPE - Type define for complex data structures',
  },
  TSMP: {
    description: 'TOTL - Total Sample Count including the current payload',
  },
  TICK: {
    description: 'TICK - Used for slow data. Beginning of data timing in milliseconds',
  },
  TOCK: {
    description: 'TOCK - Used for slow data. End of data timing in milliseconds',
  },
  EMPT: {
    description: 'EMPT - Payloads that are empty since the device start (e.g. BLE disconnect.)',
  },
  RMRK: {
    description: 'RMRK - addcing comments to the bitstream (debugging)',
  },
  TMPC: {
    description: 'TMPC - device temperature',
  },
  MTRX: {
    description: 'MTRX - Nobody knows what this is',
  },
  ORIN: {
    description: 'ORIN - Nobody knows what this is',
  },
  ORIO: {
    description: 'ORIO - Nobody knows what this is',
  },
  ACCL: {
    description: 'ACCL - Accelerometer data',
  },
  GYRO: {
    description: 'GYRO - Most probably gyroscope data',
  },
  GPSF: {
    description: 'GPSF - Most probably gps data',
  },
  GPSU: {
    description: 'GPSU - Most probably gps utc date',
  },
  GPSP: {
    description: 'GPSP - Most probably gps data again',
  },
  GPS5: {
    description: 'GPS5 - Most probably gps data again',
  },
  FACE: {
    description: 'FACE - Face detection boundaring boxes (struct ID,x,y,w,h -- not supported in HEVC modes)',
  },
  FCNM: {
    description: 'FCNM - Faces counted per frame',
  },
  ISOE: {
    description: 'ISOE - Sensor ISO',
  },
  SHUT: {
    description: 'SHUT - shutter exposure times',
  },
  WRGB: {
    description: 'WRGB - White Balance RGB gains (Geeky white balance info)',
  },
}

module.exports = signalMap
