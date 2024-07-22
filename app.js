document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.querySelector('.fixed-header .progress-bar');
    const progressText = document.querySelector('.fixed-header #progress-text');
    let totalCheckboxes = 0;
    let checkedCheckboxes = 0;

    function updateProgressBar() {
        const percentage = (checkedCheckboxes / totalCheckboxes) * 100;
        progressBar.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage) + '%';
    }

    function updateCheckboxState(checkbox, link, forceChecked = false) {
        const previousState = JSON.parse(localStorage.getItem(link.href) || 'false');
        const currentState = forceChecked ? true : checkbox.checked;

        checkbox.checked = currentState;
        localStorage.setItem(link.href, currentState);

        if (currentState && !previousState) {
            checkedCheckboxes++;
        } else if (!currentState && previousState) {
            checkedCheckboxes--;
        }

        if (currentState) {
            link.style.textDecoration = 'line-through';
            link.style.opacity = '0.6';
        } else {
            link.style.textDecoration = 'none';
            link.style.opacity = '1';
        }

        updateProgressBar();
    }

    function capitalizeFirstLetter(text) {
        return text.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function capitalizeFirstWord(str) {
        if (!str) return str; // Maneja cadenas vacías
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function loadContentFromJSON() {
        const url = 'https://rentry.co/boretbkb/raw';
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const dynamicContent = document.getElementById('dynamic-content');
                
                data.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'centrar';
                    
                    const categoryTitle = document.createElement('h4');
                    categoryTitle.textContent = capitalizeFirstWord(category.categoria) + ':';
                    categoryDiv.appendChild(categoryTitle);
                    
                    category.enlaces.forEach(link => {
                        const linkDiv = document.createElement('div');
                        linkDiv.className = 'espacioDiv';
                        
                        linkDiv.innerHTML = `
                            <label>
                                <input type="checkbox" id="checkbox" data-unique-id="">
                                <span class="espacioAhref logos--youtube-icon"></span>
                                <a href="${link.url}" target="_blank">
                                    ${capitalizeFirstWord(link.titulo)}
                                </a>
                            </label>
                        `;
                        
                        categoryDiv.appendChild(linkDiv);
                    });
                    
                    dynamicContent.appendChild(categoryDiv);
                });
                
                initializeCheckboxes();
            })
            .catch(error => console.error('Error:', error));
    }

    function initializeCheckboxes() {
        const checkboxDivs = document.querySelectorAll('.espacioDiv');
        totalCheckboxes = checkboxDivs.length;
        checkedCheckboxes = 0;

        checkboxDivs.forEach((div) => {
            const checkbox = div.querySelector('input[type="checkbox"]');
            const link = div.querySelector('a');

            if (checkbox && link) {
                const uniqueId = link.href;
                const savedState = localStorage.getItem(uniqueId);

                if (savedState !== null) {
                    checkbox.checked = JSON.parse(savedState);
                    if (checkbox.checked) {
                        checkedCheckboxes++;
                        link.style.textDecoration = 'line-through';
                        link.style.opacity = '0.6';
                    }
                }

                checkbox.addEventListener('change', function () {
                    updateCheckboxState(checkbox, link);
                });

                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    if (!checkbox.checked) {
                        updateCheckboxState(checkbox, link, true);
                    }
                    
                    setTimeout(() => {
                        window.open(link.href, '_blank');
                    }, 100);
                });
            }
        });

        updateProgressBar();
    }

    loadContentFromJSON();

    // Capitalize the first letter of the first word in .pBy elements
    const pByYo = document.querySelector('.pbyYo');
    if (pByYo) {
        pByYo.textContent = capitalizeFirstLetter(pByYo.textContent);
    }
});
