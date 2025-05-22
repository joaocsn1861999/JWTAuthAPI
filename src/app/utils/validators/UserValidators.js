class UserValidators {
  
  isValidId(id) {
    return !isNaN(Number(id)) && Number(id) > 0 ?
        { isValid: true } :
        { isValid: false, errors: ['ID inválido'] };
  }

  isValidName(name) {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    const isValidLength = name.length > 1 && name.length <= 50;

    return nameRegex.test(name) && isValidLength ?
        { isValid: true } :
        { isValid: false, errors: ['Nome inválido'] };
  }

  isValidUserToCreate(user) {
    const errors = [];
    const nameValidation = this.isValidName(user.first_name);
    const lastNameValidation = this.isValidName(user.last_name);
    const emailValidation = this.isValidEmail(user.email);
    const passwordValidation = this.isValidPassword(user.password);
    
    if (!nameValidation.isValid) errors.push(...nameValidation.errors);
    if (!lastNameValidation.isValid) errors.push(...lastNameValidation.errors);
    if (!emailValidation.isValid) errors.push(...emailValidation.errors);
    if (!passwordValidation.isValid) errors.push(...passwordValidation.errors);
    
    return errors.length === 0 ?
        { isValid: true } :
        { isValid: false, errors };
  }

  isValidUserToUpdate(user) {
    const errors = [];
    const idValidation = this.isValidId(user.id);
    if (!idValidation.isValid) errors.push(...idValidation.errors);
    if (user.first_name) {
        const nameValidation = this.isValidName(user.first_name);
      if (!nameValidation.isValid) errors.push(...nameValidation.errors);
    };
    if (user.last_name) {
        const lastNameValidation = this.isValidName(user.last_name);
      if (!lastNameValidation.isValid) errors.push(...lastNameValidation.errors);
    };
    if (user.email) {
        const emailValidation = this.isValidEmail(user.email);
        if (!emailValidation.isValid) errors.push(...emailValidation.errors);
    };
    if (user.password) {
        errors.push('A senha não pode ser atualizada aqui');
    };
    if (
        !user.first_name &&
        !user.last_name &&
        !user.email &&
        !user.is_admin &&
        !user.active
    ) {
        errors.push('Nenhum campo foi atualizado');
      }
    if (
        user.created_at ||
        user.updated_at ||
        user.deleted ||
        user.deleted_by ||
        user.deleted_at
    ) {
        errors.push(
          'Os campos created_at, updated_at, deleted, deleted_by e deleted_at não podem ser atualizados'
        );
    }

    return errors.length === 0 ?
        { isValid: true } :
        { isValid: false, errors };
  }

  isValidPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const hasMaxLength = password.length <= 20;

    const errors = [];
    if (!hasMinLength) errors.push('A senha deve ter pelo menos 8 caracteres');
    if (!hasMaxLength) errors.push('A senha deve ter no máximo 20 caracteres');
    if (!hasUpperCase) errors.push('A senha deve ter pelo menos uma letra maiúscula');
    if (!hasLowerCase) errors.push('A senha deve ter pelo menos uma letra minúscula');
    if (!hasNumber) errors.push('A senha deve ter pelo menos um número');
    if (!hasSpecialChar) errors.push('A senha deve ter pelo menos um caractere especial');

    return errors.length === 0 ?
        { isValid: true } :
        { isValid: false, errors };
  }

  isValidPasswordChange(currentPassword, newPassword) {
    const errors = [];
    if (!currentPassword || !newPassword) errors.push('Senha atual e nova senha são obrigatórias');
    if (currentPassword === newPassword) errors.push('A nova senha não pode ser igual à senha atual');
    
    const passwordValidation = this.isValidPassword(newPassword);
    if (!passwordValidation.isValid) errors.push(...passwordValidation.errors);
    
    return errors.length === 0 ?
        { isValid: true } :
        { isValid: false, errors };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ?
        { isValid: true } :
        { isValid: false, errors: ['E-mail inválido'] };
  }
}

export default new UserValidators;
