from pathlib import Path
import base64
import json
import os
import re

import streamlit as st
import streamlit.components.v1 as components
from openai import OpenAI

st.set_page_config(page_title="ChunChu Weight Loss Services", layout="wide")

base_dir = Path(__file__).parent
html_path = base_dir / "index.html"
css_path = base_dir / "styles.css"
js_path = base_dir / "script.js"

html = html_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")
js = js_path.read_text(encoding="utf-8")

# Inline CSS/JS so Streamlit can serve everything from a single page component.
html_for_embed = html.replace(
    '<link rel="stylesheet" href="styles.css" />',
    f"<style>{css}</style>",
).replace(
    '<script src="script.js"></script>',
    f"<script>{js}</script>",
)


def extract_json(text: str) -> dict:
    """Extract and parse JSON from model output, including fenced blocks."""
    cleaned = text.strip()
    fenced_match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", cleaned, flags=re.DOTALL)
    if fenced_match:
        cleaned = fenced_match.group(1)
    return json.loads(cleaned)


def analyze_food_image(image_bytes: bytes, mime_type: str, api_key: str) -> dict:
    client = OpenAI(api_key=api_key)
    b64_image = base64.b64encode(image_bytes).decode("utf-8")

    prompt = (
        "You are a nutrition assistant. Analyze the food image and estimate calories. "
        "Return ONLY valid JSON with this schema: "
        "{"
        '\"dish_name\": string, '
        '\"confidence\": \"high\"|\"medium\"|\"low\", '
        '\"items\": ['
        '{\"name\": string, \"estimated_portion\": string, \"calories\": number}'
        "], "
        '\"total_calories\": number, '
        '\"notes\": string'
        "}. "
        "If uncertain, still provide best estimate and mention uncertainty in notes."
    )

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {
                        "type": "input_image",
                        "image_url": f"data:{mime_type};base64,{b64_image}",
                    },
                ],
            }
        ],
        max_output_tokens=700,
    )

    return extract_json(response.output_text)


FOOD_DB = {
    "Rice (cooked)": {"kcal_per_100g": 130, "default_grams": 150},
    "Roti (1 medium)": {"kcal_per_100g": 265, "default_grams": 40},
    "Dal (cooked)": {"kcal_per_100g": 116, "default_grams": 180},
    "Paneer": {"kcal_per_100g": 265, "default_grams": 80},
    "Chicken breast (cooked)": {"kcal_per_100g": 165, "default_grams": 120},
    "Egg (1 whole)": {"kcal_per_100g": 155, "default_grams": 50},
    "Fish (cooked)": {"kcal_per_100g": 206, "default_grams": 120},
    "Oats": {"kcal_per_100g": 389, "default_grams": 40},
    "Banana": {"kcal_per_100g": 89, "default_grams": 118},
    "Apple": {"kcal_per_100g": 52, "default_grams": 182},
    "Curd/Yogurt": {"kcal_per_100g": 61, "default_grams": 150},
    "Milk": {"kcal_per_100g": 60, "default_grams": 200},
    "Peanut butter": {"kcal_per_100g": 588, "default_grams": 16},
    "Almonds": {"kcal_per_100g": 579, "default_grams": 25},
    "Mixed vegetables (cooked)": {"kcal_per_100g": 65, "default_grams": 150},
}


def run_manual_calorie_estimator() -> None:
    st.write("No API key mode: select food items and servings to estimate calories.")

    selected_items = st.multiselect(
        "Select food items",
        options=sorted(FOOD_DB.keys()),
    )

    if not selected_items:
        st.caption("Pick one or more items to calculate total calories.")
        return

    rows = []
    total_kcal = 0.0

    for item in selected_items:
        meta = FOOD_DB[item]
        grams = meta["default_grams"]
        kcal_per_100g = meta["kcal_per_100g"]
        per_serving = round((kcal_per_100g * grams) / 100)

        servings = st.number_input(
            f"{item} servings ({grams}g each)",
            min_value=0.0,
            max_value=10.0,
            value=1.0,
            step=0.5,
            key=f"serving_{item}",
        )

        item_total = per_serving * servings
        total_kcal += item_total
        rows.append(
            {
                "item": item,
                "serving_size": f"{grams}g",
                "kcal_per_serving": per_serving,
                "servings": servings,
                "total_kcal": round(item_total),
            }
        )

    st.write("Estimated calories")
    st.table(rows)
    st.metric("Estimated Total Calories", f"{round(total_kcal)} kcal")
    st.caption("This is an approximation based on common nutrition averages.")



main_tabs = st.tabs(["Main Planner", "SukshmaDharshini"])

with main_tabs[0]:
        components.html(html_for_embed, height=1800, scrolling=True)

