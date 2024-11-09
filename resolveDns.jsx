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
      console.log({ type, result: result[type] });

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
      console.error(error);
    }
  }
  console.log({ result });

  return result;
}

export const Dns = ({ records, domain }) => {
  const arr = Object.entries(records);
  return (
    <section>
      <style>
        {`
    * {font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;}
    button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;margin:0;padding:0;line-height:inherit;color:inherit}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}table{text-indent:0;border-color:inherit;border-collapse:collapse}hr{height:0;color:inherit;border-top-width:1px}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}button{background-color:transparent;background-image:none}body{font-family:inherit;line-height:inherit}*,::before,::after{box-sizing:border-box;border:0 solid #e5e7eb}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}::-moz-focus-inner{border-style:none;padding:0}[type="search"]{-webkit-appearance:textfield;outline-offset:-2px}pre,code,kbd,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}body,blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre,fieldset,ol,ul{margin:0}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}fieldset,ol,ul,legend{padding:0}textarea{resize:vertical}button,[role="button"]{cursor:pointer}:-moz-focusring{outline:1px dotted ButtonText}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}summary{display:list-item}:root{-moz-tab-size:4;tab-size:4}ol,ul{list-style:none}img{border-style:solid}button,select{text-transform:none}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}sub{bottom:-0.25em}sup{top:-0.5em}button,[type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button}::-webkit-search-decoration{-webkit-appearance:none}*{--tw-shadow:0 0 transparent}.divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse:0;border-bottom-width:calc(1px * var(--tw-divide-y-reverse));border-top-width:1px;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)))}.bg-gray-100{--tw-bg-opacity:1;background-color:#f3f4f6;background-color:rgba(243,244,246,var(--tw-bg-opacity))}.text-4xl{font-size:2.25rem;line-height:2.5rem}.shadow-md{--tw-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);box-shadow:var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow)}.bg-white{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.px-4{padding-left:1rem;padding-right:1rem}.py-2{padding-bottom:0.5rem;padding-top:0.5rem}.divide-gray-200>:not([hidden])~:not([hidden]){--tw-divide-opacity:1;border-color:#e5e7eb;border-color:rgba(229,231,235,var(--tw-divide-opacity))}.flex{display:flex}.p-8{padding:2rem}.table{display:table}.w-full{width:100%}.flex-col{-webkit-flex-direction:column;flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.min-h-screen{min-height:100vh}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}.mb-4{margin-bottom:1rem}.font-bold{font-weight:700}.text-center{text-align:center}.table-auto{table-layout:auto}.rounded-lg{border-radius:0.5rem}@media (min-width:640px){.sm\:w-full{width:100%}}@media (min-width:1024px){.lg\:w-1\/2{width:50%}}    `}
      </style>
      <main class="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-mono">
        <h1 class="mb-4 text-4xl font-bold text-center ">
          {domain}
        </h1>
        <div class="p-8 rounded-lg shadow-md bg-white sm:w-full lg:w-1/2">
          <table class="w-full table-auto">
            <thead class="">
              <tr>
                <th class="px-4 py-2">Record</th>
                <th class="px-4 py-2">IP Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {arr.map(([record, ips]) => (
                <tr>
                  <td class="px-4 py-2">{(record)}</td>
                  {ips.map((ip) => (<td class="px-4 py-2">{ip}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </section>
  );
};
