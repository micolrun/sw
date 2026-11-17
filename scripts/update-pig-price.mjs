import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const dabomUrl = 'https://www.ekapepia.com/v3/web/main.do?userGroup=producer';
const publishedUrl = 'https://micolrun.github.io/sw/pig-price.json';

export function tradeDateInKorea(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(now);
}

export function validateQuote(quote, today) {
  if (!quote || !/^20\d{2}-\d{2}-\d{2}$/.test(quote.date) || quote.date > today ||
      !Number.isInteger(quote.price) || quote.price < 1 || quote.price > 50000) return null;
  const parsed = new Date(quote.date + 'T00:00:00Z');
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== quote.date) return null;
  return { date: quote.date, price: quote.price };
}

export function parseDabomQuote(html, today) {
  const card = /<a\b[^>]*\bdata-card="allPig"[^>]*>([\s\S]*?)<\/a>/i.exec(html);
  if (!card || !/<b>\s*전국\(등외,\s*제주 제외\)\s*<\/b>/.test(card[1])) return null;
  const price = /<em\b[^>]*>\s*([\d,]+)\s*<\/em>\s*<span>\s*원\/kg\s*<\/span>/i.exec(card[1]);
  const panel = html.slice(card.index + card[0].length).split(/<div\s+class="main-menu-cont\b/i, 1)[0];
  const footer = panel.split('class="main-menu-bottom"')[1];
  const date = /<b>\s*(\d{2})년\s*(\d{1,2})월\s*(\d{1,2})일\s*<\/b>/.exec(footer?.slice(0, 450) || '');
  if (!price || !date) return null;
  const [, year, month, day] = date;
  return validateQuote({
    date: `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    price: Number(price[1].replaceAll(',', ''))
  }, today);
}

async function fetchQuote(url, readQuote) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
    return response.ok ? await readQuote(response) : null;
  } catch {
    return null;
  }
}

async function publishQuote() {
  const today = tradeDateInKorea();
  const [latest, published] = await Promise.all([
    fetchQuote(dabomUrl, async response => parseDabomQuote(await response.text(), today)),
    fetchQuote(publishedUrl, async response => validateQuote(await response.json(), today))
  ]);
  const quote = latest && (!published || latest.date >= published.date) ? latest : published;
  if (!quote) {
    console.warn('::warning::Dabom quote unavailable. The calculator will identify its saved reference price.');
    return;
  }
  await writeFile('dist/pig-price.json', JSON.stringify(quote) + '\n', 'utf8');
  console.log(`Dabom ${quote.date}: ${quote.price} KRW/kg${quote === latest ? '' : ' (previously published)'}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await publishQuote();
