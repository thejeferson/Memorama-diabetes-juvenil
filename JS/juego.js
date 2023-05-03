$( document ).ready(function() {
    console.log( "ready!" );

    let $tablero = $("#tablero");
    let $cartas = $("#cartas");
    let cartasEnJuego = [];
    let turno = 0;
    let paresDescubiertos = 0;
    let $primeraCartaAbierta = " "
    let $segundaCartaAbierta = " "
    let dificultad = 0; // La dificultad determina la cantidad de PARES de cartas.
    let $contador = $("#contador")
    let conteoJugadas = 0;

    let Carta = function(nombre, imagen, descripcion) {
        this.nombre = nombre;
        this.imagen = imagen;
    }

    Carta.prototype.constructor = Carta;

    let todasLasCartas = [
        new Carta("Cerezas", "img/cerezas.jpg"),
        new Carta("durazno", "img/durazno.jpg"),
        new Carta("Furtillas", "img/frutillas.jpg"),
        new Carta("Kiwi", "img/kiwi.jpg"),
        new Carta("Manzanas", "img/manzana.jpg"),
        new Carta("Naranjas", "img/naranja.jpg"),
        new Carta("Piña", "img/piña.jpg"),
        new Carta("Bananas", "img/platano.jpg"),
        new Carta("Sandia", "img/sandia.jpg"),
        new Carta("Uvas", "img/uvas.jpg"),
        new Carta("Coco", "img/coco.jpg"),
        new Carta("aguacate", "img/aguacate.jpg"),
        new Carta("ajo", "img/ajo.jpg"),
        new Carta("almendra", "img/almendra.jpg"),
        new Carta("brocoli", "img/brocoli.jpg"),
        new Carta("cebolla", "img/cebolla.jpg"),
        new Carta("lechuga", "img/lechuga.jpg"),
        new Carta("mani", "img/mani.jpg"),
        new Carta("nuez", "img/nuez.jpg"),
        new Carta("pasa", "img/pasa.jpg"),
        new Carta("tomate", "img/tomate.jpg"),



    ]

    let listNumberQuestions = []

    

    function verifyRandomNumber(arrayNum, num, total){
        if(arrayNum.length === total){
            return arrayNum
        }
        if(arrayNum.includes(num)){
            return verifyRandomNumber(listNumberQuestions, Math.floor(Math.floor(Math.random() * todasLasCartas.length - 1) + 1), dificultad)
        }
        listNumberQuestions.push(num);
        return verifyRandomNumber(listNumberQuestions, Math.floor(Math.floor(Math.random() * todasLasCartas.length - 1) + 1), dificultad)

    }

    
    // Duplica las cartas que se usarán el juego. 

    //dificultad=4
    //cartasAleatorias = [1, 3, 6, 10]
    function duplicarCartas(cartas) {
let nuevasCartas = [];
let cartasAleatorias = verifyRandomNumber(listNumberQuestions, Math.floor(Math.floor(Math.random() * todasLasCartas.length - 1) + 1), dificultad);
cartasAleatorias.forEach(item => { 
    nuevasCartas.push(cartas[item])
})
        for (j = 0; j < 2; j++) {
            for (i = 0; i < dificultad; i++) { // CAMBIE CARTAS.LENGTH x DIFICULTAD
                cartasEnJuego.push(nuevasCartas[i])
            }
        }
        return cartasEnJuego
    }

    // Mezcla el total de cartas que se usarán en juego
    function mezclarCartas(arrayCartas) {
        for (i = 0; i < arrayCartas.length; i++) {
            nuevaPosicion = Math.floor(Math.random() * (i + 1));
            valorActual = arrayCartas[i];
            arrayCartas[i] = arrayCartas[nuevaPosicion];
            arrayCartas[nuevaPosicion] = valorActual;
        }
        return arrayCartas
    }

    function colocarCartas(cartas) {

        for (i = 0; i < dificultad *2; i++) {
            let $nuevaCarta
            $nuevaCarta = $("<div class='espacio_carta'> <div class='carta'> <div class='lado cerrado'> </div> <div class='lado abierto'><img src=" + cartas[i].imagen + "> ")
            $tablero.append($nuevaCarta);
        }


        $cartas = $(".carta")

        $cartas.click(function() {
            if ($(this).hasClass("carta girada") === false) {
                //La carta está cerrada y se abre. 
                abrirCarta(this)
            } else {
                // La carta está abierta.
            }
        })
    }



    function abrirCarta(carta) {

        if (turno === 1) {
            $segundaCartaAbierta = $(carta);
            $(carta).addClass("girada")
            turno++
            conteoJugadas++
            $contador = $contador.text('Intentos: ' + conteoJugadas);
            compararCartas($primeraCartaAbierta, $segundaCartaAbierta)
        } else if (turno === 0) {
            $primeraCartaAbierta = $(carta);
            $(carta).addClass("girada")
            turno++
        }
        console.log(turno)

    }

    function compararCartas(carta1, carta2) {
        if (turno === 2) {
            if ($(carta1).find("img").attr("src") === $(carta2).find("img").attr("src")) {
                console.log("IGUALES")
                $(carta1).find(".abierto").css('background-color', '#97ff9d')
                $(carta2).find(".abierto").css('background-color', '#97ff9d')
                carta1 = " ";
                carta2 = " ";
                turno = 0;
                paresDescubiertos++
                revisarQueGano()
            } else {
                console.log("ERROR")
                setTimeout(
                    function() {
                        $(carta1).removeClass("girada")
                        $(carta2).removeClass("girada")
                        carta1 = " ";
                        carta2 = " ";
                        turno = 0;
                    }, 2000)


            }
        }
    }


    function revisarQueGano() {
        if (paresDescubiertos === dificultad) {
            setTimeout(
               
                Swal.fire({ 
                    title:'Buen trabajo',
                    text: `terminaste en ${conteoJugadas} intentos!`,
                    icon:'success',
                    allowOutsideClick: false,
                    footer: 'Mejora los intentos o prueba en otra dificultad.. 😎'
                })
                    .then((result) =>{
                        if (result.isConfirmed) {
                            location.reload();
                            
                        }
                    })
                     
             )
        }
    }

    // Selección de Dificultad e Inicio del Juego.

    $dificultad = $("#dificultad")
    $comenzar = $("#comenzar")
    $reiniciar = $("#reiniciar")
    $comenzar.click(function() {
        dificultad = parseInt($("#dificultad option:selected").val())
        if (dificultad !== 0) {
            mezclarCartas(duplicarCartas(todasLasCartas))
            colocarCartas(cartasEnJuego)
            $comenzar.hide()
            $dificultad.hide()
            $contador.show()
            $reiniciar.show()
            
        } else {
            Swal.fire(
                'Para iniciar',
                '¡Selecciona primero una dificultad!',
                'warning'
              )
        }
    })



    var resetButton = document.getElementById("reiniciar");

    resetButton.addEventListener("click", function() {
        location.reload();
      });

});


