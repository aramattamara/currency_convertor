export const heading = "currency convertor";
export const API_DOMAIN = "https://api.frankfurter.app";
export const endpointPath = (amount, fromCur, toCur) =>
    `${API_DOMAIN}/latest?amount=${amount}&from=${fromCur}&to=${toCur}`;
