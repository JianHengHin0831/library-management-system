var swiper = new Swiper(".slide-content", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints:{
        0: {
            slidesPerView: 1,
        },
        200: {
            slidesPerView: 2,
        },
        400: {
            slidesPerView: 3,
        },
        600: {
            slidesPerView: 4,
        },
        800: {
            slidesPerView: 5,
        },
        1000: {
            slidesPerView: 6,
        },
    },
    
    on: {
        init: function () {
            formatBookTitle();
        },
        resize: function () {
            formatBookTitle();
        },
    }
});

function formatBookTitle() {
    const bookTitles = document.querySelectorAll('.card-content .book-name');
    
    bookTitles.forEach(title => {
        let lineHeight = parseInt(window.getComputedStyle(title).lineHeight);
        let maxHeight = 2 * lineHeight;  // 2 lines
        
        if (title.offsetHeight > maxHeight) {
            title.classList.add('ellipsis');  // Add ellipsis if the text exceeds 2 lines
        } else {
            title.classList.remove('ellipsis');  // Remove ellipsis if the text fits within 2 lines
        }
    });
}
