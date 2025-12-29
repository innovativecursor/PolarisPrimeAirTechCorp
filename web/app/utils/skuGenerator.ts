const STORAGE_KEY = "USED_SIMPLE_SKUS";

function getUsedSkus(): Set<string> {
  const raw = localStorage.getItem(STORAGE_KEY);
  return new Set(raw ? JSON.parse(raw) : []);
}

function saveUsedSkus(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function generateSku(prefix: "INV" | "RR"): string {
  const usedSkus = getUsedSkus();
  let sku = "";

  do {
    const num = Math.floor(1000 + Math.random() * 9000);
    sku = `${prefix}-${num}`;
  } while (usedSkus.has(sku));

  usedSkus.add(sku);
  saveUsedSkus(usedSkus);

  return sku;
}
