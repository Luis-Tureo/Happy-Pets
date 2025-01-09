
$(document).ready(function() {
    var canvas = document.getElementById('firmaCanvas');
    var context = canvas.getContext('2d');
    var painting = false;

    $('#limpiarFirma').on('click', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        $('#firmaData').val('');
    });

    $('#firmaCanvas').on('mousedown', function(e) {
        painting = true;
        draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#firmaCanvas').on('mousemove', function(e) {
        if (painting) {
            draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#firmaCanvas').on('mouseup', function() {
        painting = false;
    });

    $('#firmaCanvas').on('mouseleave', function() {
        painting = false;
    });

    function draw(x, y, isDragging) {
        if (isDragging) {
            context.beginPath();
            context.strokeStyle = '#000'; // Color de la firma
            context.lineWidth = 2;
            context.lineJoin = 'round';
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        }
        lastX = x;
        lastY = y;

        // Actualizar los datos de la firma en el textarea
        var firmaData = $('#firmaData').val();
        firmaData += '(' + x + ',' + y + '), ';
        $('#firmaData').val(firmaData);
    }
});
