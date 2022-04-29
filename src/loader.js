const { MongoClient, ObjectID } = require("mongodb");

module.exports = {
    Loader: function(){
        const self = this;
        const client = new MongoClient("mongodb://root:rootpassword@mongo:27017/");

        self.loadCustomersAsync = async function(){
            try {
                await client.connect();

                const database = client.db("NinjaBank");
                const customersCollection = database.collection("Customers");

                const cursor = customersCollection.find({});
                return cursor.toArray();
            } catch (error) {
                console.log(error);
                throw error;
            } finally {
                await client.close();
            } 
        };

        self.loadTransactiosnAsync = async function(){
            
        };
    }
}