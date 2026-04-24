import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import jsPDF from "jspdf";

const TOTAL_SLIDES = 5;

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [printing, setPrinting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current || index < 0 || index >= TOTAL_SLIDES) return;
      setDirection(index > current ? "next" : "prev");
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 420);
    },
    [animating, current]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo]);

  const exportPDF = async () => {
    if (printing) return;
    setPrinting(true);
    setExportStatus("Загружаю шрифт...");

    const W = 297, H = 210; // A4 landscape mm
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Load Roboto TTF with Cyrillic support
    const fontUrl = "https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-cyrillic-400-normal.ttf";
    let fontLoaded = false;
    try {
      const resp = await fetch(fontUrl);
      const buf = await resp.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const fontBase64 = btoa(binary);
      pdf.addFileToVFS("Roboto.ttf", fontBase64);
      pdf.addFont("Roboto.ttf", "Roboto", "normal");
      pdf.addFont("Roboto.ttf", "Roboto", "bold");
      fontLoaded = true;
    } catch {
      // fallback to helvetica
    }

    const FONT = fontLoaded ? "Roboto" : "helvetica";
    setExportStatus("Генерирую PDF...");

      const BG = "#08091a";
      const WHITE = "#ffffff";
      const CYAN = "#00f5c4";
      const CORAL = "#ff6b6b";
      const VIOLET = "#a78bfa";
      const GOLD = "#fbbf24";
      const DIM = "#7a7fa8";
      const DIMMER = "#3a3f6a";

      const bg = (p: jsPDF) => {
        p.setFillColor(BG);
        p.rect(0, 0, W, H, "F");
      };

      const label = (p: jsPDF, txt: string, x: number, y: number) => {
        p.setFontSize(8);
        p.setTextColor(DIM);
        p.setFont(FONT, "bold");
        p.text(txt.toUpperCase(), x, y);
      };

      const body = (p: jsPDF, txt: string, x: number, y: number, maxW = 120) => {
        p.setFontSize(9.5);
        p.setFont(FONT, "normal");
        p.setTextColor(DIM);
        const lines = p.splitTextToSize(txt, maxW);
        p.text(lines, x, y);
      };

      const card = (p: jsPDF, x: number, y: number, w: number, h: number, borderColor: string) => {
        p.setFillColor(14, 16, 40);
        p.roundedRect(x, y, w, h, 3, 3, "F");
        p.setDrawColor(borderColor);
        p.setLineWidth(0.4);
        p.roundedRect(x, y, w, h, 3, 3, "S");
      };

      // ─── SLIDE 1 ───────────────────────────────────────────────
      bg(pdf);
      // Accent orb (simulated with soft circle)
      pdf.setFillColor(0, 50, 180);
      pdf.circle(-10, 20, 60, "F");
      pdf.setFillColor(8, 9, 26);
      pdf.circle(-10, 20, 50, "F");

      // Tag
      pdf.setFillColor(30, 33, 65);
      pdf.roundedRect(20, 18, 70, 8, 2, 2, "F");
      pdf.setFontSize(7.5);
      pdf.setTextColor(CYAN);
      pdf.setFont(FONT, "bold");
      pdf.text("● КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ", 24, 23.5);

      // Title
      pdf.setFontSize(42);
      pdf.setFont(FONT, "bold");
      pdf.setTextColor(WHITE);
      pdf.text("Разработка", 20, 50);
      pdf.setTextColor(CYAN);
      pdf.text("сайта", 20, 72);

      // Subtitle
      body(pdf, "Для консалтинговой компании — кастомное\nрешение под ваш бренд и задачи", 20, 87, 140);

      // Chips
      const chips = ["React", "Без конструкторов", "Под ключ"];
      let cx = 20;
      chips.forEach(chip => {
        const cw = chip.length * 2.3 + 8;
        pdf.setFillColor(30, 33, 65);
        pdf.roundedRect(cx, 96, cw, 7, 1.5, 1.5, "F");
        pdf.setFontSize(7);
        pdf.setTextColor(DIM);
        pdf.setFont(FONT, "normal");
        pdf.text(chip, cx + 4, 100.5);
        cx += cw + 4;
      });

      // Info cards right
      const infoCards = [
        { label: "Срок", val: "7–14 дней", color: CYAN },
        { label: "Стоимость", val: "40 000 ₽", color: CORAL },
        { label: "Доработки", val: "5 бесплатно", color: VIOLET },
      ];
      infoCards.forEach((ic, i) => {
        const cy = 30 + i * 42;
        card(pdf, 210, cy, 70, 34, ic.color);
        pdf.setFontSize(7);
        pdf.setTextColor(DIM);
        pdf.setFont(FONT, "normal");
        pdf.text(ic.label, 216, cy + 10);
        pdf.setFontSize(16);
        pdf.setFont(FONT, "bold");
        pdf.setTextColor(WHITE);
        pdf.text(ic.val, 216, cy + 24);
      });

      // ─── SLIDE 2 ───────────────────────────────────────────────
      pdf.addPage();
      bg(pdf);
      label(pdf, "02 — О решении", 20, 22);
      pdf.setFontSize(32);
      pdf.setFont(FONT, "bold");
      pdf.setTextColor(WHITE);
      pdf.text("Разрабатываем", 20, 42);
      pdf.setTextColor(CORAL);
      pdf.text("с нуля", 20, 58);

      body(pdf, "На React — без конструкторов и шаблонов. Полноценный кастомный\nпродукт: дизайн, структура и логика создаются под конкретный бренд.", 20, 72, 160);

      const feats = [
        { icon: "</> ", title: "Не конструктор", desc: "Оригинальный код, без ограничений платформ", color: CYAN },
        { icon: "♦  ", title: "Дизайн под ключ", desc: "Фирменный стиль, типографика, визуальная логика", color: CORAL },
        { icon: "↑  ", title: "Масштабируемость", desc: "Готов к будущим доработкам и расширению", color: VIOLET },
      ];
      feats.forEach((f, i) => {
        const fx = 20 + i * 93;
        card(pdf, fx, 90, 86, 55, f.color);
        // icon bg
        pdf.setFillColor(20, 22, 50);
        pdf.roundedRect(fx + 6, 96, 12, 12, 2, 2, "F");
        pdf.setFontSize(8);
        pdf.setTextColor(f.color);
        pdf.text(f.icon, fx + 8, 104);
        pdf.setFontSize(10);
        pdf.setFont(FONT, "bold");
        pdf.setTextColor(WHITE);
        pdf.text(f.title, fx + 6, 118);
        pdf.setFontSize(8);
        pdf.setFont(FONT, "normal");
        pdf.setTextColor(DIM);
        const descLines = pdf.splitTextToSize(f.desc, 72);
        pdf.text(descLines, fx + 6, 127);
      });

      // ─── SLIDE 3 ───────────────────────────────────────────────
      pdf.addPage();
      bg(pdf);
      label(pdf, "03 — Состав работ", 20, 22);
      pdf.setFontSize(32);
      pdf.setFont(FONT, "bold");
      pdf.setTextColor(WHITE);
      pdf.text("Что входит", 20, 42);
      pdf.setTextColor(CYAN);
      pdf.text("в работу", 20, 58);

      const works = [
        { title: "Адаптивный дизайн", desc: "Корректно отображается на компьютере, планшете и смартфоне", color: CYAN },
        { title: "Базовая SEO-оптимизация", desc: "Мета-теги, структура заголовков, технические параметры индексации", color: VIOLET },
        { title: "Формы связи", desc: "Подключение форм заявок и обратной связи с уведомлениями", color: CORAL },
        { title: "Передача исходного кода", desc: "Полные права на проект — без привязки к подрядчику", color: GOLD },
      ];
      works.forEach((w, i) => {
        const row = Math.floor(i / 2), col = i % 2;
        const wx = 20 + col * 136, wy = 72 + row * 52;
        card(pdf, wx, wy, 128, 44, w.color);
        pdf.setFillColor(w.color);
        pdf.rect(wx, wy, 2.5, 44, "F");
        pdf.setFontSize(10);
        pdf.setFont(FONT, "bold");
        pdf.setTextColor(WHITE);
        pdf.text(w.title, wx + 8, wy + 14);
        pdf.setFontSize(8);
        pdf.setFont(FONT, "normal");
        pdf.setTextColor(DIM);
        const dl = pdf.splitTextToSize(w.desc, 112);
        pdf.text(dl, wx + 8, wy + 24);
      });

      // ─── SLIDE 4 (условия) ─────────────────────────────────────
      pdf.addPage();
      bg(pdf);
      label(pdf, "04 — Условия", 20, 22);
      pdf.setFontSize(32);
      pdf.setFont(FONT, "bold");
      pdf.setTextColor(WHITE);
      pdf.text("Ключевые", 20, 42);
      pdf.setTextColor(CYAN);
      pdf.text("условия", 20, 58);

      const terms = [
        { val: "40 000", unit: "₽", desc: "Фиксированная стоимость разработки", color: CYAN },
        { val: "7–14", unit: "дней", desc: "Срок готовности с момента старта", color: VIOLET },
        { val: "5", unit: "правок", desc: "Бесплатных доработок после сдачи", color: CORAL },
      ];
      terms.forEach((t, i) => {
        const tx = 20 + i * 93;
        card(pdf, tx, 70, 86, 70, t.color);
        pdf.setFontSize(30);
        pdf.setFont(FONT, "bold");
        pdf.setTextColor(t.color);
        pdf.text(t.val, tx + 8, 98);
        pdf.setFontSize(12);
        pdf.text(t.unit, tx + 8, 112);
        pdf.setFontSize(8);
        pdf.setFont(FONT, "normal");
        pdf.setTextColor(DIM);
        const dl = pdf.splitTextToSize(t.desc, 72);
        pdf.text(dl, tx + 8, 124);
      });

      // Guarantee bar
      pdf.setFillColor(14, 16, 40);
      pdf.roundedRect(20, 152, 257, 14, 2, 2, "F");
      pdf.setDrawColor(DIMMER);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(20, 152, 257, 14, 2, 2, "S");
      pdf.setFontSize(8);
      pdf.setFont(FONT, "normal");
      pdf.setTextColor(DIM);
      pdf.text("✓  Все параметры фиксируются в договоре. Никаких скрытых платежей.", 28, 160.5);

      // ─── SLIDE 5 (контакты) ────────────────────────────────────
      pdf.addPage();
      bg(pdf);
      label(pdf, "05 — Контакты", 20, 22);
      pdf.setFontSize(32);
      pdf.setFont(FONT, "bold");
      pdf.setTextColor(WHITE);
      pdf.text("Свяжитесь", 20, 42);
      pdf.setTextColor(CORAL);
      pdf.text("с нами", 20, 58);

      body(pdf, "Обсудим детали, ответим на вопросы и согласуем удобный\nформат сотрудничества. Никаких обязательств.", 20, 73, 140);

      // Ready badge
      pdf.setFillColor(0, 40, 30);
      pdf.roundedRect(20, 82, 100, 9, 2, 2, "F");
      pdf.setFontSize(7.5);
      pdf.setTextColor(CYAN);
      pdf.setFont(FONT, "bold");
      pdf.text("⏱  Готовы начать в течение 1–2 рабочих дней", 24, 88);

      // Contact box
      card(pdf, 170, 30, 110, 110, DIMMER);
      pdf.setFontSize(7);
      pdf.setTextColor(DIM);
      pdf.setFont(FONT, "bold");
      pdf.text("НАПИШИТЕ НАМ", 178, 42);

      // email row
      pdf.setFillColor(20, 22, 50);
      pdf.roundedRect(178, 47, 10, 10, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(DIM);
      pdf.text("@", 181.5, 53.5);
      pdf.setFontSize(9);
      pdf.setFont(FONT, "normal");
      pdf.setTextColor(WHITE);
      pdf.text("botopech@mail.ru", 192, 54);

      // phone row
      pdf.setFillColor(20, 22, 50);
      pdf.roundedRect(178, 63, 10, 10, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(DIM);
      pdf.text("☎", 181, 69.5);
      pdf.setFontSize(9);
      pdf.setFont(FONT, "normal");
      pdf.setTextColor(WHITE);
      pdf.text("+7 (996) 735-49-38", 192, 70);

      // CTA button
      pdf.setFillColor(0, 87, 255);
      pdf.roundedRect(178, 85, 94, 14, 3, 3, "F");
      pdf.setFontSize(10);
      pdf.setFont(FONT, "bold");
      pdf.setTextColor(WHITE);
      pdf.text("Обсудить проект →", 192, 94);

      pdf.save("КП_Разработка_сайта.pdf");
      setPrinting(false);
      setExportStatus("");
  };

  const animClass = animating
    ? direction === "next"
      ? "slide-exit-left"
      : "slide-exit-right"
    : "slide-enter";

  return (
    <div className={`pres-root ${printing ? "is-exporting" : ""}`}>
      <div className={`slide-wrapper ${printing ? "" : animClass}`}>
        {current === 0 && <Slide1 />}
        {current === 1 && <Slide2 />}
        {current === 2 && <Slide3 />}
        {current === 3 && <Slide5 />}
        {current === 4 && <Slide4 />}
      </div>

      {/* Dots */}
      <div className="pres-dots">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`pres-dot ${i === current ? "pres-dot-active" : ""}`}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        className="pres-arrow pres-arrow-left"
        onClick={() => goTo(current - 1)}
        disabled={current === 0}
      >
        <Icon name="ChevronLeft" size={26} />
      </button>
      <button
        className="pres-arrow pres-arrow-right"
        onClick={() => goTo(current + 1)}
        disabled={current === TOTAL_SLIDES - 1}
      >
        <Icon name="ChevronRight" size={26} />
      </button>

      <div className="pres-counter">{current + 1} / {TOTAL_SLIDES}</div>

      {/* Export button */}
      <button className="pdf-btn" onClick={exportPDF} disabled={printing}>
        {printing ? (
          <><Icon name="Loader2" size={15} className="spin" />{exportStatus || "Создаю PDF..."}</>
        ) : (
          <><Icon name="Download" size={15} />Скачать PDF</>
        )}
      </button>
    </div>
  );
}

