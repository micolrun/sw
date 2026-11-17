import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const dabomUrl = 'https://www.ekapepia.com/v3/web/main.do?userGroup=producer';
const publishedUrl = 'https://micolrun.github.io/sw/pig-price.json';

export function tradeDateInKorea(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(now);
}

export function validateQuote(quote, today, maxPrice = 50000) {
  if (!quote || !/^20\d{2}-\d{2}-\d{2}$/.test(quote.date) || quote.date > today ||
      !Number.isInteger(quote.price) || quote.price < 1 || quote.price > maxPrice) return null;
  const parsed = new Date(quote.date + 'T00:00:00Z');
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== quote.date) return null;
  return { date: quote.date, price: quote.price };
}

export function parseDabomQuote(html, today, producer = false) {
  const cardPattern = producer
    ? /<a\b[^>]*\bhref="\/v3\/price\/livestock\/pig\/producer\.do"[^>]*>([\s\S]*?)<\/a>/i
    : /<a\b[^>]*\bdata-card="allPig"[^>]*>([\s\S]*?)<\/a>/i;
  const card = cardPattern.exec(html);
  const label = producer ? /<b>\s*농가수취 비육돈\s*<\/b>/ : /<b>\s*전국\(등외,\s*제주 제외\)\s*<\/b>/;
  if (!card || !label.test(card[1])) return null;
  const price = /<em\b[^>]*>\s*([\d,]+)\s*<\/em>\s*<span>\s*(천원\/110kg|원\/kg)\s*<\/span>/i.exec(card[1]);
  const panel = html.slice(card.index + card[0].length).split(/<div\s+class="main-menu-cont\b/i, 1)[0];
  const footer = panel.split('class="main-menu-bottom"')[1];
  const date = /<b>\s*(\d{2})년\s*(\d{1,2})월\s*(\d{1,2})일\s*<\/b>/.exec(footer?.slice(0, 450) || '');
  if (!price || !date || price[2] !== (producer ? '천원/110kg' : '원/kg')) return null;
  const [, year, month, day] = date;
  return validateQuote({
    date: `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    price: Number(price[1].replaceAll(',', '')) * (producer ? 1000 : 1)
  }, today, producer ? 2000000 : 50000);
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
  const [html, published] = await Promise.all([
    fetchQuote(dabomUrl, response => response.text()),
    fetchQuote(publishedUrl, response => response.json())
  ]);
  const recent = html ? parseDabomQuote(html, today) : null;
  const recentProducer = html ? parseDabomQuote(html, today, true) : null;
  const previous = validateQuote(published, today);
  const previousProducer = validateQuote(published?.producer, today, 2000000);
  const carcass = recent && (!previous || recent.date >= previous.date) ? recent : previous;
  const producer = recentProducer && (!previousProducer || recentProducer.date >= previousProducer.date) ? recentProducer : previousProducer;
  if (!carcass && !producer) {
    console.warn('::warning::Dabom quote unavailable. The calculator will identify its saved reference price.');
    return;
  }
  await writeFile('dist/pig-price.json', JSON.stringify({ ...carcass, producer }) + '\n', 'utf8');
  if (carcass) console.log(`Dabom carcass ${carcass.date}: ${carcass.price} KRW/kg`);
  if (producer) console.log(`Dabom farmgate ${producer.date}: ${producer.price} KRW/110kg`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await publishQuote();
