import { GenericParser } from "../generic.parser";
import { injectable } from "inversify";


/**
 * Parser for transforming JSON string into object.
 *
 * @export
 * @class JSONParser
 * @extends {GenericParser}
 */
@injectable()
export class JSONParser extends GenericParser {

    /**
     * Transform a string into js object.
     *
     * @param {string} str the stringified JSON
     * @returns {*} the parsed JSON into a JavaScript object
     * @memberof JSONParser
     */
    public parse(str: string): any {
        try {
            return JSON.parse(str);

        } catch (err) {
            this.logger.error(err.message);
            throw err;
        }
    }

}
