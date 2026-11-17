import React, { useEffect, useState } from "react";
import { Alert, Button, ButtonGroup, FormGroup, Input, Label, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "@store/index";
import { Action, Fetcher, Selector } from "@store/slices/cargaAcademica";
import { Action as SeccionAction } from "@store/slices/secciones";
import { Fetcher as PeriodoFetcher, Selector as PeriodoSelector } from "@store/slices/periodo";
import { Fetcher as FacultadFetcher, Selector as FacultadSelector } from "@store/slices/facultades";
import ArchivoCarga from "./ArchivoCarga";
import VistaPreviaCarga from "./VistaPreviaCarga";

function readBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
        reader.readAsDataURL(file);
    });
}

export default function ImportarCarga() {
    const dispatch = useDispatch();
    const { filas, loading, error, resultado, registros, duplicados } = useSelector(Selector);
    const periodos = useSelector(PeriodoSelector.getPeriodos);
    const facultades = useSelector(FacultadSelector.getFacultades);
    const [periodo, setPeriodo] = useState("");
    const [facultad, setFacultad] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
    const [localError, setLocalError] = useState("");
    const [reading, setReading] = useState(false);
    const busy = loading || reading;

    useEffect(() => {
        dispatch(Action.cleanStore());
        dispatch(PeriodoFetcher.getPeriodos({ url: "/periodo/get" }));
        dispatch(FacultadFetcher.getFacultades({ url: "/facultad/getFacultades" }));
        return () => { dispatch(Action.cleanStore()); };
    }, [dispatch]);

    useEffect(() => {
        setSeleccionadas(filas.filter(fila => !fila.errores.length).map(fila => fila.fila));
    }, [filas]);

    const reset = () => {
        dispatch(Action.cleanStore());
        setSeleccionadas([]);
        setLocalError("");
    };

    const preview = async () => {
        if (!file || !periodo || !facultad) return;
        if (!/\.(pdf|xlsx)$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
            setLocalError("Selecciona un PDF o Excel .xlsx de hasta 10 MB.");
            return;
        }
        setLocalError("");
        setReading(true);
        try {
            const archivo = await readBase64(file);
            await dispatch(Fetcher.preview({ nombre: file.name, archivo, id_periodo: periodo, facultadId: facultad }));
        } catch {
            setLocalError("No se pudo leer el archivo.");
        } finally {
            setReading(false);
        }
    };

    const downloadExcel = async () => {
        const result = await dispatch(Fetcher.excel({ filas }));
        if (!Fetcher.excel.fulfilled.match(result) || !result.payload.archivo || result.payload.error) return;
        const bytes = Uint8Array.from(atob(result.payload.archivo), character => character.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = filas.length ? "carga-academica.xlsx" : "formato-carga-academica.xlsx";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const confirm = async () => {
        const result = await dispatch(Fetcher.confirm({
            filas: filas.filter(fila => seleccionadas.includes(fila.fila)),
            id_periodo: periodo,
            facultadId: facultad,
        }));
        if (Fetcher.confirm.fulfilled.match(result) && !result.payload.error) {
            dispatch(SeccionAction.setIsUpdate(true));
        }
    };

    return <section className="pb-4">
        <h2>Importar carga académica</h2>
        <p>Selecciona el período y la carrera de destino. Revisa los datos antes de confirmar; no se crean docentes ni asignaturas automáticamente.</p>
        <FormGroup>
            <Label for="periodo-importar">Período existente</Label>
            <Input id="periodo-importar" type="select" value={periodo} disabled={busy}
                onChange={event => { reset(); setPeriodo(event.target.value); }}>
                <option value="">Selecciona un período</option>
                {(periodos || []).map(item => <option key={item.id_periodo} value={item.id_periodo}>{item.id_periodo}</option>)}
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="carrera-importar">Carrera de destino</Label>
            <Input id="carrera-importar" type="select" value={facultad} disabled={busy}
                onChange={event => { reset(); setFacultad(event.target.value); }}>
                <option value="">Selecciona una carrera</option>
                {(facultades || []).map(item => <option key={item.facultadId} value={item.facultadId}>{item.nombreFacultad}</option>)}
            </Input>
        </FormGroup>
        <ArchivoCarga disabled={busy} onChange={value => { reset(); setFile(value); }} />
        <ButtonGroup className="mb-3">
            <Button color="primary" disabled={busy || !file || !periodo || !facultad} onClick={preview}>Analizar archivo</Button>
            <Button color="secondary" disabled={busy} onClick={downloadExcel}>{filas.length ? "Descargar datos en Excel" : "Descargar formato Excel"}</Button>
        </ButtonGroup>
        {busy && <div role="status"><Spinner size="sm" /> Procesando carga...</div>}
        {(localError || error) && <Alert color="danger" role="alert">{localError || error}</Alert>}
        {resultado && <Alert color="success">Carga finalizada: {resultado.insertados} registros de horario creados y {resultado.duplicados} duplicados omitidos.</Alert>}
        {!!filas.length && <>
            <Alert color="info">{filas.length} clases detectadas; {filas.filter(fila => fila.errores.length).length} con errores.
                {" "}{seleccionadas.length} seleccionadas. La vista previa completa genera {registros} registros por día y bloque; {duplicados} duplicados omitidos.
                {" "}Las fechas y el campus se conservarán en las observaciones de la sección.</Alert>
            <ButtonGroup className="mb-3">
                <Button disabled={busy} onClick={() => setSeleccionadas(filas.filter(fila => !fila.errores.length).map(fila => fila.fila))}>Seleccionar válidas</Button>
                <Button disabled={busy} onClick={() => setSeleccionadas([])}>Quitar selección</Button>
            </ButtonGroup>
            <VistaPreviaCarga filas={filas} seleccionadas={seleccionadas} disabled={busy}
                onSelect={fila => setSeleccionadas(previous => previous.includes(fila) ? previous.filter(item => item !== fila) : [...previous, fila])} />
            <p>Si hay errores, descarga el Excel, corrige sus datos y vuelve a analizarlo. Solo se guardarán las filas seleccionadas; las cargas existentes se conservan.</p>
            <Button color="success" disabled={busy || !seleccionadas.length} onClick={confirm}>
                Confirmar importación de {seleccionadas.length} clases
            </Button>
        </>}
    </section>;
}
