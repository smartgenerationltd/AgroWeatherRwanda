import { UserRole, WeatherData, Location, Language } from '../types';

export interface RecommendationResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export const getRecommendations = async (
  role: UserRole, 
  weather: WeatherData, 
  location: Location,
  lang: Language = 'rw'
): Promise<RecommendationResult> => {
  try {
    const response = await fetch('/api/gemini/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role, weather, location, lang }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.text) {
        return {
          text: data.text,
          sources: data.sources || [
            { title: "Meteo Rwanda Official Portal", uri: "https://www.meteorwanda.gov.rw" },
            { title: "MINAGRI Agro-Advisories", uri: "https://www.minagri.gov.rw" },
            { title: "Rwanda Agriculture and Animal Resources Development Board (RAB)", uri: "https://www.rab.gov.rw" }
          ]
        };
      }
    }
  } catch (error) {
    console.warn("Backend Gemini API request failed, switching to localized agro advisory:", error);
  }

  return generateFallbackRecommendation(role, weather, location, lang);
};

export const askAgroAdvisorCustom = async (
  question: string,
  role: UserRole,
  weather: WeatherData,
  location: Location,
  lang: Language = 'rw'
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, role, weather, location, lang }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.text) {
        return data.text;
      }
    }
  } catch (err) {
    console.warn("Agro chat server request failed, using local response:", err);
  }

  return lang === 'rw'
    ? `💡 Inama ku kibazo cyawe muri ${location.name}: Hashingiwe ku bushyuhe bwa ${weather.current.temp.toFixed(0)}°C n'ububobere bwa ${weather.current.soil_moisture_percentage}%, birasabwa gukurikiza amabwiriza ya RAB. Niba uteganya gutera imbuto cyangwa gushyira ifumbire, reba neza niba nta mvura nyinshi iteganyijwe uyu munsi ngo itayitwara. Muri ${location.name}, imiterere y'ubutaka isaba gufata neza amaterasi no gutwikira ubutaka (mulching).`
    : `💡 Advisory for ${location.name}: Based on ${weather.current.temp.toFixed(0)}°C and soil moisture at ${weather.current.soil_moisture_percentage}%, observe RAB recommended practices. If applying fertilizer or planting seeds, verify that heavy rain wash-off risks are minimal. For soil health in ${location.name}, maintain terracing and mulching.`;
};

