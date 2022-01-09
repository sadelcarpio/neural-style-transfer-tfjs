

function showPreview(event) {
  if(event.target.files.length > 0) {
    var src = URL.createObjectURL(event.target.files[0]);
    if (event.srcElement.getAttribute('id') == "image-content-input") {
      var preview = document.getElementById("img-content-preview");
    }
    else { var preview = document.getElementById("img-style-preview"); }
    preview.src = src;
    preview.onload = function () {
      if (this.width > this.height) {
        preview.style.width = "95%";
        preview.style.height = "auto";
        preview.style.display = "block";
      }
      else {
        preview.style.height = "95%";
        preview.style.width = "auto";
        preview.style.display = "block";
      }
    }
  }
}

function displayStyle(img) {
  var src = img.src;
  var preview = document.getElementById("img-style-preview");
  preview.src = src;
  preview.onload = function () {
    if (this.width > this.height) {
      preview.style.width = "95%";
      preview.style.height = "auto";
      preview.style.display = "block";
    }
    else {
      preview.style.height = "95%";
      preview.style.width = "auto";
      preview.style.display = "block";
    }
  }

}

// Inferencia del modelo de NST (descargado de 
// https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2)

async function runNst() {
  if (document.getElementById('img-content-preview').src != '' && document.getElementById('img-style-preview').src != '') {
    const model = await tf.loadGraphModel('./tfjs_model/model.json'); 
    const content_img = document.querySelector('#img-content-preview');
    const style_img = document.querySelector('#img-style-preview');

    // Convertir imagen a tensor
    let content = tf.browser.fromPixels(content_img).expandDims(0).cast("float32");
    let style = tf.browser.fromPixels(style_img).expandDims(0).cast("float32");

    // Normalizar tensores (muy importante)
    content = content.div(255) ;
    style = tf.image.resizeBilinear(style, [256, 256]).div(255) ;

    // Correr inferencia
    const result = await model.execute({'placeholder_1' : style, 'placeholder': content});

    // Eliminar tensores para ahorrar memoria
    content.dispose();
    style.dispose();

    tf.browser.toPixels(result.squeeze(), document.getElementsByTagName("canvas")[0]);

    result.dispose();
  }

  else if (document.getElementById('img-content-preview').src == '' && document.getElementById('img-style-preview').src != ''){
    alert('¡Se necesita una imagen de contenido!');
  }

  else if (document.getElementById('img-style-preview').src == '' && document.getElementById('img-content-preview').src != ''){
    alert('¡Se necesita una imagen de estilo!');
  }

  else {
    alert('¡No se han subido imágenes!')
  }

}