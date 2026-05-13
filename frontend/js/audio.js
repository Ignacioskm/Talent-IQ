const musica = new Audio(
    "assets/music/office.mp3"
);

musica.loop = true;

musica.volume = 0.03;



document.addEventListener("click", () => {

    musica.play();

}, { once: true });