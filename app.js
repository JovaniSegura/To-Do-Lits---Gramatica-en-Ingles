document.addEventListener('DOMContentLoaded', function () {
    const checkboxDivs = document.querySelectorAll('.espacioDiv');
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

    checkboxDivs.forEach((div) => {
        const checkbox = div.querySelector('input[type="checkbox"]');
        const link = div.querySelector('a');

        if (checkbox && link) {
            totalCheckboxes++;
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

    document.querySelectorAll('a').forEach(function (a) {
        a.textContent = a.textContent.toLowerCase().replace(/^\w/, c => c.toUpperCase());
    });

    const pBy = document.querySelectorAll('.pBy');
    pBy.forEach(function (element) {
        element.textContent = element.textContent.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    });
});