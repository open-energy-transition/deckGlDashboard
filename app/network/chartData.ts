export function getBusChartsData(selectedCountry: string) {
  fetch(`/api/buseschart/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export function getCountryCapacityChartsData(selectedCountry: string) {
  fetch(`/api/countrycapacity/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export function getCountryGenerationChartsData(selectedCountry: string) {
  fetch(`/api/countrychart/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export function getCountryDemandChartsData(selectedCountry: string) {
  fetch(`/api/countrychartdemand/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export function getCountryGenerationMixChartsData(selectedCountry: string) {
  fetch(`/api/generation_mix/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export function getBusGenerationChartsData(selectedCountry: string) {
  fetch(`/api/generationbuschart/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export function getInstalledCapacitiesChartsData(selectedCountry: string) {
  fetch(`/api/installed_capacities/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export function getTotalDemandChartsData(selectedCountry: string) {
  fetch(`/api/total_demand/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}
