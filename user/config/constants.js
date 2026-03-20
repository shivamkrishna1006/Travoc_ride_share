module.exports = {
    // User roles
    USER_ROLES: {
        ADMIN: 'admin',
        USER: 'user'
    },

    // Payment method types
    PAYMENT_TYPES: {
        CREDIT_CARD: 'credit_card',
        DEBIT_CARD: 'debit_card',
        WALLET: 'wallet'
    },

    // Conversation levels
    CONVERSATION_LEVELS: {
        QUIET: 'quiet',
        NORMAL: 'normal',
        CHATTY: 'chatty'
    },

    // Token expiry
    TOKEN_EXPIRY: '7d',

    // Bcrypt salt rounds
    SALT_ROUNDS: 10,

    // Validation rules
    VALIDATION: {
        MIN_FIRST_NAME: 2,
        MIN_LAST_NAME: 2,
        MIN_PHONE: 10,
        MIN_PASSWORD: 6,
        MAX_RATING: 5,
        MIN_RATING: 1,
        DEFAULT_RATING: 5
    }
};
