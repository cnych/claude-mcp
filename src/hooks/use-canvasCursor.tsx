import { useEffect } from 'react';

interface CanvasParams {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
  spring?: number;
}

// 添加扩展以解决 canvas context 的类型问题
interface CanvasRenderingContext2DExtended extends CanvasRenderingContext2D {
  running: boolean;
  frame: number;
}

const useCanvasCursor = () => {
  class WaveGenerator {
    phase!: number;
    offset!: number;
    frequency!: number;
    amplitude!: number;

    constructor(params: CanvasParams = {}) {
      this.init(params);
    }

    init(params: CanvasParams): void {
      this.phase = params.phase || 0;
      this.offset = params.offset || 0;
      this.frequency = params.frequency || 0.001;
      this.amplitude = params.amplitude || 1;
    }

    update(): number {
      this.phase += this.frequency;
      return (this.offset + Math.sin(this.phase) * this.amplitude);
    }

    value(): number {
      return this.offset + Math.sin(this.phase) * this.amplitude;
    }
  }

  class Node {
    x: number = 0;
    y: number = 0;
    vx: number = 0;
    vy: number = 0;
  }

  class Line {
    spring!: number;
    friction!: number;
    nodes: Node[] = [];

    constructor(params: CanvasParams = {}) {
      this.init(params);
    }

    init(params: CanvasParams): void {
      this.spring = (params.spring || 0) + 0.1 * Math.random() - 0.02;
      this.friction = E.friction + 0.01 * Math.random() - 0.002;
      this.nodes = [];
      for (let i = 0; i < E.size; i++) {
        const node = new Node();
        node.x = pos.x;
        node.y = pos.y;
        this.nodes.push(node);
      }
    }

    update(): void {
      let springFactor = this.spring;
      const firstNode = this.nodes[0];
      firstNode.vx += (pos.x - firstNode.x) * springFactor;
      firstNode.vy += (pos.y - firstNode.y) * springFactor;
      
      for (let i = 0, len = this.nodes.length; i < len; i++) {
        const currentNode = this.nodes[i];
        if (i > 0) {
          const prevNode = this.nodes[i - 1];
          currentNode.vx += (prevNode.x - currentNode.x) * springFactor;
          currentNode.vy += (prevNode.y - currentNode.y) * springFactor;
          currentNode.vx += prevNode.vx * E.dampening;
          currentNode.vy += prevNode.vy * E.dampening;
        }
        currentNode.vx *= this.friction;
        currentNode.vy *= this.friction;
        currentNode.x += currentNode.vx;
        currentNode.y += currentNode.vy;
        springFactor *= E.tension;
      }
    }

    draw(): void {
      let curNode, nextNode;
      let x = this.nodes[0].x;
      let y = this.nodes[0].y;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      for (let i = 1, len = this.nodes.length - 2; i < len; i++) {
        curNode = this.nodes[i];
        nextNode = this.nodes[i + 1];
        x = 0.5 * (curNode.x + nextNode.x);
        y = 0.5 * (curNode.y + nextNode.y);
        ctx.quadraticCurveTo(curNode.x, curNode.y, x, y);
      }
      
      curNode = this.nodes[this.nodes.length - 2];
      nextNode = this.nodes[this.nodes.length - 1];
      ctx.quadraticCurveTo(curNode.x, curNode.y, nextNode.x, nextNode.y);
      ctx.stroke();
      ctx.closePath();
    }
  }

  function onMousemove(e: MouseEvent | TouchEvent): void {
    function initLines(): void {
      lines = [];
      for (let i = 0; i < E.trails; i++) {
        lines.push(new Line({ spring: 0.4 + (i / E.trails) * 0.025 }));
      }
    }
    
    function handleMouse(e: MouseEvent | TouchEvent): void {
      if ('touches' in e && e.touches) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      } else if ('clientX' in e) {
        pos.x = e.clientX;
        pos.y = e.clientY;
      }
      e.preventDefault();
    }
    
    function handleTouchStart(e: TouchEvent): void {
      if (e.touches.length === 1) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      }
    }
    
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('touchstart', onMousemove as EventListener);
    document.addEventListener('mousemove', handleMouse as EventListener);
    document.addEventListener('touchmove', handleMouse as EventListener);
    document.addEventListener('touchstart', handleTouchStart);
    handleMouse(e);
    initLines();
    render();
  }

  function render(): void {
    if (ctx.running) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `hsla(${Math.round(wave.update())},50%,50%,0.2)`;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < E.trails; i++) {
        const line = lines[i];
        line.update();
        line.draw();
      }
      
      ctx.frame++;
      window.requestAnimationFrame(render);
    }
  }

  function resizeCanvas(): void {
    if (ctx && ctx.canvas) {
      ctx.canvas.width = window.innerWidth - 20;
      ctx.canvas.height = window.innerHeight;
    }
  }

  let ctx: CanvasRenderingContext2DExtended;
  let wave: WaveGenerator;
  const pos: { x: number; y: number } = { x: 0, y: 0 };
  let lines: Line[] = [];
  const E = {
    debug: true,
    friction: 0.5,
    trails: 20,
    size: 50,
    dampening: 0.25,
    tension: 0.98,
  };
  
  const renderCanvas = function (): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    ctx = canvas.getContext('2d') as CanvasRenderingContext2DExtended;
    if (!ctx) return;
    
    ctx.running = true;
    ctx.frame = 1;
    wave = new WaveGenerator({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });
    
    document.addEventListener('mousemove', onMousemove as EventListener);
    document.addEventListener('touchstart', onMousemove as EventListener);
    document.body.addEventListener('orientationchange', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    
    const handleFocus = () => {
      if (ctx && !ctx.running) {
        ctx.running = true;
        render();
      }
    };
    
    const handleBlur = () => {
      if (ctx) ctx.running = true;
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    resizeCanvas();
  };

  useEffect(() => {
    renderCanvas();

    return () => {
      if (ctx) ctx.running = false;
      document.removeEventListener('mousemove', onMousemove as EventListener);
      document.removeEventListener('touchstart', onMousemove as EventListener);
      document.body.removeEventListener('orientationchange', resizeCanvas);
      window.removeEventListener('resize', resizeCanvas);
      
      // 使用函数引用移除事件监听器
      const handleFocus = () => {
        if (ctx && !ctx.running) {
          ctx.running = true;
          render();
        }
      };
      
      const handleBlur = () => {
        if (ctx) ctx.running = true;
      };
      
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
};

export default useCanvasCursor;