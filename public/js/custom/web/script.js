let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let header = document.querySelector('.header-3');
let scrollTop = document.querySelector('.scroll-top');

menu.addEventListener('click', () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

window.onscroll = () =>{

    menu.classList.remove('fa-times');
    navbar.classList.remove('active');

    if(window.scrollY > 250){
        header.classList.add('active');
    }else{
        header.classList.remove('active');
    }

    if(window.scrollY > 250){
        scrollTop.style.display = 'initial';
    }else{
        scrollTop.style.display = 'none';
    }

}

var swiper = new Swiper(".home-slider", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    loop:true,
});
function startCountdown() {
    const secondsElement = document.getElementById("seconds");
    const minutesElement = document.getElementById("minutes");
    const hoursElement = document.getElementById("hours");
    const daysElement = document.getElementById("days");

    let seconds = parseInt(secondsElement.textContent);
    let minutes = parseInt(minutesElement.textContent);
    let hours = parseInt(hoursElement.textContent);
    let days = parseInt(daysElement.textContent);

    function countdown() {
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        seconds = 59;
        minutes--;
      } else if (hours > 0) {
        seconds = 59;
        minutes = 59;
        hours--;
      } else if (days > 0) {
        seconds = 59;
        minutes = 59;
        hours = 23;
        days--;
      }

      secondsElement.textContent = seconds;
      minutesElement.textContent = minutes;
      hoursElement.textContent = hours;
      daysElement.textContent = days;

      if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
        setTimeout(countdown, 1000);
      }
    }

    countdown();
  }

  window.onload = startCountdown;