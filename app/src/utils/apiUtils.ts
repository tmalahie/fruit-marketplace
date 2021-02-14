let config = require(`../config/${process.env.NODE_ENV}.json`);

export async function queryData(endpoint, {
    method = "GET",
    headers = {},
    body = undefined
}) {
    const token = localStorage.getItem("token");
    const response = await fetch(config.api_url + endpoint, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...headers
        },
        body: body && JSON.stringify(body)
    });
    if (response.status === 204)
        return null;
    const responseJson = await response.json();
    return responseJson;
}

export async function getData(endpoint, params = {}) {
    return queryData(endpoint, {
        ...params,
        method: "GET"
    })
}
export async function postData(endpoint, params = {}) {
    return queryData(endpoint, {
        ...params,
        method: "POST"
    })
}
export async function putData(endpoint, params = {}) {
    return queryData(endpoint, {
        ...params,
        method: "PUT"
    })
}
export async function deleteData(endpoint, params = {}) {
    return queryData(endpoint, {
        ...params,
        method: "DELETE"
    })
}