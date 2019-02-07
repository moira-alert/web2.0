import { checkMobile } from "./check-mobile";

const tests = [
  {
    title: "Chrome for Android",
    input:
      "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19",
    output: true
  },
  {
    title: "Android Web View",
    input:
      "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36",
    output: true
  },
  {
    title: "Firefox for Android",
    input: "Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0",
    output: true
  },
  {
    title: "Chrome for iOS",
    input:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1",
    output: true
  },
  {
    title: "Firefox for iOS",
    input:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4",
    output: true
  },
  {
    title: "iOS Safari",
    input:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.23 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1",
    output: true
  },
  {
    title: "macos Safari",
    input:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12",
    output: false
  },
  {
    title: "Focus for Android",
    input:
      "Mozilla/5.0 (Linux; Android 7.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Focus/1.0 Chrome/59.0.3029.83 Safari/537.36",
    output: false
  },
  {
    title: "Opera mobile for Android",
    input:
      "Opera/9.80 (Android 2.3.3; Linux; Opera Mobi/ADR-1111101157; U; es-ES) Presto/2.9.201 Version/11.50",
    output: false
  }
];

tests.forEach(({ title, input, output }) => {
  test(title, () => {
    expect(checkMobile(input)).toBe(output);
  });
});
