import { Controller } from "@hotwired/stimulus"
import { MUNI_ARRAY } from "municipalities"
import * as L from "leaflet"

export default class extends Controller {
  static values = {
    latitude: Number,
    longitude: Number,
    zoom: {
      type: Number,
      default: 13
    }
  }

  connect() {
    const position = [
      this.latitudeValue,
      this.longitudeValue
    ]

    this.map = L.map(this.element).setView(
      position,
      this.zoomValue
    )

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    ).addTo(this.map)

    L.marker(position)
      .addTo(this.map)
      .bindPopup("東京駅")

    var popup = L.popup();

    var lat = 0;
    var lng = 0;
    async function onMapClick(e){
      document.getElementById('idoattitude').style.color = "silver"
      document.getElementById('keidoattitude').style.color = "silver"
      document.getElementById('addressattitude').style.color = "silver"
      for(let i = 0;i < 12;i++){
          document.getElementById('time-'+i).style.color = "silver"
          document.getElementById('weather-'+i).style.color = "silver"
        }
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(e.target);
      document.getElementById('idoattitude').textContent = e.latlng.lat.toFixed(6)
      document.getElementById('idoattitude').style.color = "black"
      document.getElementById('keidoattitude').textContent = e.latlng.lng.toFixed(6)
      document.getElementById('keidoattitude').style.color = "black"
      try{
        var url = `https://api.open-meteo.com/v1/forecast?latitude=${e.latlng.lat}&longitude=${e.latlng.lng}&hourly=precipitation_probability&timezone=Asia%2FTokyo`;
        var res = await fetch(url);
        var data = await res.json();
        console.log(data);
        let d = new Date();
        let currentHour = d.getHours();
        for(let i = 0;i < 12;i++){
          document.getElementById('time-'+i).textContent = i+currentHour + '時'
          document.getElementById('time-'+i).style.color = "black"
          document.getElementById('weather-'+i).textContent = data.hourly.precipitation_probability[i+currentHour] + '%';
          document.getElementById('weather-'+i).style.color = "black"
        }
      }
      catch(e){}
      try{
        var url = `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${e.latlng.lat}&lon=${e.latlng.lng}`;
        var res = await fetch(url);
        var data = await res.json();
        let muniArray = MUNI_ARRAY[data.results.muniCd].split(',')
        let address = muniArray[1]+muniArray[3]+data.results.lv01Nm
        document.getElementById('addressattitude').textContent = address;
        document.getElementById('addressattitude').style.color = "black"

      }
      catch(e){}
    }
    this.map.on('click', onMapClick);
  }

  disconnect() {
    this.map?.remove()
  }
}