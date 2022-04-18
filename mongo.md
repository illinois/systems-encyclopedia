# MongoDB
<hr>

## One Hour Until Deadline Explanation

MongoDB is one of the more widely-used non-relational (NOSQL) databases. It relies on a document-oriented model, which is a hierarchal system of database -> collection -> document. This allows the database to store unstructured data. Mongo stores data in a  binary version of JSON called [BSON](https://www.mongodb.com/basics/bson), which makes it very nice to work with.  


## Installation
https://www.mongodb.com/docs/guides/server/install/

## Ways to interface
This entry will show you how to use the mongo command line interface. However, there are many other ways. 
[Mongo compass](https://www.mongodb.com/docs/compass/current/#std-label-compass-index) is an excellent GUI tool that allows for vizualizing the data among other features. 
In addition MongoDB supports many other [programming languages](https://www.mongodb.com/docs/drivers/?_ga=2.112255489.424296623.1650216162-707208841.1646288068) including [c](https://www.mongodb.com/docs/drivers/c/), [c++](https://www.mongodb.com/docs/drivers/cxx/), [c#](https://www.mongodb.com/docs/drivers/csharp/), [java](https://www.mongodb.com/docs/drivers/java-drivers/), [nodejs](https://www.mongodb.com/docs/drivers/node/current/), [python](https://www.mongodb.com/docs/drivers/pymongo/), and many others either through official or community supported libraries. 

## Usage
See https://www.mongodb.com/docs/manual/reference/command/ for details. These commands can be run from MongoDB's command line interface, by typing mongo into a terminal on a system with MongoDB installed. Most ways of interfacing through code like pymongo and MongoClient/mongoose on node will have similar commands. 

For CRUD operations, MongoDB has an excellent documentation at this website: https://www.mongodb.com/docs/manual/crud/. 
### Database Operations
use \<database\> - switches database to desired database. This will work even if database does not exist. However, database will not be created until a collection is added to it.  

show dbs - lists available databases on your system.

show collections - lists available collections to database you're looking at.

### Create

db.\<collection\>.insertOne(\<json data\>) - Will insert a single json object as a document inside of collection. 

```console
> db.fish.insertOne({"name":"jennifer", "type":"swordfish"})
```

db.\<collection\>.insertMany(\<list of json data\>) - Will insert all of those json objects as documents inside of the specified collection. 

```console
> db.fish.insertMany([{"name":"jennifer", "type":"swordfish", "age":3, "isOrange":false, "traits":["pretty chill", "likes anime and hiking"]}, {"name":"vince", "type":"goldfish", "age":28, "isOrange":true, "birthplace":"Long Beach"}, {"name":"nemo", "type":"goldfish", "age":6, "isOrange":true}, {"name":"frank", "type":"generic petco fish", "age":4, "isOrange":true}])
```

### Read

db.\<collection\>.find({<traits to find\>}) - Will find every element in specified collection that matches with the traits. Add .limit(\<number to limit to\>) to the end to limit the search to only n things. We can also add .sort({\<trait to sort for:int>}), with the int representing whether to sort accending (1) or descending (-1).

```console
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
If we want all document in the collection we can just run find() with no parameters
```console
> db.fish.find()
{ "_id" : ObjectId("625518dacc692d549374c6f0"), "name" : "jennifer", "type" : "swordfish" }
{ "_id" : ObjectId("625518f2cc692d549374c6f1"), "name" : "jennifer", "type" : "swordfish", "age" : 3, "isOrange" : false, "traits" : [ "pretty chill", "likes anime and hiking" ] }
{ "_id" : ObjectId("625518f2cc692d549374c6f2"), "name" : "vince", "type" : "goldfish", "age" : 28, "isOrange" : true, "birthplace" : "Long Beach" }
{ "_id" : ObjectId("625518f2cc692d549374c6f3"), "name" : "nemo", "type" : "goldfish", "age" : 6, "isOrange" : true }
{ "_id" : ObjectId("625518f2cc692d549374c6f4"), "name" : "frank", "type" : "generic petco fish", "age" : 4, "isOrange" : true }
```

Things can be found based on either their property or [query operators](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors).

### Update

db.<collection\>.updateOne({<filter\>,\<update\>,\<options\>}) - Will update the first document only that matches the filter with the selected [update operator](https://www.mongodb.com/docs/manual/reference/operator/update/#std-label-update-operators)
```console
> db.fish.updateOne({"name":"frank"}, {$set:{"age":5}})
> db.find({"name":"frank"})
{ "_id" : ObjectId("625518f2cc692d549374c6f4"), "name" : "frank", "type" : "generic petco fish", "age" : 5, "isOrange" : true }
```
db.<collection\>.updateMany({<filter\>,\<update\>,\<options\>}) - Will update all of the documents that fit this pattern. 
```console
> db.fish.updateMany({"isOrange":true}, {$inc:{"age":5}})
> db.fish.find({"isOrange":true})
{ "_id" : ObjectId("625518f2cc692d549374c6f2"), "name" : "vince", "type" : "goldfish", "age" : 33, "isOrange" : true, "birthplace" : "Long Beach" }
{ "_id" : ObjectId("625518f2cc692d549374c6f3"), "name" : "nemo", "type" : "goldfish", "age" : 11, "isOrange" : true }
{ "_id" : ObjectId("625518f2cc692d549374c6f4"), "name" : "frank", "type" : "generic petco fish", "age" : 10, "isOrange" : true }
```
db.<collection\>.replaceOne({<filter\>,\<update\>,\<options\>}) - Changes the entire first document it sees that matches the filter, rather than just updating a field. 
```console
> db.fish.replaceOne({"name":"frank"}, {"name":"frank", "birthplace":"ocean"})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }
> db.fish.find({"name":"frank"})
{ "_id" : ObjectId("625518f2cc692d549374c6f4"), "name" : "frank", "birthplace" : "ocean" }
```

### Delete

db.\<collection\>.deleteOne({<filter\>}) - Deletes first document that matches that filter. 

```console
> db.fish.deleteOne({"name":"nemo"})
> db.fish.find({"name":"nemo"})
>
```
db.\<collection\>.deleteMany({<filter\>}) - Deletes all documents that match that filter
```console
> db.fish.deleteMany({"name":"jennifer"})
> db.fish.find({"name":"jennifer"})
>
```
### Optional Parameters
Many commands have certain optional paramaters. They are placed into the command in one large document called options. Here is a brief explanation on what they mean. 
### Insert Options

[ordered](https://self-learning-java-tutorial.blogspot.com/2021/06/mongodb-ordered-and-unordered-inserts.html) (only in insertMany()) - boolean - default is true - Decides whether data is put into the collection in an ordered or unordered way when we run insertMany(). Ordered inserts take more time. In addition if an error occurs they will stop, which may be useful depending on use case. 

[writeConcern](https://www.mongodb.com/docs/manual/reference/write-concern/) - default is usually majority unless overwritten - This is the parameter to decide which writes get aknowledeged. This is relevant where we have [replica sets](#replica-sets), which means there are multiple nodes with the data.

Options for writeConcern:

w:"majority" - a majority of nodes in system have confirmed the write.

Numerical options:

w:1 - at least the primary node has confirmed the write.

w:0 - no node is required to acknowledge for write to be confirmed.

w:n - at least n nodes including the primary node have acknowledge the write. 

There is also a [j](https://www.mongodb.com/docs/manual/reference/write-concern/#j-option) option to confirm that write was written onto on-disk journal. 

### Find Options
[projection](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#std-label-method-find-projection) - document - default is every field -
Determines fields that are returned to user when queried. Used if we only need specific fields in document. 

### Update Options
upsert - boolean - default is false - Will write new document with specified filter if document is not found during query.

writeConcern - document - default is default write concern - Specifies [write concern](https://www.mongodb.com/docs/manual/reference/write-concern/).

collation - document - default is collection default collation if it has one, otherwise query must exactly match in spelling - Tells us what spelling we should approve of during query. For example default query may pass over capital case word perhaps undesirably. This is what collation document looks like: 
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

arrayFilters - document - Input all of the potential filters you would like to use. 

[hint](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#std-label-update-many-hint) - Allows you to use hint. 

### Querying

[query operators](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors) - When we are making a query, we have the option to either search for the desired filter exactly, or use an operator to search for the filter. Suppose we have a collection document ({"bottles":99, "onWall":true}). We can find it by using db.wall.find("bottles":99). Or we can use db.wall.find("bottles":{"$gte: 98}). This represent all the documents that are greater than or equal to 98 bottles, which allows us to make much more flexible queries. We can do similar things with $or, $and, $regex, and many other features that are shown in their [documentation](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors). We can even make custom [javascript](https://www.mongodb.com/docs/manual/reference/operator/query/where/) functions for querying.  

## General Overview:
MongoDB allows users as every database does to store and obtain data. However, it has several features that make it different than the typical relational database. 

### BSON
MongoDB stores data in BSON format, which is able to store JSON in binary to allow for faster searches, and save space ([in most cases](https://en.wikipedia.org/wiki/BSON#Efficiency)). This has the positive effect of making data searcing relatively simple and intuitive, as many programmers are already acquainted with JSON. 

### Document-Oriented
https://www.mongodb.com/docs/manual/core/databases-and-collections/
MongoDB has a simple document-oriented structure that has three main levels. 
#### Database
A container that holds collections. 
#### Collections
A container that holds documents. For those familiar with SQL databases, this is basically the MongoDB version of a table.  
#### Document
The actual data. This will be essentially a BSON file (in python a dictionary basically). 

### Unstructured Data

MongoDB mostly differs from SQL databases in its allowance of a lack of structure. SQL databases are stored in a table (with rows as specific thing, and columns as the attributes of that thing), so they must conform to the schema that the table (in Mongo "collection") requires. This is fantastic for data that will always be in a defined structure, and this is safer and makes it easier to search for. However, that severely limits our freedom. [80-90\%](https://www.mongodb.com/unstructured-data) of data is unstructured, including email, documents, and many other communication methods. If we are willing to accept the tradeoffs, why shouldn't we be allowed to put any form of data into databases easily. 

### [Indexing](https://www.digitalocean.com/community/tutorials/how-to-use-indexes-in-mongodb)
Suppose we know we will search for certain pieces of data that match a pattern a lot and don't want overhead of traversing entire collection every time. We can create indexes of certain values like this:
```console
> db.fish.createIndex({"age":-1})
```
This will help speed up future searches. Instead of doing a blind search through the collection, the index will store their ages in the order specified so the find operation will be faster. The cost of this is that more indexes require more memory, so only make indexes that are useful. 

## Into the Weeds

### [Scaling](https://www.mongodb.com/basics/scaling)
With some huge datasets, we need to worry about the usage. One option is to just get better hardware, which is called vertical scaling. This is nice and easy, but at a certain point though this just becomes impractical and expensive, and is a [single point of failure](https://medium.com/analytics-vidhya/vertical-vs-horizontal-scaling-b2754d68d77f). Thus with huge datasets we sometimes need to buy more servers and scale horizontally. 

### Sharding
Sharding allows us to distribute data among a couple nodes horizontally. You choose the way to distribute data on each server with a shard key, using the shardCollection command. The shard key is immutable however without significant effort, so you must highly strategic when choosing [it](http://learnmongodbthehardway.com/schema/sharding/). This is also a reason to not shard to early, as you can make the incorrect decision potentially costing a lot in resources from an unbalanced shard. 

### Replica Sets
When using any database, it is essential that we don't lose our data. Imagine a tech company surviving without knowing that I didn't order beans with my burrito on 3/4/2016. A way to ensure this safety is by using replica sets. These are basically a copy of all the data spread across multiple nodes. This is similiar to sharding, but instead of the data being distributed between nodes, the same data is on multiple nodes. The most fundemental node is the primary node. While other nodes can process read requests, the primary node is the only one that directly recieves write operations. It then tells the secondary nodes to make the same change. 

### [Elections](https://www.mongodb.com/docs/manual/core/replica-set-elections/)
Suppose the primary node was hacked. The beauty of this system is that you are not doomed, because other nodes with the data exist. The nodes than stage an election, where they decide on the future primary node. Elections can be triggered for a variety of reasons, including the addition of a new node or not being able to communicate with the node for a predefined period of time. 

### No CAP
Relational databases are named after their ability to link between tables by using keys safely. In MongoDB we cannot do this, because there is no guarentee that the unstructured data in collection A has what collection B wants to link with, because the collections have no innate attributes. A side effect of this is we can no longer use ACID (Atomicity, Consistency, Isolation, and Durabiility). There is no way to ensure that a document will have an attribute, so the transactions are not guarenteed to work out. However, as database fans seem to be acronym lovers, we have a new acronym that is relevant for non-relational databases: [CAP](https://www.instaclustr.com/blog/cassandra-vs-mongodb/) (Consistency, Availablity, and Partition Tolerance). On a non-distributed system this is not an issue, but MongoDB databases can be quite large and spread out over multiple nodes. Partition is the ability to not fail if one node goes down, which MongoDB can do. The tradeoff required for non-relational databases according to [CAP's theorem](https://en.wikipedia.org/wiki/CAP_theorem) is either availability or consistency. [Cassandra](https://cassandra.apache.org/_/index.html) focusses on availability, which concerns making sure that a request when the network is down will provide a result, even if it is not the newest. MongoDB cannot promise this. What MongoDB can promise unlike Cassandra is consistency. As soon as I write something, I do not have to worry about a future query returing the old value. This ensures that all requests will go the way I'm intending. The cost is that the most recent data on a system may be an error.
However, we can adjust MongoDB's consistency and availability, we just cannot have both. 

## Sources:
- https://www.mongodb.com/basics/bson
- https://www.mongodb.com/docs/guides/server/install/
- https://www.mongodb.com/docs/compass/current/#std-label-compass-index
- https://www.mongodb.com/docs/drivers/?_ga=2.112255489.424296623.1650216162-707208841.1646288068
- https://www.mongodb.com/docs/manual/reference/
- https://www.mongodb.com/docs/manual/
- https://en.wikipedia.org/wiki/BSON#Efficiency
- https://www.knowi.com/blog/mongodb-vs-sql/
- https://www.mongodb.com/unstructured-data
- https://www.digitalocean.com/community/tutorials/how-to-use-indexes-in-mongodb
- https://www.mongodb.com/basics/scaling
- https://medium.com/analytics-vidhya/vertical-vs-horizontal-scaling-b2754d68d77f
- http://learnmongodbthehardway.com/schema/sharding/
- https://www.mongodb.com/docs/manual/core/replica-set-elections/
- https://www.instaclustr.com/blog/cassandra-vs-mongodb/
- https://en.wikipedia.org/wiki/CAP_theorem









