export interface MapStateData {
  uf: string;
  nome: string;
  lat: number;
  lon: number;
  valorPrincipal: number;
  contagem: number;
  popupData: Record<string, string | number>;
  theme: { color: string };
}

// Coordenadas e nomes das capitais por UF
const ufInfo: Record<string, { nome: string; lat: number; lon: number }> = {
  AC: { nome: "Acre", lat: -9.9749, lon: -67.8243 },
  AL: { nome: "Alagoas", lat: -9.6659, lon: -35.7352 },
  AP: { nome: "Amapá", lat: 0.0389, lon: -51.0664 },
  AM: { nome: "Amazonas", lat: -3.119, lon: -60.0217 },
  BA: { nome: "Bahia", lat: -12.9714, lon: -38.5014 },
  CE: { nome: "Ceará", lat: -3.7172, lon: -38.5433 },
  DF: { nome: "Distrito Federal", lat: -15.7797, lon: -47.9297 },
  ES: { nome: "Espírito Santo", lat: -20.3194, lon: -40.3378 },
  GO: { nome: "Goiás", lat: -16.6869, lon: -49.2648 },
  MA: { nome: "Maranhão", lat: -2.5307, lon: -44.3068 },
  MT: { nome: "Mato Grosso", lat: -15.6014, lon: -56.0977 },
  MS: { nome: "Mato Grosso do Sul", lat: -20.4486, lon: -54.6295 },
  MG: { nome: "Minas Gerais", lat: -19.9167, lon: -43.9345 },
  PA: { nome: "Pará", lat: -1.4558, lon: -48.5044 },
  PB: { nome: "Paraíba", lat: -7.1195, lon: -34.8631 },
  PR: { nome: "Paraná", lat: -25.4284, lon: -49.2733 },
  PE: { nome: "Pernambuco", lat: -8.0578, lon: -34.8829 },
  PI: { nome: "Piauí", lat: -5.0949, lon: -42.8041 },
  RJ: { nome: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
  RN: { nome: "Rio Grande do Norte", lat: -5.7945, lon: -35.2094 },
  RS: { nome: "Rio Grande do Sul", lat: -30.0346, lon: -51.2177 },
  RO: { nome: "Rondônia", lat: -8.7619, lon: -63.9039 },
  RR: { nome: "Roraima", lat: 2.8235, lon: -60.6753 },
  SC: { nome: "Santa Catarina", lat: -27.5954, lon: -48.548 },
  SP: { nome: "São Paulo", lat: -23.5505, lon: -46.6333 },
  SE: { nome: "Sergipe", lat: -10.9472, lon: -37.0731 },
  TO: { nome: "Tocantins", lat: -10.2128, lon: -48.3603 },
};

// Cores por KPI
const themeColor: Record<string, string> = {
  "Receita Bruta Total": "#0D6EFD",
  "Vendas de Produtos": "#0B5ED7",
  "Serviços Prestados": "#198754",
  "Compras e Aquisições": "#FFC107",
  "Notas Canceladas": "#DC3545",
};

/**
 * Processa dados brutos da API e retorna array pronto para renderização no mapa.
 */
export function processDataForMap(apiData: any, activeKpi: string): MapStateData[] {
  const items: any[] = [];
  const toNumber = (v: any) => parseFloat(v) || 0;

  switch (activeKpi) {
    case "Receita Bruta Total":
      (apiData.saidas || []).filter((x: any) => x.cancelada === "N").forEach((x: any) => items.push(x));
      (apiData.servicos || []).filter((x: any) => x.cancelada === "N").forEach((x: any) => items.push(x));
      break;
    case "Vendas de Produtos":
      (apiData.saidas || []).filter((x: any) => x.cancelada === "N").forEach((x: any) => items.push(x));
      break;
    case "Serviços Prestados":
      (apiData.servicos || []).filter((x: any) => x.cancelada === "N").forEach((x: any) => items.push(x));
      break;
    case "Compras e Aquisições":
      (apiData.entradas || []).forEach((x: any) => items.push(x));
      break;
    case "Notas Canceladas":
      (apiData.saidas || []).filter((x: any) => x.cancelada === "S").forEach((x: any) => items.push(x));
      (apiData.servicos || []).filter((x: any) => x.cancelada === "S").forEach((x: any) => items.push(x));
      break;
    default:
      return [];
  }

  // Agrupa por UF
  const grouped: Record<string, { sum: number; count: number }> = {};
  items.forEach(x => {
    const uf = x.UF || x.uf || x.ufOrigem;
    if (!ufInfo[uf]) return;
    if (!grouped[uf]) grouped[uf] = { sum: 0, count: 0 };
    grouped[uf].sum += toNumber(x.valor);
    grouped[uf].count += 1;
  });

  // Monta array de MapStateData
  return Object.entries(grouped).map(([uf, { sum, count }]) => {
    const info = ufInfo[uf];
    const color = themeColor[activeKpi] || "#3388ff";
    const ticket = count > 0 ? sum / count : 0;
    // Conteúdo do popup conforme KPI
    const popupData: Record<string, string | number> = {};
    switch (activeKpi) {
      case "Receita Bruta Total":
        popupData["Receita"] = sum;
        popupData["Transações"] = count;
        popupData["Ticket Médio"] = ticket;
        break;
      case "Vendas de Produtos":
        popupData["Vendas"] = sum;
        popupData["Notas Fiscais"] = count;
        popupData["Ticket Médio"] = ticket;
        break;
      case "Serviços Prestados":
        popupData["Serviços"] = sum;
        popupData["Notas Fiscais"] = count;
        popupData["Ticket Médio"] = ticket;
        break;
      case "Compras e Aquisições":
        popupData["Compras"] = sum;
        popupData["Notas Fiscais"] = count;
        popupData["Compra Média"] = ticket;
        break;
      case "Notas Canceladas":
        popupData["Valor Cancelado"] = sum;
        popupData["Notas Canceladas"] = count;
        break;
    }
    return {
      uf,
      nome: info.nome,
      lat: info.lat,
      lon: info.lon,
      valorPrincipal: sum,
      contagem: count,
      popupData,
      theme: { color },
    };
  });
}
