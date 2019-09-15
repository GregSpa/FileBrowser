////////////////////////////////////////////////////
// init

const fs = require('fs');
const os = require('os');
const path = require('path');

let currentDir = os.homedir();
let filesTable = document.getElementById('filesTable');

////////////////////////////////////////////////////
// events

filesTable.addEventListener('dblclick', e => {
    let dirName = e.target.parentNode.getAttribute('dirName');
    if (dirName && dirName !== '') {
        scanDir(path.join(currentDir, dirName))
    }
})

document.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key == 'Backspace')
        scanDir(path.join(currentDir, '..'));
})

////////////////////////////////////////////////////
// start
scanDir(currentDir);

////////////////////////////////////////////////////
// functions

function scanDir(dir) {
    currentDir = dir;

    ///// read directory
    let files = fs.readdirSync(dir);

    ///// add details 
    let filesStat = [];
    for (let i = 0; i < files.length; i++) {
        try {
            let name = files[i]
            let stat = fs.statSync(path.join(dir, name));
            let isDir = stat.isDirectory() ? 1 : 0;
            let mtime = fileDate(stat.mtime);
            let size = '';
            if (!isDir) size = bytesToSize(stat.size);
            if (name.indexOf('.') != 0)
                filesStat.push({
                    name,
                    stat,
                    isDir,
                    mtime,
                    size
                })
        } catch (error) {
            /// skip
        }
    }

    ///// sorting

    /// by name
    filesStat.sort((a, b) => {
        let res = 0;
        if (b.name.toLowerCase() > a.name.toLowerCase()) res = -1;
        if (b.name.toLowerCase() < a.name.toLowerCase()) res = 1;
        return res;
    });

    /// by file type
    filesStat.sort((a, b) => {
        return b.isDir - a.isDir;
    });

    ///// prepare HTML Table

    //// Header
    let list = '<table>';
    list += `
    <thead>
        <tr>
            <th>Name</th>
            <th>Date modified</th>
            <th>Size</th>
        </tr>
    </thead>
    `;

    //// Contents - file list
    for (let i = 0; i < filesStat.length; i++) {
        let f = filesStat[i];
        list += `
        <tr dirName="${f.isDir ? f.name : ''}">
            <td>
                ${f.isDir ? '&#128193;' : '	&#128452;'}
                ${f.name}
            </td>
            <td>
                ${f.mtime}
            </td>
            <td class="size">
                ${f.size}
            </td>
        </tr>
        `;
    }

    list += '</table>';

    //// insert into div
    filesTable.innerHTML = list;
}


///////// helpers

function bytesToSize(bytes, seperator = " ") {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 B';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes}${seperator}${sizes[i]}`;
    return `${(bytes / (1024 ** i)).toFixed(1)}${seperator}${sizes[i]}`;
}

function fileDate(ms) {
    let res = ms.getFullYear() +
        '-' + leadZeroDate(ms.getMonth()) +
        '-' + leadZeroDate(ms.getDate()) +
        ', ' + ms.toLocaleTimeString('pl-PL');

    return res;
}

function leadZeroDate(num) {
    return num < 10 ? `0${num}` : num;
}