document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".toggle");
    const sidebar = document.querySelector(".sidebar");
  
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("close");
    });
  });