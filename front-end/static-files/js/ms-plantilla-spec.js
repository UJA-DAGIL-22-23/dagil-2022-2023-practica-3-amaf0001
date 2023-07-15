/**
 * @file ms-plantilla-spec.js
 * @description Fichero TDD para probar todo lo relacionado con MS Plantilla en el front-end
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

// SPECS para Jasmine

// Constantes para usar en las pruebas
const elementoTitulo = document.getElementById(Frontend.ID_SECCION_PRINCIPAL_TITULO)
const elementoContenido = document.getElementById(Frontend.ID_SECCION_PRINCIPAL_CONTENIDO)
const TITULO_HOME = "Plantilla Home"
const TITULO_ACERCA_DE = "Plantilla Acerca de"

const datosDescargadosPrueba = {
    mensaje: "Mensaje de prueba descargado",
    autor: "Prueba de autor",
    email: "Prueba de email",
    fecha: "00/00/0000"
}


// Función para esperar y dar tiempo a que responda el microservicio
function esperar(ms) {
    var inicio = new Date().getTime();
    var fin = 0;
    while ((fin - inicio) < ms) {
        fin = new Date().getTime();
    }
}



// SPECS a probar

describe("Plantilla.mostrarHome: ", function () {

    it("muestra datos nulos cuando le pasamos un valor nulo",
        function () {
            Plantilla.mostrarHome()
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra datos nulos cuando le pasamos un valor que no es un objeto",
        function () {
            Plantilla.mostrarHome(23)
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra datos nulos cuando le pasamos un objeto que no tiene campo mensaje",
        function () {
            // Objeto vacío
            Plantilla.mostrarHome({})
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)

            // Objeto sin campo mensaje
            Plantilla.mostrarHome({ foo: "bar" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra correctamente el título y el mensaje",
        function () {
            Plantilla.mostrarHome(datosDescargadosPrueba)
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(datosDescargadosPrueba.mensaje)
        })
})


describe("Plantilla.mostrarAcercaDe: ", function () {
    it("muestra datos nulos cuando le pasamos un valor nulo",
        function () {
            Plantilla.mostrarAcercaDe()
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })

    it("muestra datos nulos cuando le pasamos un valor que no es un objeto",
        function () {
            Plantilla.mostrarAcercaDe(23)
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })

    it("muestra datos nulos cuando le pasamos un objeto que no tiene campo mensaje o autor o email o fecha ",
        function () {
            // Objeto vacío
            Plantilla.mostrarAcercaDe({})
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()

            // Objeto sin campo mensaje
            Plantilla.mostrarAcercaDe({ autor: "un autor", email: "un email", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo autor
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", email: "un email", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo email
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", autor: "un autor", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo fecha
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", autor: "un autor", email: "un email" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })
    it("muestra correctamente el título y el mensaje conteniendo el autor, el email y la fecha",
        function () {
            Plantilla.mostrarAcercaDe(datosDescargadosPrueba)
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)

            // Comprobamos que al buscar el autor, el email y la fecha de prueba los encuentra dentro del contenido del article
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.autor) >= 0).toBeTrue()
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.email) >= 0).toBeTrue()
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.fecha) >= 0).toBeTrue()
        })
})


let cuerpoSpec = `
<tr title="${Plantilla.plantillaTags.ID}">
    <td>${Plantilla.plantillaTags.ID}</td>
    <td>${Plantilla.plantillaTags.NOMBRE}</td>
    <td>${Plantilla.plantillaTags.APELLIDO}</td>
    <td>${Plantilla.plantillaTags.FECHANACIMIENTO.DIA}/${Plantilla.plantillaTags.FECHANACIMIENTO.MES}/${Plantilla.plantillaTags.FECHANACIMIENTO.ANIO}</td>
    <td>${Plantilla.plantillaTags.NVECESPREMIADO}</td>
    <td>${Plantilla.plantillaTags["ANIOS PARTICIPACION"]}</td>
    <td>
        <div><a href="javascript:Plantilla.mostrar('${Plantilla.plantillaTags.ID}')" class="opcion-secundaria mostrar">Mostrar</a></div>
    </td>
</tr>
`;

let personaSpec = {
    ref: {
        "@ref": {
            id: "359175247080980684"
        }
    },
    data: {
        nombre: "Juan",
        apellido: "Cano",
        fechaNacimiento: {
            dia: 14,
            mes: 8,
            año: 1998
        },
        nVecesPremiado: 2,
        añosParticipacion: [
            2010,
            2012,
            2016
        ]
    }
}

describe("Plantilla.sustituyeTags: ", function () {
    it("Sustituye correctamente en la plantilla la Persona que se le pasa",
    function () {
        let planti = Plantilla.sustituyeTags(cuerpoSpec, personaSpec)
        
        expect(planti.includes(personaSpec.data.nombre)).toBeTrue()
        expect(planti.includes(personaSpec.data.apellido)).toBeTrue()
        expect(planti.includes(personaSpec.data.fechaNacimiento.dia)).toBeTrue()
        expect(planti.includes(personaSpec.data.fechaNacimiento.mes)).toBeTrue()
        expect(planti.includes(personaSpec.data.fechaNacimiento.año)).toBeTrue()
        expect(planti.includes(personaSpec.data.nVecesPremiado)).toBeTrue()
        expect(planti.includes(personaSpec.data.añosParticipacion[0])).toBeTrue()
    })
})


describe("Plantilla.plantillaTablaPersonas.actualizaNombres: ", function () {
    it("Sustituye correctamente en la plantilla de nombres el nombre de la persona que se le pasa", 
    function () {
        let planti = Plantilla.plantillaTablaPersonas.actualizaNombres(personaSpec)
        expect(planti.includes(personaSpec.data.nombre)).toBeTrue()
    })
})


let vectorPersonasSpec = [
    {
        ref: {
            "@ref": {
                id: "359175247080980684"
            }
        },
        data: {
            nombre: "Juan",
            apellido: "Cano",
            fechaNacimiento: {
                dia: 14,
                mes: 8,
                año: 1998
            },
            nVecesPremiado: 2,
            añosParticipacion: [
                2010,
                2012,
                2016
            ]
        }
    },
    {
        ref: {
        "@ref": {
            id: "359175529521217741"
        }
    },
    data: {
        nombre: "Ruben",
        apellido: "Perez",
        fechaNacimiento: {
            dia: 11,
            mes: 12,
            año: 1990
        },
        nVecesPremiado: 5,
        añosParticipacion: [
            2005,
            2006,
            2008,
            2010,
            2011,
            2013,
            2020,
            2021
        ]
    }
    }
]

describe("Plantilla.imprimeNombres: ", function() {
    it("Comprueba si actualiza correctamente el articulo",
    function() {
        Plantilla.imprimeNombres(vectorPersonasSpec)
        expect(document.getElementById(Frontend.ID_SECCION_PRINCIPAL_TITULO).innerHTML.includes("Nombres de personas")).toBeTrue()
        for(let i = 0; i < vectorPersonasSpec.length; ++i){
            expect(document.getElementById(Frontend.ID_SECCION_PRINCIPAL_CONTENIDO).innerHTML.includes(vectorPersonasSpec[i].data.nombre)).toBeTrue()
        }
    })
})


describe("Plantilla.imprimeNombresOrdenados: ", function() {
    it("Comprueba si actualiza correctamente el articulo",
    function() {
        Plantilla.imprimeNombresOrdenados(vectorPersonasSpec)
        expect(document.getElementById(Frontend.ID_SECCION_PRINCIPAL_TITULO).innerHTML.includes("Nombres de personas ordenadas alfabéticamente")).toBeTrue()
        for(let i = 0; i < vectorPersonasSpec.length; ++i){
            expect(document.getElementById(Frontend.ID_SECCION_PRINCIPAL_CONTENIDO).innerHTML.includes(vectorPersonasSpec[i].data.nombre)).toBeTrue()
        }
    })
})


describe("Plantilla.plantillaTablaPersonas.actualiza: ", function () {
    it("Sustituye correctamente en la plantilla elegida la Persona que se le pasa",
    function () {
        let planti = Plantilla.plantillaTablaPersonas.actualiza(personaSpec)
        expect(planti.includes(personaSpec.data.nombre)).toBeTrue()
        expect(planti.includes(personaSpec.data.apellido)).toBeTrue()
        expect(planti.includes(personaSpec.data.fechaNacimiento.dia)).toBeTrue()
        expect(planti.includes(personaSpec.data.fechaNacimiento.mes)).toBeTrue()
        expect(planti.includes(personaSpec.data.fechaNacimiento.año)).toBeTrue()
        expect(planti.includes(personaSpec.data.nVecesPremiado)).toBeTrue()
        expect(planti.includes(personaSpec.data.añosParticipacion[0])).toBeTrue()
    })
})

describe("Plantilla.imprimeMuchasPersonas: ", function () {
    it("Comprueba si actualiza correctamente el articulo",
    function () {
        Plantilla.imprimeMuchasPersonas(vectorPersonasSpec)
        //console.log(document.getElementById( Frontend.ID_SECCION_PRINCIPAL_CONTENIDO).innerHTML)
        expect(document.getElementById(Frontend.ID_SECCION_PRINCIPAL_TITULO).innerHTML.includes("Listado de personas")).toBeTrue()
        expect(document.getElementById(Frontend.ID_SECCION_PRINCIPAL_CONTENIDO).innerHTML.includes(vectorPersonasSpec[0].ref['@ref'].id)).toBeTrue()
        expect(document.getElementById(Frontend.ID_SECCION_PRINCIPAL_CONTENIDO).innerHTML.includes(vectorPersonasSpec[1].ref['@ref'].id)).toBeTrue()
        for(let i = 0; i < vectorPersonasSpec.length; ++i){
            expect(document.getElementById(Frontend.ID_SECCION_PRINCIPAL_CONTENIDO).innerHTML.includes(vectorPersonasSpec[i].data.nombre)).toBeTrue()
        }
    })
})


/*
IMPORTANTE
==========

Las pruebas TDD que se encargan de probar las conexiones con el microservicio desde el cliente son difíciles de probar 
dado que requieren solucionar temas de sincronización. 
Esto afecta a los métodos:
 - Plantilla.descargarRuta
 - Plantilla.procesarAcercaDe
 - Plantilla.procesarHome

 Las soluciones propuestas en distintos sitios web no han producido el resultado esperado, 
 por tanto: para esta práctica, se pueden dejar SIN HACER.

 */
