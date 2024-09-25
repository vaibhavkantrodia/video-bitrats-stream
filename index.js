const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('video'), (req, res) => {
  const tempFilePath = req.file.path;

  // Get video information
  ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
    if (err) {
      console.error(`Error probing video file: ${err.message}`);
      return res.status(500).json({ error: 'Error probing video file' });
    }

    // Extract quality details
    const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
    if (!videoStream) {
      console.error('No video stream found in file');
      return res.status(400).json({ error: 'No video stream found in file' });
    }

    // find the original resolution and bitrate
    const originalResolution = `${videoStream.width}x${videoStream.height}`;
    const originalBitrate = videoStream.bit_rate || 'Unknown';

    const qualities = [
      { name: '144p', bitrate: '96k' },
      { name: '240p', bitrate: '128k' },
      { name: '360p', bitrate: '256k' },
      { name: '480p', bitrate: '384k' },
      { name: '720p', bitrate: '512k' },
      { name: '1080p', bitrate: '1024k' },
      { name: '1440p', bitrate: '2048k' },
      { name: '2160p', bitrate: '4096k' },
    ];

    const outputFiles = [];
    let completed = 0;

    qualities.forEach((quality) => {
      const outputPath = path.join('uploads', `output_${quality.name}.mp4`);
      outputFiles.push(outputPath);

      ffmpeg(tempFilePath)
        .output(outputPath)
        .videoCodec('libx264')
        .videoBitrate(quality.bitrate)
        .outputOptions('-vf', 'scale=iw:ih')
        .on('end', () => {
          completed++;
          if (completed === qualities.length) {
            fs.unlink(tempFilePath, (err) => {
              if (err) {
                console.error(`Error deleting temporary file: ${err.message}`);
              }
            });

            res.json({
              message: 'Conversion complete',
              files: outputFiles,
            });
          }
        })
        .on('error', (err) => {
          console.error(`Error converting to ${quality.name} quality: ${err.message}`);
          res.status(500).json({ error: `Error converting to ${quality.name} quality` });
        })
        .run();
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
