import React from "react"
import "./EventView.css"
import { useLocation } from "react-router"

const EventView = () =>
{
  const localization=useLocation()  
  const {image,title,date,location,descripcion} = localization.state || {}
  return (
    <div>
      <div className="event-info-container">
        <div className="imagenes">
         <img src={image} alt="" width={"400px"} height={"400px"} />
         </div>
         <div className="info">
         <h2>{title}</h2>
         <h3>{location}</h3>
         <p>{date}</p>
         <div className="exp">
         <button>Compartir</button>
          <div className="puntuacion">
            <p>☆</p>
            <p>☆</p>
            <p>☆</p>
            <p>☆</p>
            <p>☆</p>
          </div>
          </div>
         </div>
      </div>
      <div className="mapa-desc">
        <div className="maps">
          *
        </div>
        <div className="desc">
         <h2>Descripción</h2> 
        <p>{descripcion}</p>
        </div>
      </div>
      
    </div>
      
  )
}

export default EventView