import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

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
      roleDecisions = `* **🌱 Gutera Imbuto n'Igihe cyo Guhinga**: ${soilMoisture > 60 ? `Ububobere bw'ubutaka muri ${locName} buri hejuru (${soilMoisture}%), ni igihe cyiza cyo gutera imbuto z'ibishyimbo n'ibigori.` : `Ububobere buri hasi (${soilMoisture}%), tegereza imvura y'umuhindo yisukiranye cyangwa wuhire mu bishanga.`}
* **🧪 Gushyira Ifumbire ya UREA / NPK**: ${isRain ? `Irinde gushyira ifumbire mu mirima uyu munsi kubera imvura ishobora kuyitwara (wash-off). Tegereza umunsi ufite izuba.` : `Igihe ni kiza cyo gushyiramo ifumbire yo hejuru no kubagara hakiri kare.`}
* **🐛 Kurinda Ibihingwa Indwara n'Ibyonnyi**: ${isHighland ? `Muri iyi misozi ya ${locName}, ubushuhe butera umusonga w'ibirayi (Late blight). Tera umuti wagenwe na RAB mu gitondo izuba ritarasa cyane.` : `Genyura imyobo n'amababi y'ibigori kureba niba nta nkongwa idasanzwe (Fall armyworm) yatangiye kuyafata.`}
* **💧 Gufata Amazi & Amaterasi**: Fata ingamba zo gucukura imiringoti ifata amazi (Anti-erosion ditches) kugira ngo amazi atangiza ubutaka.`;
    } else if (role === "BUSINESS_LEADER") {
      roleDecisions = `* **🚚 Ubwikorezi n'Imihanda**: ${isHighland && isRain ? `Icyitonderwa: Imihanda y'imisozi ya ${locName} iranyerera kubera imvura. Teganya gutwara umusaruro mu gitondo cyangwa hakoreshejwe amakamyo akomeye.` : `Imihanda y'ingenzi y'ubwikorezi yifashe neza nta nkomyi ku modoka zitwaye umusaruro.`}
* **☀️ Kwanika no Guhunika Ibinyampeke**: ${isRain ? `Imvura n'ubushuhe byangiza ibinyampeke. Witwikurira imyaka ku zuba, koresha ibiti n'amashitingi abungabunzwe cyangwa ibyuma byumisha (Dryers).` : `Ikirere kiracyeye: Anika ibishyimbo n'ibigori ku mashitingi kugira ngo bigere ku bushyuhe n'umwuka biri munsi ya 13.5% (kwirinda Aflatoxin).`}
* **💰 Isoko ry'Umusaruro**: Ibiciro by'ibirayi n'ibishyimbo byifashe neza mu masoko ya Kigali n'imijyi yunganira.
* **📦 Iteganywa ry'Imbuto n'Ifumbire**: Abacuruzi b'inyongeramusaruro barasabwa guhaza amaduka yabo imbuto z'indobanure mbere y'uko abahinzi batangira gutera.`;
    } else {
      roleDecisions = `* **🚨 Iburira ry'Ibiza (Early Warning)**: ${isHighland ? `Akarere ka ${locName} gafite imiterere ihanamye. Kurikirana abaturage batuye mu manegeka (High-risk zones) kugira ngo batugarijwe n'inkangu.` : `Genzura imibande y'imigezi mu rwego rwo kwirinda imyuzure yangiza ibihingwa n'amazu.`}
* **📢 Ubutumwa bwo Gutangaza ku Baturage**: Tanga ubutumwa binyuze mu Bakuru b'Imidugudu bwo gukora umuganda wo gucukura imiringoti y'amazi no gusibura imiyoboro y'imvura.
* **🛡️ Kurengera ibidukikije n'Amaterasi**: Shishikariza abahinzi gutera ibiti bivangwa n'imyaka no gusibura amaterasi y'imisozi.
* **📊 Umutekano w'Ibiribwa**: Kusanya amakuru y'igenzura ry'isarura ryo mu mirenge yose ya ${locName}.`;
    }

    return {
      text: `### 🌦️ Iteganyagihe rya Meteo Rwanda muri ${locName}
Muri ${locName} uyu munsi, ubushyuhe buragera kuri **${temp}°C** hamwe n'ububobere bw'ubutaka bwa **${soilMoisture}%**. Ikirere kiragaragaza **${desc}**.

### 🎯 Inama 4 z'Icyemezo zigenewe ${role === "FARMER" ? "Abahinzi" : role === "BUSINESS_LEADER" ? "Abacuruzi" : "Abayobozi"}
${roleDecisions}

### ⚠️ Iburira n'Umutekano
Buri muturage arasabwa gukurikirana amatangazo ya Meteo Rwanda na MINAGRI kuri Radiyo Rwanda n'ubutumwa bwa SMS (USSD *134#).`,
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
* **Sowing & Planting Windows**: Soil moisture is currently ${soilMoisture > 60 ? "favorable for planting beans and maize" : "low; supplemental irrigation or waiting for steady rains recommended"}.
* **Fertilizer & Spraying Safety**: ${isRain ? "Avoid applying UREA top-dressing due to heavy surface runoff risks." : "Conditions are suitable for weeding and granular fertilizer placement."}
* **Pest & Disease Watch**: ${isHighland ? "High humidity elevates Late Blight risk in potato crops; apply preventative fungicide." : "Scout young maize crops for early Fall Armyworm infestations."}
* **Erosion & Water Harvesting**: Ensure contour ditches and terraced waterways are free of debris.`,
    sources: [
      { title: "Meteo Rwanda Official Advisories", uri: "https://www.meteorwanda.gov.rw" },
      { title: "MINAGRI Climate Resilience Unit", uri: "https://www.minagri.gov.rw" }
    ]
  };
}

function generateLocalChatFallback(question: string, _role: string, weather: any, location: any, lang: string) {
  const temp = weather?.current?.temp ? weather.current.temp.toFixed(0) : "22";
  const soilMoisture = weather?.current?.soil_moisture_percentage ?? 60;
  const locName = location?.name || "Rwanda";

  if (lang === "rw") {
    return `💡 Inama ku kibazo cyawe ("${question}") muri ${locName}: Hashingiwe ku bushyuhe bwa ${temp}°C n'ububobere bw'ubutaka bwa ${soilMoisture}%, birasabwa gukurikiza amabwiriza ya RAB. Niba uteganya gutera imbuto cyangwa gushyira ifumbire, reba neza niba nta mvura nyinshi iteganyijwe uyu munsi ngo itayitwara. Muri ${locName}, imiterere y'ubutaka isaba gufata neza amaterasi no gutwikira ubutaka (mulching).`;
  }
  return `💡 Advisory for "${question}" in ${locName}: Based on ${temp}°C and soil moisture at ${soilMoisture}%, follow RAB guidelines. Maintain soil conservation terraces and adjust fertilizer/spraying timing according to real-time rainfall outlooks.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
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
        ? "Subiza mu Kinyarwanda cyiza, cyoroshye kumva ku muhinzi wo mu cyaro, ukoreshe amagambo y'ubuhinzi n'iteganyagihe mu Rwanda (urugero: imvura y'umuhindo, itumba, amaterasi, ifumbire ya DAP/UREA, nkongwa, umusonga w'ibirayi)." 
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
- Iteganyagihe ry'iminsi 7: Imvura iciriritse n'ibicu bitatanye mu minsi iri mbere.

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
4. 💡 **Inama y'Igihembwe**: Inama ijyanye n'igihembwe cy'ihinga ririmo (Season A, B, cyangwa C).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
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
          { title: "MINAGRI Agro-Advisories", uri: "https://www.minagri.gov.rw" },
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

  // Gemini Chat / Agro Advisor API
  app.post("/api/gemini/chat", async (req, res) => {
    const { question, role, weather, location, lang = "rw" } = req.body;
    try {
      const ai = getGeminiClient();

      if (!ai) {
        const fallbackText = generateLocalChatFallback(question, role, weather, location, lang);
        return res.json({ text: fallbackText });
      }

      const prompt = `Wowe uri "Umwunganizi mu Buhinzi n'Iteganyagihe mu Rwanda" (AgroWeather Rwanda AI Advisor).
