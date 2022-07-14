module.exports = function(){
    const faker = require("faker");
    const _ = require("lodash");
    return {
        people: _.time(100, function (n){
    return{
        id: navigator,
        name: faker.name.findName(),
        avatar: faker.internet.avatar()
    }
})
    }
}