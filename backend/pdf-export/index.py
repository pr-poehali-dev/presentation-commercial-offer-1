import json
import os
import base64
import time
from playwright.sync_api import sync_playwright


def handler(event: dict, context) -> dict:
    """
    Делает скриншоты всех слайдов презентации через Playwright и возвращает PDF в base64.
    """
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    site_url = body.get("url", "")

    if not site_url:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "url is required"}),
        }

    TOTAL_SLIDES = 5

    with sync_playwright() as p:
        browser = p.chromium.launch(
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        )
        page = browser.new_page(viewport={"width": 1280, "height": 720})

        page.goto(site_url, wait_until="networkidle", timeout=30000)
        time.sleep(2)

        screenshots = []

        for i in range(TOTAL_SLIDES):
            # Переключаем слайд через клик по точке навигации
            page.evaluate(f"""
                const dots = document.querySelectorAll('.pres-dot');
                if (dots[{i}]) dots[{i}].click();
            """)
            time.sleep(0.8)

            # Скрываем навигацию для чистого скриншота
            page.evaluate("""
                document.querySelectorAll('.pres-dots, .pres-arrow, .pres-counter, .pdf-btn, .print-all')
                    .forEach(el => el.style.visibility = 'hidden');
            """)
            time.sleep(0.2)

            img_bytes = page.screenshot(type="jpeg", quality=95, full_page=False)
            screenshots.append(base64.b64encode(img_bytes).decode())

            # Возвращаем навигацию
            page.evaluate("""
                document.querySelectorAll('.pres-dots, .pres-arrow, .pres-counter, .pdf-btn, .print-all')
                    .forEach(el => el.style.visibility = '');
            """)

        browser.close()

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        "body": json.dumps({"slides": screenshots}),
    }
