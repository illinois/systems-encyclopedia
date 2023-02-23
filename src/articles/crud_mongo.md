---
title: MongoDB CRUD Operations
date: 2022-09-09

authors:
- shaffar3
---

# MongoDB Crud Operations.
MongoDB is one of the more widely used non-relational (NOSQL) databases. This article will explain how to do typical CRUD operations (creating, read, update, and delete). This guide uses bash, but interfacing through different languages like pymongo with python or mongoose on javascript will have similar commands.

### Database Operations
use \<database\> - switches database to the desired database. This will work even if the desired database does not exist. However, a new database will not be created until a collection is added to it.  

show dbs - lists available databases on your system.

show collections - lists available collections to database you're looking at.

### Create

db.\<collection\>.insertOne(\<JSON data\>) - Will insert a single json object as a document inside of collection. 

```bash
> db.fish.insertOne({"name":"jennifer", "type":"swordfish"})
```

db.\<collection\>.insertMany(\<list of JSON data\>) - Will insert all the json objects as documents inside of the specified collection. 

```bash
> db.fish.insertMany([{"name":"jennifer", "type":"swordfish", "age":3, "isOrange":false, "traits":["pretty chill", "likes anime and hiking"]}, {"name":"vince", "type":"goldfish", "age":28, "isOrange":true, "birthplace":"Long Beach"}, {"name":"nemo", "type":"goldfish", "age":6, "isOrange":true}, {"name":"frank", "type":"generic petco fish", "age":4, "isOrange":true}])
```

### Read

db.\<collection\>.find({<traits to find\>}) - Will find every element in the specified collection that matches with the traits. Add .limit(\<limit number\>) to the end to limit the search to only n things. We can also add .sort({\<trait to sort for:int>}), with 1 representing accending and -1 representing descending.


```bash
> db.fish.find({"name":"vince"})
{ "_id" : ObjectId("625518f2cc692d549374c6f2"), "name" : "vince", "type" : "goldfish", "age" : 28, "isOrange" : true, "birthplace" : "Long Beach" }

> db.fish.find({"type":"goldfish"}).sort({"age":-1})
{ "_id" : ObjectId("625518f2cc692d549374c6f2"), "name" : "vince", "type" : "goldfish", "age" : 28, "isOrange" : true, "birthplace" : "Long Beach" }
> db.fish.find({"type":"goldfish"}).sort({"age":-1})
{ "_id" : ObjectId("625518f2cc692d549374c6f2"), "name" : "vince", "type" : "goldfish", "age" : 28, "isOrange" : true, "birthplace" : "Long Beach" }
{ "_id" : ObjectId("625518f2cc692d549374c6f3"), "name" : "nemo", "type" : "goldfish", "age" : 6, "isOrange" : true }
> db.fish.find({"type":"goldfish"}).limit(1)
{ "_id" : ObjectId("625514a1cc692d549374c6e4"), "name" : "nemo", "type" : "goldfish", "age" : 6 }
```
If we need all the documents in the collection, run find() with no parameters!
```bash
> db.fish.find()
{ "_id" : ObjectId("625518dacc692d549374c6f0"), "name" : "jennifer", "type" : "swordfish" }
{ "_id" : ObjectId("625518f2cc692d549374c6f1"), "name" : "jennifer", "type" : "swordfish", "age" : 3, "isOrange" : false, "traits" : [ "pretty chill", "likes anime and hiking" ] }
{ "_id" : ObjectId("625518f2cc692d549374c6f2"), "name" : "vince", "type" : "goldfish", "age" : 28, "isOrange" : true, "birthplace" : "Long Beach" }
{ "_id" : ObjectId("625518f2cc692d549374c6f3"), "name" : "nemo", "type" : "goldfish", "age" : 6, "isOrange" : true }
{ "_id" : ObjectId("625518f2cc692d549374c6f4"), "name" : "frank", "type" : "generic petco fish", "age" : 4, "isOrange" : true }
```


### Update

