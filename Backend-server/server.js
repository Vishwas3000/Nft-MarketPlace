const express = require("express")
const app = express()

const { call } = require("./function")

let people = [
    {
        name: "Hannah Rickard",
        number: "06-51-99-56-83",
        id: 1,
    },
    {
        name: "Hyun Namkoong",
        number: "10987654",
        id: 2,
    },
    {
        name: "Courtney Martinez",
        number: "3691215",
        id: 3,
    },
]

app.post("/call", async (request, res) => {
    try {
        console.log("call", request.body)
        const value = request
        const response = await call(value)
        res.json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong" })
    }
})

app.get("/", (request, response) => {
    response.send("<h1>Phonebook</h1>")
})

app.get("/api/people", (request, response) => {
    response.json(people)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
