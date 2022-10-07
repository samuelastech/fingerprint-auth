const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, '../uploads')
  },

  filename: (req, file, callback) => {
    const replacedName = Date.now() + path.extname(file.originalname)
    callback(null, replacedName)
  }
})

const upload = multer({ storage })

module.exports = upload
