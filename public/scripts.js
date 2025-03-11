function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const searchForm = document.getElementById('search-form');
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('shifted');
    searchForm.classList.toggle('shifted');
}