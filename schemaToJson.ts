import { parse, buildASTSchema, GraphQLObjectType, GraphQLSchema, GraphQLNamedType } from 'graphql';

// Example Schema
const schemaString = `
type University {
    universityId: ID!
    studentId: ID!
    uniName: String!
}

type Query {
    getUniversity(universityId: ID!, studentId: ID!): University
}

type Mutation {
    createUniversity(universityId: ID!, studentId: ID!, uniName: String!): University
}

schema {
    query: Query
    mutation: Mutation
}
`;

const ast = parse(schemaString);
const schema = buildASTSchema(ast);

const schemaToJson = (schema: GraphQLSchema) => {
    const typeMap = schema.getTypeMap();
    const result: Record<string, any> = {};

    for (const typeName in typeMap) {
        if (typeName.startsWith("__")) continue;

        const type: GraphQLNamedType = typeMap[typeName];

        if (type instanceof GraphQLObjectType) {
            const fields = type.getFields();
            result[typeName] = {
                kind: type.astNode?.kind,
                fields: Object.fromEntries(
                    Object.entries(fields).map(([fieldName, field]) => [
                        fieldName,
                        {
                            type: field.type.toString(),
                            args: field.args.map(arg => ({
                                name: arg.name,
                                type: arg.type.toString(),
                            })),
                        },
                    ])
                ),
            };
        } else {
            result[typeName] = {
                kind: type.astNode?.kind || type.constructor.name,
                description: type.description,
            };
        }
    }
    return result;
};

const jsonSchema = schemaToJson(schema);
console.log(JSON.stringify(jsonSchema, null, 2));
