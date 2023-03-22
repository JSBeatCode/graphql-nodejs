const { default: axios } = require('axios');

const graphql = require('graphql');

// 고객 테이블 정의
const ItemType = new graphql.GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        price: { type: graphql.GraphQLInt }
    })
});

//요청시 결과를 생성할 graphql 함수
//RootQuery는 GraphiQL 웹에서 송수신할때에 중괄호 '{}'로 시작하며
//'{}' 안의 내용이, fields 값이 아래의 items 이나 item과 둘 중 매치가 되면 그 하나를 읽고 resolve를 호출
const RootQuery  = new graphql.GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        item: {
            type: ItemType,
            args: {
                id: { type: graphql.GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`http://localhost:3456/items/${args.id}`)
                    .then(response => response.data);
            }
        },
        items: {
            type: new graphql.GraphQLList(ItemType),
            resolve(parent, args) {
                return axios.get(`http://localhost:3456/items`)
                    .then(response => response.data);
            }
        }
    }
});


// Mutation
// mutation은 GraphiQL 웹페이지에서 'mutation {}' 이런 식을 통해 호출
const mutation = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        add: {
            type: ItemType,
            args: {
                name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
                price: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
            },
            resolve(parent, args) {
                return axios.post(`http://localhost:3456/items`, {
                    name: args.name,
                    price: args.price
                }).then(response => response.data);
            },
        },
        edit: {
            type: ItemType,
            args: { 
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
                name: { type: graphql.GraphQLString },
                price: { type: graphql.GraphQLInt }
            },
            resolve(parent, args) {
                return axios.patch(`http://localhost:3456/items/${args.id}`, args)
                .then(response => response.data);
            }
        },
        del: {
            type: ItemType,
            args: { 
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
            },
            resolve(parent, args) {
                return axios.delete(`http://localhost:3456/items/${args.id}`)
                .then(response => response.data);
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    // query에 보낼 변수 하나로 묶어서...
    query: RootQuery,
    mutation: mutation
});
