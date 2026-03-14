

export default function RegisterSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">
        Gracias por registrarse
      </h1>

      <p className="mb-6">
        Hemos mandado el correo de confirmacion.
      </p>

      <a
        href="/login"
        className="text-blue-500 underline"
      >
        Iniciarsession
      </a>
    </div>
  );
}