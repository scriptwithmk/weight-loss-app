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

components.html(html_for_embed, height=1800, scrolling=True)


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


st.markdown("---")
st.subheader("SukshmaDharshini")
st.write("Upload a food image to estimate calories using AI.")

api_key = st.secrets.get("OPENAI_API_KEY", os.getenv("OPENAI_API_KEY", ""))
uploaded_image = st.file_uploader(
    "Upload food photo", type=["jpg", "jpeg", "png", "webp"]
)

if uploaded_image:
    st.image(uploaded_image, caption="Food photo", use_container_width=True)

if not api_key:
    st.info(
        "Add OPENAI_API_KEY in Streamlit Secrets to enable SukshmaDharshini. "
        "In Streamlit Cloud: App Settings -> Secrets."
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
