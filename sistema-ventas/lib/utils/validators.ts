// Validation functions
export const validateEmail = (email: string): boolean => {
    // Email validation logic
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
