
const busqueda = document.getElementById("busqueda");
const btnBuscar = document.getElementById("btnBuscar");

const nombrePokemon = document.getElementById("nombrePokemon");
const imagenPokemon = document.getElementById("imagenPokemon");
const numero = document.getElementById("numero");
const tipo = document.getElementById("tipo");
const descripcion = document.getElementById("descripcion");

const imagenPre = document.getElementById("imagenPre");
const nombrePre = document.getElementById("nombrePre");

const imagenEvo = document.getElementById("imagenEvo");
const nombreEvo = document.getElementById("nombreEvo");

const mensaje = document.getElementById("mensaje");

btnBuscar.addEventListener("click", buscarPokemon);

busqueda.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        buscarPokemon();
    }

});

async function buscarPokemon() {

    const dato = busqueda.value.toLowerCase().trim();

    if (dato === "") {
        mensaje.textContent = "Escribe un nombre o número.";
        return;
    }

    mensaje.textContent = "Buscando Pokémon...";

    try {

        // Consultar Pokémon por nombre o número
        const respuesta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${dato}`
        );

        if (!respuesta.ok) {
            throw new Error("Pokémon no encontrado");
        }

        const pokemon = await respuesta.json();

        // Consultar especie
        const respuestaEspecie = await fetch(pokemon.species.url);

        const especie = await respuestaEspecie.json();

        // Consultar cadena evolutiva
        const respuestaCadena = await fetch(
            especie.evolution_chain.url
        );

        const cadena = await respuestaCadena.json();

        // Mostrar datos principales
        nombrePokemon.textContent = pokemon.name;

        numero.textContent = pokemon.id;

        imagenPokemon.src =
            pokemon.sprites.other["official-artwork"].front_default;

        tipo.textContent = pokemon.types
            .map(elemento => elemento.type.name)
            .join(", ");

        // Buscar descripción en español
        let texto = especie.flavor_text_entries.find(
            elemento => elemento.language.name === "es"
        );

        // Si no hay descripción en español, buscar inglés
        if (!texto) {

            texto = especie.flavor_text_entries.find(
                elemento => elemento.language.name === "en"
            );

        }

        descripcion.textContent = texto
            ? texto.flavor_text.replace(/[\n\f]/g, " ")
            : "Descripción no disponible.";

        // Obtener la línea evolutiva
        const lista = [];

        function recorrerCadena(pokemon) {

            lista.push(pokemon.species.name);

            pokemon.evolves_to.forEach(siguiente => {
                recorrerCadena(siguiente);
            });

        }

        recorrerCadena(cadena.chain);

        // Encontrar el Pokémon buscado
        const posicion = lista.indexOf(pokemon.name);

        // Mostrar pre-evolución
        if (posicion > 0) {

            const anterior = lista[posicion - 1];

            await mostrarPreEvolucion(anterior);

        } else {

            nombrePre.textContent = "No tiene";
            imagenPre.src = "";

        }

        // Mostrar evolución
        if (posicion < lista.length - 1) {

            const siguiente = lista[posicion + 1];

            await mostrarEvolucion(siguiente);

        } else {

            nombreEvo.textContent = "No tiene";
            imagenEvo.src = "";

        }

        mensaje.textContent = "";

    } catch (error) {

        mensaje.textContent = "No se encontró el Pokémon.";

        nombrePokemon.textContent = "Pokémon no encontrado";
        imagenPokemon.src = "";

        numero.textContent = "-";
        tipo.textContent = "-";
        descripcion.textContent = "-";

        nombrePre.textContent = "-";
        imagenPre.src = "";

        nombreEvo.textContent = "-";
        imagenEvo.src = "";

    }

}

// Consultar imagen de la pre-evolución
async function mostrarPreEvolucion(nombre) {

    const respuesta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nombre}`
    );

    const datos = await respuesta.json();

    nombrePre.textContent = datos.name;

    imagenPre.src =
        datos.sprites.other["official-artwork"].front_default;

}

// Consultar imagen de la evolución
async function mostrarEvolucion(nombre) {

    const respuesta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nombre}`
    );

    const datos = await respuesta.json();

    nombreEvo.textContent = datos.name;

    imagenEvo.src =
        datos.sprites.other["official-artwork"].front_default;

}
