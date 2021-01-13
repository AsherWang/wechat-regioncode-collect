import { File } from 'decompress';


const nameIdxs: { [key: string]: number } = { 'en': 1, 'zh_CN': 2, 'zh_HK': 3, 'zh_TW': 4 };

/** 预期的数据结构是
 * pid 0表示没有父节点
[
   [0,    1    ,      2    ,     3   ,   4  ,  5, 6]
  [key, name_en, name_zh_CN, name_HK, name_TW, id, pid]
]
**/

function findPid(cont: Array<Array<string|number>>, key: string): number{
    const subKeys = key.split('_');
    if(subKeys.length === 1)return 0;
    const pKey = subKeys.slice(0, subKeys.length-1).join('_');
    const pRecord = cont.find(i => i[0] === pKey);
    if(!pRecord){
        console.warn(`寻找${key}父节点${pKey}失败`);
        return 0;
    }
    return pRecord[5] as number;
}

let id = 1;
function parseFile(cont: Array<Array<string|number>>, file: File) {
    const lng = file.path.match(/_(\w+)\.txt/)[1];
    const nameIdx = nameIdxs[lng];
    // console.log(`${lng} -> ${nameIdx}`);
    const fileCont = file.data.toString();
    fileCont.split('\n').forEach(line => {
        if(!line || line === "")return;
        const [key, value] = line.split('|');
        let record = cont.find(i => i[0] === key);
        if (!record) {
            record = Array(7).fill('');
            record[0] = key;
            record[5] = id;
            record[6] = findPid(cont, key);
            id += 1;
            cont.push(record);
        }
        record[nameIdx] = value;
    });
}


export default function parseFiles(files: Array<File>): Array<Array<string>> {
    const ret: Array<Array<string>> = [];
    files.forEach(file => {
        parseFile(ret, file);
    })
    return ret;
}