const parser = require('osu-parser');
const writer = require('./map_writer');
const path = require('path');
const fs = require('fs');


const parse = (filePath) => {

  return new Promise((resolve, reject) => {
    parser.parseFile(path.join(filePath), (err, beatmap) => {
      if(err){
        console.log(err)
        reject(err)
      }
      try{
        if(beatmap.Mode === '3'){
          resolve(writer.generate(beatmap, path.join(filePath)))
        }
        else{
          resolve(false)
        }
      } catch (error){
        reject("File pathname isn't supported by Windows. Try removing special characters from the filename.")
      }
    });
  })
}

const parseAll = (songsFolder) => {
  const promiseArray = []

  return new Promise((resolve, reject) => {
    fs.readdir(path.join(songsFolder), (err, folders) => {
      if(err){
        reject(err)
      }
      folders.forEach(folder => {
        if(fs.lstatSync(path.join(songsFolder, folder)).isDirectory()){
          fs.readdir(path.join(songsFolder, folder), (err, files) => {
            if(err){
              reject(err)
            }
            if(files){
              files.forEach(file => {
                if(path.extname(file) === '.osu' && !file.includes("NOODLE_")){
                  promiseArray.push(() => parse(path.join(songsFolder, folder, file)))
                }
              })
            }
            if(folder === folders[folders.length - 1]){
              resolve(true)
            }
          })
        }
      })
      
    })
  }).then(async ()=>{
    for(let promise of promiseArray){
      await promise();
    }
  })
}

const parseSong = async (song) => {
  console.log(path.join(song))
  await parse(path.join(song));
  return true
}

const getSongList = (songsFolder, search) => {
  return new Promise((resolve, reject) => {
    const promiseArray = []

    fs.readdir(path.join(songsFolder), (err, folders) => {
      if(err){
        reject(err)
      }
      folders.forEach(folder => {
        if(fs.lstatSync(path.join(songsFolder, folder)).isDirectory()){
          fs.readdir(path.join(songsFolder, folder), (err, files) => {
            if(err){
              reject(err)
            }
            if(files){
              files.forEach(file => {
                if(path.extname(file) === '.osu' && !file.includes("NOODLE_") && file.toLowerCase().includes(search.toLowerCase())){
                  promiseArray.push(path.join(songsFolder, folder, file))
                }
              })
            }
            if(folder === folders[folders.length - 1]){
              resolve(promiseArray)
            }
          })
        }
      })
      
    })
  })
}

module.exports = {
  parseAll,
  getSongList,
  parseSong
}