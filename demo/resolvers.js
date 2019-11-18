const { HenkiloModel, ViestiModel } = require('./mongoose/models');

const resolvers = {
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

    Viesti: {
        async lahettajanNimi(viesti) {
            let henkilo = await HenkiloModel.findById(viesti.lahettaja);
            return henkilo.nimi;
        }
    },

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

module.exports = resolvers;