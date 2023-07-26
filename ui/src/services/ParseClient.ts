import parseConfig from "../parse.json";

const Parse = require('../lib/parse');

export default class ParseClient {
    static createdSchemas: any = [];

    public static initialize() {
        Parse.initialize(parseConfig.applicationId, parseConfig.applicationId, parseConfig.masterKey);
        Parse.serverURL = parseConfig.serverURL;
        Parse.masterKey = parseConfig.masterKey;
    }

    /**
     * get a record from the parse database
     * @param collectionName
     * @param id
     * @returns
     */
    static async get(collectionName: string, id: string) {
        const Collection = Parse.Object.extend(collectionName);
        const query = new Parse.Query(Collection);
        query.equalTo('objectId', id);
        return query.first();
    }

    /**
     * get records from the parse database
     * @param className
     * @param whereFields
     * @param whereValues
     * @returns
     * @constructor
     * @throws {Error} if the number of whereFields and whereValues do not match
     */
    static async getRecords(
        className: string,
        whereFields: string[] = [],
        whereValues: any[] = [],
        include: any[] = [],
        limit: number = 1000,
        skip: number = 0,
        order: string = 'createdAt',
        orderDirection: string = 'asc',
        nonNullFields: string[] = []
    ) {
        try {
            if (whereFields.length !== whereValues.length) {
                throw new Error('The number of whereFields and whereValues must match');
            }
            const query = new Parse.Query(className);
            for (let i = 0; i < whereFields.length; i++) {
                // filter out any undefined values
                query.equalTo(whereFields[i], whereValues[i]);
            }
            include.forEach((i: any) => query.include(i));

            nonNullFields.forEach((field: string) => {
                query.exists(field);
            });

            query.limit(limit);
            // order by direction
            if (orderDirection === 'asc') {
                query.ascending(order);
            } else {
                query.descending(order);
            }

            const records = await query.find();
            return records;
        } catch (e) {
            console.log(
                `getRecords: Error getting records with className ${className} and whereFields ${whereFields} and whereValues ${whereValues}`
            );
        }
    }


    /**
     * create or update a record in the parse database
     * @param collectionName
     * @param collectionIdFields
     * @param collectionIdsValues
     * @returns {Promise<Parse.Object>}
     */
    static async createOrUpdateRecord(
        collectionName: any,
        collectionIdFields: any = [],
        collectionIds: any = [],
        data: any = {}
    ): Promise<Parse.Object | undefined> {
        const Collection = Parse.Object.extend(collectionName);
        const query = new Parse.Query(Collection);
        collectionIdFields.forEach((cif: any, i: number) =>
            query.equalTo(cif, collectionIds[i])
        );
        let record: any;
        try {
            record = await query.first();
            if (record) {
                Object.keys(data).forEach((key: any, i: number) =>
                    (record as any).set(key, data[key])
                );
                return record;
            }
        } catch(e) {
            console.log('cannot create record', (e as any).message);
        }

        if (!record)  {
            collectionIdFields.forEach(
                (cif: any, i: number) => ((data as any)[cif] = collectionIds[i])
            );
            record = new Collection(data);
            return record;
        }
    }

}
