import { UserDataFilterByRank } from "./filter";
import {Filter, NetGetRequester, Parser } from "./interfaces";
import { HttpRequester } from "./network";
import { RankedUserData, UserDataParser } from "./parser";


export class TestRequester {
    constructor(
        private url: string,
        private queryParam: string,
        private netRequestMaker = new HttpRequester(),
        private filter = new UserDataFilterByRank(),
        private parser = new UserDataParser(),
    ) {}

async getLimitedUserData() {
        try {
            //забираем 1 страницу, парсим ее
            const firstPageRawData = await this.makeApiRequest(0);
            const firstPageData = this.parseData(firstPageRawData);
            const totalReqNum = Math.ceil(firstPageData.total / firstPageData.userCount); //нашли общее количество запрсоов

            const requests = this.formRequestQueue(totalReqNum);
            const resp = await Promise.all(requests); //массив запросов к серверу
            const parsedData = resp.map(d => {//парсим и сразу фильтруем результат, после возвращаем массив отфильтрованных пользователей
                const parsed = this.parseData(d);
                return this.filter.filter(parsed.users);
            });

            return [...parsedData.reduce((acc, val) => acc.concat(val), []), ...this.filter.filter(firstPageData.users)]; //поднимаем вложенные массивы, добавляем значения 1 запроса
        }
         catch (e) {
            console.error('Request error:', e.message);//обрабатыавем ошибки
        }
    }

    private formRequestQueue(num: number) {
        const requests = [];

        for (let i = 1; i < num; i++) {//c 1 потому что 0 страницу мы уже получили
            requests.push(this.makeApiRequest(i))
        }

        return requests;
    }

    //обрабатывать ошибки я буду в вызывающем методе
    private async makeApiRequest(paramVal: number) {
        return this.netRequestMaker.getRequest(`${this.url}?${this.queryParam}=${paramVal}`);
    }

    private parseData(rawData: string) {
        const resp = this.parser.parse(rawData);

        resp[0].users = this.filter.filter(resp[0].users) //мы знаем что данный фильтр возвращает массив с 1 элементом. Фильтруем массив пользователей.

        return resp[0];
    }
}

// Таким образом, если в 1 запросе users = [], тогда ожидаем что total = 0, следовательно totalReqNum(общее количество запросов которые мы должны сделать) = 0
// и метод formRequestQueue вернет пустой массив. Также пустым будет массив resp и метод вернет в результате пустой массив. Случай с пустым массивом данных обработается корректно.
// Примерно по той же схеме обработается сценарий если страница всего одна - округление вверх общего количества запросов даст 1, массив запросов будет пустым.
