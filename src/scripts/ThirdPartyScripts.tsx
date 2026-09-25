const GTM_CONTAINER_ID = "GTM-TGNTSN";

const ThirdPartyScripts = () => {
  return (
    <>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`,
        }}
      />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `(function () {
            var yvs = document.createElement("script");
            yvs.type = "text/javascript";
            yvs.async = true;
            yvs.id = "_yvsrc";
            yvs.src = "//service.yourviews.com.br/script/9ca1b06f-2d54-4dc9-b9f0-a54df72b12e6/yvapi.js";
            var yvs_script = document.getElementsByTagName("script")[0];
            yvs_script.parentNode.insertBefore(yvs, yvs_script);
          })();`,
        }}
      />
      <script
        defer={true}
        id="sizebay-vfr-v4"
        src="https://static.sizebay.technology/708/prescript.js"
      ></script>
      <script
        defer={true}
        id="sizebay-vfr-v4"
        src="https://static.sizebay.technology/708/fh_prescript.js"
      ></script>
      {/* neoassist */}
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `setTimeout(function () {
            (function () {
              window.NeoAssistTag = {};
              NeoAssistTag.querystring = true;
              NeoAssistTag.pageid = '';
              NeoAssistTag.clientdomain = 'selia.neoassist.com';
              NeoAssistTag.initialize = {};
              var na = document.createElement('script');
              na.type = 'text/javascript';
              na.async = true;
              na.src = 'https://cdn.atendimen.to/n.js';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(na, s);
            })();
          }, 2400);`,
        }}
      />
    </>
  );
};

export default ThirdPartyScripts;
