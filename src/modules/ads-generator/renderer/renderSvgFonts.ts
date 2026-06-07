export function renderSvgFonts(): string {
  return `
    <style>
      @font-face {
        font-family: "Roc Grotesk";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskRegular/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskRegular/font.woff") format("woff");
        font-weight: 400;
        font-style: normal;
      }

      @font-face {
        font-family: "Roc Grotesk";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskMedium/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskMedium/font.woff") format("woff");
        font-weight: 500;
        font-style: normal;
      }

      @font-face {
        font-family: "Roc Grotesk";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskBold/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskBold/font.woff") format("woff");
        font-weight: 700;
        font-style: normal;
      }

      @font-face {
        font-family: "Roc Grotesk";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskBold/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskBold/font.woff") format("woff");
        font-weight: 800;
        font-style: normal;
      }

      @font-face {
        font-family: "Roc Grotesk";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskBold/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskBold/font.woff") format("woff");
        font-weight: 900;
        font-style: normal;
      }

      @font-face {
        font-family: "Roc Grotesk Wide";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskWideMedium/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskWideMedium/font.woff") format("woff");
        font-weight: 500;
        font-style: normal;
      }

      @font-face {
        font-family: "Roc Grotesk Wide";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskWideBold/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskWideBold/font.woff") format("woff");
        font-weight: 700;
        font-style: normal;
      }

      @font-face {
        font-family: "Roc Grotesk Wide";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskWideBold/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskWideBold/font.woff") format("woff");
        font-weight: 800;
        font-style: normal;
      }

      @font-face {
        font-family: "Roc Grotesk Wide";
        src:
          url("/creative-stack/fonts/roc-grotesk/RocGroteskWideBold/font.woff2") format("woff2"),
          url("/creative-stack/fonts/roc-grotesk/RocGroteskWideBold/font.woff") format("woff");
        font-weight: 900;
        font-style: normal;
      }
    </style>
  `;
}