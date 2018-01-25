import { Container, Services } from "../inversify.config";
import { LoggerService } from "../services/logger/logger.service";
import { stat } from "fs";
import { promisify } from "util";
import * as path from "path";
const statAsync = promisify(stat);


/**
 * Creates a configuration request from analyzed URL.
 *
 * @export
 * @class ConfigRequest
 */
export class ConfigRequest {

    /** The folder path to read file from. */
    public folderPath: string;

    /** The file name. */
    public filename: string;

    /** The configuration fields to look for in the file. */
    public configFields: Array<string>;

    /** The configuration directory where files reside. */
    private readonly configDirectory: string;

    /** The URL parts parsing RegExp. */
    private readonly urlPartsRegExp: RegExp = /([^\/]+)/g;

    /** The URL to parse. */
    private readonly url: string;

    /** The application logger. */
    private logger: LoggerService;


    /**
     * Private constructor.
     *
     * @param {string} url the URL to parse
     * @memberof ConfigRequest
     */
    private constructor(url: string) {
        this.url = url;
        this.logger = Container.get(Services.LOGGER);
        this.configDirectory = process.env.NODE_CONFIG_DIR || path.resolve(__dirname, "../..", "config");
    }


    /**
     * Creates an instance of Config Request with given URL.
     *
     * @static
     * @param {string} url the URL to create an instance from
     * @returns {Promise<ConfigRequest>} the created instance of ConfigRequest
     * @memberof ConfigRequest
     */
    public static async build(url: string): Promise<ConfigRequest> {
        const cR = new ConfigRequest(url);
        await cR.setFields();

        return Promise.resolve(cR);
    }

    /**
     * Sets configuration request properties from instance URL.
     *
     * @private
     * @memberof ConfigRequest
     */
    private async setFields(): Promise<void> {
        const parsedUrl = this.url.match(this.urlPartsRegExp);
        this.logger.debug("Parsed URL:", parsedUrl.join("/"));

        let pathToFolder = path.resolve(this.configDirectory);
        while (parsedUrl.length) {
            pathToFolder = path.join(pathToFolder, parsedUrl.shift());
            this.logger.debug("Part:", pathToFolder);

            // Check if folder is a directory
            const isFolder = (await statAsync(pathToFolder)).isDirectory();
            if (isFolder) {
                this.folderPath = pathToFolder;

            } else {
                this.filename = pathToFolder.substring(pathToFolder.lastIndexOf("/") + 1);
                break;
            }
        }

        this.configFields = parsedUrl;

        this.logger.debug("Folder path:", this.folderPath);
        this.logger.debug("Filename:", this.filename);
        this.logger.debug("Config fields:", this.configFields.join("/"));
    }

}