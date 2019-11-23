const fs = require('fs');
const path = require('path');

function clearWavFile(directory){
    fs.readdir(directory, (err, files) => {
        console.log(directory);
        if (err) throw err;

        for (const file of files) {
            let filename = path.join(directory, file);
            console.log(filename);
            const stat = fs.lstatSync(filename);
            if (stat.isDirectory()){
                clearWavFile(filename); //recurse
            }else {
                fs.unlink(filename, err => {
                    if (err) throw err;
                });
            }
        }
    });
}
module.exports = {
    clearWavFile: clearWavFile
};