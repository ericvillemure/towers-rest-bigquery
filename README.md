# Cell phone towers backend

This is the backend for the cell phone towers project found at https://github.com/ericvillemure/towers-rest-bigquery
The frontend project used to interact with it can be found here: https://github.com/ericvillemure/towers-frontend-vite

## To run locally

1. Uncomment lines 6-10  from app.js and comment line 11 (Don't forget to revert before deploying)
2. Run with or without debug using the following vscode launch.json file content

```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\app.js",
            "env": {
                "PORT": "3001"
            }
        }
    ]
}
```
3. Once it runs locally the following URL can be used to test it: http://localhost:3001/api/coordinates?n=45.654441002201935&s=45.2846228904437&e=-73.10963699278332&w=-73.81276199278314


## To deploy

1. Make sure lines 6-10 from app.js are commented and line 11 is not

2. Push the code to GitHub

3. Go to Google Cloud's Cloud Run and click Edit & deploy new revision 

4. The latest deployed version of this code can be tested here: https://get-cell-towers-extnzbvljq-nn.a.run.app/api/coordinates?n=45.654441002201935&s=45.2846228904437&e=-73.10963699278332&w=-73.81276199278314