const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg-static");
const cp = require("child_process");
const stream = require("stream");
const app = express();

app.use(cors());

app.get("/download/:videoId/:quality/:videoName", async (req, res) => {
    const { videoId, quality, videoName } = req.params;
    if (!videoId || !quality || !videoName) {
        res.status(404).send({ message: "Variable not valid..." });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    res.header("Content-Disposition", `attachment;  filename=${videoName}.mkv`);

    const result = new stream.PassThrough({ highWaterMark: 1024 * 512 });

    const videoStream = ytdl(url, {
        filter: (format) =>
            format.qualityLabel === quality && format.container === "mp4",
    });
    const audioStream = ytdl(url, {
        quality: "highestaudio",
    });

    // create the ffmpeg process for muxing
    let ffmpegProcess = cp.spawn(
        ffmpeg,
        [
            // supress non-crucial messages
            "-loglevel",
            "8",
            "-hide_banner",
            // input audio and video by pipe
            "-i",
            "pipe:3",
            "-i",
            "pipe:4",
            // map audio and video correspondingly
            "-map",
            "0:a",
            "-map",
            "1:v",
            // no need to change the codec
            "-c",
            "copy",
            // output mp4 and pipe
            "-f",
            "matroska",
            "pipe:5",
        ],
        {
            // no popup window for Windows users
            windowsHide: true,
            stdio: [
                // silence stdin/out, forward stderr,
                "inherit",
                "inherit",
                "inherit",
                // and pipe audio, video, output
                "pipe",
                "pipe",
                "pipe",
            ],
        }
    );
    audioStream.pipe(ffmpegProcess.stdio[3]);
    videoStream.pipe(ffmpegProcess.stdio[4]);
    ffmpegProcess.stdio[5].pipe(result);

    result.pipe(res);
});

app.listen(32425, () => {
    console.log("Downloader is running...");
});
