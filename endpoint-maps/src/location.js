const fs = require("fs");
const csv = require("csv-parser");

let locations = [];

function loadLocationsFromCSV() {
  fs.createReadStream("data/data.csv")
    .pipe(csv())
    .on("data", (row) => {
      const { Place_Id, Place_Name, Description, City, Price, Rating, Alamat } = row;
      locations.push({
        id: Place_Id,
        name: Place_Name,
        description: Description,
        city: City,
        price: parseInt(Price),
        rating: parseFloat(Rating),
        address: Alamat,
        comentar: "",
      });
    })
    .on("end", () => {
      console.log("CSV file terinisiasi");
    });
}

loadLocationsFromCSV();

module.exports = locations;
