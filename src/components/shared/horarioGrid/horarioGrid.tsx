import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "@store/index";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from "@store/slices/docentes";
import { Selector as SelectorUser } from "@store/slices/users";
import { getData, Post } from "@utilities/Utilities";
import { Container, FormGroup, Label, Input, Button, Spinner } from "reactstrap";
import Swal from "sweetalert2";
import "./horarioGrid.css";

const FRANJAS = [
  { inicio: "06:00", fin: "06:50" },
  { inicio: "07:00", fin: "07:50" },
  { inicio: "08:00", fin: "08:50" },
  { inicio: "09:00", fin: "09:50" },
  { inicio: "10:00", fin: "10:50" },
  { inicio: "11:00", fin: "11:50" },
  { inicio: "12:00", fin: "12:50" },
  { inicio: "13:00", fin: "13:50" },
  { inicio: "14:00", fin: "14:50" },
  { inicio: "15:00", fin: "15:50" },
  { inicio: "16:00", fin: "16:50" },
  { inicio: "17:00", fin: "17:50" },
  { inicio: "18:00", fin: "18:50" },
  { inicio: "19:00", fin: "19:50" },
  { inicio: "20:00", fin: "20:50" },
];

const DIAS = [
  { id: 1, nombre: "LUN" },
  { id: 2, nombre: "MAR" },
  { id: 3, nombre: "MIE" },
  { id: 4, nombre: "JUE" },
  { id: 5, nombre: "VIE" },
  { id: 6, nombre: "SAB" },
];

interface HorarioGridProps {
  modoAdmin?: boolean;
  tipo?: string;
}

