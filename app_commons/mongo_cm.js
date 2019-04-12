const Rfr			= require('rfr');
const MongoDB		= require('mongodb');
const ObjectID		= require('mongodb').ObjectID
const Util			= require('util');

class Mongo {
	/** Mongo constructor class : gets the mongo client on initialization */
	constructor(dbUrl, cb) {
		this.client = false;
		this.mdb = false;
		this.Promises = {
			addDocuments: Util.promisify(this.addDocuments),
			setDocument: Util.promisify(this.setDocument),
			pullDocument: Util.promisify(this.pullDocument),
			findDocument: Util.promisify(this.findDocument),
			deleteDocument: Util.promisify(this.deleteDocument),
			pushDataToDocument: Util.promisify(this.pushDataToDocument)
		}
		MongoDB.MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
			if (err) { return (cb(`Could not fetch the mongo client : ${err}`)) }
			this.client = client;
			this.mdb = client.db(__MONGO_DBNAME);
			console.log('Connected to the MongoDB client ✓');
			return (cb(null, this));
		});
	}

	toObjectId(id) {
		try {
			return new ObjectID(id);
		} catch(err) {
			__CONSOLE_DEBUG(err);
			return (null);
		}
	}

	/**
	Finds all the elements in the collection.
	**/
	findManyDocuments(collection, query, cb) {
		if (!query) return (cb('Please provide a query (must be json object).'));
		if (query._id && !(query._id = this.toObjectId(query._id))) return (cb('Please provide a valid id'));
		this.mdb.collection(collection).find(query).toArray((err, foundDoc) => {
			if (err) { return (cb(err)) }
			if (foundDoc == null || !foundDoc.length) return (cb({message: "Could not find any document with the provided query.", query: query}));
			return (cb(null, foundDoc));
		})
	}

	/**
	Finds a document in the collection given, and returns it. The query must be a valid JSON object.
	**/
	findDocument(collection, query, cb) {
		if (!query) return (cb('Please provide a query (must be json object).'));
		if (query._id && !(query._id = this.toObjectId(query._id))) return (cb('Please provide a valid id'));
		this.mdb.collection(collection).findOne(query, (err, foundDoc) => {
			if (err) { return (cb(err)) }
			if (foundDoc == null) return (cb({message: "Could not find any document with the provided query.", query: query}));
			return (cb(null, foundDoc));
		})
	}

	/**
	Pushes the data to an element in the collection given, and returns the pushed element.
	**/
	pushDataToDocument(collection, element, query, cb) {
		if (!query) return (cb('Please provide a query (must be json object).'));
		if (query._id && !(query._id = this.toObjectId(query._id))) return (cb('Please provide a valid id.'));
		this.mdb.collection(collection).findOneAndUpdate(element, {$push : query}, {returnOriginal : false}, (err, inserted) => {
			if (err) return (cb(err));
			return (cb(null, inserted));
		});
	};

	/**
	Removes the document found using the query. Query must be a valid JSON string.
	**/
	deleteDocument(collection, query, cb) {
		if (!query) return (cb('Please provide a query (must be json object).'));
		if (query._id && !(query._id = this.toObjectId(query._id))) return (cb('Please provide a valid id.'));
		this.findManyDocuments(collection, query, (err, results) => {
			if (err) return (cb(err));
			if (results.length > 1) return (cb('You cannot delete multiple elements at once using deleteDocument.'));
			this.mdb.collection(collection).deleteMany(query, (err) => {
				if (err) return (cb(err));
				return (cb(null));
			})
		})
	}

	/**
	Removes one or all elements in a doc array matching the data specs.
	Eg : pullDocument('users', {_id : 1234}, {pets : {'type' : 'dog'}}, true)
	-> Removes all dogs of the user 1234 (if set to false, only the first dog is removed)
	**/
	pullDocument(collection, docSpecs, data, multi = true, cb) {
		if (!data) return (cb('Please provide data (must be json object).'));
		if (data._id && !(data._id = this.toObjectId(data._id))) return (cb('Please provide a valid id.'));
		let query = {$pull : data};
		ret.result.mdb.collection(collection).updateOne(docSpecs, query, {multi : multi}, (err, updated) => {
			if (err) return (err);
			return (cb(null, updated));
		});
	};

	/**
	Updates the elements of the document found using the element JSON string.
	in the collection as provided by the query. The query must be a JSON string in the form :
	{ key : value }. The operator is a boolean, with true : set, and false : unset. If false is used,
	the value is ignored, but the json string still must have one.
	**/
	setDocument(operator, collection, element, query, cb) {
		if (!element) return (cb('Please provide an element (must be json object).'));
		if (!query) return (cb('Please provide a query (must be json object).'));
		if (element._id && !(element._id = this.toObjectId(element._id))) return (cb('Please provide a valid id.'));
		if (typeof operator != "boolean") return (cb("setDocuments: operator must be true or false."));
		let set = (operator == true) ? {$set : query} : {$unset : query};
		this.findManyDocuments(collection, element, (err, results) => {
			if (err) return (cb(err));
			if (results.length > 1) return (cb('You cannot update multiple elements at once using setDocument.'));
			this.mdb.collection(collection).updateOne(element, set, (err) => {
				if (err) return (cb(err));
				return cb(null);
			})
		})
	}

	/**
	Adds the data passed as argument to the given collection. The collection
	must be a string and the data a valid json string.
	**/
	addDocuments(collection, data, cb) {
		if (!Array.isArray(data)) return (cb('Data must be provived as an array.'));
		if (data.length == 0) return cb(null, []);
		if (!data) return (cb('Please provide a data (must be json object).'));
		if (data._id && !(data._id = this.toObjectId(data._id))) return (cb('Please provide a valid id.'));
		this.mdb.collection(collection).insertMany(data, (err, insertedDoc) => {
			if (err) return (cb(err));
			return (cb(null, insertedDoc));
		})
	}
	closeClient() { this.client.close(); }
}

exports.Mongo = Mongo;
