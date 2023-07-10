// Object List Page
// This script handles the dialog for creating a new object
function showDialog() {
    document.body.classList.add('show-dialog');
}

function hideDialog() {
    document.body.classList.remove('show-dialog');
}

document.querySelector('.create').addEventListener('click', function (event) {
    event.preventDefault();
    showDialog();
});

document.querySelector('.cancel').addEventListener('click', function (event) {
    event.preventDefault();
    hideDialog();
});