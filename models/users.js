import pkg from "pg";
const {Client} = pkg;

const schema = new Client.Schema({
    user: {
    email: String,
    name: String,
    },
});

export const User = Client.model("User",schema);