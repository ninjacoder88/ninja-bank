const { MongoClient, ObjectID } = require("mongodb");

module.exports = {
    Processor: function(){
        const self = this;
        const client = new MongoClient("mongodb://root:rootpassword@mongo:27017/");

        self.createCustomerAsync = async function(customerName){
            try {
                await client.connect();

                const database = client.db("NinjaBank");
                const customersCollection = database.collection("Customers");

                await eventLogCollection.insertOne({eventName: "createCustomer", arguments: {customerName: customerName}});
                return await customersCollection.insertOne({customerName: customerName});
            } catch (error) {
                console.log(error);
                throw error;
            } finally {
                await client.close();
            }
        };

        self.createAccountAsync = async function(customerId, accountName, openingBalance){
            try {
                await client.connect();

                const database = client.db("NinjaBank");
                const eventLogCollection = database.collection("EventLogs");
                const accountsCollection = database.collection("Accounts");

                await eventLogCollection.insertOne({eventName: "createAccount", arguments: {customerId: customerId, accountName: accountName, openingBalance: openingBalance}});
                return await accountsCollection.insertOne({customerId: customerId, accountName: accountName, accountBalance: openingBalance});
            } catch (error) {
                console.log(error);
                throw error;
            } finally {
                await client.close();
            }
        };

        self.createTransferAsync = async function(sourceAccountId, destinationAccountId, transferAmount){
            // rollback if one fails
            await self.withdrawalAsync(sourceAccountId, transferAmount);
            await self.depositAsync(destinationAccountId, transferAmount);          
        };

        self.depositAsync = async function(accountId, depositAmount){
            try {
                await client.connect();

                const database = client.db("NinjaBank");
                const eventLogCollection = database.collection("EventLogs");
                const transactionsCollection = database.collection("Transactions");

                await eventLogCollection.insertOne({eventName: "deposit", arguments: {accountId: accountId, amount: depositAmount}});
                return await transactionsCollection.insertOne({accountId: accountId, amount: depositAmount});
            } catch (error) {
                console.log(error);
                throw error;
            } finally {
                await client.close();
            } 
        };

        self.withdrawalAsync = async function(accountId, withdrawalAmount){
            try {
                await client.connect();

                const database = client.db("NinjaBank");
                const eventLogCollection = database.collection("EventLogs");
                const transactionsCollection = database.collection("Transactions");

                await eventLogCollection.insertOne({eventName: "withdrawal", arguments: {accountId: accountId, amount: withdrawal}});
                return await transactionsCollection.insertOne({accountId: accountId, amount: withdrawalAmount * -1});
            } catch (error) {
                console.log(error);
                throw error;
            } finally {
                await client.close();
            } 
        };
    }
}
