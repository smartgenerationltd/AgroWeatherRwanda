import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { LATEST_RWANDA_AGRI_NEWS, RWANDA_CROPS_DATABASE, RWANDA_INSTITUTIONS } from "./services/rwandaAgriKnowledge";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const RWANDA_SYSTEM_INSTRUCTION = `Wowe uri "Umujyanama Mukuru w'Igihugu mu Buhinzi, Amatungo n'Iteganyagihe mu Rwanda" (AgroWeather Rwanda National AI Agronomist & Decision Engine).
Ubushobozi bwawe bushingiye ku mabwiriza n'imfashanyigisho by'inzego zishinzwe ubuhinzi mu Rwanda:
1. MINAGRI (Minisiteri y'Ubuhinzi n'Ubworozi): Gahunda ya Smart Nkunganire (USSD *774#), Bwishingizi bwa NAIS (Tekana Urishingiwe - 85% ishyurwa na Leta), PSTA 5, no Gushyira Ishwagara mu butaka (Lime).
2. RAB (Ikigo cy'Ubuhinzi n'Ubworozi): Imbuto z'indobanure (SC 637, PAN 53, RHM 1407, Kinigi, Cruza, Victoria, RWV 1129, Basmati 370, Gahene, Injagi), ifumbire ya DAP (100kg/ha), NPK 17-17-17, na UREA (100kg/ha), no kurwanya Nkongwa idasanzwe (Fall Armyworm), Umusonga w'Ibirayi (Late Blight), Kirabiranya (BXW), Kabore (CBSD), n'Inyenzi y'Ikawa (CBB). RAB Helpline: 4455, MINAGRI: 1221.
3. METEO RWANDA (Ikigo cy'Iteganyagihe): Iteganyagihe ry'iminsi 10 (Dekadal), iteganyagihe ry'igihembwe (Season A: Umuhindo, Season B: Itumba, Season C: Impeshyi mu bishanga), na sitasiyo 30 z'ikirere mu turere twose. Meteo Hotline: 4322.

AMATEGEKO Y'INGENZI:
- Igihe cyose umuhinzi abajije, tanga ibisubizo bifatika, bisobanutse, byizewe, bijyanye n'akarere ke (District), uburebure (Altitude), imiterere y'ubutaka, n'ikirere cya Meteo Rwanda.
- Vuga amazina nyakuri y'imbuto zemewe na RAB n'imiti yemewe mu Rwanda.
- Tanga ibipimo nyabyo (kg/ha, spacing muri cm, igihe cyo gutera imiti n'ifumbire).
- Niba hari ifoto y'igihingwa yatanzwe, sesengura indwara, ibimenyetso, n'umuti wemewe na RAB.
- Niba ubajijwe mu Kinyarwanda, subiza mu Kinyarwanda cy'umwimerere kandi cyoroshye ku muhinzi wo mu cyaro. Niba ari mu Cyongereza cyangwa Igifaransa, subiza muri urwo rurimi.`;

