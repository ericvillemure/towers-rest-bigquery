const express = require('express')
const app = express()
const port = process.env.PORT

const { BigQuery } = require('@google-cloud/bigquery');
// const bqOptions = {
//     keyFilename: 'service_account.json',
//     projectId: 'cell-towers-9c6c2',
// };
// const bigquery = new BigQuery(bqOptions);
const bigquery = new BigQuery();

app.get('/', (req, res) => {
    res.send('Hello World!')
})
/*
BigQuery contains the CSV file found at the next URL
https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/h_00010.html
To test: http://localhost:3001/api/coordinates?n=45.654441002201935&s=45.2846228904437&e=-73.10963699278332&w=-73.81276199278314
*/
app.get('/api/coordinates', async (req, res) => {

    const { n, s, e, w } = { n: Number(req.query["n"]), s: Number(req.query["s"]), e: Number(req.query["e"]), w: Number(req.query["w"]) };

    // Queries the U.S. given names dataset for the state of Texas.

    const query = `SELECT LATITUDE,LONGITUDE,LICENSEE,TX_PWR,TRANSMIT_BW,TRANSMIT_FREQ,SITE_ELEV,TX_ANT_AZIM FROM \`cell-towers-9c6c2.cell_towers_february_2023.towers\` where 
        LATITUDE <= ${n} AND LATITUDE >= ${s} AND 
        LONGITUDE <= ${e} AND LONGITUDE >= ${w}`;

    // Code found at https://github.com/googleapis/nodejs-bigquery/blob/main/samples/query.js
    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
        query: query,
        // Location must match that of the dataset(s) referenced in the query.
        // location: 'US',
    };

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();


    const towersObject = {}


    rows.forEach(row => {
        const key = `${row["LATITUDE"]},${row["LONGITUDE"]}`
        let tower = towersObject[key]
        if (!tower) {
            tower = {
                coordinates: {
                    latitude: row["LATITUDE"],
                    longitude: row["LONGITUDE"]
                },
                antennas: []
            }
            towersObject[key] = tower
        }

        tower.antennas.push({
            //LICENSEE,TX_PWR,TRANSMIT_BW,TRANSMIT_FREQ,SITE_ELEV,TX_ANT_AZIM
            licensee: row["LICENSEE"],
            tx_pwr: row["TX_PWR"],
            transmit_bw: row["TRANSMIT_BW"],
            transmit_freq: row["TRANSMIT_FREQ"],
            site_elev: row["SITE_ELEV"],
            tx_ant_azim: row["TX_ANT_AZIM"],
        })
    });


    const towers = Object.values(towersObject)

    const MAX_NUMBER_OF_TOWERS = 1000
    const response = {
      towersTotalCount: towers.length,
      towers: towers.slice(0, MAX_NUMBER_OF_TOWERS)
    }
  
    res.json(response);
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})