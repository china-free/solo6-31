export interface Country {
  code: string;
  name: string;
  nameEn: string;
  continent: string;
}

export const COUNTRIES: Country[] = [
  { code: "CN", name: "中国", nameEn: "China", continent: "亚洲" },
  { code: "JP", name: "日本", nameEn: "Japan", continent: "亚洲" },
  { code: "KR", name: "韩国", nameEn: "South Korea", continent: "亚洲" },
  { code: "IN", name: "印度", nameEn: "India", continent: "亚洲" },
  { code: "TH", name: "泰国", nameEn: "Thailand", continent: "亚洲" },
  { code: "VN", name: "越南", nameEn: "Vietnam", continent: "亚洲" },
  { code: "SG", name: "新加坡", nameEn: "Singapore", continent: "亚洲" },
  { code: "MY", name: "马来西亚", nameEn: "Malaysia", continent: "亚洲" },
  { code: "ID", name: "印度尼西亚", nameEn: "Indonesia", continent: "亚洲" },
  { code: "PH", name: "菲律宾", nameEn: "Philippines", continent: "亚洲" },
  { code: "TR", name: "土耳其", nameEn: "Turkey", continent: "亚洲" },
  { code: "SA", name: "沙特阿拉伯", nameEn: "Saudi Arabia", continent: "亚洲" },
  { code: "IR", name: "伊朗", nameEn: "Iran", continent: "亚洲" },
  { code: "IL", name: "以色列", nameEn: "Israel", continent: "亚洲" },
  { code: "GB", name: "英国", nameEn: "United Kingdom", continent: "欧洲" },
  { code: "FR", name: "法国", nameEn: "France", continent: "欧洲" },
  { code: "DE", name: "德国", nameEn: "Germany", continent: "欧洲" },
  { code: "IT", name: "意大利", nameEn: "Italy", continent: "欧洲" },
  { code: "ES", name: "西班牙", nameEn: "Spain", continent: "欧洲" },
  { code: "PT", name: "葡萄牙", nameEn: "Portugal", continent: "欧洲" },
  { code: "NL", name: "荷兰", nameEn: "Netherlands", continent: "欧洲" },
  { code: "BE", name: "比利时", nameEn: "Belgium", continent: "欧洲" },
  { code: "CH", name: "瑞士", nameEn: "Switzerland", continent: "欧洲" },
  { code: "SE", name: "瑞典", nameEn: "Sweden", continent: "欧洲" },
  { code: "NO", name: "挪威", nameEn: "Norway", continent: "欧洲" },
  { code: "FI", name: "芬兰", nameEn: "Finland", continent: "欧洲" },
  { code: "DK", name: "丹麦", nameEn: "Denmark", continent: "欧洲" },
  { code: "AT", name: "奥地利", nameEn: "Austria", continent: "欧洲" },
  { code: "GR", name: "希腊", nameEn: "Greece", continent: "欧洲" },
  { code: "RU", name: "俄罗斯", nameEn: "Russia", continent: "欧洲" },
  { code: "PL", name: "波兰", nameEn: "Poland", continent: "欧洲" },
  { code: "IE", name: "爱尔兰", nameEn: "Ireland", continent: "欧洲" },
  { code: "US", name: "美国", nameEn: "United States", continent: "美洲" },
  { code: "CA", name: "加拿大", nameEn: "Canada", continent: "美洲" },
  { code: "MX", name: "墨西哥", nameEn: "Mexico", continent: "美洲" },
  { code: "BR", name: "巴西", nameEn: "Brazil", continent: "美洲" },
  { code: "AR", name: "阿根廷", nameEn: "Argentina", continent: "美洲" },
  { code: "CL", name: "智利", nameEn: "Chile", continent: "美洲" },
  { code: "PE", name: "秘鲁", nameEn: "Peru", continent: "美洲" },
  { code: "CO", name: "哥伦比亚", nameEn: "Colombia", continent: "美洲" },
  { code: "CU", name: "古巴", nameEn: "Cuba", continent: "美洲" },
  { code: "EG", name: "埃及", nameEn: "Egypt", continent: "非洲" },
  { code: "ZA", name: "南非", nameEn: "South Africa", continent: "非洲" },
  { code: "NG", name: "尼日利亚", nameEn: "Nigeria", continent: "非洲" },
  { code: "KE", name: "肯尼亚", nameEn: "Kenya", continent: "非洲" },
  { code: "MA", name: "摩洛哥", nameEn: "Morocco", continent: "非洲" },
  { code: "ET", name: "埃塞俄比亚", nameEn: "Ethiopia", continent: "非洲" },
  { code: "AU", name: "澳大利亚", nameEn: "Australia", continent: "大洋洲" },
  { code: "NZ", name: "新西兰", nameEn: "New Zealand", continent: "大洋洲" },
];

export const TOTAL_COUNTRY_COUNT = COUNTRIES.length;

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getFlagUrl(code: string): string {
  return `https://flagcdn.com/w160/${code.toLowerCase()}.png`;
}
