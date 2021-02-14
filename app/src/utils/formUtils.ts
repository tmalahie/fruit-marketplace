export function formDataToObject(formData) {
    let res = {};
    formData.forEach(function (value, key) {
        res[key] = value;
    });
    return res;
}