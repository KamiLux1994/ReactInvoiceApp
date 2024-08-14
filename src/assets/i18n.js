import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "WELCOME_TEXT": "Welcome to React and react-i18next",
            "TEST_INPUT": "Test input label",
            "NO": "No.",
            "CREATED": "Created",
            "VALID_UNTIL": "Valid until",
            "AMOUNT": "Amount",
            "ACTIONS": "Actions",
            "INVOICE": {
                "NAME": "Name*",
                "CREATED_DATE": "Created date",
                "VALID_UNTIL_DATE": "Valid until date",
                "COMPANY_NAME": "Company name*",
            }
        }
    },
    pl: {
        translation: {
            "WELCOME_TEXT": "Witamy w React oraz react-i18next",
            "TEST_INPUT": "Testowa labelka inputa",
            "NO": "Nr.",
            "CREATED": "Utworzony",
            "VALID_UNTIL": "Data ważności",
            "AMOUNT": "Ilość",
            "ACTIONS": "Akcje",
            "INVOICE": {
                "NAME": "Nazwa*",
                "CREATED_DATE": "Data utworzenia",
                "VALID_UNTIL_DATE": "Data ważności",
                "COMPANY_NAME": "Nazwa firmy*",
            }
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;