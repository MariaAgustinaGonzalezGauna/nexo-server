import React from "react"
import "./EventView.css"
import imageUrl from "../EventPage/EventPage"
import { useLocation } from "react-router"
import ShareButton from "../ShareButton/shareButton"
import StarRate from "../Stars/starRate"
import { FaStar } from 'react-icons/fa'
// 
const link = window.location.href
const EventView = () =>
{//crear estado de evento
  //traer evento desde backend
    //setear estado de evento
  const myStyle={
    backgroundImage:`url({$image})`,
  };    
  const localization=useLocation()  
  const {image,title,date,location,descripcion} = localization.state || {}
  return (
    <div className="fondo" style={{backgroundImage: `url(${image})`}}>
      <div className="contenedor">
      <div className="event-info-container">
        <div className="imagenes">
         <img src={image} alt="" width={"350px"} height={"350px"} />
         </div>
         <div className="info">
         <h2>{title}</h2>
         <h3>{location}</h3>
         <p>{date}</p>
         <div className="exp">
         <ShareButton link={link} />
          <div className="puntuacion">
            <StarRate/>
          </div>
          </div>
         </div>
      </div>
      <div className="mapa-desc">
        <div className="maps">
        <p>MAPA</p>
        </div>
        <div className="desc">
         <h2>Descripción</h2> 
        <p>{descripcion}</p>
        </div>
      </div>
      </div>
    </div>
      
  )
}

export default EventView