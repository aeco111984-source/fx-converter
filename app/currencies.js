const currencyList = [
  { code: "USD", name: "US Dollar", country: "US" },
  { code: "EUR", name: "Euro", country: "EU" },
  { code: "GBP", name: "British Pound", country: "GB" },
  { code: "JPY", name: "Japanese Yen", country: "JP" },
  { code: "CHF", name: "Swiss Franc", country: "CH" },
  { code: "AUD", name: "Australian Dollar", country: "AU" },
  { code: "NZD", name: "New Zealand Dollar", country: "NZ" },
  { code: "CAD", name: "Canadian Dollar", country: "CA" },
  { code: "CNY", name: "Chinese Yuan", country: "CN" },
  { code: "HKD", name: "Hong Kong Dollar", country: "HK" },
  { code: "SGD", name: "Singapore Dollar", country: "SG" },
  { code: "INR", name: "Indian Rupee", country: "IN" },
  { code: "AED", name: "UAE Dirham", country: "AE" },
  { code: "SAR", name: "Saudi Riyal", country: "SA" },
  { code: "QAR", name: "Qatari Riyal", country: "QA" },
  { code: "ZAR", name: "South African Rand", country: "ZA" },
  { code: "SEK", name: "Swedish Krona", country: "SE" },
  { code: "NOK", name: "Norwegian Krone", country: "NO" },
  { code: "DKK", name: "Danish Krone", country: "DK" },
  { code: "PLN", name: "Polish Zloty", country: "PL" },
  { code: "CZK", name: "Czech Koruna", country: "CZ" },
  { code: "HUF", name: "Hungarian Forint", country: "HU" },
  { code: "RON", name: "Romanian Leu", country: "RO" },
  { code: "TRY", name: "Turkish Lira", country: "TR" },
  { code: "MXN", name: "Mexican Peso", country: "MX" },
  { code: "BRL", name: "Brazilian Real", country: "BR" },
  { code: "ARS", name: "Argentine Peso", country: "AR" },
  { code: "CLP", name: "Chilean Peso", country: "CL" },
  { code: "COP", name: "Colombian Peso", country: "CO" },
  { code: "PEN", name: "Peruvian Sol", country: "PE" },
  { code: "KRW", name: "South Korean Won", country: "KR" },
  { code: "THB", name: "Thai Baht", country: "TH" },
  { code: "MYR", name: "Malaysian Ringgit", country: "MY" },
  { code: "IDR", name: "Indonesian Rupiah", country: "ID" },
  { code: "PHP", name: "Philippine Peso", country: "PH" },
  { code: "VND", name: "Vietnamese Dong", country: "VN" },
  { code: "PKR", name: "Pakistani Rupee", country: "PK" },
  { code: "EGP", name: "Egyptian Pound", country: "EG" },
  { code: "NGN", name: "Nigerian Naira", country: "NG" },
  { code: "KES", name: "Kenyan Shilling", country: "KE" },
  { code: "GHS", name: "Ghanaian Cedi", country: "GH" },
];

function countryToFlag(countryCode) {
  if (!countryCode) return "";
  if (countryCode === "EU") return "🇪🇺";
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

const currencies = currencyList.map(c => ({
  ...c,
  flag: countryToFlag(c.country),
}));

export default currencies;
