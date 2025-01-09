$(document).ready(function(){
    $('#file-input').change(function(){
        var file = $('#file-input')[0].files[0];
        var fileType = file.type;
        var validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        
        if ($.inArray(fileType, validExtensions) < 0) {
            alert('Formato de archivo no válido. Por favor, seleccione una imagen (JPEG, PNG, GIF) o un archivo PDF.');
            $('#file-input').val('');
            return false;
        }
        
        var formData = new FormData();
        formData.append('file', file);
        
        $.ajax({
            url: 'upload.php', // Ruta del archivo PHP para manejar la carga
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response){
                alert('Archivo subido exitosamente.');
                $('#file-input').val('');
            },
            error: function(xhr, status, error){
                alert('Error al subir el archivo: ' + error);
            }
        });
    });
});
