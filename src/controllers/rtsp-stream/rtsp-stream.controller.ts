import { Controller, Get, Req, Res } from '@nestjs/common';
import { RtspStreamService } from './rtsp-stream.service';
import { Response, Request } from 'express';
import { spawn } from 'child_process';

@Controller('rtsp-stream')
export class RtspStreamController {
  constructor(private readonly rtspStreamService: RtspStreamService) {}

  @Get()
  async getStream(@Req() req: Request, @Res() res: Response) {
    const rtspUrl = req.query.url as string;
    if (!rtspUrl) {
      return res.status(400).send('RTSP URL is required');
    }

    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader(
    //   'Access-Control-Allow-Headers',
    //   'Origin, X-Requested-With, Content-Type, Accept',
    // );
    // res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

    // const ffmpeg = spawn('ffmpeg', [
    //   '-i',
    //   rtspUrl,
    //   '-f',
    //   'mjpeg',
    //   '-q:v',
    //   '5',
    //   '-r',
    //   '15',
    //   '-s',
    //   '640x480',
    //   '-fflags',
    //   'nobuffer',
    //   '-an',
    //   '-',
    // ]);

    // const ffmpeg = spawn('ffmpeg', [
    //   '-rtsp_transport',
    //   'tcp',
    //   '-i',
    //   rtspUrl,
    //   '-f',
    //   'mjpeg',
    //   '-q:v',
    //   '5',
    //   '-r',
    //   '15',
    //   '-s',
    //   '640x480',
    //   'pipe:1',
    // ]);

    // ffmpeg.stdout.on('data', (chunk) => {
    //   res.write(`--frame\r\n`);
    //   res.write(`Content-Type: image/jpeg\r\n`);
    //   res.write(`Content-Length: ${chunk.length}\r\n\r\n`);
    //   res.write(chunk);
    //   res.write(`\r\n`);
    // });

    const ffmpeg = spawn('ffmpeg', [
      '-rtsp_transport',
      'tcp',
      '-i',
      rtspUrl,
      '-f',
      'mjpeg',
      '-q:v',
      '5',
      '-r',
      '15',
      '-s',
      '640x480',
      'pipe:1',
    ]);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

    let buffer = Buffer.alloc(0);
    ffmpeg.stdout.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      let start = buffer.indexOf(Buffer.from([0xff, 0xd8]));
      let end = buffer.indexOf(Buffer.from([0xff, 0xd9]), start + 2);
      while (start !== -1 && end !== -1) {
        const frame = buffer.slice(start, end + 2);
        res.write(`--frame\r\n`);
        res.write(`Content-Type: image/jpeg\r\n`);
        res.write(`Content-Length: ${frame.length}\r\n\r\n`);
        res.write(frame);
        res.write(`\r\n`);
        buffer = buffer.slice(end + 2);
        start = buffer.indexOf(Buffer.from([0xff, 0xd8]));
        end = buffer.indexOf(Buffer.from([0xff, 0xd9]), start + 2);
      }
    });

    ffmpeg.stderr.on('data', (data) => {
      console.error('[FFmpeg]', data.toString());
    });

    ffmpeg.on('error', (err) => {
      console.error('FFmpeg error:', err);
      res.status(500).send('Error starting FFmpeg');
    });

    ffmpeg.on('close', () => {
      console.log('FFmpeg stream ended');
      res.end();
    });

    req.on('close', () => {
      ffmpeg.kill('SIGINT');
    });
  }
}
