(function main() {
  var apiUrl = 'https://office.spinney.io:5623/api/';

  var root = document.getElementById('root');
  var fileInput = document.getElementById('file-input');
  var sourceImageContainer = document.getElementById('source-image-container');
  var targetImageContainer = document.getElementById('target-image-container');
  var submitButton = document.getElementById('submit-button');
  var loader = document.getElementById('loader');
  var errorContainer = document.getElementById('error-container');
  var inProgress = false;

  var fileSelected = fileInput && fileInput.files && fileInput.files[0];

  if (fileSelected) {
    handleFile(sourceImageContainer, fileSelected);
  }

  function onSubmit() {
    if (inProgress) {
      return;
    }
    var image = targetImageContainer.getElementsByTagName('img')[0];
    if (image) {
      image.parentElement.removeChild(image);
    }
    submitButton.classList.add('processing');
    loader.classList.remove('disabled');
    inProgress = true;
    errorContainer.innerText = '';
    var httpRequest = new XMLHttpRequest();
    httpRequest.addEventListener('load', handleRequest);
    httpRequest.addEventListener('loadend', clearProcessing);
    httpRequest.open('POST', apiUrl);
    httpRequest.responseType = 'blob';
    var reader = new FileReader();
    reader.onload = function () {
      httpRequest.send(this.result);
    };
    httpRequest.setRequestHeader('Content-Type', fileSelected.type);
    reader.readAsArrayBuffer(fileSelected);
  }

  function clearProcessing() {
    submitButton.classList.remove('processing');
    loader.classList.add('disabled');
    inProgress = false;
  }

  function handleRequest() {
    if (this.status === 200) {
      handleFile(targetImageContainer, this.response);
    } else {
      if (this.response.type === 'application/json') {
        var reader = new FileReader();
        reader.onload = function() {
          var response = JSON.parse(this.result);
          errorContainer.innerText = response.message;
        };
        reader.readAsText(this.response);
      } else {
        errorContainer.innerText = 'Unknown error';
      }
    }
  }

  function updateImage(container, image) {
    var imageContainer = container.getElementsByTagName('img')[0];
    if (imageContainer) {
      imageContainer.src = image;
    } else {
      imageContainer = document.createElement('img');
      imageContainer.src = image;
      container.appendChild(imageContainer);
    }

    if (!submitButton && container === sourceImageContainer) {
      submitButton = document.createElement('button');
      submitButton.onclick = onSubmit;
      submitButton.innerText = 'Submit';
      submitButton.id = 'submit-button';
      submitButton.classList.add('btn');
      root.appendChild(submitButton);
    }
  }

  function handleFile(container, file) {
    updateImage(container, URL.createObjectURL(file));
  }


  fileInput.onchange = function(event) {
    if (event.target.files && event.target.files[0]) {
      fileSelected = event.target.files[0];
      handleFile(sourceImageContainer, fileSelected);
    }
  };
})();