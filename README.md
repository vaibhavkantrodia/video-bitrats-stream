# Video Bitrate Streaming Application

This application allows users to upload a video file, which is then processed to generate different quality versions of the video. The video is transcoded into multiple resolutions using `ffmpeg`, making it suitable for adaptive bitrate streaming.

## Features

- Upload a video file through an HTTP POST request.
- Automatically transcodes the uploaded video into multiple resolutions:
  - 144p
  - 240p
  - 360p
  - 480p
  - 720p
  - 1080p
  - 1440p
  - 2160p
- Each transcoded video is saved in the `uploads/` directory.
- The original uploaded video is automatically deleted after transcoding.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/) (v14.x or later)
- [ffmpeg](https://ffmpeg.org/download.html) (installed and available in your system's PATH)

## Installation

1. Clone this repository to your local machine:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Ensure `ffmpeg` is installed and accessible from the command line.

## Usage

1. Start the server:
    ```bash
    node index.js
    ```

2. The server will run on `http://localhost:3000`.

3. To upload a video for processing, send a POST request to `http://localhost:3000/upload` with the video file attached as form-data under the key `video`.

4. After the upload and processing, the server will return a JSON response with the paths to the generated video files.

### Example CURL Request

```bash
curl -X POST -F 'video=@/path/to/your/video.mp4' http://localhost:3000/upload
