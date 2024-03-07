async function accessCamera(facingMode = "environment") {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
    });

    // Mostrar el flujo de video en un elemento HTML
    const videoElement = document.getElementById("video");
    videoElement.srcObject = stream;

    // Iniciar la reproducción del video
    videoElement.play();

    // Opcional: Capturar una foto
    const captureButton = document.getElementById("capture-button");
    captureButton.addEventListener("click", () => {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Guardar la imagen como archivo
      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageData;
      link.download = "imagen-camara.png";
      link.click();
    });
  } catch (error) {
    console.error("Error al acceder a la cámara:", error);

    // Mostrar un mensaje de error al usuario
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.textContent = error.message;
  }
}

accessCamera();