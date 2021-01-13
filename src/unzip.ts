import * as path from 'path';
import * as decompress from 'decompress';

const workspacePath = path.parse(__dirname).dir;

export default async function unzip(apkFilePath: string) {
    const targetDir = path.join(workspacePath, 'docs', 'output', 'apk');
    const files = await decompress(apkFilePath, targetDir, {
        filter: file => file.path.includes('regioncode')
    });
    return files;
}