/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};

let TodasPersonas = null;
let pos = null;


// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}

/// Objeto para almacenar los datos de la persona que se está mostrando
Plantilla.personaMostrada = null

// Tags que voy a usar para sustituir los campos
Plantilla.plantillaTags = {
    "ID": "### ID ###",
    "NOMBRE": "### NOMBRE ###",
    "APELLIDO": "### APELLIDO ###",
    "FECHANACIMIENTO": {"DIA": "### DIA ###", "MES": "### MES ###", "ANIO": "### ANIO ###"},
    "NVECESPREMIADO": "### NVECESPREMIADO ###",
    "ANIOS PARTICIPACION": "### ANIOS PARTICIPACION ###",
}

/// Plantilla para poner los datos de varias personas dentro de una tabla
Plantilla.plantillaTablaPersonas = {}

// Cabecera de la tabla
Plantilla.plantillaTablaPersonas.cabecera = `
                <table class="listado-personas">
                    <thead>
                        <th width="20%" style="text-align: center">ID</th>
                        <th width="10%" style="text-align: center">Nombre</th>
                        <th width="20%" style="text-align: center">Apellido</th>
                        <th width="20%" style="text-align: center">Fecha de nacimiento</th>
                        <th width="20%" style="text-align: center">Nº veces premiado</th>
                        <th width="30%" style="text-align: center">Años participación</th>
                    </thead>
                    <center><div><a href="javascript:Plantilla.siguiente()" class="opcion-secundaria mostrar">Siguiente</a>
                    <a href="javascript:Plantilla.anterior()" class="opcion-secundaria mostrar">Anterior</a></div></center>
                    <tbody>
    `;

// Cabecera de la tabla de nombres
Plantilla.plantillaTablaPersonas.cabeceraNombres = `<table width="100%" class="listado-personas">

<tbody>
<center><div><a href="javascript:Plantilla.listarNombres()"</center>
`;

// Elemento TR que muestra los datos de una persona
Plantilla.plantillaTablaPersonas.cuerpo = `
    <tr title="${Plantilla.plantillaTags.ID}">
        <td style="text-align: center">${Plantilla.plantillaTags.ID}</td>
        <td style="text-align: center">${Plantilla.plantillaTags.NOMBRE}</td>
        <td style="text-align: center">${Plantilla.plantillaTags.APELLIDO}</td>
        <td style="text-align: center">${Plantilla.plantillaTags.FECHANACIMIENTO.DIA}/${Plantilla.plantillaTags.FECHANACIMIENTO.MES}/${Plantilla.plantillaTags.FECHANACIMIENTO.ANIO}</td>
        <td style="text-align: center">${Plantilla.plantillaTags.NVECESPREMIADO}</td>
        <td style="text-align: center">${Plantilla.plantillaTags["ANIOS PARTICIPACION"]}</td>
        <td>
            <div><a href="javascript:Plantilla.mostrar('${Plantilla.plantillaTags.ID}')" class="opcion-secundaria mostrar">Mostrar</a></div>
        </td>
    </tr>
    `;

// Elemento TR que muestra los datos de una persona
Plantilla.plantillaTablaPersonas.cuerpoNombres = `
    <tr title="${Plantilla.plantillaTags.NOMBRE}">
        <td>${Plantilla.plantillaTags.NOMBRE}</td>
    </tr>
    `;

// Pie de la tabla
Plantilla.plantillaTablaPersonas.pie = `        </tbody>
             </table>
             `;


/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}


/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}

/**
 * Actualiza el cuerpo de la plantilla deseada con los datos de la persona que se le pasa
 * @param {String} Plantilla Cadena conteniendo HTML en la que se desea cambiar lso campos de la plantilla por datos
 * @param {Persona} Persona Objeto con los datos de la persona que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */           
Plantilla.sustituyeTags = function (plantilla, persona) {
    //console.log(persona)
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTags.ID, 'g'), persona.ref['@ref'].id)
        .replace(new RegExp(Plantilla.plantillaTags.NOMBRE, 'g'), persona.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.APELLIDO, 'g'), persona.data.apellido)
        .replace(new RegExp(Plantilla.plantillaTags.FECHANACIMIENTO.DIA, 'g'), persona.data.fechaNacimiento.dia)
        .replace(new RegExp(Plantilla.plantillaTags.FECHANACIMIENTO.MES, 'g'), persona.data.fechaNacimiento.mes)
        .replace(new RegExp(Plantilla.plantillaTags.FECHANACIMIENTO.ANIO, 'g'), persona.data.fechaNacimiento.año)
        .replace(new RegExp(Plantilla.plantillaTags.NVECESPREMIADO, 'g'), persona.data.nVecesPremiado)
        .replace(new RegExp(Plantilla.plantillaTags["ANIOS PARTICIPACION"], 'g'), persona.data.añosParticipacion)
}



/**
 * Actualiza el cuerpo de la tabla con los nombres ordenados que se le pasa
 * @param {Persona} Persona Objeto con los nombres que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */
Plantilla.plantillaTablaPersonas.actualizaNombres = function (persona) {
    return Plantilla.sustituyeTags(this.cuerpoNombres, persona)
}

/**
 * Actualiza el cuerpo de la tabla con los datos de la persona que se le pasa
 * @param {Persona} Persona Objeto con los datos de la persona que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */
Plantilla.plantillaTablaPersonas.actualiza = function (persona) {
    return Plantilla.sustituyeTags(this.cuerpo, persona)
}


