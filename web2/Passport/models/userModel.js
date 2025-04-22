const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
  },
];

const userModel = {
  findOne: ({ email }) => {
    return database.find((user) => user.email === email) || null;
  },  
  findById: (id) => {
    return database.find((user) => user.id == id) || null;
  }};  

module.exports = { database, userModel };