with main_tabs[1]:
        st.markdown(
                """
                <style>
                    .sd-hero {
                        border-radius: 18px;
                        padding: 24px;
                        background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 45%, #d1fae5 100%);
                        border: 1px solid #f3c58b;
                        margin-bottom: 14px;
                    }
                    .sd-title {
                        font-size: 1.8rem;
                        font-weight: 800;
                        color: #8a2b0f;
                        margin: 0 0 6px 0;
                    }
                    .sd-sub {
                        margin: 0;
                        color: #2a4b3d;
                        font-size: 1.03rem;
                    }
                    .sd-img {
                        margin-top: 14px;
                        border-radius: 16px;
                        overflow: hidden;
                        border: 1px solid rgba(0,0,0,0.08);
                    }
                    .sd-chip-row {
                        display: flex;
                        gap: 8px;
                        flex-wrap: wrap;
                        margin-top: 12px;
                    }
                    .sd-chip {
                        background: #ffffffcc;
                        color: #2f4f41;
                        border: 1px solid #efc99b;
                        border-radius: 999px;
                        font-size: 0.82rem;
                        padding: 6px 10px;
                        font-weight: 600;
                    }
                </style>
                <div class="sd-hero">
                    <h2 class="sd-title">SukshmaDharshini</h2>
                    <p class="sd-sub">Smart food calorie analyzer. Use AI image analysis when API is available, or continue with no-key manual mode.</p>
                    <div class="sd-chip-row">
                        <span class="sd-chip">Colorful UI</span>
                        <span class="sd-chip">Image-based Calories</span>
                        <span class="sd-chip">No API Key Fallback</span>
                        <span class="sd-chip">Item-wise Breakdown</span>
                    </div>
                    <div class="sd-img">
                        <svg viewBox="0 0 1000 270" width="100%" height="220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Food analyzer visual">
                            <defs>
                                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#ffd9a8"/>
                                    <stop offset="55%" stop-color="#ffeccb"/>
                                    <stop offset="100%" stop-color="#d4f9e7"/>
                                </linearGradient>
                            </defs>
                            <rect x="0" y="0" width="1000" height="270" fill="url(#bg)"/>
                            <circle cx="130" cy="72" r="36" fill="#f25f29" opacity="0.88"/>
                            <circle cx="910" cy="76" r="30" fill="#059669" opacity="0.85"/>
                            <rect x="75" y="104" width="350" height="128" rx="18" fill="#ffffff" opacity="0.95"/>
                            <rect x="116" y="134" width="265" height="16" rx="8" fill="#ffd7bc"/>
                            <rect x="116" y="164" width="220" height="16" rx="8" fill="#c9f0de"/>
                            <rect x="116" y="194" width="180" height="16" rx="8" fill="#ffe7a8"/>
                            <rect x="515" y="50" width="420" height="180" rx="18" fill="#fff7ea" stroke="#f2be86"/>
                            <circle cx="640" cy="140" r="62" fill="#fff" stroke="#ffd7bc"/>
                            <path d="M603 142c14-18 58-18 72 0" stroke="#f25f29" stroke-width="8" fill="none" stroke-linecap="round"/>
                            <circle cx="626" cy="130" r="7" fill="#059669"/>
                            <circle cx="670" cy="128" r="7" fill="#059669"/>
                            <text x="730" y="120" font-size="20" fill="#2f4f41" font-family="sans-serif" font-weight="700">Food Insight</text>
                            <text x="730" y="148" font-size="16" fill="#4b6d5f" font-family="sans-serif">Calories + Portion</text>
                            <text x="730" y="173" font-size="16" fill="#4b6d5f" font-family="sans-serif">Item Breakdown</text>
                        </svg>
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
        )

        api_key = st.secrets.get("OPENAI_API_KEY", os.getenv("OPENAI_API_KEY", ""))
        uploaded_image = st.file_uploader(
                "Upload food photo", type=["jpg", "jpeg", "png", "webp"]
        )

        if uploaded_image:
                st.image(uploaded_image, caption="Uploaded food photo", use_container_width=True)

        tabs = st.tabs(["AI Image Analysis", "No API Key Mode"])

        with tabs[0]:
                if not api_key:
                        st.info(
                                "OPENAI_API_KEY not found. Switch to 'No API Key Mode' tab below, "
                                "or add OPENAI_API_KEY in Streamlit Secrets."
                        )

                analyze_clicked = st.button(
                        "Analyze Calories",
                        type="primary",
                        disabled=not uploaded_image or not api_key,
                )

                if analyze_clicked and uploaded_image and api_key:
                        with st.spinner("Analyzing food image..."):
                                try:
                                        result = analyze_food_image(
                                                uploaded_image.getvalue(),
                                                uploaded_image.type or "image/jpeg",
                                                api_key,
                                        )

                                        st.success("Analysis complete")
                                        st.write(f"Dish: {result.get('dish_name', 'Unknown')}")
                                        st.write(f"Confidence: {result.get('confidence', 'medium').title()}")
                                        st.metric("Estimated Total Calories", f"{int(result.get('total_calories', 0))} kcal")

                                        items = result.get("items", [])
                                        if items:
                                                st.write("Item-wise calorie estimate")
                                                st.table(items)

                                        notes = result.get("notes", "")
                                        if notes:
                                                st.caption(f"Notes: {notes}")
                                except Exception as exc:
                                        st.error(f"Could not analyze the image. Error: {exc}")

        with tabs[1]:
                run_manual_calorie_estimator()
