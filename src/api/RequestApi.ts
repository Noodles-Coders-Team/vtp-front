export class RequestApi {

    private readonly URL: string;

    constructor(readonly url: string) {
        this.URL = url;
    }


    async get(signal: AbortSignal, point: string = ""): Promise<unknown> {
        const response = await fetch(this.URL + encodeURIComponent(point),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: signal
            }
        );
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`${this.URL + encodeURIComponent(point)} failed (${response.status}): ${text || response.statusText}`);
        }
        return await response.json();
    }


    async postDelete(signal: AbortSignal, point: string) {
        return this.sendPostPutRequest("DELETE", {}, signal, point);
    }


    async put(body: unknown = {}, signal: AbortSignal, point: string = ""): Promise<unknown> {
        return this.sendPostPutRequest('PUT', body, signal, point);
    }


    async post(body: unknown = {}, signal: AbortSignal, point: string = ""): Promise<unknown> {
        return this.sendPostPutRequest('POST', body, signal, point);
    }


    private async sendPostPutRequest(type: string, body: unknown, signal: AbortSignal, point: string): Promise<unknown> {
        const response = await fetch(this.URL + encodeURIComponent(point), {
            method: type,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            signal: signal
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`${this.URL + encodeURIComponent(point)} failed (${response.status}): ${text || response.statusText}`);
        }
        return await response.json();
    }
}