Umwirondoro w'ubaza: ${role === "FARMER" ? "Umuhinzi" : role === "BUSINESS_LEADER" ? "Umucuruzi" : "Umuyobozi"}
Akarere: ${location?.name || "Rwanda"}, Intara ya ${location?.provinceRw || "Rwanda"} (Uburebure: ${location?.altitudeMeters || 1500}m).
Ubushyuhe: ${weather?.current?.temp?.toFixed(1) || 22}°C, Ububobere bw'ubutaka: ${weather?.current?.soil_moisture_percentage || 55}%, Imvura ya none: ${weather?.current?.rainfall_mm || 0}mm.

Ikibazo cy'umuntu: "${question}"

${lang === "rw" 
  ? "Subiza mu Kinyarwanda cyumvikana neza, utange inama ifatika mu buhinzi n'iteganyagihe ryo mu Rwanda. Koresha ingero zifatika (nko gukoresha UREA, DAP, imbuto z'indobanure, kwirinda nkongwa, gukurikirana imvura ya Meteo Rwanda)." 
  : "Answer clearly in English with direct agronomic practical advice suitable for Rwandan conditions."}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.6,
        }
      });

      return res.json({ text: response.text || "" });
    } catch (error: any) {
      console.warn("Gemini chat upstream notice (falling back to agro rules):", error?.message || error);
      const fallbackText = generateLocalChatFallback(question, role, weather, location, lang);
      return res.json({ text: fallbackText });
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
