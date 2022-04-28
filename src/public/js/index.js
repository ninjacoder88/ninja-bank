jQuery(function(){
    "use strict";

    function Account(obj){
        const self = this;
        self.accountId = obj._id;
        self.accountName = obj.accountName;
        self.accountBalance = ko.observable(obj.accountBalance);
        self.transactions = ko.observableArray([]);

        function initialize(){
            if(!obj.transactions){
                return;
            }

            obj.transactions.forEach(transaction => {
                self.transactions.push(transaction);
            });
        }

        initialize();
    };

    function Customer(obj){
        const self = this;
        self.customerId = obj._id;
        self.customerName = obj.customerName;
        self.accounts = ko.observableArray([]);

        self.createAccount = function(){
            $.ajax({
                method: "POST",
                url: "/accounts",
                data: JSON.stringify({customerId: self.customerId}),
                contentType: "application/json"
            }).done(function(account){
                self.accounts.push(new Account(account));
            }).fail(function(jqXHR, textStatus, errorThrown){
                console.error({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
            });
        };

        function initialize(){
            if(!obj.accounts){
                return;
            }

            obj.accounts.forEach(account => {
                self.accounts.push(new Account(account));
            });
        }

        initialize();
    };

    function ViewModel(){
        const self = this;
        self.transactions = ko.observableArray([]);
        self.accounts = ko.observableArray([]);
        self.customers = ko.observableArray([]);

        function getCustomers(){
            $.ajax({
                method: "GET",
                url: "/customers"
            }).done(function(customers){
                customers.forEach(c => {
                    self.customers.push(new Customer(c));
                });
            }).fail(function(jqXHR, textStatus, errorThrown){
                console.error({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
            });
        }

        function getAccounts(){
            $.ajax({
                method: "GET",
                url: "/accounts"
            }).done(accounts => {
                self.accounts(accounts);
            }).fail(function(jqXHR, textStatus, errorThrown){
                console.error({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
            });
        }

        function getTransactions(){
            $.ajax({
                method: "GET",
                url: "/transactions"
            }).done(transactions => {
                self.transactions(transactions);
            }).fail(function(jqXHR, textStatus, errorThrown){
                console.error({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
            });
        }

        self.createCustomer = function(){
            $.ajax({
                method: "POST",
                url: "/customers"
            }).done(function(customer){
                self.customers.push(new Customer(customer));
            }).fail(function(jqXHR, textStatus, errorThrown){
                console.error({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
            });
        };

        self.createTransaction = function(){
            $.ajax({
                method: "POST",
                url: "/transactions"
            }).done(function(response){
                console.log(response);
            }).fail(function(jqXHR, textStatus, errorThrown){
                console.error({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
            });
        };

        getCustomers();
        getTransactions();
    };

    ko.applyBindings(new ViewModel(), document.getElementById("application"));
});