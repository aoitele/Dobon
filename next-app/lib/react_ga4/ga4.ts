import ReactGA from "react-ga4"
import { UaEventOptions } from "react-ga4/types/ga4"

const initializeReactGa4 = () => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    throw new Error ('Not Provided GA_MEASUREMENT_ID')
  }  
  ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
}

const sendPageView = (path: string, title: string) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title,
  })
}

const sendEvent = (uaEventOptions: UaEventOptions | string) => {  
  ReactGA.event(typeof uaEventOptions === 'string'
  ? uaEventOptions 
  : {
    category: uaEventOptions.category,
    action: uaEventOptions.action,
    label: uaEventOptions.label, // optional
    value: uaEventOptions.value, // optional, must be a number
    nonInteraction: uaEventOptions.nonInteraction, // optional, true/false
    transport: uaEventOptions.transport, // optional, beacon/xhr/image
  })
}

export { initializeReactGa4, sendPageView, sendEvent }