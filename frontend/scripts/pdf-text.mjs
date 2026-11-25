import pdfParse from 'pdf-parse'

// Výchozí výstup pdf-parse slepuje sousední buňky tabulky (např. „5,34,91,6“).
// Pro tabulky proto spojujeme textové položky PDF mezerou.
export async function extractPdfItemsText(buffer) {
  const data = await pdfParse(buffer, {
    pagerender: async (page) => {
      const content = await page.getTextContent()
      return content.items.map((item) => item.str).join(' ')
    },
  })
  return data.text
}

export async function extractPdfText(buffer) {
  const data = await pdfParse(buffer)
  return { text: data.text, title: data.info?.Title ?? '' }
}
