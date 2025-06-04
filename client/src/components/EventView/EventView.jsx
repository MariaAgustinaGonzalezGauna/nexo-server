import React from "react"
import "./EventView.css"
import { useLocation } from "react-router"

const EventView = () =>
{
  const localization=useLocation()  
  const {image,title,date,location} = localization.state || {}
  return (
    <div>
      <div className="event-info-container">
        <div className="imagenes">
         <img src={image} alt="" width={"300px"} height={"300px"} />
         </div>
         <div className="info">
         <h2>{title}</h2>
         <h3>{location}</h3>
         <p>{date}</p>
         </div>
      </div>
      
    </div>
      
  )
}

export default EventView