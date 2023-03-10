const { default: axios } = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require('graphql');

//Hardcoded data
// const customers = [
//     {id:'1', name:'John Doe', email:'John@naver.com', age:34},
//     {id:'2', name:'Sarah Will', email:'Sarah@naver.com', age:39},
//     {id:'3', name:'Steve Smith', email:'Steve@naver.com', age:44}
// ]

//고객 테이블 정의
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: {type:GraphQLString},
        name: {type:GraphQLString},
        email: {type:GraphQLString},
        age: {type:GraphQLInt}
    })
});

//요청시 결과를 생성할 graphql 함수
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        customer: {
            type:CustomerType,
            args: {
                id: {type:GraphQLString}
            },
            resolve(parentValue, args){
                
                // for(let i = 0; i < customers.length; i++){
                //     if(customers[i].id == args.id){
                //         return customers[i];
                //     }
                // }
                return axios.get(`http://localhost:3456/customers/${args.id}`)
                .then(res => res.data);
            },
            inputSample: {
                // {
                //     customer(id:"3"){
                //       name,
                //       email,
                //       age
                //     }
                //   }
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3456/customers`)
                    .then(res => res.data);
            },
            inputSample: {
                // {
                //     customers{
                //       id
                //     }
                //   }
            }
        }
    }
});

// Mutation
const mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields: {
        addCustomer : {
            type: CustomerType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3456/customers', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                .then(res => res.data);
            }
        },
        deleteCustomer : {
            type: CustomerType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete(`http://localhost:3456/customers/${args.id}`)
                .then(res => res.data);
            }
        },
        editCustomer : {
            type: CustomerType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3456/customers/${args.id}`, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery, mutation
});