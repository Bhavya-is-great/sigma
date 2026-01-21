let hamburger = document.getElementById("hamburger");
let items = document.getElementById("items");

hamburger.addEventListener("click", (e) => {

    if (!(hamburger.classList.contains("open"))) {
        document.body.style.overflowY = "hidden";
    } else {
        document.body.style.overflowY = "auto";
    }

    hamburger.classList.toggle("open");
    items.classList.toggle("open");
});

let closeButtons = document.querySelectorAll('.close');

closeButtons.forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
        document.body.style.overflowY = "auto";
        hamburger.classList.toggle("open");
        items.classList.toggle("open")
    })
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
