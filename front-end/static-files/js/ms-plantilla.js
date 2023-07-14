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
            <form method='post' action=''>
                <input type="text" value="" id="form-busqueda"/> 
                <div><a href="javascript:Plantilla.listarBusqueda()" class="opcion-secundaria mostrar">Buscar</a></div>
            </form>
                <table width="100%" class="listado-personas">
                    <thead>
                        <th width="10%">ID</th>
                        <th width="10%">Nombre</th>
                        <th width="20%">Apellido</th>
                        <th width="20%">Fecha de nacimiento</th>
                        <th width="20%">Nº veces premiado</th>
                        <th width="30%">Años participacion</th>
                        <th width="10%"></th>
                    </thead>
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



Plantilla.imprimeNombres = function(vector) {
    let msj = Plantilla.plantillaTablaPersonas.cabeceraNombres
    
    vector.forEach(e => msj += Plantilla.plantillaTablaPersonas.actualizaNombres(e))
    msj += Plantilla.plantillaTablaPersonas.pie

    //Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Nombres de personas", msj)
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

/**
 * Función principal para mostrar los datos de una persona desde el MS y, posteriormente, imprimirla.
 * @param {String} idPersona Identificador de la persona a mostrar
 */
Plantilla.mostrar = function (idPersona) {
    for (let i = 0; i < TodasPersonas.data.length; i++) {
        //console.log(TodasPersonas.data[i].ref['@ref'].id);
        if(TodasPersonas.data[i].ref['@ref'].id == idPersona){
            pos = i;
        }
    }
    this.recuperaUnaPersona(idPersona, this.imprimeUnaPersona);
}

