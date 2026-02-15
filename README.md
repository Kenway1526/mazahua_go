Mazahua Go!


Ola k aze

Stack tecnológico
Next.js            -> Framework de React para el frontend y optimización SEO.
TypeScript         -> Lenguaje principal para asegurar un código tipado y sin errores.
Supabase           -> "Backend-as-a-Service (PostgreSQL, Auth y Storage)."
Vercel             -> Hosting y despliegue continuo (CI/CD).
Tailwind CSS       -> Framework de estilos para un diseño responsivo y moderno.

==========================================================================================

Estructura Git

Para mantener la integridad del código, seguimos una estructura de ramas estricta:

- main: Código productivo y 100% funcional. Es la rama que se visualiza en el host oficial.
- testing: Rama de integración. Aquí unimos los cambios de todos para detectar bugs antes de pasar a producción.
- feature/[nombre]: Ramas individuales (ej. feature/jon o feature/dam). Aquí se realizan las pruebas y el desarrollo de nuevas funcionalidades.

- Clona el repositorio: git clone [url-del-repo].
- Crea tu rama desde testing: git checkout -b feature/tu-nombre.
- Al terminar tus cambios, solicita un Pull Request hacia testing.
- Una vez aprobado y probado en testing, el administrador realizará el merge a main.

Dinamica de commits

Los mensajes de commit deben referenciar el requisito que satisfacen (ej. git commit -m "feat: implementar reproductor de audio (RF-05)").

==========================================================================================

Instalacion

Asegúrate de tener Node.js instalado.

En la carpeta raíz (mazahua_go) ejecuta los siguientes comandos:

- npm install (dependencias)

Configura tu archivo .env.local con las llaves de Supabase (solicítalas al Admin de DB)

- npm run dev

Definicion de roles

Jon ->	Admin de Host/Despliegue, Admin de DB (PostgreSQL/Supabase), Lógica y Documentación.
Dam	->  Diseño de Interfaces (UI/UX), Lógica, Especialista en Lengua y Documentación.