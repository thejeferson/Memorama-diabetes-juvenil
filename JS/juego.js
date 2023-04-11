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
        this.descripcion = descripcion;
    }

    Carta.prototype.constructor = Carta;

    let todasLasCartas = [
        new Carta("Cerezas", "img/cerezas.jpg", "10-15 unidades tiene 15gr de carbohidratos"),
        new Carta("Furtillas", "img/frutillas.jpg", "12 unidades tiene 15gr de carbohidratos"),
        new Carta("Kiwi", "img/kiwi.jpg", "1 unidad tiene 10gr de carbohidratos"),
        new Carta("Manzanas", "img/manzana.jpg", "1 unidad tiene 15gr de carbohidratos"),
        new Carta("Naranjas", "img/naranja.jpg", "1 unidad tiene 15gr de carbohidratos"),
        new Carta("Piña", "img/piña.jpg", "1/2 taza picada tiene 15gr de carbohidratos"),
        new Carta("Bananas", "img/platano.jpg", "1/2 unidad tiene 15gr de carbohidratos"),
        new Carta("Uvas", "img/uvas.jpg", "7-10 unidades tiene 15gr de carbohidratos"),
    ]

    // Duplica las cartas que se usarán el juego. 
    // A futuro: Agregar dificultad.
    function duplicarCartas(cartas) {

        for (j = 0; j < 2; j++) {
            for (i = 0; i < dificultad; i++) { // CAMBIE CARTAS.LENGTH x DIFICULTAD
                cartasEnJuego.push(cartas[i])
            }
        }
        return cartasEnJuego
    }

    // Mezcla el total de cartas que se usarán en juego
    // Shuffle function from http://stackoverflow.com/a/2450976
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

        for (i = 0; i < dificultad * 2; i++) {
            let $nuevaCarta
            $nuevaCarta = $("<div class='espacio_carta'> <div class='carta'> <div class='lado cerrado'> </div> <div class='lado abierto'><img src=" + cartas[i].imagen + "><p>" + cartas[i].nombre + "</p><p>" + cartas[i].descripcion + "</p> </div></div></div>")
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
                    title:'Buen trabajo!',
                    text: `terminaste en ${conteoJugadas} intentos`,
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

    $comenzar.click(function() {
        dificultad = parseInt($("#dificultad option:selected").val())
        if (dificultad !== 0) {
            mezclarCartas(duplicarCartas(todasLasCartas))
            colocarCartas(cartasEnJuego)
            $comenzar.hide()
            $dificultad.hide()
            $contador.show()
        } else {
            Swal.fire(
                'Para iniciar',
                '¡Selecciona primero una dificultad!',
                'warning'
              )
        }
    })

});


