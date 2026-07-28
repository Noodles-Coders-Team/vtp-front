export async function get(URL: string): Promise<any> {
    let response = await fetch(URL,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    if(!response.ok){
        const text = await response.text();
        throw new Error(`${URL} failed (${response.status}): ${text || response.statusText}`);
    }
    return await response.json();
}

export function put(URL: string, body: any = {}): Promise<any> {
    return sendPostPutRequest('PUT', URL, body);
}

export async function post(URL: string, body: any = {}): Promise<any> {
    return sendPostPutRequest('POST', URL, body);
}

async function sendPostPutRequest(type: string, URL: string, body: any): Promise<any> {
    let response = await fetch(URL, {
        method: type,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if(!response.ok){
        const text = await response.text();
        throw new Error(`${URL} failed (${response.status}): ${text || response.statusText}`);
    }
    return await response.json();
}