export default function HorarioGrid({ modoAdmin = false, tipo = "clase" }: HorarioGridProps) {
  const dispatch = useDispatch();
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [grid, setGrid] = useState<Record<string, boolean>>({});

  const docentes = useSelector(SelectorDocentes.getDocentes);
  const userData = useSelector(SelectorUser.getUser);

  const docenteId = modoAdmin ? docenteSeleccionado : userData?.userId;

  useEffect(() => {
    if (modoAdmin && docentes.length === 0) {
      dispatch(FetcherDocentes.getDocentes({ url: "/docente/getDocentes" }));
    }
  }, [dispatch, docentes, modoAdmin]);

  useEffect(() => {
    if (modoAdmin && docentes && docentes.length > 0 && !docenteSeleccionado) {
      setDocenteSeleccionado(docentes[0].docenteId);
    }
  }, [docentes, docenteSeleccionado, modoAdmin]);

  useEffect(() => {
    if (!docenteId) return;

    setIsLoading(true);
    getData({ url: `/horario/get?docenteId=${docenteId}&tipo=${tipo}&_t=${Date.now()}` })
      .then(response => {
        const newGrid: Record<string, boolean> = {};
        FRANJAS.forEach(franja => {
          DIAS.forEach(dia => {
            newGrid[`${dia.id}_${franja.inicio}_${franja.fin}`] = false;
          });
        });

        if (Array.isArray(response.data)) {
          response.data.forEach((disp: { dia: number; franja_inicio: string; franja_fin: string }) => {
            const inicio = disp.franja_inicio?.substring(0, 5);
            const fin = disp.franja_fin?.substring(0, 5);
            const franja = FRANJAS.find(f => f.inicio === inicio && f.fin === fin);
            if (franja) {
              newGrid[`${disp.dia}_${franja.inicio}_${franja.fin}`] = true;
            }
          });
        }

        setGrid(newGrid);
      })
      .finally(() => setIsLoading(false));
  }, [docenteId, tipo]);

  const toggleCelda = useCallback((key: string) => {
    if (modoAdmin) return;
    setGrid(prev => ({ ...prev, [key]: !prev[key] }));
  }, [modoAdmin]);

  const handleGuardar = async () => {
    if (!docenteId) {
      Swal.fire("Atención", "No se pudo identificar al docente.", "warning");
      return;
    }

    setGuardando(true);

    const disponibilidadesAGuardar = Object.keys(grid).map(key => {
      const partes = key.split("_");
      return {
        docenteId,
        dia: parseInt(partes[0]),
        franja_inicio: partes[1],
        franja_fin: partes[2],
        disponible: grid[key]
      };
    });

    try {
      await Post({
        url: "/horario/upsert",
        data: { docenteId, disponibilidades: disponibilidadesAGuardar, tipo }
      });

      const response = await getData({
        url: `/horario/get?docenteId=${docenteId}&tipo=${tipo}&_t=${Date.now()}`
      });

      const newGrid: Record<string, boolean> = {};
      FRANJAS.forEach(franja => {
        DIAS.forEach(dia => {
          newGrid[`${dia.id}_${franja.inicio}_${franja.fin}`] = false;
        });
      });

      if (Array.isArray(response.data)) {
        response.data.forEach((disp: { dia: number; franja_inicio: string; franja_fin: string }) => {
          const inicio = disp.franja_inicio?.substring(0, 5);
          const fin = disp.franja_fin?.substring(0, 5);
          const franja = FRANJAS.find(f => f.inicio === inicio && f.fin === fin);
          if (franja) {
            newGrid[`${disp.dia}_${franja.inicio}_${franja.fin}`] = true;
          }
        });
      }

      setGrid(newGrid);
      Swal.fire("Éxito", "Tu horario de disponibilidad ha sido guardado correctamente.", "success");
    } catch {
      Swal.fire("Error", "Hubo un error al guardar.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleDocenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocenteSeleccionado(e.target.value);
  };

  const tituloPorTipo = tipo === "clase" ? "Horario de Clase" : "Horario para Defensa";

  return (
    <Container fluid>
      <div className="horario-grid-wrapper">
        <div className="horario-grid-header">
          <h4>{modoAdmin ? `Ver ${tituloPorTipo} del Docente` : `Mi ${tituloPorTipo}`}</h4>
        </div>

        {modoAdmin && (
          <FormGroup className="mb-4">
            <Label for="docenteSelect">Seleccionar Docente</Label>
            <Input
              id="docenteSelect"
              type="select"
              value={docenteSeleccionado}
              onChange={handleDocenteChange}
            >
              <option value="">Seleccione un docente</option>
              {docentes?.map(docente => (
                <option key={docente.docenteId} value={docente.docenteId}>
                  {docente.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>
        )}

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner color="primary">Cargando...</Spinner>
          </div>
        ) : !docenteId ? (
          <div className="text-center my-5">
            <p className="text-muted">
              {modoAdmin ? "Seleccione un docente para ver su horario." : "Cargando..."}
            </p>
          </div>
        ) : (
          <>
            <div className="horario-container">
              <table className="horario-grid">
                <thead>
                  <tr>
                    <th className="franja-header">Franja</th>
                    {DIAS.map(dia => (
                      <th key={dia.id}>{dia.nombre}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FRANJAS.map(franja => (
                    <tr key={`${franja.inicio}_${franja.fin}`}>
                      <td className="franja-cell">{franja.inicio} - {franja.fin}</td>
                      {DIAS.map(dia => {
                        const key = `${dia.id}_${franja.inicio}_${franja.fin}`;
                        const isDisponible = grid[key] || false;
                        return (
                          <td
                            key={key}
                            className={isDisponible ? "disponible" : "no-disponible"}
                            onClick={() => toggleCelda(key)}
                          >
                            {isDisponible ? "✓" : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="horario-legend">
              <div className="legend-item">
                <div className="legend-color disponible"></div>
                <span>Disponible</span>
              </div>
              <div className="legend-item">
                <div className="legend-color no-disponible"></div>
                <span>No Disponible</span>
              </div>
            </div>

            {!modoAdmin && (
              <div className="text-center mt-4">
                <Button
                  color="primary"
                  onClick={handleGuardar}
                  disabled={guardando}
                >
                  {guardando ? <Spinner size="sm">Guardando...</Spinner> : "Guardar Mi Disponibilidad"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
