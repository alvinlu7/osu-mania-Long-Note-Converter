const path = require( 'path' );
const express = require( 'express' );
const getPort = require( 'get-port' );
const { parseAll, getSongList, parseSong } = require('./controller');

( async function() {
    
    // create express application
    const app = express();

    // find available port (if not 3000)
    const port = await getPort( { port: 3000 } );
    const host = `http://127.0.0.1:${ port }`;

    //Use body parser for JSON requests
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    /*-------------------*/

    // endpoint to serve web assets
    app.use( '/web', express.static( path.join( __dirname, './src/www' ) ) );

    app.post( '/api/file', async ( req, res ) => {
      try{
        await parseSong(req.body.song);
        res.send(true)
      } catch (err){
        console.log(err)
        res.status(500).send(err)
      }
    });

    app.post( '/api/all', async ( req, res ) => {
      console.log(req.body.songsFolder)
      await parseAll(req.body.songsFolder);
      res.send(true);
    });

    app.post( '/api/songList', async ( req, res ) => {
      const songPaths = await getSongList(req.body.songsFolder, req.body.search).then(res => res);
      console.log(songPaths);
      res.send(songPaths);
    });

    /*-------------------*/

    app.listen( port, async () => {
      console.log()
      console.log(`Please visit ${host}/web in your browser to get started!`);
      console.log()
      console.log("******************************************************")
      console.log()
      console.log('First, enter the full directory path to your osu songs folder.');
      console.log('Select if you want to convert all files or select specific files.')
      console.log('If selecting individual files, fetch the list of them after entering in the songs folder path and selecting "Some Songs".')
      console.log('Clicking an individual file will convert it, the button will turn green when complete.')
      console.log('If converting all files, check for the output below here. It is safe to exit when new conversion messages no longer appear.')
    } );

} )();