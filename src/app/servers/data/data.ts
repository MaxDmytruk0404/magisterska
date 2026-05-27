import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Data {

   async testDownloadSpeed(): Promise<number> {
    const fileUrl = 'https://speed.cloudflare.com/__down?bytes=10000000';

    const start = performance.now();

    const response = await fetch(fileUrl, { cache: 'no-store' });
    const blob = await response.blob();

    const end = performance.now();

    const durationSec = (end - start) / 1000;

    const bitsLoaded = blob.size * 8;
    const mbps = (bitsLoaded / durationSec) / (1024 * 1024);

    return mbps.toFixed(2) as unknown as number;
  }  
  
}
