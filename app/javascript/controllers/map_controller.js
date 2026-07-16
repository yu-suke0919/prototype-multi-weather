import { Controller } from "@hotwired/stimulus"
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
  }

  disconnect() {
    this.map?.remove()
  }
}