function Slide1() {
  return (
    <div className="slide s1">
      <div className="s1-bg">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="grid-bg" />
      </div>
      <div className="s1-body">
        <div className="s1-tag fade-up" style={{ animationDelay: "0.05s" }}>
          <span className="tag-pulse" />
          Коммерческое предложение
        </div>
        <h1 className="s1-title fade-up" style={{ animationDelay: "0.15s" }}>
          Разработка<br /><span className="gtext">сайта</span>
        </h1>
        <p className="s1-sub fade-up" style={{ animationDelay: "0.28s" }}>
          Для консалтинговой компании — кастомное решение<br />под ваш бренд и задачи
        </p>
        <div className="s1-chips fade-up" style={{ animationDelay: "0.4s" }}>
          <span className="chip"><Icon name="Zap" size={13} />React</span>
          <span className="chip"><Icon name="Code2" size={13} />Без конструкторов</span>
          <span className="chip"><Icon name="CheckCircle" size={13} />Под ключ</span>
        </div>
      </div>
      <div className="s1-cards fade-up" style={{ animationDelay: "0.5s" }}>
        <div className="info-card ic-cyan">
          <span className="ic-label">Срок</span>
          <span className="ic-val">7–14 дней</span>
        </div>
        <div className="info-card ic-coral">
          <span className="ic-label">Стоимость</span>
          <span className="ic-val">40 000 ₽</span>
        </div>
        <div className="info-card ic-violet">
          <span className="ic-label">Доработки</span>
          <span className="ic-val">5 бесплатно</span>
        </div>
      </div>
    </div>
  );
}

