import React from "react";
import { Input, Table } from "reactstrap";
import { FilaCarga } from "@store/slices/cargaAcademica";

type Props = {
    filas: FilaCarga[];
    seleccionadas: number[];
    disabled: boolean;
    onSelect: (fila: number) => void;
};

export default function VistaPreviaCarga({ filas, seleccionadas, disabled, onSelect }: Props) {
    return <div style={{ maxHeight: "32rem", overflow: "auto" }}>
        <Table responsive bordered size="sm">
            <thead><tr>
                <th>Importar</th><th>Docente</th><th>Asignatura</th><th>Sección</th>
                <th>Fechas</th><th>Horario</th><th>Campus</th><th>Carreras y bloques de destino</th><th>Validación</th>
            </tr></thead>
            <tbody>{filas.map(fila => <tr key={fila.fila}>
                <td><Input type="checkbox" aria-label={`Importar fila ${fila.fila}`}
                    checked={seleccionadas.includes(fila.fila)} disabled={disabled || fila.errores.length > 0}
                    onChange={() => onSelect(fila.fila)} /></td>
                <td>{fila.docenteId}<br />{fila.nombre_docente}</td>
                <td>{fila.codigo}<br />{fila.nombre_clase}</td>
                <td>{fila.seccion}</td>
                <td>{fila.fecha_inicio}<br />{fila.fecha_final}</td>
                <td>{fila.dias}<br />{fila.hora_inicio} – {fila.hora_final}</td>
                <td>{fila.campus}</td>
                <td>{fila.destinos?.map(destino => <div key={destino}>{destino}</div>)}</td>
                <td>
                    {!fila.errores.length && <span className="text-success">Válida</span>}
                    {fila.errores.map(message => <div className="text-danger" key={message}>{message}</div>)}
                    {fila.advertencias.map(message => <div className="text-warning" key={message}>{message}</div>)}
                </td>
            </tr>)}</tbody>
        </Table>
    </div>;
}
