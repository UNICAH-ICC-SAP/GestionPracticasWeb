import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "@store/index";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from "@store/slices/docentes";
import { Selector as SelectorUser } from "@store/slices/users";
import { getData, Post } from "@utilities/Utilities";
import { Container, Button, Spinner, InputGroup } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./CalendarioGrid.css";

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
  { id: 1, nombre: "Lunes", short: "LUN" },
  { id: 2, nombre: "Martes", short: "MAR" },
  { id: 3, nombre: "Miércoles", short: "MIE" },
  { id: 4, nombre: "Jueves", short: "JUE" },
  { id: 5, nombre: "Viernes", short: "VIE" },
  { id: 6, nombre: "Sábado", short: "SAB" },
];

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getDiasDelMes(anio: number, mes: number): number[] {
  const dias: number[] = [];
  const fecha = new Date(anio, mes, 1);
  while (fecha.getMonth() === mes) {
    dias.push(fecha.getDate());
    fecha.setDate(fecha.getDate() + 1);
  }
  return dias;
}

function getPrimerDiaSemana(anio: number, mes: number): number {
  return new Date(anio, mes, 1).getDay();
}

function getDiaSemana(anio: number, mes: number, dia: number): number {
  const d = new Date(anio, mes, dia).getDay();
  return d === 0 ? 7 : d;
}

function formatoFecha(anio: number, mes: number, dia: number): string {
  const m = String(mes + 1).padStart(2, "0");
  const d = String(dia).padStart(2, "0");
  return `${anio}-${m}-${d}`;
}

interface HorarioGridProps {
  modoAdmin?: boolean;
  tipo?: string;
}

