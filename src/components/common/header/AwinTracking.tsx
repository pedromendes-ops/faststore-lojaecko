import { useEffect } from "react"


export const AwinTracking = () => {
  useEffect(() => {
    const awc = new URLSearchParams(window.location.search).get("awc")

    if (!awc) return

    async function syncAwin() {
      try {
        const response = await fetch(
          "/api/checkout/pub/orderForm",
          {
            credentials: "include"
          }
        )

        const orderForm = await response.json()
        console.log('orderform', orderForm)

        const awinApp = orderForm.customData?.customApps?.find(
          (app) => app.id === "awin"
        )

        const currentAwc = awinApp?.fields?.awc

        // Já está salvo
        if (currentAwc === awc) {
          return
        }

        await fetch(
          `/api/checkout/pub/orderForm/${orderForm.orderFormId}/customData/awin/awc`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              value: awc
            })
          }
        )
      } catch (error) {
        console.error("[Awin] Erro ao salvar AWC", error)
      }
    }

    syncAwin()
  }, [])

  return null
}