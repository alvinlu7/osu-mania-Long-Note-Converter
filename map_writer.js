const fs = require('fs')
const path = require('path')

const generate = (beatmap, filePath, settings) => {

  return new Promise((resolve, reject) => {
    try{
    fs.readFile(filePath, 'utf8', (err, rawFile) => {
      const versionIndex = rawFile.indexOf('Version:');
      const hitObjectIndex = rawFile.indexOf('[HitObjects]');

      let output = rawFile.slice(0, versionIndex) + "Version:NOODLE_" + rawFile.slice(versionIndex + 8, hitObjectIndex - 1)
  
      //Finding the most common timing seperation between notes to use as inverse LN release length
  
      const spacesBetweenNotes = beatmap.hitObjects.map((obj, index) => {
        if(index != beatmap.hitObjects.length - 1) return beatmap.hitObjects[index+1].startTime - obj.startTime 
      })
  
      const spaces = {}
      spacesBetweenNotes.forEach((space) => {
        if(spaces[space] === undefined){
          spaces[space] = 1
        }
        else{
          spaces[space] = spaces[space] + 1
        }
      })
      let mostCommonSpaceBetweenNotes;
      let highestCount = 0;
      Object.keys(spaces).forEach(space => {
        if(space !== '0' && spaces[space] > highestCount){
          mostCommonSpaceBetweenNotes = space
          highestCount = spaces[space]
        }
      })

      let min_divisor = 0.25
      let release_divisor = 1

      if(settings){
        release_divisor = Number.parseFloat(settings.releaseTop) / Number.parseFloat(settings.releaseBottom)
        min_divisor = Number.parseFloat(settings.minTop) / Number.parseFloat(settings.minBottom)
      }
  
      //Generating hitobjects section
      output += "[HitObjects]\n"
      beatmap.hitObjects.forEach((hitObj, index) => {
        let nextSameNoteTiming = 0
        for(let i = index + 1; i < beatmap.hitObjects.length; i++){
          if(hitObj.position[0] === beatmap.hitObjects[i].position[0]){
            nextSameNoteTiming = beatmap.hitObjects[i].startTime
            break
          }
        }
        output += `${hitObj.position[0]},`+
        `${hitObj.position[1]},`+
        `${hitObj.startTime},`+
        `${nextSameNoteTiming === 0 || nextSameNoteTiming - Math.floor(mostCommonSpaceBetweenNotes * release_divisor) < hitObj.startTime + mostCommonSpaceBetweenNotes * min_divisor ? 1 : 128},`+
        `0,`+
        `${nextSameNoteTiming === 0 || nextSameNoteTiming - Math.floor(mostCommonSpaceBetweenNotes * release_divisor) < hitObj.startTime + mostCommonSpaceBetweenNotes * min_divisor ? 0 : nextSameNoteTiming -  Math.floor(mostCommonSpaceBetweenNotes * release_divisor)}`+
        `:0:0:0:0:\n`
      })
  
      
      const writePath = path.join(path.dirname(filePath), "NOODLE_" + path.basename(filePath, '.osu')+".osu")
      fs.writeFile(writePath, output, (err) => {
        if(err){
          console.log(err)
        }
        console.log("Converted: " + writePath)
        resolve(true)
      })

    })}
    catch (error){
      console.log(error)
      reject(error)
    }
  })
}

module.exports = {
  generate,
}