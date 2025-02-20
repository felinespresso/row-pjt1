import { LoadingUI } from "../../../../../_components/loading-ui/load"

export default function Loading() {

    return(
        <div>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
            <main className="font-montserrat"><LoadingUI/></main>
        </div>
    )
}