const generateFallbackRecommendation = (
  role: UserRole,
  weather: WeatherData,
  location: Location,
  lang: Language
): RecommendationResult => {
  const isRain = (weather?.current?.rainfall_mm || 0) > 5;
  const isHighland = (location?.altitudeMeters || 1500) > 1800;

  if (lang === 'rw') {
    let roleDecisions = "";
    if (role === UserRole.Farmer) {
      roleDecisions = `
* **🌱 Gutera Imbuto n'Igihe cyo Guhinga**: ${weather.current.soil_moisture_percentage > 60 ? `Ububobere bw'ubutaka muri ${location.name} buri hejuru (${weather.current.soil_moisture_percentage}%), ni igihe cyiza cyo gutera imbuto z'ibishyimbo n'ibigori.` : `Ububobere buri hasi (${weather.current.soil_moisture_percentage}%), tegereza imvura y'umuhindo yisukiranye cyangwa wuhire mu bishanga.`}
* **🧪 Gushyira Ifumbire ya UREA / NPK**: ${isRain ? `Irinde gushyira ifumbire mu mirima uyu munsi kubera imvura iri kugwa (${weather.current.rainfall_mm}mm) ishobora kuyitwara (wash-off). Tegereza umunsi ufite izuba.` : `Igihe ni kiza cyo gushyiramo ifumbire yo hejuru no kubagara hakiri kare.`}
* **🐛 Kurinda Ibihingwa Indwara n'Ibyonnyi**: ${isHighland ? `Muri iyi misozi ya ${location.name}, ubushuhe butera umusonga w'ibirayi (Late blight). Tera umuti wagenwe na RAB mu gitondo izuba ritarasa cyane.` : `Genyura imyobo n'amababi y'ibigori kureba niba nta nkongwa idasanzwe (Fall armyworm) yatangiye kuyafata.`}
* **💧 Gufata Amazi & Amaterasi**: Fata ingamba zo gucukura imiringoti ifata amazi (Anti-erosion ditches) kugira ngo amazi atangiza ubutaka.`;
    } else if (role === UserRole.BusinessLeader) {
      roleDecisions = `
* **🚚 Ubwikorezi n'Imihanda**: ${isHighland && isRain ? `Icyitonderwa: Imihanda y'imisozi ya ${location.name} iranyerera kubera imvura. Teganya gutwara umusaruro mu gitondo cyangwa hakoreshejwe amakamyo akomeye.` : `Imihanda y'ingenzi y'ubwikorezi yifashe neza nta nkomyi ku modoka zitwaye umusaruro.`}
* **☀️ Kwanika no Guhunika Ibinyampeke**: ${isRain ? `Imvura n'ubushuhe byangiza ibinyampeke. Witwikurira imyaka ku zuba, koresha ibiti n'amashitingi abungabunzwe cyangwa ibyuma byumisha (Dryers).` : `Ikirere kiracyeye: Anika ibishyimbo n'ibigori ku mashitingi kugira ngo bigere ku bushyuhe n'umwuka biri munsi ya 13.5% (kwirinda Aflatoxin).`}
* **💰 Isoko ry'Umusaruro**: Ibiciro by'ibirayi n'ibishyimbo byifashe neza mu masoko ya Kigali n'imijyi yunganira.
* **📦 Iteganywa ry'Imbuto n'Ifumbire**: Abacuruzi b'inyongeramusaruro barasabwa guhaza amaduka yabo imbuto z'indobanure mbere y'uko abahinzi batangira gutera.`;
    } else {
      roleDecisions = `
* **🚨 Iburira ry'Ibiza (Early Warning)**: ${isHighland ? `Akarere ka ${location.name} gafite imiterere ihanamye. Kurikirana abaturage batuye mu manegeka (High-risk zones) kugira ngo batugarijwe n'inkangu.` : `Genzura imibande y'imigezi mu rwego rwo kwirinda imyuzure yangiza ibihingwa n'amazu.`}
* **📢 Ubutumwa bwo Gutangaza ku Baturage**: Tanga ubutumwa binyuze mu Bakuru b'Imidugudu bwo gukora umuganda wo gucukura imiringoti y'amazi no gusibura imiyoboro y'imvura.
* **🛡️ Kurengera ibidukikije n'Amaterasi**: Shishikariza abahinzi gutera ibiti bivangwa n'imyaka no gusibura amaterasi y'imisozi.
* **📊 Umutekano w'Ibiribwa**: Kusanya amakuru y'igenzura ry'isarura ryo mu mirenge yose ya ${location.name}.`;
    }

    return {
      text: `### 🌦️ Iteganyagihe rya Meteo Rwanda muri ${location.name}
Muri ${location.name} uyu munsi, ubushyuhe buragera kuri **${weather.current.temp.toFixed(0)}°C** hamwe n'ububobere bw'ubutaka bwa **${weather.current.soil_moisture_percentage}%**. Ikirere kiragaragaza **${weather.current.condition.description}**.

### 🎯 Inama 4 z'Icyemezo zigenewe ${role === UserRole.Farmer ? 'Abahinzi' : role === UserRole.BusinessLeader ? 'Abacuruzi' : 'Abayobozi'}
${roleDecisions}

### ⚠️ Iburira n'Umutekano
Buri muturage arasabwa gukurikirana amatangazo ya Meteo Rwanda na MINAGRI kuri Radiyo Rwanda n'ubutumwa bwa SMS (USSD *134#).`,
      sources: [
        { title: "Meteo Rwanda Official Advisories", uri: "https://www.meteorwanda.gov.rw" },
        { title: "MINAGRI Rwanda Portal", uri: "https://www.minagri.gov.rw" },
        { title: "RAB Crop Protection Guide", uri: "https://www.rab.gov.rw" }
      ]
    };
  } else {
    return {
      text: `### 🌦️ Meteo Rwanda Climate Briefing for ${location.name}
Current temperature is **${weather.current.temp.toFixed(0)}°C** with soil moisture at **${weather.current.soil_moisture_percentage}%**. Observed condition: **${weather.current.condition.descriptionEn}**.

### 🎯 Actionable Decision Recommendations for ${role === UserRole.Farmer ? 'Farmers' : role === UserRole.BusinessLeader ? 'Traders' : 'Local Leaders'}
* **Sowing & Planting Windows**: Soil moisture is currently ${weather.current.soil_moisture_percentage > 60 ? 'favorable for planting beans and maize' : 'low; supplemental irrigation or waiting for steady rains recommended'}.
* **Fertilizer & Spraying Safety**: ${isRain ? 'Avoid applying UREA top-dressing due to heavy surface runoff risks.' : 'Conditions are suitable for weeding and granular fertilizer placement.'}
* **Pest & Disease Watch**: ${isHighland ? 'High humidity elevates Late Blight risk in potato crops; apply preventative fungicide.' : 'Scout young maize crops for early Fall Armyworm infestations.'}
* **Erosion & Water Harvesting**: Ensure contour ditches and terraced waterways are free of debris.`,
      sources: [
        { title: "Meteo Rwanda Official Advisories", uri: "https://www.meteorwanda.gov.rw" },
        { title: "MINAGRI Climate Resilience Unit", uri: "https://www.minagri.gov.rw" }
      ]
    };
  }
};
