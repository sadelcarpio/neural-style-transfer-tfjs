// let net;
// const webcamElement = document.getElementById('webcam');

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

async function runNst() {
  const model = await tf.loadGraphModel('./tfjs_model/model.json'); 
  const content_img = document.querySelector('#img-content-preview');
  const style_img = document.querySelector('#img-style-preview');

  let content = tf.browser.fromPixels(content_img).expandDims(0).cast("float32");
  let style = tf.browser.fromPixels(style_img).expandDims(0).cast("float32");


  content = tf.image.resizeBilinear(content, [224, 224]).div(255) ;
  style = tf.image.resizeBilinear(style, [224, 224]).div(255) ;

  const result = await model.execute({'placeholder_1' : style, 'placeholder': content});

  content.dispose();
  style.dispose();

  tf.browser.toPixels(result.squeeze(), document.getElementsByTagName("canvas")[0]);

  result.dispose();

}


// async function app() {
//     console.log('Cargando mobilenet ...');

//     // Cargar modelo:
//     net = await mobilenet.load();
//     console.log('¡Modelo cargado exitosamente!');

//     // Realizar predicción de la cámara web
//     const webcam = await tf.data.webcam(webcamElement);
//     while (true) {
//         const img = await webcam.capture();
//         const result = await net.classify(img);
    
//         document.getElementById('console').innerText = `
//           prediction: ${result[0].className}\n
//           probability: ${result[0].probability}
//         `;
//         // Dispose the tensor to release the memory.
//         img.dispose();
    
//         // Give some breathing room by waiting for the next animation frame to
//         // fire.
//         await tf.nextFrame();
//       }
//     }

// app();