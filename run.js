// import axios for web api calls and fs for file writing.
const axios = require("axios");
const fs = require("fs");

//init URL as a constant to use and concatenate planet#s onto the end of later.
const getPlanetCountUrl = "https://swapi.dev/api/planets/";

//init planetCount to 0 until retrieved from API.
let planetCount = 0;

/**Logical Workflow
 * 
 * Call the main url to retrieve the Count amount.
 * Once the count amount is retrieved, plug that value into the async function callAndConcatenatePlanetInfo to call
 * individual planets and iterate up, checking each planet until it reaches the count (last planet).
 * Each planet that is checked and has ample information has the relevant information extracted from the
 * api, concatenated into a csv formatted string, and saved into the same directory of the script as a csv file.
 */


//this function is used to call for an individual planet's info and check it for validity. It takes in the main url and the total count of planets
// to iterate through, provided by the below API call.
async function callAndConcatenatePlanetInfo(getPlanetCountUrl,planetCount){
  //init csv to concatenate values to.
  let csv ="";

  //init some headers and add them to the top of the csv file.
  const csvHeaders = "name, diameter, gravity, climate, population" + "\n";
  csv += csvHeaders;

  //iterator used to count the successful # of planets found and saved, unnecessary but nice to have for development/display.
  let successCounter = 0;

  //for loop starting at planet 1 (u=1) and iterating up through every planet until Count is reached.
  for(let u = 1; u <= planetCount; u++){
    try {

      //calls and waits for the response of the planet info
      const response = await axios.get(getPlanetCountUrl+u);

      //assigns the response to a constant 
      const returnedPlanet = response.data; // returnedPlanet is the entire listing, unfiltered.
      
      // pull the necessary fields from the unfiltered listing.
      let name = returnedPlanet.name;
      let diameter = returnedPlanet.diameter;
      let gravity = returnedPlanet.gravity;
      let climate = returnedPlanet.climate;
      let population = returnedPlanet.population;

      if( // if all of the necessary variables aren't unknown or blank
        (name != 'unknown' && name != '' && name != 'N/A') &&
        (diameter != 'unknown' && diameter != '' && diameter != 'N/A') &&
        (gravity != 'unknown' && gravity != '' && gravity != 'N/A') &&
        (climate != 'unknown' && climate != '' && climate != 'N/A') &&
        (population != 'unknown' && population != '' && population != 'N/A')
        )   {
                // replace the comma seperators in the climate and gravity strings with / so it doesn't throw off the csv format.
              gravity = gravity.split(", ").join("/");
              climate = climate.split(", ").join("/");

                // concatenate the good information as a line in the csv string.
              csvOut = name + "," + diameter + "," + gravity + "," + climate + "," + population + "\n";
              csv += csvOut;

              successCounter++;
              console.log("There have been "+ successCounter + " planet(s) with ample information returned and recorded.");
            }
    }

      catch (error){  // very general error message.
        console.error("An error occured and the returned error information was: " + error);
      }
  }

    // console log the final csv string as an example of what is being written to file.
  console.log("The final output example data being saved now is: " +"\n\n" + csv);


    //write the filtered csv string to a file called sortedPlanets.csv, gives a generic error message if anything bad happens.
  fs.writeFile("sortedPlanets.csv", csv, error => {
    if (error) {
      console.error("There was an error and the program returned: " + error);
    } else {
      console.log("The script has completed sorting data and has successfully written to file." + "\n\n");
    }
  });
}


//This api call goes to the main planet page and extracts the Count field to be used in the above async function.
axios.get(getPlanetCountUrl)
  .then(response => {
      //assign the response data to a constant variable.
      const planetCountData = response.data;

      // pull the Count value from the response data constant.
      planetCount = planetCountData.count;

      //console.log the count to verify successful extraction.
      //console.log(planetCount);

      // now that we have the planetCount variable, call the above async function
      // and pass the planet Count to the method.
      callAndConcatenatePlanetInfo(getPlanetCountUrl,planetCount);
    })
  .catch(error => {
    console.error(error);
  });