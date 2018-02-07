class ExampleGoogleMap {
  constructor(container, fitToMarkers) {
    this.container = container;
    this.map = null;
    this.oms = null;
    this.infoBox = $('<div class="example-map-info-box" style="display: none;"></div>');
    this.markers = [];
    this.selectedMarker = null;
    this.fitToMarkers = !!fitToMarkers;
    if (this.fitToMarkers) {
      this.mapBounds = new google.maps.LatLngBounds();
      this.mapBounds.extend(ExampleGoogleMap.getMapCenter());
    }
    this.markerZIndex = 277000001;
  }

  render() {
    let mapOptions = {
      zoom: 11,
      center: ExampleGoogleMap.getMapCenter(),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      panControl: false,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }
    };
    this.map = new google.maps.Map(this.container[0], mapOptions);

    this.oms = new OverlappingMarkerSpiderfier(this.map);
    this.oms.addListener('click', (marker) => this.showMapInfoBox(marker));

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.infoBox[0]);

  }

  addMarker(info) {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(info['lat'], info['lng']),
      title: info['title'],
      description: info["description"],
      map: this.map,
      zIndex: this.markerZIndex
    });
    this.markers.push(marker);
    this.oms.addMarker(marker);
    if (this.fitToMarkers) {
      this.mapBounds.extend(marker.getPosition());
    }
  }

  showMapInfoBox(marker) {
    this.clearSelectedMarker();

    this.infoBox.html(`
    <section>
      <h4 class="pull-left">${marker.title}</h4>
      <button class="pull-right" title="Close this information box" aria-hidden="true"><span class="glyphicon glyphicon-remove"></span></button>      
      <div>${marker.description}</div>
    </section>`);

    this.infoBox.show().find('button').on('click', () => {
      this.clearSelectedMarker();
    });

    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
    }, 750);
    marker.setZIndex(this.markerZIndex + 1);

    this.selectedMarker = marker;
  }

  clearSelectedMarker() {
    this.infoBox.hide().find('section').remove();
    if (this.selectedMarker) {
      this.selectedMarker.setZIndex(this.markerZIndex);
      this.selectedMarker = null;
    }
  }

  static getMapCenter() {
    return new google.maps.LatLng(43.721459,-79.373903);
  }
}
