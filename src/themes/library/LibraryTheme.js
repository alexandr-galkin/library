import { createBookSVG, BOOK_COLORS, BOOK_SIZES, BOOK_GENRES, BOOK_SYMBOLS, BOOK_THICKNESS } from './BookAssets.js';

export class LibraryTheme {
  constructor() {
    this.name = 'library';
    this.displayName = 'Библиотека';
    this.description = 'Разложи книги по полкам';
  }

  injectStyles() {
    if (document.getElementById('library-theme-styles')) return;
    const style = document.createElement('style');
    style.id = 'library-theme-styles';
    style.textContent = `
      /* ============ ОСНОВНЫЕ СТИЛИ ============ */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        background: #1a120c;
        color: #f5f0e6;
        touch-action: manipulation;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }

      #app {
        width: 100%;
        height: 100%;
        position: relative;
      }

      /* ============ МЕНЮ ============ */
      .menu-overlay {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a120c 0%, #2a1f15 50%, #1a120c 100%);
        overflow: hidden;
      }

      .menu-container {
        position: relative;
        width: 100%;
        max-width: 480px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        z-index: 1;
      }

      .menu-background {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }

      .menu-particles {
        position: absolute;
        inset: 0;
        background: 
          radial-gradient(circle at 20% 80%, rgba(201,162,39,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139,105,20,0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(61,43,31,0.3) 0%, transparent 70%);
        animation: pulseBackground 4s ease-in-out infinite;
      }

      @keyframes pulseBackground {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }

      .menu-books-decoration {
        position: absolute;
        inset: 0;
      }

      .floating-book {
        position: absolute;
        font-size: 2rem;
        opacity: 0.3;
        filter: blur(1px);
        animation: floatBook 4s ease-in-out infinite;
      }

      .book-1 { top: 10%; left: 15%; animation-delay: 0s; }
      .book-2 { top: 20%; right: 20%; animation-delay: 0.5s; }
      .book-3 { bottom: 30%; left: 10%; animation-delay: 1s; }
      .book-4 { bottom: 20%; right: 15%; animation-delay: 1.5s; }
      .book-5 { top: 50%; left: 50%; animation-delay: 2s; }

      @keyframes floatBook {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-20px) rotate(5deg); }
        50% { transform: translateY(0) rotate(0deg); }
        75% { transform: translateY(10px) rotate(-5deg); }
      }

      .menu-content {
        position: relative;
        z-index: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        opacity: 1;
      }

      .menu-header {
        text-align: center;
      }

      .menu-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 12px;
      }

      .logo-icon {
        font-size: 3rem;
        animation: bounce 2s ease-in-out infinite;
      }

      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      .logo-text {
        text-align: left;
      }

      .menu-title {
        font-size: 2rem;
        font-weight: 900;
        letter-spacing: 1px;
        background: linear-gradient(135deg, #e8d48b 0%, #c9a227 50%, #e8d48b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
      }

      .menu-subtitle {
        font-size: 1rem;
        color: #b8a88a;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .menu-description {
        font-size: 0.9rem;
        color: #8b7b6b;
        line-height: 1.6;
        margin: 0;
      }

      .menu-stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        width: 100%;
      }

      .stat-card {
        background: linear-gradient(135deg, rgba(61,43,31,0.8), rgba(42,31,21,0.8));
        border: 1px solid rgba(139,105,20,0.3);
        border-radius: 16px;
        padding: 16px 12px;
        text-align: center;
        transition: all 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        border-color: rgba(201,162,39,0.5);
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      }

      .stat-icon {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 1.4rem;
        font-weight: 800;
        color: #e8d48b;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 0.7rem;
        color: #8b7b6b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .menu-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }

      .play-button {
        position: relative;
        padding: 18px 24px;
        border: none;
        border-radius: 16px;
        background: linear-gradient(135deg, #c9a227 0%, #b8860b 100%);
        color: #2a1f15;
        font-size: 1.2rem;
        font-weight: 800;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .play-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(201,162,39,0.4);
      }

      .play-button:active {
        transform: scale(0.98);
      }

      .play-icon {
        font-size: 1.3rem;
      }

      .settings-button {
        padding: 14px 24px;
        border: 1px solid rgba(139,105,20,0.4);
        border-radius: 16px;
        background: rgba(61,43,31,0.6);
        color: #b8a88a;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .settings-button:hover {
        background: rgba(61,43,31,0.8);
        border-color: rgba(201,162,39,0.6);
        color: #e8d48b;
      }

      .menu-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 4px;
      }

      .version {
        font-size: 0.7rem;
        color: #5c4a3a;
      }

      .hint {
        font-size: 0.75rem;
        color: #8b7b6b;
      }

      /* ============ НАСТРОЙКИ ============ */
      .settings-content {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 400px;
        opacity: 1;
      }

      .settings-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .settings-title {
        font-size: 1.8rem;
        font-weight: 800;
        color: #e8d48b;
        margin: 0 0 8px 0;
      }

      .settings-subtitle {
        font-size: 0.9rem;
        color: #8b7b6b;
      }

      .settings-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 32px;
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: rgba(61,43,31,0.6);
        border: 1px solid rgba(139,105,20,0.2);
        border-radius: 16px;
        transition: all 0.3s ease;
      }

      .setting-item:hover {
        border-color: rgba(201,162,39,0.4);
      }

      .setting-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .setting-icon {
        font-size: 1.5rem;
      }

      .setting-text {
        display: flex;
        flex-direction: column;
      }

      .setting-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: #e8d48b;
      }

      .setting-desc {
        font-size: 0.75rem;
        color: #8b7b6b;
        margin-top: 2px;
      }

      .toggle-switch {
        width: 52px;
        height: 28px;
        background: rgba(42,31,21,0.8);
        border-radius: 14px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid rgba(139,105,20,0.3);
        flex-shrink: 0;
      }

      .toggle-switch.active {
        background: #c9a227;
        border-color: #b8860b;
      }

      .toggle-slider {
        width: 20px;
        height: 20px;
        background: #b8a88a;
        border-radius: 50%;
        position: absolute;
        top: 2px;
        left: 2px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .toggle-switch.active .toggle-slider {
        left: 26px;
        background: #fff;
      }

      .back-button {
        width: 100%;
        padding: 14px;
        border: 1px solid rgba(139,105,20,0.4);
        border-radius: 16px;
        background: rgba(61,43,31,0.6);
        color: #b8a88a;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .back-button:hover {
        background: rgba(61,43,31,0.8);
        border-color: rgba(201,162,39,0.6);
        color: #e8d48b;
      }

      .back-icon {
        font-size: 1.2rem;
      }

      /* ============ ИГРОВОЙ ФОН ============ */
      .library-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        background: linear-gradient(180deg, 
          #0d0805 0%,
          #1a120c 15%,
          #2a1a10 30%,
          #3d2b1f 50%,
          #4a3525 70%,
          #3d2b1f 85%,
          #2a1f15 100%
        );
        overflow: hidden;
      }

      .library-floor {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 15%;
        background: 
          repeating-linear-gradient(
            90deg,
            #4a3525 0px,
            #5c4033 40px,
            #4a3525 80px,
            #3d2b1f 120px
          );
        box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
      }

      .library-carpet {
        position: absolute;
        bottom: 2%;
        left: 50%;
        transform: translateX(-50%);
        width: 70%;
        height: 12%;
        background: linear-gradient(135deg, 
          #4a3525 0%,
          #5c4033 30%,
          #4a3525 60%,
          #3d2b1f 100%
        );
        border-radius: 50%;
        box-shadow: 
          0 5px 15px rgba(0,0,0,0.5),
          inset 0 0 30px rgba(0,0,0,0.3);
        opacity: 0.5;
      }

      .library-shelves {
        position: absolute;
        top: 3%;
        left: 0;
        right: 0;
        height: 40%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
      }

      .shelf-row {
        flex: 1;
        background: linear-gradient(180deg, 
          #2a1a10 0%,
          #3d2b1f 50%,
          #2a1a10 100%
        );
        border-radius: 3px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        gap: 3px;
        padding: 0 8px;
        box-shadow: 
          inset 0 2px 10px rgba(0,0,0,0.6),
          0 2px 4px rgba(0,0,0,0.3);
        overflow: hidden;
      }

      .shelf-book {
        width: 16px;
        border-radius: 2px 2px 0 0;
        box-shadow: 
          1px 0 3px rgba(0,0,0,0.5),
          inset 0 0 5px rgba(255,255,255,0.1);
      }

      .shelf-plank {
        height: 6px;
        background: linear-gradient(180deg, 
          #8b6914 0%,
          #6b4e31 50%,
          #4a3525 100%
        );
        border-radius: 2px;
        box-shadow: 
          0 2px 4px rgba(0,0,0,0.5),
          inset 0 1px 2px rgba(255,255,255,0.1);
      }

      .library-window {
        position: absolute;
        top: 8%;
        right: 5%;
        width: 180px;
        height: 220px;
        z-index: 2;
      }

      .window-frame {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #6b4e31, #4a3525);
        border-radius: 10px;
        padding: 10px;
        box-shadow: 
          0 10px 30px rgba(0,0,0,0.7),
          inset 0 0 0 3px #5c4033;
      }

      .window-glass {
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, 
          #0a1520 0%,
          #1a2a3a 40%,
          #2a3a4a 70%,
          #3a4a5a 100%
        );
        border-radius: 5px;
        position: relative;
        overflow: hidden;
      }

      .moon {
        position: absolute;
        top: 15%;
        right: 20%;
        width: 45px;
        height: 45px;
        background: radial-gradient(circle at 35% 35%, #ffffff, #e8e0d0);
        border-radius: 50%;
        box-shadow: 
          0 0 40px rgba(232,224,208,0.6),
          0 0 80px rgba(232,224,208,0.3);
      }

      .star {
        position: absolute;
        background: white;
        border-radius: 50%;
        animation: twinkle 2s ease-in-out infinite;
      }

      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
      }

      .library-lamp {
        position: absolute;
        top: 30%;
        left: 3%;
        width: 100px;
        height: 150px;
        z-index: 2;
      }

      .lamp-base {
        position: absolute;
        bottom: 0;
        left: 35px;
        width: 30px;
        height: 15px;
        background: linear-gradient(180deg, #5c4033, #3d2b1f);
        border-radius: 5px;
      }

      .lamp-shade {
        position: absolute;
        bottom: 15px;
        left: 20px;
        width: 60px;
        height: 70px;
        background: linear-gradient(180deg, #d4a017, #b8860b);
        border-radius: 30px 30px 12px 12px;
        box-shadow: 0 0 30px rgba(212,160,23,0.4);
      }

      .lamp-glow {
        position: absolute;
        bottom: 15px;
        left: -30px;
        width: 160px;
        height: 160px;
        background: radial-gradient(circle, 
          rgba(212,160,23,0.35) 0%, 
          rgba(212,160,23,0.15) 40%,
          transparent 70%
        );
        pointer-events: none;
        animation: lampPulse 3s ease-in-out infinite;
      }

      @keyframes lampPulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }

      .library-plant {
        position: absolute;
        bottom: 20%;
        right: 3%;
        width: 70px;
        height: 100px;
        z-index: 2;
      }

      .pot {
        position: absolute;
        bottom: 0;
        left: 20px;
        width: 30px;
        height: 25px;
        background: linear-gradient(180deg, #c9a227, #8b6914);
        border-radius: 4px 4px 12px 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }

      .leaf {
        position: absolute;
        background: linear-gradient(135deg, #2d5a2d, #1a3a1a);
        border-radius: 50% 50% 50% 0;
        transform-origin: bottom center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      .leaf.l1 { 
        width: 25px; 
        height: 40px; 
        bottom: 25px; 
        left: 22px; 
        transform: rotate(-15deg); 
      }
      
      .leaf.l2 { 
        width: 22px; 
        height: 35px; 
        bottom: 28px; 
        left: 30px; 
        transform: rotate(10deg); 
      }
      
      .leaf.l3 { 
        width: 20px; 
        height: 30px; 
        bottom: 22px; 
        left: 12px; 
        transform: rotate(-30deg); 
      }

      .dust-particles {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .dust {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(232,224,208,0.5);
        border-radius: 50%;
        animation: floatDust 10s linear infinite;
      }

      @keyframes floatDust {
        0% { transform: translateY(100vh) translateX(0); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.5; }
        100% { transform: translateY(-10vh) translateX(50px); opacity: 0; }
      }

      /* ============ ИГРОВОЙ СТОЛ ============ */
      .game-table {
        position: absolute;
        bottom: 18%;
        left: 50%;
        transform: translateX(-50%);
        width: 92%;
        max-width: 720px;
        height: 22%;
        background: linear-gradient(180deg, #6b4e31, #5c4033);
        border-radius: 12px 12px 4px 4px;
        box-shadow: 
          0 8px 24px rgba(0,0,0,0.5),
          inset 0 2px 4px rgba(255,255,255,0.05);
        z-index: 10;
      }

      .game-table::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: linear-gradient(180deg, #8b6914, #6b4e31);
        border-radius: 12px 12px 0 0;
      }

      /* ============ HUD ============ */
      .hud-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: linear-gradient(180deg, rgba(26,18,12,0.9), rgba(26,18,12,0.6));
        backdrop-filter: blur(8px);
      }

      .hud-item {
        font-size: 0.8rem;
        font-weight: 600;
        color: #b8a88a;
        white-space: nowrap;
      }

      .hud-item span {
        color: #e8d48b;
        font-weight: 800;
      }

      .menu-button {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: rgba(61,43,31,0.8);
        border: 1px solid rgba(139,105,20,0.4);
        border-radius: 8px;
        color: #b8a88a;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
      }

      .menu-button:hover {
        background: rgba(61,43,31,0.9);
        border-color: rgba(201,162,39,0.6);
        color: #e8d48b;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }

      .menu-button:active {
        transform: scale(0.95);
      }

      .menu-icon {
        font-size: 1rem;
      }

      .menu-text {
        font-size: 0.75rem;
      }

      /* ============ БАННЕР ПРАВИЛ ============ */
      .rule-banner {
        position: absolute;
        top: 52px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(74,53,37,0.95), rgba(61,43,31,0.95));
        border: 1px solid #5c4033;
        border-radius: 12px;
        padding: 10px 20px;
        text-align: center;
        z-index: 40;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        max-width: 90%;
      }

      .rule-banner h2 {
        font-size: clamp(0.85rem, 3vw, 1.1rem);
        font-weight: 700;
        color: #e8d48b;
        letter-spacing: 0.5px;
      }

      .rule-banner .sub {
        font-size: 0.75rem;
        color: #b8a88a;
        margin-top: 2px;
      }

      /* ============ ЗОНЫ ============ */
      .objects-zone {
        position: absolute;
        bottom: 42%;
        left: 50%;
        transform: translateX(-50%);
        width: 88%;
        max-width: 680px;
        height: 14%;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        align-items: center;
        z-index: 20;
        padding: 8px;
      }

      .containers-zone {
        position: absolute;
        bottom: 2%;
        left: 50%;
        transform: translateX(-50%);
        width: 96%;
        max-width: 760px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 8px;
        z-index: 20;
        padding: 8px;
      }

      /* ============ КОНТЕЙНЕРЫ ============ */
      .shelf-container {
        background: linear-gradient(180deg, #4a3525, #3d2b1f);
        border: 2px solid #5c4033;
        border-radius: 12px;
        box-shadow: 
          inset 0 2px 8px rgba(0,0,0,0.4),
          0 4px 12px rgba(0,0,0,0.3);
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s, box-shadow 0.3s;
      }

      .shelf-container.highlight {
        border-color: #4ecca3;
        box-shadow: 
          inset 0 2px 8px rgba(0,0,0,0.4),
          0 0 20px rgba(78,204,163,0.3);
      }

      .shelf-container.reject {
        border-color: #e94560;
        box-shadow: 
          inset 0 2px 8px rgba(0,0,0,0.4),
          0 0 20px rgba(233,69,96,0.3);
      }

      .shelf-container.forbidden {
        border-color: #e94560;
        background: linear-gradient(180deg, rgba(233,69,96,0.1), #3d2b1f);
      }

      .shelf-label {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #b8a88a;
        text-align: center;
        padding: 6px 4px;
        border-bottom: 1px solid rgba(92,64,51,0.5);
      }

      .shelf-items {
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
        justify-content: center;
        padding: 6px;
        align-content: flex-start;
        min-height: 60px;
      }

      /* ============ КНИГИ ============ */
      .book-item {
        cursor: grab;
        user-select: none;
        touch-action: none;
        transition: transform 0.15s, filter 0.15s;
        position: relative;
        z-index: 20;
      }

      .book-item:hover {
        transform: translateY(-4px) scale(1.05);
        filter: brightness(1.1);
      }

      .book-item.dragging {
        position: fixed !important;
        z-index: 1000 !important;
        transform: scale(1.12) rotate(3deg) !important;
        filter: drop-shadow(0 12px 24px rgba(0,0,0,0.5)) brightness(1.15) !important;
        pointer-events: none;
      }

      .book-item.correct {
        animation: bookCorrect 0.5s forwards;
      }

      @keyframes bookCorrect {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(0); opacity: 0; }
      }

      .book-item.shake {
        animation: bookShake 0.4s;
      }

      @keyframes bookShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-6px); }
        80% { transform: translateX(6px); }
      }

      /* ============ МОДАЛЬНЫЕ ОКНА ============ */
      .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 200;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(26,18,12,0.85);
        backdrop-filter: blur(12px);
        padding: 20px;
      }

      .modal-overlay.active {
        display: flex;
      }

      .modal-card {
        background: linear-gradient(180deg, #4a3525, #3d2b1f);
        border: 2px solid #5c4033;
        border-radius: 20px;
        padding: 28px;
        max-width: 360px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        text-align: center;
      }

      .modal-title {
        font-size: 1.6rem;
        font-weight: 800;
        color: #e8d48b;
        margin-bottom: 8px;
      }

      .menu-btn {
        display: block;
        width: 100%;
        padding: 14px;
        margin-bottom: 10px;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }

      .menu-btn-primary {
        background: linear-gradient(135deg, #c9a227, #b8860b);
        color: #2a1f15;
        box-shadow: 0 4px 16px rgba(201,162,39,0.3);
      }

      .menu-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(201,162,39,0.4);
      }

      .menu-btn-secondary {
        background: rgba(92,64,51,0.6);
        color: #f5f0e6;
        border: 1px solid #5c4033;
      }

      .menu-btn-secondary:hover {
        background: rgba(92,64,51,0.8);
      }

      /* ============ КОМБО ============ */
      .combo-display {
        position: fixed;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1.2rem;
        font-weight: 900;
        color: #f9a825;
        z-index: 110;
        pointer-events: none;
        text-shadow: 0 2px 12px rgba(249,168,37,0.4);
        opacity: 0;
        transition: opacity 0.3s;
      }

      .combo-display.show {
        opacity: 1;
        animation: comboPulse 0.5s;
      }

      @keyframes comboPulse {
        0% { transform: translateX(-50%) scale(0.5); }
        50% { transform: translateX(-50%) scale(1.2); }
        100% { transform: translateX(-50%) scale(1); }
      }

      /* ============ ВСПЛЫВАЮЩИЕ ОЧКИ ============ */
      .score-popup {
        position: fixed;
        font-weight: 800;
        font-size: 1.1rem;
        color: #4ecca3;
        pointer-events: none;
        z-index: 120;
        animation: floatUp 1s forwards;
        text-shadow: 0 2px 8px rgba(0,0,0,0.5);
      }

      @keyframes floatUp {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
      }

      /* ============ АДАПТИВНОСТЬ ============ */
      @media (max-width: 480px) {
        .library-window { display: none; }
        .library-lamp { transform: scale(0.7); }
        .library-plant { transform: scale(0.7); right: 2%; }
        .containers-zone { grid-template-columns: repeat(2, 1fr); }
        .objects-zone { gap: 8px; }
        .menu-text { display: none; }
        .menu-button { padding: 8px; }
      }

      @media (min-width: 1024px) {
        .game-table { width: 70%; }
        .objects-zone { width: 65%; }
        .containers-zone { width: 70%; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  renderBackground(container) {
    container.innerHTML = `
      <div class="library-floor"></div>
      <div class="library-carpet"></div>
      
      <div class="library-shelves">
        <div class="shelf-row">
          ${this.generateShelfBooks(15)}
        </div>
        <div class="shelf-plank"></div>
        <div class="shelf-row">
          ${this.generateShelfBooks(18)}
        </div>
        <div class="shelf-plank"></div>
        <div class="shelf-row">
          ${this.generateShelfBooks(12)}
        </div>
      </div>
      
      <div class="library-window">
        <div class="window-frame">
          <div class="window-glass">
            <div class="moon"></div>
            <div class="star" style="top:20%;left:30%;width:3px;height:3px;"></div>
            <div class="star" style="top:40%;left:60%;width:2px;height:2px;"></div>
            <div class="star" style="top:60%;left:20%;width:3px;height:3px;"></div>
            <div class="star" style="top:25%;left:70%;width:2px;height:2px;"></div>
            <div class="star" style="top:50%;left:40%;width:2px;height:2px;"></div>
          </div>
        </div>
      </div>
      
      <div class="library-lamp">
        <div class="lamp-shade"></div>
        <div class="lamp-base"></div>
        <div class="lamp-glow"></div>
      </div>
      
      <div class="library-plant">
        <div class="leaf l1"></div>
        <div class="leaf l2"></div>
        <div class="leaf l3"></div>
        <div class="pot"></div>
      </div>
      
      <div class="dust-particles">
        ${this.generateDustParticles(20)}
      </div>
    `;
  }

  generateShelfBooks(count) {
    const colors = ['#8b2323', '#1e3a5f', '#1a4a1a', '#b8860b', '#4b0082', '#5c4033', '#2a2a2a', '#d0d0d0'];
    let books = '';
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const height = 40 + Math.random() * 40;
      books += `<div class="shelf-book" style="background:${color};height:${height}%;"></div>`;
    }
    return books;
  }

  generateDustParticles(count) {
    let particles = '';
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = 5 + Math.random() * 10;
      particles += `<div class="dust" style="left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s;"></div>`;
    }
    return particles;
  }

  renderBook(book) {
    const div = document.createElement('div');
    div.className = 'book-item';
    div.dataset.uid = book.uid;
    div.innerHTML = createBookSVG(book);
    div.setAttribute('aria-label', `Книга ${book.color} ${book.size}`);
    return div;
  }

  getBookLabels() {
    return {
      color: Object.fromEntries(Object.entries(BOOK_COLORS).map(([k,v]) => [k, v.name])),
      size: Object.fromEntries(Object.entries(BOOK_SIZES).map(([k,v]) => [k, v.name])),
      genre: Object.fromEntries(Object.entries(BOOK_GENRES).map(([k,v]) => [k, v.name])),
      symbol: Object.fromEntries(Object.entries(BOOK_SYMBOLS).map(([k,v]) => [k, v.name])),
      thickness: Object.fromEntries(Object.entries(BOOK_THICKNESS).map(([k,v]) => [k, v.name])),
    };
  }

  getAllBookProperties() {
    return {
      colors: Object.keys(BOOK_COLORS),
      sizes: Object.keys(BOOK_SIZES),
      genres: Object.keys(BOOK_GENRES),
      symbols: Object.keys(BOOK_SYMBOLS),
      thicknesses: Object.keys(BOOK_THICKNESS),
    };
  }
}