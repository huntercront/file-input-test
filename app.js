function readableBytes(bytes) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
        sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

let dropArea = document.querySelector(".drop-aria");
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)

});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

function highlight(e) {
    dropArea.classList.add('in-aria')
}

function unhighlight(e) {
    dropArea.classList.remove('in-aria')
}

function handleDrop(e) {
    var dt = e.dataTransfer
    var files = dt.files
    handleFiles(files)
}

let uploadProgress = []

function initializeProgress(numFiles, file) {
    for (let i = numFiles; i > 0; i--) {
        uploadProgress.push(file[numFiles - i].name)
        if (uploadProgress.length == numFiles) {
            document.querySelector('.drop-aria').classList.add('upload-complite')
            document.querySelector('.drop-aria').classList.remove('ready-new')
            document.querySelector('.drag-drop-label label').textContent = 'Загрузить еще';
        }
    }
}


function handleFiles(files) {
    files = [...files]
    initializeProgress(files.length, files)
    files.forEach(previewFile)
}



function previewFile(file) {

    var z = document.createElement('div');
    z.className = 'doc-box';
    console.log(file.type);
    z.innerHTML = '<div class="doc-inner c-s"> <div class="doc-icon c-c"> <img src="./img/icon-file-jpg.svg" alt=""> </div> <div class="doc-info"> <div class="doc-name" title="' + file.name + '">' + file.name + '</div> <div class="doc-meta"> <span>' + readableBytes(file.size) + '</span> </div> </div> <div class="doc-box-icon doc-remove c-c"> <i class="icon-trash"></i> </div> </div>'
    document.querySelector('.drag-drop-uploaded').appendChild(z);

}

Array.prototype.remByVal = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}



let filesAria = document.querySelector('.drop-aria-input')
filesAria.addEventListener('click', event => {
    if (event.target.classList.contains('doc-remove')) {
        let curentfile = event.target.closest('.doc-box')
        let fileName = curentfile.querySelector('.doc-name').textContent;
        curentfile.classList.add('doc-box-removed')
        uploadProgress.remByVal(fileName);
        setTimeout(() => {
            curentfile.remove();
            if (uploadProgress.length == 0) {
                document.querySelector('.drop-aria').classList.remove('upload-complite');
                document.querySelector('.drop-aria').classList.add('ready-new');
                document.querySelector('.drag-drop-label label').textContent = 'Выбери файлы';
            }
        }, 200);
    }
})