db.<collection\>.updateOne({<filter\>,\<update\>,\<options\>}) - Will update the first document that matches the filter with the selected [update operator](https://www.mongodb.com/docs/manual/reference/operator/update/#std-label-update-operators)
```bash
> db.fish.updateOne({"name":"frank"}, {$set:{"age":5}})
> db.fish.find({"name":"frank"})
{ "_id" : ObjectId("625518f2cc692d549374c6f4"), "name" : "frank", "type" : "generic petco fish", "age" : 5, "isOrange" : true }
```
db.<collection\>.updateMany({<filter\>,\<update\>,\<options\>}) - Will update all the documents that fit this pattern. 
```bash
> db.fish.updateMany({"isOrange":true}, {$inc:{"age":5}})
> db.fish.find({"isOrange":true})
{ "_id" : ObjectId("625518f2cc692d549374c6f2"), "name" : "vince", "type" : "goldfish", "age" : 33, "isOrange" : true, "birthplace" : "Long Beach" }
{ "_id" : ObjectId("625518f2cc692d549374c6f3"), "name" : "nemo", "type" : "goldfish", "age" : 11, "isOrange" : true }
{ "_id" : ObjectId("625518f2cc692d549374c6f4"), "name" : "frank", "type" : "generic petco fish", "age" : 10, "isOrange" : true }
```
db.<collection\>.replaceOne({<filter\>,\<update\>,\<options\>}) - Changes the entire first documentthat matches the filter, rather than just updating the field. 
```bash
> db.fish.replaceOne({"name":"frank"}, {"name":"frank", "birthplace":"ocean"})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }
> db.fish.find({"name":"frank"})
{ "_id" : ObjectId("625518f2cc692d549374c6f4"), "name" : "frank", "birthplace" : "ocean" }
```

### Delete

db.\<collection\>.deleteOne({<filter\>}) - Deletes the first document that matches that filter. 

```bash
> db.fish.deleteOne({"name":"nemo"})
> db.fish.find({"name":"nemo"})

```
db.\<collection\>.deleteMany({<filter\>}) - Deletes all the documents that match that filter
```bash
> db.fish.find({"name":"jennifer"})
{ "_id" : ObjectId("6266ccab8043baa2ef94ce8a"), "name" : "jennifer", "type" : "swordfish" }
{ "_id" : ObjectId("6266ccbd8043baa2ef94ce8b"), "name" : "jennifer", "type" : "swordfish", "age" : 3, "isOrange" : false, "traits" : [ "pretty chill", "likes anime and hiking" ] }
> db.fish.deleteMany({"name":"jennifer"})
> db.fish.find({"name":"jennifer"})

```

### Optional Parameters
Many commands have certain optional paramaters. They are placed into the command in one large document called options. Here is a brief explanation on what they mean. 
### Insert Options

**[ordered](https://self-learning-java-tutorial.blogspot.com/2021/06/mongodb-ordered-and-unordered-inserts.html)** - *(only in insertMany())* - *boolean* - *default is true* : 

Decides whether data is put into the collection in an ordered or unordered way. Ordered inserts take longer than unordered inserts. 

**[writeConcern](https://www.mongodb.com/docs/manual/reference/write-concern/)** - *default is usually majority unless overwritten* : 

This is the parameter that decides which write get aknowledeged. This is relevant when there are [replica sets](#replica-sets).

Options for writeConcern:

w:"majority" - a majority of nodes in system have confirmed the write.

Numerical options:

w:1 - at least the primary node has confirmed the write.

w:0 - no node is required to acknowledge for write to be confirmed.

w:n - at least n nodes including the primary node have acknowledge the write. 

There is a [j](https://www.mongodb.com/docs/manual/reference/write-concern/#j-option) option to confirm that the write was written onto a on-disk journal. 

### Find Options
**[projection](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#std-label-method-find-projection)** - *document* - *default is every field* :

Determines fields that are returned to the user when queried. Primarily used when one needs specific fields in the document. 

### Update Options
**upsert** - *boolean* - *default is false* : 

Will write a new document with the specified filter, if the document is not found during query.

**writeConcern** - *document* - *default is default write concern* :

Specifies [write concern](https://www.mongodb.com/docs/manual/reference/write-concern/).

**collation** - *document* - *When performing a query in a database, if the collection or database has a default collation set, the query will use that default collation to match strings. However, if the collection or database does not have a default collation set, the query must exactly match the spelling of the strings being compared in order to return accurate results.* :
```json
collation: {
   locale: <string>,
   caseLevel: <boolean>,
   caseFirst: <string>,
   strength: <int>,
   numericOrdering: <boolean>,
   alternate: <string>,
   maxVariable: <string>,
   backwards: <boolean>
}
```

**arrayFilters** - *document* :

Input all of the potential filters you would like to use. 


### Querying

**[query operators](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors)** :

When we are making a query, we have the option to either search for the desired filter exactly, or use an operator to search for the filter. Suppose we have a document ({"bottles":99, "onWall":true}) - we can find it by using db.wall.find("bottles":99). Or we can use db.wall.find({"bottles":{$gte: 98}}). This represents all the documents that are greater than or equal to 98 bottles, which allows us to make much more flexible queries. We can do similar things with $or, $and, $regex, and many other features that are shown in the [documentation](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors). Furthermore, we can make use of custom [javascript](https://www.mongodb.com/docs/manual/reference/operator/query/where/) functions for querying.  