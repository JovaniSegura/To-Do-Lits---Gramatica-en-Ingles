document.addEventListener('DOMContentLoaded', function () {
    const checkboxDivs = document.querySelectorAll('.espacioDiv');

    checkboxDivs.forEach((div) => {
        const checkbox = div.querySelector('input[type="checkbox"]');
        const link = div.querySelector('a');
        
        if (checkbox && link) {
            const uniqueId = link.href;

            // Verificar si hay un estado guardado en el localStorage
            const savedState = localStorage.getItem(uniqueId);

            if (savedState !== null) {
                checkbox.checked = JSON.parse(savedState);
            }

            checkbox.addEventListener('change', function () {
                localStorage.setItem(uniqueId, checkbox.checked);
                
                // Actualizar el estilo del enlace asociado
                if (checkbox.checked) {
                    link.style.textDecoration = 'line-through';
                    link.style.opacity = '0.6';
                } else {
                    link.style.textDecoration = 'none';
                    link.style.opacity = '1';
                }
            });

            // Aplicar el estilo inicial basado en el estado guardado
            if (checkbox.checked) {
                link.style.textDecoration = 'line-through';
                link.style.opacity = '0.6';
            }
        }
    });

    // Convertir todo el texto a minúsculas y Poner 1er letra en mayúscula
    document.querySelectorAll('a').forEach(function (a) {
        a.textContent = a.textContent.toLowerCase().replace(/^\w/, c => c.toUpperCase());
    });
});