import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

    // Tu configuración de Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAnreAW5GdYdtwG9y3D42v0LvE4nnFem50", 
      authDomain: "frontjson.firebaseapp.com",
      databaseURL: "https://frontjson-default-rtdb.firebaseio.com",
      projectId: "frontjson",
      storageBucket: "frontjson.firebasestorage.app",
      messagingSenderId: "668768938119",
      appId: "1:668768938119:web:3db8db64d651997cefb022",
      measurementId: "G-P8NXT2P97G"
    };

    // Inicializa Firebase
    const app = initializeApp(firebaseConfig);

    // Inicializa Cloud Firestore
    const db = getFirestore(app);

    // Agregar curso
    async function agregarCurso(curso) {
      try {
        const docRef = await addDoc(collection(db, "cursos"), curso);
        console.log("Documento escrito con ID: ", docRef.id);
      } catch (e) {
        console.error("Error al agregar documento: ", e);
      }
    }

    const nuevoCurso = {
      nombre: "Marketing Digital Avanzado",
      descripcion: "Estrategias de marketing en redes sociales.",
      duracionSemanas: 10,
      precio: 150000,
      fechaInicio: "2024-01-08T10:00:00.000Z",
      docenteId: "docenteId3"
    };

    agregarCurso(nuevoCurso);

    // Obtener cursos
    async function obtenerCursos() {
      try {
        const querySnapshot = await getDocs(collection(db, "cursos"));
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
      } catch (e) {
        console.error("Error al obtener cursos: ", e);
      }
    }

    obtenerCursos();

    // Obtener curso por ID
    async function obtenerCurso(cursoId) {
      try {
        const docRef = doc(db, "cursos", cursoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Datos curso:", docSnap.data());
        } else {
          console.log("No existe!");
        }
      } catch (e) {
        console.error("Error al obtener curso: ", e);
      }
    }

    obtenerCurso("cursoId1");

    // Modificar curso
    async function actualizarCurso(cursoId, datosActualizados) {
      try {
        const cursoRef = doc(db, "cursos", cursoId);
        await updateDoc(cursoRef, datosActualizados);
        console.log("Curso actualizado");
      } catch (e) {
        console.error("Error al actualizar curso: ", e);
      }
    }

    const datosActualizados = {
      precio: 140000,
    };

    actualizarCurso("cursoId1", datosActualizados);

    // Borrar curso
    async function eliminarCurso(cursoId) {
      try {
        await deleteDoc(doc(db, "cursos", cursoId));
        console.log("Curso eliminado");
      } catch (e) {
        console.error("Error al eliminar curso: ", e);
      }
    }

    eliminarCurso("cursoId1");


    //filtro de busquedas

    async function filtrarPorNombre() {
      const nombreBusqueda = document.getElementById("nombreBusqueda").value.toLowerCase();
      const cursosRef = collection(db, "cursos");
      const querySnapshot = await getDocs(cursosRef);
      const resultados = [];

      querySnapshot.forEach((doc) => {
        const curso = doc.data();
        if (curso.nombre.toLowerCase().includes(nombreBusqueda)) {
          resultados.push({ id: doc.id, ...curso });
        }
      });

      mostrarResultados(resultados);
    }

     async function filtrarPorDuracion() {
      const duracionMinima = parseInt(document.getElementById("duracionMinima").value);
      const cursosRef = collection(db, "cursos");
      const q = query(cursosRef, where("duracionSemanas", ">=", duracionMinima));
      const querySnapshot = await getDocs(q);
      const resultados = [];

      querySnapshot.forEach((doc) => {
        resultados.push({ id: doc.id, ...doc.data() });
      });

      mostrarResultados(resultados);
    }

     async function filtrarPorPrecio() {
      const precioMaximo = parseInt(document.getElementById("precioMaximo").value);
      const cursosRef = collection(db, "cursos");
      const q = query(cursosRef, where("precio", "<=", precioMaximo));
      const querySnapshot = await getDocs(q);
      const resultados = [];

      querySnapshot.forEach((doc) => {
        resultados.push({ id: doc.id, ...doc.data() });
      });

      mostrarResultados(resultados);
    }

     function mostrarResultados(cursos) {
      const listaCursos = document.getElementById("listaCursos");
      listaCursos.innerHTML = "";

      cursos.forEach((curso) => {
        const li = document.createElement("li");
        li.textContent = `${curso.nombre} - Duración: ${curso.duracionSemanas} semanas - Precio: ${curso.precio}`;
        listaCursos.appendChild(li);
      });
    }