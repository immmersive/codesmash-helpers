// Example JSON
const jsonSchema = {
    University: {
        kind: "ObjectTypeDefinition",
        fields: {
            universityId: { type: "ID!", args: [] },
            studentId: { type: "ID!", args: [] },
            uniName: { type: "String!", args: [] },
        },
    },
    Query: {
        kind: "ObjectTypeDefinition",
        fields: {
            getUniversity: {
                type: "University",
                args: [
                    { name: "universityId", type: "ID!" },
                    { name: "studentId", type: "ID!" },
                ],
            },
        },
    },
    Mutation: {
        kind: "ObjectTypeDefinition",
        fields: {
            createUniversity: {
                type: "University",
                args: [
                    { name: "universityId", type: "ID!" },
                    { name: "studentId", type: "ID!" },
                    { name: "uniName", type: "String!" },
                ],
            },
        },
    },
};

type JsonField = {
  type: string;
  args: { name: string; type: string }[];
};

type JsonType = {
  kind: string;
  fields: Record<string, JsonField>;
};

type JsonSchema = Record<string, JsonType>;


const jsonToSchema = (jsonSchema: JsonSchema): string => {
  const typeDefinitions: string[] = [];
  const schemaDefinitions: string[] = [];

  for (const [typeName, typeDef] of Object.entries(jsonSchema)) {
    if (typeDef.kind === "ObjectTypeDefinition") {
      const fields = Object.entries(typeDef.fields)
        .map(([fieldName, fieldDef]) => {
          const args = fieldDef.args
            .map((arg) => `${arg.name}: ${arg.type}`)
            .join(", ");
          return args
            ? `${fieldName}(${args}): ${fieldDef.type}`
            : `${fieldName}: ${fieldDef.type}`;
        })
        .join("\n  ");
      typeDefinitions.push(`type ${typeName} {\n  ${fields}\n}`);
    }
  }

  if (jsonSchema.Query) schemaDefinitions.push("query: Query");
  if (jsonSchema.Mutation) schemaDefinitions.push("mutation: Mutation");

  const schemaBlock = schemaDefinitions.length
    ? `schema {\n  ${schemaDefinitions.join("\n  ")}\n}`
    : "";

  return [...typeDefinitions, schemaBlock].join("\n\n").trim();
};


const schemaString = jsonToSchema(jsonSchema);
console.log(schemaString);
