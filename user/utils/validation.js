// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports.validateEmail = (email) => {
    return emailRegex.test(email);
};

module.exports.validatePhone = (phone) => {
    // Basic phone validation - at least 10 digits
    return /^\d{10,}$/.test(phone.replace(/\D/g, ''));
};

module.exports.validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

module.exports.validateRegistration = (data) => {
    const { firstName, lastName, email, phone, password } = data;
    const errors = [];

    if (!firstName || firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters');
    }

    if (!lastName || lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters');
    }

    if (!this.validateEmail(email)) {
        errors.push('Invalid email format');
    }

    if (!this.validatePhone(phone)) {
        errors.push('Phone number must contain at least 10 digits');
    }

    if (!this.validatePassword(password)) {
        errors.push('Password must be at least 6 characters');
    }

    return errors;
};
