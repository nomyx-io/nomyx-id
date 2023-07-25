import 'dotenv/config';
// import Service from '../lib/service';
import Parse from 'parse';
import gemforceConfig from '../../../gemforce.config';
// import DataImportService from './data-import';

function camelCase(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word;
    })
    .replace(/\s+/g, '');
}

// Here is the above code, turned into a service:

/**
 * the directscale service. Contains methods for getting and setting values for the directscale tables
 */
export default class ParseService {
  static createdSchemas: any = [];

  static initialize() {
    Parse.initialize(
      gemforceConfig.server.appId,
      undefined,
      gemforceConfig.server.masterKey
    );
    Parse.serverURL = gemforceConfig.server.serverURL;
    Parse.masterKey = gemforceConfig.server.masterKey;
    (Parse as any).port = gemforceConfig.server.port;
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
   * get a record from the parse database
   * @param className
   * @param where
   * @returns
   */
  static async getRecord(
    className: string,
    whereFields: string[] = [],
    whereValues: any[] = [],
    includesValues: any[] = []
  ): Promise<Parse.Object | undefined> {
    if (whereFields.length !== whereValues.length) {
      throw new Error('The number of whereFields and whereValues must match');
    }
    const query = new Parse.Query(className);
    whereFields.forEach((whereField, i) =>
      query.equalTo(whereField, whereValues[i])
    );
    includesValues.forEach((includeValue) => query.include(includeValue));
    return await query.first();
  }

  /**
   * get a record from a particular blockchain
   * @param collection
   * @param networkId
   * @param idFields
   * @param idValueFields
   * @returns
   */
  static async getRecordWithBlockchain(
    collection: any,
    networkId: any,
    idFields: any = [],
    idValueFields: any = []
  ) {
    try {
      const Blockchain = Parse.Object.extend('Blockchain');
      const bquery = new Parse.Query(Blockchain);
      bquery.equalTo('networkId', networkId);
      const query = new Parse.Query(collection);
      query.matchesQuery('network', bquery);
      idFields.forEach((idField: any, i: number) =>
        query.equalTo(idField, idValueFields[i])
      );
      return await query.first({ useMasterKey: true });
    } catch (e) {
      console.log(
        `getRecordWithBlockchain: Error getting record with collection ${collection} and networkId ${networkId} and idFields ${idFields} and idValueFields ${idValueFields}`
      );
    }
  }

  static countRecords(
    collectionName: any,
    collectionIdFields: any,
    collectionIds: any
  ) {
    try {
      const Collection = Parse.Object.extend(collectionName);
      const query = new Parse.Query(Collection);
      collectionIdFields.forEach((cif: any, i: number) =>
        query.equalTo(cif, collectionIds[i])
      );
      return query.count({ useMasterKey: true });
    } catch (e) {
      console.log(
        `countRecords: Error counting records with collectionName ${collectionName} and collectionIdFields ${collectionIdFields} and collectionIds ${collectionIds}`
      );
    }
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
   * get a record from the parse database
   * @param className
   * @param whereFields
   * @param whereValues
   * @returns
   * @constructor
   * @throws {Error} if the number of whereFields and whereValues do not match
   */
  static async getFirstRecord(
    className: string,
    whereFields: string[],
    whereValues: any[]
  ) {
    try {
      if (whereFields.length !== whereValues.length) {
        throw new Error('The number of whereFields and whereValues must match');
      }
      const query = new Parse.Query(className);
      for (let i = 0; i < whereFields.length; i++) {
        query.equalTo(whereFields[i], whereValues[i]);
      }
      const record = await query.first();
      return record;
    } catch (e) {
      console.log(
        `getFirstRecord: Error getting record with className ${className} and whereFields ${whereFields} and whereValues ${whereValues}`
      );
    }
  }

  static async getLatestRecord(
    className: string,
    whereFields: string[],
    whereValues: any[]
  ) {
    try {
      if (whereFields.length !== whereValues.length) {
        throw new Error('The number of whereFields and whereValues must match');
      }
      const query = new Parse.Query(className);
      for (let i = 0; i < whereFields.length; i++) {
        query.equalTo(whereFields[i], whereValues[i]);
      }
      query.descending('createdAt');
      const record = await query.first();
      return record;
    } catch (e) {
      console.log(
        `getLatestRecord: Error getting record with className ${className} and whereFields ${whereFields} and whereValues ${whereValues}`
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

  /**
   * update a record in the parse database
   * @param collectionName
   * @param collectionIdFields
   * @param collectionIds
   * @param data
   * @returns
   */
  static async updateExistingRecord(
    collectionName: any,
    collectionIdFields: any,
    collectionIds: any,
    data: any
  ) {
    try {
      const Collection = Parse.Object.extend(collectionName);
      const query = new Parse.Query(Collection);
      collectionIdFields.forEach((cif: any, i: number) =>
        query.equalTo(cif, collectionIds[i])
      );
      return query.first().then((record: any) => {
        if (record) {
          Object.keys(data).forEach((key: any, i: number) =>
            record.set(key, data[key])
          );
          return record.save();
        } else {
          throw new Error('Record not found');
        }
      });
    } catch (e) {
      console.log(
        `updateExistingRecord: Error updating existing record with collectionName ${collectionName} and collectionIdFields ${collectionIdFields} and collectionIds ${collectionIds} and data ${data}`
      );
    }
  }

  /**
   * create a record in the parse database. Throws an error if the record already exists
   * @param collectionName
   * @param collectionIdFields
   * @param collectionIdsValues
   * @returns {Promise<Parse.Object>}
   */
  static async createRecord(
    collectionName: any,
    collectionIdFields: any = [],
    collectionIdsValues: any = [],
    data: any = {}
  ): Promise<Parse.Object | undefined> {
    try {
      const Collection = Parse.Object.extend(collectionName);
      const query = new Parse.Query(Collection);
      if (collectionIdFields.length > 0) {
        collectionIdFields.forEach((cif: any, i: number) =>
          query.equalTo(cif, collectionIdsValues[i])
        );
        const record = await query.first();
        if (record) {
          throw new Error('Record already exists');
        } else {
          const newRecord = new Collection();
          return newRecord.save(data);
        }
      } else {
        const newRecord = new Collection();
        return newRecord.save(data);
      }
    } catch (e: any) {
      console.log(
        `createRecord: Error creating record with collectionName ${collectionName} and collectionIdFields ${collectionIdFields} and collectionIdsValues ${collectionIdsValues}  ${e.message}`
      );
    }
  }

  static async createRecords(
    collectionName: any,
    collectionIdFields: any = [],
    collectionIdsValues: any = [],
    data: any = {}
  ): Promise<Parse.Object | undefined> {
    try {
      const Collection = Parse.Object.extend(collectionName);
      const query = new Parse.Query(Collection);
      if (collectionIdFields.length > 0) {
        collectionIdFields.forEach((cif: any, i: number) =>
          query.equalTo(cif, collectionIdsValues[i])
        );
        const record = await query.first();
        if (record) {
          throw new Error('Record already exists');
        } else {
          const newRecord = new Collection();
          return newRecord.save(data);
        }
      } else {
        const newRecord = new Collection();
        return newRecord.save(data);
      }
    } catch (e: any) {
      console.log(
        `createRecord: Error creating record with collectionName ${collectionName} and collectionIdFields ${collectionIdFields} and collectionIdsValues ${collectionIdsValues}  ${e.message}`
      );
    }
  }

  /**
   * delete a record in the parse database
   * @param collectionName 
   * @param collectionId 
   * @returns 
   */
  static async deleteRecord(collectionName: any, collectionId: any) {
    try {
      const Collection = Parse.Object.extend(collectionName);
      const query = new Parse.Query(Collection);
      query.equalTo('objectId', collectionId);
      const record = await query.first();
      if (record) {
        return await record.destroy();
      }
    } catch (e) {
      console.log(
        `deleteRecord: Error deleting record with collectionName ${collectionName} and collectionId ${collectionId}`
      );
    }
  }

  /**
   * save all record in the parse database
   * @param records 
   */
  static async saveAll(records: any) {
    try {
      const allRecords = [];
      for (let i = 0; i < records.length; i++) {
        if (records[i] instanceof Parse.Object) {
          allRecords.push(records[i]);
        } else {
          allRecords.push(new Parse.Object(records[i].className, records[i]));
        }
      }
      for (let i = 0; i < allRecords.length; i++) {
        await allRecords[i].save(null);
        console.log(`saveAll: Saved record ${allRecords[i].attributes}`);
      }
    } catch (e) {
      console.log(`saveAll: Error saving records ${records}`);
    }
  }

  /**
   * save all record in the parse database
   * @param collectionName 
   * @param records 
   */
  static async saveAllFor(collectionName: string, records: any) {
    try {
      const allRecords = [];
      for (let i = 0; i < records.length; i++) {
        if (records[i] instanceof Parse.Object) {
          allRecords.push(records[i]);
        } else {
          allRecords.push(new Parse.Object(collectionName, records[i]));
        }
      }
      for (let i = 0; i < allRecords.length; i++) {
        await allRecords[i].save(null);
        console.log(`saveAllFor: Saved record ${allRecords[i]}`);
      }
    } catch (e) {
      console.log(`saveAllFoe: Error saving records ${records}`);
    }
  }

  /**
   * get a parse schema
   * @param className 
   * @returns 
   */
  static async getSchema(className: string) {
    try {
      const query = new Parse.Query('_SCHEMA');
      query.equalTo('className', className);
      return await query.first();
    } catch (e) {
      console.log(`getSchema: Error getting schema for ${className}`);
    }
  }

  /**
   * save a parse schema
   * @param schema 
   * @returns 
   */
  static async saveSchema(schema: any) {
    try {
      return await schema.save();
    } catch (e) {
      console.log(`saveSchema: Error saving schema ${schema}`);
    }
  }

  /**
   * create a parse schema
   * @param className 
   * @param fields 
   * @returns 
   */
  static async createSchema(className: string, fields: any) {
    try {
      // get all the existing schemas
      const schemas = await ParseService.getAllSchemas();

      // if the schema already exists, return
      if (!schemas) return;
      if (schemas.find((s: any) => s.className === className)) {
        return;
      }

      // to create a schema, we simply create an object of that class
      // then delete the object
      const Collection = Parse.Object.extend(className);
      const collection = new Collection();
      const fieldNames = Object.keys(fields);
      const fieldValues = fieldNames.map((fieldName) => {
        // check the field types and create an appropriate value
        const fieldType = fields[fieldName];
        switch (fieldType) {
          case 'String':
            return 'test';
          case 'Number':
            return 1;
          case 'Boolean':
            return true;
          case 'GeoPoint':
            return new Parse.GeoPoint(0, 0);
          case 'Polygon':
            return new Parse.Polygon([
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
            ]);
          case 'Array':
            return ['test'];
          case 'Object':
            return { test: 'test' };
          default:
            return undefined;
        }
      });
      // set the field values
      fieldNames.forEach((fieldName, i) => {
        const fieldValue = fieldValues[i];
        if (!fieldValue) return;
        collection.set(fieldName, fieldValue);
      });

      // save the object
      await collection.save();

      // delete the object
      await collection.destroy();
    } catch (e) {
      console.log((e as any).message);
    }
  }

  /**
   * create multiple schemas
   * @param schemasList 
   */
  static async createSchemas(schemasList: any) {
    const schemas = await ParseService.getAllSchemas();
    const schemaNames = schemas.map((s) => s.className);
    for (let i = 0; i < schemasList.length; i++) {
      const collectionName = schemasList[i];
      if (!schemaNames.includes(collectionName)) {
        await ParseService.createSchema(collectionName, {
          name: 'string',
        });
        console.log(`Created schema for ${collectionName}`);
      }
    }
  }

  /**
   * delete a collection and its schema
   * @param collectionName 
   * @returns 
   */
  static async deleteCollection(collectionName: string) {
    try {
      const query = new Parse.Query(collectionName);
      const records = await query.find();
      return await Parse.Object.destroyAll(records);
    } catch (e) {
      console.log(
        `deleteCollection: Error deleting collection ${collectionName}`
      );
    }
  }

  /**
   * delete a schema
   * @param className 
   * @returns 
   */
  static async deleteSchema(className: string) {
    try {
      const schema = await ParseService.getSchema(className);
      return schema ? await schema.destroy() : undefined;
    } catch (e) {
      console.log(`deleteSchema: Error deleting schema for ${className}`);
    }
  }

  /**
   * get all schemas in the parse database
   */
  static async getAllSchemas() {
    try {
      this.initialize();
      return await Parse.Schema.all();
    } catch (e) {
      return [];
    }
  }

  /**
   * save a file to the parse database
   * @param name 
   * @param data 
   * @param type 
   * @param metadata 
   * @param tags 
   * @returns 
   */
  static async saveFile(
    name: string,
    data?: any,
    type?: string
  ) {
    const parseFile = new Parse.File(name, data, type);
    await parseFile.save({ useMasterKey: true });
    return parseFile;
  }

  /**
   * run a parse cloud function
   * @param cloudFunction 
   * @param params 
   * @returns 
   */
  static async run(cloudFunction: string, params: any = {}) {
    return Parse.Cloud.run(cloudFunction, params);
  }

  /**
   * update a record in the parse database 
   * @param collectionName 
   * @param id 
   * @param fields 
   */
  static async updateRecord(collectionName: string | { className: string; }, id: string, fields: { [x: string]: any; }) {
    const Collection = Parse.Object.extend(collectionName);
    const collection = new Collection();
    collection.id = id;
    for (const key in fields) {
      collection.set(key, fields[key]);
    }
    await collection.save();
  }

  /**
   * createa a record in the parse database
   * @param collectionName 
   * @param fields 
   * @returns 
   */
  static async create(collectionName: string, fields: { [x: string]: any; }) {
    const Collection = Parse.Object.extend(collectionName);
    const collection = new Collection();
    for (const key in fields) {
      collection.set(key, fields[key]);
    }
    await collection.save();
    return collection;
  }

  /**
   * update a record in the parse database
   * @param collName 
   * @param existingRecordId 
   * @param objectToInsert 
   * @returns 
   */
  static async update(collName: string | { className: string; }, existingRecordId: string, objectToInsert: { [x: string]: any; }) {
    const Collection = Parse.Object.extend(collName);
    const collection = new Collection();
    collection.id = existingRecordId;
    for (const key in objectToInsert) {
      collection.set(key, objectToInsert[key]);
    }
    await collection.save();
    return collection;
  }
  
  /**
   * given a record with both regular fields and potentially nested fields, insert all the nested records then update the record
   * determine which objectss to insert by looking for a 'collectionName" field which indicates the collection name
   * if the nested record is in an array, then the field is a relation. If the nested record is an object, then the field is a pointer
   * use the '[object]id' field to determine if the record already exists. If it does, then update it. If not, then create it
   * @param collectionName 
   * @param datas 
   * @param parentObject 
   */
  static async hydrateDatabase(collectionName: string, datas: any, parentObject: any = undefined) {

    // get a record from the database
    const get = async (collectionName: string, idFIeld: string, id: string) => {
      const Collection = Parse.Object.extend(collectionName);
      const query = new Parse.Query(Collection);
      query.equalTo(idFIeld, id);
      return query.first();
    }

    // delete one or more records from the database
    const deleteEl = async (collectionName: string, idFIeld: string, value: any) => {
      const Collection = Parse.Object.extend(collectionName);
      const query = new Parse.Query(Collection);
      query.equalTo(idFIeld, value);
      try {
      const record = await query.find();
      if(record) { await Parse.Object.destroyAll(record) }
      } catch(e) {}
    }

    // hydrate a single record
/*    const hydrateRecord = async (collName: string, data: any) => {

      // if the record does not have an id field, then we cannot hydrate it
      const collectionIdFieldName = `${camelCase(collName)}Id`;
      if(!data[collectionIdFieldName]) {
        console.log(`Not hydrating ${collName} because it does not have an id field`);
        return false;
      }

      // if the record has already been imported, then we do not need to hydrate it
      const diRecord = await DataImportService.isImported(collName, data[collectionIdFieldName]);
      if(diRecord) {
        console.log(`Not hydrating ${collName} because it has already been imported`);
        return false;
      }

      // if the record "enabled" field is false, then do not hydrate it
      if(data.enabled === false) {
        console.log(`Not hydrating ${collName} because it is disabled`);
        return false; 
      }
      
      console.log(`Hydrating ${data.collectionName} with id ${data[collectionIdFieldName]}`);

      // get the fields that are not nested so that we can insert the record
      const fieldNames = Object.keys(data);
      const Collection = Parse.Object.extend(collName);
      let objectToInsert: Parse.Object = new Collection();

      // if the record already exists, then update it
      await Promise.all(fieldNames.map(async (fieldName) => {
        const fieldValue = data[fieldName];
        const isChildAnArray = Array.isArray(fieldValue);
        const childCollectionName = isChildAnArray && fieldValue.length
          ? fieldValue[0].collectionName : fieldValue.collectionName;
        if (childCollectionName) {
          if (isChildAnArray) {  // if the child is an array, then it is a relation
            const childIds = await Promise.all(fieldValue.map(async (child: any) => {
              return await hydrateRecord(childCollectionName, child);
            }));
            childIds.forEach(e=>e&&objectToInsert.relation(fieldName).add(e))
          } else {  // if the child is an object, then it is a pointer
            const childId = await hydrateRecord(childCollectionName, fieldValue);
            if(childId) objectToInsert.set(fieldName, { __type: 'Pointer', 
              className: childCollectionName, objectId: childId.id });
          }
        } else {
          // if the field is not a nested object, then just add it to the object to insert
          objectToInsert.set(fieldName, fieldValue);
        }
      }));

      await DataImportService.setImported(collName, parseInt(data[collectionIdFieldName]));
      // if the record already exists, then update it. If not, then create it
      const existingRecord = await get(collName, collectionIdFieldName, data[collectionIdFieldName]);
      if(existingRecord) {
        console.log(`Record with id ${data[collectionIdFieldName]} already exists in collection ${collName}`);
        // update the existing record
        existingRecord.set(objectToInsert.attributes);
        await existingRecord.save();
        return existingRecord;
      }
      else {
        console.log(`Record with id ${data[collectionIdFieldName]} does not exist in collection ${collName}. Creating it`);
        // create the new record
        await objectToInsert.save();
        return objectToInsert;
      }
    };*/

    // ITERATE THROUGH THE RECORDS AND INSERT THEM
/*    const hydratedRecords = Promise.all(datas.records.map(async (data: any) => {
      await hydrateRecord(collectionName, data);
    }));*/
    // now we delete the records with a 'keep' flag of false
    await deleteEl(collectionName, 'keep', false);

  }

}

module.exports = ParseService;
