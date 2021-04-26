import {Filter} from "./interfaces";
import { RankedUserData } from "./parser";


export class UserDataFilterByRank implements Filter<RankedUserData> {
    filter(data: RankedUserData[]): RankedUserData[] {
        return data.filter(d => d.rank >= 20);
    }
}