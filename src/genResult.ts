import * as fs from 'fs-extra';
import * as path from 'path';

const workspacePath = path.parse(__dirname).dir;
const destDir = path.join(workspacePath, 'docs', 'output');

export default function genResult(info:any, data:Array<Array<string>>) {


    const infoPath = path.join(destDir, 'info.js');
    fs.ensureFileSync(infoPath);
    fs.writeFileSync(infoPath, `window.weixinRegionInfo=${JSON.stringify(info)}`);

    const jsonPath = path.join(destDir, 'region.json');
    fs.ensureFileSync(jsonPath);
    fs.writeJson(jsonPath, data);

    const jsonjsPath = path.join(destDir, 'region.js');
    fs.ensureFileSync(jsonjsPath);
    fs.writeFileSync(jsonjsPath, `window.weixinRegionData=${JSON.stringify(data)}`);


    // 建表sql
    const createTableSql = "CREATE TABLE `mm_region` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,`pid` int(11) NOT NULL,`key` varchar(255) COLLATE utf8_bin DEFAULT NULL,`name_en` varchar(255) COLLATE utf8_bin DEFAULT NULL,`name_zh_CN` varchar(255) COLLATE utf8_bin DEFAULT NULL,`name_zh_HK` varchar(255) COLLATE utf8_bin DEFAULT NULL,`name_zh_TW` varchar(255) COLLATE utf8_bin DEFAULT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;"
    const insertSql = "INSERT INTO `mm_region` VALUES " + data.map((i: any) => `(${i[5]},${i[6]},"${i[0]}","${i[1]}","${i[2]}","${i[3]}","${i[4]}")`).join(',') + ";";
    const sqlPath = path.join(destDir, 'region.sql');
    fs.ensureFileSync(sqlPath);
    fs.writeFileSync(sqlPath, [createTableSql, insertSql].join('\n'));


    // csv
    const csvPath = path.join(destDir, 'region.csv');
    fs.ensureFileSync(sqlPath);
    const csvData = [
        ['id', 'pid', 'key', 'name_en', 'name_zh_CN', 'name_zh_HK', 'name_zh_TW'],
        ...data.map((i: any) => `${i[5]},${i[6]},"${i[0]}","${i[1]}","${i[2]}","${i[3]}","${i[4]}"`),
    ];
    fs.writeFileSync(csvPath, csvData.join('\n'));

}