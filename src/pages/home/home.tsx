import React from 'react';
import { ButtonHome } from './config';
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './home.css';

export const Home: React.FC = () => {
  return (
    <>
      <div className="fondo">
        <div className="container mt-5">
          <div className="row text-center">
            {ButtonHome.map((botones, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <Link to={botones.path} className="btn btn-dark w-75">
                  {botones.name}{" "}
                  <i className={`bi ${getIconClass(botones.name)} ms-2 text-white`}></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const getIconClass = (name: string) => {
  switch (name) {
    case "DOCENTES":
      return "bi bi-person-video3";
    case "ALUMNOS":
      return "bi bi-person-fill";
    case "CARGAS":
      return "bi-file-text";
    case "TERNAS":
      return "bi-mortarboard";
    case "PÉNSUMS":
      return "bi bi-ui-checks";
    default:
      return "";
  }
};