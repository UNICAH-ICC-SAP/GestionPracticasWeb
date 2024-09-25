
function maskPhone(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d)/g, "($1) $2");
    value = value.replace(/(\d{4})(\d{4})$/, "$1-$2");
    return value;
}

function maskCurrency(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1.$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, " ");
    return value;
}

function maskDNI(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{4})(\d)/g, "$1$2");
    value = value.replace(/(\d{4})(\d{5})$/, "$1$2");
    return value;
}

export { maskPhone, maskCurrency, maskDNI };