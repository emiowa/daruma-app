export const validateEmail = (value = "") => {
  const v = value.trim();
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (v.length === 0) return "ingrese su correo.";
  if (!regex.test(v)) return "ingrese el correo correcto.";

  return "";
};

export const validatePassword = (value = "") => {
  if (value.length === 0) return "ingrese su contrasena.";
  if (value.length < 6) return "ingrese una contrasena de 6-20 caracteres.";
  return "";
};

export const validateName = (value = "") => {
  const v = value.trim();
  const regex = /^[ぁ-んァ-ン一-龥A-Za-z0-9]+$/;

  if (v.length === 0) return "ingrese un nombre.";
  if (v.length > 21) return "ingrese un nombre de 1-20caracteres";
  if (!regex.test(v)) return "solo letras y números permitidos.";

  return "";
};