function generateLocalRecommendationFallback(role: string, weather: any, location: any, lang: string) {
  const isRain = (weather?.current?.rainfall_mm || 0) > 5;
  const isHighland = (location?.altitudeMeters || 1500) > 1800;
  const locName = location?.name || "Rwanda";
  const temp = weather?.current?.temp ? weather.current.temp.toFixed(0) : "22";
  const soilMoisture = weather?.current?.soil_moisture_percentage ?? 65;
  const desc = weather?.current?.condition?.description || "Ibicurane bicagase";
  const descEn = weather?.current?.condition?.descriptionEn || "Partly Cloudy";

  if (lang === "rw") {
    let roleDecisions = "";
    if (role === "FARMER") {
      roleDecisions = `* **🌱 Gutera Imbuto n'Igihe cyo Guhinga**: ${soilMoisture > 60 ? `Ububobere bw'ubutaka muri ${locName} buri hejuru (${soilMoisture}%), ni igihe cyiza cyo gutera imbuto z'ibishyimbo n'ibigori (nka SC 637, RWV 1129).` : `Ububobere buri hasi (${soilMoisture}%), tegereza imvura y'umuhindo yisukiranye cyangwa wuhire mu bishanga.`}
* **🧪 Gushyira Ifumbire ya UREA / NPK / DAP**: ${isRain ? `Irinde gushyira ifumbire yo hejuru (UREA) mu mirima uyu munsi kubera imvura ishobora kuyitwara (wash-off). Tegereza umunsi ufite izuba ry'amanywa.` : `Igihe ni kiza cyo gushyiramo ifumbire yo hejuru ya UREA mu butaka buhehereye no kubagara hakiri kare.`}
* **🐛 Kurinda Ibihingwa Indwara n'Ibyonnyi**: ${isHighland ? `Muri iyi misozi ya ${locName}, ubushuhe butera umusonga w'ibirayi (Late blight). Tera umuti wa Mancozeb 80WP cyangwa Ridomil Gold mu gitondo hakiri kare.` : `Genyura imyobo n'amababi y'ibigori kureba niba nta nkongwa idasanzwe (Fall armyworm) yatangiye kuyafata, ukoreshe Emamectin Benzoate (Rocket/Prove).`}
* **💧 Gufata Amazi & Amaterasi**: Fata ingamba zo gucukura imiringoti ifata amazi (Anti-erosion ditches) no gusasira (mulching) kugira ngo amazi atangiza ubutaka.`;
    } else if (role === "BUSINESS_LEADER") {
      roleDecisions = `* **🚚 Ubwikorezi n'Imihanda**: ${isHighland && isRain ? `Icyitonderwa: Imihanda y'imisozi ya ${locName} iranyerera kubera imvura. Teganya gutwara umusaruro mu gitondo cyangwa hakoreshejwe amakamyo akomeye.` : `Imihanda y'ingenzi y'ubwikorezi yifashe neza nta nkomyi ku modoka zitwaye umusaruro.`}
* **☀️ Kwanika no Guhunika Ibinyampeke**: ${isRain ? `Imvura n'ubushuhe byangiza ibinyampeke. Witwikurira imyaka ku zuba, koresha ibiti n'amashitingi abungabunzwe cyangwa ibyuma byumisha (Dryers).` : `Ikirere kiracyeye: Anika ibishyimbo n'ibigori ku mashitingi kugira ngo bigere ku bushyuhe n'umwuka biri munsi ya 13.5% (kwirinda Aflatoxin).`}
* **💰 Isoko ry'Umusaruro**: Ibiciro by'ibirayi n'ibishyimbo byifashe neza mu masoko ya Kigali n'imijyi yunganira.
* **📦 Iteganywa ry'Imbuto n'Ifumbire**: Abacuruzi b'inyongeramusaruro (Agro-dealers) barasabwa gukoresha Smart Nkunganire (*774#) kugira ngo bahaze amaduka yabo mbere y'uko igihembwe gitangira.`;
    } else {
      roleDecisions = `* **🚨 Iburira ry'Ibiza (Early Warning)**: ${isHighland ? `Akarere ka ${locName} gafite imiterere ihanamye. Kurikirana abaturage batuye mu manegeka (High-risk zones) kugira ngo batugarijwe n'inkangu.` : `Genzura imibande y'imigezi mu rwego rwo kwirinda imyuzure yangiza ibihingwa n'amazu.`}
* **📢 Ubutumwa bwo Gutangaza ku Baturage**: Tanga ubutumwa binyuze mu Bakuru b'Imidugudu bwo gukora umuganda wo gucukura imiringoti y'amazi no gusibura imiyoboro y'imvura.
* **🛡️ Kurengera ibidukikije n'Amaterasi**: Shishikariza abahinzi gutera ibiti bivangwa n'imyaka no gusibura amaterasi y'imisozi.
* **📊 Umutekano w'Ibiribwa**: Kusanya amakuru y'igenzura ry'isarura ryo mu mirenge yose ya ${locName}.`;
    }

    return {
      text: `### 🌦️ Iteganyagihe rya Meteo Rwanda muri ${locName}
Muri ${locName} uyu munsi, ubushyuhe buragera kuri **${temp}°C** hamwe n'ububobere bw'ubutaka bwa **${soilMoisture}%**. Ikirere kiragaragaza **${desc}**.

### 🎯 Inama 4 z'Icyemezo zigenewe ${role === "FARMER" ? "Abahinzi" : role === "BUSINESS_LEADER" ? "Abacuruzi" : "Abayobozi"} (Amabwiriza ya RAB & MINAGRI)
${roleDecisions}

### ⚠️ Iburira n'Umutekano
Buri muturage arasabwa gukurikirana amatangazo ya Meteo Rwanda na MINAGRI kuri Radiyo Rwanda, USSD *774# na Helpline ya RAB 4455.`,
      sources: [
        { title: "Meteo Rwanda Official Advisories", uri: "https://www.meteorwanda.gov.rw" },
        { title: "MINAGRI Rwanda Portal", uri: "https://www.minagri.gov.rw" },
        { title: "RAB Crop Protection Guide", uri: "https://www.rab.gov.rw" }
      ]
    };
  }

  return {
    text: `### 🌦️ Meteo Rwanda Climate Briefing for ${locName}
Current temperature is **${temp}°C** with soil moisture at **${soilMoisture}%**. Observed condition: **${descEn}**.

### 🎯 Actionable Decision Recommendations for ${role === "FARMER" ? "Farmers" : role === "BUSINESS_LEADER" ? "Traders" : "Local Leaders"}
* **Sowing & Planting Windows**: Soil moisture is currently ${soilMoisture > 60 ? "favorable for planting beans and maize certified varieties (e.g., SC 637, RWV 1129)" : "low; supplemental irrigation or waiting for steady rains recommended"}.
* **Fertilizer & Spraying Safety**: ${isRain ? "Avoid applying UREA top-dressing due to heavy surface runoff risks." : "Conditions are suitable for weeding and granular fertilizer placement."}
* **Pest & Disease Watch**: ${isHighland ? "High humidity elevates Late Blight risk in potato crops; apply preventative Mancozeb/Ridomil Gold." : "Scout young maize crops for early Fall Armyworm infestations; apply Emamectin Benzoate."}
* **Erosion & Water Harvesting**: Ensure contour ditches and terraced waterways are free of debris.`,
    sources: [
      { title: "Meteo Rwanda Official Advisories", uri: "https://www.meteorwanda.gov.rw" },
      { title: "MINAGRI Climate Resilience Unit", uri: "https://www.minagri.gov.rw" },
      { title: "Rwanda Agriculture Board (RAB)", uri: "https://www.rab.gov.rw" }
    ]
  };
}

