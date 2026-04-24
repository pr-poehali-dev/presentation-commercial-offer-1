import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const TOTAL_SLIDES = 5;

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [printing, setPrinting] = useState(false);

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

  const exportPDF = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  const animClass = animating
    ? direction === "next"
      ? "slide-exit-left"
      : "slide-exit-right"
    : "slide-enter";

  return (
    <div className="pres-root">
      <div className={`slide-wrapper ${animClass}`}>
        {current === 0 && <Slide1 />}
        {current === 1 && <Slide2 />}
        {current === 2 && <Slide3 />}
        {current === 3 && <Slide5 />}
        {current === 4 && <Slide4 />}
      </div>

      {/* All slides for print — hidden on screen */}
      <div className="print-all">
        <div className="print-slide"><Slide1 /></div>
        <div className="print-slide"><Slide2 /></div>
        <div className="print-slide"><Slide3 /></div>
        <div className="print-slide"><Slide5 /></div>
        <div className="print-slide"><Slide4 /></div>
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
          <><Icon name="Loader2" size={15} className="spin" />Открываю печать...</>
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
            <button className="cb-cta">
              Обсудить проект
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}