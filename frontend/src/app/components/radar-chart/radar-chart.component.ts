import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

/**
 * RadarChartComponent — Canvas-based 5-axis radar visualization
 * for multi-dimensional match scoring.
 */
@Component({
  selector: 'tr-radar-chart',
  standalone: true,
  template: `<canvas #radarCanvas [width]="size" [height]="size" class="radar-canvas"></canvas>`,
  styles: [`
    .radar-canvas {
      display: block;
    }
  `]
})
export class RadarChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('radarCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() size: number = 220;
  @Input() skillScore: number = 0;
  @Input() gpaScore: number = 0;
  @Input() authScore: number = 0;
  @Input() experienceScore: number = 50; // Placeholder for future
  @Input() overallScore: number = 0;

  private ctx!: CanvasRenderingContext2D;
  private currentValues = [0, 0, 0, 0, 0];
  private targetValues = [0, 0, 0, 0, 0];
  private labels = ['Skills', 'GPA', 'Auth', 'Experience', 'Overall'];
  private animFrame: number = 0;

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.updateTargets();
    this.animateIn();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ctx) {
      this.updateTargets();
      this.animateIn();
    }
  }

  private updateTargets(): void {
    this.targetValues = [
      this.skillScore / 100,
      this.gpaScore / 100,
      this.authScore / 100,
      this.experienceScore / 100,
      this.overallScore / 100,
    ];
  }

  private animateIn(): void {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

    const startValues = [...this.currentValues];
    const startTime = performance.now();
    const duration = 1000;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      for (let i = 0; i < 5; i++) {
        this.currentValues[i] = startValues[i] + (this.targetValues[i] - startValues[i]) * eased;
      }

      this.draw();

      if (progress < 1) {
        this.animFrame = requestAnimationFrame(step);
      }
    };

    this.animFrame = requestAnimationFrame(step);
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR = Math.min(cx, cy) - 30;
    const sides = 5;
    const angleStep = (Math.PI * 2) / sides;
    const startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid rings (3 levels)
    for (let level = 1; level <= 3; level++) {
      const r = (maxR * level) / 3;
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = startAngle + i * angleStep;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw data polygon fill
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const r = maxR * this.currentValues[i];
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Gradient fill
    const grad = ctx.createLinearGradient(cx - maxR, cy - maxR, cx + maxR, cy + maxR);
    grad.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
    grad.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke
    const strokeGrad = ctx.createLinearGradient(cx - maxR, cy - maxR, cx + maxR, cy + maxR);
    strokeGrad.addColorStop(0, 'rgba(124, 58, 237, 0.7)');
    strokeGrad.addColorStop(1, 'rgba(6, 182, 212, 0.7)');
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const r = maxR * this.currentValues[i];
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = this.currentValues[i] >= 0.8 ? '#10b981'
                     : this.currentValues[i] >= 0.6 ? '#06b6d4'
                     : this.currentValues[i] >= 0.4 ? '#f59e0b' : '#f43f5e';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw labels
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const labelR = maxR + 18;
      const x = cx + Math.cos(angle) * labelR;
      const y = cy + Math.sin(angle) * labelR;

      ctx.fillStyle = 'rgba(240, 240, 245, 0.5)';
      ctx.fillText(this.labels[i], x, y);
    }
  }
}
