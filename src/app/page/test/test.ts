import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Header } from '../../component/header/header';
import { Data } from '../../servers/data/data';
import { SendInfo } from '../../servers/sendInfo/send-info';

@Component({
  selector: 'app-test',

  standalone: true,

  imports: [CommonModule, Header],

  templateUrl: './test.html',

  styleUrl: './test.css',
})
export class Test {
  dataService: Data = inject(Data);
  sendInfoService: SendInfo = inject(SendInfo);

  testCount: number = 10;
  isTesting: boolean = false;
  results: any = [];
  logs: any = this.sendInfoService.logs$;

  // Кількість тестів
  setTestCount(count: number) {
    this.testCount = count;
  }

  async startTests() {
    this.isTesting = true;
    this.sendInfoService.deleteLogs();
    this.sendInfoService.addLog('Starting tests');

    const now = new Date();

    const date =
      String(now.getDate()).padStart(2, '0') +
      '.' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '.' +
      now.getFullYear() +
      ' ' +
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0');

    const results = {
      date: date,
      testCount: this.testCount,
      speeds: [] as number[],
    };
    for (let i = 0; i < this.testCount; i++) {
      const speed = await this.dataService.testDownloadSpeed();
      results.speeds.push(speed);

      this.sendInfoService.addLog(`Test ${i + 1}: ${speed} Mbps`);
      console.log(speed);
      if (i + 1 === this.testCount) {
        this.sendInfoService.addLog('All tests completed');
        this.isTesting = false;

        this.sendInfoService.addResults(results);
      }
      console.log(results);
    }
  }
}
