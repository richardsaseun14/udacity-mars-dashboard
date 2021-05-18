require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const fetch = require("node-fetch")
const path = require("path")

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/", express.static(path.join(__dirname, "../public")))

// your API calls

// Get Rover Info call
app.get("/rover/:roverName", async (req, res) => {
	let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.roverName.toLowerCase()}/`

	try {
		let rover = await fetch(`${url}?api_key=${process.env.API_KEY}`).then((res) => {
			console.log("res", res)
			res.json()
		})
		// console.error("fetch rover info")
		res.send(rover)
	} catch (err) {
		console.error("error:", err)
	}
})

// Get Latest Rover Images call
app.get("/rover/images/:roverName", async (req, res) => {
	// let today = new Date()
	// let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
	let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.roverName.toLowerCase()}/latest_photos`
	try {
		let { latest_photos: photos } = await fetch(`${url}&api_key=${process.env.API_KEY}`).then((res) => res.json())
		res.send(photos)
		console.error("fetch rover images", photos)
	} catch (err) {
		console.error("error:", err)
	}
})

app.get("/apod", async (req, res) => {
	let url = "https://api.nasa.gov/planetary/"

	try {
		let image = await fetch(`${url}apod?api_key=${process.env.API_KEY}`).then((res) => res.json())
		console.error("fetch apod image")
		res.send({ image })
	} catch (err) {
		console.log("error:", err)
	}
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
