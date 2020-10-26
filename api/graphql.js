var { buildSchema } = require('graphql');
var User = require('./User');

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

var schema = buildSchema(`
  type User {
    fullName: String
    countryName: String
  }

  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
    getUserByIdWithCountry(id: ID!): User
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
  rollDice: (args) => {
    var output = [];
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  },
  getUserByIdWithCountry: async function({id})
  {
    let res = {fullName: null, countryName: null};

    console.log("getUserByIdWithCountry(): id =", id);
    const user = await User.selectByIdWithCountry(id);
    if (user !== undefined)
    {
      console.log("getUserByIdWithCountry(): user =", user);
      res.fullName = user.fullname;
      res.countryName = user.country_name;
    }
    else
    {
      console.log("getUserByIdWithCountry(): no user");
    }

    return res;
  },
};

module.exports = {schema, root};
