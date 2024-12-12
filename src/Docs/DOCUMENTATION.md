# ArtXP - Documentación para Desarrolladores

## Introducción
ArtXP es una plataforma que permite la gestión y visualización de obras de arte, usuarios y categorías. Este documento está diseñado para ayudar a los nuevos desarrolladores a entender la estructura del proyecto, los componentes principales, el flujo de usuarios y las funciones clave.

## Estructura del Proyecto

### Carpetas Principales
- **components**: Contiene todos los componentes reutilizables de la aplicación.
- **pages**: Contiene las páginas principales de la aplicación.
- **reducers**: Contiene los archivos de reducers para manejar el estado global.
- **utils**: Contiene utilidades y funciones auxiliares como manejo de localStorage, datos JSON, etc.

### Archivos Clave
- **global.context.jsx**: Define el contexto global y el proveedor de contexto para la aplicación.
- **reducer.js**: Contiene la lógica de los reducers para manejar las acciones del estado global.
- **user.json, data.json, category.json**: Archivos JSON que contienen datos iniciales de usuarios, obras y categorías respectivamente.

## Identidades

### Usuarios
Cada usuario tiene los siguientes atributos:
- `id`: Identificador único.
- `nombre`: Nombre del usuario.
- `apellido`: Apellido del usuario.
- `email`: Correo electrónico del usuario.
- `contrasenia`: Contraseña del usuario.
- `rol`: Rol del usuario (ADMIN, USER, COLAB).

### Obras
Cada obra tiene los siguientes atributos:
- `id`: Identificador único.
- `nombre`: Nombre de la obra.
- `fechaCreacion`: Fecha de creación de la obra.
- `descripcion`: Descripción de la obra.
- `precioRenta`: Precio de renta de la obra.
- `img`: URL de la imagen principal de la obra.
- `imagenesAdicionales`: Array de URLs de imágenes adicionales.
- `disponibilidad`: Disponibilidad de la obra.
- `tamano`: Tamaño de la obra.
- `tecnicaObra`: Técnica utilizada en la obra.
- `movimientoArtistico`: Movimiento artístico al que pertenece la obra.
- `artista`: Artista que creó la obra.

### Categorías
Cada categoría tiene los siguientes atributos:
- `id`: Identificador único.
- `nombre`: Nombre de la categoría.
- `descripcion`: Descripción de la categoría.
- `url`: URL de la imagen representativa de la categoría.

## Componentes Principales

### ContextGlobal
Define el contexto global de la aplicación y proporciona el estado y el dispatch a todos los componentes hijos.

### Reducer
Maneja las acciones del estado global, incluyendo la obtención, adición, actualización y eliminación de usuarios, obras y categorías.

### Admin
Página principal del panel de administración. Permite la gestión de usuarios, obras y categorías.

### UserTable, ProductTable, CategoryTable
Componentes que muestran tablas de usuarios, obras y categorías respectivamente. Permiten la edición y eliminación de elementos.

### Form
Formulario reutilizable para la creación y edición de obras.

### Modal
Componente modal para confirmaciones de eliminación y otros mensajes importantes.

## Flujo de Usuarios

### Inicio de Sesión
1. El usuario ingresa sus credenciales.
2. Se verifica el usuario y se establece el estado `loggedUser` en el contexto global.

### Gestión de Obras
1. El administrador puede agregar, editar y eliminar obras desde el panel de administración.
2. Las obras se almacenan en el estado global y en localStorage.

### Gestión de Usuarios
1. El administrador puede ver, agregar, editar y eliminar usuarios desde el panel de administración.
2. Ningún usuario puede eliminar ni cambiar el rol del administrador, incluido él mismo.
3. Colab puede ver, agregar y editar usuarios. No puede eliminar ningún usuario, ni editar al admin.
4. Colab no se puede 
4. Los usuarios se almacenan en el estado global y en localStorage.

### Gestión de Categorías
1. El administrador puede agregar, editar y eliminar categorías desde el panel de administración.
2. Las categorías se almacenan en el estado global y en localStorage.

## Funciones Principales

### saveToLocalStorage
Guarda datos en localStorage.

### loadFromLocalStorage
Carga datos desde localStorage.

### idCreator
Genera un nuevo ID único basado en los elementos existentes.

### loginUser
Función para gestionar el inicio de sesión del usuario.

### logoutUser
Función para gestionar el cierre de sesión del usuario..
