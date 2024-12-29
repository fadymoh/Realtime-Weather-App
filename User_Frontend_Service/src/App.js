import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import "./styles.css";
import ShowWeather from "./Components/ShowWeather"
import Forecast from "./Components/Forecast"

export default function App() {

    return (
        <div>
            <Header />

            <ShowWeather/>
            <Forecast/>
        </div>
    );
}