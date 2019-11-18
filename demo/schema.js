const schema = `
type Query {
    henkilo(_id: String!): Henkilo
    henkilot: [Henkilo]
    viesti(_id: String!): Viesti
    viestit: [Viesti]
}

type Henkilo {
    _id: ID!
    nimi: String!
    ika: Int!
    viestit: [Viesti]
    viestitKayttajalta(_id: ID!): [Viesti]
}

type Viesti {
    _id: ID!
    lahettaja: ID!
    lahettajanNimi: String
    sisalto: String
}

type Mutation {
    lisaaHenkilo(nimi: String!, ika: Int!): Henkilo
    lisaaViesti(lahettaja: String!, vastaanottaja: String!, sisalto: String): Viesti
}`;

module.exports = schema;