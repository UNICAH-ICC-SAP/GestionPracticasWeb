import React, { useState } from 'react';
import { useDispatch, useSelector } from "@store/index";
import { Type as PeriodoType } from '@store/slices/periodo/_namespace';
import { Fetcher as FetcherPeriodo } from '@store/slices/periodo';
import Selector from '@store/slices/periodo/_selectors';
import './NuevaCarga.css';
import { TypeUtilities } from '../../../utilities/TypeUtilities';
import Swal from 'sweetalert2';

const NuevaCarga = () => {
    const dispatch = useDispatch();
    const { error } = useSelector(Selector);

    const [state, setState] = useState<PeriodoType.PeriodoInfo>({
        fecha_inicio: '',
        fecha_final: '',
        id_periodo: ''
    });

    const formatDate = (date: string) => {
        const parsedDate = new Date(date);
        return parsedDate.toISOString().split('T')[0];
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: name.includes('fecha') ? formatDate(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const utilities: TypeUtilities = {
            url: '/periodo/insert',
            data: state,
        };

        dispatch(FetcherPeriodo.insertNuevaCarga(utilities))

        Swal.fire({
            title: "¡Éxito!",
            text: "Periodo insertado con éxito.",
            icon: "success",
        });

    };


    return (
        <div className="nueva-carga">
            <h2>Crear Nuevo Periodo</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Fecha de Inicio</label>
                    <input
                        className="custom-input"
                        type="date"
                        name="fecha_inicio"
                        value={state.fecha_inicio}
                        onChange={handleChange}
                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                        required
                    />
                </div>
                <div>
                    <label>Fecha Final</label>
                    <input
                        className="custom-input"
                        type="date"
                        name="fecha_final"
                        value={state.fecha_final}
                        onChange={handleChange}
                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                        required
                    />
                </div>
                <div>
                    <label>Periodo</label>
                    <select
                        className="custom-input"
                        name="id_periodo"
                        value={state.id_periodo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un periodo</option>
                        <option value="I">Periodo I</option>
                        <option value="II">Periodo II</option>
                        <option value="III">Periodo III</option>
                    </select>
                </div>
                <button type="submit">Crear Periodo</button>
            </form>

            {error?.message && <p className="error">{error.message}</p>}
        </div>
    );
};

export default NuevaCarga;
