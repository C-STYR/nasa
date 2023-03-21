const path = require("path");
const { parse } = require("csv-parse");
const fs = require("fs");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (planet) => {
        if (isHabitablePlanet(planet)) {
          // intial write of planet to MongoDB
          savePlanet(planet);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(er);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log("number of habitable planets found:", countPlanetsFound);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, {
    '_id': 0, '__v': 0
  });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      // first object is the filter: we're selecting a doc mathcing this object
      {
        keplerName: planet.kepler_name,
      },
      // second object is the update: we're replacing the following properties
      {
        keplerName: planet.kepler_name,
      },
      // if true and no matching doc found, create one with the update object
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
