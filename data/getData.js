const axios = require('axios');
const fs = require('fs');

const getKeys = () => {
  const kyivResponse = fs.readFileSync('data/location/ChIJBUVa4U7P1EAR_kYBF9IxSXY.json');
  const londonResponse = fs.readFileSync('data/location/ChIJdd4hrwug2EcRmSrV3Vo6llI.json');

  const kyivKeys = JSON.parse(kyivResponse).data.feedItems
    .map(key => key.uuid);

  const londonKeys = JSON.parse(londonResponse).data.feedItems
    .map(key => key.uuid);

  return [...kyivKeys, ...londonKeys];
};

const getData = () => {
  const keys = getKeys();

  keys.forEach((key, i) => {
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
      json: true,
    };

    axios(request)
      .then(({ data }) => {
        const path = `data/restaurants/${key}.json`;
        fs.writeFile(path, JSON.stringify(data, null, 4), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`${key} written`);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(key, i);
  });

  // return keys;
};

module.exports = getData;