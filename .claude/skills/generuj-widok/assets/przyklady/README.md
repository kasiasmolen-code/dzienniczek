# Przykłady — referencyjne screeny (odtwarzalne)

> **Zasada:** nie trzymamy tu ręcznych, zamrożonych PNG — starzeją się po cichu. Asety są **odtwarzalne**: tu jest live node-id do Figmy, a screen generujemy na żądanie przez MCP. „Odśwież asety" = jedno wywołanie `get_screenshot`.

## Plik źródłowy (Figma)

- **fileKey:** `ZcP3u9vSI9pkj3tNhFL70X`
- **Obra shadcn/ui kit (community edition) 1.6.0**
- Link: https://www.figma.com/design/ZcP3u9vSI9pkj3tNhFL70X/

## Node-id do odtworzenia

| Co | node-id | Jak pobrać |
|---|---|---|
| Frame Button (warianty × rozmiary × stany) | `273:30945` | `get_screenshot fileKey=ZcP3u9vSI9pkj3tNhFL70X nodeId=273-30945` |

> Dopisuj kolejne wiersze, gdy dodajesz komponent do allowlisty (np. Dialog, Input). Trzymaj **node-id**, nie obrazek. Realne PNG generuj do tego katalogu dopiero gdy potrzebne (np. do PR-a) i traktuj jako jednorazowe.

## Komenda odświeżenia (wzór)

```
get_screenshot(fileKey="ZcP3u9vSI9pkj3tNhFL70X", nodeId="273-30945")
```
