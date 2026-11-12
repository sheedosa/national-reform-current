#!/usr/bin/env python3
"""Build the Arabic (/) and English (/en/) pages from the bilingual source.

Edit src/index.html (every text appears twice: class="ar" and class="en"),
then run:  python3 build.py
"""
import datetime, pathlib, re
from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).parent
URL = "https://sheedosa.github.io/national-reform-current/"
SRC = (ROOT / "src/index.html").read_text(encoding="utf-8")

EN_HEAD = {
    "title": "National Reform Movement | Citizens first",
    "description": "The National Reform Movement is an independent Libyan national initiative with a reformist outlook. Its slogan: reconciliation, consensus, constitution, elections. Read its principles, political and social foundations, and approach to reform.",
    "og_title": "National Reform Movement | Citizens first",
    "og_desc": "An independent Libyan national initiative. Reconciliation, consensus, constitution, elections.",
    "alt": "Logo of the National Reform Movement with the slogan Citizens first",
    "site_name": "National Reform Movement",
}


def build(lang):
    other = "en" if lang == "ar" else "ar"
    soup = BeautifulSoup(SRC, "html.parser")
    for el in soup.select("." + other):
        el.decompose()
    for el in soup.select(".ar, .en"):
        cls = [c for c in el.get("class", []) if c not in ("ar", "en")]
        if cls:
            el["class"] = cls
        elif el.name == "span" and not el.attrs.get("dir") and len(el.attrs) == 1:
            el.unwrap()
        else:
            del el["class"]

    for el in soup.select("[data-en-label]"):
        if lang == "en":
            el["aria-label"] = el["data-en-label"]
        del el["data-en-label"]

    html = soup.html
    if lang == "en":
        html["lang"], html["dir"], html["data-base"] = "en", "ltr", "../"
        h = soup.head
        h.title.string = EN_HEAD["title"]
        def meta(attr, key, val):
            tag = h.find("meta", attrs={attr: key})
            if tag: tag["content"] = val
        meta("name", "description", EN_HEAD["description"])
        meta("name", "author", EN_HEAD["site_name"])
        meta("property", "og:site_name", EN_HEAD["site_name"])
        meta("property", "og:title", EN_HEAD["og_title"])
        meta("property", "og:description", EN_HEAD["og_desc"])
        meta("property", "og:url", URL + "en/")
        for k in ("og:image", "og:image:secure_url"):
            meta("property", k, URL + "assets/og-en.png")
        meta("property", "og:image:alt", EN_HEAD["alt"])
        meta("property", "og:locale", "en_GB")
        meta("property", "og:locale:alternate", "ar_LY")
        meta("name", "twitter:title", EN_HEAD["og_title"])
        meta("name", "twitter:description", EN_HEAD["og_desc"])
        meta("name", "twitter:image", URL + "assets/og-en.png")
        meta("name", "twitter:image:alt", EN_HEAD["alt"])
        h.find("link", rel="canonical")["href"] = URL + "en/"
        pre = h.find_all("link", rel="preload")
        pre[0]["href"] = "assets/fonts/tajawal-latin-800-normal.woff2"
        pre[1]["href"] = "assets/fonts/ibm-plex-sans-latin-400-normal.woff2"
        ld = h.find("script", type="application/ld+json")
        ld.string = (ld.string.replace('"inLanguage":"ar"', '"inLanguage":"en"')
                     .replace(f'"@id":"{URL}#webpage","url":"{URL}"', f'"@id":"{URL}en/#webpage","url":"{URL}en/"')
                     .replace('"name":"التيار الوطني الإصلاحي | المواطن أولاً"', '"name":"National Reform Movement | Citizens first"'))
        sw = soup.select_one("a.lang")
        sw["href"], sw["hreflang"], sw["lang"] = "../", "ar", "ar"
        sw.string = "العربية"
        # relative asset paths
        for tag, attr in (("link", "href"), ("img", "src"), ("source", "srcset"), ("script", "src")):
            for el in soup.find_all(tag):
                v = el.get(attr)
                if v and v.startswith(("assets/", "site.webmanifest")):
                    el[attr] = "../" + v
    out = str(soup)
    out = re.sub(r"\n\s*\n+", "\n", out)
    return out


(ROOT / "index.html").write_text(build("ar"), encoding="utf-8")
(ROOT / "en").mkdir(exist_ok=True)
(ROOT / "en/index.html").write_text(build("en"), encoding="utf-8")

today = datetime.date.today().isoformat()
alts = (f'<xhtml:link rel="alternate" hreflang="ar" href="{URL}"/>'
        f'<xhtml:link rel="alternate" hreflang="en" href="{URL}en/"/>'
        f'<xhtml:link rel="alternate" hreflang="x-default" href="{URL}"/>')
(ROOT / "sitemap.xml").write_text(f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url><loc>{URL}</loc><lastmod>{today}</lastmod>{alts}</url>
<url><loc>{URL}en/</loc><lastmod>{today}</lastmod>{alts}</url>
</urlset>
''', encoding="utf-8")
print("built index.html, en/index.html, sitemap.xml")
