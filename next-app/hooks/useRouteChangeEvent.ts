import { useEffect } from "react";
import { useRouter } from "next/router";
import { sendPageView } from "../lib/react_ga4/ga4";

/** *
 * GAのpageView計測など、ページ遷移が発生した際の処理を記述するカスタムフック
 */
const useRouteChangeEvent = () => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (path: string) => {
      const pageTitle = document.title
      sendPageView(path, pageTitle)
      console.log(`App is changing to ${path}, title is ${pageTitle}`)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    }
  }, [])
}

export { useRouteChangeEvent }