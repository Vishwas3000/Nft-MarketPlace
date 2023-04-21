const axios = require("axios")

let value = 21

axios
    .post("http://localhost:3001/call", value.toString())
    .then((res) => {
        console.log("Respond: ", res.data)
    })
    .catch((error) => {
        console.log(error)
    })
