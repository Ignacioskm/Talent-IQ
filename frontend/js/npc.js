const npcImage = new Image();

npcImage.src =
"assets/characters/mujer.png";



const npcs = [

{
    x: 700,
    y: 300,

    width: 54,
    height: 74,

    speed: 0.3,

    directionX: 0,
    directionY: 0,

    timer: 0
},

{
    x: 900,
    y: 500,

    width: 54,
    height: 74,

    speed: 0.3,

    directionX: 0,
    directionY: 0,

    timer: 0
}

];

function moverNPCs() {

    npcs.forEach(npc => {

        npc.x += npc.directionX * npc.speed;

        npc.y += npc.directionY * npc.speed;



        if(npc.x <= 50) {

            npc.directionX = 1;
        }

        if(npc.x >= 1150) {

            npc.directionX = -1;
        }

        if(npc.y <= 50) {

            npc.directionY = 1;
        }

        if(npc.y >= 600) {

            npc.directionY = -1;
        }



        npc.timer++;



        if(npc.timer > 120) {

            npc.timer = 0;



            const random = Math.floor(
                Math.random() * 5
            );



            switch(random) {

                case 0:

                    npc.directionX = 1;
                    npc.directionY = 0;

                    break;



                case 1:

                    npc.directionX = -1;
                    npc.directionY = 0;

                    break;



                case 2:

                    npc.directionX = 0;
                    npc.directionY = 1;

                    break;



                case 3:

                    npc.directionX = 0;
                    npc.directionY = -1;

                    break;



                case 4:

                    npc.directionX = 0;
                    npc.directionY = 0;

                    break;
            }
        }
    });
}

function dibujarNPCs() {

    npcs.forEach(npc => {

        ctx.drawImage(
            npcImage,
            npc.x,
            npc.y,
            npc.width,
            npc.height
        );
    });
}