function Slide2() {
  const features = [
    { icon: "Code2", title: "Не конструктор", desc: "Оригинальный код, без ограничений платформ", clr: "#00f5c4" },
    { icon: "Palette", title: "Дизайн под ключ", desc: "Фирменный стиль, типографика, визуальная логика", clr: "#ff6b6b" },
    { icon: "TrendingUp", title: "Масштабируемость", desc: "Готов к будущим доработкам и расширению", clr: "#a78bfa" },
  ];
  return (
    <div className="slide s-dark">
      <div className="orb ob-tl" />
      <div className="orb ob-br" />
      <div className="slide-inner">
        <div className="s-num fade-up" style={{ animationDelay: "0.05s" }}>02 — О решении</div>
        <h2 className="s-head fade-up" style={{ animationDelay: "0.15s" }}>
          Разрабатываем<br /><span className="gtext-coral">с нуля</span>
        </h2>
        <p className="s-body fade-up" style={{ animationDelay: "0.25s" }}>
          На React — без конструкторов и шаблонов. Полноценный кастомный продукт:<br />
          дизайн, структура и логика создаются под конкретный бренд и цели.
        </p>
        <div className="feat-grid fade-up" style={{ animationDelay: "0.38s" }}>
          {features.map((f, i) => (
            <div className="feat-card" key={i} style={{ "--c": f.clr } as React.CSSProperties}>
              <div className="feat-icon"><Icon name={f.icon} fallback="Star" size={22} /></div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide3() {
  const items = [
    { icon: "Monitor", title: "Адаптивный дизайн", desc: "Корректно отображается на компьютере, планшете и смартфоне", clr: "#00f5c4" },
    { icon: "Search", title: "Базовая SEO-оптимизация", desc: "Мета-теги, структура заголовков, технические параметры индексации", clr: "#a78bfa" },
    { icon: "MessageSquare", title: "Формы связи", desc: "Подключение форм заявок и обратной связи с уведомлениями", clr: "#ff6b6b" },
    { icon: "FileCode", title: "Передача исходного кода", desc: "Полные права на проект — без привязки к подрядчику", clr: "#fbbf24" },
  ];
  return (
    <div className="slide s-dark">
      <div className="orb ob-center" />
      <div className="slide-inner">
        <div className="s-num fade-up" style={{ animationDelay: "0.05s" }}>03 — Состав работ</div>
        <h2 className="s-head fade-up" style={{ animationDelay: "0.15s" }}>
          Что входит<br /><span className="gtext">в работу</span>
        </h2>
        <div className="work-grid fade-up" style={{ animationDelay: "0.3s" }}>
          {items.map((item, i) => (
            <div className="work-card" key={i} style={{ "--c": item.clr } as React.CSSProperties}>
              <div className="work-icon"><Icon name={item.icon} fallback="Star" size={20} /></div>
              <div className="work-title">{item.title}</div>
              <div className="work-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide5() {
  const terms = [
    { val: "40 000", unit: "₽", label: "Фиксированная стоимость разработки", clr: "#00f5c4" },
    { val: "7–14", unit: "дней", label: "Срок готовности с момента старта", clr: "#a78bfa" },
    { val: "5", unit: "правок", label: "Бесплатных доработок после сдачи", clr: "#ff6b6b" },
  ];
  return (
    <div className="slide s-dark">
      <div className="orb ob-tl" />
      <div className="orb ob-br" />
      <div className="slide-inner">
        <div className="s-num fade-up" style={{ animationDelay: "0.05s" }}>04 — Условия</div>
        <h2 className="s-head fade-up" style={{ animationDelay: "0.15s" }}>
          Ключевые<br /><span className="gtext">условия</span>
        </h2>
        <div className="terms-grid fade-up" style={{ animationDelay: "0.3s" }}>
          {terms.map((t, i) => (
            <div className="term-card" key={i} style={{ "--c": t.clr } as React.CSSProperties}>
              <div className="term-val">
                <span className="term-num">{t.val}</span>
                <span className="term-unit">{t.unit}</span>
              </div>
              <div className="term-lbl">{t.label}</div>
            </div>
          ))}
        </div>
        <div className="guarantee fade-up" style={{ animationDelay: "0.5s" }}>
          <Icon name="ShieldCheck" size={18} />
          <span>Все параметры фиксируются в договоре. Никаких скрытых платежей.</span>
        </div>
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="slide s-dark s-contact">
      <div className="orb ob-contact" />
      <div className="slide-inner s4-inner">
        <div className="s4-left">
          <div className="s-num fade-up" style={{ animationDelay: "0.05s" }}>05 — Контакты</div>
          <h2 className="s-head fade-up" style={{ animationDelay: "0.15s" }}>
            Свяжитесь<br /><span className="gtext-coral">с нами</span>
          </h2>
          <p className="s-body fade-up" style={{ animationDelay: "0.25s" }}>
            Обсудим детали, ответим на вопросы и согласуем удобный формат сотрудничества. Никаких обязательств.
          </p>
          <div className="ready-tag fade-up" style={{ animationDelay: "0.5s" }}>
            <Icon name="Clock" size={14} />
            Готовы начать в течение 1–2 рабочих дней
          </div>
        </div>
        <div className="s4-right fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="contact-box">
            <div className="cb-header">Напишите нам</div>
            <a href="mailto:botopech@mail.ru" className="cb-item">
              <div className="cb-icon"><Icon name="Mail" size={17} /></div>
              <span>botopech@mail.ru</span>
            </a>
            <a href="tel:+79967354938" className="cb-item">
              <div className="cb-icon"><Icon name="Phone" size={17} /></div>
              <span>+7 (996) 735-49-38</span>
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}