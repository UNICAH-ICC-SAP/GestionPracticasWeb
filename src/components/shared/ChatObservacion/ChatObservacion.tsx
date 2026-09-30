import React, { useEffect, useRef, useCallback, useState } from "react";
import { Input, Button, Spinner } from "reactstrap";
import { getData, Post } from "@utilities/Utilities";
import Swal from "sweetalert2";

type Comentario = {
    comentarioId?: number;
    userId: string;
    autor: string;
    mensaje: string;
    createdAt?: string;
}

const DIAS_VISIBILIDAD = 15;

function esReciente(fecha?: string): boolean {
    if (!fecha) return true;
    const ahora = new Date();
    const fechaMsg = new Date(fecha);
    const diffMs = ahora.getTime() - fechaMsg.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias <= DIAS_VISIBILIDAD;
}

interface ChatObservacionProps {
    idDetalle: number;
    currentUserId: string;
}

export default function ChatObservacion({ idDetalle, currentUserId }: ChatObservacionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [texto, setTexto] = useState('');
    const [enviando, setEnviando] = useState(false);

    const cargarComentarios = useCallback(async () => {
        try {
            const response = await getData({
                url: `/comentarios/findBy?modulo=CARGA_ASIGNADA&referenciaId=${idDetalle}`
            });
            if (Array.isArray(response.data)) {
                const filtrados = (response.data as Comentario[]).filter(c => esReciente(c.createdAt));
                setComentarios(filtrados);
            }
        } catch { /* ignore */ }
    }, [idDetalle]);

    useEffect(() => {
        cargarComentarios();
    }, [cargarComentarios]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comentarios]);

    const handleEnviar = async () => {
        const msg = texto.trim();
        if (!msg) return;

        setEnviando(true);
        try {
            const response = await Post({
                url: "/comentarios/insert",
                data: {
                    modulo: "CARGA_ASIGNADA",
                    referenciaId: idDetalle,
                    userId: currentUserId,
                    mensaje: msg
                }
            });
            if (response.error.code === 0) {
                setTexto('');
                cargarComentarios();
            } else {
                Swal.fire("Error", "No se pudo enviar el mensaje.", "error");
            }
        } catch {
            Swal.fire("Error", "No se pudo enviar el mensaje.", "error");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div>
            <div
                ref={scrollRef}
                className="p-1 border rounded bg-light mb-2"
                style={{ height: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}
            >
                {comentarios.length === 0 ? (
                    <p className="text-muted small text-center mb-0 fst-italic mt-auto">Sin observaciones</p>
                ) : (
                    comentarios.map((com) => {
                        const esMio = com.userId === currentUserId;
                        return (
                            <div
                                key={com.comentarioId}
                                style={{
                                    display: 'flex',
                                    justifyContent: esMio ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '75%',
                                        padding: '4px 8px',
                                        borderRadius: '8px',
                                        backgroundColor: esMio ? '#d4edda' : '#ffffff',
                                        border: esMio ? '1px solid #c3e6cb' : '1px solid #dee2e6',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                    }}
                                >
                                    <p className="mb-0" style={{ wordBreak: 'break-word', fontSize: '0.8rem' }}>{com.mensaje}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="d-flex gap-2">
                <Input
                    bsSize="sm"
                    type="text"
                    placeholder="Escriba un mensaje..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleEnviar();
                        }
                    }}
                />
                <Button
                    color="primary"
                    size="sm"
                    disabled={enviando || !texto.trim()}
                    onClick={handleEnviar}
                >
                    {enviando ? <Spinner size="sm" /> : "Enviar"}
                </Button>
            </div>
        </div>
    );
}
