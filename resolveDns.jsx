const types = [
  `A`,
  `AAAA`,
  `CNAME`,
  `TXT`,
  `MX`,
  // `ANAME`,
  // `ANY`,
  // `AXFR`,
  // `CAA`,
  // `HINFO`,
  // `HTTPS`,
  // `IXFR`,
  // `NAPTR`,
  // `NS`,
  // `NULL`,
  // `OPENPGPKEY`,
  // `OPT`,
  // `PTR`,
  // `SOA`,
  // `SRV`,
  // `SSHFP`,
  // `SVCB`,
  // `TLSA`,
  // `DNSSEC`,
  // `Unknown`,
  // `ZERO`
];

export async function resolveDns(hostname) {
  const result = {};

  for (const type of types) {
    try {
      result[type] = await Deno.resolveDns(hostname, type);
      if (result[type]?.length === 0) {
        delete result[type];
      }

      if (Array.isArray(result[type][0])) {
        result[type] = result[type].map((record) => {
          const [...items] = record;
          return items.join(" ");
        });
      }

      if (typeof result[type][0] !== "string") {
        result[type] = result[type].map((record) => {
          const { exchange, preference } = record;
          return `${exchange} (Preference: ${preference})`;
        });
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