/**
 * Función que recuperar todas las personas llamando al MS Personas
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recupera = async function (callBackFn){
    let response = null

    //Intento conectar con el microservicio personas
    try{
        const url = Frontend.API_GATEWAY + "/plantilla/getTodas"
        response = await fetch(url)
    }catch(error){
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    //Muestro todas las personas que se han descargado
    let vectorPersonas = null
    if (response) {
        vectorPersonas = await response.json()
        TodasPersonas = vectorPersonas
        callBackFn(vectorPersonas.data)
    }
}


/**
 * Función que recuperar todas las personas llamando al MS Personas. 
 * Posteriormente, llama a la función callBackFn para trabajar con los datos recuperados.
 * @param {String} idPersona Identificador de la persona a mostrar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.recuperaUnaPersona = async function (idPersona, callBackFn) {
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/getPorId/" + idPersona
        const response = await fetch(url);
        if (response) {
            const persona = await response.json()
            callBackFn(persona)
        }
    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
    }
}

/**
 * Imprime los datos de una persona como una tabla usando la plantilla del formulario.
 * @param {persona} Persona Objeto con los datos de la persona
 * @returns Una cadena con la tabla que tiene ya los datos actualizados
 */
Plantilla.personaComoTabla = function (persona) {
    return Plantilla.plantillaTablaPersonas.cabecera
        + Plantilla.plantillaTablaPersonas.actualiza(persona)
        + Plantilla.plantillaTablaPersonas.pie;
}

Plantilla.imprimeNombres = function(vector) {
    let msj = Plantilla.plantillaTablaPersonas.cabeceraNombres
    
    vector.forEach(e => msj += Plantilla.plantillaTablaPersonas.actualizaNombres(e))
    msj += Plantilla.plantillaTablaPersonas.pie

    //Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Nombres de personas", msj)
}


Plantilla.imprimeNombresOrdenados = function(vector) {
    //console.log(vector) // Para comprobar lo que hay en vector
     
    vector.sort((a, b) => {
        if (a.data.nombre == b.data.nombre) {
          return 0;
        }
        if (a.data.nombre < b.data.nombre) {
          return -1;
        }
        return 1;
      });
      
    // Compongo el contenido que se va a mostrar dentro de la tabla
    let msj = Plantilla.plantillaTablaPersonas.cabeceraNombres
    
    vector.forEach(e => msj += Plantilla.plantillaTablaPersonas.actualizaNombres(e))
    msj += Plantilla.plantillaTablaPersonas.pie

    //Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Nombres de personas ordenadas alfabéticamente", msj)
}


Plantilla.imprimeMuchasPersonas = function (vector) {
    // console.log(vector) // Para comprobar lo que hay en vector

    // Compongo el contenido que se va a mostrar dentro de la tabla
    let msj = Plantilla.plantillaTablaPersonas.cabecera
    
    vector.forEach(e => msj += Plantilla.plantillaTablaPersonas.actualiza(e))
    msj += Plantilla.plantillaTablaPersonas.pie

    //Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Listado de personas", msj)
}


/**
 * Función para mostrar en pantalla los detalles de una persona que se ha recuperado de la BBDD por su id
 * @param {Persona} persona Datos de la persona a mostrar
 */

Plantilla.imprimeUnaPersona = function (persona) {
    // console.log(persona) // Para comprobar lo que hay en vector
    let msj = Plantilla.personaComoTabla(persona);

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Mostrar una persona", msj)

    // Actualiza el objeto que guarda los datos mostrados
    Plantilla.almacenaDatos(persona)
}

/**
 * Almacena los datos de la persona que se está mostrando
 * @param {Persona} persona Datos de la persona a almacenar
 */

Plantilla.almacenaDatos = function (persona) {
    Plantilla.personaMostrada = persona;
}

/**
 * Recupera los valores almacenados de la persona que se estaba mostrando
 * @return Datos de la persona a almacenada
 */

Plantilla.recuperaDatosAlmacenados = function () {
    return this.personaMostrada;
}



/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}



Plantilla.listarNombres = function (){
    Plantilla.recupera(Plantilla.imprimeNombres)
}

Plantilla.listarNombresOrdenados = function (){
    Plantilla.recupera(Plantilla.imprimeNombresOrdenados);
}

Plantilla.listar = function (){
    //console.log("La busqueda es:",document.getElementById("form-busqueda").value)
    Plantilla.recupera(Plantilla.imprimeMuchasPersonas);
}

/**
 * Función principal para mostrar los datos de una persona desde el MS y, posteriormente, imprimirla.
 * @param {String} idPersona Identificador de la persona a mostrar
 */
Plantilla.mostrar = function (idPersona) {
    this.recuperaUnaPersona(idPersona, this.imprimeUnaPersona);
}

/**
 * Función principal para visualizar el siguiente jugador.
 *
 */
Plantilla.siguiente = function () {
    
    pos = (pos + 1)
    if(pos == TodasPersonas.data.length)
        pos = 0
    
    let idPersona = TodasPersonas.data[pos].ref['@ref'].id;
    this.recuperaUnaPersona(idPersona, this.imprimeUnaPersona);
}

/**
 * Función principal para visualizar el anterior jugador.
 *
 */
Plantilla.anterior = function () {
    
    pos = (pos - 1)
    if(pos < 0)
        pos = TodasPersonas.data.length -1
    
    let idPersona = TodasPersonas.data[pos].ref['@ref'].id;
    this.recuperaUnaPersona(idPersona, this.imprimeUnaPersona);
}
