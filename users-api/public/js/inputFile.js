const isAdvancedUpload = (function () {
  const div = document.createElement('div')
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window
}())

const draggableFileArea = document.querySelector('.drag-file-area')
const browseFileText = document.querySelector('.browse-files')
const uploadIcon = document.querySelector('.upload-icon')
const dragDropText = document.querySelector('.dynamic-message')
const fileInput = document.querySelector('.default-file-input')
const cannotUploadMessage = document.querySelector('.cannot-upload-message')
const cancelAlertButton = document.querySelector('.cancel-alert-button')
const uploadedFile = document.querySelector('.file-block')
const fileName = document.querySelector('.file-name')
const fileSize = document.querySelector('.file-size')
const progressBar = document.querySelector('.progress-bar')
const removeFileButton = document.querySelector('.remove-file-icon')
const uploadButton = document.querySelector('.upload-button')
let fileFlag = 0

fileInput.addEventListener('click', () => {
  fileInput.value = ''
  console.log(fileInput.value)
})

fileInput.addEventListener('change', e => {
  console.log(' > ' + fileInput.value)
  uploadIcon.innerHTML = '<i class="lni lni-checkmark-circle"></i>'
  dragDropText.innerHTML = 'File Dropped Successfully!'
  document.querySelector('.label').innerHTML = 'drag & drop or <span class="browse-files"> <input type="file" name="fingerprint" class="default-file-input" style=""/> <span class="browse-files-text" style="top: 0;"> browse file</span></span>'
  fileName.innerHTML = fileInput.files[0].name
  fileSize.innerHTML = (fileInput.files[0].size / 1024).toFixed(1) + ' KB'
  uploadedFile.style.cssText = 'display: flex;'
  progressBar.style.width = 0
  fileFlag = 0
})

uploadButton.addEventListener('click', () => {
  const isFileUploaded = fileInput.value
  if (isFileUploaded != '') {
    if (fileFlag == 0) {
      fileFlag = 1
      let width = 0
      const id = setInterval(frame, 50)
      function frame () {
        if (width >= 390) {
          clearInterval(id)
        } else {
          width += 5
          progressBar.style.width = width + 'px'
        }
      }
    }
  } else {
    cannotUploadMessage.style.cssText = 'display: flex; animation: fadeIn linear 1.5s;'
  }
})

cancelAlertButton.addEventListener('click', () => {
  cannotUploadMessage.style.cssText = 'display: none;'
})

if (isAdvancedUpload) {
  ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(evt =>
    draggableFileArea.addEventListener(evt, e => {
      e.preventDefault()
      e.stopPropagation()
    })
  );

  ['dragover', 'dragenter'].forEach(evt => {
    draggableFileArea.addEventListener(evt, e => {
      e.preventDefault()
      e.stopPropagation()
      uploadIcon.innerHTML = '<i class="lni lni-arrow-down-circle"></i>'
      dragDropText.innerHTML = 'Drop your file here!'
    })
  })

  draggableFileArea.addEventListener('drop', e => {
    uploadIcon.innerHTML = '<i class="lni lni-checkmark-circle"></i>'
    dragDropText.innerHTML = 'File Dropped Successfully!'
    document.querySelector('.label').innerHTML = 'drag & drop or <span class="browse-files"> <input type="file" name="fingerprint" class="default-file-input" style=""/> <span class="browse-files-text" style="top: -23px; left: -20px;"> browse file</span> </span>'

    const files = e.dataTransfer.files
    fileInput.files = files
    console.log(files[0].name + ' ' + files[0].size)
    console.log(document.querySelector('.default-file-input').value)
    fileName.innerHTML = files[0].name
    fileSize.innerHTML = (files[0].size / 1024).toFixed(1) + ' KB'
    uploadedFile.style.cssText = 'display: flex;'
    progressBar.style.width = 0
    fileFlag = 0
  })
}

removeFileButton.addEventListener('click', () => {
  uploadedFile.style.cssText = 'display: none;'
  fileInput.value = ''
  uploadIcon.innerHTML = '<i class="lni lni-upload"></i>'
  dragDropText.innerHTML = 'Drag & drop any file here'
  document.querySelector('.label').innerHTML = 'or <span class="browse-files"> <input type="file" name="fingerprint" class="default-file-input"/> <span class="browse-files-text">browse file</span> <span>from device</span> </span>'
})
