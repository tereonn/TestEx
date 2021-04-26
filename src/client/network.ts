import {NetGetRequester} from './interfaces';
import http from 'http';

export class HttpRequester implements NetGetRequester {
    getRequest(url: string): Promise<string> {
        return new Promise((rslv, rjct) => {
            http.get(url, (res) => {
                const { statusCode } = res;
                if (statusCode !== 200) {
                    return rjct(new Error(`Request error, failed with code: ${statusCode}`));
                }

                let data = "";
                res.on("data", chunk => data += chunk);
                res.on("end", () => rslv(data));
                res.on("error", e => rjct(e));
            })
        })
    }
}