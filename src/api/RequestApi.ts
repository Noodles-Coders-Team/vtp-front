export async function get(URL: string): Promise<unknown> {
    const response = await fetch(URL,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${URL} failed (${response.status}): ${text || response.statusText}`);
    }
    return await response.json();
}

export function postDelete(URL: string) {
    return sendPostPutRequest("DELETE", URL, {});
}

export async function put(URL: string, body: unknown = {}): Promise<unknown> {
    return sendPostPutRequest('PUT', URL, body);
}

export async function post(URL: string, body: unknown = {}): Promise<unknown> {
    return sendPostPutRequest('POST', URL, body);
}

async function sendPostPutRequest(type: string, URL: string, body: unknown): Promise<unknown> {
    const response = await fetch(URL, {
        method: type,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${URL} failed (${response.status}): ${text || response.statusText}`);
    }
    return await response.json();
}