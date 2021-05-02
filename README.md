## osu!mania Long Note Converter

A tool to convert osu!mania maps into inverse long note maps.

### Developing

1. Install `npm i` 
2. `node server.js`  

## How it works

Runs a node.js server that is able to write new .osu files on the user's computer.    
Locally hosted web page made in HTML/CSS/JS/JQuery acts as a simple UI to interact with the node.js server.   

## Usage notes and instructions

Download the executable file from the /build folder in the repository.  
Open the .exe and go the URL shown in the console. Default is (http://127.0.0.1:3000/web/).  
Enter in the path to your osu! songs folder. Location of songs folder with default osu! installation is "C:\Users\<Username>\AppData\Local\osu!\Songs".  
Select whether you'd like to convert all songs in your library or some files.  
<br/>
NOTE: Converting all songs in your library may cause issues with conversions of some maps because of the beatmap ID parameter. The program NEVER overwrites your original song files.  
<br/>
When converting specific files, you are able to set the inverse LN release spacing and minimum LN length.  
Inverse LN release spacing is the distance between the end of a long note and the start of the next one.  
These are fractional amounts, enter the numerator on the left and the denominator on the right.  
The converter calculates the most common spacing between notes in the song and then applies the fractional modifier.  
ie. If the most common spacing between notes is quarter notes, the default fraction 1/1 = 1 will make the inverse LN spacing equal to quarter notes. If you set the release spacing to 1/2, the inverse LN spacing will equal eighth notes.  
<br/>
When converting all songs, the inverse LN release spacing is set to 1/1 and the minimum LN length is 1/4.  
<br/>
Enter your search query for files. Search for files is done using a substring search ex. if the song name is L.F.O and you search LFO, nothing will come up.  
<br/>
Click one of the search results. The button will turn green when the file is converted with your applied settings.  
<br/>
Reload your osu! songs folder and the conversion will appear!  

