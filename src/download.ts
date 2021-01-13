import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';

const PAGE_URL = "https://weixin.qq.com/cgi-bin/readtemplate?uin=&stype=&promote=&fr=&lang=zh_CN&ADTAG=&check=false&t=weixin_download_method&sys=android&loc=weixin,android,web,0";
const workspacePath = path.parse(__dirname).dir;
const apkTargetDir = path.join(workspacePath, 'output');


async function getDownloadUrl() {
    const htmlStr: string = await axios.get(PAGE_URL).then((response) => response.data);
    const matchResult = htmlStr.match(/https:([^<]+?)arm64.apk/);
    if (matchResult === null) {
        return "";
    }
    const downloadUrl = matchResult[0];
    return downloadUrl;
}


async function downloadFile(fileUrl: string, forceDownload: boolean) {
    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/')+1);
    const apkTargetPath = path.join(apkTargetDir, fileName);
    if (!forceDownload && fs.existsSync(apkTargetPath)) {
        console.log("apk file already downloaded, skipped");
        return apkTargetPath;
    }
    const fileCont: any = await axios.get(fileUrl, { responseType: "arraybuffer" });
    await fs.ensureFile(apkTargetPath);
    await fs.writeFile(apkTargetPath, fileCont.data);
    return apkTargetPath;
}

export default async function downloadApk(forceDownload: boolean = false) {
    const downloadUrl = await getDownloadUrl();
    const apkTargetPath = await downloadFile(downloadUrl, forceDownload);
    return {path: apkTargetPath, url: downloadUrl};
}