function generateLocalChatFallback(question: string, _role: string, weather: any, location: any, lang: string) {
  const temp = weather?.current?.temp ? weather.current.temp.toFixed(0) : "22";
  const soilMoisture = weather?.current?.soil_moisture_percentage ?? 60;
  const locName = location?.name || "Rwanda";

  if (lang === "rw") {
    return `💡 **Inama z'Inzobere mu Buhinzi (RAB & MINAGRI) ku kibazo cyawe muri ${locName}:**

Hashingiwe ku bushyuhe bwa **${temp}°C** n'ububobere bw'ubutaka bwa **${soilMoisture}%**:
1. **Ku bijyanye n'Imbuto n'Ifumbire**: Koresha imbuto z'indobanure zujuje ubuziranenge zituruka muri gahunda ya Smart Nkunganire (*774#). Shyiramo DAP (100 kg/ha) igihe cyo gutera, na UREA (100 kg/ha) nyuma y'ukwezi ubutaka buhehereye.
2. **Kwirinda Indwara n'Ibyonnyi**: 
   - Ku bigori: Fata ingamba zo kurwanya Nkongwa idasanzwe ukoresheje Emamectin benzoate (Rocket / Prove / Titan) mu mutima w'ikigori.
   - Ku birayi n'inyanya: Tera Mancozeb 80WP cyangwa Ridomil Gold kurinda umusonga w'ibirayi (Late blight).
   - Ku nsina: Guca umwanana (debudding) no kurandura insina irwaye Kirabiranya (BXW) ku ndiba.
3. **Ubufasha bwihuse bwa Leta**:
   - RAB Helpline (Ubujyanama bw'ubuntu): **4455**
   - MINAGRI Helpline: **1221**
   - Meteo Rwanda Helpline: **4322**
   - Smart Nkunganire USSD: ***774#**`;
  }

  return `💡 **Agronomic Advisory (RAB & MINAGRI Standards) for ${locName}:**

Based on observed temperature of **${temp}°C** and soil moisture at **${soilMoisture}%**:
1. **Certified Seeds & Input Subsidies**: Procure certified varieties through the Smart Nkunganire System (*774#). Apply basal DAP (100 kg/ha) or NPK 17-17-17 at sowing, followed by top-dress UREA (100 kg/ha) at 30-35 days under moist soil.
2. **Pest & Disease Control**:
   - Maize: Scout for Fall Armyworm and apply Emamectin Benzoate directly into the whorl.
   - Potatoes/Tomatoes: Apply Mancozeb 80WP or Ridomil Gold every 7-10 days for Late Blight prevention.
   - Bananas: Debud male flowers with forked sticks to eradicate Banana Xanthomonas Wilt (BXW).
3. **Institutional Hotlines**:
   - RAB Toll-free helpline: **4455**
   - MINAGRI Support: **1221**
   - Meteo Rwanda Forecasts: **4322**
   - Smart Nkunganire USSD: ***774#**`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Institutional News Feed
  app.get("/api/institutional/news", (_req, res) => {
    res.json({
      news: LATEST_RWANDA_AGRI_NEWS,
      institutions: RWANDA_INSTITUTIONS,
      timestamp: new Date().toISOString()
    });
  });

  // Crops Database
  app.get("/api/crops/database", (_req, res) => {
    res.json({
      crops: RWANDA_CROPS_DATABASE,
      count: RWANDA_CROPS_DATABASE.length
    });
  });

  // Gemini Recommendations API
  app.post("/api/gemini/recommendations", async (req, res) => {
    const { role, weather, location, lang = "rw" } = req.body;
    try {
      const ai = getGeminiClient();

      if (!ai) {
        const fallback = generateLocalRecommendationFallback(role, weather, location, lang);
        return res.json(fallback);
      }

      const roleTitle = role === "FARMER" 
        ? "Umuhinzi (Smallholder & Commercial Farmer in Rwanda)" 
        : role === "BUSINESS_LEADER" 
        ? "Umucuruzi w'inyongeramusaruro n'umusaruro (Agri-Trader, Food Processor & Transporter)" 
        : "Umuyobozi w'Inzego z'Ibanze n'Agronome w'Umurenge (Local Leader & Sector Agronomist)";

      const langInstruction = lang === "rw" 
        ? "Subiza mu Kinyarwanda cyiza, cyoroshye kumva ku muhinzi wo mu cyaro, ukoreshe amagambo y'ubuhinzi n'iteganyagihe mu Rwanda (urugero: imvura y'umuhindo, itumba, amaterasi, ifumbire ya DAP/UREA, nkongwa, umusonga w'ibirayi, Smart Nkunganire *774#)." 
        : "Provide clear, actionable, and structured decision guidance in English tailored to Rwandan agriculture, Meteo Rwanda alerts, and regional topography.";

      const prompt = `Wowe uri "Umujyanama Mukuru mu Buhinzi n'Iteganyagihe mu Rwanda" (AgroWeather Rwanda AI Agronomist & Decision Engine).
Ufasha ${roleTitle} mu karere ka ${location?.name || "Rwanda"} (Intara ya ${location?.provinceRw || "Rwanda"}, Uburebure: ${location?.altitudeMeters || 1500}m).

AMAKURU Y'ITEGANYAGIHE YA METEO RWANDA MURI ${(location?.name || "RWANDA").toUpperCase()}:
- Ubushyuhe bwa none: ${weather?.current?.temp?.toFixed(1) || 22}°C (Uko byumvikana: ${weather?.current?.feels_like?.toFixed(1) || 22}°C)
- Imiterere y'ikirere: ${weather?.current?.condition?.description || "Ibicurane"} (${weather?.current?.condition?.main || "Clouds"})
- Ububobere bw'ubutaka (Soil Moisture): ${weather?.current?.soil_moisture_percentage || 55}%
- Ububobere bw'umwuka (Humidity): ${weather?.current?.humidity || 65}%
- Umuyaga: ${weather?.current?.wind_speed || 10} km/h
- Imvura ya none: ${weather?.current?.rainfall_mm || 0} mm
- Iteganyagihe ry'iminsi 7: Imvura n'izuba bisimburana.

${langInstruction}

Tanga igisubizo gifite iyi miterere:
1. 🌦️ **Uko ikirere cyifashe n'Iteganyagihe rya Meteo Rwanda**: Incamake y'ikirere cy'uyu munsi n'icyumweru muri ${location?.name || "Rwanda"}.
2. 🎯 **Ibyemezo 4 byihariye bigomba gufatwa none (Actionable Decisions)**:
   ${role === "FARMER" ? 
     "- Igihe cyo gutera imbuto no kubagara\n- Itegurwa ry'ifumbire (Kwirinda ko imvura itwara UREA/DAP)\n- Kurinda ibihingwa indwara (Late blight, Anthracnose) n'ibyonnyi (Fall armyworm)\n- Kuhira cyangwa gufata amazi ku misozi" : 
     role === "BUSINESS_LEADER" ? 
     "- Umutekano wo gutwara imyaka mu masoko\n- Kwanika no guhunika ibinyampeke (Kwirinda uruhumbu / Aflatoxin)\n- Guteganya ibiciro by'ibiribwa\n- Ibyifuzo by'inyongeramusaruro n'imbuto" : 
     "- Kurengera amaterasi n'imikingo ku misozi\n- Iburira ry'inkangu n'imyuzure mu mibande\n- Ubutumwa bwihuse buhabwa abaturage n'abakuru b'imidugudu\n- Gukurikirana umutekano w'ibiribwa"
   }
3. ⚠️ **Iburira n'Ingamba z'Umutekano**: Niba hari ibyago by'imvura idasanzwe, inkangu, cyangwa umuyaga mwinshi.
4. 💡 **Inama y'Igihembwe n'Amakuru ya MINAGRI/RAB**: Amakuru y'imbuto zunganiwe (Nkunganire *774#) n'ubwishingizi bwa NAIS.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: RWANDA_SYSTEM_INSTRUCTION,
          temperature: 0.6,
          tools: [{ googleSearch: {} }]
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web?.title || "Meteo Rwanda & MINAGRI",
          uri: chunk.web?.uri || "https://www.meteorwanda.gov.rw"
        }));

      if (sources.length === 0) {
        sources.push(
          { title: "Meteo Rwanda Official Portal", uri: "https://www.meteorwanda.gov.rw" },
          { title: "MINAGRI Smart Nkunganire", uri: "https://www.minagri.gov.rw" },
          { title: "Rwanda Agriculture and Animal Resources Development Board (RAB)", uri: "https://www.rab.gov.rw" }
        );
      }

      return res.json({ text, sources });
    } catch (error: any) {
      console.warn("Gemini recommendations upstream notice (falling back to agrometeorological rules):", error?.message || error);
      const fallback = generateLocalRecommendationFallback(role, weather, location, lang);
      return res.json(fallback);
    }
  });

  // Gemini Chat / Agro Advisor API (with Multimodal Image Support & Google Search Grounding)
  app.post("/api/gemini/chat", async (req, res) => {
    const { question, role, weather, location, lang = "rw", cropContext, imageBase64, imageMimeType } = req.body;
    try {
      const ai = getGeminiClient();

      if (!ai) {
        const fallbackText = generateLocalChatFallback(question, role, weather, location, lang);
        return res.json({ 
          text: fallbackText,
          sources: [
            { title: "RAB Official Guidelines", uri: "https://www.rab.gov.rw" },
            { title: "MINAGRI Advisory Portal", uri: "https://www.minagri.gov.rw" },
            { title: "Meteo Rwanda Weather Bulletin", uri: "https://www.meteorwanda.gov.rw" }
          ]
        });
      }

      const promptText = `Wowe uri "Umujyanama Mukuru mu Buhinzi n'Iteganyagihe mu Rwanda" (AgroWeather Rwanda AI Agronomist).
Umwirondoro w'ubaza: ${role === "FARMER" ? "Umuhinzi" : role === "BUSINESS_LEADER" ? "Umucuruzi w'umusaruro" : "Umuyobozi / Agronome"}
Akarere: ${location?.name || "Rwanda"}, Intara ya ${location?.provinceRw || "Rwanda"} (Uburebure: ${location?.altitudeMeters || 1500}m).
Icyo ahinga / Igihingwa kibazwaho: ${cropContext || "Ibihingwa muri rusange"}
Ikirere cya Meteo Rwanda uyu munsi:
- Ubushyuhe: ${weather?.current?.temp?.toFixed(1) || 22}°C
- Ububobere bw'ubutaka: ${weather?.current?.soil_moisture_percentage || 55}%
- Imvura ya none: ${weather?.current?.rainfall_mm || 0}mm

Ikibazo cy'umuhinzi: "${question}"

${lang === "rw" 
  ? "Subiza mu Kinyarwanda cyumvikana neza, ukoreshe amabwiriza nyakuri ya MINAGRI na RAB. Tanga inama zifatika (imbuto za RAB, ifumbire ya DAP/UREA/NPK, kurwanya indwara n'ibyonnyi nka Nkongwa idasanzwe cyangwa Late Blight, gahunda ya Nkunganire *774#, na hotlines: RAB 4455 / MINAGRI 1221)." 
  : "Provide authoritative, structured agronomic advice based on MINAGRI, RAB, and Meteo Rwanda guidelines, with specific fertilizer dosages, seed varieties, pest controls, and official hotlines (RAB: 4455, MINAGRI: 1221, USSD: *774#)."}
`;

      let contentsPayload: any;

      if (imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        contentsPayload = {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: imageMimeType || 'image/jpeg'
              }
            },
            {
              text: `${promptText}\n\n[ICYITONDERWA: Umuhinzi yohereje ifoto y'ikimera/ikibabi cyarwaye. Sesengura iyi foto, umubwire indwara cyangwa icyonnyi kirwaye, ibimenyetso, n'umuti wemewe na RAB ugomba gukoreshwa.]`
            }
          ]
        };
      } else {
        contentsPayload = promptText;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contentsPayload,
        config: {
          systemInstruction: RWANDA_SYSTEM_INSTRUCTION,
          temperature: 0.5,
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web?.title || "Rwanda Agriculture & Climate Advisory",
          uri: chunk.web?.uri || "https://www.rab.gov.rw"
        }));

      if (sources.length === 0) {
        sources.push(
          { title: "RAB Official Guidelines", uri: "https://www.rab.gov.rw" },
          { title: "MINAGRI Advisory Portal", uri: "https://www.minagri.gov.rw" },
          { title: "Meteo Rwanda Weather Bulletin", uri: "https://www.meteorwanda.gov.rw" }
        );
      }

      return res.json({ text, sources });
    } catch (error: any) {
      console.warn("Gemini chat upstream notice (falling back to agro rules):", error?.message || error);
      const fallbackText = generateLocalChatFallback(question, role, weather, location, lang);
      return res.json({ 
        text: fallbackText,
        sources: [
          { title: "RAB Crop Protection Guide", uri: "https://www.rab.gov.rw" },
          { title: "MINAGRI Portal", uri: "https://www.minagri.gov.rw" }
        ]
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgroWeather Rwanda Server running on http://localhost:${PORT}`);
  });
}

startServer();

