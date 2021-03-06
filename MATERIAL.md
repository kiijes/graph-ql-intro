# GraphQL

## [1 Mikä ihmeen GraphQL?](#1)
## [2 GraphQL-skeema](#2)
### [> 2.1 Skeeman kielioppi](#21)
### [> 2.2 Juurioperaatiotyypit](#22)
### [> > 2.2.1 Query-tyyppi](#221)
### [> > 2.2.2 Mutation-tyyppi](#222)
## [3 Resolver](#3)
## [4 Kyselyt](#4)
## [5 Tehtävät](#4)

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
    viestitKayttajalta(_id: ID!): [Viesti]
}

type Viesti {
    _id: ID!
    lahettaja: ID!
    lahettajanNimi: String
    sisalto: String
}
```

`Henkilo` ja `Viesti` ovat tässä tapauksessa GraphQL-objektityyppejä. Niiden sisällä on kenttiä, jotka määrittävät sen, mitä ja millaista tietoa niistä on mahdollista kysellä. `Viesti`-objekti sisältää neljä kenttää: `_id`, joka palauttaa viestin yksilöllisen ID:n (tässä tapauksessa MongoDB:n ObjectID:n); `lahettaja`, joka palauttaa `Henkilo`-tyypin mukaista dataa; `lahettajanNimi`, joka palauttaa merkkijonon; ja `sisalto`, joka palauttaa `String`-tyypin mukaista dataa. `_id`- ja `lahettaja`-kenttien tyyppien perään on laitettu huutomerkki. `!` merkitsee sitä, että kyseinen kenttä ei voi olla `null`. GraphQL-palvelu lupaa siis antaa sille aina jonkin arvon. `Henkilo`-objektin `viestit`-kentän tyyppi on taasen laitettu hakasulkeisiin: se tarkoittaa sitä, että `viestit`-kenttään asetetaan `Viesti`-objekteja sisältävä taulukko.

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

Mutation-tyypin sisälle on määriteltävä tietoa muokkaavat kyselyt. Jos haluaisimme määritellä kyselyn, joka lisää tietokantaan tietyn ikäisen ja nimisen henkilön, voisimme määritellä sen skeeman sisälle näin:

```
type Mutation {
    lisaaHenkilo(nimi: String!, ika: Int!): Henkilo
}
```

`lisaaHenkilo`-kysely ottaa vastaan parametrit nimi ja ika, jotka ovat tyypiltään String ja Int.

Voisimme määrittää Mutation-tyypin sisälle vielä kutsun lisaaViesti, jolla voisimme lisätä tietokantaan viestin, jolla on lähettäjä, vastaanottaja ja sisältö:

```
lisaaViesti(lahettaja: String!, vastaanottaja: String!, sisalto: String): Viesti
```

<a id='3'></a>
## 3 Resolver

Resolver vastaa skeemassa määriteltyjen kyselyiden toteutuksesta. Sen toteutus määrää sen, mitä palautetaan. Monet GraphQL-kirjastot eivät vaadi kaikkien kenttien palautuksen määrittelemistä erikseen: ne olettavat, että mikäli jollekin kentälle ei ole luotu toteutusta resolveriin, tulee haetusta oliosta etsiä ja palauttaa ominaisuus, jonka nimi vastaa kentän nimeä.

Apollo Serverillä rakennetussa GraphQL-rajapinnassa resolver on funktiokokoelma, jota kutsutaan resolver mapiksi. Tällainen resolver voisi näyttää tältä:

```
const resolvers = {
    // Query-juurityypin alla olevien kyselyiden toteutus
    Query: {
        henkilo(root, args) {
            return HenkiloModel.findById(args._id);
        },
        henkilot() {
            return HenkiloModel.find().sort({ _id: '-1' });
        },
        viesti(root, args) {
            return ViestiModel.findById(args._id);
        }
    },

    // Henkilo-objektin kenttien palautuksien toteutus
    Henkilo: {
        viestit(henkilo) {
            return henkilo.viestit;
        },

        viestitKayttajalta(root, args) {
            let resultArray = [];
            root.viestit.forEach(viesti => viesti.lahettaja === args._id ? resultArray.push(viesti) : null);
            return resultArray;
        }
    },

    // Viesti-objektin kenttien palautuksien toteutus
    Viesti: {
        async lahettajanNimi(viesti) {
            let henkilo = await HenkiloModel.findById(viesti.lahettaja);
            return henkilo.nimi;
        }
    },

    // Mutaatioiden toteutus
    Mutation: {
        async lisaaHenkilo(root, args) {
            return await HenkiloModel.create(args);
        },
        async lisaaViesti(root, args) {
            let henkilo = await HenkiloModel.findById(args.vastaanottaja);
            let viesti = new ViestiModel({ lahettaja: args.lahettaja, sisalto: args.sisalto });
            henkilo.viestit.push(viesti);
            let result = await henkilo.save();
            return result.viestit[result.viestit.length - 1];
        }
    }
    
}
```

Tässä resolverissa on toteutettu kyselyitä, joiden määritelmiä en esitellyt aiemmin, joten älä huolestu, jos et tunnista esim. `Query.viesti`-metodia. 

Resolver-funktio ottaa vastaan neljä parametriä: `parent` (yllä olevassa resolverissa käytetty sanaa `root`), `args`, `context` ja `info`. Näistä `parent` ja `args` ovat meille hyödyllisimmät tällä hetkellä. `parent` on objekti, joka sisältää ylemmän tason resolverin palauttaman tuloksen. `Query`-tasolla se on palvelimen palauttama `rootValue`, mutta esim. `Henkilo.viestit(henkilo)`-metodissa parametri `henkilo` on juurikin `Query.henkilo`-metodin palauttama Henkilo-olio. `args` taasen on nimensä mukaisesti GraphQL-kyselylle annetut argumentit.

`HenkiloModel` ja `ViestiModel` ovat tässä tapauksessa Mongoose-malleja, joilla haetaan dataa. Huomaa, että Viesti-objektille on toteutettu lahettajanNimi-query, mikä etsii tiettyä Henkilöä tietokannasta ID:n perusteella ja palauttaa tämän nimen. Viesti-objektin skeemassa ei ole määritelmää lähettäjän nimelle, mutta tälle kyselylle on määritelmä. Näin voidaan toteuttaa relaatiota.

\- [GraphQL:n opetusmateriaalia kyselyiden toteuttamisesta](https://graphql.org/learn/execution/)

\- [Apollo Serverin resolverin dokumentaatiota](https://www.apollographql.com/docs/apollo-server/data/data/)

<a id='4'></a>
## 4 Kyselyt

Minkälainen kysely GraphQL-rajapinnalle sitten pitää lähettää, jotta jotain palautuu? Kyselyoperaatioille on hyvä tapa ensin antaa tyyppi ja nimi ennen varsinaisten kyselyiden kutsumista. Se mahdollistaa myös esim. vaihtelevien muuttujien käytön kutsuissa.

Mutation-kutsu lisaaViesti-kyselylle voisi näyttää tältä:

```
mutation sendMessage($sender: String!, $recipient: String!, $msg: String) {
    lisaaViesti(lahettaja: $sender, vastaanottaja: $recipient, sisalto: $msg) {
        lahettaja
        sisalto
    }
}
```

`mutation sendMessage(...)` määrittää kutsullemme operaation tyypin, nimen ja muuttujat. Muuttujien nimet alkavat $-merkillä, ja niille on annettu tyypit, jotka kutsun määritelmässä on määritelty. **Näiden on täsmättävä**, tai muuten kutsu epäonnistuu.

Operaation esittelyn jälkeen tulee itse kutsu `lisaaViesti(...)`, johon on annettu parametreille `lahettaja`, `vastaanottaja` ja `sisalto` argumentit `$sender`, `$recipient` ja `$msg`. Huomaa, että parametrien nimet täsmäävät niiden kanssa, jotka määriteltiin skeemaan Mutation-tyypin sisällä olevaan kutsuun lisaaViesti. Lisäksi, jos katsomme lisaaViesti-kyselyn toteutusta resolverissa, näemme, että args-objekti sisältää nämä attribuutit. Argumentit taasen ovat nimeltään samat, kuin `sendMessage(...)`-operaatioon määriteltiin.

`lisaaViesti(...)`-kutsun sisälle on kirjoitettu `lahettaja` ja `sisalto`. Jos katsomme Viesti-objektityyppiä, huomaamme, että sieltä löytyvät nämä attribuutit. Huomaamme myös `lisaaViesti`-mutaation määrittelystä, että se palauttaa Viesti-tyypin objektin. Voimme siis ottaa kutsusta vastaan viestin, jonka olemme juuri lisänneet tietokantaan.

\- [GraphQL-queryjen perusteita](https://graphql.org/learn/queries/)

\- [Apollo Clientin ohjeet queryjen tekemiseen Angularissa](https://www.apollographql.com/docs/angular/basics/queries/)

***

<a id='5'></a>
## 5 Tehtävät

Tehtävien tekeminen vaatii:
- Node.js + npm
- MongoDB
- Angular, Apollo, Express jne. (nämä asennetaan npm:n avulla)

Ohjeet tehtävien tekemiseen:

1. Kloonaa tai lataa tämä repositorio.
2. Asenna Node.js + npm. Asenna myös MongoDB, jos haluat, että tietokanta on koneellasi lokaalisti.

   **HUOM!** Jos käytät jotakin ulkoista palvelua MongoDB:tä varten (esim. mLab), sinun täytyy muokata `index.js`-tiedostossa Mongoose.connectin käyttämää URLia vastaamaan omaa tietokantaosoitettasi.
   
3. Aja komento `npm install` projektin [`demo`](./demo)- ja [`demo/ang-front`](./demo/ang-front)-kansioissa  riippuvaisuuksien asentamiseksi.
4. Käynnistä MongoDB-tietokanta.
5. Käynnistä backend ajamalla `node index.js` -komento [`demo`](./demo)-kansiossa.
6. Käynnistä frontend ajamalla `ng serve -o` -komento [`demo/ang-front`](./demo/ang-front)-kansiossa.

***

### **Tehtävä 1.**

Muokkaa demosovellusta siten, että viestin tiedoissa on myös aikaleima. Muokkaa siis Viestin Mongoose-skeemaa siten, että viestiin tallennetaan aikaleima, ja GraphQL-skeemaa siten, että aikaleima palautuu. Lisäksi muokkaa GraphQL:n palautusta siten, että GraphQL palauttaa aikaleiman sovellukselle muotoiltuna merkkijonona, muodossa "PP.KK.VV klo TT:MM" (esim. 25.11.2019 klo 14:00). **Vinkki:** resolver. Muista muokata myös Angular-fronttia siten, että aikaleima haetaan ja näytetään sovelluksessa.

Lopputulos voisi näyttää [tältä.](./img/example.png)