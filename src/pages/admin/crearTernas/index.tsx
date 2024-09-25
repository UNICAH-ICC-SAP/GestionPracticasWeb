import React from "react";

import { useSelector } from "../../../store";
import { Selector as SelectorTernas } from "../../../store/slices/ternas";
import Step1 from "./creacionTernas/step1";
import Step2 from "./creacionTernas/step2";
import Resumen from "./creacionTernas/resumen";

export default function CrearTernas() {

    const step1 = useSelector(SelectorTernas.getStep1);
    const step2 = useSelector(SelectorTernas.getStep2);
    const resume = useSelector(SelectorTernas.getResume);
    return <React.Fragment>
        {step1 && <Step1 />}
        {step2 && <Step2 />}
        {resume && <Resumen />}
    </React.Fragment>
}