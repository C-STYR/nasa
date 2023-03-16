const path = require("path");
const { parse } = require("csv-parse");
const fs = require("fs");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

const habitablePlanets = [];

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
      .on("data", (planet) => {
        if (isHabitablePlanet(planet)) habitablePlanets.push(planet);
      })
      .on("error", (err) => {
        console.log(err);
        reject(er);
      })
      .on("end", () => {
        console.log(
          "number of habitable planets found:",
          habitablePlanets.length
        );
        resolve();
      });
  });
}

module.exports = {
  loadPlanetsData,
  planets: habitablePlanets,
};
