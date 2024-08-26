const roleEnum = require("../utils/enums/RoleEnum.js");

class UsuarioDTO {
  constructor({ nome, sobrenome, email, telefone, role, senha, user_image }) {
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.email = email;
    this.telefone = telefone;
    this.role = role;
    this.senha = senha;
    this.user_image = user_image;
  }

  static validate(user) {
    const errors = [];

    if (
      typeof user.nome !== "string" ||
      user.nome.length < 1 ||
      user.nome.length > 100
    ) {
      errors.push("O nome deve ser uma string entre 1 e 100 caracteres.");
    }

    if (
      typeof user.sobrenome !== "string" ||
      user.sobrenome.length < 1 ||
      user.sobrenome.length > 100
    ) {
      errors.push("O sobrenome deve ser uma string entre 1 e 100 caracteres.");
    }

    if (!user.email.includes("@")) {
      errors.push("O email deve ser válido.");
    }

    if (typeof user.telefone !== "string") {
      errors.push("O telefone deve ser uma string.");
    }

    if (!Object.values(roleEnum).includes(user.role)) {
      errors.push("O role deve ser um valor válido.");
    }

    if (
      typeof user.senha !== "string" ||
      user.senha.length < 6 ||
      user.senha.length > 100
    ) {
      errors.push("A senha deve ser uma string entre 6 e 100 caracteres.");
    }

    if (user.user_image && typeof user.user_image !== "string") {
      errors.push("A imagem de usuário deve ser uma string.");
    }

    return errors;
  }
}

module.exports = UsuarioDTO;
