import { Location } from '../types';

export interface DistrictInfo {
  id: string;
  name: string;
  nameRw: string;
  province: 'Kigali' | 'Northern' | 'Southern' | 'Eastern' | 'Western';
  provinceRw: string;
  altitudeMeters: number;
  agroEcoZone: string;
  stationName: string;
  dominantCrops: string[];
  sectors: string[];
  lat: number;
  lon: number;
}

export const RWANDA_DISTRICTS: DistrictInfo[] = [
  // City of Kigali (Umujyi wa Kigali)
  {
    id: 'gasabo',
    name: 'Gasabo',
    nameRw: 'Gasabo',
    province: 'Kigali',
    provinceRw: 'Umujyi wa Kigali',
    altitudeMeters: 1560,
    agroEcoZone: 'central_plateau',
    stationName: 'Kigali International Airport Met Station',
    dominantCrops: ['Imboga (Vegetables)', 'Ibitoki (Bananas)', 'Ibigori (Maize)', 'Imbuto ziribwa'],
    sectors: ['Bumbogo', 'Gatsata', 'Jali', 'Gikomero', 'Gisozi', 'Jabana', 'Kinyinya', 'Ndera', 'Nduba', 'Rusororo', 'Rutunga', 'Kacyiru', 'Kimihurura', 'Kimironko', 'Remera'],
    lat: -1.9167,
    lon: 30.1333
  },
  {
    id: 'kicukiro',
    name: 'Kicukiro',
    nameRw: 'Kicukiro',
    province: 'Kigali',
    provinceRw: 'Umujyi wa Kigali',
    altitudeMeters: 1520,
    agroEcoZone: 'central_plateau',
    stationName: 'Gahanga Agrometeorology Post',
    dominantCrops: ['Imboga', 'Ibitoki', 'Ibigori', 'Inyanya'],
    sectors: ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'],
    lat: -1.9833,
    lon: 30.1167
  },
  {
    id: 'nyarugenge',
    name: 'Nyarugenge',
    nameRw: 'Nyarugenge',
    province: 'Kigali',
    provinceRw: 'Umujyi wa Kigali',
    altitudeMeters: 1500,
    agroEcoZone: 'central_plateau',
    stationName: 'Nyarugenge Urban Met Post',
    dominantCrops: ['Imboga', 'Ibitoki', 'Ubworozi bw\'inkoko'],
    sectors: ['Gitega', 'Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Muhima', 'Nyakabanda', 'Nyamirambo', 'Nyarugenge', 'Rwezamenyo'],
    lat: -1.9500,
    lon: 30.0500
  },

  // Northern Province (Intara y'Amajyaruguru)
  {
    id: 'musanze',
    name: 'Musanze',
    nameRw: 'Musanze',
    province: 'Northern',
    provinceRw: 'Amajyaruguru',
    altitudeMeters: 1850,
    agroEcoZone: 'volcanic',
    stationName: 'Ruhengeri Meteo Agro Station',
    dominantCrops: ['Ibirayi (Irish Potatoes)', 'Icyayi (Tea)', 'Iparetre (Pyrethrum)', 'Imboga', 'Ibigori'],
    sectors: ['Busogo', 'Cyuve', 'Gacaca', 'Gashaki', 'Gataraga', 'Kimonyi', 'Kinigi', 'Muhoza', 'Muko', 'Musanze', 'Nkotsi', 'Nyange', 'Remera', 'Rwaza', 'Shingiro'],
    lat: -1.5042,
    lon: 29.6350
  },
  {
    id: 'burera',
    name: 'Burera',
    nameRw: 'Burera',
    province: 'Northern',
    provinceRw: 'Amajyaruguru',
    altitudeMeters: 1920,
    agroEcoZone: 'buberuka',
    stationName: 'Butaro Climate Post',
    dominantCrops: ['Ingano (Wheat)', 'Ibishyimbo (Climbing Beans)', 'Ibirayi', 'Icyayi', 'Ubururu bw\'amafi'],
    sectors: ['Bungwe', 'Butaro', 'Cyanika', 'Cyeru', 'Gahunga', 'Gatebe', 'Gitovu', 'Kagogo', 'Kinoni', 'Kinyababa', 'Kivuye', 'Nemba', 'Rugarama', 'Rugengabari', 'Ruhunde', 'Rusarabuye', 'Rwerere'],
    lat: -1.4500,
    lon: 29.8000
  },
  {
    id: 'gicumbi',
    name: 'Gicumbi',
    nameRw: 'Gicumbi',
    province: 'Northern',
    provinceRw: 'Amajyaruguru',
    altitudeMeters: 2100,
    agroEcoZone: 'buberuka',
    stationName: 'Byumba Meteo Radar Station',
    dominantCrops: ['Icyayi (Tea)', 'Ibishyimbo', 'Ingano', 'Ibirayi', 'Ubworozi bw\'inka z\'amata'],
    sectors: ['Bukure', 'Bwisige', 'Byumba', 'Cyumba', 'Giti', 'Kageyo', 'Kaniga', 'Manyagiro', 'Miyove', 'Kanyamiheto', 'Mukarange', 'Muko', 'Mutete', 'Nyamiyaga', 'Nyankenke', 'Rubaya', 'Rukomo', 'Rushaki', 'Rutare', 'Ruvune', 'Rwamiko', 'Shangasha'],
    lat: -1.6133,
    lon: 30.0100
  },
  {
    id: 'gakenke',
    name: 'Gakenke',
    nameRw: 'Gakenke',
    province: 'Northern',
    provinceRw: 'Amajyaruguru',
    altitudeMeters: 1650,
    agroEcoZone: 'buberuka',
    stationName: 'Gakenke Agrometeorological Station',
    dominantCrops: ['Ikawa (Arabica Coffee)', 'Ibitoki', 'Ibishyimbo', 'Ibigori', 'Imyumbati'],
    sectors: ['Busengo', 'Coko', 'Cyabingo', 'Gakenke', 'Gashenyi', 'Mugunga', 'Janja', 'Kamubuga', 'Karambo', 'Kivuruga', 'Mataba', 'Minazi', 'Muhondo', 'Muyongwe', 'Muzo', 'Nemba', 'Ruli', 'Rusasa', 'Rushashi'],
    lat: -1.7000,
    lon: 29.7833
  },
  {
    id: 'rulindo',
    name: 'Rulindo',
    nameRw: 'Rulindo',
    province: 'Northern',
    provinceRw: 'Amajyaruguru',
    altitudeMeters: 1720,
    agroEcoZone: 'central_plateau',
    stationName: 'Tare Climate Observation Station',
    dominantCrops: ['Ikawa', 'Ibitoki', 'Ibirayi', 'Imboga', 'Icyayi'],
    sectors: ['Base', 'Burega', 'Bushoki', 'Buyoga', 'Cyinzuzi', 'Cyungo', 'Kinihira', 'Kisaro', 'Masoro', 'Mbogo', 'Murambi', 'Ngoma', 'Ntarabana', 'Rukozo', 'Rusiga', 'Shyorongi', 'Tumba'],
    lat: -1.7333,
    lon: 30.0000
  },

  // Southern Province (Intara y'Amajyepfo)
  {
    id: 'huye',
    name: 'Huye',
    nameRw: 'Huye',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    altitudeMeters: 1750,
    agroEcoZone: 'central_plateau',
    stationName: 'RAB Rubona Agrometeorology Observatory',
    dominantCrops: ['Ikawa (Coffee)', 'Ibishyimbo', 'Ibitoki', 'Soya', 'Umuceri'],
    sectors: ['Gishamvu', 'Karama', 'Kigoma', 'Kinazi', 'Maraba', 'Mbazi', 'Mukura', 'Ngoma', 'Ruhashya', 'Huye', 'Rusatira', 'Rwaniro', 'Simbi', 'Tumba'],
    lat: -2.5160,
    lon: 29.7401
  },
  {
    id: 'muhanga',
    name: 'Muhanga',
    nameRw: 'Muhanga',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    altitudeMeters: 1800,
    agroEcoZone: 'central_plateau',
    stationName: 'Gitarama Met Station',
    dominantCrops: ['Ikawa', 'Ibitoki', 'Imyumbati', 'Ibishyimbo', 'Imboga'],
    sectors: ['Cyeza', 'Kabacuzi', 'Kibangu', 'Kiyumba', 'Muhanga', 'Mushishiro', 'Nyabinoni', 'Nyamabuye', 'Nyarusange', 'Rongi', 'Rugendabari', 'Shyogwe'],
    lat: -2.0833,
    lon: 29.7500
  },
  {
    id: 'kamonyi',
    name: 'Kamonyi',
    nameRw: 'Kamonyi',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    altitudeMeters: 1600,
    agroEcoZone: 'central_plateau',
    stationName: 'Ruyenzi Weather Post',
    dominantCrops: ['Ibitoki', 'Imyumbati', 'Ikawa', 'Imboga z\'imigezi'],
    sectors: ['Gacurabwenge', 'Karama', 'Kayenzi', 'Kayumbu', 'Mugina', 'Musambira', 'Ngamba', 'Nyamiyaga', 'Nyarubaka', 'Rugarika', 'Rukoma', 'Runda'],
    lat: -1.9167,
    lon: 29.9333
  },
  {
    id: 'nyamagabe',
    name: 'Nyamagabe',
    nameRw: 'Nyamagabe',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    altitudeMeters: 2050,
    agroEcoZone: 'congo_nile',
    stationName: 'Kitabi Nyungwe Station',
    dominantCrops: ['Icyayi (Highland Tea)', 'Ingano', 'Ibirayi', 'Ibishyimbo'],
    sectors: ['Buruhukiro', 'Cyanika', 'Gatare', 'Kaduha', 'Kamegeri', 'Kibirizi', 'Kibumbwe', 'Kitabi', 'Mbazi', 'Mugano', 'Musange', 'Musebeya', 'Nkomane', 'Gasaka', 'Tare', 'Uwinkingi'],
    lat: -2.4764,
    lon: 29.5694
  },
  {
    id: 'nyanza',
    name: 'Nyanza',
    nameRw: 'Nyanza',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    altitudeMeters: 1780,
    agroEcoZone: 'central_plateau',
    stationName: 'Nyanza Met Station',
    dominantCrops: ['Ikawa', 'Ibitoki', 'Ibishyimbo', 'Imyumbati', 'Ubworozi'],
    sectors: ['Busasamana', 'Busoro', 'Cyabakamyi', 'Kibilizi', 'Kigoma', 'Mukingo', 'Muyira', 'Ntyazo', 'Nyagisozi', 'Rwabicuma'],
    lat: -2.3500,
    lon: 29.7500
  },
  {
    id: 'nyaruguru',
    name: 'Nyaruguru',
    nameRw: 'Nyaruguru',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    altitudeMeters: 2150,
    agroEcoZone: 'congo_nile',
    stationName: 'Kibeho Met Station',
    dominantCrops: ['Icyayi', 'Ingano', 'Ibirayi', 'Ibishyimbo'],
    sectors: ['Cyahinda', 'Busanze', 'Kibeho', 'Kivu', 'Mata', 'Muganza', 'Munini', 'Ngera', 'Ngoma', 'Nyabimata', 'Nyagisozi', 'Ruheru', 'Ruramba', 'Rusenge'],
    lat: -2.7167,
    lon: 29.5833
  },
  {
    id: 'gisagara',
    name: 'Gisagara',
    nameRw: 'Gisagara',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    altitudeMeters: 1680,
    agroEcoZone: 'central_plateau',
    stationName: 'Ndora Met Post',
    dominantCrops: ['Ibitoki', 'Umuceri (Rice)', 'Ibishyimbo', 'Imyumbati', 'Soya'],
    sectors: ['Gikonko', 'Gishubi', 'Kansi', 'Kibilizi', 'Kigembe', 'Mamba', 'Muganza', 'Mugombwa', 'Mukindo', 'Musha', 'Ndora', 'Nyanza', 'Save'],
    lat: -2.6167,
    lon: 29.8500
  },
  {
    id: 'ruhango',
    name: 'Ruhango',
    nameRw: 'Ruhango',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    altitudeMeters: 1720,
    agroEcoZone: 'central_plateau',
    stationName: 'Ruhango Station',
    dominantCrops: ['Imyumbati (Cassava)', 'Ikawa', 'Ibitoki', 'Ibishyimbo'],
    sectors: ['Bweramana', 'Byimana', 'Kabagali', 'Kinazi', 'Kinihira', 'Mbuye', 'Mwendo', 'Ntongwe', 'Ruhango'],
    lat: -2.2167,
    lon: 29.7833
  },

  // Eastern Province (Intara y'Iburasirazuba)
  {
    id: 'nyagatare',
    name: 'Nyagatare',
    nameRw: 'Nyagatare',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    altitudeMeters: 1350,
    agroEcoZone: 'eastern_savanna',
    stationName: 'Nyagatare Agro Station',
    dominantCrops: ['Ibigori (Maize)', 'Soya', 'Ubworozi bw\'inka z\'inyama n\'amata', 'Umuceri'],
    sectors: ['Gatunda', 'Kiyombe', 'Karama', 'Karangazi', 'Katabagemu', 'Matimba', 'Mimuri', 'Mukama', 'Musheli', 'Nyagatare', 'Rukomo', 'Rwempasha', 'Rwimiyaga', 'Tabagwe'],
    lat: -1.3000,
    lon: 30.3300
  },
  {
    id: 'gatsibo',
    name: 'Gatsibo',
    nameRw: 'Gatsibo',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    altitudeMeters: 1420,
    agroEcoZone: 'eastern_savanna',
    stationName: 'Kabarore Meteo Post',
    dominantCrops: ['Ibigori', 'Ibishyimbo', 'Amasaka', 'Ibitoki', 'Soya'],
    sectors: ['Gasange', 'Gatsibo', 'Gitoki', 'Kabarore', 'Kageyo', 'Kiramuruzi', 'Kiziguro', 'Muhura', 'Murambi', 'Ngarama', 'Nyagihanga', 'Remera', 'Rugarama', 'Rwimbogo'],
    lat: -1.6000,
    lon: 30.4500
  },
  {
    id: 'kayonza',
    name: 'Kayonza',
    nameRw: 'Kayonza',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    altitudeMeters: 1400,
    agroEcoZone: 'eastern_savanna',
    stationName: 'Mukarange Climate Station',
    dominantCrops: ['Ibigori', 'Soya', 'Imyumbati', 'Ibitoki', 'Ubworozi'],
    sectors: ['Gahini', 'Kabare', 'Kabarondo', 'Mukarange', 'Murama', 'Murundi', 'Mwiri', 'Ndego', 'Nyamirama', 'Rukara', 'Ruramira', 'Rwinkwavu'],
    lat: -1.9333,
    lon: 30.5000
  },
  {
    id: 'bugesera',
    name: 'Bugesera',
    nameRw: 'Bugesera',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    altitudeMeters: 1380,
    agroEcoZone: 'eastern_savanna',
    stationName: 'Nyamata Met Station',
    dominantCrops: ['Imyumbati', 'Ibigori', 'Ibishyimbo', 'Imboga z\'urufunzo', 'Ubworozi'],
    sectors: ['Gashora', 'Juru', 'Kamabuye', 'Ntarama', 'Mareba', 'Mayange', 'Musenyi', 'Mwogo', 'Ngeruka', 'Nyamata', 'Nyarugenge', 'Rilima', 'Ruhuha', 'Rweru', 'Shyara'],
    lat: -2.1833,
    lon: 30.0833
  },
  {
    id: 'kirehe',
    name: 'Kirehe',
    nameRw: 'Kirehe',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    altitudeMeters: 1390,
    agroEcoZone: 'eastern_savanna',
    stationName: 'Mahama Agro Station',
    dominantCrops: ['Ibitoki (Bananas)', 'Ibigori', 'Soya', 'Umuceri', 'Imboga'],
    sectors: ['Gahara', 'Gatore', 'Kigarama', 'Kigina', 'Kirehe', 'Mahama', 'Mpanga', 'Musaza', 'Mushikiri', 'Nasho', 'Nyamugari', 'Nyarubuye'],
    lat: -2.2667,
    lon: 30.6500
  },
  {
    id: 'ngoma',
    name: 'Ngoma',
    nameRw: 'Ngoma',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    altitudeMeters: 1470,
    agroEcoZone: 'eastern_savanna',
    stationName: 'Kibungo Met Station',
    dominantCrops: ['Ibitoki', 'Ikawa', 'Ibigori', 'Ibishyimbo', 'Imyumbati'],
    sectors: ['Gashanda', 'Jarama', 'Karembo', 'Kazo', 'Kibungo', 'Mugesera', 'Murama', 'Mutenderi', 'Remera', 'Rukira', 'Rukumberi', 'Rurenge', 'Sake', 'Zaza'],
    lat: -2.1620,
    lon: 30.4624
  },
  {
    id: 'rwamagana',
    name: 'Rwamagana',
    nameRw: 'Rwamagana',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    altitudeMeters: 1510,
    agroEcoZone: 'eastern_savanna',
    stationName: 'Rwamagana Central Post',
    dominantCrops: ['Ibitoki', 'Ibigori', 'Ikawa', 'Ibishyimbo', 'Ubworozi'],
    sectors: ['Fumbwe', 'Gahengeri', 'Gishari', 'Karenge', 'Kigabiro', 'Muhazi', 'Musha', 'Muyumbu', 'Mwulire', 'Nyakariro', 'Nzige', 'Rubona'],
    lat: -1.9500,
    lon: 30.4333
  },

  // Western Province (Intara y'Iburengerazuba)
  {
    id: 'rubavu',
    name: 'Rubavu',
    nameRw: 'Rubavu',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    altitudeMeters: 1500,
    agroEcoZone: 'kivu_belt',
    stationName: 'Gisenyi Aerodrome Met Station',
    dominantCrops: ['Imboga (Vegetables)', 'Ibirayi', 'Ibitoki', 'Ikawa', 'Imbuto'],
    sectors: ['Bugeshi', 'Busasamana', 'Cyanzarwe', 'Gisenyi', 'Kanama', 'Kanzenze', 'Mudende', 'Nyakiriba', 'Nyamyumba', 'Nyundo', 'Rubavu', 'Rugerero'],
    lat: -1.6934,
    lon: 29.2618
  },
  {
    id: 'karongi',
    name: 'Karongi',
    nameRw: 'Karongi',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    altitudeMeters: 1530,
    agroEcoZone: 'kivu_belt',
    stationName: 'Kibuye Lake Met Station',
    dominantCrops: ['Ikawa (Specialty Coffee)', 'Icyayi', 'Ibitoki', 'Ibishyimbo', 'Ubworozi'],
    sectors: ['Bwishyura', 'Gishyita', 'Gishari', 'Gitesi', 'Mubuga', 'Murambi', 'Murundi', 'Mutuntu', 'Rubengera', 'Rugabano', 'Ruganda', 'Rwankuba', 'Twumba'],
    lat: -2.1578,
    lon: 29.3731
  },
  {
    id: 'rusizi',
    name: 'Rusizi',
    nameRw: 'Rusizi',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    altitudeMeters: 1480,
    agroEcoZone: 'kivu_belt',
    stationName: 'Kamembe Airport Met Station',
    dominantCrops: ['Umuceri (Bugarama Rice)', 'Icyayi', 'Ikawa', 'Ibitoki', 'Ibihaza'],
    sectors: ['Bugarama', 'Butare', 'Gashonga', 'Giheke', 'Gihundwe', 'Gikundamvura', 'Gitambi', 'Kamembe', 'Muganza', 'Mururu', 'Nkanka', 'Nkombo', 'Nkungu', 'Nyakabuye', 'Nyakarenzo', 'Nzahaha', 'Rwimbogo'],
    lat: -2.4846,
    lon: 28.9067
  },
  {
    id: 'nyabihu',
    name: 'Nyabihu',
    nameRw: 'Nyabihu',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    altitudeMeters: 2200,
    agroEcoZone: 'volcanic',
    stationName: 'Mukamira Met Post',
    dominantCrops: ['Ibirayi (Irish Potatoes)', 'Icyayi', 'Imboga', 'Ingano', 'Iparetre'],
    sectors: ['Bigogwe', 'Jenda', 'Jomba', 'Kabatwa', 'Karago', 'Kintobo', 'Mukamira', 'Muringa', 'Rambura', 'Rugera', 'Rurembo', 'Shyira'],
    lat: -1.6500,
    lon: 29.5000
  },
  {
    id: 'ngororero',
    name: 'Ngororero',
    nameRw: 'Ngororero',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    altitudeMeters: 1750,
    agroEcoZone: 'congo_nile',
    stationName: 'Ngororero Agro Station',
    dominantCrops: ['Ikawa', 'Icyayi', 'Ibishyimbo', 'Ibitoki', 'Ibigori'],
    sectors: ['Bwira', 'Gatumba', 'Hindiro', 'Kabaya', 'Kageyo', 'Kavumu', 'Matyazo', 'Muhanda', 'Muhororo', 'Ndaro', 'Ngororero', 'Nyange', 'Sovu'],
    lat: -1.8667,
    lon: 29.6333
  },
  {
    id: 'nyamasheke',
    name: 'Nyamasheke',
    nameRw: 'Nyamasheke',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    altitudeMeters: 1600,
    agroEcoZone: 'kivu_belt',
    stationName: 'Kagano Met Station',
    dominantCrops: ['Ikawa (Coffee)', 'Icyayi', 'Ibitoki', 'Ibishyimbo', 'Imyumbati'],
    sectors: ['Bushekeri', 'Bushenge', 'Cyato', 'Gihombo', 'Kagano', 'Kanjongo', 'Karambi', 'Karengera', 'Kirimbi', 'Macuba', 'Nyabitekeri', 'Mahembe', 'Rangiro', 'Ruharambuga', 'Shangi'],
    lat: -2.3500,
    lon: 29.1333
  },
  {
    id: 'rutsiro',
    name: 'Rutsiro',
    nameRw: 'Rutsiro',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    altitudeMeters: 1900,
    agroEcoZone: 'congo_nile',
    stationName: 'Kivumu Climate Post',
    dominantCrops: ['Ikawa', 'Icyayi', 'Ibirayi', 'Ibishyimbo', 'Ibiti by\'imbuto'],
    sectors: ['Boneza', 'Gihango', 'Kigeyo', 'Kivumu', 'Manihira', 'Mukura', 'Murunda', 'Musasa', 'Mushonyi', 'Mushubati', 'Nyabirasi', 'Ruhango', 'Rusebeya'],
    lat: -1.9333,
    lon: 29.3167
  },
];

export const getDistrictLocation = (districtId: string): Location => {
  const d = RWANDA_DISTRICTS.find(item => item.id.toLowerCase() === districtId.toLowerCase()) || RWANDA_DISTRICTS[3]; // Musanze fallback
  return {
    id: d.id,
    name: d.name,
    province: d.province,
    provinceRw: d.provinceRw,
    zone: d.agroEcoZone,
    lat: d.lat,
    lon: d.lon,
    altitudeMeters: d.altitudeMeters,
    stationName: d.stationName,
    dominantCrops: d.dominantCrops,
    sectors: d.sectors
  };
};

export const ALL_RWANDA_LOCATIONS: Location[] = RWANDA_DISTRICTS.map(d => ({
  id: d.id,
  name: d.name,
  province: d.province,
  provinceRw: d.provinceRw,
  zone: d.agroEcoZone,
  lat: d.lat,
  lon: d.lon,
  altitudeMeters: d.altitudeMeters,
  stationName: d.stationName,
  dominantCrops: d.dominantCrops,
  sectors: d.sectors
}));
