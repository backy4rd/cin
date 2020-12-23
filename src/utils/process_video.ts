import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';

let processChain: Promise<void> = Promise.resolve();

function processVideo(videoPath, outDirPath): Promise<void> {
    return new Promise((resolve, reject) => {
        const process = ffmpeg(videoPath)
            .outputOptions([
                '-c:a aac',
                '-c:v libx264',
                '-f hls',
                '-hls_time 4',
                '-hls_list_size 0',
            ])
            .output(path.resolve(outDirPath, 'seg.m3u8'));

        process.on('progress', (progress) => {
            console.log(progress.percent);
        });

        process.on('err', reject);
        process.on('end', resolve);

        process.run();
    });
}

function processVideoInOrder(videoPath, outDirPath): Promise<void> {
    processChain = processChain.then(() => processVideo(videoPath, outDirPath));

    return processChain;
}

export default processVideoInOrder;
