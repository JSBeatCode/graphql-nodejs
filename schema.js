const { default: axios } = require('axios');

const graphql = require('graphql');

//Hardcoded data
// const items = [
//     {id:'1', name:'John Doe', email:'John@naver.com', price:34},
//     {id:'2', name:'Sarah Will', email:'Sarah@naver.com', price:39},
//     {id:'3', name:'Steve Smith', email:'Steve@naver.com', price:44}
// ]

//고객 테이블 정의
const ItemType = new graphql.GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        id: {type:graphql.GraphQLString},
        name: {type:graphql.GraphQLString},
        price: {type:graphql.GraphQLInt}
    })
});

//요청시 결과를 생성할 graphql 함수
//RootQuery는 GraphiQL 웹 페이지에서 송수신 query를 중괄호 '{}'로 시작.
//'{}' 안의 내용이, fields 값 items이나 item과 둘 중 매치가 되면 그 하나를 읽어서 아래의 resolve 메소드를 호출함.
const RootSelectOneQuery = new graphql.GraphQLObjectType({
    name:'RootQuerySelectOneType',
    fields: {
        item: {
            type:ItemType,
            args: {
                id: {type:graphql.GraphQLString}
            },
            resolve(parentValue, args){
                return axios.get(`http://localhost:3456/items/${args.id}`)
                .then(res => res.data);
            },
        }
    }
});

const RootSelectAllQuery = new graphql.GraphQLObjectType({
    name:'RootSelectAllQueryType',
    fields: {
        items: {
            type: new graphql.GraphQLList(ItemType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3456/items`)
                    .then(res => res.data);
            }
        }
    }
});

// Mutation
// mutation은 GraphiQL 웹 페이지에서 'mutation{}'
const mutation = new graphql.GraphQLObjectType({
    name : 'mutation',
    fields: {
        add : {
            type: ItemType,
            args:{
                name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
                price: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3456/items', {
                    name: args.name,
                    price: args.price
                })
                .then(res => res.data);
            }
        },
        edit : {
            type: ItemType,
            args:{
                id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
                name: {type: graphql.GraphQLString},
                price: {type: graphql.GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3456/items/${args.id}`, args)
                .then(res => res.data);
            }
        },
        del : {
            type: ItemType,
            args:{
                id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete(`http://localhost:3456/items/${args.id}`)
                .then(res => res.data);
            }
        }
    }
});


module.exports = new graphql.GraphQLSchema({
    query: RootSelectAllQuery, RootSelectOneQuery, mutation
});
