# GraphQL

## [1 Mikä ihmeen GraphQL?](#1)
## [2 GraphQL-skeema](#2)
### [> 2.1 Skeeman kielioppi](#21)
### [> 2.2 Juuripoeraatiotyypit](#22)
### [> > 2.2.1 Query-tyyppi](#221)
### [> > 2.2.2 Mutation-tyyppi](#222)
## [3 Resolver](#3)

<a id='1'></a>
## 1 Mikä ihmeen GraphQL?

GraphQL on kyselykieli, jota voidaan käyttää palvelimella rajapinnan toteuttamiseen. Se sisältää myös ajonaikaisia toimintoja kyselyihin vastaamiseen palvelimella. Siinä missä RESTillä on monta endpointtia, riippuen mitä palvelimelta halutaan kutsua, GraphQL:llä niitä on vain yksi. Siinä mielessä se saattaa olla yksinkertaisempi asiakassovelluksen kehittäjän kannalta – kyselyillä on vain yksi osoite, ja mitä tietoa haetaan riippuu siitä, minkälaisen kyselyn kirjoitat. Kyselyn tyyli on kuin JSON-notaatio ilman lainausmerkkejä tai kaksoispisteitä; kirjoitat ikään kuin objektin ja kentät, joita siltä haluat. Palvelinpuolella kyselyiden toteutus tehdään GraphQL-skeeman ja nk. resolverin avulla.

GraphQL:ssä haettavaa tietoa siis määritellään kyselyillä eikä endpointilla, lisäksi kyselykielessä on mukavia käytäntöjä, jotka helpottavat tai monipuolistavat kyselyiden toiminnallisuutta. Asiakkaalla on siis enemmän valtaa päättää siitä, mitä tietoa palautetaan. REST-rajapinnoissa palvelimen toteutus endpointtien suhteen monesti määrää sen, mitä tietoa asiakkaalle palautetaan. Tätä tietoa joudutaan monesti asiakkaan puolella muokkaamaan ja karsimaan, jotta jäljelle jää olennainen.

\- [GraphQL vs. REST](https://blog.apollographql.com/graphql-vs-rest-5d425123e34b)

<a id='2'></a>
## 2 GraphQL-skeema

GraphQL-skeema on yksi GraphQL-rajapinnan olennaisimmista osista. Skeema määrittää sen, mitä tietoa rajapinnalta on haettavissa ja minkälaisia kyselyitä sillä voi tehdä. Näiden määritelmien pohjalta luodaan kyselyiden toteutus resolveriin. 

\- [Oppimateriaalia skeemoihin ja tyyppeihin GraphQL:n sivulla](https://graphql.org/learn/schema/)

<a id='21'></a>
### 2.1 Skeeman kielioppi

GraphQL-skeemakieli muistuttaa syntaksiltaan JSONia ilman lainausmerkkejä tai pilkkuja. Tältä voisi näyttää Henkilö- ja Viesti-tyyppien määritelmät GraphQL-skeemassa:

```
type Henkilo {
    _id: ID!
    nimi: String!
    ika: Int
    viestit: [Viesti]
}

type Viesti {
    lahettaja: Henkilo!
    sisalto: String
}
```

`Henkilo` ja `Viesti` ovat tässä tapauksessa GraphQL-objektityyppejä. Niiden sisällä on kenttiä, jotka määrittävät sen, mitä ja millaista tietoa niistä on mahdollista kysellä. `Viesti`-objekti sisältää kaksi kenttää: `lahettaja`, joka palauttaa `Henkilo`-tyypin mukaista dataa, ja `sisalto`, joka palauttaa `String`-tyypin mukaista dataa. `lahettaja`-kentän tyypin perään on laitettu huutomerkki. `!` merkitsee sitä, että kyseinen kenttä ei voi olla `null`. GraphQL-palvelu lupaa siis antaa sille aina jonkin arvon. `Henkilo`-objektin `viestit`-kentän tyyppi on taasen laitettu hakasulkeisiin: se tarkoittaa sitä, että `viestit`-kenttään asetetaan `Viesti`-objekteja sisältävä taulukko.

`String` on yksi GraphQL:n valmiista nk. skalaarityypeistä. `String` palauttaa UTF-8-merkkijonon. Muita valmiita tyyppejä ja niiden palautuksia ovat:
- `Int`: 32-bittinen etumerkillinen kokonaisluku
- `Float`: Etumerkillinen double-precision liukuluku
- `Boolean`: true tai false
- `ID`: edustaa uniikkia tunnistetta, serialisoidaan samalla tavalla kuin `String`

Skalaarityyppejä voi määritellä myös itse, mutta siihen ei tässä työssä kiinnitetä huomiota.

<a id='22'></a>
### 2.2 Juurioperaatiotyypit

GraphQL-skeema sisältää valmiiksi Query-, Mutation- ja Subscription-juurioperaatiotyypit, joidenka sisälle luodaan määritelmät mahdollisille kyselyille. Tässä oppimateriaalissa käsitellään vain Query- ja Mutation-tyyppejä.

\- [GraphQL-spesifikaation juurityyppiosio](https://graphql.github.io/graphql-spec/draft/#sec-Root-Operation-Types)

<a id='221'></a>
#### 2.2.1 Query-tyyppi

Query-tyypin sisälle on määriteltävä tietoa palauttavat kyselyt. Jos haluaisimme määritellä kyselyn, joka palauttaa jonkun tietyn henkilön hänen ID:nsä perusteella, voisimme määritellä sen skeeman sisälle näin:

```
type Query {
    henkilo(_id: String!): Henkilo
}
```

`henkilo`-kysely ottaa vastaan parametrin _id, jonka tulee olla tyyppiä `String`. Resolveriin tehtävä toteutus voi nyt hyödyntää kyselylle annettua argumenttia.

<a id='222'></a>
#### 2.2.2 Mutation-tyyppi

// TODO

<a id='3'></a>
## 3 Resolver

// TODO