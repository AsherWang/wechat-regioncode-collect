import downloadApk from './download';
import unzip from './unzip';
import parseFiles from './parseFiles';
import genResult from './genResult';

async function main() {
    console.log('start download')
    const { path: apkPath, url: apkUrl } = await downloadApk();
    const version = apkPath.match(/weixin(\d+)android/)[1];
    console.log(`weixin version -> ${version}`);
    console.log('start unzip')
    const files = await unzip(apkPath);
    console.log('start parsefiles')
    const data = parseFiles(files);
    genResult(
        {
            weixinVersion: version,
            apkUrl,
            ts: Date.now(),
        },
        data);
    console.log('done')
}

main();
