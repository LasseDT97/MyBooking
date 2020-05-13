'use strict';

// List of translation codes into Danish text
const i18n = {
    'error.firstName.any.required': 'Indtast venligst dit fornavn.',
    'error.lastName.any.required': 'Indtast venligst dit efternavn.',
    'error.email.any.required': 'Indtast venligst din e-mail-adresse.',
    'error.phone.any.required': 'Indtast venligst dit telefonnummer.',
    'error.password.any.required': 'Indtast venligst en adgangskode.',

    'error.firstName.string.empty': 'Indtast venligst dit fornavn.',
    'error.lastName.string.empty': 'Indtast venligst dit efternavn.',
    'error.email.string.empty': 'Indtast venligst din e-mail-adresse.',
    'error.password.string.empty': 'Indtast venligst en adgangskode.',

    'error.date.date.base': 'Vælg venligst en gyldig dato med tidspunkt',

    'error.phone.string.length': 'Indtast venligst et gyldigt telefonnummer.',
    'error.email.string.email': 'Indtast venligst en gyldig e-mail-adresse.',
    
    'error.password.string.min': 'Indtast venligst en adgangskode med minimum 6 tegn.',
    
    'error.user.exists': 'Brugeren findes allerede.',
    'error.authentication.failed': 'Login mislykkedes.',
    'error.system.internal': 'Der er sket en fejl i systemet.',
    'error.reservation.closed': 'Du har valgt et tidspunkt uden for vores åbningstider.',
    'error.reservation.no.tables': 'Vi fandt ingen ledige borde, der matchede dine kriterier.',
};

module.exports = i18n;