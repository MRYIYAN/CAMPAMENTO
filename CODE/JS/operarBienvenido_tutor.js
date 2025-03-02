let currentIndex = 0;

function moveCarrusel(direction) {
    const carruselInner = document.querySelector('.carrusel-inner');
    const items = document.querySelectorAll('.carrusel-item');
    const totalItems = items.length;
    const visibleItems = 3; // Número de elementos visibles a la vez

    currentIndex += direction;

    // Asegurarse de que el índice esté dentro de los límites
    if (currentIndex < 0) {
        currentIndex = totalItems - visibleItems;
    } else if (currentIndex > totalItems - visibleItems) {
        currentIndex = 0;
    }

    const offset = -currentIndex * (100 / visibleItems);
    carruselInner.style.transform = `translateX(${offset}%)`;
}