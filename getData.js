// node modules
const axios = require('axios');
const fs = require('fs');

// directories
const locations = 'data/location/';
const restaurants = 'data/restaurants/';

// get restaurants keys from locations
const getKeys = () => {
  const kyivResponse = fs.readFileSync(locations + 'ChIJBUVa4U7P1EAR_kYBF9IxSXY.json');
  const londonResponse = fs.readFileSync(locations + 'ChIJdd4hrwug2EcRmSrV3Vo6llI.json');

  const kyivKeys = JSON.parse(kyivResponse).data.feedItems
    .map(key => key.uuid);

  const londonKeys = JSON.parse(londonResponse).data.feedItems
    .map(key => key.uuid);

  return [...kyivKeys, ...londonKeys];
};

// fetch restaurants by keys
const keys = getKeys();
keys.forEach(async(key) => {
  const request = {
    method: "POST",
    url: "https://www.ubereats.com/api/getStoreV1?localeCode=en-UA",
    data: {
      "storeUuid": key,
    },
    headers: {
      'x-csrf-token': 'x',
      'Content-Type': 'application/json'
    },
    json: true, // optional
  };

  const response = await axios(request);
  const path = `data/restaurants/${key}.json`;

  fs.writeFileSync(path, JSON.stringify(response.data, null, 4), (err) => {
    if (err) throw err;
  });
  console.log(`${key} successfully`);
});

// check files with error and remove them
fs.readdir(restaurants, (err, filenames) => {
  if (err) throw err;

  console.log(filenames);

  filenames.forEach((filename) => {
    fs.readFile(restaurants + filename, (err, content) => {
      if (err) throw err;

      const response = JSON.parse(content);

      if (response.status === 'failure') {
        fs.unlink(restaurants + filename, err => {
          if (err) throw err;
        });

        console.log(`${filename} has been removed (failure file)`);
      }
    });
  });
});

// fix restaurants
// move first `subsections` to `sections` array
// rename `subsectionsMap` to `sectionsMap`

fs.readdir(restaurants, (err, filenames) => {
  if (err) throw err;

  filenames.forEach(filename => {
    fs.readFile(restaurants + filename, (err, content) => {
      const {
        sectionEntitiesMap, subsectionsMap, sections: oldSections, ...entries
      } = content.data;

      // const items = { ...Object.values(sectionEntitiesMap)[0] };
      // const sections = { ...subsectionsMap };
      //
      // const restaurant = {
      //   items,
      //   sections,
      //   ...entries,
      // };

      console.log(JSON.parse(content));

      fs.writeFile(restaurants + filename, JSON.stringify(restaurant, null, 4), (err) => {
        if (err) {
          console.log(filename + `err`);
          // throw new Error(`${filename} ${err}`)
        } else {
          console.log(`${filename} written`);
        }
      });
    });
  });
});