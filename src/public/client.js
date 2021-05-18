let store = Immutable.Map({
	// apod: Immutable.Map({}),
	user: Immutable.Map({ name: "Richard" }),
	roverInfo: Immutable.Map({}),
	selectedRover: "Spirit",
	rovers: Immutable.List(["Spirit", "Opportunity", "Curiosity"]),
})

// add our markup to the page
const root = document.getElementById("root")

const updateStore = (store, newState) => {
	const updatedStore = store.mergeDeep(newState)
	render(root, updatedStore)
}

const render = async (root, state) => {
	root.innerHTML = App(state)
}

//------------------COMPONENTS

//Navigation Component
const Navigation = (state) => {
	const rovers = state.get("rovers")
	return `
		<header>
					<div class="tab">
					${rovers
						.map((rover) => {
							return `<button class="tablinks" onClick="getRover(store, '${rover}')">${rover}</button>`
						})
						.join("")}
					</div>
				</header>
	`
}

// RoverInfo component
const RoverInfo = (roverInfo) => {
	if (roverInfo.isEmpty()) {
		return `<p>Loading...</p>`
	}
	return `
	<section>
		<img src=""/>
	</section>
		<section>
      <h3>${roverInfo.get("name")}</h3>
                <p>Landing Date: ${roverInfo.get("landing_date")}</p>
                <p>Launch Date: ${roverInfo.get("launch_date")}</p>
								<p>Status: ${roverInfo.get("status")}</p>
								<p>Total Images: ${roverInfo.get("total_photos")}</p>
            </section>
	`
}

//Main component
const HomePage = (state) => {
	// const roverInfo = state.get("roverInfo")
	return `
		<main>
						${Greeting(state.get("user").get("name"))}
						${RoverInfo(state.get("roverInfo"))}      
        </main>
	`
}

//Page Component
//Higher Order Function
const Layout = (state, header, main) => {
	return `
		${header(state)}
		${main(state)}
		<footer>Built by Richard</footer>
	`
}

// App Content
const App = (state) => {
	return `
				${Layout(state, Navigation, HomePage)}
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
	getRover(store, store.get("selectedRover"))
	render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
	if (name) {
		return `
            <h1>Welcome, ${name}!</h1>
        `
	}
	return `
        <h1>Hello!</h1>
    `
}

// ------------------------------------------------------  API CALLS

// Example API call
// get Rover information api call
const getRover = (state, rover) => {
	fetch(`http://localhost:3000/rover/${rover}`)
		.then((res) => res.json())
		.then((roverInformation) =>
			// console.log("rover:", roverInformation.rover)
			updateStore(state, {
				selectedRover: rover,
				roverInfo: Immutable.Map(roverInformation.rover),
			})
		)
	getRoverImages(state, rover)
}

const getRoverImages = (state, rover) => {
	fetch(`http://localhost:3000/rover/images/${rover}`)
		.then((res) => res.json())
		.then((roverImages) =>
			updateStore(state, {
				roverImages: Immutable.List(roverImages.photos),
			})
		)
}
// const getImageOfTheDay = (state) => {
// 	fetch(`http://localhost:3000/apod`)
// 		.then((res) => res.json())
// 		.then((apod) => updateStore(state, { apod: Immutable.Map(apod) }))
// }
