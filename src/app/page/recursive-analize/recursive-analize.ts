import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Header } from '../../component/header/header';
import { SendInfo } from '../../servers/sendInfo/send-info';
import Plotly from "plotly.js-dist-min";

@Component({
  selector: 'app-recursive-analize',
  standalone: true,
  imports: [CommonModule, Header, FormsModule],
  templateUrl: './recursive-analize.html',
  styleUrl: './recursive-analize.css',
})
export class RecursiveAnalize implements OnInit {
  private sendInfoService = inject(SendInfo);

  // Параметри фільтра
  Q = 0.1;
  R = 1.0;

  // Дані для перемикання
  testList: any[] = [];          // Сюди збережемо весь масив тестувань
  selectedTestIndex = 0;         // Індекс обраного тесту в списку

  // Поточні дані (активне тестування)
  testDate = '';
  testCount = 0;
  mseRawVsAvg = 0;
  mseKalmanVsAvg = 0;
  private rawSpeeds: number[] = [];

  ngOnInit() {
    this.sendInfoService.results$.subscribe(results => {
      console.log('Отримані дані зі Speedtest:', results);
      
      if (results && results.length > 0) {
        this.testList = results;
        // За замовчуванням беремо останнє за часом тестування (кінець масиву)
        this.selectedTestIndex = results.length - 1; 
        
        this.loadSelectedTestData();
      }
    });
  }

  // Метод, який витягує дані конкретного тесту за індексом
  loadSelectedTestData() {
    if (!this.testList || this.testList.length === 0) return;

    const currentTest = this.testList[this.selectedTestIndex];
    this.testDate = currentTest.date;
    this.testCount = currentTest.testCount;
    
    // Перетворюємо масив рядків у числа
    this.rawSpeeds = currentTest.speeds.map((s: string) => parseFloat(s));
    
    // Розраховуємо та малюємо
    this.calculateAndPlot();
  }

  // Викликається, коли користувач вибирає інше тестування у списку
  onTestChange(index: number) {
    this.selectedTestIndex = index;
    this.loadSelectedTestData();
  }

  // Обчислення та візуалізація (викликається також при русі слайдерів)
  calculateAndPlot() {
    if (this.rawSpeeds.length === 0) return;

    const x_hat = this.runKalmanFilter(this.rawSpeeds, this.Q, this.R);
    const avgSpeed = this.rawSpeeds.reduce((sum, val) => sum + val, 0) / this.rawSpeeds.length;
    const avgArray = Array(this.rawSpeeds.length).fill(avgSpeed);

    this.mseRawVsAvg = this.meanSquaredError(avgArray, this.rawSpeeds);
    this.mseKalmanVsAvg = this.meanSquaredError(avgArray, x_hat);

    this.plot(this.rawSpeeds, x_hat, avgArray);
  }

  runKalmanFilter(z: number[], Q: number, R: number): number[] {
    const n_iter = z.length;
    const x_hat = Array(n_iter).fill(0);
    const p = Array(n_iter).fill(0);

    x_hat[0] = z[0];
    p[0] = 1.0;

    for (let k = 1; k < n_iter; k++) {
      const x_hat_minus = x_hat[k - 1];
      const p_minus = p[k - 1] + Q;
      const K = p_minus / (p_minus + R);
      x_hat[k] = x_hat_minus + K * (z[k] - x_hat_minus);
      p[k] = (1 - K) * p_minus;
    }
    return x_hat;
  }

  meanSquaredError(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0) / a.length;
  }

  plot(z: number[], x_hat: number[], avg: number[]) {
    const data: any = [
      {
        x: z.map((_, i) => i + 1),
        y: z,
        mode: 'markers+lines',
        name: 'Реальні тести Speedtest',
        line: { color: '#95a5a6', dash: 'dot' },
        marker: { size: 8, color: '#ef553b' },
        type: 'scatter'
      },
      {
        x: x_hat.map((_, i) => i + 1),
        y: x_hat,
        name: 'Рекурсивна оцінка Калмана',
        line: { color: '#2980b9', width: 3 },
        type: 'scatter'
      },
      {
        x: avg.map((_, i) => i + 1),
        y: avg,
        name: 'Середня пропускна здатність',
        line: { color: '#27ae60', width: 2, dash: 'dash' },
        type: 'scatter'
      }
    ];

    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)', 
      plot_bgcolor: 'rgba(0,0,0,0)',  
      font: { color: '#fafafa' },      
      title: `Аналіз пропускної здатності за серію №${Number(this.selectedTestIndex) + 1} (${this.testDate})`,
      xaxis: { title: 'Номер тесту в серії', gridcolor: '#333' },
      yaxis: { title: 'Швидкість (Мбіт/с)', gridcolor: '#333' },
      margin: { t: 50, b: 50, l: 50, r: 20 },
      legend: { orientation: 'h', y: -0.2 }
    };

    Plotly.newPlot('recursive-chart', data, layout, { responsive: true });
  }
}