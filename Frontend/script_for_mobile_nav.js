
const menuBtn = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const mobileuploadBtn = document.getElementById('mobileuploadBtn');
    const mobileUpload = document.getElementById('mobileUpload');
    const searchBtn = document.getElementById('searchBtn');
    const mobileSearch = document.getElementById('mobileSearch');
    function closeAllMenus() {
    dropdownMenu.style.display = "none";
    mobileUpload.style.display = "none";
    mobileSearch.style.display = "none";
}
    menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    const isOpen = dropdownMenu.style.display === 'flex';

    closeAllMenus();

    if (!isOpen) {
        dropdownMenu.style.display = 'flex';
    }
});

mobileuploadBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    const isOpen = mobileUpload.style.display === 'flex';

    closeAllMenus();

    if (!isOpen) {
        mobileUpload.style.display = 'flex';
    }
});

searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    const isOpen = mobileSearch.style.display === 'block';

    closeAllMenus();

    if (!isOpen) {
        mobileSearch.style.display = 'block';
    }
});
document.addEventListener("click", () => {
    closeAllMenus();
});
mobileSearch.addEventListener("click", (e) => e.stopPropagation());

mobileUpload.addEventListener("click", (e) => e.stopPropagation());

dropdownMenu.addEventListener("click", (e) => e.stopPropagation());