export default function HorarioGrid({ modoAdmin = false, tipo = "clase" }: HorarioGridProps) {
  const dispatch = useDispatch();
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [grid, setGrid] = useState<Record<string, boolean>>({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const docentes = useSelector(SelectorDocentes.getDocentes);
  const userData = useSelector(SelectorUser.getUser);

  const docenteId = modoAdmin ? docenteSeleccionado : userData?.userId;

  const anioActual = new Date().getFullYear();

  useEffect(() => {
    if (modoAdmin && docentes.length === 0) {
      dispatch(FetcherDocentes.getDocentes({ url: "/docente/getDocentes" }));
    }
  }, [dispatch, docentes, modoAdmin]);

  useEffect(() => {
    if (!docenteId) return;

    setIsLoading(true);
    getData({ url: `/horario/get?docenteId=${docenteId}&tipo=${tipo}&_t=${Date.now()}` })
      .then(response => {
        const newGrid: Record<string, boolean> = {};

        if (Array.isArray(response.data)) {
          response.data.forEach((disp: { fecha?: string; dia?: number; franja_inicio: string; franja_fin: string }) => {
            const inicio = disp.franja_inicio?.substring(0, 5);
            const fin = disp.franja_fin?.substring(0, 5);
            const franja = FRANJAS.find(f => f.inicio === inicio && f.fin === fin);
            if (franja && disp.fecha) {
              newGrid[`${disp.fecha}_${franja.inicio}_${franja.fin}`] = true;
            }
          });
        }

        setGrid(newGrid);
      })
      .finally(() => setIsLoading(false));
  }, [docenteId, tipo]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fechasConDisponibilidad = useMemo(() => {
    const conjunto = new Set<string>();
    Object.keys(grid).forEach(key => {
      if (grid[key]) {
        const fecha = key.split("_")[0];
        conjunto.add(fecha);
      }
    });
    return conjunto;
  }, [grid]);

  const docentesFiltrados = useMemo(() => {
    if (!busqueda) return docentes || [];
    const termino = busqueda.toLowerCase();
    return (docentes || []).filter(d =>
      d.nombre.toLowerCase().includes(termino) || d.docenteId.includes(termino)
    );
  }, [busqueda, docentes]);

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
        fecha: partes[0],
        dia: new Date(partes[0]).getDay(),
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

      if (Array.isArray(response.data)) {
        response.data.forEach((disp: { fecha?: string; dia?: number; franja_inicio: string; franja_fin: string }) => {
          const inicio = disp.franja_inicio?.substring(0, 5);
          const fin = disp.franja_fin?.substring(0, 5);
          const franja = FRANJAS.find(f => f.inicio === inicio && f.fin === fin);
          if (franja && disp.fecha) {
            newGrid[`${disp.fecha}_${franja.inicio}_${franja.fin}`] = true;
          }
        });
      }

      setGrid(newGrid);
      Swal.fire("Éxito", "Tu calendario de disponibilidad ha sido guardado correctamente.", "success");
    } catch {
      Swal.fire("Error", "Hubo un error al guardar.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleSeleccionarFecha = (anio: number, mes: number, dia: number) => {
    const diaSemana = getDiaSemana(anio, mes, dia);
    if (diaSemana >= 1 && diaSemana <= 6) {
      setFechaSeleccionada(formatoFecha(anio, mes, dia));
    }
  };

  const handleVolverAlCalendario = () => {
    setFechaSeleccionada(null);
  };

  const handleSeleccionarDocente = (docenteId: string, nombre: string) => {
    setDocenteSeleccionado(docenteId);
    setBusqueda(nombre);
    setMostrarDropdown(false);
  };

  const tituloPorTipo = tipo === "clase" ? "Calendario de Clase" : "Calendario de Defensa";

  const parseFecha = (fechaStr: string) => {
    const [anio, mes, dia] = fechaStr.split("-").map(Number);
    return { anio, mes: mes - 1, dia };
  };

  const renderCalendario = () => {
    return (
      <div className="calendario-anual">
        {MESES.map((mes, mesIndex) => {
          const dias = getDiasDelMes(anioActual, mesIndex);
          const primerDia = getPrimerDiaSemana(anioActual, mesIndex);
          const celdasVacias = primerDia;

          return (
            <div key={mesIndex} className="calendario-mes">
              <div className="calendario-mes-titulo">{mes}</div>
              <div className="calendario-dias-semana">
                {DIAS_CORTOS.map(d => (
                  <div key={d} className="calendario-dia-header">{d}</div>
                ))}
              </div>
              <div className="calendario-dias-grid">
                {Array.from({ length: celdasVacias }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendario-dia vacia" />
                ))}
                {dias.map(dia => {
                  const diaSemana = getDiaSemana(anioActual, mesIndex, dia);
                  const esDianDeSemana = diaSemana >= 1 && diaSemana <= 6;
                  const fechaStr = formatoFecha(anioActual, mesIndex, dia);
                  const tieneDisponibilidad = fechasConDisponibilidad.has(fechaStr);
                  const esSeleccionado = fechaSeleccionada === fechaStr;

                  return (
                    <div
                      key={dia}
                      className={`calendario-dia ${!esDianDeSemana ? "domingo" : ""} ${tieneDisponibilidad ? "con-disponibilidad" : ""} ${esSeleccionado ? "seleccionado" : ""}`}
                      onClick={() => esDianDeSemana && handleSeleccionarFecha(anioActual, mesIndex, dia)}
                    >
                      {dia}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderVistaSemanal = () => {
    const fechaParsed = fechaSeleccionada ? parseFecha(fechaSeleccionada) : null;
    const diaSemana = fechaParsed ? getDiaSemana(fechaParsed.anio, fechaParsed.mes, fechaParsed.dia) : null;
    const nombreDia = diaSemana ? DIAS[diaSemana - 1]?.nombre : "";

    return (
      <div className="vista-semanal">
        <div className="vista-semanal-header">
          <button className="btn-volver" onClick={handleVolverAlCalendario}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al Calendario
          </button>
          {fechaParsed && (
            <h5 className="dia-seleccionado-titulo">
              {nombreDia} {fechaParsed.dia} de {MESES[fechaParsed.mes]} {fechaParsed.anio}
            </h5>
          )}
        </div>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner color="primary">Cargando...</Spinner>
          </div>
        ) : (
          <>
            <div className="horario-container">
              <table className="horario-grid">
                <thead>
                  <tr>
                    <th className="franja-header">Franja</th>
                    <th>{nombreDia}</th>
                  </tr>
                </thead>
                <tbody>
                  {FRANJAS.map(franja => {
                    const key = `${fechaSeleccionada}_${franja.inicio}_${franja.fin}`;
                    const isDisponible = grid[key] || false;
                    return (
                      <tr key={`${franja.inicio}_${franja.fin}`}>
                        <td className="franja-cell">{franja.inicio} - {franja.fin}</td>
                        <td
                          className={isDisponible ? "disponible" : "no-disponible"}
                          onClick={() => toggleCelda(key)}
                        >
                          {isDisponible ? "✓" : ""}
                        </td>
                      </tr>
                    );
                  })}
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
    );
  };

  return (
    <Container fluid>
      <div className="horario-grid-wrapper">
        <div className="horario-grid-header">
          <h4>{modoAdmin ? `${tituloPorTipo} del Docente` : `Mi ${tituloPorTipo}`}</h4>
        </div>

        {modoAdmin && (
          <div className="buscador-docente-wrapper" ref={dropdownRef}>
            <InputGroup className="buscador-docente">
              <div className="buscador-docente-input-wrapper">
                <FontAwesomeIcon icon={faSearch} className="buscador-icono" />
                <input
                  type="text"
                  className="buscador-docente-input"
                  placeholder="Buscar docente..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setMostrarDropdown(true);
                    if (!e.target.value) {
                      setDocenteSeleccionado("");
                    }
                  }}
                  onFocus={() => setMostrarDropdown(true)}
                />
              </div>
              {mostrarDropdown && docentesFiltrados.length > 0 && (
                <div className="buscador-dropdown">
                  {docentesFiltrados.map(docente => (
                    <div
                      key={docente.docenteId}
                      className={`buscador-dropdown-item ${docente.docenteId === docenteSeleccionado ? "seleccionado" : ""}`}
                      onClick={() => handleSeleccionarDocente(docente.docenteId, docente.nombre)}
                    >
                      <span className="buscador-dropdown-id">{docente.docenteId}</span>
                      <span className="buscador-dropdown-nombre">{docente.nombre}</span>
                    </div>
                  ))}
                </div>
              )}
            </InputGroup>
          </div>
        )}

        {!docenteId && modoAdmin ? (
          <div className="text-center my-5">
            <p className="text-muted">Busque y seleccione un docente para ver su calendario.</p>
          </div>
        ) : fechaSeleccionada ? (
          renderVistaSemanal()
        ) : (
          <>
            {isLoading ? (
              <div className="text-center my-5">
                <Spinner color="primary">Cargando...</Spinner>
              </div>
            ) : (
              <>
                <div className="calendario-semana-legend">
                  <span className="text-muted">Días con disponibilidad resaltados en verde. Haga clic en un día para ver o editar su disponibilidad.</span>
                </div>
                {renderCalendario()}
                <div className="horario-legend mt-3">
                  <div className="legend-item">
                    <div className="legend-color disponible"></div>
                    <span>Con disponibilidad</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color seleccionado-legend"></div>
                    <span>Seleccionado</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
