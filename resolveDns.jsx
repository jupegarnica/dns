const types = [
  `A`,
  `AAAA`,
  `CNAME`,
  `TXT`,
  `MX`,
];

// Los mismos tipos que usaba Deno.resolveDns, resueltos por DNS-over-HTTPS.
const TYPE_CODES = {
  A: 1,
  AAAA: 28,
  CNAME: 5,
  TXT: 16,
  MX: 15,
};

function stripTxtQuotes(data) {
  const chunks = String(data).match(/"((?:[^"\\]|\\.)*)"/g);
  if (!chunks) return String(data);
  return chunks
    .map((chunk) =>
      chunk
        .slice(1, -1)
        .replace(/\\"/g, `"`)
        .replace(/\\\\/g, `\\`)
    )
    .join(" ");
}

export async function resolveDns(hostname) {
  const result = {};

  for (const type of types) {
    try {
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${
          encodeURIComponent(hostname)
        }&type=${type}`,
        { headers: { accept: `application/dns-json` } },
      );

      if (!response.ok) continue;

      const { Answer } = await response.json();
      // La respuesta incluye la cadena CNAME completa: nos quedamos solo
      // con los registros del tipo consultado.
      const answers = (Answer ?? []).filter(
        (answer) => answer.type === TYPE_CODES[type],
      );
      if (!answers.length) continue;

      let values;
      if (type === `MX`) {
        values = answers.map((answer) => {
          const [preference, ...exchange] = String(answer.data).split(` `);
          return `${exchange.join(` `)} (Preference: ${preference})`;
        });
      } else if (type === `TXT`) {
        values = answers.map((answer) => stripTxtQuotes(answer.data));
      } else {
        values = answers.map((answer) => String(answer.data));
      }

      if (values.length) {
        result[type] = values;
      }
    } catch (error) {
      //console.error(error);
    }
  }

  return result;
}

export const Dns = ({ records, domain }) => {
  const arr = Object.entries(records);
  return (
    <html>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              }
              body {
                background: linear-gradient(135deg, #f0f4f8, #d9e2ec, #bcccdc); color: #333; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;
              }
              h1, .input {color: #2c3e50; font-size: 3rem; margin-bottom: 1rem; text-align: center; border: none; outline: none; background: none; width: 100%; text-align: center;}
              .input {border: 2px solid #ccc; padding: 0.5rem; border-radius: 8px;}
              .input:focus {border-color: #2980b9;}
              .container {max-width: 800px; padding: 2rem; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);}
              table {width: 100%; border-collapse: collapse; margin-top: 1rem;}
              th, td {padding: 1rem; text-align: left; border-bottom: 1px solid #ddd;}
              th {background-color: #f8f9fa; font-weight: bold;}
              tr:nth-child(even) {background-color: #f2f2f2;}
              .record {font-weight: bold; color: #2980b9;}
              .ip-details {color: #7f8c8d;}
              ::selection {background: #f0f4f8; color: #333;}
            `,
          }}
        />
      </head>
      <body>
        <main class="container">
          <input type="text" className="input" value={domain} />
          <table>
            <thead>
              <tr>
                <th>Record</th>
                <th>IP Details</th>
              </tr>
            </thead>
            <tbody>
              {arr.map(([record, ips]) => (
                <tr key={record}>
                  <td class="record">{record}</td>
                  <td class="ip-details">{ips.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <script>
                const input = document.querySelector('.input');
                input.focus();
                input.select();
                input.addEventListener('keypress', (event) => {
                  if (event.key === 'Enter') {
                    const inputValue = event.target.value;
                    window.location.href = '/' + inputValue;
                  }
                });
              </script>
            `,
          }}
        />
      </body>
    </html>
  );
};
